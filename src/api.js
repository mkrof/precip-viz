const precipDataUri = 'https://www.ncdc.noaa.gov/cag/time-series/us/110/00/pcp/ytd/12/1895-2016.json?base_prd=true&begbaseyear=1901&endbaseyear=2000';

export function fetchPrecipData (returnMock) {
  if (returnMock) {
    return import('../mocks/data.js')
      .then(data => data.default);
  } else {
    return fetch(precipDataUri)
      .then(response => response.json());
  }
}
