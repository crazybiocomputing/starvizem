/**
 * Create a Donut in svg and returns it
 *
 *
 * @return svg
 *
 * @author Guillaume Sotton
 */

'use strict';

function createPlot(data, width, height) {
    let svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border", "2px solid rgba(2, 0, 34, 0.897");
 
    let div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    //axis
    let x = d3.scaleLinear()
        .range([5 * width / 100, 90 * width / 100]);

    let y = d3.scaleLinear()
        .range([90 * height / 100, 5 * height / 100 ]);

    
    let valueline = d3.line()
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); });


    x.domain([0,d3.max(data,function(d)  { return d.x; })]);

    //x.domain(data.map(function(d){return d.x;}));
    y.domain([0,d3.max(data, function(d) { return d.y; })]);

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
        .attr("r", 5)
        .attr("cx", function(d) {
            return x(d.x)
        })
        .attr("cy", function(d) {
            return y(d.y)
        })
        .style("fill", "black")
        .on("mouseover", function(d) {
            div.transition()
              .duration(200)
              .style("opacity", .9);
            div .html(
              "<strong>"+"Y: "+"</strong>"+d.y + "</br>"+            
              "<strong>"+"X: "+"</strong>"+d.x)     
              .style("left", (d3.event.pageX) + "px")             
              .style("top", (d3.event.pageY ) + "px");
            });
     
    svg.append("g")
        .attr("transform", "translate(" + 5 * width / 100 + ",0)")
        .call(d3.axisLeft(y));

    svg.append("g")
        .attr("transform", "translate(" + 0 + ", " + 90 * height / 100 + ")")
        .call(d3.axisBottom(x));

    return svg.node();
}
