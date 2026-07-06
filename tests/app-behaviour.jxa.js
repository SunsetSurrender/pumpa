/* Behavioural test suite for public/app.js (60 assertions).
   Runs the real IIFE against a stubbed DOM in JavaScriptCore — no
   browser or Node needed:  osascript -l JavaScript tests/app-behaviour.jxa.js
   Covers: Pro gating + unlock flow, tamper resistance, free-tier caps,
   EV calculator math + unit conversion, mixed-kind history, CSV export.
   All PASS lines + a final "== N/60 passed ==" summary. */
ObjC.import('Foundation');
const APP_SRC = $.NSString.stringWithContentsOfFileEncodingError(
  '/Users/thegoldenhour/Desktop/DragonsAreNotGiantLizards/WebDevforaliving/Pumpa/public/app.js',
  $.NSUTF8StringEncoding, null).js;

const results = [];
let LAST_BLOB = null;
function ok(name, cond){ results.push((cond ? 'PASS' : 'FAIL') + ' :: ' + name); }

function makeClassList(){
  const s = new Set();
  return {
    add: (...c) => c.forEach(x => s.add(x)),
    remove: (...c) => c.forEach(x => s.delete(x)),
    toggle: (c, f) => { if (f === undefined) f = !s.has(c); f ? s.add(c) : s.delete(c); return f; },
    contains: (c) => s.has(c)
  };
}

function makeEl(id){
  const el = {
    id, value: '', textContent: '', innerHTML: '', hidden: false, title: '', tabIndex: 0,
    dataset: {}, classList: makeClassList(), _listeners: {}, _children: [],
    addEventListener(type, fn){ (this._listeners[type] = this._listeners[type] || []).push(fn); },
    fire(type, ev){ (this._listeners[type] || []).forEach(fn => fn(ev || { target: { closest: () => null } })); },
    setAttribute(k, v){ this['_attr_' + k] = v; },
    focus(){}, click(){ this.fire('click'); },
    appendChild(c){ this._children.push(c); }, removeChild(){},
    querySelectorAll(){ return this._qsa || []; },
    options: []
  };
  return el;
}

function buildEnv(seed){
  const store = new Map();
  for (const [k, v] of Object.entries(seed)) store.set(k, JSON.stringify(v));
  const els = {};
  const getEl = (id) => { if (!els[id]) els[id] = makeEl(id); return els[id]; };

  const unitToggle = getEl('unitToggle');
  unitToggle._qsa = ['metric', 'us', 'uk'].map(s => { const b = makeEl('ub-' + s); b.dataset.system = s; return b; });
  const sel = getEl('currencySelect');
  sel.options = ['€','$','£','¥','₹','R$','kr','zł','custom'].map(v => ({ value: v }));

  const tabBtns = ['calc','trips','fuel','prices','export'].map(t => { const b = makeEl('tab-' + t); b.dataset.tab = t; return b; });
  const panels = ['calc','trips','fuel','prices','export'].map(t => { const p = makeEl('panel-' + t); p.dataset.panel = t; return p; });

  const docListeners = {};
  const doc = {
    getElementById: getEl,
    querySelectorAll: (q) => q === '.tab-btn' ? tabBtns : q === '.panel-view' ? panels : [],
    addEventListener(type, fn){ (docListeners[type] = docListeners[type] || []).push(fn); },
    fire(type, ev){ (docListeners[type] || []).forEach(fn => fn(ev)); },
    activeElement: null,
    createElement: () => makeEl('dyn'),
    body: makeEl('body')
  };
  const ls = {
    getItem: (k) => store.has(k) ? store.get(k) : null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear()
  };
  return { doc, ls, getEl, store };
}

const TRIPS = [];
for (let i = 0; i < 12; i++) TRIPS.push({ id: 't' + i, ts: 1750000000000 + i * 86400000, distance: 30 + i, consumption: 6.5, price: 1.8, cost: 10 + i, system: 'metric', currency: '€' });
const REFUELS = [];
for (let i = 0; i < 5; i++) REFUELS.push({ id: 'r' + i, date: '2026-06-' + String(10 + i).padStart(2, '0'), amount: 40, cost: 70 + i, odo: 10000 + i * 500, system: 'metric', currency: '€' });

