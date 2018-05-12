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
 * Create Arc Diagram
 *
 * @author Marie , Pauline , Guillaume
 * 
 */

function createArcDiagram(data, width, height) {
    
    //SVG creation and responsive properties
    let svg = d3.create("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 1600 300")
        .classed("svg-content", true)
        .style("border", "2px solid rgba(63, 127, 191, 0.63)")
        .style("border-radius", "2px")
        .style("background-color", "rgba(253, 254, 253, 0.80)");

    let datanode = data.nodes;
    let datalink = data.links;

    //Attributes
    let pad = 33 * height / 100; // actual padding amount
    let radius = 10; // fixed node radius
    let yfixed = pad + radius; // y position for all nodes

    let x = d3.scaleLinear().range([5 * width / 100, 90 * width / 100]);
    x.domain([0, d3.max(datanode, function(d) { return d.id; }) - 1]);

    //Calculate pixel location for each node
    let svgnode = datanode.map(function(d, i) {
        let out = {
            x: x(i),
            y: yfixed,
            value: d.value,
            id: d.id,
            process: d.process,
            name: d.name,
            alias: d.alias,
            mainOutput: d.mainOutput
        }
        return out;
    });

    let svglink = datalink.map(function(d) {
        let out = {
            source: d.source,
            xsource: svgnode[d.source - 1].x,
            target: d.target,
            xtarget: svgnode[d.target - 1].x,
            y: 2.2 * yfixed,
            value: d.value
        }
        return out;
    })
  
    //Node radius 
    let nodeRadius = d3.scaleSqrt().range([5, 20]);
    nodeRadius.domain(d3.extent(datanode, function(d) {
        return d.value;
    }));

    // Generates a tooltip for a SVG circle element based on its ID
    function addTooltip(circle) {
        let x = parseFloat(circle.attr("cx"));
        let y = parseFloat(circle.attr("cy"));
        let r = parseFloat(circle.attr("r"));
        let text = circle.attr("id");

        let tooltip = d3.select("svg")
            .append("text")
            .text(text)
            .attr("x", x)
            .attr("y", y + 13.5)
            .attr("dy", r * 1.2)
            .attr("id", "tooltip");

        let offset = tooltip.node().getBBox().width / 2;

        tooltip.attr("text-anchor", "middle");
        tooltip.attr("dx", 0);
    }

    //Nodes creation and their properties
    let node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(svgnode)
        .enter().append("circle")
        .attr("r", function(d) {
            return nodeRadius(d.value)
        })
        .attr("cx", function(d) {
            return d.x
        })
        .attr("cy", 2.4 * yfixed)
        .attr("id", function(d, i) {
            if (d.alias !== "None") {
                return d.alias.substr(0, d.alias.length - 1)
            } else {
                let job = d.name;
                return job.substr(-7, 6);
            }
        })
        .attr("fill", function(d) { return d3.interpolateRainbow(d.process / 20) })
        .on('mouseover', function(d) {
            addTooltip(d3.select(this))
            let thisNode = d.id
            let connected = data.links.filter(function(e) {
                return e.source === thisNode || e.target === thisNode
            });
           
             link.style("stroke", function(d) {
                return (d.source == thisNode || d.target== thisNode) ? '#d62333' : 'black'
            })
        })
        .on('mouseout', function(d) {
            d3.select("#tooltip").remove();
            link.style('stroke', null);
        })
        .on('click', function(d){
            getSTARFile(d);
        });
   
    //Links creation and their properties
    let link = svg.append("g").selectAll("link")
        .data(svglink)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 3)
        .attr("d", function(d) {
            return ['M', d.xsource, (d.y),
                    'A', (d.xtarget - d.xsource) / 2, ',',
                    (d.xtarget - d.xsource) / 5, 0, 1, ',',
                    1, d.xtarget, ',', d.y
                    ]
         .join(' ');
        })
        .on('mouseover', function(d) {
            link.style('stroke', 'black');
            d3.select(this).style('stroke', '#d62333');
            node.style('fill', function(node_d) {
                return node_d === d.source || node_d === d.target ? 'black' : null;
            });
        })
        .on('mouseout', function(d) {
            link.style('stroke', 'black');
            node.style('fill', null);
        });
    
       //Svg title
       svg.append("text")
         .attr("x", (width / 16))             
         .attr("y", 20 )
         .attr("text-anchor", "middle")  
         .style("font-weight","bold")
         .style("font-size", "20px")   
         .text("Nodes chronology"); 

    return svg.node();
}
