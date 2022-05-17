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
  duration: number
}

type Datum = [Date, number]

type Selection = d3.Selection<d3.BaseType, Datum[], HTMLElement, any>

export function chart(config?: Config) {
  let margin = config?.margin || {top: 20, right: 20, bottom: 40, left: 40}
  let width = config?.width || 800
  let height = config?.height || 600
  let duration = config?.duration || 500

  let x = d3.scaleUtc()
  let y = d3.scaleLinear()

  function my(selection: Selection) {
    selection.each(function(data: Datum[]) {

      // Update the scales.
      let xDomain = d3.extent(
        data.slice(0, data.length - 1),
        (d: Datum) => d[0],
      ).map(v => v!)
      let minDate = new Date(xDomain[0].getTime())
      x
        .domain(xDomain)
        .range([0, width - margin.left - margin.right])
      y
        // .domain(d3.extent(data, (d: Datum) => d[1]).map(v => v!))
        .domain([700, 1600])
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
        .append("g")
          .attr("class", "x axis")
      gEnter
        .append("g")
          .attr("class", "y axis")
      gEnter
        .append("defs").append("clipPath")
          .attr("id", "clip")
        .append("rect")
          .attr("width", width - margin.left - margin.right)
          .attr("height", height - margin.top - margin.bottom)
      gEnter
        .append("g")
          .attr("clip-path", "url(#clip)")
          .attr("class", "data")
        .append("path")
          .attr("class", "line")
          .attr("fill", "none")
          .attr("stroke", "black")

      // Update the out dimensions.
      let svg = d3.select(this).select("svg")
          .attr("width", width)
          .attr("height", height)

      // Update the inner dimensions.
      let g = svg.select("g")
          .attr("transform", `translate(${margin.left},${margin.top})`)

      // Update the line path.
      svg.select("g.data").selectAll("path")
          .transition()
            .duration(duration)
            .ease(d3.easeLinear)
            .on("start", function() {
              d3.select(this)
                .attr("d", line(data))
                .attr("transform", null)
              d3.active(this)!
                .attr(
                  "transform",
                  `translate(${x(minDate.setMonth(minDate.getMonth() - 1))},0)`,
                )
            })

      // Update the axes.
      g.select<SVGGElement>(".x.axis")
          .attr("transform", `translate(0,${y.range()[0]})`)
          .transition().duration(duration).ease(d3.easeLinear)
          .call(d3.axisBottom(x).ticks(5))
      g.select<SVGGElement>(".y.axis")
          .call(d3.axisLeft(y).ticks(5))
    })
  }

  return my
}
