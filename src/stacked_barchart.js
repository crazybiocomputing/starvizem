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

function createStackedBarChart(data, width, height) {
    let svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border", "2px solid rgba(2, 0, 34, 0.897");
    let g = svg.append("g");

    //axis
    let x = d3.scaleLinear()
        .rangeRound([height,0]);

    let y = d3.scaleBand()
        .rangeRound([0,width])
        .paddingInner(0.2);

    let z = d3.scaleOrdinal()
        .range([" #FF5733 ", " #FFC300 ", " #DAF7A6 "]);

    let datas = data.imagenbperclass;

    let keys = ["nbHR","nbMR","nbLR"];

    datas.sort(function(a, b) { return b.totalnb - a.totalnb; });
    y.domain(datas.map(function(d) { return d.classID }));
    x.domain([0,d3.max(datas,  function(d) {return d.totalnb })]);
    z.domain(keys);

    g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(datas))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("y", function(d) { return y(d.data.classID); })
      .attr("x", function(d) { return x(d[1]); })
      .attr("width", function(d) { return x(d[0]) - x(d[1]); })
      .attr("height", y.bandwidth());


    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,"+ 1* height /100 + ",0)")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," +  9*width/100 + ")")
        .call(d3.axisLeft(y));

    d3.select("body").append( () => svg.node());
    return svg.node();
}
