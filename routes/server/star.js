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

  const parse = (input) => {
    // Init Variables and objects of the incoming JSON
    let blocklist = [];
    let cptblock = -1;
    let headerslist = [];
    let columns = [];

    // Data-block structure
    let block = {
      name : "default",
      headers : headerslist,
      mx : 0,
      my : 0,
      type : "none",
      data : []
    };
    
    // JSON structure
    let star = {
      comment : "Created by StarVizEM",
      tables : blocklist
    };

    // Cleanup: Deleting spaces
    let lines = input.replace(/^\s*\n/gm, "") .split('\n');
    
    // For each line, extract the keywords: `data_`, `loop_`, `_rln`, and `_xxx`
    lines.forEach( (line,index) => {
      let words = line.trim().split(/\s+/); 

      //data block encountered
      if (words[0].includes('data_')){
        //incrementation of the number of data-blocks
        cptblock = cptblock + 1;
        //copy of the data block structure 
        const copiedblock = Object.assign({}, block);
        blocklist.push(copiedblock);
        let tableName = words[0].substr(5,words[0].length || 'None');
        blocklist[cptblock].name = tableName; 
        //cleaning of the lists 
        headerslist = [];
        columns = [];
      }

      // Keyword `loop_`
      if (words[0].includes('loop_')){
        blocklist[cptblock].type = "loop";  
      }

      // Column headers
      if (words[0].includes('_rln')){
        let title = words[0].substr(4, words[0].length || 'None');
        headerslist.push(title);
        blocklist[cptblock].mx = headerslist.length;
        blocklist[cptblock].headers = headerslist;
        columns.push([]);
      }
        
      // Data in a table
      if(blocklist[cptblock].type == "loop"){
        // definition of what is not data then test it
        let notdata = /loop_|data_|_rln|\n+|\s+/.test(words[0]);
        if(notdata == false){
          if (words[0] != "" && words[0] != null){
            let nbline = blocklist[cptblock].my;
            blocklist[cptblock].my = (nbline +1);
         }
          // for each column of the data block 
          for (let col=0; col<words.length; col++){
            columns[col].push(words[col]);
            blocklist[cptblock].data = columns;
          }
        }
      }
        
      // Data in one line
      else {
        if (words[1] != null && words[1] != "" ) {
          columns[0].push(words[1]);
          blocklist[cptblock].data = columns;
          blocklist[cptblock].my = 1;
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

  // Get JSON
  let starJSON = JSON.stringify(star);
  return star;
}


/**
 * Get STAR file
 */
exports.getSTAR = (filename) => {
  return fs.readFileAsync(filename, "utf-8").then(readSTAR, (err) => console.log(err));
};

