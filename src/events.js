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

/*
*On a node click, get back node star file data and draw graphs
*
*/
const getSTARFile = (datas) => {
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

/*
*Highlight the graphs elements that are commons
*/
const highlightItems = (e) => {
  //Browse the DOM
  for (let i = 0; i < document.body.childNodes.length; i++) {
    let element = document.body.childNodes[i];
    if (e.id == element.id){
      console.log("same id found "+e.id +" " + element.id);
    } 
  }
}

const setupListeners = () => {
  arcs.addEventlistener("click", highlightItems(e));
  bars.addEventlistener("click", highlightItems(e));
} 

let graph1 = document.getElementById('graph1');
console.log(graph1.firstChild);
if (graph1.firstChild){
  let arcs = document.getElementsByClassName("arcs");
  console.log(arcs);
  let bars = document.getElementsByClassName("bars");
  window.addEventListener("load", setupListeners);
}
