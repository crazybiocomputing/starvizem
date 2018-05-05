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
    // constants declaration
    let padding = 0.8;
    let cutClassName = 13;
    // for the tooltip
    let tooltipWidth = 30;
    let tooltipHeight = 20;
    let textTooltipPosition = 15;
    let xPositionTooltip = 15;
    let yPositionToolTip = 25;
    let tooltipOpacity = 0.5;
    let squarePosition = width - 20;
    let X_PositionInSquare = width - 25;
    let Y_PositionInSquare = 10;
    // for the zoom
    let minZoom = 1;
    let maxZoom = 6;
    // for the legend
    let legendWidth = 20;
    let legendHeight = 20;
    let legendPadding = 20;
    let legendTextFontSize = 10;
    //for the axis
    let yRange = [90* height/100,10*height/100];
    let xRange = [10*height/100,90*width/100];
    let xTranslate = 90 * height / 100;
    let yTranslate = 10 * width / 100;

    // datas declaration
    let starobj = Star.create(data);
    let tableStat = starobj.getTable('statistics');
    let tableHisto = starobj.getTable('histogram_resolution');

    //create svg
    let svg = d3.select("#graph2").append("svg")
        //.attr("width", width)
        //.attr("height", height)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 600 400")
        .classed("svg-content", true)
        .call(d3.zoom().scaleExtent([1,6])
        .on("zoom",zoom))
        .style("border", "2px solid rgba(2, 0, 34, 0.897");

    //create g
    let g = svg.append("g");

    //axis
    let y = d3.scaleLinear()
        .rangeRound(yRange);

    let x = d3.scaleBand()
        .rangeRound(xRange)
        .paddingInner(padding);

    //color
    let z = d3.scaleOrdinal()
        .range(["#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    let xAxis = d3.axisBottom(x);

    let yAxis = d3.axisLeft(y);

    //keys
    let keys = tableStat.headers.filter( (h) => h.search(/_svzBin\d+/) !== -1);
    let start = tableStat.getColumnIndex('_svzNumberPerClass001');
    let datas = tableHisto.data.map ( (d,j) => {
      let v = {
        total: tableStat.data[start + j],
        name: tableStat.headers[start + j].slice(cutClassName)
      };
      keys.map( (key,i) => v[key]= d[i]);
      return v;
    });

    //domains for each axis
    datas.sort( (a, b) => b.total - a.total);
    x.domain(datas.map( (d) => d.name));
    y.domain([0,d3.max(datas, (d) => d.total)]);
    z.domain(keys);

    //create each rect in g
    g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(datas))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.name); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]) })
      .attr("width", x.bandwidth())
      .on("mouseover", function() { tooltip.style("display", null); })
      .on("mouseout", function() { tooltip.style("display", "none"); })
      .on("mousemove", function(d) {
        var xPosition = d3.mouse(this)[0] - xPositionTooltip;
        var yPosition = d3.mouse(this)[1] - yPositionToolTip;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text((d[1]) - (d[0]));
      });

    //create x axis
    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + xTranslate + ")")
        .call(xAxis);

    //create y axis
    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + yTranslate + ",0)")
        .call(yAxis);

    //tooltip
    var tooltip = svg.append("g")
      .attr("class", "tooltip")
      .style("display", "none");

    tooltip.append("rect")
      .attr("width", tooltipWidth)
      .attr("height", tooltipHeight)
      .attr("fill", "white")
      .style("opacity", tooltipOpacity);

    tooltip.append("text")
      .attr("x", textTooltipPosition)
      .attr("dy", "1.2em")
      .style("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold");

    //legend
    var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", legendTextFontSize)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * legendPadding + ")"; });

    legend.append("rect")
      .attr("x", squarePosition)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("fill", z);

    legend.append("text")
      .attr("x", X_PositionInSquare)
      .attr("y", Y_PositionInSquare)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });

      function zoom() {
        g.attr("transform", d3.event.transform);
      }

    d3.select("body").append( () => svg.node());
    return svg.node();
}
