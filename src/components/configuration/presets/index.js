import {defaultPresets} from "./defaultPresets";
import {
  localPresets, createLocalPresetCopy,
  addLocalPresetGetConfiguration, saveLocalPresets,
} from "./localPresets";
import {getPresetsByName} from "./utils";

const initialPresets = [
  ...defaultPresets,
  ...localPresets,
];

export {
  initialPresets, getPresetsByName, createLocalPresetCopy,
  addLocalPresetGetConfiguration, saveLocalPresets,
};
