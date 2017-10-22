import * as d3 from 'd3';

export function render (dataCollection) {
  const margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50
  };

  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  const parseTime = d3.timeParse('%Y%m');

  const x = d3.scaleTime().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.value));

  const svg = d3.select('body')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const data = Object.keys(dataCollection.data)
    .map(date => Object.assign({}, dataCollection.data[date], { date: parseInt(date, 0) }))
    .sort((a, b) => a.date - b.date);

  data.forEach(d => d.date = parseTime(d.date));

  x.domain(d3.extent(data, d => d.date));
  y.domain([d3.min(data, d => d.value), d3.max(data, d => d.value)]);

  svg.append('path')
    .data([data])
    .attr('class', 'line')
    .attr('d', line);

  svg.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  svg.append('g')
    .call(d3.axisLeft(y))

  console.log(data);

}
