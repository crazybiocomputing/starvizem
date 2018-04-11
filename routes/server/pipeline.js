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
 * Parse RELION Pipeline Data
 *
 * @params {object} starjson - STAR object
 * @return {object} - Returns a graph ready to display with D3
 *
 * @author Pauline Bock
 * @author Jean-Christophe Taveau
 */
const readPipeline = (starjson) => { 

  /* 
   * Get job in pipeline object
   *
   * @author Jean-Christophe Taveau
   */
  const getJob = (jobID,pipe_obj) => pipe_obj.jobs.find( (job) => job.jobID === jobID) ;

  /*
   * Get number of particles/micrographs/movies in STAR `filename`
   *
   * @author Jean-Christophe Taveau
   */
  const getNumRaster = (process,job,filename) => {
    // TODO
    try {
      let txt = fs.readFileSync(process+job+filename,'utf-8');
      let star = svzm.readSTAR(txt);
      // Only one table
      if (star.tables.length === 1) {
        return star.tables[0].my;
      }
    }
    catch (err) {
    
    };
  };
  
  
  const parsePipeline = (input) => {
    

    const processes = { "Import" : 1, "MotionCorr": 2, "CtfFind":3, "ManualPick":4, "Extract":5, "Class2D":6, "Select": 7, "Autopick" : 8, "Sort" : 9, "InitialModel":10, "Class3D":11, "Refine3D":12, "MaskCreate":13, "PostProcess": 14, "LocalRes": 15, "MovieRefine":16, "Polish":17};
    

    //json pipe structure
    let pipe = {
      comment : 'Created by STARVIZEM',
      date: (new Date()).toString().split(' ').splice(1,4).join('/'),
      jobsnumber : -1,
      jobs : []
    };   
    
    let starobj = Star.create(input);
    
    // Get jobs number in table `PipeLineJobCounter`
    pipe.jobsnumber = starobj.getTable('pipeline_general').getValue('_rlnPipeLineJobCounter');
    

    // Get jobs name + aliases
    let table = starobj.getTable('pipeline_processes'); //getTable('pipeline_processes',input);
    Array.from({length: table.my}, (v,i) => i).forEach( (index) => {
      let row = table.getRow(index);
      let words = row[0].split('/');
      let job = {
        id : index,
        jobID : Star.getJobID(row[0]),
        name: row[0],
        alias : row[1],
        path : row[0],
        process : processes[words[0]],
        params : [],
        targets: [],
        inputs: [],
        outputs: [],
        command : "None",
        error : "None"
      };
      
      pipe.jobs.push(job);
    });

    // Get Input Edges
    // TODO
    table = starobj.getTable('pipeline_input_edges');
    Array.from({length: table.my}, (v,i) => i)
      .forEach( (index) => {
        let inputfile = table.getItem(index,'_rlnPipeLineEdgeFromNode');
        let srcJob = getJob(Star.getJobID(inputfile),pipe);
        let targetid = Star.getJobID(table.getItem(index,'_rlnPipeLineEdgeProcess'));
        let targetJob = getJob(targetid,pipe);
        srcJob.targets.push(targetid);
        targetJob.inputs.push(inputfile);
      });

    // Get Output Edges
    // TODO
    table = starobj.getTable('pipeline_output_edges');
    Array.from({length: table.my}, (v,i) => i)
      .forEach( (index) => {
        try {
          let srcid = Star.getJobID(table.getItem(index,'_rlnPipeLineEdgeProcess'));
          let srcJob = getJob(srcid,pipe);
          let outputfile = table.getItem(index,'_rlnPipeLineEdgeToNode');
          let targetid = Star.getJobID(outputfile);
          let targetJob = getJob(targetid,pipe);
          // srcJob.targets.push(targetid);
          srcJob.outputs.push(outputfile);
        }
        catch (err) {
          console.log(index,err);
        }
      });


/*
    for (let i in input.tables) {
      console.input.tables[i].


      //number of jobs
      if (input.tables[i].headers[0] === "PipeLineJobCounter"){
        pipe.jobsnumber = parseInt(input.tables[i].data[0]);
      }

      //push each job in the joblist, data on processes
      if (input.tables[i].name === "pipeline_processes"){
        let processes = input.tables[i].data;
        for (let j=0; j< pipe.jobsnumber-1; j++){
          const copiedjob = Object.assign({}, job);
          joblist.push(copiedjob);
          joblist[j].path = processes[j];   
          let idnumber = processes[j].substr(-4, 3);
          joblist[j].id = parseInt(idnumber);   
          let jobtype = processes[j].split(/\//)[0];
          let classesname = Object.keys(classes);
          for (let k = 0; k<classesname.length; k++){
            if (jobtype == classesname[k]){
              joblist[j].class = classes[jobtype];
            }
          }
          targettable[parseInt(idnumber)] = [];
          inputtable[parseInt(idnumber)] = [];
          outputtable[parseInt(idnumber)] = [];
        }
        for (let k=pipe.jobsnumber-1; k< (pipe.jobsnumber-1)*2; k++){
          let aliasname = processes[k];
          joblist[k-pipe.jobsnumber+1].alias = aliasname;
        }
      }

      //data on input edges
      if (input.tables[i].name === "pipeline_input_edges"){
        let inputsjobs = input.tables[i].data;
        let nblines = input.tables[i].my;
        for (let j=0; j< nblines; j++){
          let data = inputsjobs[j].split(/\//);
          if (data.includes(".")){
            data.shift(0);
          }

          let sourcejob = parseInt(data[1].substr(-3));
          let sourcefile = data[0]+"/"+data[1]+"/"+data[2];
          let targetjob = parseInt(inputsjobs[j+nblines].substr(-4,3));

          for (let index = 0; index < pipe.jobsnumber-1; index++){
            if (joblist[index].id === sourcejob){
              targettable[sourcejob].push(targetjob);
              joblist[index].targets = targettable[sourcejob];
            }
          }

          for (let index = 0; index < pipe.jobsnumber-1; index++){
            if (joblist[index].id === targetjob){
              inputtable[targetjob].push(sourcefile);
            }
            joblist[index].inputs = inputtable[index+1];
          }
          
        }
      }

      // Data on output edges
      if(input.tables[i].name === "pipeline_output_edges"){
        let outputsjobs = input.tables[i].data;
        let nblines = input.tables[i].my;
        for (let j =0; j<nblines-1; j++){
          let data = outputsjobs[j+nblines].split(/\//);
          if (data.includes(".") || data.includes("")){
            data.shift(0);
          }
          let outputjob = parseInt(data[1].substr(-3));
          let outputnode = data[0]+"/"+data[1]+"/"+data[2];
          for (let index = 0; index < pipe.jobsnumber-1; index ++){
            if (joblist[index].id === outputjob){
              outputtable[outputjob].push(outputnode);
              joblist[index].outputs = outputtable[outputjob];
            }
          }
        }
        
      }
*/
    /* error test
    for(let jb = 0; jb < joblist.length; jb++){
      let jobpath = joblist[jb].path;
      let jobid = joblist[jb].id;
      console.log(jobpath + " " + jobid);
      fs.readFile("./Class2D/job006/"+"run.err", "utf8", function (err, data){
        if (data != ""){
          joblist[jb].error = data;
        }
      });

    
    };
      */
    return pipe;
  }

  /***** MAIN *****/
  
  //Parse JSONFile
  let graph = parsePipeline(starjson);


  let pipeJSON = JSON.stringify(graph);
  // console.log(pipeJSON);
  return graph;

}

/**
 * Get RELION Pipeline
 */
exports.getPipeline = (filename) => {
  console.log(filename);
  return svzm.getSTAR(filename).then(readPipeline, (err) => console.log(err));
};

//fs.readFile("default_pipeline.json", "utf-8", readJson);
