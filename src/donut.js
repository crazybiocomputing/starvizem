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
        //.attr("width",width)
        //.attr("height",height)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 600 400")
        .classed("svg-content", true)
        .style("border", "2px solid rgba(2, 0, 34, 0.897");
    
    svg.append("g")
    .attr("class", "labelName");

    svg.append("g")
    .attr("class", "labelValue");

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
    
    let legendBoxSize = (radius * 0.05);
    let legendSpacing = (radius * 0.02);

    let div = d3.select("body").append("div").attr("class", "toolTip");

    let pie = d3.pie()
        .sort(function(a,b){ if (a.labels != "Other" && b.labels != "Other") {return d3.descending(a.nb, b.nb);}})
        .value(function(d) { return d.nb;});

    let g = svg.append("g")
        .attr("class", "arc")
        .selectAll("g")
        .data(pie(data))
        .enter().append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("mousemove", function(d){
            div.style("left", d3.event.pageX+10+"px");
            div.style("top", d3.event.pageY-25+"px");
            div.style("display", "inline-block");
            div.html("Class "+(d.data.labels)+"<br>"+(d.data.nb)+" images");
        });

    g.append("path")
        //.attr("fill", function(d) {return d3.interpolateRainbow(parseInt(d.data.labels.slice(-3)) / (d.data.length)) })
        .attr("fill", function(d, i) { return color(i); })
        .attr("d", arc)
        .attr("stroke", "#fff");
    
    let hzshift = 3;
    let legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (d,i) {
            let h = legendBoxSize + legendSpacing;
            let offset = h * color.domain().length / 2;
            let horiz = -hzshift * legendBoxSize;
            let vert = i * h - offset;
            return "translate(" + horiz + "," + vert + ")";
        });

    legend.append("rect")
        .attr("width", legendBoxSize)
        .attr("height", legendBoxSize)
        .style("fill", color)
        .style("stroke", color);

    legend.append("text")
        .attr("x", legendBoxSize + legendSpacing)
        .attr("y", legendBoxSize - legendSpacing)
        .text(function(d){return d;});

    function mouseover() {
        d3.select(this).select("path").transition()
            .duration(750)
            .attr("d", arcZoom)
    }

    function mouseout() {
        d3.select(this).select("path").transition()
            .duration(750)
            .attr("d", arcFinal);
    }

    return svg.node();
}

