import './style.css'

import * as d3 from 'd3'
import { chart } from './chart'


const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`

function formatData(data: d3.DSVRowArray<string>) {
  let formatted: Array<[Date, number]> = data.map(
    d => [d3.timeParse("%b %Y")(d.date!)!, parseFloat(d.price!)]
  )
  // formatted.forEach(val => console.log(val))
  return formatted
}

d3.csv("sp500.csv", ).then(formatData).then(data => {
  let myChart = chart()
  d3.select("#app")
      .data([data])
      .call(myChart)
});