import * as twgl from "twgl.js";

export default class SwappingTextureBuffer{
  constructor(gl, {width = undefined, height = undefined} = {}) {
    this.gl = gl;
    this.width = width || Math.trunc(this.gl.canvas.width);
    this.height = height || Math.trunc(this.gl.canvas.height);

    const firstFrameBufferInfo = this.createFramebufferInfo();
    const secondFrameBufferInfo = this.createFramebufferInfo();
  
    this.texture = firstFrameBufferInfo.attachments[0];
    this.frameBuffer = firstFrameBufferInfo.framebuffer;
    this.texture2 = secondFrameBufferInfo.attachments[0];
    this.frameBuffer2 = secondFrameBufferInfo.framebuffer;
  }

  createFramebufferInfo() {
    return twgl.createFramebufferInfo(this.gl, [
      {format: this.gl.RGBA},
    ], this.width, this.height);
  }

  swap() {
    [this.texture, this.texture2] = [this.texture2, this.texture];
    [this.frameBuffer, this.frameBuffer2] = [this.frameBuffer2, this.frameBuffer];
  }

  renderTexture(bufferInfo) {
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);  
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer2);  
    this.gl.viewport(0, 0, this.width, this.height);
    twgl.drawBufferInfo(this.gl, this.gl.TRIANGLES, bufferInfo);  
    this.swap();
  }
}
