import './style.css'

import * as d3 from 'd3'


const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`

const x: Array<number> = []
for (let i = 0; i < 30; i++) {
  x.push(i * 0.25)
}
const data: Array<[number, number]> = x.map(i => [i, Math.sin(i)])

const fx = d3.scaleLinear()
  .domain(<[number, number]>d3.extent(x))
  .range([20, 780])

const fy = d3.scaleLinear()
  .domain([-1, 1])
  .range([20, 580])

const line = d3.line()
  .x((d: [number, number]) => fx(d[0]))
  .y((d: [number, number]) => fy(d[1]))

const xAxis = (g: d3.Selection<any, any, any, any>) => g
  .attr("transform", "translate(0,580)")
  .call(d3.axisBottom(fx).ticks(20).tickSizeOuter(0))

const yAxis = (g: d3.Selection<any, any, any, any>) => g
  .attr("transform", "translate(20,0)")
  .call(d3.axisLeft(fy).ticks(20))
  .call(g => g.select(".domain").remove())

app.innerHTML += `<svg viewBox="0 0 800 600">
  <path d="${line(data)}" fill="none" stroke="steelblue" stroke-width="1.5" stroke-miterlimit="1"></path>
  <g id="x-axis"></g>
  <g id="y-axis"></g>
</svg>`

d3.select("g#x-axis").call(xAxis)
d3.select("g#y-axis").call(yAxis)
