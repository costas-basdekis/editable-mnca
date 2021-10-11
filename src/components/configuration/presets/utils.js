function getPresetsByName(presets) {
  return Object.fromEntries(presets.map(
    preset => [preset.name, preset]));
}


export {
  getPresetsByName,
};

