# CLAUDE.md — Pumpa

Project context for Claude in VS Code. Read this before making changes.

## What Pumpa is

A client-side fuel & commute cost tracker. A driver enters a trip (distance, fuel
consumption, fuel price) and sees what it costs, logs trips and fill-ups over time,
sees spending reports, and exports the data. Now a multi-page website (Astro) with
the tool living at `/calculator`.

## Tech stack

- **Astro (static output) for the site shell** — deliberately added July 2026 for the
  multi-page restructure. `npm run dev` to work, `npm run build` to build; output is
  pure static files, deployable to any static host.
- **The tool itself stays vanilla JS**: all application logic lives in one IIFE in
  `public/app.js`, served unbundled. Astro never processes it — don't convert it to
  modules/components.
- **All data is stored client-side in `localStorage`.** There is no backend, no
  accounts, no server. Do not add auth, servers, or databases unless explicitly asked.

## File layout

<!-- Keep this section accurate as the repo evolves. -->
- `src/layouts/SiteLayout.astro` — site-level chrome: top nav (Home / Calculator /
  Tips / About), footer, head/meta
- `src/styles/site.css` — site chrome styles; its `:root` tokens mirror
  `public/app.css` — keep them in sync
- `src/pages/` — thin per-locale wrappers (`/`, `/it`, `/es`) around shared page
  components in `src/components/pages/`; `src/i18n/ui.ts` holds the dictionaries
- `src/content/tips/*.md` — blog articles (content collection; schema in
  `src/content.config.ts`). Each article = its own page + sitemap entry (SEO).
- `public/theme.css` — color tokens for all three themes (single source of color
  truth; loaded before everything else). The tool consumes it via legacy aliases.
- `public/app.js` — all tool behaviour (single IIFE)
- `public/app.css` — all tool styling (tokens only, no hardcoded colors)
- `public/report.css` — print-only styles for the exported PDF report (leave alone
  unless asked)
- `astro.config.mjs` — `site` is a placeholder domain; set the real one before launch

## Core architecture — do not break these

- **localStorage keys** (renaming/reformatting these silently wipes user data):
  - `pumpaTrips` — logged trips. EV trips carry `kind: 'ev'`; entries WITHOUT a `kind`
    field are petrol by definition — never backfill or rewrite old entries.
  - `pumpaRefuels` — logged fill-ups
  - `pumpaPrefs` — unit system + currency preference, plus optional `vehicle`
    (`'fuel' | 'ev'`, additive — old prefs objects lack it and must keep working)
  - `pumpaManualPrice` — manual price override from the Prices tab
  - `pumpaPro` — Pro-unlock entitlement `{ code, ts }`
  - `pumpaTheme` — theme mode (`dark` | `light` | `contrast`), written only when the
    user toggles; first visit falls back to `prefers-contrast` then `prefers-color-scheme`
  - `pumpaTripPlan` — single Trip Plan draft (legs, tolls/extras, both vehicles'
    values, selected vehicle), stamped with system+currency and restored only when
    they match (pumpaManualPrice precedent). Not a log — one draft, overwritten.
- **Unit system:** Metric / US / UK. Switching live-CONVERTS current values, it does
  not just relabel. Conversions pivot through km / L-per-100km / price-per-liter.
  MPG↔L/100km is INVERSE, not linear — keep that intact.
- **EV units:** consumption is kWh/100km (metric) or mi/kWh (US + UK) — also INVERSE,
  pivoting through kWh/100km via `MI_PER_100KM = 100 / KM_PER_MILE` (≈62.137; e.g.
  20 kWh/100km = 3.107 mi/kWh). **Energy price is per kWh in every system and is
  never unit-converted** — only currency applies to it.
- **Currency is fully decoupled from the unit system.** Any currency can pair with any
  measurement system. Don't recouple them.
- **Per-entry units/currency:** every stored trip and fill-up records the system +
  currency it was logged in, so old entries still display correctly after a switch.
- **Pro gating:** free tier LIMITS WHAT IS DISPLAYED/EXPORTED only — it never truncates
  or deletes stored data. Totals, reports, the monthly chart, and CSV exports always use
  the full dataset. `entitlements()` is the single seam intended for rewiring to
  Gumroad/Stripe later — the current checksum unlock is throwaway scaffolding, treat it
  as a speed bump, not real security.

## Internationalisation (EN / IT / ES)

- **Per-locale routing:** EN at the unprefixed URLs (unchanged, already indexed);
  IT/ES under `/it`, `/es`. Astro i18n config in astro.config.mjs. Every page sets
  `<html lang>`, per-locale canonical and hreflang alternates (+ x-default -> EN).
- **Dictionaries:** `src/i18n/ui.ts` — EN is the source; IT/ES are typed against it
  (missing key = build error). Page content lives in shared components under
  `src/components/pages/` with thin per-locale wrappers. Tips articles live in
  `src/content/tips/{en,it,es}/` — same filename = linked translation; slugs stay
  stable across locales. Untranslated articles: hreflang omitted, language switcher
  falls back to that locale's /tips/ index.
