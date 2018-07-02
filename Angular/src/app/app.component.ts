import { Component, AfterContentInit, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { CommunicationService } from './communication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterContentInit {

	constructor(private communicationService: CommunicationService) { }

	ngOnInit(): void {

    this.communicationService.getNumberOfPeopleAtEachHours(1).subscribe(
    	valide => {
			// this.setupHistogram()
			this.d3Tutorial()
		},
    	error => console.log("----- Error with getNumberOfPeopleAtEachHours() -----")
    );
      
	}
	title = 'app';

	radius = 10;

	clicked(event: any) {
		d3.select(event.target).append('circle')
		.attr('cx', event.x)
		.attr('cy', event.y)
		.attr('r', () => {
			return this.radius;
		})
		.attr('fill', 'red');
	}

	ngAfterContentInit() {
		d3.select('p').style('color', 'red');
	}

	private d3Tutorial(){
		var svg = d3.select("svg")
					.append("svg")
					.attr("width", 500)
					.attr("height", 200);

		let margin = {top: 20, right: 20, bottom: 30, left: 40};
		var w = +svg.attr("width") - margin.left - margin.right;
		var h = +svg.attr("height") - margin.top - margin.bottom;
		let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		var dataset = this.communicationService.numberOfPeopleAtEachHours;
		let hours = [];
		for (let i: number = 0; i < 24; i++) {
			hours[i] = i;
		}

		var xScale = d3.scaleBand()
			.domain(hours)
			.range([0, w])
			.padding(0.2)
		
		svg.append('g')
		  .attr('transform', `translate(0, ${h})`)
		  .call(d3.axisBottom(xScale));

		var yScale = d3.scaleLinear()
		  .domain([0,d3.max(dataset, function(d){return d.avg})])
		  .range([h, 0]);

		svg.append('g')
		  .call(d3.axisLeft(yScale));

		let update = svg.selectAll('rect')
		    .data(dataset.filter(d => d[subject]), d => d.avg);
		  update.exit()
		    .remove();
		  update
		    .attr('y', d => yScale(d[subject]))
		    .attr('height', d => height ‐ yScale(d[subject]));
		  update
		    .enter()
		    .append('rect')
		    .attr('x', d => xScale(d.name))
		    .attr('width', d => xScale.bandwidth())
		    .attr('y', d => yScale(d[subject]))
		    .attr('height', d => height ‐ yScale(d[subject]));
	}

	private setupHistogram(){
		
		// let svg = d3.select("svg")
		// 			.append("svg")
		// 			.attr("width", 500)
		// 			.attr("height", 200);

		// let margin = {top: 20, right: 20, bottom: 30, left: 40};
		// let w = +svg.attr("width") - margin.left - margin.right;
		// let h = +svg.attr("height") - margin.top - margin.bottom;
		// let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		// let dataset = this.communicationService.numberOfPeopleAtEachHours;
		// let min = 0;
		// let max = d3.max(dataset, function(d){return d.avg});
		// let yScale = d3.scaleLinear().domain([min, max]).range([5,h]);


		// // var yAxis = d3.axisLeft(yScale).ticks(5);
		// // var axis = svg.append("g").call(yAxis)
		// // 						.attr("class", "axis")
		// // 						.attr("transform", "translate(" + 20 + ", 0)");

		// // var x = d3.scaleBand()
		// // 	// .domain([new Date("January 1, 2018 00:00:00"), new Date("January 1, 2018 23:00:00")])
		// // 	.rangeRound([0, w])
		// // 	.padding(.1);
		// let parseDate = d3.timeParse("%H");
		// let xScale = d3.scaleBand()
		// 	.rangeRound([0, w])
		// 	.padding(0.5)
		// 	.domain(dataset.map(d => new Date(d.time).toLocaleDateString('en-GB', {
		// 		hour : 'numeric',
		// 	})));

		// let xAxis = d3.axisBottom(xScale).ticks(4);
		
		// let axis = svg.append("g").call(xAxis)
		// 						.attr("class", "axis")
		// 						.attr("transform", "translate( 0, " + h + ")");

		// svg.selectAll("rect")
		// 	.data(dataset)
		// 	.enter()
		// 	.append("rect")
		// 	.attr("x", function(d,i) {
		// 		return (i * (w / dataset.length));
		// 	})
		// 	.attr("y", function(d) {
		// 		return h - yScale(d.avg);
		// 	})
		// 	.attr("width", w / dataset.length)
		// 	.attr("height", function(d){
		// 		return yScale(d.avg);
		// 	})
		// 	.attr("fill", function(d){
		// 		return "rgb(" + (d.avg * 10) + ", 0, 0)";
		// 	})
		// 	.on("mouseover", function(d) {
		// 		svg.append("text")
		// 		.text(d.avg)
		// 		.attr("text-anchor", "middle")
		// 		.attr("x", parseFloat(d3.select(this).attr("x")) + parseFloat(d3.select(this).attr("width"))/2)
		// 		.attr("y", parseFloat(d3.select(this).attr("y")) + 12)
		// 		.attr("font-family", "sans-serif")
		// 		.attr("font-size", 12)
		// 		.attr("fill", "#ffffff")
		// 		. attr("id", "tooltip")
		// 	})
		// 	.on("mouseout", function() {
		// 		d3.select("#tooltip").remove();
		// 	})
	}
}


