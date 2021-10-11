#version 300 es

precision mediump float;

out vec4 fragColor;

uniform sampler2D u_texture0;
uniform int iFrame;
uniform float iTime;
uniform vec4 iDate;
uniform vec2 iResolution;

float remainder(float value) {
  return value - floor(value);
}

float quantize(float value, float count) {
  return mod(value, count) / count;
}

float get_xc(vec2 position, float xmod) {
  return clamp((
    sqrt(quantize(dot(position, vec2(position.y, 1)), xmod))
    + quantize(dot(position, position), xmod)
  ) * 0.5, 0.0, 1.0); 
}

float shuffle(vec2 position, float xmod, float val) {
  return remainder(val * mod(dot(position, vec2(1, position.x)), xmod));
}

float get_xcn(vec2 position, float xm0, float xm1) {
	float xc = get_xc(position, xm0);
  return shuffle(position, xm1, xc);
}

float get_lump(vec2 position, float radius, float xm0, float xm1) {
	float totalCount = 0.0;
	float xcn = 0.0;
	for (float i = -radius ; i <= radius ; i += 1.0) {
    for (float j = -radius ; j <= radius ; j += 1.0) {
      vec2 ij = vec2(i, j);
			if (length(ij) <= radius) {
				xcn += get_xcn(position + ij, xm0, xm1);
        totalCount += 1.0;
      }
    }
  }
  float xcnf = xcn / totalCount;
  if (xcnf == 0.) {
    return 0.;
  }
  float xcnfSquaredQuadrupled = xcnf * xcnf * 4.;
  float xcaf = xcnf;
	for (float i = 0.0 ; i <= radius ; i += 1.0) {
    xcaf = clamp(xcnfSquaredQuadrupled * xcaf, 0.0, 1.0);
  }
  return xcaf;
}

struct Coeffs {
  float sign, radius;
  float xm0Base, xm0Mod;
  float xm1Base, xm1Mod;
};
const Coeffs[] coeffsList = Coeffs[](
  Coeffs( 1.,  2.0, 19.0, 17.0, 23.0, 43.0),
  Coeffs( 1., 14.0, 13.0, 29.0, 17.0, 31.0),
  Coeffs(-1.,  6.0, 13.0, 11.0, 51.0, 37.0)
);

float reseedChannel(float seed) {
  vec2 position = gl_FragCoord.xy;
  float datedSeed = iDate.z + seed;

  float lump = 0.;
  for (int i = 0 ; i < coeffsList.length() ; i++) {
    Coeffs coeffs = coeffsList[i];
  	lump += coeffs.sign * get_lump(
      position, 
      coeffs.radius, 
      coeffs.xm0Base + mod(datedSeed, coeffs.xm0Mod), 
      coeffs.xm1Base + mod(datedSeed, coeffs.xm1Mod)
    );
  }
  return clamp(lump, 0.0, 1.0);
}

vec4 reseed() {
  return vec4(reseedChannel(0.), reseedChannel(1.), reseedChannel(2.), 1.);
}

uniform float u_maxRingRadius;

