#version 300 es

precision mediump float;

out vec4 fragColor;

uniform sampler2D u_texture0;
uniform vec2 iResolution;

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  fragColor = texture(u_texture0, uv);
}
