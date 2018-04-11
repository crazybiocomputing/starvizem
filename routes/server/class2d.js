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

const fs = require('fs');
const svzm = require('./star.js');
const Star = require('./Star.js');
const Table = require('./Table.js');
const Job = require('./Job.js');


/**
 * Get the data of a Class2D job
 *
 * @params {string} data - STAR data
 * @return JSON 
 *
 * @author Pauline Bock
 */
const readClass2D = (err,data) =>{ 

  const parseClass2D = (input) => {
    //creation of variables and objects in the incoming json
    let dataclass = {
      id : 0,
      nblong : 0,
      nbHR: 0,
      nbMR : 0,
      nbLR : 0
    }

    let class2D = {
      classesnumber : 0,
      imagenbperclass: []
    }
    
    //parsing
    let jsondata = JSON.parse(input);  
    let nbdatalines = jsondata.tables[0].my-1;
    let classmax = 0;
    
    //get the right datacolumns : column 24 & 16
    let col24 = jsondata.tables[0].data[23];
    let col16 = jsondata.tables[0].data[15];
    
    //get the number of classes
    for (let i = 0; i < col24.length; i++){
      let classesnb = parseInt(col24[i]);
      if (classesnb >= classmax){
        classmax = classesnb;
      }
    }

    //Initialize the structure of the JSON
    for (let i = 0; i < classmax; i++){
      let datacopy = Object.assign({}, dataclass);
      class2D.imagenbperclass.push(datacopy);
      class2D.imagenbperclass[i].id = i + 1;
    }

    //get the data
    for (let i = 0; i < col24.length; i++){
      let classesnb = parseInt(col24[i]);
      class2D.imagenbperclass[classesnb-1].nblong = class2D.imagenbperclass[classesnb-1].nblong +1;
    }

    for (let i = 0; i < col16.length; i++){
      let ctfres = parseFloat(col16[i]);
      console.log(ctfres);
      let classnb = parseInt(col24[i]-1);
      //LR:<8.0, MR:8.0<x<8.1, HR:>8.1
      if (ctfres < 8.0){
        class2D.imagenbperclass[classnb].nbLR = class2D.imagenbperclass[classnb].nbLR + 1;
      }
      if (ctfres < 8.1 && ctfres > 8.0){
        class2D.imagenbperclass[classnb].nbMR = class2D.imagenbperclass[classnb].nbMR + 1;
      }
      if (ctfres > 8.1){
        class2D.imagenbperclass[classnb].nbHR = class2D.imagenbperclass[classnb].nbHR + 1;
      }
    }

  class2D.classesnumber = classmax;
    
  return class2D;
  };

  //MAIN
  if(err){throw err;}
  
  //Parse JSONFile
  let json = parsemy(data);
  if (json.error){
    throw json.error
  }

  let dataJSON = JSON.stringify(json);
  console.log(dataJSON);
  
      // Get data in `run.job`
      try {
        fs.readFileSync('./' + job.path+'/run.job','utf-8')
          .split(/\n/)
          .forEach( (line) => {
            let pair = line.split(' == ');
            job.params.push(pair);
          });
      }
      catch (err) {
      
      };
  
  return dataJSON;

}

/**
 * Get JSON file
 */

exports.getJSON = (filename) => {
  return fs.readFileAsync(filename, "utf-8").then(readData, (err) => console.log(err));
};




