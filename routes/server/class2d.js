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

    const setCategories = (nbCat) => {
      let range = resmax - resmin;
      let part = range / nbCat;
      for (let i = 0; i < nbCat; i++){
        dataclass.headers.push("cat"+nbCat);
      }
      console.log("max"+ resmin + " part" + part + (resmin + part) );
      for (let i = 0; i < resolution.length; i++){
        let ctfres = resolution[i];
        let classnb = classes[i];
        console.log(classnb);
        console.log(ctfres + "1:" +(resmin + part) + "3 :" + (resmax - part) );
        /*
        if (ctfres < (resmin + part)){ class2D.imagenbperclass[classnb-1].nbLR++;}
        if (ctfres < (resmax - part) && ctfres > (resmin + part)){ class2D.imagenbperclass[classnb-1].nbMR++;}
        if (ctfres > (resmax - part) ){ class2D.imagenbperclass[classnb-1].nbHR++;}
      *//*
       if (ctfres < (resmin + part)){ class2D.imagenbperclass[classnb-1].resolution[0].cat0.push(ctfres);}
        if (ctfres < (resmax - part) && ctfres > (resmin + part)){ console.log(ctfres);}
        if (ctfres > (resmax - part) ){ console.log(ctfres);}*/
      }
    }

    //creation of variables and objects in the incoming json

    let class2D = {
      comment: 'Created by STARVIZEM',
      classesnumber : -1,
      imagenbperclass: []
    };

    let dataclass = {
      classID : 0,
      totalnb : 0,
      headers : [],
      resolution : []
    };

    let starobj = Star.create(input);

    //Get classes number
    let classes = starobj.getTable('None').getColumn('_rlnClassNumber');
    let resolution = starobj.getTable('None').getColumn('_rlnCtfMaxResolution');
    class2D.classesnumber = Math.max(...classes);
    let resmax = Math.max(...resolution);
    let resmin = Math.min(...resolution);

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

    let nbCategory = 3;
    setCategories(nbCategory);
  
    console.log(class2D);
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


