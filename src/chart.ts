import * as d3 from 'd3'

interface Margin {
  top: number
  right: number
  bottom: number
  left: number
}

interface Config {
  margin: Margin
  width: number
  height: number
}

export type Datum = [Date, number]

export type Selection = d3.Selection<d3.BaseType, Datum[], HTMLElement, any>

export function chart(config?: Config) {
  let margin = config?.margin || {top: 30, right: 30, bottom: 30, left: 30}
  let width = config?.width || 800
  let height = config?.height || 600

  let x = d3.scaleUtc()
  let y = d3.scaleLinear()

  function my(selection: Selection) {
    selection.each(function(data: Datum[]) {

      // Update the scales.
      x
        .domain(d3.extent(data, (d: Datum) => d[0]).map(v => v!))
        .range([0, width - margin.left - margin.right])
      y
        .domain(d3.extent(data, (d: Datum) => d[1]).map(v => v!))
        .range([height - margin.top - margin.bottom, 0])

      // Create the line.
      let line = d3.line<Datum>()
        .x(d => x(d[0]))
        .y(d => y(d[1]))

      // Create the skeletal chart if necessary.
      let gEnter = d3.select(this).selectAll("svg")
          .data([data])
          .enter()
        .append("svg")
        .append("g")
      gEnter
        .append("path")
          .attr("class", "line")
          .attr("fill", "none")
          .attr("stroke", "black")
      gEnter
        .append("g")
          .attr("class", "x axis")
      gEnter
        .append("g")
          .attr("class", "y axis")

      // Update the out dimensions.
      let svg = d3.select(this).select("svg")
          .attr("width", width)
          .attr("height", height)

      // Update the inner dimensions.
      let g = svg.select("g")
          .attr("transform", `translate(${margin.left},${margin.top})`)

      // Update the line path.
      g.select(".line")
          .attr("d", line(data))

      // Update the axes.
      g.select<SVGGElement>(".x.axis")
          .attr("transform", `translate(0,${y.range()[0]})`)
          .call(d3.axisBottom(x).ticks(5))
      g.select<SVGGElement>(".y.axis")
          .attr("transform", `translate(${x.range()[0]},0)`)
          .call(d3.axisLeft(y).ticks(5))
    })
  }

  return my
}
