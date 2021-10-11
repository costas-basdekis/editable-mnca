import React, { Component, Fragment } from "react";

import NeighbourhoodsEditor from "./NeighbourhoodsEditor";
import { getPresetsByName, initialPresets } from "./presets";
import RulesEditor from "./RulesEditor";

export default class ConfigurationEditor extends Component {
  static getInitialConfiguration(defaultPreset) {
    return (
      this.getConfigurationFromUrlFragment() 
      || this.getDefaultConfiguration(defaultPreset)
    );
  }

  static getDefaultConfiguration(defaultPreset = "original") {
    const presetsByName = getPresetsByName(initialPresets);
    return presetsByName[defaultPreset].getConfiguration();
  }

  static getConfigurationFromUrlFragment() {
    if (!window.location.hash) {
      return null;
    }
    let jsonConfiguration;
    try {
      jsonConfiguration = atob(window.location.hash.slice(1));
    } catch (e) {
      return null;
    }
    let configuration;
    try {
      configuration = JSON.parse(jsonConfiguration);
    } catch (e) {
      return null;
    }
    if (!configuration.neighbourhoods || !configuration.rules) {
      return null;
    }
    return configuration;
  }
  
  render() {
    const {neighbourhoodType, type, configuration: {rules, neighbourhoods}} = this.props;

    return (
      <Fragment>
        <RulesEditor 
          type={type}
          rules={rules} 
          neighbourhoods={neighbourhoods} 
          onChange={this.onRulesChange} 
        />
        <NeighbourhoodsEditor
          neighbourhoodType={neighbourhoodType}
          rules={rules} 
          neighbourhoods={neighbourhoods} 
          onChange={this.onNeighbourhoodsChange} 
        />
      </Fragment>
    );
  }

  updateConfiguration(newPartialConfiguration) {
    if (!this.props.onChange) {
      return;
    }
    this.props.onChange({
      ...this.props.configuration,
      ...newPartialConfiguration,
    });
  }

  onRulesChange = rules => {
    this.updateConfiguration({rules});
  };

  onNeighbourhoodsChange = neighbourhoods => {
    this.updateConfiguration({neighbourhoods});
  };
}
