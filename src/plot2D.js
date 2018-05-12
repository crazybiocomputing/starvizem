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
 * Create a 2Dimension plot in svg and returns it
 *
 *
 * @return svg
 *
 * @author Guillaume Sotton
 */

'use strict';

function createPlot(data, labels, width, height) {
  //Attributes
  let radius=2.5;
  let eventDuration=200;
  let nbTicks=5;
  let opacity=0.9;
  
  //Tooltip
  let tooltipOpacity=0;
  let positionLeftTooltip=10;
  let positionTopTooltip=25;
  let gridlinesOpacity=0.2;

  //Domain and range
  let xrangeMin=10 * width / 100;
  let xrangeMax= 90 * width / 100;
  let yrangeMin=90 * height / 100;
  let yrangeMax=10 * height / 100;
  let yTranslateMin=10 * width / 100;
  let yTranslateMax=0;
  let xTranslateMin=0;
  let xTranslateMax=10 * height / 100;

  //Labels Transform
  let ylabelTransX=(width - (width-15));
  let ylabelTransY=(height/2);
  let xlabelTransX=(width/2);
  let xlabelTransY=(height - (height-20))

  //SVG creation and responsive properties
  let svg = d3.select("#plot2").append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 600 400")
      .classed("svg-content", true)
      .style("border", "2px solid rgba(63, 127, 191, 0.63)")
      .style("border-radius", "2px")
      .style("background-color", "rgba(253, 254, 253, 0.80)");

  //Tooltip variable
  let div = d3.select("body").append("div")
      .attr("class", "toolTip");

  //Axis
  let x = d3.scaleLinear()
      .range([xrangeMin,xrangeMax]);

  let y = d3.scaleLinear()
      .range([yrangeMin,yrangeMax]);

  let valueline = d3.line()
      .x(function(d) { return x(d.x); })
      .y(function(d) { return y(d.y); });

  //Axis domain
  x.domain([d3.min(data,function(d)  { return d.x; }),d3.max(data,function(d)  { return d.x; })]);
  y.domain([d3.max(data, function(d) { return d.y; }),d3.min(data,function(d)  { return d.y; })]);

  svg.append("path")
      .attr("class", "line")
      .attr("d", valueline(data))
      .style("stroke", "black")
      .style("stroke-width", "1")
      .style("fill", "none");

  //Circle creation and events
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
      .on("mouseover",function(){div.style("display",null);})
      .on("mouseout",function(){div.style("display","none");})
      .on("mousemove", function(d){
        div.style("left", d3.event.pageX+positionLeftTooltip+"px");
        div.style("top", d3.event.pageY-positionTopTooltip+"px");
        div.style("display", "inline-block");
        div.html("X:"+(d.x)+"<br>"+"Y:"+(d.y));
      });
      
  //Axis creation and calibration     
  svg.append("g")
      .attr("transform", "translate(" + yTranslateMin + ","+ yTranslateMax+")")
      .call(d3.axisLeft(y));
 
  //Axis labels
  svg.append("text")
       .attr("text-anchor", "middle")
       .attr("transform", "translate("+ylabelTransX +","+ylabelTransY+")rotate(-90)")
       .text(labels.ylabel);

  svg.append("g")
      .attr("transform", "translate("+xTranslateMin+ "," + xTranslateMax + ")")
      .call(d3.axisTop(x));
 
  svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate("+xlabelTransX +","+xlabelTransY+")")
      .text(labels.xlabel);

  //Graph gridelines
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

  //Make gridelines
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
