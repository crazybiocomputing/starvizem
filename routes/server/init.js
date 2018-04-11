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


const fs = require('fs');
const path = require('path');
const util = require('util');

fs.readFileAsync = util.promisify<(fs.readFile);

/** src/server/starvizem.js **/
const mkdirSync = (dirPath) => {
  try {
    fs.mkdirSync(dirPath);
    console.log('StarVizEM directory created.');
  } catch (err) {
    if (err.code !== 'EEXIST') {
      console.log('StarVizEM directory already exists.');
      throw err;
    }
  }
}

const createPipeline = () => {
  // TODO
}

const createMotionCorrToSTAR = () => {
  // TODO
}

const createCTFfindToSTAR = () => {
  // TODO
}


/**
 * Initialize server
 */
exports.init = () => {
  // 1- Check if StarVizEM directory exists
  mkdirSync(path.resolve('./StarVizEM'));


  // 2- Check default-pipeline.star and create appropriate JSON stuff
  createPipeline();

  // 3- Create STAR files of third-party programs if required
  createMotionCorrToSTAR();
  createCTFfindToSTAR();
};


