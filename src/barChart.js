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

let data2 = d3.json("http://localhost:3000/Class2D/job006", function(error, graph) {

    //Width and height variables
    let width = 525;
    let height = 450;

    //Create SVG
    let svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border", "1px solid black")
        .style("background-color", "rgb(180, 188, 215)")
        .style("position", "absolute")
        .style("top", "53%")
        .style("left", "40%")
        .append("g");

    //Color
    let color = d3.scaleOrdinal(d3.schemeCategory20);

    //axis
    let x = d3.scaleLinear()
        .range([0, width - 50]);

    let y = d3.scaleBand()
        .range([height - 50, 40])
        .padding(0.1);

    let datas = graph.imagenbperclass;
    datas.sort(function(a, b) { return a.totalnb - b.totalnb; });

    x.domain([0, d3.max(datas, function(d) { return d.totalnb })]);
    y.domain(datas.map(function(d) { return d.classID }));


    svg.selectAll(".bar")
        .data(datas)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("fill", function(d, i) { return color(i); })
        .attr("x", 40)
        .attr("width", function(d) { return x(d.totalnb); })
        .attr("y", function(d) { return y(d.classID); })
        .attr("height", y.bandwidth());

    svg.append("g")
        .attr("transform", "translate(30,0)")
        .call(d3.axisLeft(y));

    svg.append("g")
        .attr("transform", "translate(40, 400)")
        .call(d3.axisBottom(x));
});