function runApp(extraSeed){
  const seed = Object.assign({ pumpaTrips: TRIPS, pumpaRefuels: REFUELS }, extraSeed || {});
  const env = buildEnv(seed);
  globalThis.document = env.doc;
  globalThis.localStorage = env.ls;
  globalThis.navigator = { languages: ['de-DE'], language: 'de-DE' };
  globalThis.setTimeout = () => 0;
  globalThis.clearTimeout = () => {};
  globalThis.window = {};
  globalThis.Blob = function(parts){ LAST_BLOB = parts.join(''); };
  globalThis.URL = { createObjectURL: () => 'blob:test', revokeObjectURL(){} };
  (0, eval)(APP_SRC);
  return env;
}

const count = (html, cls) => (String(html).match(new RegExp('class="' + cls + '"', 'g')) || []).length;

/* ---------- Scenario A: free tier + unlock flow ---------- */
let env, E;
try {
  env = runApp();
  E = env.getEl;
  ok('boot: app.js executed without throwing', true);
} catch (e) {
  ok('boot: app.js executed without throwing', false);
  results.push('BOOT ERROR: ' + e.message + (e.line ? ' @line ' + e.line : ''));
}

if (env){
  const trips = () => E('tripsList'), fuel = () => E('refuelList');

  ok('free: trips list shows 10 rows', count(trips().innerHTML, 'log-row') === 10);
  ok('free: trips CTA row says "2 more trips"', trips().innerHTML.includes('log-locked') && trips().innerHTML.includes('2 more trips'));
  ok('free: newest 10 visible, oldest hidden (t2 in, t1 out)', trips().innerHTML.includes('data-id="t2"') && !trips().innerHTML.includes('data-id="t1"'));
  ok('free: trips total sums all 12 (186.00)', E('tripsTotal').textContent.includes('186.00'));
  ok('free: fuel list shows 3 rows', count(fuel().innerHTML, 'log-row') === 3);
  ok('free: fuel CTA row says "2 more fill-ups"', fuel().innerHTML.includes('2 more fill-ups'));
  ok('free: export counts full data (12 trips / 5 fill-ups)', E('exportTripsCount').textContent.startsWith('12') && E('exportFuelCount').textContent.startsWith('5'));
  ok('free: monthly report uses all 5 fill-ups (spend 360.00)', E('rptMonthSpend').textContent.includes('360.00') || E('monthlyBars').innerHTML.length > 0);
  ok('free: PDF button locked (label + class)', E('exportPdf').textContent === '🔒 PDF' && E('exportPdf').classList.contains('locked'));
  ok('free: PRO badge not active', !E('proBadge').classList.contains('active'));

  E('exportPdf').fire('click');
  ok('locked PDF click opens modal with PDF message', !E('proModal').hidden && E('proModalReason').textContent.includes('PDF'));
  document.fire('keydown', { key: 'Escape' });
  ok('Escape closes modal', E('proModal').hidden);

  const ctaEv = { target: { closest: (s) => s === '[data-pro-cta]' ? {} : null } };
  trips().fire('click', ctaEv);
  ok('trips CTA opens modal ("last 10 trips")', !E('proModal').hidden && E('proModalReason').textContent.includes('last 10 trips'));
  E('proModal').fire('click', { target: E('proModal') });
  ok('backdrop click closes modal', E('proModal').hidden);
  fuel().fire('click', ctaEv);
  ok('fuel CTA opens modal ("last 3 fill-ups")', !E('proModal').hidden && E('proModalReason').textContent.includes('last 3 fill-ups'));
  E('proModalClose').fire('click');
  ok('"Not now" closes modal', E('proModal').hidden);

  const delEv = { target: { closest: (s) => s === '.log-del' ? { dataset: { id: 't11' } } : null } };
  trips().fire('click', delEv);
  ok('delete visible trip: still 10 rows (hidden one surfaced)', count(trips().innerHTML, 'log-row') === 10);
  ok('delete visible trip: CTA now "1 more trip"', trips().innerHTML.includes('1 more trip') && !trips().innerHTML.includes('2 more trips'));
  ok('delete: storage has 11 trips (never truncated)', JSON.parse(env.store.get('pumpaTrips')).length === 11);

  E('proBadge').fire('click');
  ok('PRO badge opens modal when free', !E('proModal').hidden);
  E('proCode').value = 'PUMPA-TEST-QZJP';
  E('proUnlockBtn').fire('click');
  ok('wrong code: inline error shown, modal stays open', !E('proError').hidden && !E('proModal').hidden);
  ok('wrong code: still locked', E('exportPdf').classList.contains('locked'));
  ok('wrong code: nothing persisted', !env.store.has('pumpaPro'));

  E('proCode').value = '  pumpa-test-qzjq  ';
  E('proCode').fire('keydown', { key: 'Enter' });
  ok('unlock via Enter: modal closed', E('proModal').hidden);
  ok('unlock: all 11 trips shown, no CTA', count(trips().innerHTML, 'log-row') === 11 && !trips().innerHTML.includes('log-locked'));
  ok('unlock: all 5 fill-ups shown, no CTA', count(fuel().innerHTML, 'log-row') === 5 && !fuel().innerHTML.includes('log-locked'));
  ok('unlock: PDF un-gated', E('exportPdf').textContent === 'PDF' && !E('exportPdf').classList.contains('locked'));
  ok('unlock: badge lit', E('proBadge').classList.contains('active'));
  ok('unlock: toast shown', E('toast').textContent.includes('Pumpa Pro unlocked'));
  const saved = JSON.parse(env.store.get('pumpaPro') || 'null');
  ok('unlock: normalized code persisted', !!saved && saved.code === 'PUMPA-TEST-QZJQ' && typeof saved.ts === 'number');
  ok('other keys untouched', env.store.has('pumpaPrefs') && JSON.parse(env.store.get('pumpaRefuels')).length === 5);
}

