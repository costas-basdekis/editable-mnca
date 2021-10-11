const LOCAL_STORAGE_KEY = "editablMncaPresets";

function getLocalPresets() {
  let parsedLocalPresets;
  try {
    const localPresetsJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!localPresetsJson) {
      return [];
    }
    parsedLocalPresets = JSON.parse(localPresetsJson);
    if (!parsedLocalPresets) {
      return [];
    }
  } catch (e) {
    return [];
  }

  parsedLocalPresets.forEach(addLocalPresetGetConfiguration);

  return parsedLocalPresets;
}

const localPresets = getLocalPresets();

function saveLocalPresets(presets) {
  const localPresetsWithoutFunction = presets
    .filter(preset => preset.isEditable)
    .map(preset => {
      const saveablePreset = {...preset};
      delete saveablePreset.getConfiguration;
      return saveablePreset;
    });
  try {
    localStorage.setItem(
      LOCAL_STORAGE_KEY, 
      JSON.stringify(localPresetsWithoutFunction),
    );
  } catch (e) {
    console.error("Could not save local presets", e);
  }
}

function createLocalPresetCopy(presetsByName, original) {
  function generateUniquePresetLabel(originalLabel) {
    let label = generateNewPresetLabel(originalLabel);
    const labels = new Set(Object.values(presetsByName).map(preset => preset.label));
    if (!labels.has(label)) {
      return label;
    }
    for (let counter = 1 ; ; counter++) {
      const copyLabel = `${label} (${counter})`;
      if (!labels.has(copyLabel)) {
        label = copyLabel;
        break;
      }
    }

    return label;
  }

  function generateNewPresetLabel(originalLabel) {
    return `Copy of ${originalLabel}`;
  }

  function generateUniquePresetName() {
    let name;
    do {
      name = generateRandomPresetName();
    } while (name in presetsByName)

    return name;
  }

  function generateRandomPresetName() {
    return (Math.random() + 1).toString(36).substring(2);
  }

  const preset = {
    name: generateUniquePresetName(),
    label: generateUniquePresetLabel(original.label),
    isEditable: true,
    type: original.type,
    neighbourhoodType: original.neighbourhoodType,
    configuration: original.getConfiguration(),
  };
  addLocalPresetGetConfiguration(preset);

  return preset;
}

function addLocalPresetGetConfiguration(preset) {
  const configurationJson = JSON.stringify(preset.configuration);
  preset.getConfiguration = () => {
    return JSON.parse(configurationJson);
  };
}

export {
  localPresets, createLocalPresetCopy,
  addLocalPresetGetConfiguration, saveLocalPresets,
};
