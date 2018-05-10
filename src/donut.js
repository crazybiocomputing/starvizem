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
 * @author Marie Economides, Pauline Bock
 */

function createDonut(data, width, height) {
    
    let svg = d3.select("#graph1").append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 600 400")
        .classed("svg-content", true)
        .style("border", "1px solid rgba(2, 0, 34, 0.897");

    let arcWidth = 0.5;
    let arcWidthMouseOut = 0.5;
    let arcWidthMouseOn = 0.45;

    let radius = Math.min(width, height) / 2,
        innerRadius = radius * arcWidth,
        innerRadiusFinal = radius * arcWidthMouseOut,
        innerRadiusZoom = radius * arcWidthMouseOn;

    let color = d3.scaleOrdinal(d3.schemeAccent);

    let arcWidthChange = 20;
    let arc = d3.arc()
        .outerRadius(radius - arcWidthChange)
        .innerRadius(innerRadius);

    let arcFinal = d3.arc().innerRadius(innerRadiusFinal).outerRadius(radius - arcWidthChange);
    let arcZoom = d3.arc().innerRadius(innerRadiusZoom).outerRadius(radius - arcWidthChange);
    
    //tooltip
    let tooltip = d3.select("body").append("div").attr("class", "toolTip");

    let pie = d3.pie()
        .sort(function(a,b){ if (a.labels != "Other" && b.labels != "Other") {return d3.descending(a.nb, b.nb);}})
        .value(function(d) { return d.nb;});

    let g = svg.append("g")
        .attr("class", "arcs")
        .selectAll("g")
        .data(pie(data))
        .enter().append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .attr("id", function (d) { return d.data.labels;})
        .attr("class", "arc")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("mousemove", function(d){
            tooltip.style("left", d3.event.pageX+10+"px");
            tooltip.style("top", d3.event.pageY-25+"px");
            tooltip.style("display", "inline-block");
            tooltip.html("Class "+(d.data.labels)+"<br>"+(d.data.nb)+" images");
        });

    g.append("path")
        //.attr("fill", function(d) {return d3.interpolateRainbow(parseInt(d.data.labels.slice(-3)) / (d.data.length)) })
        .attr("fill", function(d, i) { return color(i); })
        .attr("d", arc)
        .attr("stroke", "#fff");

    function mouseover() {
        tooltip.style("display", null);
        d3.select(this).select("path").transition()
            .duration(750)
            .attr("d", arcZoom)
    }

    function mouseout() {
        tooltip.style("display", "none");
        d3.select(this).select("path").transition()
            .duration(750)
            .attr("d", arcFinal);
    }
    
     //svg title
    svg.append("text")
        .attr("x", (width / 4))             
        .attr("y", 18 )
        .attr("text-anchor", "middle")  
        .style("font-weight","bold")
        .style("font-size", "22px")   
        .text("Number of images per class");  

    return svg.node();
}

