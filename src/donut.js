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
 * @author Marie
 * 
 * TODO : add interactive labels, virer les classes trop petites ou les zoomer ... 
 */

function createDonut(data, width, height) {
    let svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border", "2px solid rgba(2, 0, 34, 0.897");

    let radius = Math.min(width, height) / 2,
        innerRadius = radius * 0.5,
        innerRadiusFinal = radius * .5,
        innerRadiusZoom = radius * .45;

    let color = d3.scaleOrdinal(d3.schemeAccent);

    let arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(innerRadius);

    let arcFinal = d3.arc().innerRadius(innerRadiusFinal).outerRadius(radius - 10);
    let arcZoom = d3.arc().innerRadius(innerRadiusZoom).outerRadius(radius - 10);


    let labelArc = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    let pie = d3.pie()
        .value(function(d) { return d.totalnb; });

    let g = svg.append("g")
        .attr("class", "arc")
        .selectAll("g")
        .data(pie(data.imagenbperclass))
        .enter().append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

    g.append("path")
        .attr("fill", function(d, i) { return color(i); })
        .attr("d", arc)
        .attr("stroke", "#fff");

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

