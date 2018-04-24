/*
 *  StarVizEM: STAR Files Visualization in CryoEM
 *  Copyright (C) 2018  Jean-Christophe Taveau.
 *
 *  This file is part of StarVizEM
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with StarVizEM.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */
 

'use strict';

class Raster {
  constructor(other) {
    Object.assign(this,other);
  }

  static create(other) {
    return new Raster(other);
  }
  
  /**
   * Get Uint8Array image buffer
   *
   * @param {number} index - If this Raster is a stack, choose an index between `0` and `nSlices - 1`
   * @return {Uint8Array} copy - Useless. Just here for compatibility with other process/render functions.
   *
   * @author Jean-Christophe Taveau
  */
  getBuffer(index = 0) {
    // Tutorial: https://hacks.mozilla.org/2011/12/faster-canvas-pixel-manipulation-with-typed-arrays/
    let offset = this.width * this.height * index;
    // New RGBA image buffer
    let buf = new ArrayBuffer(this.width * this.height * 4);
    let buf32 = new Uint32Array(buf);
    let buf8 = new Uint8Array(buf);
    // Fill with ABGR color values
    let delta = 255.0 / (this.statistics[index].max - this.statistics[index].min) ;
    buf32.forEach( (px,i,arr) => {
      let pix = Math.floor((this.pixelData[offset + i] - this.statistics[index].min) * delta );
      arr[i] = 255 << 24 | pix << 16 | pix<< 8 | pix;
    });
    return buf8;
  }

  /**
   * Display float32 image
   *
   * @param {number} index - If this Raster is a stack, choose an index between `0` and `nSlices - 1`
   * @returns {canvas} - Return a HTML5 Canvas
   *
   * @author Jean-Christophe Taveau
  */
  display(index = 0) {
    // Tutorial: https://hacks.mozilla.org/2011/12/faster-canvas-pixel-manipulation-with-typed-arrays/
    let canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    
    let ctx = canvas.getContext('2d');
    let imgdata = ctx.createImageData(this.width, this.height);
    let offset = this.width * this.height * index;
    // New RGBA image buffer
    let buf = new ArrayBuffer(this.width * this.height * 4);
    let buf32 = new Uint32Array(buf);
    let buf8 = new Uint8Array(buf);
    // Fill with ABGR color values
    let delta = 255.0 / (this.statistics[index].max - this.statistics[index].min) ;
    buf32.forEach( (px,i,arr) => {
      let pix = Math.floor((this.pixelData[offset + i] - this.statistics[index].min) * delta );
      arr[i] = 255 << 24 | pix << 16 | pix<< 8 | pix;
    });

    imgdata.data.set(buf8);
    ctx.putImageData(imgdata, 0, 0);
    
    // Flip Y-axis
    ctx.scale(1,-1);
    ctx.drawImage(canvas,0,-this.height);
    return canvas;
  }

  /**
   * Compute a montage of all the slices of a stack
   *
   * @returns {canvas} - Return a HTML5 `figure` containing `canvas`
   *
   * @author Jean-Christophe Taveau
  */
  montage() {
    let montage = document.createElement('section');
    montage.className = 'montage';
    montage.id = 'fig001';
    
    Array.from({length: this.nSlices}, (v,i)=> i).map( (index) => {
      let elm = document.createElement('figure');
      let canvas = this.display(index);
      elm.className = 'zoom';
      elm.innerHTML = `<span>${(index+1).toString().padStart(3,'0')}</span>`;
      elm.appendChild(canvas);
      montage.appendChild(elm);
    });
    return montage;
  }
}





