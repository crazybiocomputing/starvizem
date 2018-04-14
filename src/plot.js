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

function createPlot(data, width, height) {
    let svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border", "2px solid rgba(2, 0, 34, 0.897");

    //axis
    let x = d3.scaleLinear()
        .range([0, 90 * width / 100]);

    let y = d3.scaleLinear()
        .range([90 * height / 100, 40]);

    let valueline = d3.line()
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); });


    x.domain(d3.extent(data, function(d) { return d.x; }));
    y.domain([0, d3.max(data, function(d) { return d.y; })]);

    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data))
        .style("stroke", "black")
        .style("stroke-width", "1")
        .style("fill", "none");

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", function(d) {
            return x(d.x)
        })
        .attr("cy", function(d) {
            return y(d.y)
        })
        .style("cursor", "pointer")
        .style("fill", "black")
        .on("mouseover", function(d, i) {

            label.style("transform", "translate(" + x(d.x) + "px," + (y(d.y)) + "px)").style("position", "absolute")
            label.text(d.y);
        });
    svg.append("g")
        .attr("transform", "translate(" + 5 * width / 100 + ",0)")
        .call(d3.axisLeft(y));

    svg.append("g")
        .attr("transform", "translate(" + 5 * width / 100 + ", " + 90 * height / 100 + ")")
        .call(d3.axisBottom(x));

    return svg.node();
}
