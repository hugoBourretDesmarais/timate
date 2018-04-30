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

    this.communicationService.getNumberOfPeopleAtEachHours(0).subscribe(
      valide => {
          console.log("OK")
      },
      error => console.log("----- Error with getNumberOfPeopleAtEachHours() -----")
  );
    
    var w = 500;
    var h = 200;
    var padding = 5;
    var dataset = [5,10,15,20,25];
    var svg = d3.select("svg")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    var min = 0;
    var max = d3.max(dataset, function(d){return d});
    var yScale = d3.scaleLinear().domain([min, max]).range([5,h-10]);

    var yAxis = d3.axisLeft(yScale).ticks(5);
    var axis = svg.append("g").call(yAxis)
                              .attr("class", "axis")
                              .attr("transform", "translate(" + 20 + ", 0)");

    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
          .attr("x", function(d,i) {
            return (i * (w / dataset.length));
          })
          .attr("y", function(d) {
            return h - yScale(d);
          })
          .attr("width", w / dataset.length - padding)
          .attr("height", function(d){
            return yScale(d);
          })
          .attr("fill", function(d){
            return "rgb(" + (d * 10) + ", 0, 0)";
          })
          .on("mouseover", function(d) {
            svg.append("text")
              .text(d)
              .attr("text-anchor", "middle")
              .attr("x", parseFloat(d3.select(this).attr("x")) + parseFloat(d3.select(this).attr("width"))/2)
              .attr("y", parseFloat(d3.select(this).attr("y")) + 12)
              .attr("font-family", "sans-serif")
              .attr("font-size", 12)
              .attr("fill", "#ffffff")
             . attr("id", "tooltip")
          })
          .on("mouseout", function() {
            d3.select("#tooltip").remove();
          })
    

        
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
}


