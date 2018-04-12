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

let data1 = d3.json("http://localhost:3000/Class2D/job006", function(error, graph) {
    let width = 520,
        height = 450,
        radius = Math.min(width, height) / 2,
        innerRadius = radius * 0.5,
        innerRadiusFinal = radius * .5,
        innerRadiusZoom = radius * .45;

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
        .innerRadius(innerRadius);

    let arcFinal = d3.arc().innerRadius(innerRadiusFinal).outerRadius(radius - 10);
    let arcZoom = d3.arc().innerRadius(innerRadiusZoom).outerRadius(radius - 10);


    let labelArc = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    let pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.nblong; });

    let g = svg.selectAll(".arc")
        .data(pie(graph.imagenbperclass))
        .enter().append("g")
        .attr("class", "arc")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

    g.append("path")
        .attr("fill", function(d, i) { return color(i); })
        .attr("d", arc)
        .attr("stroke", "#fff");

    g.append("text")
        .text(function(d) {
            return d.data.nblong;
        })
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .style("fill", "black")
        .style("font-size", "15px")
        .style("font-family", "Arial");


    svg.append("text")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text("Class2D");

    function mouseover() {
        d3.select(this).select("path").transition()
            .duration(750)
            .attr("d", arcZoom);
    }

    function mouseout() {
        d3.select(this).select("path").transition()
            .duration(750)
            .attr("d", arcFinal);
    }

});
