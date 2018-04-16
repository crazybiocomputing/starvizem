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
 
/**
 * Create a Donut in svg and returns it
 *
 *
 * @return svg
 *
 * @author Guillaume Sotton
 */

'use strict';

function createPlot(data, width, height) {
  let svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .style("border", "2px solid rgba(2, 0, 34, 0.897");

  let div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  //axis
  let x = d3.scaleLinear()
      .range([5 * width / 100, 90 * width / 100]);

  let y = d3.scaleLinear()
      .range([90 * height / 100, 5 * height / 100 ]);

  
  let valueline = d3.line()
      .x(function(d) { return x(d.x); })
      .y(function(d) { return y(d.y); });


  x.domain([0,d3.max(data,function(d)  { return d.x; })]);
  y.domain([d3.max(data, function(d) { return d.y; }),0]);

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
      .style("fill", "black")
      .on("mouseover", function(d) {
          div.transition()
            .duration(200)
            .style("opacity", .9);
          div .html(
            "<strong>"+"X: "+"</strong>"+d.x + "</br>"+            
            "<strong>"+"Y: "+"</strong>"+d.y)     
            .style("left", (d3.event.pageX) + "px")             
            .style("top", (d3.event.pageY ) + "px");
          });
   
  svg.append("g")
      .attr("transform", "translate(" + 30 + "," + 0 * width / 100 +")")
      .call(d3.axisLeft(y));

  svg.append("g")
      .attr("transform", "translate(" + 0 +   "," + 30 +")")
      .call(d3.axisTop(x));


  svg.append("g")			
      .attr("class", "grid")
      .call(make_y_gridlines()
          .tickSize(-width)
          .tickFormat("")
      )
      .attr("transform", "translate(" + 30 + "," + 0 * width / 100 +")")
      .style("opacity","0.2")


  svg.append("g")			
      .attr("class", "grid")
      .attr("transform", "translate("+0+ "," +30 + ")")
      .call(make_x_gridlines()
          .tickSize(-height)
          .tickFormat("")
      )   
      .style("opacity","0.2")
      
  function make_x_gridlines() {		
        return d3.axisTop(x)
            .ticks(5)
    }   

  function make_y_gridlines() {		
        return d3.axisLeft(y)
            .ticks(5)
    }    

  return svg.node();
}
