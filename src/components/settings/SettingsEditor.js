import { Component, Fragment } from "react";
import { createSelector } from "reselect";

import { createLocalPresetCopy, addLocalPresetGetConfiguration } from "../configuration";
import { getPresetsByName, initialPresets } from "../configuration/presets";

export default class SettingsEditor extends Component {
  static getDefaultSettings(defaultPreset = "original") {
    const presetsByName = getPresetsByName(initialPresets);
    const presetData = presetsByName[defaultPreset];

    return {
      keepReseeding: true,
      preset: defaultPreset,
      presetData,
      monochrome: false,
    };
  }
  
  render() {
    const {
      presets, presetsByName,
      settings: {keepReseeding, preset, monochrome},
      initialConfiguration, configuration,
    } = this.props;

    return (
      <Fragment>
        <button onClick={this.props.onRestart}>Restart</button>
        <button onClick={this.onReset}>Reset Configuration</button>
        <a href={this.urlFragment}>Share configuration</a>
        <br/><br/>
        <label>
          Keep reseeding 
          <input 
            type={"checkbox"} 
            checked={keepReseeding} 
            onChange={this.onKeepRessedingChange} 
          />
        </label>
        <label>
          Preset: 
          <select 
            value={preset} 
            onChange={this.onPresetChange}
          >
            {presets.map(preset => (
              <option 
                key={preset.name}
                value={preset.name}
              >
                {preset.isEditable ? "[Local]" : ""} {preset.label}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={this.onSaveACopyClick}
        >
          Make a local copy
        </button>
        <button
          disabled={!presetsByName[preset].isEditable || initialConfiguration === configuration}
          title={
            !presetsByName[preset].isEditable
              ? "This preset is not editable" :
              initialConfiguration === configuration 
              ? "No changes to save" : undefined
          }
          onClick={this.onUpdatePresetClick}
        >
          Update local preset
        </button> 
        <button
          disabled={!presetsByName[preset].isEditable}
          title={
            !presetsByName[preset].isEditable
              ? "This preset is not editable" : undefined
          }
          onClick={this.onRenamePresetClick}
        >
          Rename local preset
        </button> 
        <button
          disabled={!presetsByName[preset].isEditable}
          title={
            !presetsByName[preset].isEditable
              ? "This preset is not editable " : undefined
          }
          onClick={this.onDeletePresetClick}
        >
          Delete local preset
        </button> 
        <label>
          Monochrome 
          <input 
            type={"checkbox"} 
            checked={monochrome} 
            onChange={this.onMonochromeChange} 
          />
        </label>
      </Fragment>
    );
  }

  urlFragmentSelector = createSelector(
    createSelector(
      ({configuration}) => configuration,
      configuration => {
        return btoa(JSON.stringify(configuration));
      },
    ),
    hash => {
      return `#${hash}`;
    },
  );
  
  get urlFragment() {
    return this.urlFragmentSelector(this.props);
  }

  updateSettings(newPartialSettings) {
    if (!this.props.onChange) {
      return;
    }
    this.props.onChange({
      ...this.props.settings,
      ...newPartialSettings,
    });
  }

  updateInitialConfiguration(newInitialConfiguration) {
    if (!this.props.onInitialConfigurationChange) {
      console.log("No onInitialConfigurationChange")
      return;
    }
    this.props.onInitialConfigurationChange(newInitialConfiguration);
  }

  updateConfiguration(newConfiguration) {
    if (!this.props.onConfigurationChange) {
      return;
    }
    this.props.onConfigurationChange(newConfiguration);
  }

  onReset = () => {
    this.updateConfiguration(this.props.initialConfiguration);
  };

  onKeepRessedingChange = ({target: {checked}}) => {
    this.updateSettings({keepReseeding: checked});
  }

  onPresetChange = ({target: {value}}) => {
    this.setPreset(value);
  };

  setPreset(preset) {
    const presetData = this.props.presetsByName[preset];
    const initialConfiguration = presetData.getConfiguration();
    this.updateSettings({
      preset,
      presetData,
    });
    this.updateInitialConfiguration(initialConfiguration);
    this.updateConfiguration(initialConfiguration);
  }

  onSaveACopyClick = () => {
    if (!this.props.onPresetsChange) {
      return;
    }
    const newPreset = createLocalPresetCopy(
      this.props.presetsByName, 
      this.props.presetsByName[this.props.settings.preset],
    );
    newPreset.label = prompt("Choose a name", newPreset.label);
    this.props.onPresetsChange([
      ...this.props.presets,
      newPreset,
    ], () => {
      this.setPreset(newPreset.name);
    });
  };

  onUpdatePresetClick = () => {
    const presets = this.props.presets;
    const index = presets
      .findIndex(preset => preset.name === this.props.settings.preset);
    if (index < 0) {
      console.error(`Could not find preset ${this.settings.preset}`);
      return;
    }
    const preset = presets[index];
    const configuration = this.props.configuration;
    const newPreset = {...preset, configuration};
    addLocalPresetGetConfiguration(newPreset);
    this.props.onPresetsChange([
      ...presets.slice(0, index),
      newPreset,
      ...presets.slice(index + 1),
    ]);
    this.updateInitialConfiguration(configuration);
  };

  onRenamePresetClick = () => {
    const presets = this.props.presets;
    const index = presets
      .findIndex(preset => preset.name === this.props.settings.preset);
    if (index < 0) {
      console.error(`Could not find preset ${this.settings.preset}`);
      return;
    }
    const preset = presets[index];
    const newPreset = {...preset,};
    newPreset.label = prompt("Choose a name", newPreset.label);
    this.props.onPresetsChange([
      ...presets.slice(0, index),
      newPreset,
      ...presets.slice(index + 1),
    ]);
  }

  onDeletePresetClick = () => {
    const presets = this.props.presets;
    const index = presets
      .findIndex(preset => preset.name === this.props.settings.preset);
    if (index < 0) {
      console.error(`Could not find preset ${this.settings.preset}`);
      return;
    }
    this.props.onPresetsChange([
      ...presets.slice(0, index),
      ...presets.slice(index + 1),
    ]);
    this.setPreset(presets[0].name);
  };

  onMonochromeChange = ({target: {checked}}) => {
    this.updateSettings({monochrome: checked});
  }
}
