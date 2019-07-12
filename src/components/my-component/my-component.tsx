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
@Prop({mutable: true}) nb_step="20";

@State() coordGene:{};
@State() allSgrna:{};
@State() dataHist:Array<Object>;
// *************************** LISTEN & EMIT ***************************



// *************************** CLICK ***************************


// *************************** FUNCTIONS ***************************
  initializeInterval():Array<Object>{
  let dicInterval=[];

  let stepInterval = Math.round((this.coordGene["end"] - this.coordGene["start"])/(this.nb_step as unknown as number));
  let start=this.coordGene["start"];

  for(var i=0; i<(this.nb_step as unknown as number) -1; i++){
    dicInterval.push({stepCoord: `${start}-${start+stepInterval}`, nbSgrna: 0, sgrna:[]});
    start += stepInterval;
  }
  // the last interval can be bigger or smaller
  dicInterval.push({stepCoord: `${start}-${this.coordGene["end"]}`, nbSgrna: 0, sgrna:[]});
  return dicInterval;
}

  checkOnGene(start:number, end:number):boolean {
    if(start >= this.coordGene["start"] && end <= this.coordGene["end"]) {
      return true;
    }
    return false;
  }

  checkOnInterval(interval:string, start:number, end:number):boolean{
    let stInt=interval.split("-")[0] as unknown as number, endInt=interval.split("-")[1] as unknown as number;
    if((start >= stInt && start <= endInt) || (end >= stInt && end <= endInt) || (stInt >= start && stInt <= end)){
      return true;
    }
    return false;
  }

  setDataHist():Array<Object>{
    let data=this.initializeInterval();
    Object.keys(this.allSgrna).forEach(sgrna => (this.allSgrna[sgrna] as Array<string>).forEach(coord => {
      var start = coord.match('[+-][(]([0-9]*)')[1] as unknown as number;
      var end = coord.match(',([0-9]*)[)]')[1] as unknown as number;
      if(this.checkOnGene(start, end)){
        data.forEach(interval => {
          if(this.checkOnInterval(interval["stepCoord"], start, end)){
            interval["nbSgrna"] += 1;
            interval["sgrna"].push(sgrna);
          }
        })
      }
    }))
    return data;
  }

// *************************** DISPLAY ***************************
  displayHist(){
    let widthBarNb = (this.width_bar.match("[0-9]*")[0] as unknown as number);
    let leftBorder = (100 - widthBarNb)/2;
    var color = "steelblue";
    var height = 200;

    d3.selectAll(this.element.shadowRoot.querySelectorAll("#divHist>svg")).remove();
    d3.selectAll(this.element.shadowRoot.querySelectorAll("#divHist>div")).remove();
    // Color scale for bin
    var colorScale = d3.scaleLinear()
                .domain([d3.min(this.dataHist, function(d) { return d["nbSgrna"]; }), d3.max(this.dataHist, function(d) { return d["nbSgrna"]; })])
                // @ts-ignore
                .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);
    // set the ranges
    var x = d3.scaleBand()
              .range([0, widthBarNb*screen.width/100])
              .domain(this.dataHist.map(function(d) { return d["stepCoord"]; }));
    var y = d3.scaleLinear()
              .range([height, 0])
              .domain([0, d3.max(this.dataHist, function(d) { return d["nbSgrna"]; })]);
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
        .data(this.dataHist)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {return x(d["stepCoord"]); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d["nbSgrna"]); })
        .attr("height", function(d) { return height - y(d["nbSgrna"]); })
        .attr("fill", function(d) { return colorScale(d["nbSgrna"]) })
        .on("mouseover", e => {
          div.style("display", "block");
          div.transition()
            .duration(500)
          div.html(`Number of sgRna : ${e["nbSgrna"]} <br/> Interval : ${e["stepCoord"]}`)
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY) + 'px');
        })
        .on('mouseout', () => {
          div.transition()
            .duration(5)
            .style('display', "none");
        })
        .on("click", e => {
          d3.select(this.element.shadowRoot.querySelector("#sgrnaBox")).html("<strong> Interval : </strong>" +
                                                                             e["stepCoord"] + "<strong> Nb sgRNA : </strong>" +
                                                                             e["nbSgrna"] + "<br/>" +
                                                                             e["sgrna"].map(sg => "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + sg + "<br/>"));

        });
  }

  componentWillLoad(){
    // Parse data cause not given by socket
    this.coordGene = JSON.parse(this.gene);
    this.allSgrna = JSON.parse(this.all_sgrna);
    this.dataHist = this.setDataHist();
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
      <div>
        <div id="binSize">
          Bin size : <span style={{color:"rgb(239, 71, 111)", width:"35%"}}>{Math.ceil((this.coordGene["end"] - this.coordGene["start"])/(this.nb_step as unknown as number))}</span>
        </div>
        <div style={{float:"right", width:"35%"}}>
          <strong> Sgrna box </strong>
          <div id="sgrnaBox"></div>
        </div>
      </div>,

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
