import * as d3 from 'd3';
import { linearRegression } from 'simple-statistics';

export function render (dataCollection) {
  const margin = {
    top: 20,
    right: 100,
    bottom: 30,
    left: 50
  };

  const width = window.innerWidth - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  const parseTime = d3.timeParse('%Y%m');
  const displayYear = d3.timeFormat('%Y');

  const yPad = 10;
  const x = d3.scaleTime().range([0, width]);
  const y = d3.scaleLinear().range([height - yPad, yPad]);

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
  y.domain([Math.floor(d3.min(data, d => d.value)), Math.ceil(d3.max(data, d => d.value))]);

  svg.append('g')
    .attr('transform', `translate(0, ${height})`)
    .attr('class', 'x axis')
    .call(d3.axisBottom(x).tickSize(-height, -height, -height));

  svg.append('g')
    .attr('class', 'y axis')
    .call(
      d3.axisLeft(y)
        .tickSize(-width, -width, -width)
        .tickFormat(txt => `${txt}"`)
    );

  svg.append('path')
    .data([data])
    .attr('class', 'line')
    .attr('d', line);

  const focus = svg.append('g')
    .attr('class', 'focus')
    .style('display', 'none');

  focus.append('circle')
    .attr('r', 4.5)

  focus.append('text')
    .attr('x', 9)
    .attr('dy', '.35em');

  svg.append('rect')
    .attr('class', 'overlay')
    .attr('width', width)
    .attr('height', height)
    .on('mouseover', () => focus.style('display', null))
    .on('mouseout', () => focus.style('display', 'none'))
    .on('mousemove', onMouseMove);

  const bisectDate = d3.bisector(d => d.date).left;

  function onMouseMove () {
    const x0 = x.invert(d3.mouse(this)[0]);
    const i = bisectDate(data, x0, 1);
    const d0 = data[i - 1];
    const d1 = data[i];
    const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    focus.attr('transform', `translate(${x(d.date)},${y(d.value)})`)
      .select('text')
      .text(`${displayYear(d.date)}: ${d.value}"`);
  }

  const lr = linearRegression(data.map((d, i) => [++i, parseInt(d.value, 10)]));

  svg.selectAll('.trendline')
    .data([[
      data[0].date,
      lr.m + lr.b,
      data[data.length -1].date,
      lr.m * data.length + lr.b
    ]])
    .enter()
    .append('line')
    .attr('class', 'trend-line')
    .attr('x1', d => x(d[0]))
    .attr('y1', d => y(d[1]))
    .attr('x2', d => x(d[2]))
    .attr('y2', d => y(d[3]));
}
