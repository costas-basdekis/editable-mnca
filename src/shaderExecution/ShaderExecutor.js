import * as twgl from "twgl.js";
import SwappingTextureBuffer from "./SwappingTextureBuffer";
import {pointsFromIndexes} from "./utils";

export default class ShaderExecutor {
  constructor(canvasEl, {
    mainSources, texturesSources = [], staticUniforms = {},
    getFrameUniforms, targetFps = 60, codeErrorCallback, onRender,
  } = {}) {
    this.canvasEl = canvasEl;
    if (!this.canvasEl) {
      throw new Error("No canvas passed in");
    }
    this.gl = canvasEl.getContext("webgl2");
    if (!this.gl) {
      throw new Error("Could not get WebGL context");
    }
  
    this.bufferInfo = twgl.createBufferInfoFromArrays(this.gl, {
      position: pointsFromIndexes([
        [-1, -1, 0],
        [1, -1, 0],
        [1, 1, 0],
        [-1, 1, 0],
      ], [0, 1, 3, 3, 1, 2]),
    });

    this.mainProgramInfo = this.createProgramInfo(...mainSources, codeErrorCallback);
    this.textureProgramInfos = texturesSources
      .map(([vsSource, fsSource], index) => {
        return this.createTextureProgramInfo(index, vsSource, fsSource, {codeErrorCallback});
      });

    this.pixelsBuffer = new Uint8Array(
      this.gl.drawingBufferWidth * this.gl.drawingBufferHeight * 4);

    this.staticUniforms = {
      ...staticUniforms,
        iResolution: [this.gl.canvas.width, this.gl.canvas.height],
    };
    this.getFrameUniforms = getFrameUniforms;
    this.frameCount = 0;
    this.rendering = false;
    this.renderTimeout = null;
    this.targetFps = targetFps;
    this.renderIntervalDuration = 1000 / this.targetFps;
    this.onRender = onRender;
    this.previousRenderTime = null;
  }

  createProgramInfo(vsSource, fsSource, codeErrorCallback) {
    const programInfo = twgl.createProgramInfo(
      this.gl, 
      [vsSource, fsSource], 
      this.getCodeErrorMessageCallback(codeErrorCallback));
    if (!programInfo) {
      throw new Error("Could not compile sources");
    }
    twgl.setBuffersAndAttributes(this.gl, programInfo, this.bufferInfo);
    return programInfo;
  }

  createTextureProgramInfo(index, vsSource, fsSource, {createBuffer = true, codeErrorCallback} = {}) {
    const programInfo = this.createProgramInfo(vsSource, fsSource, codeErrorCallback);
    programInfo.vsSource = vsSource;
    programInfo.fsSource = fsSource;
    if (createBuffer) {
      programInfo.textureBuffer = new SwappingTextureBuffer(this.gl);
    }
    programInfo.textureIndex = index;
    programInfo.textureSite = this.gl.TEXTURE0 + index;
    programInfo.textureVariableName = `u_texture${index}`;
    programInfo.mainProgramTextureLocation = this.gl.getUniformLocation(
      this.mainProgramInfo.program, programInfo.textureVariableName);
    if (!programInfo.mainProgramTextureLocation) {
      console.log(
        `Could not get location for uniform named `
        + `"${programInfo.textureVariableName}" in main program`);
    }

    return programInfo;
  }

  getCodeErrorMessageCallback(codeErrorCallback) {
    return (message, lineNumber) => {
      console.log("Shader compilation error", message, lineNumber);
      if (codeErrorCallback) {
        codeErrorCallback(message, lineNumber);
      }
    };
  }

  renderBody = time => {
    const uniforms = {
      ...this.staticUniforms,
      iFrame: this.frameCount,
      iTime: time * 0.001,
      iDate: this.getIDate(),
    };
    if (this.getFrameUniforms) {
      Object.assign(uniforms, this.getFrameUniforms(uniforms));
    }

    for (const textureProgramInfo of this.textureProgramInfos) {
      this.gl.useProgram(textureProgramInfo.program);
      twgl.setUniforms(textureProgramInfo, uniforms);
      textureProgramInfo.textureBuffer.renderTexture(this.bufferInfo);
    }

    this.gl.useProgram(this.mainProgramInfo.program);
    twgl.setUniforms(this.mainProgramInfo, uniforms);
    this.bindTexturesToMainProgram();
    this.renderMainProgram();

    const getPixelsBuffer = () => {
      if (!getPixelsBuffer.read) {
        this.gl.readPixels(
          0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight, 
          this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.pixelsBuffer);
      }
      return this.pixelsBuffer;
    };
    getPixelsBuffer.read = false;

    const endTime = new Date();
    let duration = null;
    if (this.previousRenderTime) {
      duration = endTime - this.previousRenderTime;
    }
    this.previousRenderTime = endTime;

    if (this.onRender) {
      this.onRender(duration, this, uniforms, getPixelsBuffer);
    }

    this.frameCount += 1;
    
    if (this.rendering) {
      this.startRendering();
    }
  }

  bindTexturesToMainProgram() {
    for (const programInfo of this.textureProgramInfos) {
      if (!this.textureProgramInfos.mainProgramTextureLocation) {
        continue;
      }
      this.gl.uniform1i(
        this.textureProgramInfos.mainProgramTextureLocation, 
        programInfo.textureIndex);
      this.gl.activeTexture(programInfo.textureSite);
      this.gl.bindTexture(
        this.gl.TEXTURE_2D, programInfo.textureBuffer.texture);
    }
  }

  renderMainProgram() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);  
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    twgl.drawBufferInfo(this.gl, this.gl.TRIANGLES, this.bufferInfo);
  }

  getIDate() {
    const now = new Date();
    return [
      now.getUTCFullYear(), 
      now.getUTCMonth() + 1,
      now.getUTCDate(),
      (
        ((now.getUTCHours() + 1) * 60) 
        + now.getUTCMinutes()
      ) * 60 + now.getUTCSeconds(),
    ];
  }
  
  requestRender = () => {
    requestAnimationFrame(this.renderBody);
  };

  restart() {
    this.frameCount = 0;
  }

  startRendering() {
    const renderingOrTimeout = !!(this.rendering || this.renderTimeout);
    this.stopRendering(false);
    this.rendering = true;
    if (renderingOrTimeout) {
      this.renderTimeout = setTimeout(this.requestRender, this.renderIntervalDuration);
    } else {
      this.requestRender();
    }
  }

  stopRendering(reset = true) {
    if (reset) {
      this.previousRenderTime = null;
    }
    this.rendering = false;
    if (!this.renderTimeout) {
      return;
    }

    clearTimeout(this.renderTimeout);
    this.renderTimeout = null;
  }

  setTargetFps(targetFps) {
    this.targetFps = targetFps;
    this.renderIntervalDuration = 1000 / this.targetFps;
  }

  updateTextureSourceCode(index, vsSource, fsSource) {
    const programInfo = this.textureProgramInfos[index];
    if (programInfo.vsSource === vsSource && programInfo.fsSource === fsSource) {
      return;
    }

    const oldProgram = programInfo.program;

    Object.assign(
      programInfo, 
      this.createTextureProgramInfo(
        index, vsSource, fsSource, {createBuffer: false}),
    );

    this.gl.deleteProgram(oldProgram);
  }
}
