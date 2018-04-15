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
    //create svg
    let svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border", "2px solid rgba(2, 0, 34, 0.897");

    let color = d3.scaleOrdinal(d3.schemeAccent);
    let datanode = data.node;
    let datalink = data.links;

    let pad = 30 * height / 100; // actual padding amount
    let radius = 10; // fixed node radius
    let yfixed = pad + radius; // y position for all nodes

    // fix graph links to map to objects instead of indices
    datalink.forEach(function(d, i) {
        d.source = isNaN(d.source) ? d.source : datanode[d.source];
        d.target = isNaN(d.target) ? d.target : datanode[d.target];
    });

    datanode.sort(function(a, b) {
        return a.id - b.id;
    });

    let x = d3.scaleLinear().range([0, 90 * width / 100]);
    x.domain([0, d3.max(datanode, function(d) { return d.id; }) - 1]);

    // calculate pixel location for each node
    datanode.forEach(function(d, i) {
        d.x = x(i);
        d.y = yfixed;
    });

    let nodeRadius = d3.scaleSqrt().range([5, 20]);
    let linkWidth = d3.scaleLinear().range([1.5, 2 * nodeRadius.range()[0]]);

    nodeRadius.domain(d3.extent(datanode, function(d) {
        return d.value;
    }));

    linkWidth.domain(d3.extent(datalink, function(d) {
        return d.value;
    }));

    let node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(datanode)
        .enter().append("circle")
        .attr("r", function(d) {
            return nodeRadius(d.value)
        })
        .attr("cx", function(d) {
            return x(d.id)
        })
        .attr("cy", 300)
        .attr("fill", function(d) { return color(d.process); });

    let labels = svg.append("g")
        .attr("class", "text")
        .selectAll("text")
        .data(datanode)
        .enter().append("text")
        .text(function(d) {
            return "job" + d.id;
        })
        .attr('x', function(d) {
            return x(d.id)
        })
        .attr('y', 2.5 * yfixed + 10)
        .style("writing-mode", "vertical-rl")
        .style("text-orientation", "sideways")
        .style("fill", "black")
        .style("font-size", "14px")
        .style("font-family", "Arial");

    /*
    // scale to generate radians (just for lower-half of circle)
    let radians = d3.scaleLinear()
        .range([Math.PI / 2, 3 * Math.PI / 2]);

    // path generator for arcs (uses polar coordinates)
    let arc = d3.radialLine()
        .angle(function(d) { return radians(d); });

    let links = svg.append("g").selectAll("link")
        .data(datalink)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("transform", function(d, i) {
            let xshift = d.source.x + (d.target.x - d.source.x) / 2;
            let yshift = yfixed;
            return "translate(" + xshift + ", " + yshift + ")";
        })
        .attr("d", function(d, i) {
            // get x distance between source and target
            let xdist = Math.abs(d.source.x - d.target.x);
            // set arc radius based on x distance
            arc.radius(xdist / 2);
            // want to generate 1/3 as many points per pixel in x direction
            let points = d3.range(0, Math.ceil(xdist / 3));
            // set radian scale domain
            radians.domain([0, points.length - 1]);
            return arc(points);
        })
        .style("fill", color)
        .style("stroke", color);
*/



    return svg.node();

}


