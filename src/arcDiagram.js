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
 * @author Marie
 * 
 * TODO : ordre des noeuds, flèches, taille circle, clic nodes => en cours de modif 
 */

function createArcDiagram(data, width, height) {
    let svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border", "2px solid rgba(2, 0, 34, 0.897");

    let color = d3.scaleOrdinal(d3.schemeAccent);

    let node = svg.append("g")
        .attr("class", "jobs")
        .selectAll("g")
        .data(data.jobs)
        .enter().append("g");

    let circle = node.append("circle")
        .attr("r", 8)
        .attr("fill", function(d) { return color(d.process); });

    let labels = node.append("text")
        .text(function(d) {
            return "job" + d.jobID;
        })
        .attr('x', -2)
        .attr('y', 8)
        .style("writing-mode", "vertical-rl")
        .style("text-orientation", "sideways")
        .style("fill", "black")
        .style("font-size", "10px")
        .style("font-family", "Arial");

    let link = svg.append("g")
        .selectAll("link")
        .data(data.jobs)
        .append("line")
        .attr("class", "link")
        .enter().append("g");

    let simulation = d3.forceSimulation()
        .force("charge", d3.forceManyBody())
        //.force("link", d3.forceLink().id(function(d) { return d.jobs }))
        //.force("collide", d3.forceCollide().radius(12))
        .force("center", d3.forceCenter(width / 2, height / 2));


    simulation
        .nodes(data.jobs)
        //.force("link").links(data.jobs)
        .on("tick", ticked);


    function ticked() {
        node
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + 200 + ")";
            })

        link.attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });

    }

    return svg.node();
}


