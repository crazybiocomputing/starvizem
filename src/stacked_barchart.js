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

    let color = d3.scaleOrdinal(d3.schemeAccent);


    //axis
    let x = d3.scaleLinear()
        .range([0, 90 * width / 100]);

    let y = d3.scaleBand()
        .range([90 * height / 100, 40])
        .padding(0.1);


    let datas = data.imagenbperclass;


    datas.forEach(function(d) {
      var x0 = 0;
      d.ages = [];

      d3.keys(d).filter(function(key) {return !((key == "classID") || (key == "totalnb") || (key == "ages"));}).forEach(function(name){
        d.ages.push({name: name , x0: x0 , x1: x0 += +d[name]});
    });

    //d.ages.forEach(function(a) {a.x0 /= x0 ,a.x1 /= x0;});
    console.log(d.ages);
});
    svg.append("g")
      .attr("class" , "axis")
      .attr("transform", "translate(" + 5 * width / 100 + ",0)")
      .call(d3.axisLeft(y))
    /*.selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.6em")
      .attr("transform", "rotate(-45)");*/

    svg.append("g")
      .attr("class" , "axis")
      .attr("transform", "translate(" + 7 * width / 100 + ", " + 90 * height / 100 + ")")
      .call(d3.axisBottom(x));

    var classID = svg.selectAll(".classID")
      .data(datas)
      .enter().append("g")
      .attr("class", "classID")
      .attr("transform", function(d) { return "translate(" + (x(d.classID)) + ")"; });
      //.attr("transform", "translate(" + 5 * width / 100 + ",0)")
      //.style("fill", function(d, i) { return color(i); });

    classID.selectAll("rect")
      .data(function(d) { return d.ages; })
      .enter().append("rect")
      .attr("height"  , y.bandwidth())
      .attr("y"      , function(d) { return y(d.x1); })
      .attr("width" , function(d) { return x(d.x1) - x(d.x0); })
      .style("fill" , function(d) { return color(d.name); });



/*
    let stack = d3.stack()
          .keys(["nbHR","nbMR","nbLR"])
          .offset(d3.stackOffsetNone);


    let layers = stack(datas);
          datas.sort(function(a, b) { return a.totalnb - b.totalnb; });
          y.domain(datas.map(function(d) { return d.classID }));
          x.domain([0,d3.max(layers[layers.length-1],  function(d) {return d[0] + d[1] })]);

    svg.selectAll(".bar")
          .data(datas)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("fill", function(d, i) { return color(i); })
          .attr("x", function(d) {return d[0]; })
          .attr("width", function(d) { return d[1] - x(d[0]) })
          .attr("y", function(d) { return y(d.classID); })
          .attr("height", y.bandwidth());

    svg.append("g")
          .attr("transform", "translate(" + 5 * width / 100 + ",0)")
          .call(d3.axisLeft(y));

    svg.append("g")
          .attr("transform", "translate(" + 7 * width / 100 + ", " + 90 * height / 100 + ")")
          .call(d3.axisBottom(x));
*/



    return svg.node();
}
