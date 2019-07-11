import { Component, Prop, State, Element, h } from '@stencil/core';
import * as d3 from "d3";


@Component({
  tag: 'linear-card',
  styleUrl: 'my-component.css',
  shadow: true
})

export class MyComponent {
// *************************** PROPERTY & CONSTRUCTOR ***************************
@Element() element: HTMLElement;

@Prop() all_sgrna:string;
@Prop() gene:string;
@Prop() width_bar:string;

@State() coordGene:{};
@State() allSgrna:{};

// *************************** LISTEN & EMIT ***************************



// *************************** CLICK ***************************


// *************************** FUNCTIONS ***************************
  checkSgrnaOnGene(start:number, end:number) {
    if(start >= this.coordGene["start"] && end <= this.coordGene["end"]) {
      return true;
    }
    return false;
  }



// *************************** DISPLAY ***************************
  displayHist(){
    let widthBarNb = (this.width_bar.match("[0-9]*")[0] as unknown as number);
    let leftBorder = (100 - widthBarNb)/2;
    var color = "steelblue";
    let data = [{"stepCoord": "0_100", "nbSgrna": 2}, {"stepCoord": "101_200", "nbSgrna": 1}, {"stepCoord": "201_300", "nbSgrna": 6}];
    var height = 200;
    d3.selectAll(this.element.shadowRoot.querySelectorAll("#divHist>svg")).remove();
    // Color scale for bin
    var colorScale = d3.scaleLinear()
                .domain([d3.min(data, function(d) { return d.nbSgrna; }), d3.max(data, function(d) { return d.nbSgrna; })])
                // @ts-ignore
                .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);
    // set the ranges
    var x = d3.scaleBand()
              .range([0, widthBarNb*screen.width/100])
              .domain(data.map(function(d) { return d.stepCoord; }));
    var y = d3.scaleLinear()
              .range([height, 0])
              .domain([0, d3.max(data, function(d) { return d.nbSgrna; })]);
    // Create the svg
    var svg = d3.select(this.element.shadowRoot.querySelector("#divHist")).append("svg")
        .attr("width", this.width_bar)
        .attr("height", height)
        .style("margin-left", `${leftBorder}%`)
      .append("g");

    let div = d3.select(this.element.shadowRoot.querySelector("#divHist"))
      .append('div')
      .attr('class', 'tooltip-hist')
      .style("position", "absolute")
      .style("display", "none");

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {return x(d.stepCoord); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.nbSgrna); })
        .attr("height", function(d) { return height - y(d.nbSgrna); })
        .attr("fill", function(d) { return colorScale(d.nbSgrna) })
        .on("mouseover", e => {
          div.style("display", "block");
          div.transition()
            .duration(500)
          div.html(`Number of sgRna : ${e.nbSgrna} <br/> Interval : ${e.stepCoord}`)
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY) + 'px');
        });


  }

  componentWillLoad(){
    // Parse data cause not given by socket
    this.coordGene = JSON.parse(this.gene);
    this.allSgrna = JSON.parse(this.all_sgrna);
  }
  componentDidLoad() {
    this.displayHist()
  }

  render() {
    console.log("rendr called");
    let widthBarNb = (this.width_bar.match("[0-9]*")[0] as unknown as number);
    let leftBorderGene = `${(100 - widthBarNb)/2}%`;
    let leftBorder = `${(100 - widthBarNb)/2 - 2}%`;
    let rightBorder = `${widthBarNb - ((100 - widthBarNb)/2)}%`;
    return ([
      <div id="divHist">
      {this.displayHist()}
    </div>,
      <div>
        <div class="geneBar" style={{width:this.width_bar, marginLeft:leftBorderGene}}>
        </div>
        <span style={{marginLeft: leftBorder}}> {this.coordGene["start"]} </span>
        <span style={{marginLeft: rightBorder}}> {this.coordGene["end"]} </span>
      </div>
      ]);
  }
}
