import Handlebars from "handlebars";
import helpers from "handlebars-helpers";
import {createSelector} from "reselect";

import vertexShaderCodeRaw from "./default.vert";
import copyTextureCodeRaw from "./copyTexture.frag";
import mncaCodeTemplate from "./mnca.frag";

helpers.comparison();

function createFileLoader(streamOrPath) {
  async function getContents() {
    if (getContents.contents === null) {
      if (streamOrPath.startsWith("data:")) {
        const stream = streamOrPath;
        getContents.contents = fromOctetStream(stream);
      } else {
        const path = streamOrPath;
        const response = await fetch(path);
        getContents.contents = await response.text();
      }
    }
    return getContents.contents;
  }
  getContents.contents = null;

  return getContents;
}

function fromOctetStream(text) {
  return atob(text.split(",", 2)[1]);
}

export const getVertexShaderCode = createFileLoader(vertexShaderCodeRaw);
export const getCopyTextureCode = createFileLoader(copyTextureCodeRaw);
const getMncaCodeTemplate = createFileLoader(mncaCodeTemplate);
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
let getMncaCodeSelector = null;
export async function getGetMncaCode() {
  if (getMncaCodeSelector === null) {
    const mncaCodeTemplate = await getMncaCodeTemplate();
    const mncaCodeSelector = createSelector(
      mncaCodeArgumentsSelector,
      Handlebars.compile(mncaCodeTemplate),
    );
    getMncaCodeSelector = function getMncaCodeSelector(uniforms, configuration, settings) {
      return mncaCodeSelector(uniforms, configuration, settings);
    }
  }

  return getMncaCodeSelector;
}

