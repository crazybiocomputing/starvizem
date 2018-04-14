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
/**
 * Create a Donut in svg and returns it
 *
 *
 * @return svg
 *
 * @author Guillaume Sotton
 */

const createPlot = () => {
    let svg = createSVG();
    return svg;
}
     
const createSVG = () => {
    let label = d3.select(".label");
    
    // Set the dimensions 
    let	margin = {top: 30, right: 20, bottom: 30, left: 50},
        width = 600 - margin.left - margin.right,
        height = 270 - margin.top - margin.bottom;
    
    // Parse the date / time
    let	parseDate = d3.timeParse("%d-%b-%y");
    
    // Set the ranges
    let	x = d3.scaleTime().range([0, width]);
    let	y = d3.scaleLinear().range([height, 0]);
    
    // Define the axes
    let	xAxis = d3.axisBottom(x).ticks(5);
    
    let	yAxis = d3.axisLeft(y).ticks(5);
    
    // Define the line
    let	valueline = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.close); });
        
    // Adds the svg canvas
    let	svg = d3.select("body")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // Get the data
d3.json("data.json").then(function(data) {
    
        
    data.forEach(function(d) {
            d.date = parseDate(d.date);
            d.close = +d.close;
        });
    
        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.close; })]);
    
        // Add the valueline path.
        svg.append("path")		
            .attr("class", "line")
            .attr("d", valueline(data))
            .style("stroke","black")
            .style("stroke-width","1")
            .style("fill","none");
            
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 5)
          .attr("cx", function(d) {
            return x(d.date)
          })
          .attr("cy", function(d) {
            return y(d.close)
          })
          .style("cursor","pointer")
          .style("fill","black")
          .on("mouseover", function(d,i) {
      
       label.style("transform", "translate("+ x(d.date) +"px," + (y(d.close)) +"px)").style("position","absolute")
       label.text(d.close)
      
    });
            
        // Add the X Axis
        svg.append("g")			
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
    
        // Add the Y Axis
        svg.append("g")	
            .attr("class", "y axis")
            .call(yAxis);
    
    });
}

