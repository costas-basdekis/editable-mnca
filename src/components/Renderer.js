import React, {Component, Fragment} from "react";

import ShaderExecutor from "../shaderExecution/ShaderExecutor";
import { createCallbackRef } from "./createCallbackRef";
import createFunctionRef from "./createFunctionRef";
import FpsViewer from "./FpsViewer";

export default class Renderer extends Component {
  state = {
    shaderError: null,
    detailedShaderError: null,
    hasExecutor: false,
    running: false,
  };

  shaderExecutor = null;
  fpsOnRenderRef = createFunctionRef();

  onCanvasElSet = () => {
    this.addShaderExecutor();
  };

  removeShaderExecutor() {
    if(!this.shaderExecutor) {
      return;
    }
    this.shaderExecutor.stopRendering();
    this.shaderExecutor = null;
    if (this.props.restartRef) {
      this.props.restartRef(null);
    }
    this.setState({hasExecutor: false, started: false});
  }

  addShaderExecutor() {
    this.removeShaderExecutor();
    this.setState({shaderError: null, detailedShaderError: null});
    try {
      this.shaderExecutor = new ShaderExecutor(this.canvasRef.current, {
        mainSources: this.props.mainSources,
        texturesSources: this.props.texturesSources,
        getFrameUniforms: this.props.getFrameUniforms,
        onRender: this.onRender,
        codeErrorCallback: this.codeErrorCallback,
      });
    } catch (e) {
      console.error("Could not create shader executor:", e);
      this.setState({shaderError: `Could not create shader executor: ${e}`});
      return;
    }
    this.shaderExecutor.startRendering();
    if (this.props.restartRef) {
      this.props.restartRef(() => this.shaderExecutor.restart());
    }
    this.setState({hasExecutor: true, started: true});
  }

  codeErrorCallback = (message, lineNumber) => {
    let errorsText;
    const splits = message.split("*** Error compiling shader: ");
    if (splits.length >= 2) {
      errorsText = splits[1];
    } else {
      errorsText = message;
    }
    this.setState(({detailedShaderError}) => ({
      detailedShaderError: detailedShaderError 
        ? `${detailedShaderError}\n${errorsText}` : errorsText,
    }));
  };

  onCanvasElUnset = () => {
    this.removeShaderExecutor();
  };

  canvasRef = createCallbackRef(
    this.onCanvasElSet, this.onCanvasElUnset);

  componentDidUpdate(prevProps) {
    if (prevProps.getFrameUniforms !== this.props.getFrameUniforms) {
      this.shaderExecutor.getFrameUniforms = this.props.getFrameUniforms;
    }
    if (prevProps.texturesSources !== this.props.texturesSources) {
      if (this.shaderExecutor) {
        if (this.props.texturesSources.length === this.shaderExecutor.textureProgramInfos.length) {
          for (const [index, textureSources] of this.props.texturesSources.entries()) {
            this.shaderExecutor.updateTextureSourceCode(index, ...textureSources);
          }
        } else {
          this.addShaderExecutor();
        }
      }
    }
  }

  render () {
    const {shaderError, detailedShaderError, hasExecutor, started} = this.state;
    const {width = 720, height = 405} = this.props;
    const style = {
      width, 
      height, 
      border: "1px solid black", 
      display: "flex",
      justifyContent: "center",
      position: "absolute",
      top: 0,
      right: 0,
      overflowY: "auto",
    };
    return (
      <div style={{position: "relative"}}>
        <canvas width={width} height={height} ref={this.canvasRef} />
        {shaderError || detailedShaderError ? (
          <div style={style}>
            <div>
              {shaderError}
              {detailedShaderError ? (
                detailedShaderError.split("\n").map((errorLine, index) => (
                  <Fragment key={index}>
                    <br/>
                    {errorLine}
                  </Fragment>
                ))
              ) : null}
            </div>
          </div>
        ) : null}
        <div>
          <button
            disabled={!hasExecutor}
            onClick={this.onToggleRunningClick}
          >
            {started ? "Pause" : "Continue"}
          </button>
          <FpsViewer onRenderRef={this.fpsOnRenderRef} />
        </div>
      </div>
    );
  }

  onRender = (duration, shaderExecutor, uniforms, pixelsBuffer) => {
    this.fpsOnRenderRef.callIfSet(duration, shaderExecutor, uniforms, pixelsBuffer);
    if (this.props.onRender) {
      this.props.onRender(duration, shaderExecutor, uniforms, pixelsBuffer);
    }
  };

  onToggleRunningClick = () => {
    this.setState(({hasExecutor, started}) => {
      if (hasExecutor) {
        if (started) {
          this.shaderExecutor.stopRendering();
        } else {
          this.shaderExecutor.startRendering();
        }
      }
      return {
        started: !started,
      };
    });
  };
}
