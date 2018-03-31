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

const arcDiagram = (data) => {
    
//Width and height variables
let width = 1600;
let height = 500;

//Create SVG
let svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
 
//Color
let color = d3.scaleOrdinal(d3.schemeCategory20);

let simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.alias; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

//Import data
let data=d3.json("graphe1.json", function(error, graph) {
        if (error) throw error;    

//Define link between jobs , doesn't work actually
let link = svg.append("g")
      .attr("class", "jobs")
      .selectAll("line")
      .data(graph.jobs)
    .enter().append("line")
     

//Define nodes
let node= svg.append("g")
    .attr("class", "jobs")
    .selectAll("g")
    .data(graph.jobs)
    .enter().append("g")
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)

//Define circles
let circles = node.append("circle")
      .attr("r", 5)
      .attr("fill", function(d) { return color(d.class); })

//Define text
let lables = node.append("text")
      .text(function(d) {
        return d.alias;
      })
      .attr('x', -2)
      .attr('y', 8);          

simulation
      .nodes(graph.jobs)
      .on("tick", ticked);  


/*simulation.force("link")
      .links(graph.jobs); */   

//Generate coordonnate
function ticked() {
    link
        .attr("x1", function(d) { return d.alias.x; })
        .attr("y1", function(d) { return d.alias.y; })
        .attr("x2", function(d) { return d.targets.x; })
        .attr("y2", function(d) { return d.targets.y; });
    
    node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + 220 + ")";
        })
           
  }

//Enhance height of the object
function mouseover() {
  d3.select(this).select("circle").transition()
      .duration(750)
      .attr("r", 16);
}

//Go back to the default size
function mouseout() {
  d3.select(this).select("circle").transition()
      .duration(750)
      .attr("r", 5);
}  

//create a canvas on the html page corresponding to the jobs that we have click on
function click() {
       
}

//Unselect a job
function dblclick(d) {
  
}

});
};

