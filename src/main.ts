import './style.css'

import * as d3 from 'd3'
import { Config, streamingChart } from './chart'

interface Response {
  x: number
  y: number
}

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
  <div class="buttons">
    <button id="start">Start</button>
    <button id="stop">Stop</button>
    <button id="reset">Reset</button>
    <span id="latest"></span>
  </div>
`

let running = false;
let plot_data: Array<[Date, number]> = []

document.getElementById("start")!.addEventListener("click", () => {
  running = true
})

document.getElementById("stop")!.addEventListener("click", () => {
  running = false
})

document.getElementById("reset")!.addEventListener("click", () => {
  plot_data = []
})

let duration = 200
let chart = streamingChart(({
  duration,
  xlabel: "t",
  ylabel: "sin(t)",
} as Config))

while (true) {
  if (running) {
    let response = await fetch('http://localhost:8000/')
    let data: Response = await response.json()
    let data_point: [Date, number] = [new Date(data.x * 1000), data.y]
    plot_data.push(data_point)
    let s = data_point[1] < 0 ? '' : '+'
    document.getElementById("latest")!.textContent =
      `${data_point[0].toLocaleTimeString()}: ${s}${data_point[1].toFixed(2)}`
    if (plot_data.length > 50) plot_data.shift()
    d3.select("#app")
      .data([plot_data])
      .call(chart)
  }
  await new Promise(r => setTimeout(r, duration))
}