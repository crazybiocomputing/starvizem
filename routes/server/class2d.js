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
const readClass2D = (classNum,binNum) => (json2d) =>{ 

  const parseClass2D = (input) => {

    //creation of variables and objects in the incoming json

    let starobj = Star.create(input);
    
    //Get columns _rlnClassNumber and _rlnCtfMaxResolution for statistics
    let table = starobj.getTable('default');
    let classID = table.getColumn('_rlnClassNumber');
    let resolution = table.getColumn('_rlnCtfMaxResolution');

    let resmax = Math.max(...resolution);
    let resmin = Math.min(...resolution);

    let bandwidth = (resmax - resmin ) / (binNum - 1);
    
    let stats = classID.reduce( (accu,id,index) => {
      let hindex = Math.trunc((resolution[index] - resmin)/bandwidth);
      accu.h[hindex]++;
      accu.num[id]++;
      accu.res[id][hindex]++;
      return accu;
    },
      {
        h: new Array(binNum).fill(0), 
        num: new Array(classNum+1).fill(0),
        res: Array.from({length: classNum+1}, (v) => new Array(binNum).fill(0))
      }
    );
    // Remove class #0 because RELION starts at 1
    stats.num = stats.num.slice(1);
    stats.res = stats.res.slice(1);
    console.log(stats);

    let statistics = {
      name: 'statistics',
      type: 0,
      mx: 1,
      my: 1,
      headers : [
        '_svzMinResolution',
        '_svzMaxResolution',
        '_svzBinNumber',
        '_svzBandwidth'
      ],
      data : [
        resmin,
        resmax,
        binNum,
        bandwidth,
        ...stats.h,
        ...stats.num
      ]
    }
    statistics.headers = [
      ... statistics.headers, 
      ...stats.h.map( (v,i) => `_svzBin${i.toString().padStart(3,'0')}`),
      ...stats.num.map( (v,i) => `_svzNumberPerClass${(i+1).toString().padStart(3,'0')}`) 
    ];
    starobj.tables.push(statistics);
    starobj.tables.push({
      name: 'histogram_resolution',
      type: 1,
      mx: binNum,
      my: classNum,
      headers : stats.h.map( (v,i) => `_svzBin${i.toString().padStart(3,'0')}`),
      data : stats.res
    });
    
    console.log(starobj);
    return starobj;
  };

 /***** MAIN *****/

  //Parse JSONFile
  let jsonClass2D = parseClass2D(json2d);
  
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

exports.getClass2D = (binNum) => (filename) => {
  // Step #1 - Read and Parse run_it???_model.star
  let words = Star.splitPath(filename);
  let iteration = words[2].match(/\d+/)[0];
  let modelfile = `./${words[0]}/${words[1]}/run_it${iteration.padStart(3,'0')}_model.star`
  console.log(iteration, modelfile);
  let stats = fs.statSync(modelfile);
  let modelstar = svzm.readSTAR(stats)(fs.readFileSync('./'+modelfile,'utf-8'));
  let classnum = Star.create(modelstar).getTable('model_general').getValue('_rlnNrClasses');
  
  //  Step #2 - Read and parse run_it???_data.star
  return svzm.getSTAR(filename)
    .then( (inData) => {
      let starobj = readClass2D(classnum, binNum)(inData);
      starobj.files.push({
        filename : modelfile,
        timestamp: new Date(stats.mtime).getTime()
      });
      return starobj;
    }, (err) => console.log(err));
};


