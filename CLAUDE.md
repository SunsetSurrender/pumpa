# CLAUDE.md — Pumpa

Project context for Claude in VS Code. Read this before making changes.

## What Pumpa is

A client-side fuel & commute cost tracker. A driver enters a trip (distance, fuel
consumption, fuel price) and sees what it costs, logs trips and fill-ups over time,
sees spending reports, and exports the data. Currently a single-page tool; being
restructured into a proper multi-page website around that tool.

## Tech stack

- **Vanilla HTML / CSS / JS. No framework, no build step (unless we deliberately add one).**
- All application logic lives in one IIFE in the JS file.
- **All data is stored client-side in `localStorage`.** There is no backend, no
  accounts, no server. Do not add auth, servers, or databases unless explicitly asked.
- Runs from static files; must work when hosted on any static host.

## File layout

<!-- Keep this section accurate as the repo evolves. -->
- `pumpa-fuel-tracker.html` — markup
- `app.js` — all behaviour (single IIFE)
- `app.css` — all styling
- `report.css` — print-only styles for the exported PDF report (leave alone unless asked)

## Core architecture — do not break these

- **localStorage keys** (renaming/reformatting these silently wipes user data):
  - `pumpaTrips` — logged trips
  - `pumpaRefuels` — logged fill-ups
  - `pumpaPrefs` — unit system + currency preference
  - `pumpaManualPrice` — manual price override from the Prices tab
  - `pumpaPro` — Pro-unlock entitlement `{ code, ts }`
- **Unit system:** Metric / US / UK. Switching live-CONVERTS current values, it does
  not just relabel. Conversions pivot through km / L-per-100km / price-per-liter.
  MPG↔L/100km is INVERSE, not linear — keep that intact.
- **Currency is fully decoupled from the unit system.** Any currency can pair with any
  measurement system. Don't recouple them.
- **Per-entry units/currency:** every stored trip and fill-up records the system +
  currency it was logged in, so old entries still display correctly after a switch.
- **Pro gating:** free tier LIMITS WHAT IS DISPLAYED/EXPORTED only — it never truncates
  or deletes stored data. Totals, reports, the monthly chart, and CSV exports always use
  the full dataset. `entitlements()` is the single seam intended for rewiring to
  Gumroad/Stripe later — the current checksum unlock is throwaway scaffolding, treat it
  as a speed bump, not real security.

## The tool's tabs (in-app navigation)

Calculate · Trips · Fuel Log · Prices · Export. These are the tool's INTERNAL nav.
When we add site-level nav (Home / Calculator / Tips / About), that is a SEPARATE outer
layer — these tabs stay inside the calculator page.

## Visual identity — keep it

Retro car trip-computer dashboard: amber LCD (`--amber`), green LCD readouts
(`--green-lcd`), dark panels, `Share Tech Mono` for numbers/labels, `Space Grotesk` for
prose. Mono + uppercase for labels. Extend this into any new website chrome rather than
introducing a different look.

## Known issues / watch-outs

- **Comma decimals:** European locales show `1,777`. Confirm inputs parse comma decimals
  correctly — `parseFloat('1,777')` returns 1, not 1.777. This can silently corrupt
  calculations for a large part of the target market.
- **`file://` quirks:** localStorage can behave oddly opened directly as a file. Test via
  a local server (`python3 -m http.server`), not by double-clicking the HTML.
- **Desktop layout:** currently one narrow centered column — it reads as a phone app
  stretched onto desktop. Should use full width intelligently.

## Working preferences

- For anything architectural or multi-file, PLAN FIRST and wait for approval before
  editing. Prefer small, staged, reviewable commits over one giant pass.
- Preserve existing functionality, localStorage keys, the unit/currency system, and Pro
  gating in every change unless told otherwise.
- Don't add dependencies, frameworks, build steps, login, or backends without asking.
- If a request assumes a file or structure that doesn't match the repo, report the actual
  layout before proceeding rather than assuming.

## Roadmap (context, not a to-do list to action unprompted)

- Restructure into a multi-page website: Home (landing) · Calculator (the tool) ·
  Tips (SEO blog, each article its own URL) · About. Site-level nav + footer as an outer
  layer around the existing tabbed tool.
- Phase 2 backend: live station-price map (official government open-data feeds, one
  country first) + shared crowdsourced price corrections. This is the only part that
  needs a server.
- Global national-average price feed to auto-fill the price field.
- Monetization: one-time Pro unlock, AdSense (soft nudge, not a hard wall), context-fit
  affiliate links. No subscription on the calculator itself.
