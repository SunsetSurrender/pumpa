# Pumpa — Roadmap

Forward-looking direction. Context for planning, NOT a to-do list to action unprompted.
Current state: multi-page Astro site, redesigned (clean/warm/accessible), tool is
local-first (localStorage), Pro-unlock scaffolding in place. Backend not yet built.

---

## Guiding principle for monetisation

**Gate added value, never access to a user's own data.**

- FREE: use the full tool, see all reports on screen, export your own raw data as CSV.
  Exporting your own logged trips is their data — under GDPR people have a right to it in
  portable form, and blocking it cuts against Pumpa's "your data stays yours" brand.
- PRO (one-time unlock): the *enhanced* things — the polished multi-section PDF report
  (formatted, charts, branded), unlimited history depth, multi-vehicle, EV features,
  and cross-device sync (only once accounts exist).

Rationale: gating *download of data you can already see* is a weak gate (screenshot /
print-to-PDF bypass it), feels petty, and is GDPR-awkward for an EU product. Charging for
*more and nicer* converts better because it feels fair — and fair is on-brand.

Superseded idea (do not implement): "view reports free, pay to download them." Replaced by
the principle above.

---

## Phased direction

### Near term — ships without a backend
- **Route cost comparator** (already prototyped): compare two routes (e.g. highway+toll vs
  longer no-toll) on distance, fuel cost, toll, total. Manual entry — useful without
  routing. Self-contained, no backend. Good, keep.
- **More Tips content** — the SEO engine. Each article its own URL. Ongoing.
- **Design polish** — iterate on the redesign once it's had time to settle.
- **PWA** — installable to home screen, offline, no app-store fees. Cheapest path to "an
  app" since the tool is already local-first. Do this before any native/store app.

### Mid term — the anonymous backend (justified, read-only, no accounts)
- **Fuel-price map** — "prezzi benzina vicino a me" / "gas prices near me". High-intent,
  recurring, localised search demand — an acquisition front door a calculator can't be.
  Official government open-data feeds, ONE country first (whichever matches the user base),
  then expand. Needs an API proxy (keys can't live client-side) + caching. Attribution /
  commercial-reuse terms vary per feed — check per country.
- **"Best station for you" logic** — rank stations by location + fuel type + distance and
  surface a single recommendation, not just a list. This is the differentiator vs generic
  price lists: *your* answer, a reason to return.
- **Manual price corrections (crowdsourced)** — let users submit fresher prices than the
  official feed. Needs the shared DB + basic anti-abuse (one bad entry poisons it).

### The EV direction — highest-upside expansion
Strategically the strongest lever: EV owners are a growing, underserved, tech-comfortable,
cost-obsessed audience, and the cost math (home vs public kWh rates, peak/off-peak, charger
speeds) is genuinely harder than petrol — so a good free tool has real pull. Rides the same
anonymous-map backend. **Charger data source: Open Charge Map** — free, well-documented
global API, no per-feed fragmentation, so the charger map is arguably EASIER than the fuel
map.
- **EV cost calculator** — cost per trip from cost-per-kWh + consumption (kWh/100km or
  mi/kWh), mirroring the petrol calculator. Unit/currency system already handles the rest.
- **Charging-point map** — nearby chargers via Open Charge Map, filterable by connector
  type / speed.
- **Road-trip planner (2.0, hard)** — routes that pass via chargers, with range modelling.
  Substantial engineering (routing + availability + range); established competitors exist
  (e.g. ABRP). North-star, not a quick add. Scope carefully before committing.

### Later — only if usage justifies it
- **Accounts + online trips / cross-device sync** — the heavy one. Brings auth, a user DB,
  and full GDPR controller obligations (consent, export, deletion, breach duties). Keep
  trips LOCAL until there's demand; offer sync as a Pro opt-in benefit, never a barrier on
  arrival. Note: the anonymous map backend does NOT require this — keep the two decoupled.
- **Native / app-store app** — only once earning justifies the €99/yr + review overhead.
  PWA first covers most of the "app" benefit for near-zero cost.

---

## Revenue reality (keep expectations honest)
- The fuel calculator alone is a ~€10–100/month tool — a cushion, not the engine.
- The map (acquisition) and especially the EV expansion (bigger, hungrier audience) are
  what could lift this toward the €5k/month goal — a 12–18 month arc, not a quick win.
- Ads: one or two non-invasive slots (below calculator, tips sidebar) — soft, not a hard
  adblock wall. Keep the landing hero ad-free.
- Affiliates that fit the audience (insurance, dashcams, OBD readers, EV chargers) can
  outperform display ads because intent is high.

---

## Open reviews / loose ends
- Live keyboard walkthrough of theme toggle + Pro modal — needs a human pass.
- Redesign polish — flagged as "room for improvement", pending judgement.
- Lighthouse was auto-verified in light theme only; dark + contrast rest on numeric
  contrast validation. A per-theme manual check is still worth doing.
- Real EN/IT/ES i18n (translated pages + per-locale routing + `lang`) — deferred, its own
  dedicated pass. No non-functional language switcher in the meantime.
- Privacy policy — GDPR-compliant, needs real legal review before launch (not just a
  generated template).