{{# if (eq neighbourhoodType "round") }}
#define getDistance(ij) round(length(ij))
{{else}}
{{# if (eq neighbourhoodType "square") }}
#define getDistance(ij) round(max(abs(ij.x), abs(ij.y)))
{{else}}
#define getDistance(ij) unknownNeighbourType{{neighbourhoodType}}
{{/if}}
{{/if}}

vec4 getRingCount(vec2 ring, vec2 uv) {
  float minRadius = ring.x, maxRadius = ring.y;

  vec3 matchCount = vec3(0.0);
  float totalCount = 0.0;
  for (float i = -maxRadius ; i <= maxRadius ; i += 1.0) {
    for (float j = -maxRadius ; j <= maxRadius ; j += 1.0) {
      vec2 ij = vec2(i, j);
      // Why do we use round here? What does it offer?
      float distance = getDistance(ij);
      if(!(minRadius < distance && distance <= maxRadius)) {
        continue;
      }

      vec3 value = texture(u_texture0, mod(uv + ij / iResolution, vec2(1.))).xyz;
      matchCount += step(0.5, value);
      totalCount += 1.;
    }
  }

  return vec4(matchCount, totalCount); 
}

uniform vec3 u_neighbourhoodRings[{{neighbourhoodRingCount}}];

const int MAX_RING_RADIUS = {{maxRingRadius}};
vec4 ringCounts[MAX_RING_RADIUS + 1];

vec4 neighbourhoodResults[{{neighbourhoodCount}}];
vec3 neighbourhoodRatios[{{neighbourhoodCount}}];
float neighbourhoodCount;

const int RULE_COUNT = {{ruleCount}};
uniform vec4 u_rules[{{ruleCount}}];

void prepareNeighboudRatiosNaive(vec2 uv) {
  for (int i = 0 ; i < neighbourhoodResults.length() ; i++) {
    neighbourhoodResults[i] = vec4(0.);
  }
  for (int i = 0 ; i < u_neighbourhoodRings.length() ; i++) {
    vec3 neighbourhoodRing = u_neighbourhoodRings[i];
    neighbourhoodResults[int(neighbourhoodRing.z)] += 
      getRingCount(neighbourhoodRing.xy, uv);
  }
  neighbourhoodCount = 0.;
  for (int i = 0 ; i < neighbourhoodResults.length() ; i++) {
    neighbourhoodCount += neighbourhoodResults[i].a;
    neighbourhoodRatios[i] = neighbourhoodResults[i].rgb / neighbourhoodResults[i].a;
  }
}

void fillRingCounts(vec2 uv) {
  for (int i = -MAX_RING_RADIUS ; i <= MAX_RING_RADIUS ; i += 1) {
    for (int j = -MAX_RING_RADIUS ; j <= MAX_RING_RADIUS ; j += 1) {
      vec2 ij = vec2(i, j);
      // Why do we use round here? What does it offer?
      int distance = int(getDistance(ij));
      if (abs(distance) > MAX_RING_RADIUS) {
        continue;
      }
      vec3 value = texture(u_texture0, mod(uv + ij / iResolution, vec2(1.))).rgb;
      ringCounts[distance].rgb += step(0.5, value);
      ringCounts[distance].a += 1.;
    }
  }
}

void prepareNeighboudRatiosOptimised(vec2 uv) {
  fillRingCounts(uv);
  for (int i = 0 ; i < neighbourhoodResults.length() ; i++) {
    neighbourhoodResults[i] = vec4(0.);
  }
  for (int i = 0 ; i < u_neighbourhoodRings.length() ; i++) {
    vec3 neighbourhoodRing = u_neighbourhoodRings[i];
    vec4 counts = vec4(0.);
    for (int radius = int(neighbourhoodRing.x) + 1 ; radius <= int(neighbourhoodRing.y) ; radius++) {
      counts += ringCounts[radius];
    }
    neighbourhoodResults[int(neighbourhoodRing.z)] += counts;
  }
  neighbourhoodCount = 0.;
  for (int i = 0 ; i < neighbourhoodResults.length() ; i++) {
    neighbourhoodCount += neighbourhoodResults[i].a;
    neighbourhoodRatios[i] = neighbourhoodResults[i].rgb / neighbourhoodResults[i].a;
  }
}

#define prepareNeighboudRatios prepareNeighboudRatiosOptimised

uniform bool u_monochrome;

vec3 calculateDiscreteMnca(vec2 uv) {
  prepareNeighboudRatios(uv);
  
  vec3 res = texture(u_texture0, uv).rgb;

  for (int channel = 0 ; channel < 3 ; channel++) {
    if (u_monochrome && channel > 0) {
      break;
    }
    for (int i = 0 ; i < u_rules.length() ; i++) {
      vec4 rule = u_rules[i];
      float value = neighbourhoodRatios[int(rule.w)][channel];
      if (rule.x <= value && value <= rule.y) {
        res[channel] = rule.z;
        break;
      }
    }
  }

  if (u_monochrome) {
    res = res.rrr;
  }

  return res;
}

const float continuousAcurracy = 1.0 / 65536.0;
const float continuousDropoff = 64.0 *  16.0 * continuousAcurracy;
const float continuousResultMultiplier = 64.0 *  96.0 * continuousAcurracy;

vec3 calculateContinuousMnca(vec2 uv) {
  prepareNeighboudRatios(uv);
  
  vec3 res = texture(u_texture0, uv).rgb;

  for (int channel = 0 ; channel < 3 ; channel++) {
    if (u_monochrome && channel > 0) {
      break;
    }
    for (int i = 0 ; i < u_rules.length() ; i++) {
      vec4 rule = u_rules[i];
      float value = neighbourhoodRatios[int(rule.w)][channel];
      if (rule.x <= value && value <= rule.y) {
        res[channel] += rule.z * continuousResultMultiplier;
      }
    }
    res[channel] -= continuousDropoff;
    res[channel] = clamp(res[channel], 0., 1.);
  }

  if (u_monochrome) {
    res = res.rrr;
  }

  return res;
}

{{# if (eq type "discrete") }}
#define calculateMnca calculateDiscreteMnca
{{ else }}
{{# if (eq type "continuous") }}
#define calculateMnca calculateContinuousMnca
{{ else }}
#define calculateMnca unknownType{{type}}
{{/if}}
{{/if}}

uniform bool u_keepReseeding;

struct ReseedCheck {
  int frameRemainder;
  float minX, maxX;
  float minY, maxY;
};
const ReseedCheck[4] reseedChecks = ReseedCheck[4](
  ReseedCheck(  0, 0.0, 0.5, 0.0, 0.5),
  ReseedCheck(150, 0.5, 1.0, 0.0, 0.5),
  ReseedCheck(300, 0.0, 0.5, 0.5, 1.0),
  ReseedCheck(450, 0.5, 1.0, 0.5, 1.0)
);

bool isTimeToReseed(vec2 uv) {
  if (!u_keepReseeding) {
    return false;
  }
  int frameRemainder = iFrame % 600;
  for (int i = 0 ; i < reseedChecks.length() ; i++) {
    ReseedCheck reseedCheck = reseedChecks[i];
    if (reseedCheck.frameRemainder == frameRemainder) {
      return (
        uv.x >= reseedCheck.minX
        && uv.x < reseedCheck.maxX
        && uv.y >= reseedCheck.minY
        && uv.y < reseedCheck.maxY
        && texture(u_texture0, uv).rgb == vec3(0.)
      );
    }
  }
}

void main() {
  if (iFrame == 0) {
    fragColor = reseed();
    return;
  }

  vec2 uv = gl_FragCoord.xy / iResolution;
  bool isTimeToReseed = isTimeToReseed(uv);

  vec3 mcnaColour = calculateMnca(uv);
  fragColor = vec4(mcnaColour, 1.);

  bool isBlack = mcnaColour == vec3(0.);
  if (isTimeToReseed && isBlack) {
    fragColor = reseed();
    return;
  }
}
