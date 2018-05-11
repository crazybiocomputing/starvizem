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
    let padding = 0.5;
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
    let xRange = [10*width/100,90*width/100];
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
        .style("border", "1px solid rgba(2, 0, 34, 0.897");

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

    let maxLength = d3.max(datas.map(function(d){ return d.name.length}));
    let selectorHeight = 50;
    let heightOverview = 30;
    height -= selectorHeight;
    let barWidth = maxLength * 8;
    let numBars = Math.round(width/barWidth);
    let isScrollDisplayed = barWidth * datas.length > width;
    console.log(isScrollDisplayed);

    //domains for each axis
    datas.sort( (a, b) => b.total - a.total);
    x.domain(datas.map( (d) => d.name));
    y.domain([0,d3.max(datas, (d) => d.total)]);
    z.domain(keys);

    //tooltip
    let tooltip = d3.select("body").append("div").attr("class", "toolTip");

    //create each rect in g
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

        if (isScrollDisplayed)
         {

          let xOverview = d3.scaleBand()
          .domain(datas.map((d) => d.name))
          .rangeRound(xRange);

          let yOverview = d3.scaleLinear()
           .domain([0,d3.max(datas, (d) => d.total)])
           .rangeRound(yRange);

          let subBars = g.selectAll('.subBar')
           .data(d3.stack().keys(keys)(datas));

           console.log(subBars);

           subBars.enter().append("rect")
             .classed('subBar', true)
             .attr("x", function (d) {return xOverview(d.name)})
             .attr("y", function (d) {return yOverview(d.total)})
             .attr("height", function (d) {return yOverview(d.total)})
             .attr("width", function (d) {return xOverview.bandwidth()})

           var displayed = d3.scaleQuantize()
             .domain([0,width])
             .range(d3.range(datas.length));

           g.append("rect")
             .attr("transform", "translate(0, " + (height + 30) + ")")
             .attr("class", "mover")
             .attr("x", 0)
             .attr("y", 0)
             .attr("height", selectorHeight)
             .attr("width", Math.round(parseFloat(numBars * width)/datas.length))
             .attr("pointer-events", "all")
             .attr("cursor", "ew-resize")
             .call(d3.drag().on("drag", display));
       }
           function display () {
               console.log("Hello")
               let p = parseInt(d3.select(this).attr("x")),
                   nx = p + d3.event.dx,
                   w = parseInt(d3.select(this).attr("width"));

               if ( nx < 0 || nx + w > width ) return;

               d3.select(this).attr("x", nx);

               let f = displayed(p);
               let nf = displayed(nx);

               if ( f === nf ) return;

               let new_data = (d3.stack().keys(keys)(datas)).slice(nf, nf + numBars);

               x.domain(new_data.map( (d) => d.name));
               g.select(".axisX").call(xAxis);

               let rects = g.selectAll("rect")
                 .data(new_data, function (d) {return d.name});

               rects.attr("x", function (d) {return x(d.name)});

               rects.enter().append("rect")
               .data((d3.stack().keys(keys)(datas)).slice(0,numBars))
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

               rects.exit().remove();

             }

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
    
    //svg title
    svg.append("text")
    .attr("x", (width / 3.6))             
    .attr("y", 20 )
    .attr("text-anchor", "middle")  
    .style("font-weight","bold")
    .style("font-size", "22px")   
    .text("Resolution of images per class");  

      function zoom() {
        g.attr("transform", d3.event.transform);
      }

    d3.select("body").append( () => svg.node());
    return svg.node();
}