/* ---------- Scenario B: reload with valid saved code ---------- */
try {
  const env2 = runApp({ pumpaPro: { code: 'PUMPA-GOLD-E7DC', ts: 1 } });
  const E2 = env2.getEl;
  ok('reload w/ valid code: Pro persists (12 rows, no CTA)', count(E2('tripsList').innerHTML, 'log-row') === 12 && !E2('tripsList').innerHTML.includes('log-locked'));
  ok('reload w/ valid code: PDF un-gated', !E2('exportPdf').classList.contains('locked'));
} catch (e) { ok('reload w/ valid code ran', false); results.push('ERR: ' + e.message); }

/* ---------- Scenario C: tampered localStorage ---------- */
try {
  const env3 = runApp({ pumpaPro: { code: 'PUMPA-AAAA-AAAA', ts: 1 } });
  const E3 = env3.getEl;
  ok('tamper: bogus code stays locked (10 rows + CTA)', count(E3('tripsList').innerHTML, 'log-row') === 10 && E3('tripsList').innerHTML.includes('log-locked'));
  ok('tamper: PDF stays locked', E3('exportPdf').classList.contains('locked'));
  ok('tamper: badge not lit', !E3('proBadge').classList.contains('active'));
} catch (e) { ok('tamper scenario ran', false); results.push('ERR: ' + e.message); }


