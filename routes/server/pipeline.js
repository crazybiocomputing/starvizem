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

const fs = require('fs');
const svzm = require('./stargate.js');
const Star = require('./Star.js');
const Table = require('./Table.js');

const processes = { 
  'Import' : svzm.IMPORT, 
  'MotionCorr': svzm.MOTIONCORR, 
  'CtfFind':3, 
  'ManualPick':4, 
  'Extract':5, 
  'Class2D': svzm.CLASS2D, 
  'Select': 7, 
  'Autopick' : 8, 
  'Sort' : 9, 
  'InitialModel':10, 
  'Class3D':11, 
  'Refine3D':12, 
  'MaskCreate':13, 
  'PostProcess': 14, 
  'LocalRes': 15, 
  'MovieRefine':16, 
  'Polish':17
};
 
 
/**
 * Parse RELION Pipeline Data
 *
 * @params {object} starjson - STAR object
 * @return {object} - Returns a graph ready to display with D3
 *
 * @author Pauline Bock
 * @author Jean-Christophe Taveau
 */
const readPipeline = (filestats) => (starjson) => { 

  /* 
   * Get job in pipeline object
   *
   * @author Jean-Christophe Taveau
   */
  const getJob = (jobID,pipe_obj) => pipe_obj.jobs.find( (job) => job.jobID === jobID) ;

  /*
   * Get number of particles/micrographs/movies in RELION job
   *
   * @params {string} fullpathfilename - STAR filename
   *
   * @author Jean-Christophe Taveau
   */
  const getNumRaster = (pipejob) => {
    // NODE_MOVIES      - 2D micrograph movie(s), e.g. Falcon001_movie.mrcs or micrograph_movies.star
    // NODE_MICS        - 2D micrograph(s), possibly with CTF information as well, e.g. Falcon001.mrc or micrographs.star
    // NODE_MIC_COORDS  - Suffix for particle coordinates in micrographs (e.g. autopick.star or .box)
    // NODE_PART_DATA   - A metadata (STAR) file with particles (e.g. particles.star or run1_data.star)
    // NODE_MOVIE_DATA  - A metadata (STAR) file with particle movie-frames (e.g. particles_movie.star or run1_ct27_data.star)
    // NODE_2DREFS      - A STAR file with one or multiple 2D references, e.g. autopick_references.star
    
    let num = -1;
    pipejob.outputs.forEach( (node) => {
      if (node.type === svzm.NODE_MOVIES 
        || node.type === svzm.NODE_MICS 
        || node.type === svzm.NODE_PART_DATA 
        || node.type === svzm.NODE_MOVIES 
        || node.type === svzm.NODE_MOVIE_DATA) {
        try {
          // Get file stats
          let stats = fs.statSync('./'+node.file);
          node.mtime = stats.mtime;
          // Read and Parse
          num = svzm.readSTARHeader(stats)(fs.readFileSync('./'+node.file,'utf-8')).tables[0].my;
          node.numRasters = num;
        }
        catch (err) {
          console.log(err);
        };
      }
    });
    
    return num;
  };
  
  /*
   * Parse the RELION `default_pipeline.star`
   *
   * @params {object} input - STAR Object
   * @return {object} - Graph Object suitable for `D3.js` diagrams
   *
   * @author Jean-Christophe Taveau
   */
  const parsePipeline = (input) => {

    let starobj = Star.create(input);
    
    // Pipeline data structure
    let pipe = {
      comment : 'Created by StarVizEM',
      date: new Date(Date.now()).toString().split(' ').splice(1,4).join('/'),
      files: [
        {
          filename: 'default_pipeline.star',
          timestamp: new Date(filestats.mtime).getTime()
        }
      ],
      jobsnumber: -1,
      jobs : []
    };
    
    // DEPRECATED
    // Get jobs number in table `PipeLineJobCounter`
    // pipe.jobsnumber = starobj.getTable('pipeline_general').getValue('_rlnPipeLineJobCounter') - 1;

    // Get jobs name + aliases
    let table = starobj.getTable('pipeline_processes');
    Array.from({length: table.my}, (v,i) => i).forEach( (index) => {
      let row = table.getRow(index);
      let words = row[0].split('/');
      let job = {
        id : index,
        jobID : Star.getJobID(row[0]),
        name: row[0],                     // _rlnPipeLineProcessName
        alias : row[1],                   // _rlnPipeLineProcessAlias
        path : row[0],
        process : row[2],                 // _rlnPipeLineProcessType
        params : [],
        sources: [],
        targets: [],
        inputs: [],
        outputs: []
      };
      
      pipe.jobs.push(job);
    });

    // Get Node types
    let nodeTypes = starobj.getTable('pipeline_nodes');
      
    // Get Input Edges
    table = starobj.getTable('pipeline_input_edges');
    Array.from({length: table.my}, (v,i) => i)
      .forEach( (index) => {
        // Get source(s) and target(s)
        let inputfile = table.getItem(index,'_rlnPipeLineEdgeFromNode').replace(/^\.\//,'');
        let srcJob = getJob(Star.getJobID(inputfile),pipe);
        let targetid = Star.getJobID(table.getItem(index,'_rlnPipeLineEdgeProcess'));
        let targetJob = getJob(targetid,pipe);
        targetJob.sources.push(srcJob.jobID);
        srcJob.targets.push(targetid);
        // Add input
        let j = nodeTypes.getColumn('_rlnPipeLineNodeName').indexOf(inputfile);
        targetJob.inputs.push({file: inputfile, type: nodeTypes.getItem(j,'_rlnPipeLineNodeType')});
      });

    // Get Output Edges
    table = starobj.getTable('pipeline_output_edges');
    Array.from({length: table.my}, (v,i) => i)
      .forEach( (index) => {
        try {
          let srcid = Star.getJobID(table.getItem(index,'_rlnPipeLineEdgeProcess'));
          let srcJob = getJob(srcid,pipe);
          let outputfile = table.getItem(index,'_rlnPipeLineEdgeToNode').replace(/^\.\//,'');
          let targetid = Star.getJobID(outputfile);
          let targetJob = getJob(targetid,pipe);
          // Only add if unique
          if (srcJob.outputs.find( (out) => outputfile === out.file) === undefined) {
            let j = nodeTypes.getColumn('_rlnPipeLineNodeName').indexOf(outputfile);
            srcJob.outputs.push({file: outputfile, type: nodeTypes.getItem(j,'_rlnPipeLineNodeType')});
          }
        }
        catch (err) {
          console.log(index,err);
        }
      });

    // Get Raster (aka Micrographs, Movies or Particles) Number
    table = starobj.getTable('pipeline_nodes');
    pipe.jobs.forEach( (job) => {
      job.numRasters = getNumRaster(job);
      console.log(job.numRasters);
    } );

    // Update jobs number
    pipe.jobsnumber = pipe.jobs.length;
    return pipe;
  }

  /***** MAIN *****/

  return parsePipeline(starjson);

};

/**
 * Get RELION Pipeline
 */
exports.getPipeline = (filename) => {
  console.log(filename);
  if (fs.existsSync('./StarVizEM/pipeline.json') ) {
    //Check timestamp if file modified
    let timestamp = new Date(fs.statSync(filename).mtime).getTime();
    // Read JSON
    let starjson = JSON.parse(fs.readFileSync('./StarVizEM/pipeline.json','utf-8'));
    if ( starjson.files[0].timestamp === timestamp) {
      console.log(filename + ' already exists')
      return new Promise( (resolve, reject) => resolve(starjson));
    }
  }
  // If not, re-read `default_pipeline.star`
  // Get file stats
  let stats = fs.statSync(filename);
  return svzm.getSTAR(filename).then( (inData) => {
    let pipeline = readPipeline(stats)(inData);
    fs.writeFile("./StarVizEM/pipeline.json", JSON.stringify(pipeline), (err) => console.log(err)); 
    return pipeline;
  }, 
    (err) => console.log(err)
  );

};


