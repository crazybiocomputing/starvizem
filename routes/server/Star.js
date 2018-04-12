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
 * Pauline Bock, Cyril Dourthe, Marie Econimides, Guillaume Sotton
 */
 
'use strict';

const Table = require('./Table');

/**
 * @class Star
 *
 * @author Jean-Christophe Taveau
 */
module.exports = class Star {

  /**
   * @constructor
   *
   * @author Jean-Christophe Taveau
   */
  constructor(other) {
    Object.assign(this, other);
  }
  
  static create(other) {
    return new Star(other);
  }
  
  getTable(tablename) {
    return new Table(this.tables.find( (table) => table.name === tablename));
  }

  getJob(jobID) {
    return this.jobs.find( (job) => job.jobID === jobID) ;
  }
  
  /**
   * Get a job ID from the process name
   *
   * @author Jean-Christophe Taveau
   */
  static getJobID(process) {
    return parseInt(process.match(/job(\d+)/)[1]);
  }
  
  /**
   * Get a job ID from the process name
   *
   * @author Jean-Christophe Taveau
   */
  static splitPath(filename) {
    let words = filename.split('/');
    let start = (words[0] === '.') ? 1 : 0;
    return words.slice(start,start + 3);
  }

  /**
   * Get a job ID from the process name
   *
   * @author Jean-Christophe Taveau
   */
  static getExtension(filename) {
    return filename.split('.').pop();
  }

}


