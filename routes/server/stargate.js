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

/**
 * Convert STAR data to JSON
 *
 * @params {string} data - STAR data
 * @return JSON 
 *
 * @author Pauline Bock
 */
const readSTAR = (data) => { 

  // STAR parser
  const parse = (input) => {

    // Init variables
    let block;
    let status = 0;
    
    // Default parameter
    let star = {
      comment : "Created by StarVizEM",
      date: (new Date()).toString().split(' ').splice(1,4).join('/'),
      tables : []
    };

    // Cleanup: Deleting spaces
    let lines = input.replace(/^\s*\n/gm, "") .split('\n');
    
    // For each line, extract the keywords: `data_`, `loop_`, and `_xxx`
    lines.forEach( (line,index) => {
      let words = line.trim().split(/\s+/); 
      
      // Data block
      if (words[0].includes('data_')){
        // Create a new data block structure 
        block = {
          name : words[0].substr(5,words[0].length) || 'None', // ??
          headers : [],
          data : [],
          mx : 0,
          my : 0,
          type : 0 // 0: single line; 1: loop
        };
        star.tables.push(block);
      }

      // Keyword `loop_`
      else if (words[0].includes('loop_')) {
        block.type = 1;  
      }
      // Column headers and type == 'single row'
      else if (words[0][0] === '_' && block.type === 0){
        block.headers.push(words[0]);
        block.mx = 1;
        block.my = 1;
        // Create new Column
        block.data.push([isNaN(words[1]) ? words[1] : parseFloat(words[1])]);
      }
      // Column headers and type == 'multi-rows'
      else if (words[0][0] === '_' && block.type === 1){
        block.headers.push(words[0]);
        block.mx++;
        // Create new Column
        block.data.push([]);
      }
      else {
        block.my++;
        // For each column of the data block 
        for (let col in words) {
          let v = words[col];
          block.data[col].push(isNaN(v) ? v : parseFloat(v));
        }
      }
    });
    return star;
  }

  //MAIN
  
  //Parse StarFile
  let star = parse(data);
  if (star.error){
    throw star.error
  }

  return star;
}


/**
 * Get STAR file
 */
exports.getSTAR = (filename) => {
  console.log(filename);
  return fs.readFileAsync(filename, "utf-8").then(readSTAR, (err) => console.log(err));
};

exports.readSTAR = readSTAR;


