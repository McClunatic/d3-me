import './style.css'

import * as d3 from 'd3'


const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`

const x: Array<number> = []
for (let i = 0; i < 41; i++) {
  x.push(i * 0.25)
}
const data: Array<[number, number]> = x.map(i => [i, Math.sin(i)])

const fx = d3.scaleLinear()
  .domain(<[number, number]>d3.extent(x))
  .range([30, 770])

const fy = d3.scaleLinear()
  .domain([-1, 1])
  .range([570, 30])

let svg = d3.select("#app").append("svg")
  .attr("width", 800)
  .attr("height", 600)

let gx = svg.append("g")
    .attr("transform", "translate(0,570)")
    .call(d3.axisBottom(fx))

svg.append("g")
    .attr("transform", "translate(30,0)")
    .call(d3.axisLeft(fy))

let g = svg.append("g")
    .attr("fill", "none")
    .attr("stroke-linecap", "round")
g.selectAll("path")
  .data(data)
  .join("path")
    .attr("d", d => `M${fx(d[0])},${fy(d[1])}h0`)
    .attr("stroke", "#1F77B4")
    .attr("stroke-width", 5)

function update() {
  let extent = <[number, number]>d3.extent(data.map(d => d[0]))
  extent[1] += 0.25
  data.push([extent[1], Math.sin(extent[1])])

  fx.domain(extent)
  gx.transition()
    .duration(900)
    .call(d3.axisBottom(fx))

  g.selectAll("path")
    .data(data, ((d: [number, number]) => d[0]) as d3.ValueFn<d3.BaseType, unknown, d3.KeyType>)
    .join(
      enter => enter.append("path")
          .attr("d", d => `M${fx(d[0] + 0.25)},${fy(d[1])}h0`)
          .attr("stroke-width", 5)
        .call(enter => enter.transition()
          .duration(900)
          .attr("d", d => `M${fx(d[0])},${fy(d[1])}h0`)
          .attr("stroke", "#1F77B4")
        ),
      update => update
        .call(enter => enter.transition()
          .duration(900)
          .attr("d", d => `M${fx(d[0])},${fy(d[1])}h0`)
        ),
    )

    .join("path")
      .attr("stroke", "#1F77B4")
      .attr("stroke-width", 5)

  data.shift()
}

while (true) {
  update()
  await new Promise(r => setTimeout(r, 2000));
}
