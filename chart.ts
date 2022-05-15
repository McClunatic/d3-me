import * as d3 from 'd3'

type Datum = [number, number]
type Selection = d3.Selection<Element, Datum[], Element, any>
type GSelection = d3.Selection<SVGGElement, Datum[], Element, any>

export default function chart() {
  let margin = {top: 30, right: 30, bottom: 30, left: 30},
      width = 800,
      height = 600,
      xValue = function(d: Datum) { return d[0]; },
      yValue = function(d: Datum) { return d[1]; },
      xScale = d3.scaleUtc(),
      yScale = d3.scaleLinear(),
      xAxis = function(g: GSelection) {
        g
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0))
      },
      line = d3.line().x(X).y(Y)

  function my(selection: Selection) {
    selection.each(function(data: Datum[]) {

      // Convert data to standard representation greedily;
      // this is needed for nondeterministic accessors.
      data = data.map(function(d, i) {
        return [xValue.call(data, d, i), yValue.call(data, d, i)];
      });

      // Update the x-scale.
      xScale
          .domain(d3.extent(data, function(d) { return d[0]; }))
          .range([0, width - margin.left - margin.right]);

      // Update the y-scale.
      yScale
          .domain([0, d3.max(data, function(d) { return d[1]; })])
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

  my.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return my;
  };

  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return my;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return my;
  };

  my.x = function(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return my;
  };

  my.y = function(_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return my;
  };

  return my;
}