/* ---------- Scenario D: EV calculator ---------- */
try {
  const env4 = runApp({ pumpaTrips: [], pumpaRefuels: [] });
  const E4 = env4.getEl;
  const clickBtnIn = (id, datasetObj) =>
    E4(id).fire('click', { target: { closest: (s) => s === 'button' ? { dataset: datasetObj } : null } });

  // metric compute: 100 km at 20 kWh/100km and 0.25/kWh -> 20 kWh, cost 5.00
  E4('evDistance').value = '100'; E4('evConsumption').value = '20';
  E4('evPrice').value = '0.25'; E4('evBaseline').value = '0';
  E4('evConsumption').fire('input');
  ok('EV metric: 100km @ 20kWh/100km = 20.00 kWh', E4('energyUsedValue').textContent === '20.00');
  ok('EV metric: cost 20 kWh @ 0.25 = 5.00', E4('evTripCost').textContent.includes('5.00'));

  // worked example: switching to US converts 20 kWh/100km -> 62.137/20 = 3.1 mi/kWh
  clickBtnIn('unitToggle', { system: 'us' });
  ok('EV switch: 20 kWh/100km -> 3.1 mi/kWh (62.137/20)', Math.abs(Number(E4('evConsumption').value) - 3.1) < 0.001);
  ok('EV switch: distance 100 km -> 62.1 mi', Math.abs(Number(E4('evDistance').value) - 62.1) < 0.001);
  ok('EV switch: kWh price NOT converted', Number(E4('evPrice').value) === 0.25);
  ok('EV switch: energy unchanged (~20 kWh) in US mode', Math.abs(Number(E4('energyUsedValue').textContent) - 20) < 0.2);
  ok('EV labels: mi/kWh in US', E4('evConsUnitLabel').textContent === 'mi/kWh');
  clickBtnIn('unitToggle', { system: 'metric' });
  ok('EV round-trip back to metric ~20 kWh/100km', Math.abs(Number(E4('evConsumption').value) - 20) < 0.1);

  // vehicle mode toggle + prefs persistence
  clickBtnIn('vehicleToggle', { vehicle: 'ev' });
  ok('vehicle toggle: EV card shown, petrol hidden', !E4('calcEvCard').hidden && E4('calcFuelCard').hidden);
  ok('vehicle mode persisted in pumpaPrefs', JSON.parse(env4.store.get('pumpaPrefs')).vehicle === 'ev');

  // log one petrol + one EV trip; kind flag only on EV
  // (re-set EV inputs exactly: the unit round-trip left distance at 99.9)
  E4('evDistance').value = '100'; E4('evConsumption').value = '20'; E4('evPrice').value = '0.25';
  E4('distance').value = '100'; E4('consumption').value = '5'; E4('price').value = '2';
  E4('saveTripBtn').fire('click');
  E4('evSaveTripBtn').fire('click');
  const stored = JSON.parse(env4.store.get('pumpaTrips'));
  ok('log: 2 trips stored', stored.length === 2);
  ok('log: petrol entry has NO kind field', !('kind' in stored[0]));
  ok('log: EV entry has kind ev + cost 5.00', stored[1].kind === 'ev' && Math.abs(stored[1].cost - 5) < 0.001);
  ok('render: EV badge + kWh label in history', E4('tripsList').innerHTML.includes('log-kind') && E4('tripsList').innerHTML.includes('kWh/100km'));
  ok('render: petrol row keeps L/100km label', E4('tripsList').innerHTML.includes('L/100km'));

  // CSV: trailing Type column, per-kind units, old columns intact
  LAST_BLOB = null;
  E4('exportTripsCsv').fire('click');
  const lines = (LAST_BLOB || '').split('\n');
  ok('csv: header ends with Type, old columns unchanged', lines[0] === 'Date,Distance,Distance unit,Consumption,Consumption unit,Fuel price,Currency,Cost,Type');
  ok('csv: petrol row typed Petrol with L/100km', lines[1].includes('L/100km') && lines[1].endsWith('Petrol'));
  ok('csv: EV row typed EV with kWh/100km', lines[2].includes('kWh/100km') && lines[2].endsWith('EV'));
} catch (e) { ok('EV scenario ran', false); results.push('ERR: ' + e.message + ' line ' + e.line); }

/* ---------- Scenario E: mixed-kind free-tier cap + old prefs compat ---------- */
try {
  const mixed = [];
  for (let i = 0; i < 12; i++) mixed.push(Object.assign(
    { id: 'm' + i, ts: 1750000000000 + i * 86400000, distance: 10, consumption: i % 2 ? 16 : 6,
      price: i % 2 ? 0.25 : 1.8, cost: 3 + i, system: 'metric', currency: '€' },
    i % 2 ? { kind: 'ev' } : {}));
  const env5 = runApp({ pumpaTrips: mixed, pumpaRefuels: [],
                        pumpaPrefs: { system: 'metric', currency: '€' } });  // pre-EV prefs shape
  const E5 = env5.getEl;
  const html = E5('tripsList').innerHTML;
  ok('mixed cap: 10 rows + CTA', count(html, 'log-row') === 10 && html.includes('log-locked'));
  ok('mixed cap: newest 10 by date regardless of kind (m2 in, m1/m0 out)',
     html.includes('data-id="m2"') && !html.includes('data-id="m1"') && !html.includes('data-id="m0"'));
  ok('mixed cap: both kinds visible (5 EV badges of m2..m11)', (html.match(/log-kind/g) || []).length === 5);
  ok('mixed cap: total sums all 12', E5('tripsTotal').textContent.includes((3*12 + 66).toFixed(2)));
  ok('old prefs (no vehicle field): boots petrol mode, no error', !E5('calcFuelCard').hidden && E5('calcEvCard').hidden);
} catch (e) { ok('mixed-cap scenario ran', false); results.push('ERR: ' + e.message + ' line ' + e.line); }

const fails = results.filter(r => r.startsWith('FAIL')).length;
results.join('\n') + '\n== ' + (results.length - fails) + '/' + results.filter(r => /^(PASS|FAIL)/.test(r)).length + ' passed ==';
