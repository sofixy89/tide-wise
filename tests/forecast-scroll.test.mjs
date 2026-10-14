import assert from 'node:assert/strict';
const registry = new Map();
global.window = { customCards: [] };
global.customElements = { get: n => registry.get(n), define: (n, c) => registry.set(n, c) };
global.HTMLElement = class { attachShadow() {} };
await import('../tidewise-card.js');
const card = new (registry.get('tidewise-card'))();
card._config = { station: '8726520', units: 'english' };
const day = 86400000;
const now = new Date(2026, 9, 13, 16, 0);
const rows = Array.from({length: 1500}, (_, i) => ({
  t: card._formatNoaaTime(new Date(+now + (i - 10) * 360000)), v: String(i / 100)
}));
let view = card._forecastRange(rows, now);
assert.equal(view.offset, 0);
assert.equal(+card._parsePredictionTime(view.predictions.at(-1).t) - +card._parsePredictionTime(view.predictions[0].t), day / 2);
view = card._forecastRange(rows, now, 10 * day);
assert.equal(view.offset, 4.5 * day);
assert.equal(+card._parsePredictionTime(view.predictions.at(-1).t), +now + 5 * day);
assert.ok(!card._xAxisHtml(view.predictions, true).includes('Now'));
const short = rows.filter(p => +card._parsePredictionTime(p.t) <= +now + 1.5 * day);
assert.equal(card._forecastRange(short, now, 10 * day).maxOffset, day);
assert.equal(card._forecastRange(short.slice(0, 80), now).maxOffset, 0);
// Verify both NOAA products request enough data to bracket day five's extremes.
const urls = [];
global.fetch = async url => { urls.push(new URL(url)); return { json: async () => ({ predictions: rows }) }; };
card._renderData = () => {};
await card._fetchData();
assert.equal(urls.length, 2);
for (const url of urls) assert.equal(url.searchParams.get('end_date'), card._dateStr(6));
// CHS must request the same horizon, with an extra hour to find extrema.
card._config.ca_station = 'station-id';
card._fetchCanadaSeriesRows = async (id, from, to) => {
  assert.ok(+to - +from >= 122 * 3600000);
  return { rows: [], seriesCode: 'wlp' };
};
card._renderError = message => { throw new Error(message); };
await card._fetchCanadaData();
console.log('five-day forecast tests passed');