- **Tool runtime strings:** the calculator page injects `window.PUMPA_I18N` before
  app.js; `t(key, fallback)` in app.js falls back to the English literal at the call
  site (EN injects an empty map — the fallbacks ARE the EN source). `fmt()` localises
  DISPLAYED numbers only.
- **HARD RULES:** language is display-layer only — it never touches units, currency,
  pumpaPrefs or any stored data (browser-region detect still owns first-visit unit
  defaults; the switcher is pure navigation). Inputs, storage, conversions and CSV
  stay dot-decimal machine format — never put Intl-formatted numbers into an input
  value or a parse path. Unit notation (km, L/100km, MPG, kWh) and CSV headers/Type
  values are never translated.
- Translation review status: Italian pending owner review; Spanish pending native
  review before launch.

## The tool's tabs (in-app navigation)

Calculate · Trips · Fuel Log · Prices · Export. These are the tool's INTERNAL nav.
The site-level nav (Home / Calculator / Tips / About) is a SEPARATE outer layer —
these tabs stay inside the calculator page (plus Trip Plan, the manual road-trip
estimator — its cost math is DELEGATED to computeTrip/computeEvTrip, never forked).
Within Calculate, a Petrol / Electric segmented toggle switches between the two peer
calculators; both log into the same Trips history.

## Tests

`tests/app-behaviour.jxa.js` — 94-assertion behavioural suite that runs the real
`public/app.js` against a stubbed DOM in JavaScriptCore (no browser/Node needed):
`osascript -l JavaScript tests/app-behaviour.jxa.js`. Run it after ANY change to
app.js and keep it green; extend it when adding behaviour.

## Visual identity — the 2026 redesign direction

Clean, warm, human — NOT terminal cosplay. Full specs in `pumpa-design-brief.md` and
`pumpa-content-a11y-spec.md`; the short version:

- **One signature LCD moment:** the amber trip-cost readout (hero demo card +
  calculator result). It is the only element allowed to glow. Everything else is calm.
- **Amber is seasoning, not surface** (~5–10% of any view: primary button, LCD number,
  one highlighted word). **Teal (`--accent-2`) carries links and positive states.**
  When amber appears AS TEXT, use `--accent-text` (theme-shifted to pass AA), never
  raw `--accent`.
- **Typography:** Bricolage Grotesque (600/700) for headlines, Figtree (400/600) for
  everything readable, Share Tech Mono ONLY for the LCD readout and data values
  (tabular numerals). No uppercase-mono labels, no mono body text — ever again.
- **Three themes** on `html[data-theme]`: warm dark (default), light (warm paper),
  high contrast (AAA, glows disabled). All color comes from tokens in
  `public/theme.css` — never hardcode a hex in components. Every new text/background
  pair must be contrast-checked in all three themes before shipping.
- **Depth comes from bands**, not new colors: home sections are full-bleed bands
  (`--band-*` tokens — warm charcoal even in the light theme; footer uses them too).
  The hero is a scrimmed photo with FIXED `--hero-*` light-on-dark tokens in every
  theme; contrast mode drops the image. Images go through astro:assets (WebP only,
  responsive widths) from `src/assets/` — never ship raw multi-MB files from public/.
- **EV mode cue:** the active Electric segment + EV card edge use the teal positive
  pair; petrol stays amber. Visual only — no environmental claims in copy.
- **Ad slots:** `.ad-slot` placeholders (below calculator, tips index) are reserved
  for AdSense post-launch; keep them empty and unobtrusive until then.
- **Reading surfaces:** Tips/About/Privacy/Cookies render long-form content on warm
  paper (`--reading-*` tokens) even in dark mode — deliberate "dark chrome, light
  reading" split.
- **Logo:** inline SVG gauge mark (amber needle) + "Pumpa" wordmark in Bricolage.
- Lighthouse accessibility is at 100 across pages — keep it there; run Lighthouse
  after presentation changes.

## Known issues / watch-outs

- **Comma decimals:** European locales show `1,777`. Confirm inputs parse comma decimals
  correctly — `parseFloat('1,777')` returns 1, not 1.777. This can silently corrupt
  calculations for a large part of the target market.
- **Always test through a server** (`npm run dev`, or `npm run build && npm run preview`) —
  there is no double-clickable HTML entry point anymore, and localStorage behaves oddly
  over `file://` anyway.
- **Stale content-collection cache:** after moving/renaming files under `src/content/`,
  a running dev server can keep serving the old collection state (looks like "the blog
  broke"). Restart the dev server (or delete `.astro/`) — builds are unaffected.
- **Desktop layout:** the site pages use full width; the tool widens to 960px at
  ≥1000px via CSS-only rules at the bottom of `public/app.css` (Calculate inputs in one
  row, Fuel Log form/reports side by side). The tool's internal layout can still be
  pushed further, but do it with CSS only.

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
