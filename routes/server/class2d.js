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
const svzm = require('./stargate.js');
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
const readClass2D = (json2d) =>{ 

  const parseClass2D = (input) => {

    //creation of variables and objects in the incoming json

    let class2D = {
      comment: 'Created by STARVIZEM',
      classesnumber : -1,
      imagenbperclass: []
    };

    let dataclass = {
      classID : 0,
      totalnb : 0,
      nbHR: 0,
      nbMR : 0,
      nbLR : 0
    };

    let starobj = Star.create(input);

    //Get classes number
    let classes = starobj.getTable('None').getColumn('_rlnClassNumber');
    let resolution = starobj.getTable('None').getColumn('_rlnCtfMaxResolution');
    class2D.classesnumber = Math.max(...classes);

    //Initialize the structure of the JSON
    for (let i = 0; i < class2D.classesnumber; i++){
      let datacopy = Object.assign({}, dataclass);
      class2D.imagenbperclass.push(datacopy);
      class2D.imagenbperclass[i].classID = i + 1;
    }

    //get the data
    classes.forEach( function(element){
      class2D.imagenbperclass[element-1].totalnb++;
    });

    for (let i = 0; i < resolution.length; i++){
      let ctfres = resolution[i];
      let classnb = classes[i];
      //LR:<8.0, MR:8.0<x<8.1, HR:>8.1
      if (ctfres < 8.0){ class2D.imagenbperclass[classnb-1].nbLR++;}
      if (ctfres < 8.1 && ctfres > 8.0){ class2D.imagenbperclass[classnb-1].nbMR++;}
      if (ctfres > 8.1){ class2D.imagenbperclass[classnb-1].nbHR++;}
    }

  return class2D;
  };

 /***** MAIN *****/

  //Parse JSONFile
  let jsonClass2D = parseClass2D(json2d);

  let data2dJSON = JSON.stringify(jsonClass2D);
  
  /*
    // TODO??
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
      */
  
  return jsonClass2D;

}

/**
 * Get JSON file
 */

exports.getClass2D = (filename) => {
  return svzm.getSTAR(filename).then(readClass2D, (err) => console.log(err));
};


