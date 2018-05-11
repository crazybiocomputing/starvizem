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

/**
 * @param {string} rootID 
 * @param {json Object} graph 
 * @author Marie Economides
 * 
 * Get pipeline data, change data, create an arc diagram and add it to the DOM
 */
const createArcDiagrams = (rootID,graph) => {
  let width = 1600;
  let height = 300;
  let data_nodes = [];
  let data_links = [];
  graph.jobs.forEach((d) => {
    data_nodes.push({
      id: d.jobID,
      process: d.process,
      value: d.targets.length,
      name: d.name,
      alias: d.alias,
      //Get the first output file by default
      mainOutput: d.outputs[0].file
      });
      if (d.targets.length !== 0) {
        d.targets.forEach((t) => {
          data_links.push({
          source: d.jobID,
          value: d.targets.length,
          target: t
          });
        });
      }
    });
    let arcDiagramPlace=document.getElementById(rootID);
    arcDiagramPlace.appendChild(createArcDiagram({nodes: data_nodes,links: data_links}, width, height));
  };

/**
 * @param {Object} datas 
 * @author J-C Taveau, Pauline Bock
 * 
 * On a node click, get back node star file data and draw graphs
 */
const getSTARFile = (datas) => {
  //Reset the options in the selection bar for plots
  resetSelect("colY");
  resetSelect("colX");
  resetSelect("table");
  
  let data = datas.mainOutput.split("/");
  let processName = data[0];
  let jobName = data[1];
  let file = data[2];
  let processNumber = datas.process;
  let jobNumber = datas.id;
  let path = "/"+processName+"/"+jobName+"/";
  let jsonFormData={
    process : processNumber,
    job : jobNumber,
    starfile : file
  };
  //Get data from star file
  fetch('/star',{
    headers: new Headers({'Content-Type': 'application/json'}),
    method: "POST",
    mode: 'cors',
    body: JSON.stringify(jsonFormData)
  })
    .then ( (response) => response.json() )
      .then ( (data) => {
        starobj = data;
        let graph1 = document.getElementById('graph1');
        let graph2 = document.getElementById('graph2');
        let graph3 = document.getElementById('graph3');
        //Remove the previous graphs if exist
        if (graph1.firstChild) {
          graph1.removeChild(graph1.firstChild);
          graph2.removeChild(graph2.firstChild);
        }
        //Remove the previous images
        if (graph3.firstChild) {
          graph3.removeChild(graph3.firstChild);
        }
        createXYForm(data);
        createGraph("graph1","graph2",path);
      });
};

/**
 * @param {string} donutID 
 * @param {string} barchartID 
 * @param {string} job 
 * @author Marie Economides
 * 
 * Get the data of the job, draw graphs and add them to the DOM
 */
const createGraph = (donutID,barchartID,job) => {
  // Get JSON data from web service
  d3.json(job).then(function(graph) {
    let width = 600;
    let height = 400;
    let starobj = Star.create(graph);
    let tableStat = starobj.getTable('statistics');
    let tableHisto = starobj.getTable('histogram_resolution');
    let start = tableStat.getColumnIndex('_svzNumberPerClass001');
    //Get data and adapt it
    let datas = tableHisto.data.map ( (d,i) => ({
      nb: tableStat.data[start + i],
      labels: tableStat.headers[start + i].slice(13)
    }));
    let dataR = regroupLowData(datas);
    let donutplace= document.getElementById(donutID);
    donutplace.appendChild(createDonut(job, dataR, width, height));
  });
  d3.json(job).then(function(graph) {
    let width = 600;
    let height = 400;
    let barplace = document.getElementById(barchartID);
    barplace.appendChild(createStackedBarChart(job, graph, width, height));
  });
};

/**
 * @param {Object} data 
 * @author Pauline Bock
 * 
 * Regroup smallest data staying under 5% of data
 */
function regroupLowData(data){
  let values = [];
  let deletevalues = [];
  data.forEach(function(e){ values.push(e.nb); });
  let totalvalues = values.reduce((a, b) => a + b, 0);
  values.sort(function(a,b){ return a-b;});
  let threshval = 5*totalvalues/100;
  let somme = 0;
  let bool = false;
  //Adding smallest data checking to not exceed 5%
  for (let i = 0; i < values.length; i++){
    somme = somme + values[i];
    if (somme >= threshval){
      let index = i-1;
      somme = somme - values[i];
      for(let j = 0; j < index; j++){
        deletevalues.push(values.shift());
        bool = true;
      }
      if (bool == true){
        values.push(somme);
      }
      break;
    }
  }
  for (let i = 0; i < data.length; i++){
    for (let j = 0; j < deletevalues.length; j++){
      if (deletevalues[j]){
        data = data.filter(function (item){
          return item.nb !== deletevalues[j]
        });
      }
    }
  }
  if (deletevalues.length != 0){
    data.push({labels: "Other", nb: somme });
  }
  return data;
};

