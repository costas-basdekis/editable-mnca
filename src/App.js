import "./styles.css";
import React, { Component, Fragment } from "react";
import {createSelector} from "reselect";

import Renderer from "./components/Renderer";
import {vertexShaderCode, copyTextureCode, getMncaCode} from "./shaders";
import ControlPanel from "./components/ControlPanel";
import Editorial from "./components/Editorial";
import createFunctionRef from "./components/createFunctionRef";

const mainSources = [vertexShaderCode, copyTextureCode];

class App extends Component {
  state = {
    ...ControlPanel.getInitialSettingsAndConfiguration(),
    texturesSources: [],
    percentagesActive: {
      monochrome: null,
      red: null, green: null, blue: null,
    },
  };

  restartRef = createFunctionRef();

  render() {
    const {
      settings, 
      initialConfiguration, configuration, 
      texturesSources,
      percentagesActive,
    } = this.state;

    return (
      <div>
        <Editorial />
        <Renderer 
          mainSources={mainSources}
          texturesSources={texturesSources}
          getFrameUniforms={this.getFrameUniforms} 
          restartRef={this.restartRef}
          onRender={this.onRender}
        />
        <div>
          Percentage active{" "}
          {settings.monochrome ? (
            `${percentagesActive.monochrome || "?"}%`
          ) : (
            <Fragment>
              <span style={{color: "red"}}>{percentagesActive.red || "?"}% R</span>,{" "}
              <span style={{color: "green"}}>{percentagesActive.green || "?"}% G</span>,{" "}
              <span style={{color: "blue"}}>{percentagesActive.blue || "?"}% B</span>
            </Fragment>
          )}
        </div>
        <ControlPanel 
          settings={settings}
          initialConfiguration={initialConfiguration}
          configuration={configuration}
          onRestart={this.restartRef.callIfSet}
          onSetingsChange={this.onSettingsChange} 
          onInitialConfigurationChange={this.onInitialConfigurationChange}
          onConfigurationChange={this.onConfigurationChange} 
        />
      </div>
    );
  }

  onSettingsChange = settings => {
    this.setState({settings});
  }

  onInitialConfigurationChange = initialConfiguration => {
    this.setState({initialConfiguration});
  }

  onConfigurationChange = configuration => {
    this.setState({configuration}, () => {
      this.setState({texturesSources: this.texturesSources});
    });
  }

  neighbourhoodsSelector = ({configuration: {neighbourhoods}}) => neighbourhoods;
  neibhourhoodRingsUniformSelector = createSelector(
    this.neighbourhoodsSelector, 
    neighbourhoods => {
      return neighbourhoods
        .map((neighbourhood, neighbourhoodIndex) => 
          neighbourhood.rings.map(ring => 
            [ring.minRadius, ring.maxRadius, neighbourhoodIndex]).flat())
        .flat();
    },
  );
  get neibhourhoodRingssUniform() {
    return this.neibhourhoodRingsUniformSelector(this.state);
  }

  maxRingRadiusSelector = createSelector(
    this.neighbourhoodsSelector,
    neighbourhoods => {
      return Math.max(...neighbourhoods.map(
        neighbourhood => Math.max(...neighbourhood.rings.map(
          ring => ring.maxRadius))));
    },
  );
  get maxRingRadius() {
    return this.maxRingRadiusSelector(this.state);
  }

  typeSelector = ({settings: {presetData: {type}}}) => type;
  rulesSelector = ({configuration: {rules}}) => rules;
  rulesUniformSelector = createSelector(
    this.typeSelector,
    this.rulesSelector,
    (type, rules) => {
      return rules
        .map(rule => [
          rule.min / 100, 
          rule.max / 100, 
          type === "discrete" ? (
            rule.result ? 1 : 0
          ) : (
            rule.result
          ), 
          rule.neighbourhoodIndex,
        ])
        .flat();
    },
  );

  get rulesUniform() {
    return this.rulesUniformSelector(this.state);
  }

  keepReseedingSelector = 
    ({settings: {keepReseeding}}) => keepReseeding;

  monochromeSelector = 
    ({settings: {monochrome}}) => monochrome;

  frameUniformsSelector = createSelector(
    this.neibhourhoodRingsUniformSelector,
    this.rulesUniformSelector,
    this.keepReseedingSelector,
    this.monochromeSelector,
    this.maxRingRadiusSelector,
    (neibhourhoodRingssUniform, rulesUniform, keepReseeding, monochrome, maxRingRadius) => {
      return {
        u_neighbourhoodRings: neibhourhoodRingssUniform,
        u_rules: rulesUniform,
        u_keepReseeding: keepReseeding,
        u_monochrome: monochrome,
        u_maxRingRadius: maxRingRadius,
      };      
    }
  );

  get frameUniforms() {
    return this.frameUniformsSelector(this.state);
  }

  getFrameUniforms = () => {
    return this.frameUniforms;
  };

  onRender = (_1, _2, uniforms, getPixelsBuffer) => {
    if (uniforms.iFrame % 30 !== 0) {
      return;
    }
    const pixelsBuffer = getPixelsBuffer();
    const length = pixelsBuffer.length / 4;
    if (this.state.settings.monochrome) {
      let red = 0;
      for (let i = 0 ; i < length * 4 ; i += 4) {
        red += pixelsBuffer[i + 0] > 0;
      }
      this.setState(({percentagesActive}) => ({
        percentagesActive: {
          ...percentagesActive,
          monochrome: ~~(red / length * 100), 
        },
      }));
    } else {
      let red = 0, green = 0, blue = 0;
      for (let i = 0 ; i < length * 4 ; i += 4) {
        red += pixelsBuffer[i + 0] > 0;
        green += pixelsBuffer[i + 1] > 0;
        blue += pixelsBuffer[i + 2] > 0;
      }
      this.setState(({percentagesActive}) => ({
        percentagesActive: {
          ...percentagesActive,
          red: ~~(red / length * 100), 
          green: ~~(green / length * 100), 
          blue: ~~(blue / length * 100),
        },
      }));
    }
  };

  texturesSourcesSelector = createSelector(
    this.frameUniformsSelector,
    frameUniforms => {
      return [
        [
          vertexShaderCode, 
          getMncaCode(frameUniforms, this.state.configuration, this.state.settings),
        ],
      ];
    },
  );

  get texturesSources() {
    return this.texturesSourcesSelector(this.state);
  }

  state = {
    ...this.state,
    texturesSources: this.texturesSources,
  };
}

export default App;
