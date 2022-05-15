import * as d3 from 'd3'

interface Margin {
  top: number
  right: number
  bottom: number
  left: number
}
type Datum = [Date, number]
type XAccessor = (d: Datum) => Date
type YAccessor = (d: Datum) => number

type Selection = d3.Selection<Element, Datum[], Element, any>
type GSelection = d3.Selection<SVGGElement, Datum[], Element, any>

export default function chart() {
  let margin: Margin = {top: 30, right: 30, bottom: 30, left: 30},
      width = 800,
      height = 600,
      xValue: XAccessor = function(d: Datum) { return d[0]; },
      yValue: YAccessor = function(d: Datum) { return d[1]; },
      xScale = d3.scaleUtc(),
      yScale = d3.scaleLinear(),
      xAxis = function(g: GSelection) {
        g
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0))
      },
      line = d3.line<Datum>().x(X).y(Y)

  function my(selection: Selection) {
    selection.each(function(data: Datum[]) {

      // Update the x-scale.
      let xDomain = d3.extent(data, (d: Datum) => d[0])
      xScale
          .domain(xDomain.map(v => v!))
          .range([0, width - margin.left - margin.right]);

      // Update the y-scale.
      let yDomain = d3.extent(data, (d: Datum) => d[1])
      yScale
          .domain(yDomain.map(v => v!))
          .range([height - margin.top - margin.bottom, 0]);

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([data]);

      // Otherwise, create the skeletal chart.
      var gEnter = svg.enter().append("svg").append("g");
      gEnter.append("path").attr("class", "area");
      gEnter.append("path").attr("class", "line");
      gEnter.append("g").attr("class", "x axis");

      // Update the outer dimensions.
      svg .attr("width", width)
          .attr("height", height);

      // Update the inner dimensions.
      var g = svg.select("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Update the line path.
      g.select(".line")
          .attr("d", line);

      // Update the x-axis.
      g.select<SVGGElement>(".x.axis")
          .attr("transform", "translate(0," + yScale.range()[0] + ")")
          .call(xAxis);
    });
  }

  // The x-accessor for the path generator; xScale ∘ xValue.
  function X(d: Datum) {
    return xScale(d[0]);
  }

  // The x-accessor for the path generator; yScale ∘ yValue.
  function Y(d: Datum) {
    return yScale(d[1]);
  }

  my.margin = function(value: Margin | undefined) {
    if (!arguments.length) return margin;
    margin = value!;
    return my;
  };

  my.width = function(value: number | undefined) {
    if (!arguments.length) return width;
    width = value!;
    return my;
  };

  my.height = function(value: number | undefined) {
    if (!arguments.length) return height;
    height = value!;
    return my;
  };

  my.x = function(value: XAccessor | undefined) {
    if (!arguments.length) return xValue;
    xValue = value!;
    return my;
  };

  my.y = function(value: YAccessor | undefined) {
    if (!arguments.length) return yValue;
    yValue = value!;
    return my;
  };

  return my;
}
