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

const readPipeline = (err,data) =>{ 

  const parsemy = (input) => {
    
    //creation of variables and objects in the incoming json
    let joblist = [];
    let targettable = {};
    let inputtable = {};
    let outputtable = {};
    let classes = { "Import" : 1, "MotionCorr":2, "CtfFind":3, "ManualPick":4, "Extract":5, "Class2D":6, "Select": 7, "Autopick" : 8, "Sort" : 9, "InitialModel":10, "Class3D":11, "Refine3D":12, "MaskCreate":13, "PostProcess": 14, "LocalRes": 15, "MovieRefine":16, "Polish":17};
    
    //job structure
    let job = {
      id : 0,
      alias : "default",
      path : "default",
      class : 0,
      targets : [],
      inputs : [],
      outputs : [],
      command : "default",
      params : {},
      error : "default"
    }
     
    //json pipe structure
    let pipe = {
      comment : "Created by STARVIZEM",
      jobsnumber : 0,
      jobs : joblist
      };   
    
    //parsing
    let defjson = JSON.parse(input);

    for (let i = 0; i<defjson.tables.length ; i++){

      //number of jobs
      if (defjson.tables[i].headers[0] == "PipeLineJobCounter"){
        pipe.jobsnumber = parseInt(defjson.tables[i].data[0]);
      }

      //push each jobs in the joblist, data on processes
      if (defjson.tables[i].name == "pipeline_processes"){
        let processes = defjson.tables[i].data;
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
      if (defjson.tables[i].name == "pipeline_input_edges"){
        let inputsjobs = defjson.tables[i].data;
        let nblines = defjson.tables[i].my;
        for (let j=0; j< nblines; j++){
          let data = inputsjobs[j].split(/\//);
          if (data.includes(".")){
            data.shift(0);
          }

          let sourcejob = parseInt(data[1].substr(-3));
          let sourcefile = data[0]+"/"+data[1]+"/"+data[2];
          let targetjob = parseInt(inputsjobs[j+nblines].substr(-4,3));

          for (let index = 0; index < pipe.jobsnumber-1; index++){
            if (joblist[index].id == sourcejob){
              targettable[sourcejob].push(targetjob);
              joblist[index].targets = targettable[sourcejob];
            }
          }

          for (let index = 0; index < pipe.jobsnumber-1; index++){
            if (joblist[index].id == targetjob){
              inputtable[targetjob].push(sourcefile);
            }
            joblist[index].inputs = inputtable[index+1];
          }
          
        }
      }

      //data on output edges
      if(defjson.tables[i].name == "pipeline_output_edges"){
        let outputsjobs = defjson.tables[i].data;
        let nblines = defjson.tables[i].my;
        for (let j =0; j<nblines-1; j++){
          let data = outputsjobs[j+nblines].split(/\//);
          if (data.includes(".") || data.includes("")){
            data.shift(0);
          }
          let outputjob = parseInt(data[1].substr(-3));
          let outputnode = data[0]+"/"+data[1]+"/"+data[2];
          for (let index = 0; index < pipe.jobsnumber-1; index ++){
            if (joblist[index].id == outputjob){
              outputtable[outputjob].push(outputnode);
              joblist[index].outputs = outputtable[outputjob];
            }
          }
        }
        
      }

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
      */
    
    };

    return pipe;
  }

  //MAIN
  if(err){throw err;}
  
  //Parse JSONFile
  let json = parsemy(data);
  if (json.error){
    throw json.error
  }

  let pipeJSON = JSON.stringify(json);
  console.log(pipeJSON);
  return pipeJSON;

}
fs.readFile("default_pipeline.json", "utf-8", readJson);
