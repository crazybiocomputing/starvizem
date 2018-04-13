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
 * Create Arc Diagram
 *
 * @author TODO
 */
const createArcDiagram = (data,width,height) = {
  let svg = d3.create("svg");
  // TODO
  
  return svg;
};


d3.json("http://localhost:3000/pipeline", function(error, graph) {

    //Width and height variables
    let width = 1600;
    let height = 400;

    //Create SVG
    let svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border", "2px solid rgba(2, 0, 34, 0.897")
        .style("background-color", "rgb(161, 192, 228)")
        .style("opacity", "0.8")
        .style("position", "absolute")
        .style("top", "10%")
        .style("left", "10%");

    //Color
    let color = d3.scaleOrdinal(d3.schemeCategory20);

    let simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.jobID; }))
        .force("charge", d3.forceManyBody().strength(-100).distanceMin(120))
        .force("collide",d3.forceCollide( function(d){return d.r + 8 }).iterations(16) )
        .force("center", d3.forceCenter(width / 2, height / 2));

    //Import data

    //Define link between jobs , doesn't work actually
    let link = svg.append("g")
        .attr("class", "jobs")
        .selectAll("line")
        .data(graph.jobs)
        .enter().append("line")


    //Define nodes
    let node = svg.append("g")
        .attr("class", "jobs")
        .selectAll("g")
        .data(graph.jobs)
        .enter().append("g")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("click", function(d) {
            if (d3.event.defaultPrevented) return;
            // always select this node
            d3.select(this).classed("selected", d.selected = !d.previouslySelected);
            if (d.path == "Class2D/job006/"){
                console.log("c'est une classe 2D");
                let s = document.createElement('script');
                s.type = "text/javascript";
                s.setAttribute('src','../js/donut.js');
                document.getElementById('root').appendChild(s);
                let s2 = document.createElement('script');
                s2.type = "text/javascript";
                s2.setAttribute('src','../js/barChart.js');
                document.getElementById('root').appendChild(s2);
            }
        });

    //Define circles
    let circles = node.append("circle")
        .attr("r", 5)
        .attr("fill", function(d) { return color(d.process); })

    //Define text
    let labels = node.append("text")
        .text(function(d) {
            return "job"+d.jobID;
        })
        .attr('x', -2)
        .attr('y', 8)
        .style("writing-mode", "vertical-rl")
        .style("text-orientation", "sideways")
        .style("fill", "black")
        .style("font-size", "10px")
        .style("font-family", "Arial");

    simulation
        .nodes(graph.jobs)
        .on("tick", ticked);


    /*simulation.force("link")
          .links(graph.jobs); */

    //Generate coordonnate
    function ticked() {
        link
            .attr("x1", function(d) { return d.id.x; })
            .attr("y1", function(d) { return d.id.y; })
            .attr("x2", function(d) { return d.targets.x; })
            .attr("y2", function(d) { return d.targets.y; });

        node
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + 200 + ")";
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


});


