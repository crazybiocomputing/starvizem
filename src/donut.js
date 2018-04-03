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

let data1 = d3.json("chart.json", function(error, graph) {
    let width = 520,
        height = 450,
        radius = Math.min(width, height) / 2;

    let color = d3.scaleOrdinal(d3.schemeCategory20);

    let svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border", "1px solid black")
        .style("background-color", "rgb(180, 188, 215)")
        .style("position", "absolute")
        .style("top", "53%")
        .style("left", "10%")
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


    let arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    let labelArc = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    let pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.nblong; });

    let g = svg.selectAll(".arc")
        .data(pie(graph.imagenbperclass))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("fill", function(d) { return color(d.imagenbperclass); })
        .attr("d", arc)
        .attr("stroke", "#fff");


    g.append("text")
        .text(function(d) { return d.nblong; })
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .attr("font", "10px sans-serif")
        .attr("text-anchor", "middle");

});