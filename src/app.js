import { fetchPrecipData } from './api';
import { render } from './visualizer';

export function init (mode) {
  fetchPrecipData(mode === 'DEV').then(render);
}
