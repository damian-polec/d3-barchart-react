import React, { Component } from 'react';
import * as d3 from 'd3';

class BarChart extends Component {

    componentDidMount() {
        this.drawChart();
    }

    drawChart () {
        const margin = {left: 100, right: 10, top: 100, bottom: 100}
        const width = 700 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;
        
        const tickValues = this.props.data.reduce((total, amount) => {
            if(parseInt(amount.DATE.substring(0, 4)) % 5 === 0 && amount.DATE.substring(4, amount.DATE.length) === '-01-01') {
                if(total.indexOf(amount.DATE) === -1) {
                    total.push(amount.DATE)
                }
            }
            return total;
        }, [])

        const scaleY = d3.scaleLinear()
            .domain([0, d3.max(this.props.data, d => d.VALUE)])
            .range([height, 0]);
        
        const scaleX = d3.scaleBand()
            .domain(this.props.data.map(d => d.DATE))
            .range([0, width])
            .paddingOuter(0.1)
            .paddingInner(0.1)
    
        const svg = d3.select('#chart')
                      .append('svg')
                      .attr('width', width + margin.left + margin.right)
                      .attr('height', height + margin.top + margin.bottom);
        
        const g = svg.append('g')
            .attr('transform', "translate(" + margin.left + ", " + margin.top +")")
        const xAxis = d3.axisBottom(scaleX)
            .tickValues(tickValues)
        g.append('g')
            .attr('class', 'x axis')
            .attr('id', 'x-axis')
            .attr('transform', "translate(0," + (height ) + ")")
            .call(xAxis)
            .selectAll('text')
                .attr('y', '10')
                .attr('x', '-5')
                .attr('text-anchor', 'end')
                .attr('transform', 'rotate(-45)')

        const yAxis = d3.axisLeft(scaleY);
        g.append('g')
            .attr('class', 'y axis')
            .attr('id', 'y-axis')
            .call(yAxis);  
        
        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .attr('id', 'tooltip')
            .style('opacity', '0')

        const rects = g.selectAll('rect')
           .data(this.props.data)
           
        const rect = rects.enter()
           .append('rect')
           .attr('class', 'bar')
           .attr('data-date', d => d.DATE)
           .attr('data-gdp', d => d.VALUE)
           .attr('x', d => scaleX(d.DATE))
           .attr('y', d => scaleY(d.VALUE))
           .attr('width', scaleX.bandwidth)
           .attr('height', d => height - scaleY(d.VALUE))
           
        rect.on('mouseover', (d) => {
                console.log(this);
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 0);
                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9)
                tooltip.html(
                   `<p>${d.DATE}</p>
                    <p>${d.VALUE}</p>`
               ).attr('data-date', d.DATE)
                .style('top', height - height/4 + 'px')
                .style('left', (d3.event.pageX)+ 'px')  
           }).on('mouseout', d => {
               tooltip.transition()
                .style('opacity', 0)
           })
        
    }
    render () {
        return <div id='chart'></div>
    }
}

export default BarChart;