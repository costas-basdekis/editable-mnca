import React, { Component } from "react";
import { ConfigurationEditor, saveLocalPresets } from "./configuration";
import { SettingsEditor } from "./settings";
import { initialPresets } from "./configuration";
import { createSelector } from "reselect";

export default class ControlPanel extends Component {
  static getInitialSettingsAndConfiguration(defaultPreset = "original") {
    const settings = SettingsEditor
      .getDefaultSettings(defaultPreset);
    const configuration = ConfigurationEditor
      .getInitialConfiguration(settings.preset);
    return {
      settings,
      initialConfiguration: configuration,
      configuration,
    };
  }

  state = {
    presets: initialPresets, 
  };

  presetsByNameSelector = createSelector(
    ({presets}) => presets,
    presets => {
      return Object.fromEntries(presets.map(
        preset => [preset.name, preset]));
    },
  )

  get presetsByName() {
    return this.presetsByNameSelector(this.state);
  }

  render() {
    const {presetsByName} = this;
    const {presets} = this.state;
    const {
      configuration,
      initialConfiguration,
      settings,
    } = this.props;

    return (
      <div style={{ margin: "10%", height: 120, width: "80%" }} >
        <h3>Settings</h3>
        <SettingsEditor 
          presets={presets}
          presetsByName={presetsByName}
          onPresetsChange={this.onPresetsChange}
          settings={settings}
          initialConfiguration={initialConfiguration}
          configuration={configuration}
          onRestart={this.props.onRestart}
          onChange={this.props.onSetingsChange}
          onInitialConfigurationChange={this.props.onInitialConfigurationChange}
          onConfigurationChange={this.props.onConfigurationChange}
        />
        <h3>Configuration</h3>
        <ConfigurationEditor
          neighbourhoodType={settings.presetData.neighbourhoodType}
          type={settings.presetData.type}
          configuration={configuration}
          onChange={this.props.onConfigurationChange}
        />
      </div>
    );
  }

  onPresetsChange = (presets, callback) => {
    this.setState({presets}, callback);
    saveLocalPresets(presets);
  };
}
