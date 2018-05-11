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

const createArcDiagrams = (rootID,graph) => {
  // Get JSON data from web service
  d3.json('/pipeline').then(function(graph) {
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
      console.log(graph);
      let arcDiagramPlace=document.getElementById(rootID);
      arcDiagramPlace.appendChild(createArcDiagram({nodes: data_nodes,links: data_links}, width, height));
    });
  };


/*
*On a node click, get back node star file data and draw graphs
*
*/
const getSTARFile = (datas) => {
  resetSelect("colY");
  resetSelect("colX");
  resetSelect("table");
  
  console.log('getSTARFile');
  // Get JSON data
  console.log(datas);
  let data = datas.mainOutput.split("/");
  let processName = data[0];
  let jobName = data[1];
  let file = data[2];
  let processNumber = datas.process;
  let jobNumber = datas.id;
  let path = "/"+processName+"/"+jobName+"/";
  console.log("processnb "+ processNumber);
  let jsonFormData={
    process : processNumber,
    job : jobNumber,
    starfile : file
  };
  console.log(JSON.stringify(jsonFormData));
  fetch('/star',{
    headers: new Headers({'Content-Type': 'application/json'}),
    method: "POST",
    mode: 'cors',
    body: JSON.stringify(jsonFormData) // formData
  })
    .then ( (response) => response.json() )
    .then ( (data) => {
      console.log(data);
      starobj = data;
      let graph1 = document.getElementById('graph1');
      let graph2 = document.getElementById('graph2');
      let graph3 = document.getElementById('graph3');
      console.log(graph1.firstChild);
      if(graph1.firstChild) {
        console.log("Change graphs");
        graph1.removeChild(graph1.firstChild);
        graph2.removeChild(graph2.firstChild);
      }
      if(graph3.firstChild){ graph3.removeChild(graph3.firstChild);}
      createXYForm(data);
      createGraph("graph1","graph2",path);
  });
}

const createGraph = (donutID,barchartID,job) => {
    console.log(job);
  // Get JSON data from web service
  d3.json(job).then(function(graph) {
                console.log(graph)
                let width = 600;
                let height = 400;
                let starobj = Star.create(graph);
                let tableStat = starobj.getTable('statistics');
                let tableHisto = starobj.getTable('histogram_resolution');
                let start = tableStat.getColumnIndex('_svzNumberPerClass001');
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
        
  }

  function regroupLowData(data){
    let values = [];
    let deletevalues = [];
    data.forEach(function(e){ return values.push(e.nb); });
    let totalvalues = values.reduce((a, b) => a + b, 0);
    values.sort(function(a,b){ return a-b;});
    let threshval = 5*totalvalues/100;
    let somme = 0;
    let bool = false;
    
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
}

// Events
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

const drawPlot = () => {
  console.log('Draw Plot');
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
  console.log(plot1.firstChild);
  if(plot1.firstChild) {
        console.log("Change graphs");
        plot1.removeChild(plot1.firstChild);
        plot2.removeChild(plot2.firstChild);
      }
  createPlots('plot1','plot2', data);
}

const createPlots = (plot1DID,plot2DID, datas) => {
// Get JSON data from web service
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
  console.log(data);
  
  let plot1Dplace = document.getElementById(plot1DID);
  plot1Dplace.appendChild(createPlot(data, labels, width, height));
  let plot2Dplace = document.getElementById(plot2DID);
  plot2Dplace.appendChild(createCurvePlot(data, labels, width, height));
};  

/**
 * Display MRC(S) Image or Stack
 */
  function displayImage(job, classnumber) {
  
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

    console.log('Display Image');
    console.log(`/mrc${job}run_it025_classes.mrcs`);

    fetch(`/mrc${job}run_it025_classes.mrcs`)
      .then ( (response) => response.blob() )
      .then( (blob) => {
        let fr = new FileReader();
        loadMRC(blob)
          .then( (fr) => {
            // WARNING only display first slice of stack
            let elm = Raster.create(readMRC(fr)).display(0);
            document.body.appendChild(elm);
          });
      });
      
/*
    fetch(`/mrc${job}run_it025_classes.mrcs`)
      .then ( (response) => console.log(JSON.stringify(response)))
      .then ( (data) => {
        console.log(data);
        let fr;
        fr = new FileReader();
        fr.readAsArrayBuffer(data);
        data.onload = readStack;
      });

      function readStack(classnumber) {
        let raster = Raster.create(readMRC(fr));
        let montage = raster.montage(classnumber.substr(-3));
        montage.style = "width:600px;height:273px;border: 1px solid rgba(2, 0, 34, 0.897); margin-right:2%";
        document.getElementById("graph3").appendChild(montage);
      }
*/
  }
    
  function appendText(tagName, innerHTML) {
    var elm;
    elm = document.createElement(tagName);
    elm.innerHTML = innerHTML;
    document.getElementById("graphs").appendChild(elm);
  }

  const resetSelect = (list) => {
    console.log("deleting ... "+ list);
    let tableSelect = document.getElementById(list);
    
    var length = tableSelect.options.length;
    console.log("lenght:" + length);
    for (let i = length-1; i>=0; i--) {
      if (tableSelect.options[i].innerText!="----" && tableSelect.options[i].innerText!="_svzRowNumber"){
        tableSelect.remove(i);
      }
    }
  }
