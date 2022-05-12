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
  let ix = data.length
  data.push([ix / 4, Math.sin(ix / 4)])

  if (ix >= 40) {
    fx.domain([data[ix - 40][0], data[ix][0]])
  } else {
    fx.domain([data[0][0], data[data.length - 1][0]])
  }
  gx.transition()
    // .duration(1000)
    .call(d3.axisBottom(fx))

  g.selectAll("path")
    .data(data)
    .join("path")
      .attr("d", d => `M${fx(d[0])},${fy(d[1])}h0`)
      .attr("stroke", "#1F77B4")
      .attr("stroke-width", 5)
}

while (true) {
  update()
  await new Promise(r => setTimeout(r, 2000));
  break;
}
