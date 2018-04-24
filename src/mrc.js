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


/**
 * Read MRC File
 *
 * @params {filereader} fr - 
 *
 * @author Jean-Christophe Taveau
 */
const readMRC = (fr) => {
  let header = {
    nx : 0.0,            //  0   0       image size
    ny : 0.0,            //  1   4
    nz : 0.0,            //  2   8
    mode : 0.0,          //  3           0:char,1:short,2:
    nxStart : 0.0,       //  4           unit cell offset
    nyStart : 0.0,       //  5
    nzStart : 0.0,       //  6
    mx : 0.0,            //  7           unit cell size in voxels
    my : 0.0,            //  8
    mz : 0.0,            //  9
    a : 0.0,             // 10   40      cell dimensions in A
    b : 0.0,             // 11
    c : 0.0,             // 12
    alpha : 0.0,         // 13           cell angles in degrees
    beta : 0.0,          // 14
    gamma : 0.0,         // 15
    mapc : 0.0,              // 16           column axis
    mapr : 0.0,              // 17           row axis
    maps : 0.0,              // 18           section axis
    amin : 0.0,              // 19           minimum density value
    amax : 0.0,              // 20   80      maximum density value
    amean : 0.0,             // 21           average density value
    ispg : 0.0,              // 22           space group number
    nsymbt : 0.0,            // 23           bytes used for sym. ops. table
    extra : new Float32Array(25),              // 24           user-defined info
    xOrigin : 0.0,           // 49           phase origin in pixels
    yOrigin : 0.0,           // 50
    zOrigin : 0.0,           // 51
    map : [' ',' ',' ',' '], // 52       identifier for map file ("MAP ")
    machst : [0,0,0,0],      // 53           machine stamp
    arms : 0.0,              // 54       RMS deviation
    nlabl : 0.0,             // 55           number of labels used
    labels : [],              // 56-255       10 80-character labels
  };
  
  /*
    int nx;              //  0   0       image size
    int ny;              //  1   4
    int nz;              //  2   8
    int mode;            //  3           0=char,1=short,2=float
    int nxStart;         //  4           unit cell offset
    int nyStart;         //  5
    int nzStart;         //  6
    int mx;              //  7           unit cell size in voxels
    int my;              //  8
    int mz;              //  9
    float a;             // 10   40      cell dimensions in A
    float b;             // 11
    float c;             // 12
    float alpha;         // 13           cell angles in degrees
    float beta;          // 14
    float gamma;         // 15
    int mapc;            // 16           column axis
    int mapr;            // 17           row axis
    int maps;            // 18           section axis
    float amin;          // 19           minimum density value
    float amax;          // 20   80      maximum density value
    float amean;         // 21           average density value
    int ispg;            // 22           space group number
    int nsymbt;          // 23           bytes used for sym. ops. table
    float extra[25];     // 24           user-defined info
    float xOrigin;       // 49           phase origin in pixels
    float yOrigin;       // 50
    float zOrigin;       // 51
    char map[4];         // 52       identifier for map file ("MAP ")
    char machst[4];      // 53           machine stamp
    float arms;          // 54       RMS deviation
    int nlabl;           // 55           number of labels used
    char labels[800];    // 56-255       10 80-character labels
  */
  
  // console.log(header);
  let arraybuffer = new Uint8Array(fr.result);
  let view = new DataView(fr.result);
  
  // Read header
  header.machst = view.getInt32(53*4);
  let endianness = (header.machst >>> 24) === 0x44; 
  header.endianness = endianness;

  header.nx = view.getInt32(0,endianness); // littleEndian
  header.ny = view.getInt32(4,endianness); // 0+uint8 = 1 bytes offset
  header.nz = view.getInt32(8,endianness); // 0+uint8+uint16 = 3 bytes offset
  header.mode = view.getInt32(12,endianness);            //  3           0=char,1=short,2=float
  header.nxStart = view.getInt32(16,endianness);
  header.nyStart = view.getInt32(20,endianness);
  header.nzStart = view.getInt32(24,endianness);
  header.mx = view.getInt32(28,endianness);
  header.my = view.getInt32(32,endianness);
  header.mz = view.getInt32(36,endianness);
  header.a = view.getFloat32(40,endianness);
  header.b = view.getFloat32(44,endianness);
  header.c = view.getFloat32(48,endianness);
  header.alpha = view.getFloat32(52,endianness);
  header.beta = view.getFloat32(56,endianness);
  header.gamma = view.getFloat32(60,endianness);
  header.mapc = view.getInt32(64,endianness);
  header.mapr = view.getInt32(68,endianness);
  header.maps = view.getInt32(72,endianness);
  header.amin = view.getFloat32(76,endianness);
  header.amax = view.getFloat32(80,endianness);
  header.amean = view.getFloat32(84,endianness);
  header.ispg = view.getInt32(88,endianness);
  header.nsymbt = view.getInt32(92,endianness);
  for (let i = 0; i < 25; i++) {
    header.extra[i] = view.getFloat32((24 + i)*4,endianness);
  }

  header.xOrigin = view.getFloat32(196,endianness);
  header.yOrigin = view.getFloat32(200,endianness);
  header.zOrigin = view.getFloat32(204,endianness);
  header.map = String.fromCharCode(view.getUint8(208,endianness))
    + String.fromCharCode(view.getUint8(209,endianness))
    + String.fromCharCode(view.getUint8(210,endianness))
    + String.fromCharCode(view.getUint8(211,endianness));
  header.arms = view.getFloat32(216,endianness);
  header.nlabl = view.getInt32(220,endianness);
  for (let i = 0; i < header.nlabl; i++) {
    let j = 0;
    let n = 32;
    let label = '';
    while (j < 80 && n !== 0) {
      label += String.fromCharCode(n);
      n = view.getUint8(56 * 4 + i * 80 + j,endianness);
      j++;
    }
    header.labels.push(label.substr(1,label.length));
  }

  // console.log(`${endianness}\n ${header}`);
  
  // Read pixels 
  let pixels = new Float32Array(header.nx * header.ny * header.nz);
  for (let i=0, off=256*4; i< pixels.length; i++, off+=4) {
    pixels[i] = view.getFloat32(off,endianness);
  }

  // Compute statistics per slice
  let size = header.nx * header.ny;
  let stats = Array.from( {length: header.nz}, (v,i) => i)
    .map( (index) => {
      let sli = pixels.slice(index * size, (index + 1) * size);
      return {min: Math.min(...sli), max: Math.max(...sli)};
   });
  
  // Return raster
  return {
    width: header.nx,
    height: header.ny,
    nSlices: header.nz,
    header: header, 
    pixelData: pixels,
    statistics: stats
  };
  
};
