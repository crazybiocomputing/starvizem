/*
 *  StarVizEM: STAR Files Visualization in CryoEM
 *  Copyright (C) 2018  Jean-Christophe Taveau.
 *
 *  This file is part of StarVizEM
 *
 * The source code is licensed GPLv3.0.
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

module.exports = class Table {

  constructor(other) {
    Object.assign(this, other);
  }
  
  static create(other) {
    return new Table(other);
  }
  
  getColumnIndex(headername) {
    return this.headers.findIndex( (head) => head === headername);
  }

  getRow(index) {
    return this.data.reduce( (row,column) => [...row,column[index]], []); 
  } 

  getColumn(headername) {
    return (this.type === 1) ? this.data[this.getColumnIndex(headername)] : ['None'];
  } 
  
  getValue(columnHeader) {
    return (this.type === 0) ? this.data[this.getColumnIndex(columnHeader)][0] : -1;
  } 

  getItem(rowIndex,headername) {
    return this.data[this.getColumnIndex(headername)][rowIndex];
  } 

}

