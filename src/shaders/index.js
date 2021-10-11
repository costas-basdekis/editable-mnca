import Handlebars from "handlebars";
import helpers from "handlebars-helpers";
import {createSelector} from "reselect";

import vertexShaderCodeRaw from "./default.vert";
import copyTextureCodeRaw from "./copyTexture.frag";
import mncaCodeRaw from "./mnca.frag";

helpers.comparison();

function fromOctetStream(text) {
  return atob(text.split(",", 2)[1]);
}

export const vertexShaderCode = fromOctetStream(vertexShaderCodeRaw);
export const copyTextureCode = fromOctetStream(copyTextureCodeRaw);
const mncaCodeTemplate = Handlebars.compile(fromOctetStream(mncaCodeRaw));
const mncaCodeArgumentsSelector = createSelector(
  createSelector(
    (_, {neighbourhoods}) => neighbourhoods,
    neighbourhoods => {
      return Math.max(...neighbourhoods.map(
        neighbourhood => Math.max(...neighbourhood.rings.map(
          ring => ring.maxRadius))));
    },
  ),
  ({u_neighbourhoodRings}) => u_neighbourhoodRings.length,
  (_, {rules}) => rules.length,
  (_, {neighbourhoods}) => neighbourhoods.length,
  (_1, _2, {presetData: {type}}) => type,
  (_1, _2, {presetData: {neighbourhoodType}}) => neighbourhoodType,
  (maxRingRadius, neighbourhoodRingCount, ruleCount, neighbourhoodCount, type, neighbourhoodType) => {
    return {
      maxRingRadius,
      neighbourhoodCount,
      neighbourhoodRingCount: neighbourhoodRingCount,
      ruleCount,
      type,
      neighbourhoodType,
    };
  },
);
const mncaCodeSelector = createSelector(
  mncaCodeArgumentsSelector,
  mncaCodeTemplate,
);
export function getMncaCode(uniforms, configuration, settings) {
  return mncaCodeSelector(uniforms, configuration, settings);
}
