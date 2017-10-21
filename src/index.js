const dataUri = 'https://www.ncdc.noaa.gov/cag/time-series/us/110/00/pcp/ytd/12/1895-2016.json?base_prd=true&begbaseyear=1901&endbaseyear=2000';

function init () {
  fetch(dataUri)
    .then(response => response.json())
    .then(render);
}

function render (data) {
  console.log(data);
}

document.addEventListener('DOMContentLoaded', init);
