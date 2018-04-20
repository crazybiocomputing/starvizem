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
    let starobj = Star.create(data);
    let tableStat = starobj.getTable('statistics');
    let tableHisto = starobj.getTable('histogram_resolution');
    //create svg
    let svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border", "2px solid rgba(2, 0, 34, 0.897");

    //create g
    let g = svg.append("g");

    //axis
    let y = d3.scaleLinear()
        .rangeRound([90* height/100,10*height/100]);

    let x = d3.scaleBand()
        .rangeRound([10*height/100,90*width/100])
        .paddingInner(0.2);

    //color
    let z = d3.scaleOrdinal()
    .range(["#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    //let z = d3.scaleOrdinal()
    //    .range([" #FF5733 ", " #FFC300 ", " #DAF7A6 ", " #FFC300 ",  " #DAF7A6 "]);


    //datas
    //let datas = data.imagenbperclass;
    //console.log(datas);

    //keys
    let keys = tableStat.headers.filter( (h) => h.search(/_svzBin\d+/) !== -1);
    console.log(keys);
    let start = tableStat.getColumnIndex('_svzNumberPerClass001');
    let datas = tableHisto.data.map ( (d,j) => {
      let v = {
        total: tableStat.data[start + j],
        name: tableStat.headers[start + j].slice(13)
      };
      keys.map( (key,i) => v[key]= d[i]);
      return v;
    });

    console.log(datas);
    console.log(d3.stack().keys(keys)(datas));
    
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
        var xPosition = d3.mouse(this)[0] - 15;
        var yPosition = d3.mouse(this)[1] - 25;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text((d[1]) - (d[0]));
      });

    //create x axis
    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + 90 * height / 100 + ")")
        .call(d3.axisBottom(x));

    //create y axis
    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + 10 * width / 100 + ",0)")
        .call(d3.axisLeft(y));

    //tooltip
    var tooltip = svg.append("g")
      .attr("class", "tooltip")
      .style("display", "none");

    tooltip.append("rect")
      .attr("width", 30) // set the height and width of the tooltip
      .attr("height", 20)
      .attr("fill", "white")
      .style("opacity", 0.5);

    tooltip.append("text")
      .attr("x", 15) // position of the text in the tooltip
      .attr("dy", "1.2em")
      .style("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold");

    //legend
    var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
      .attr("x", width - 20)// position of each square
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", z);

    legend.append("text")
      .attr("x", width - 25)// position of the text corresponding to squares
      .attr("y", 10)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });







    d3.select("body").append( () => svg.node());
    return svg.node();
}
