(() => {
'use strict';

/* ============================================================
   STATE + CONSTANTS
   ============================================================ */
const KM_PER_MILE = 1.60934;
const L_PER_US_GAL = 3.78541;
const L_PER_UK_GAL = 4.54609;

/* EV consumption pivot. c kWh/100km means 100 km uses c kWh, and
   100 km = 100 / 1.60934 = 62.137 mi — so mi/kWh = MI_PER_100KM / c.
   Worked example: 20 kWh/100km → 62.137 / 20 = 3.107 mi/kWh.
   Like MPG ↔ L/100km, the relationship is INVERSE, and the same
   formula converts both directions. */
const MI_PER_100KM = 100 / KM_PER_MILE;

const UNIT_LABELS = {
  metric: { dist: 'km', cons: 'L/100km', fuel: 'L',   priceSuffix: '/L',   evCons: 'kWh/100km', energy: 'kWh', evPriceSuffix: '/kWh' },
  us:     { dist: 'mi', cons: 'MPG',      fuel: 'gal', priceSuffix: '/gal', evCons: 'mi/kWh',    energy: 'kWh', evPriceSuffix: '/kWh' },
  uk:     { dist: 'mi', cons: 'MPG',      fuel: 'L',   priceSuffix: '/L',   evCons: 'mi/kWh',    energy: 'kWh', evPriceSuffix: '/kWh' }
};

let currentSystem = 'metric';
let currentCurrency = '€';
let currentVehicle = 'fuel';

const TRIPS_KEY  = 'pumpaTrips';
const REFUEL_KEY = 'pumpaRefuels';
const PREF_KEY   = 'pumpaPrefs';
const MANUAL_PRICE_KEY = 'pumpaManualPrice';
const PRO_KEY = 'pumpaPro';

/* Free-tier caps apply to what is DISPLAYED only — stored data is never truncated. */
const FREE_TRIP_LIMIT = 10;
const FREE_REFUEL_LIMIT = 3;

/* ============================================================
   DOM REFS
   ============================================================ */
const $ = (id) => document.getElementById(id);

const distanceEl = $('distance'), consumptionEl = $('consumption'),
      priceEl = $('price'), baselineEl = $('baseline');
const fuelUsedValueEl = $('fuelUsedValue'), fuelUnitLabelEl = $('fuelUnitLabel');
const tripCostEl = $('tripCost'), baselineCostEl = $('baselineCost');
const deltaRowEl = $('deltaRow'), deltaValueEl = $('deltaValue');
const distUnitLabelEl = $('distUnitLabel'), consUnitLabelEl = $('consUnitLabel'),
      priceUnitLabelEl = $('priceUnitLabel'), baselineUnitLabelEl = $('baselineUnitLabel');
const unitToggleEl = $('unitToggle');
const currencySelectEl = $('currencySelect'), customCurrencyEl = $('customCurrency');

const tripsListEl = $('tripsList'), tripsTotalEl = $('tripsTotal');

const refuelAmountEl = $('refuelAmount'), refuelCostEl = $('refuelCost'),
      refuelOdoEl = $('refuelOdo'), refuelDateEl = $('refuelDate'),
      refuelListEl = $('refuelList');
const refuelAmountLabelEl = $('refuelAmountLabel'), refuelCostLabelEl = $('refuelCostLabel'),
      refuelOdoLabelEl = $('refuelOdoLabel');
const rptMonthSpendEl = $('rptMonthSpend'), rptMonthSubEl = $('rptMonthSub'),
      rptAvgFillEl = $('rptAvgFill'), rptRealConsEl = $('rptRealCons'),
      rptRealConsSubEl = $('rptRealConsSub'), rptDaysBetweenEl = $('rptDaysBetween'),
      monthlyBarsEl = $('monthlyBars');

const manualPriceEl = $('manualPrice'), manualPriceLabelEl = $('manualPriceLabel');

const vehicleToggleEl = $('vehicleToggle');
const calcFuelCardEl = $('calcFuelCard'), calcEvCardEl = $('calcEvCard');
const evDistanceEl = $('evDistance'), evConsumptionEl = $('evConsumption'),
      evPriceEl = $('evPrice'), evBaselineEl = $('evBaseline');
const energyUsedValueEl = $('energyUsedValue'), energyUnitLabelEl = $('energyUnitLabel');
const evTripCostEl = $('evTripCost'), evBaselineCostEl = $('evBaselineCost');
const evDeltaRowEl = $('evDeltaRow'), evDeltaValueEl = $('evDeltaValue');
const evDistUnitLabelEl = $('evDistUnitLabel'), evConsUnitLabelEl = $('evConsUnitLabel'),
      evPriceUnitLabelEl = $('evPriceUnitLabel'), evBaselineUnitLabelEl = $('evBaselineUnitLabel');

/* ============================================================
   UTILITIES
   ============================================================ */
function num(el){ const v = Number.parseFloat(el.value); return Number.isNaN(v) ? 0 : v; }
function round(v, dp){ const f = 10 ** dp; return Math.round(v * f) / f; }
function currencySymbol(){ return currentCurrency; }

function readJson(key, fallback){
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value){
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function readCollection(key){
  const value = readJson(key, []);
  return Array.isArray(value) ? value : [];
}

function createId(){
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function toFiniteNumber(value){
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function unitLabels(system){
  return UNIT_LABELS[system] || UNIT_LABELS.metric;
}

function escapeHtml(value){
  const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(value).replace(/[&<>"']/g, (character) => entities[character]);
}

let toastTimer;
function toast(msg){
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
}

/* ---- conversions (pivot through km / L-per-100km / price-per-liter) ---- */
function distanceToKm(v, s){ return s === 'metric' ? v : v * KM_PER_MILE; }
function kmToDistance(km, s){ return s === 'metric' ? km : km / KM_PER_MILE; }
function consumptionToL100km(v, s){
  if (s === 'metric') return v;
  if (v <= 0) return 0;
  return (s === 'us' ? 235.214 : 282.481) / v;
}
function l100kmToConsumption(l, s){
  if (s === 'metric') return l;
  if (l <= 0) return 0;
  return (s === 'us' ? 235.214 : 282.481) / l;
}
function priceToPerLiter(v, s){ return s === 'us' ? v / L_PER_US_GAL : v; }
function priceFromPerLiter(p, s){ return s === 'us' ? p * L_PER_US_GAL : p; }

/* EV: kWh/100km ↔ mi/kWh (inverse — see MI_PER_100KM above).
   Energy price is per kWh in every system, so it never converts. */
function evConsumptionToKwh100km(v, s){
  if (s === 'metric') return v;
  if (v <= 0) return 0;
  return MI_PER_100KM / v;
}
function kwh100kmToEvConsumption(l, s){
  if (s === 'metric') return l;
  if (l <= 0) return 0;
  return MI_PER_100KM / l;
}

/* ============================================================
   PREFS + LOCALE
   ============================================================ */
const LOCALE_MAP = {
  US:{system:'us',currency:'$'}, GB:{system:'uk',currency:'£'},
  CA:{system:'metric',currency:'$'}, AU:{system:'metric',currency:'$'},
  NZ:{system:'metric',currency:'$'}, IE:{system:'metric',currency:'€'},
  DE:{system:'metric',currency:'€'}, FR:{system:'metric',currency:'€'},
  IT:{system:'metric',currency:'€'}, ES:{system:'metric',currency:'€'},
  PT:{system:'metric',currency:'€'}, NL:{system:'metric',currency:'€'},
  BE:{system:'metric',currency:'€'}, AT:{system:'metric',currency:'€'},
  GR:{system:'metric',currency:'€'}, FI:{system:'metric',currency:'€'},
  IN:{system:'metric',currency:'₹'}, BR:{system:'metric',currency:'R$'},
  JP:{system:'metric',currency:'¥'}, CN:{system:'metric',currency:'¥'},
  SE:{system:'metric',currency:'kr'}, NO:{system:'metric',currency:'kr'},
  DK:{system:'metric',currency:'kr'}, PL:{system:'metric',currency:'zł'}
};
const DEFAULT_PREFS = { system:'metric', currency:'€' };

function detectLocalePrefs(){
  try {
    const langs = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language];
    for (const l of langs){
      const parts = l.split('-');
      if (parts.length > 1){
        const region = parts[parts.length-1].toUpperCase();
        if (LOCALE_MAP[region]) return LOCALE_MAP[region];
      }
    }
  } catch {}
  return DEFAULT_PREFS;
}

function normalizePrefs(prefs){
  const system = prefs && UNIT_LABELS[prefs.system] ? prefs.system : DEFAULT_PREFS.system;
  const currency = prefs && typeof prefs.currency === 'string' && prefs.currency.trim()
    ? prefs.currency.trim()
    : DEFAULT_PREFS.currency;
  /* vehicle is additive + optional: prefs saved before the EV feature lack it. */
  const vehicle = prefs && prefs.vehicle === 'ev' ? 'ev' : 'fuel';
  return { system, currency, vehicle };
}

function loadPrefs(){ return readJson(PREF_KEY, null); }
function savePrefs(){ writeJson(PREF_KEY, { system: currentSystem, currency: currentCurrency, vehicle: currentVehicle }); }

/* ============================================================
   LABELS
   ============================================================ */
function updateLabels(){
  const u = UNIT_LABELS[currentSystem];
  distUnitLabelEl.textContent = u.dist;
  baselineUnitLabelEl.textContent = u.dist;
  consUnitLabelEl.textContent = u.cons;
  priceUnitLabelEl.textContent = currentCurrency + u.priceSuffix;
  fuelUnitLabelEl.textContent = u.fuel;
  refuelAmountLabelEl.textContent = u.fuel;
  refuelCostLabelEl.textContent = currentCurrency;
  refuelOdoLabelEl.textContent = u.dist;
  manualPriceLabelEl.textContent = currentCurrency + u.priceSuffix;

  evDistUnitLabelEl.textContent = u.dist;
  evBaselineUnitLabelEl.textContent = u.dist;
  evConsUnitLabelEl.textContent = u.evCons;
  evPriceUnitLabelEl.textContent = currentCurrency + u.evPriceSuffix;
  energyUnitLabelEl.textContent = u.energy;
}

function updateUnitToggle(){
  unitToggleEl.querySelectorAll('button').forEach((button) => {
    const isActive = button.dataset.system === currentSystem;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function refreshUi(){
  updateLabels();
  calc();
  evCalc();
  renderTrips();
  renderRefuels();
}

/* ============================================================
   UNIT SYSTEM SWITCH
   ============================================================ */
function switchSystem(newSystem){
  if (!UNIT_LABELS[newSystem] || newSystem === currentSystem) return;
  const oldSystem = currentSystem;

  distanceEl.value = round(kmToDistance(distanceToKm(num(distanceEl), oldSystem), newSystem), 1);
  baselineEl.value = round(kmToDistance(distanceToKm(num(baselineEl), oldSystem), newSystem), 1);
  consumptionEl.value = round(l100kmToConsumption(consumptionToL100km(num(consumptionEl), oldSystem), newSystem), 1);
  priceEl.value = round(priceFromPerLiter(priceToPerLiter(num(priceEl), oldSystem), newSystem), 3);

  evDistanceEl.value = round(kmToDistance(distanceToKm(num(evDistanceEl), oldSystem), newSystem), 1);
  evBaselineEl.value = round(kmToDistance(distanceToKm(num(evBaselineEl), oldSystem), newSystem), 1);
  evConsumptionEl.value = round(kwh100kmToEvConsumption(evConsumptionToKwh100km(num(evConsumptionEl), oldSystem), newSystem), 1);
  /* evPrice: per kWh everywhere — no conversion */

  currentSystem = newSystem;
  updateUnitToggle();
  refreshUi();
}

unitToggleEl.addEventListener('click', (ev) => {
  const btn = ev.target.closest('button');
  if (!btn) return;
  switchSystem(btn.dataset.system);
  savePrefs();
});

currencySelectEl.addEventListener('change', () => {
  if (currencySelectEl.value === 'custom'){
    customCurrencyEl.classList.add('visible');
    customCurrencyEl.focus();
    currentCurrency = customCurrencyEl.value.trim() || currentCurrency;
  } else {
    customCurrencyEl.classList.remove('visible');
    currentCurrency = currencySelectEl.value;
  }
  refreshUi();
  savePrefs();
});
customCurrencyEl.addEventListener('input', () => {
  currentCurrency = customCurrencyEl.value.trim() || '?';
  refreshUi();
  savePrefs();
});

/* ============================================================
   TRIP CALCULATOR
   ============================================================ */
function computeTrip(distance, consumption, price, system){
  if (system === 'metric'){
    const f = distance * consumption / 100;
    return { fuelUsedNative: f, cost: f * price };
  }
  if (system === 'us'){
    const g = consumption > 0 ? distance / consumption : 0;
    return { fuelUsedNative: g, cost: g * price };
  }
  const gUK = consumption > 0 ? distance / consumption : 0;
  const liters = gUK * L_PER_UK_GAL;
  return { fuelUsedNative: liters, cost: liters * price };
}

function calc(){
  const distance = num(distanceEl), consumption = num(consumptionEl),
        price = num(priceEl), baseline = num(baselineEl);
  const cur = currencySymbol();

  const trip = computeTrip(distance, consumption, price, currentSystem);
  const base = computeTrip(baseline, consumption, price, currentSystem);
  const delta = trip.cost - base.cost;

  fuelUsedValueEl.textContent = trip.fuelUsedNative.toFixed(2);
  tripCostEl.textContent = cur + trip.cost.toFixed(2);
  baselineCostEl.textContent = cur + base.cost.toFixed(2);

  deltaRowEl.classList.remove('up','down');
  if (Math.abs(delta) < 0.005){ deltaValueEl.textContent = cur + '0.00'; }
  else if (delta > 0){ deltaRowEl.classList.add('up'); deltaValueEl.textContent = '+' + cur + delta.toFixed(2); }
  else { deltaRowEl.classList.add('down'); deltaValueEl.textContent = '−' + cur + Math.abs(delta).toFixed(2); }
}

[distanceEl, consumptionEl, priceEl, baselineEl].forEach(el => el.addEventListener('input', calc));

$('resetBtn').addEventListener('click', () => {
  distanceEl.value = round(kmToDistance(70.5, currentSystem), 1);
  baselineEl.value = round(kmToDistance(64, currentSystem), 1);
  consumptionEl.value = round(l100kmToConsumption(3.4, currentSystem), 1);
  priceEl.value = round(priceFromPerLiter(1.777, currentSystem), 3);
  calc();
});

/* ============================================================
   EV TRIP CALCULATOR
   Peer of the petrol calculator: same units/currency machinery,
   energy in kWh, price per kWh (never converted between systems).
   ============================================================ */
function computeEvTrip(distance, consumption, price, system){
  if (system === 'metric'){
    const kwh = distance * consumption / 100;         /* kWh/100km */
    return { energyUsed: kwh, cost: kwh * price };
  }
  const kwh = consumption > 0 ? distance / consumption : 0;  /* mi/kWh */
  return { energyUsed: kwh, cost: kwh * price };
}

function evCalc(){
  const distance = num(evDistanceEl), consumption = num(evConsumptionEl),
        price = num(evPriceEl), baseline = num(evBaselineEl);
  const cur = currencySymbol();

  const trip = computeEvTrip(distance, consumption, price, currentSystem);
  const base = computeEvTrip(baseline, consumption, price, currentSystem);
  const delta = trip.cost - base.cost;

  energyUsedValueEl.textContent = trip.energyUsed.toFixed(2);
  evTripCostEl.textContent = cur + trip.cost.toFixed(2);
  evBaselineCostEl.textContent = cur + base.cost.toFixed(2);

  evDeltaRowEl.classList.remove('up','down');
  if (Math.abs(delta) < 0.005){ evDeltaValueEl.textContent = cur + '0.00'; }
  else if (delta > 0){ evDeltaRowEl.classList.add('up'); evDeltaValueEl.textContent = '+' + cur + delta.toFixed(2); }
  else { evDeltaRowEl.classList.add('down'); evDeltaValueEl.textContent = '−' + cur + Math.abs(delta).toFixed(2); }
}

[evDistanceEl, evConsumptionEl, evPriceEl, evBaselineEl].forEach(el => el.addEventListener('input', evCalc));

$('evResetBtn').addEventListener('click', () => {
  evDistanceEl.value = round(kmToDistance(70.5, currentSystem), 1);
  evBaselineEl.value = round(kmToDistance(64, currentSystem), 1);
  evConsumptionEl.value = round(kwh100kmToEvConsumption(16, currentSystem), 1);
  evPriceEl.value = 0.25;
  evCalc();
});

function switchVehicle(mode){
  if (mode !== 'fuel' && mode !== 'ev') return;
  currentVehicle = mode;
  calcFuelCardEl.hidden = mode !== 'fuel';
  calcEvCardEl.hidden = mode !== 'ev';
  vehicleToggleEl.querySelectorAll('button').forEach((button) => {
    const isActive = button.dataset.vehicle === mode;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

vehicleToggleEl.addEventListener('click', (ev) => {
  const btn = ev.target.closest('button');
  if (!btn) return;
  switchVehicle(btn.dataset.vehicle);
  savePrefs();
});

/* ============================================================
   TRIPS STORE
   ============================================================ */
function loadTrips(){ return readCollection(TRIPS_KEY); }
function saveTrips(entries){ writeJson(TRIPS_KEY, entries); }

function renderTrips(){
  const entries = loadTrips();
  if (entries.length === 0){
    tripsListEl.innerHTML = '<div class="log-empty">No trips logged yet.<br>Log one from the Calculate tab.</div>';
    tripsTotalEl.textContent = currencySymbol() + '0.00 total';
    updateExportCounts();
    return;
  }
  const total = entries.reduce((sum, entry) => sum + toFiniteNumber(entry.cost), 0);
  tripsTotalEl.textContent = currencySymbol() + total.toFixed(2) + ' total';
  const sorted = [...entries].sort((a,b) => b.ts - a.ts);
  const visible = isPro() ? sorted : sorted.slice(0, FREE_TRIP_LIMIT);
  const hidden = sorted.length - visible.length;
  tripsListEl.innerHTML = visible.map(e => {
    const u = unitLabels(e.system);
    const isEv = e.kind === 'ev';
    const cur = escapeHtml(e.currency || '€');
    const d = new Date(e.ts).toLocaleDateString(undefined, {day:'2-digit', month:'short', year:'2-digit'});
    return `<div class="log-row" data-id="${escapeHtml(e.id)}">
      <div class="log-info">
        <div class="log-date">${escapeHtml(d)}${isEv ? ' <span class="log-kind">EV</span>' : ''}</div>
        <div class="log-detail">${escapeHtml(e.distance)} ${u.dist} · ${escapeHtml(e.consumption)} ${isEv ? u.evCons : u.cons}</div>
      </div>
      <div class="log-right">
        <div class="log-cost">${cur}${toFiniteNumber(e.cost).toFixed(2)}</div>
        <button type="button" class="log-del" data-id="${escapeHtml(e.id)}" aria-label="Delete trip">×</button>
      </div>
    </div>`;
  }).join('') + (hidden > 0 ? lockedRowHtml(hidden, hidden === 1 ? 'trip' : 'trips') : '');
  updateExportCounts();
}

$('saveTripBtn').addEventListener('click', () => {
  const distance = num(distanceEl), consumption = num(consumptionEl), price = num(priceEl);
  const trip = computeTrip(distance, consumption, price, currentSystem);
  const entries = loadTrips();
  entries.push({
    id: createId(),
    ts: Date.now(), distance, consumption, price,
    cost: trip.cost, system: currentSystem, currency: currentCurrency
  });
  saveTrips(entries);
  renderTrips();
  toast('Trip logged ✓');
});

/* EV trips share pumpaTrips; kind:'ev' is the only difference.
   Entries without a kind are petrol — old data is never rewritten. */
$('evSaveTripBtn').addEventListener('click', () => {
  const distance = num(evDistanceEl), consumption = num(evConsumptionEl), price = num(evPriceEl);
  const trip = computeEvTrip(distance, consumption, price, currentSystem);
  const entries = loadTrips();
  entries.push({
    id: createId(), kind: 'ev',
    ts: Date.now(), distance, consumption, price,
    cost: trip.cost, system: currentSystem, currency: currentCurrency
  });
  saveTrips(entries);
  renderTrips();
  toast('Trip logged ✓');
});

tripsListEl.addEventListener('click', (ev) => {
  if (ev.target.closest('[data-pro-cta]')){
    openProModal('Free plan shows the last ' + FREE_TRIP_LIMIT + ' trips. Your data is safe — unlock to see everything.');
    return;
  }
  const btn = ev.target.closest('.log-del');
  if (!btn) return;
  saveTrips(loadTrips().filter(e => e.id !== btn.dataset.id));
  renderTrips();
});

/* ============================================================
   REFUEL STORE + REPORTS
   ============================================================ */
function loadRefuels(){ return readCollection(REFUEL_KEY); }
function saveRefuels(entries){ writeJson(REFUEL_KEY, entries); }

function formatLocalISODate(date){
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
function initRefuelDate(){ if (!refuelDateEl.value) refuelDateEl.value = formatLocalISODate(new Date()); }

function computeReports(){
  const entries = loadRefuels().slice().sort((a,b) => new Date(a.date) - new Date(b.date));
  const now = new Date();
  const monthKey = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0');

  let monthSpend = 0, monthCount = 0;
  entries.forEach(e => { if (e.date.slice(0,7) === monthKey){ monthSpend += toFiniteNumber(e.cost); monthCount++; } });
  rptMonthSpendEl.textContent = currentCurrency + monthSpend.toFixed(2);
  rptMonthSubEl.textContent = monthCount + (monthCount === 1 ? ' fill-up' : ' fill-ups');

  if (entries.length){
    const total = entries.reduce((sum, entry) => sum + toFiniteNumber(entry.cost), 0);
    rptAvgFillEl.textContent = currentCurrency + (total / entries.length).toFixed(2);
  } else {
    rptAvgFillEl.textContent = currentCurrency + '0.00';
  }

  const withOdo = entries.filter(e => e.odo != null && !Number.isNaN(Number(e.odo)));
  if (withOdo.length >= 2){
    const first = withOdo[0], last = withOdo[withOdo.length-1];
    const distanceKm = distanceToKm(toFiniteNumber(last.odo), last.system || 'metric')
      - distanceToKm(toFiniteNumber(first.odo), first.system || 'metric');
    let fuelLiters = 0;
    for (let i = 1; i < withOdo.length; i++){
      const entry = withOdo[i];
      const amount = toFiniteNumber(entry.amount);
      fuelLiters += entry.system === 'us' ? amount * L_PER_US_GAL : amount;
    }
    if (distanceKm > 0 && fuelLiters > 0){
      if (currentSystem === 'us'){
        const miles = kmToDistance(distanceKm, 'us');
        const gallons = fuelLiters / L_PER_US_GAL;
        rptRealConsEl.textContent = (miles / gallons).toFixed(1);
        rptRealConsSubEl.textContent = 'MPG';
      } else {
        rptRealConsEl.textContent = ((fuelLiters / distanceKm) * 100).toFixed(1);
        rptRealConsSubEl.textContent = 'L/100km';
      }
    } else { rptRealConsEl.textContent = '—'; rptRealConsSubEl.textContent = 'check odometer'; }
  } else { rptRealConsEl.textContent = '—'; rptRealConsSubEl.textContent = 'needs 2+ odometer'; }

  if (entries.length >= 2){
    const days = (new Date(entries[entries.length-1].date) - new Date(entries[0].date)) / (864e5);
    rptDaysBetweenEl.textContent = (days / (entries.length-1)).toFixed(0) + 'd';
  } else { rptDaysBetweenEl.textContent = '—'; }

  renderMonthlyChart(entries);
}

function renderMonthlyChart(entries){
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--){
    const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
    months.push({ key: d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'),
                  label: d.toLocaleDateString(undefined,{month:'short'}), total: 0 });
  }
  entries.forEach(e => { const m = months.find(mm => mm.key === e.date.slice(0,7)); if (m) m.total += toFiniteNumber(e.cost); });
  const max = Math.max(...months.map(m => m.total), 1);
  monthlyBarsEl.innerHTML = months.map(m => {
    const h = Math.round((m.total / max) * 100);
    return `<div class="mc-bar-wrap">
      <div class="mc-bar-value">${m.total > 0 ? Math.round(m.total) : ''}</div>
      <div class="mc-bar" style="height:${h}%"></div>
      <div class="mc-bar-label">${m.label}</div>
    </div>`;
  }).join('');
}

function renderRefuels(){
  const entries = loadRefuels().slice().sort((a,b) => new Date(b.date) - new Date(a.date));
  if (entries.length === 0){
    refuelListEl.innerHTML = '<div class="log-empty">No fill-ups logged yet.</div>';
    computeReports(); updateExportCounts(); return;
  }
  const visible = isPro() ? entries : entries.slice(0, FREE_REFUEL_LIMIT);
  const hidden = entries.length - visible.length;
  refuelListEl.innerHTML = visible.map(e => {
    const u = unitLabels(e.system);
    const cur = escapeHtml(e.currency || '€');
    const amount = toFiniteNumber(e.amount);
    const cost = toFiniteNumber(e.cost);
    const per = amount > 0 ? (cost / amount) : 0;
    const d = new Date(e.date).toLocaleDateString(undefined,{day:'2-digit',month:'short',year:'2-digit'});
    return `<div class="log-row" data-id="${escapeHtml(e.id)}">
      <div class="log-info">
        <div class="log-date">${escapeHtml(d)}</div>
        <div class="log-detail">${amount} ${u.fuel} · ${cur}${per.toFixed(3)}/${u.fuel}</div>
        ${e.odo != null ? `<div class="log-eff">odo ${escapeHtml(e.odo)} ${u.dist}</div>` : ''}
      </div>
      <div class="log-right">
        <div class="log-cost">${cur}${cost.toFixed(2)}</div>
        <button type="button" class="log-del" data-id="${escapeHtml(e.id)}" aria-label="Delete fill-up">×</button>
      </div>
    </div>`;
  }).join('') + (hidden > 0 ? lockedRowHtml(hidden, hidden === 1 ? 'fill-up' : 'fill-ups') : '');
  computeReports(); updateExportCounts();
}

$('refuelSaveBtn').addEventListener('click', () => {
  const amount = Number.parseFloat(refuelAmountEl.value), cost = Number.parseFloat(refuelCostEl.value),
        odoRaw = Number.parseFloat(refuelOdoEl.value), date = refuelDateEl.value || formatLocalISODate(new Date());
  if (Number.isNaN(amount) || Number.isNaN(cost) || amount <= 0){ toast('Enter amount + cost'); return; }
  const entries = loadRefuels();
  entries.push({
    id: createId(),
    date, amount, cost, odo: Number.isNaN(odoRaw) ? null : odoRaw,
    system: currentSystem, currency: currentCurrency
  });
  saveRefuels(entries);
  renderRefuels();
  refuelAmountEl.value = ''; refuelCostEl.value = ''; refuelOdoEl.value = '';
  toast('Fill-up logged ✓');
});

refuelListEl.addEventListener('click', (ev) => {
  if (ev.target.closest('[data-pro-cta]')){
    openProModal('Free plan shows the last ' + FREE_REFUEL_LIMIT + ' fill-ups. Your data is safe — unlock to see everything.');
    return;
  }
  const btn = ev.target.closest('.log-del');
  if (!btn) return;
  saveRefuels(loadRefuels().filter(e => e.id !== btn.dataset.id));
  renderRefuels();
});

/* ============================================================
   MANUAL PRICE (Prices tab)
   ============================================================ */
$('applyManualPrice').addEventListener('click', () => {
  const v = Number.parseFloat(manualPriceEl.value);
  if (Number.isNaN(v) || v <= 0){ toast('Enter a valid price'); return; }
  priceEl.value = round(v, 3);
  writeJson(MANUAL_PRICE_KEY, { value: v, system: currentSystem, currency: currentCurrency, ts: Date.now() });
  calc();
  toast('Price applied to calculator ✓');
});

/* ============================================================
   PRO ENTITLEMENT
   ============================================================ */
let proUnlocked = false;
let proModalReturnFocus = null;

const PRO_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function fnv1a(str){
  let h = 0x811c9dc5;
  for (const c of str){
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

/* Placeholder validation — swap this single function for a real
   license check (Gumroad/Stripe) later. */
function isValidUnlockCode(raw){
  const match = String(raw || '').trim().toUpperCase().match(/^PUMPA-([A-Z2-9]{4})-([A-Z2-9]{4})$/);
  if (!match) return false;
  let x = fnv1a('PMP/' + match[1] + '/v1');
  let expected = '';
  for (let i = 0; i < 4; i++){
    expected += PRO_CODE_ALPHABET[x % 31];
    x = Math.floor(x / 31);
  }
  return match[2] === expected;
}

function loadProState(){
  const saved = readJson(PRO_KEY, null);
  proUnlocked = !!(saved && typeof saved.code === 'string' && isValidUnlockCode(saved.code));
}

function isPro(){ return proUnlocked; }

function entitlements(){
  return { unlimitedHistory: isPro(), pdfExport: isPro(), adFree: isPro() };
}

function lockedRowHtml(hiddenCount, noun){
  return `<button type="button" class="log-locked" data-pro-cta>+ ${hiddenCount} more ${escapeHtml(noun)} · Unlock with Pumpa Pro</button>`;
}

function updateProUi(){
  const pdfBtn = $('exportPdf');
  pdfBtn.classList.toggle('locked', !isPro());
  pdfBtn.textContent = isPro() ? 'PDF' : '🔒 PDF';
  const badge = $('proBadge');
  badge.classList.toggle('active', isPro());
  badge.title = isPro() ? 'Pumpa Pro active' : 'Upgrade to Pumpa Pro';
}

function openProModal(message){
  proModalReturnFocus = document.activeElement;
  $('proModalReason').textContent = message || 'Unlock the full trip computer.';
  $('proCode').value = '';
  $('proError').hidden = true;
  $('proModal').hidden = false;
  $('proCode').focus();
}

function closeProModal(){
  $('proModal').hidden = true;
  if (proModalReturnFocus && typeof proModalReturnFocus.focus === 'function') proModalReturnFocus.focus();
  proModalReturnFocus = null;
}

function attemptUnlock(){
  const code = $('proCode').value.trim().toUpperCase();
  if (!isValidUnlockCode(code)){
    $('proError').hidden = false;
    $('proCode').focus();
    return;
  }
  writeJson(PRO_KEY, { code, ts: Date.now() });
  proUnlocked = true;
  closeProModal();
  renderTrips();
  renderRefuels();
  updateProUi();
  toast('Pumpa Pro unlocked ✓');
}

$('proUnlockBtn').addEventListener('click', attemptUnlock);
$('proCode').addEventListener('keydown', (ev) => { if (ev.key === 'Enter') attemptUnlock(); });
$('proModalClose').addEventListener('click', closeProModal);
$('proModal').addEventListener('click', (ev) => { if (ev.target === $('proModal')) closeProModal(); });
document.addEventListener('keydown', (ev) => {
  if (ev.key === 'Escape' && !$('proModal').hidden) closeProModal();
});
$('proBadge').addEventListener('click', () => {
  if (isPro()) toast('Pumpa Pro active ✓');
  else openProModal();
});

/* ============================================================
   TABS
   ============================================================ */
function activateTab(tabName){
  document.querySelectorAll('.tab-btn').forEach((button) => {
    const isActive = button.dataset.tab === tabName;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });

  document.querySelectorAll('.panel-view').forEach((panel) => {
    const isActive = panel.dataset.panel === tabName;
    panel.classList.toggle('active', isActive);
    panel.hidden = !isActive;
  });
}

$('tabs').addEventListener('click', (event) => {
  const button = event.target.closest('.tab-btn');
  if (button) activateTab(button.dataset.tab);
});

$('tabs').addEventListener('keydown', (event) => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

  const tabs = [...document.querySelectorAll('.tab-btn')];
  const currentIndex = tabs.indexOf(document.activeElement);
  if (currentIndex < 0) return;

  event.preventDefault();
  let nextIndex = currentIndex;
  if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
  if (event.key === 'Home') nextIndex = 0;
  if (event.key === 'End') nextIndex = tabs.length - 1;

  tabs[nextIndex].focus();
  activateTab(tabs[nextIndex].dataset.tab);
});

/* ============================================================
   EXPORT — CSV + PDF
   ============================================================ */
function csvEscape(v){
  const s = String(v == null ? '' : v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g,'""') + '"' : s;
}
function downloadFile(filename, content, type){
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportTripsCsv(){
  const entries = loadTrips().slice().sort((a,b) => a.ts - b.ts);
  if (!entries.length){ toast('No trips to export'); return; }
  /* 'Type' is appended last so pre-EV consumers of this CSV keep their column order. */
  const header = ['Date','Distance','Distance unit','Consumption','Consumption unit','Fuel price','Currency','Cost','Type'];
  const rows = entries.map(e => {
    const u = unitLabels(e.system);
    const isEv = e.kind === 'ev';
    return [ new Date(e.ts).toISOString().slice(0,10), e.distance, u.dist, e.consumption, isEv ? u.evCons : u.cons,
             e.price, e.currency || '€', toFiniteNumber(e.cost).toFixed(2), isEv ? 'EV' : 'Petrol' ].map(csvEscape).join(',');
  });
  downloadFile('pumpa-trips.csv', [header.join(','), ...rows].join('\n'), 'text/csv');
  toast('Trips CSV downloaded ✓');
}

function exportFuelCsv(){
  const entries = loadRefuels().slice().sort((a,b) => new Date(a.date) - new Date(b.date));
  if (!entries.length){ toast('No fill-ups to export'); return; }
  const header = ['Date','Amount','Amount unit','Total cost','Currency','Price per unit','Odometer','Odometer unit'];
  const rows = entries.map(e => {
    const u = unitLabels(e.system);
    const amount = toFiniteNumber(e.amount);
    const cost = toFiniteNumber(e.cost);
    const per = amount > 0 ? (cost / amount).toFixed(3) : '';
    return [ e.date, amount, u.fuel, cost.toFixed(2), e.currency || '€', per,
             e.odo == null ? '' : e.odo, u.dist ].map(csvEscape).join(',');
  });
  downloadFile('pumpa-fuel-log.csv', [header.join(','), ...rows].join('\n'), 'text/csv');
  toast('Fuel log CSV downloaded ✓');
}

$('exportTripsCsv').addEventListener('click', exportTripsCsv);
$('exportTripsCsv2').addEventListener('click', exportTripsCsv);
$('exportFuelCsv').addEventListener('click', exportFuelCsv);
$('exportFuelCsv2').addEventListener('click', exportFuelCsv);

function updateExportCounts(){
  const t = loadTrips().length, f = loadRefuels().length;
  const te = $('exportTripsCount'), fe = $('exportFuelCount');
  if (te) te.textContent = t + (t === 1 ? ' trip logged' : ' trips logged');
  if (fe) fe.textContent = f + (f === 1 ? ' fill-up logged' : ' fill-ups logged');
}

function exportPdf(){
  const trips = loadTrips().slice().sort((a,b) => a.ts - b.ts);
  const refuels = loadRefuels().slice().sort((a,b) => new Date(a.date) - new Date(b.date));
  const cur = currentCurrency;

  const now = new Date();
  const monthKey = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0');
  const monthSpend = refuels.filter(e => e.date.slice(0,7) === monthKey).reduce((sum, entry) => sum + toFiniteNumber(entry.cost), 0);
  const totalFuel = refuels.reduce((sum, entry) => sum + toFiniteNumber(entry.cost), 0);
  const totalTrips = trips.reduce((sum, entry) => sum + toFiniteNumber(entry.cost), 0);
  const avgFill = refuels.length ? (totalFuel/refuels.length) : 0;

  const tripRows = trips.map(e => {
    const u = unitLabels(e.system);
    return `<tr><td>${new Date(e.ts).toISOString().slice(0,10)}</td><td>${escapeHtml(e.distance)} ${u.dist}</td><td>${escapeHtml(e.consumption)} ${u.cons}</td><td>${escapeHtml(e.currency || '€')}${toFiniteNumber(e.cost).toFixed(2)}</td></tr>`;
  }).join('') || '<tr><td colspan="4" class="muted">No trips logged</td></tr>';

  const fuelRows = refuels.map(e => {
    const u = unitLabels(e.system);
    const odometer = e.odo == null ? '—' : `${e.odo} ${u.dist}`;
    return `<tr><td>${escapeHtml(e.date)}</td><td>${toFiniteNumber(e.amount)} ${u.fuel}</td><td>${escapeHtml(odometer)}</td><td>${escapeHtml(e.currency || '€')}${toFiniteNumber(e.cost).toFixed(2)}</td></tr>`;
  }).join('') || '<tr><td colspan="4" class="muted">No fill-ups logged</td></tr>';

  // Root-absolute: the tool page lives at /calculator/ while report.css stays at the site root.
  const reportStylesUrl = new URL('/report.css', document.baseURI).href;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Pumpa Report</title>
  <link rel="stylesheet" href="${reportStylesUrl}"></head><body>
    <h1>Pumpa — Fuel &amp; Commute Report</h1>
    <div class="sub">Generated ${now.toLocaleDateString(undefined,{day:'numeric',month:'long',year:'numeric'})}</div>
    <div class="cards">
      <div class="c"><div class="l">This month fuel</div><div class="v">${escapeHtml(cur)}${monthSpend.toFixed(2)}</div></div>
      <div class="c"><div class="l">Total fuel spend</div><div class="v">${escapeHtml(cur)}${totalFuel.toFixed(2)}</div></div>
      <div class="c"><div class="l">Avg / fill-up</div><div class="v">${escapeHtml(cur)}${avgFill.toFixed(2)}</div></div>
      <div class="c"><div class="l">Logged trip cost</div><div class="v">${escapeHtml(cur)}${totalTrips.toFixed(2)}</div></div>
    </div>
    <h2>Fill-up log (${refuels.length})</h2>
    <table><thead><tr><th>Date</th><th>Amount</th><th>Odometer</th><th>Cost</th></tr></thead><tbody>${fuelRows}</tbody></table>
    <h2>Trip log (${trips.length})</h2>
    <table><thead><tr><th>Date</th><th>Distance</th><th>Consumption</th><th>Cost</th></tr></thead><tbody>${tripRows}</tbody></table>
    <div class="foot">Pumpa — data stored locally on your device</div>
  </body></html>`;

  const w = window.open('', '_blank');
  if (!w){ toast('Allow pop-ups to export PDF'); return; }
  w.document.write(html);
  w.document.close();
  setTimeout(() => { w.focus(); w.print(); }, 400);
  toast('Opening print dialog…');
}
$('exportPdf').addEventListener('click', () => {
  if (!entitlements().pdfExport){
    openProModal('PDF reports are a Pumpa Pro feature.');
    return;
  }
  exportPdf();
});

/* ============================================================
   INIT
   ============================================================ */
function initUnits(){
  const saved = loadPrefs();
  const prefs = normalizePrefs(saved || detectLocalePrefs());

  if (prefs.system !== 'metric'){
    distanceEl.value = round(kmToDistance(distanceToKm(num(distanceEl),'metric'), prefs.system), 1);
    baselineEl.value = round(kmToDistance(distanceToKm(num(baselineEl),'metric'), prefs.system), 1);
    consumptionEl.value = round(l100kmToConsumption(consumptionToL100km(num(consumptionEl),'metric'), prefs.system), 1);
    priceEl.value = round(priceFromPerLiter(priceToPerLiter(num(priceEl),'metric'), prefs.system), 3);
    evDistanceEl.value = round(kmToDistance(distanceToKm(num(evDistanceEl),'metric'), prefs.system), 1);
    evBaselineEl.value = round(kmToDistance(distanceToKm(num(evBaselineEl),'metric'), prefs.system), 1);
    evConsumptionEl.value = round(kwh100kmToEvConsumption(evConsumptionToKwh100km(num(evConsumptionEl),'metric'), prefs.system), 1);
  }
  currentSystem = prefs.system;
  currentCurrency = prefs.currency;
  switchVehicle(prefs.vehicle);

  updateUnitToggle();

  const known = Array.from(currencySelectEl.options).map(o => o.value);
  if (known.includes(currentCurrency)){
    currencySelectEl.value = currentCurrency;
    customCurrencyEl.classList.remove('visible');
  } else {
    currencySelectEl.value = 'custom';
    customCurrencyEl.value = currentCurrency;
    customCurrencyEl.classList.add('visible');
  }

  updateLabels();
  savePrefs();
}

function restoreManualPrice(){
  const saved = readJson(MANUAL_PRICE_KEY, null);
  if (!saved || saved.system !== currentSystem || saved.currency !== currentCurrency) return;

  const value = Number(saved.value);
  if (!Number.isFinite(value) || value <= 0) return;

  manualPriceEl.value = round(value, 3);
  priceEl.value = round(value, 3);
}

initUnits();
loadProState();
restoreManualPrice();
initRefuelDate();
activateTab('calc');
calc();
evCalc();
renderTrips();
renderRefuels();
updateExportCounts();
updateProUi();
})();
