/*
 *  StarVizEM: STAR Files Visualization in CryoEM
 *  Copyright (C) 2018  Jean-Christophe Taveau.
 *
 *  This file is part of StarVizEM
 *
 * The source code is licensed GPLv3.0.
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

function createStackedBarChart(job, data, width, height) {
    //Constants declaration
    let padding = 0.8;
    let cutClassName = 13;

    //For the tooltip
    let tooltipWidth = 30;
    let tooltipHeight = 20;
    let textTooltipPosition = 15;
    let xPositionTooltip = 15;
    let yPositionToolTip = 25;
    let tooltipOpacity = 0.5;
    let squarePosition = width - 20;
    let X_PositionInSquare = width - 25;
    let Y_PositionInSquare = 10;

    //For the zoom
    let minZoom = 1;
    let maxZoom = 6;

    //For the legend
    let legendWidth = 20;
    let legendHeight = 20;
    let legendPadding = 20;
    let legendTextFontSize = 10;

    //For the axis
    let yRange = [90* height/100,10*height/100];
    let xRange = [10*width/100,90*width/100];
    let xTranslate = 90 * height / 100;
    let yTranslate = 10 * width / 100;

    // For the svg title
    let xTitlePosition = (width / 3.6);
    let yTitlePosition = 20;

    //Datas declaration
    let starobj = Star.create(data);
    let tableStat = starobj.getTable('statistics');
    let tableHisto = starobj.getTable('histogram_resolution');

    //SVG creation and responsive properties
    let svg = d3.select("#graph2").append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 600 400")
        .classed("svg-content", true)
        .call(d3.zoom().scaleExtent([1,6])
        .on("zoom",zoom))
        .style("border", "2px solid rgba(63, 127, 191, 0.63)")
        .style("border-radius", "2px")
        .style("background-color", "rgba(253, 254, 253, 0.80)");

    //Create g
    let g = svg.append("g");

    //Axis
    let y = d3.scaleLinear()
        .rangeRound(yRange);

    let x = d3.scaleBand()
        .rangeRound(xRange)
        .paddingInner(padding);

    //Color
    let z = d3.scaleOrdinal()
        .range(["#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    let xAxis = d3.axisBottom(x);
    let yAxis = d3.axisLeft(y);

    //Keys
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

    //Domains for each axis
    datas.sort( (a, b) => b.total - a.total);
    x.domain(datas.map( (d) => d.name));
    y.domain([0,d3.max(datas, (d) => d.total)]);
    z.domain(keys);

    //Tooltip
    let tooltip = d3.select("body").append("div").attr("class", "toolTip");

    //Create each rectangle in g and events associated
    g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(datas))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("id", function (d) { return d.data.name;})
      .attr("class", "bars")
      .attr("x", function(d) { return x(d.data.name); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]) })
      .attr("width", x.bandwidth())
      .on("mouseover", function() { tooltip.style("display", null); })
      .on("mouseout", function() { tooltip.style("display", "none"); })
      .on("mousemove", function(d){
        tooltip.style("left", d3.event.pageX+10+"px");
        tooltip.style("top", d3.event.pageY-25+"px");
        tooltip.style("display", "inline-block");
        tooltip.html((d[1]-d[0])+" images");
      })
      .on("click", function (d) {
        displayImage(job, d.data.name);
      });

    //Create x axis
    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + xTranslate + ")")
        .call(xAxis)
        .selectAll("text")
          .style("text-anchor", "end")
          .attr("font-size", 4.5)
          .attr("dx", "-1.5em")
          .attr("dy", "-1.5em")
          .attr("transform", "rotate(-90)");

    //Create y axis
    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + yTranslate + ",0)")
        .call(yAxis);

    //Legend
    let legend = g.append("g")
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

    //Svg title
    svg.append("text")
    .attr("x", xTitlePosition)
    .attr("y", yTitlePosition)
    .attr("text-anchor", "middle")
    .attr("class", "title")
    .text("Resolution of images per class");

    function zoom() {
        g.attr("transform", d3.event.transform);
    }

    d3.select("body").append( () => svg.node());
    return svg.node();
}
