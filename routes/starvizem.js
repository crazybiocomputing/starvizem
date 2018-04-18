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


const {getSTAR,readSTAR,processes} = require('./server/stargate.js');
const {getPipeline} = require('./server/pipeline.js');
const {getClass2D} = require('./server/class2d.js');
const {init} = require('./server/init.js');


module.exports = {
  getSTAR: getSTAR,
  getPipeline: getPipeline,
  getClass2D: getClass2D,
  init: init,
  processes: processes,
  readSTAR: readSTAR
}

