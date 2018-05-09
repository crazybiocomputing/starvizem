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

function createPlot(data, labels, width, height) {
    let radius=2.5;
    let eventDuration=200;
    let nbTicks=5;
    let opacity=0.9;
    let tooltipOpacity=0;
    let gridlinesOpacity=0.2;
    let xrangeMin=10 * width / 100;
    let xrangeMax= 90 * width / 100;
    let yrangeMin=90 * height / 100;
    let yrangeMax=10 * height / 100;
    let yTranslateMin=10 * width / 100;
    let yTranslateMax=0;
    let xTranslateMin=0;
    let xTranslateMax=10 * height / 100;

  let svg = d3.select("#plot2").append("svg")
      //.attr("width", width)
      //.attr("height", height)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 600 400")
      .classed("svg-content", true)
      .style("border", "2px solid rgba(2, 0, 34, 0.897");

  let div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", tooltipOpacity);

  //axis
  let x = d3.scaleLinear()
      .range([10 * width / 100, 90 * width / 100]);

  let y = d3.scaleLinear()
      .range([90 * height / 100, 10 * height / 100 ]);

  
  let valueline = d3.line()
      .x(function(d) { return x(d.x); })
      .y(function(d) { return y(d.y); });


  x.domain([d3.min(data,function(d)  { return d.x; }),d3.max(data,function(d)  { return d.x; })]);
  y.domain([d3.max(data, function(d) { return d.y; }),d3.min(data,function(d)  { return d.y; })]);

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
      .attr("r", radius)
      .attr("cx", function(d) {
          return x(d.x)
      })
      .attr("cy", function(d) {
          return y(d.y)
      })
      .style("fill", "black")
      .on("mouseover", function(d) {
          div.transition()
            .duration(eventDuration)
            .style("opacity", opacity);
          div .html(
            "<strong>"+"X: "+"</strong>"+d.x + "</br>"+            
            "<strong>"+"Y: "+"</strong>"+d.y)     
            .style("left", (d3.event.pageX) + "px")             
            .style("top", (d3.event.pageY ) + "px");
          });
   
  svg.append("g")
      .attr("transform", "translate(" + yTranslateMin + ","+ yTranslateMax+")")
      .call(d3.axisLeft(y));
 
  svg.append("text")
       .attr("text-anchor", "middle")
       .attr("transform", "translate("+(width - (width-15)) +","+(height/2)+")rotate(-90)")
       .text(labels.ylabel);

  svg.append("g")
      .attr("transform", "translate("+xTranslateMin+ "," + xTranslateMax + ")")
      .call(d3.axisTop(x));
 
  svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate("+(width/2) +","+(height - (height-20))+")")
      .text(labels.xlabel);

  svg.append("g")			
      .attr("class", "grid")
      .call(make_y_gridlines()
          .tickSize(-width)
          .tickFormat("")
      )
      .attr("transform", "translate(" + yTranslateMin + ","+ yTranslateMax+")")
      .style("opacity",gridlinesOpacity)


  svg.append("g")			
      .attr("class", "grid")
      .attr("transform", "translate("+xTranslateMin+ "," + xTranslateMax + ")")
      .call(make_x_gridlines()
          .tickSize(-height)
          .tickFormat("")
      )   
      .style("opacity",gridlinesOpacity)
      
  function make_x_gridlines() {		
        return d3.axisTop(x)
            .ticks(nbTicks)
    }   

  function make_y_gridlines() {		
        return d3.axisLeft(y)
            .ticks(nbTicks)
    }    

  return svg.node();
}
