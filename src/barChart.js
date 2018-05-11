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

function createBarChart(data, width, height) {
    //SVG creation and its properties
    let svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border", "2px solid rgba(2, 0, 34, 0.897");

    //Color table
    let color = d3.scaleOrdinal(d3.schemeAccent);

    //Axis x and y
    let x = d3.scaleLinear()
        .range([0, 90 * width / 100]);

    let y = d3.scaleBand()
        .range([90 * height / 100, 40])
        .padding(0.1);

    //Sort the data
    data.sort(function(a, b) { return a.nb - b.nb; });

    //Domain of X and Y axis
    x.domain([0, d3.max(data, function(d) { return d.nb })]);
    y.domain(data.map(function(d) { return d.labels }));

    //Bar creation
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("fill", function(d, i) { return color(i); })
        .attr("x", 9 * width / 100)
        .attr("width", function(d) { return x(d.nb); })
        .attr("y", function(d) { return y(d.labels); })
        .attr("height", y.bandwidth());

    //Add and  calibrate X and Y axis
    svg.append("g")
        .attr("transform", "translate(" + 9 * width / 100 + ",0)")
        .call(d3.axisLeft(y));

    svg.append("g")
        .attr("transform", "translate(" + 9 * width / 100 + ", " + 90 * height / 100 + ")")
        .call(d3.axisBottom(x));

    return svg.node();
}