/**
 * @param {event} event 
 * @author J-C Taveau
 * 
 * For each columns in tables in star file selected, add options shiwing tables and columns
 */
const changeTableHandler = (event) => {
  let table = starobj.tables.find( (table) => table.name === event.target.value);
  let selectX = document.getElementById('colX');
  for (head of table.headers) {
    let opt = document.createElement('option');
    opt.value = head;
    opt.text = head;
    selectX.appendChild(opt);
  }
  let selectY = document.getElementById('colY');
  for (head of table.headers) {
    let opt = document.createElement('option');
    opt.value = head;
    opt.text = head;
    selectY.appendChild(opt);
  }
};

/**
 * @author J-C Taveau, Pauline Bock, Guillaume Sotton
 * 
 * For the selected table and columns, display plots
 */
const drawPlot = () => {
  let formData = new FormData(document.getElementById('getPlot'));
  let cols = [];
  let table;
  for (let pair of formData.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
    if (pair[0] !== "table") {cols.push(pair[1]);}
    if (pair[0] == "table") {table = pair[1]};
  }
  let starclass = Star.create(starobj);
  let dataTable = starclass.getTable(table);
  let data = cols.map( (d,i) => {
    let v = {
      name : d,
      d : dataTable.getColumn(d)
    };
    return v;
  });
  let plot1 = document.getElementById('plot1');
  let plot2 = document.getElementById('plot2');
  //Remove previous plots if exist
  if(plot1.firstChild) {
    plot1.removeChild(plot1.firstChild);
    plot2.removeChild(plot2.firstChild);
  }
  createPlots('plot1','plot2', data);
};

/**
 * @param {string} plot1DID 
 * @param {string} plot2DID 
 * @param {Object} datas 
 * @author Marie Economides, Guillaume Sotton
 * 
 * Get the data from a table of a job, draw plots and add them to the DOM
 */
const createPlots = (plot1DID,plot2DID, datas) => {
  let width = 600;
  let height = 400;
  let data = [];
  let labels = { 
    xlabel : datas[0].name,
    ylabel : datas[1].name
  };
  for (let i = 0; i < datas[0].d.length; i++){
    let temp = {};
    temp["x"] = datas[0].d[i];
    temp["y"] = datas[1].d[i];
    console.log(temp);
    data.push(temp);
  }  
  let plot1Dplace = document.getElementById(plot1DID);
  plot1Dplace.appendChild(createPlot(data, labels, width, height));
  let plot2Dplace = document.getElementById(plot2DID);
  plot2Dplace.appendChild(createCurvePlot(data, labels, width, height));
};  

/**
 *@param {string} job
 *@param {string} classnumber
 *@author J-C Taveau, Guillaume Sotton, Pauline Bock
 *
 * Display MRC(S) Image or Stack
 */
const displayImage = (job, classnumber) => {
  function loadMRC(blob) {
    return new Promise((resolve, reject) => {
      let fr = new FileReader();  
      fr.onload = () => {
        resolve(fr);
        console.log(fr);
      };
        fr.readAsArrayBuffer(blob);
    });
  }
  fetch(`/mrc${job}run_it025_classes.mrcs`)
    .then ( (response) => response.blob() )
      .then( (blob) => {
        let fr = new FileReader();
        loadMRC(blob)
          .then( (fr) => {
            let graph3 = document.getElementById("graph3");
            if (graph3.firstChild){
              graph3.removeChild(graph3.firstChild);
            }
            let tile = document.createElement("svg");
            tile.setAttribute("style", "width: 600px; height:400 px; border: solid 1px;");
            tile.setAttribute("viewBox", "0 0 600 400");
            tile.setAttribute("preserveAspectRatio", "xMinYMin meet");
            tile.setAttribute("svg-content", "false");
            graph3.appendChild(tile);
            let classindex = parseInt(classnumber.substr(-3))-1;
            let elm = Raster.create(readMRC(fr)).display(classindex);
            elm.setAttribute("style", "width:30%; height:40%; display: block; margin:auto; margin-top:18%;");
            tile.appendChild(elm);
          });
    });
};

/**
 * @param {string} list 
 * @author Pauline Bock
 * 
 * Reset the options from a select bar in the DOM
 */
const resetSelect = (list) => {
  let tableSelect = document.getElementById(list);
  let length = tableSelect.options.length;
  for (let i = length-1; i>=0; i--) {
    if (tableSelect.options[i].innerText!="----" && tableSelect.options[i].innerText!="_svzRowNumber"){
      tableSelect.remove(i);
    }
  }
};
