# Pumpa — Content, Layout & Accessibility Spec

Companion to the Design Direction Brief. This gives the agent the actual **copy**, the
**spacing/sizing system**, the **theme modes**, and **checkable accessibility targets** so
the build is concrete, not improvised. Read alongside `pumpa-design-brief.md`.

---

## PART A — Spacing & sizing system

Use one consistent scale everywhere. No arbitrary pixel values.

**Spacing scale (rem):** 0.25 / 0.5 / 0.75 / 1 / 1.5 / 2 / 3 / 4 / 6 / 8
(i.e. 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px). Everything — padding, gaps, margins —
snaps to this scale.

**Type scale (fluid, clamp-based so it breathes between mobile and desktop):**
- Display / H1 (hero): `clamp(2.5rem, 5vw, 4.5rem)`, line-height 1.05, weight 600–700
- H2 (section): `clamp(1.75rem, 3vw, 2.5rem)`, line-height 1.15
- H3 (card title): `1.25rem`, line-height 1.3
- Body large (hero sub, lead): `1.125rem`, line-height 1.6
- Body: `1rem`, line-height 1.6
- Small / labels: `0.875rem`, line-height 1.4
- LCD readout (the signature number): `clamp(3rem, 6vw, 5rem)`, mono, tabular

**Layout widths:**
- Content max-width (reading): `72ch` for prose, `1200px` for app/landing shells
- Hero: two-column on ≥900px (copy left ~55%, LCD card right ~45%), stacks on mobile
- "How it works": 3 columns ≥720px, 1 column below
- Section vertical rhythm: `6rem` (96px) between major sections desktop, `3rem` mobile

**Touch targets:** minimum 44×44px for anything tappable (accessibility requirement).

---

## PART B — The copy

Voice: plain, honest, a little personable. Short sentences. No corporate filler, no
try-hard quirk. British/international English spelling.

### Nav
`Home · Calculator · Tips · About` + a language switcher (EN / IT / ES) + theme toggle.

### Hero

**Eyebrow:** Fuel · Commute · Cost

**H1:** Know what every trip really costs.
*(let "really" carry the amber accent — a single highlighted word, per the brief)*

**Sub (body large):**
Enter your distance, your car's consumption and the price at the pump — Pumpa turns them
into a number you can actually act on. Log trips and fill-ups, watch what you spend each
month, and switch freely between metric, US and UK units. No account, no upload: everything
stays on your device.

**Primary button:** Open the calculator
**Secondary button:** Read the tips

**LCD card (right side, the signature moment):**
- Label: Trip cost
- Number: €12.43 (the glowing LCD readout)
- Meta line (mono, small): 70.5 km · 3.4 L/100km · €1.777/L
- Delta line: vs your usual route  +€0.58  *(delta in warm coral --negative)*

### How it works (3 steps)

**Section label:** How it works

1. **Enter a trip** — Distance, your car's consumption, and the fuel price at the pump.
   Metric, US or UK — switching actually converts your numbers, it doesn't just relabel them.
2. **See the cost** — Fuel used and trip cost, instantly — plus how it compares to your
   usual route, so detours and shortcuts get an honest price tag.
3. **Log & learn** — Save trips and fill-ups. Pumpa turns them into monthly spending, your
   real consumption, and cost-per-distance — export it all as CSV or PDF whenever you like.

### Why Pumpa (trust strip — short, three points)

**Section label:** Why Pumpa

- **Your data stays yours.** Everything's stored in your browser. No account to create,
  nothing uploaded to a server.
- **Works the way you drive.** Metric, US or UK units, any currency, real conversions —
  not a US-only tool with everyone else bolted on.
- **Honest numbers.** Real consumption from your actual fill-ups, not a hopeful estimate.

### Tips teaser (on home)

**Section label:** Save at the pump
**Lead:** Small changes, real savings. Practical, no-nonsense guides to spending less on fuel.
*(then 3 article cards — titles pulled from the Tips index)*

### Footer
Columns: **Pumpa** (short one-liner) · **Product** (Calculator, Tips, About) ·
**Legal** (Privacy, Cookies) · language switcher.
Bottom line: © Pumpa. Made for people who'd rather keep their fuel money.

---

## PART C — Theme modes (toggle, remembered)

Three modes, switchable via a toggle in the nav, remembered in localStorage
(key: `pumpaTheme`), defaulting to the OS `prefers-color-scheme` on first visit.

1. **Warm dark (default)** — the palette from the design brief (`--ink-*`, amber accent).
2. **Light** — the warm `--paper` palette; dark ink on warm off-white.
3. **High contrast** — maximum legibility: near-pure contrast pairs, amber/teal shifted to
   AAA-passing shades, borders strengthened, glows removed. This is an accessibility mode,
   not an aesthetic one — prioritise contrast over prettiness here.

Implement as `data-theme="dark|light|contrast"` on `<html>`, all colors via CSS custom
properties that swap per theme. Respect `prefers-reduced-motion` (already in the codebase)
and add `prefers-contrast: more` → default to high-contrast.

---

## PART D — Accessibility targets (checkable)

Aim: **Lighthouse accessibility score ≥ 95**, ideally 100. These are concrete and testable
in Chrome DevTools → Lighthouse. Build to these, then run it and fix what it flags.

**Color contrast (WCAG AA minimum, AAA where feasible):**
- Body text vs background: **≥ 4.5:1** (AA). High-contrast mode: aim **7:1** (AAA).
- Large text (≥24px or ≥19px bold): ≥ 3:1.
- Verify EVERY text/background pair in all three themes. The amber `--text-lo` on dark
  especially — check it passes; muted greys often fail.
- Non-text (button borders, focus rings, icons): ≥ 3:1 against adjacent color.

**Semantic structure (this is also the SEO win):**
- One `<h1>` per page; headings nest correctly (no skipping levels).
- Landmark elements: `<header> <nav> <main> <footer>`, and `<section>`/`<article>` with
  `aria-label`/`aria-labelledby` where a region needs naming.
- Nav is a real `<nav>` with a list; current page marked `aria-current="page"`.

**Interactive elements:**
- Every input has an associated `<label>` (not just a placeholder — placeholders aren't labels).
- Buttons are `<button>`, links are `<a>`; never a `<div>` with a click handler.
- Visible focus indicator on every focusable element (a clear ring, ≥3:1 contrast) — never
  `outline: none` without a replacement.
- Logical tab order; the theme/language toggles and modal are keyboard-operable (the Pro
  modal already handles Escape/focus — keep that standard everywhere).
- Language switcher sets the `<html lang>` correctly per locale (`lang="it"` etc.).

**Images / icons:**
- Meaningful images have descriptive `alt`; decorative ones have `alt=""`.
- The logo SVG has an accessible name (`<title>` or `aria-label="Pumpa"`).
- Icon-only buttons have `aria-label`.

**Motion & preferences:**
- `prefers-reduced-motion: reduce` disables the fade/transition animations (already present).
- Nothing conveys meaning by color alone — the over/under-budget delta uses a
  sign (+/−) and/or an arrow, not just red/teal, so color-blind users get the info too.

**Forms & feedback:**
- The toast uses `role="status"` `aria-live="polite"` (already in place — keep it).
- Error messages (e.g. Pro modal) are associated with their input via `aria-describedby`.

---

## PART E — Build order for this pass

1. Palette + theme system (all three modes, tokens, toggle) — get the foundation right first.
2. Typography (fonts loaded, type scale applied, mono confined to data).
3. Hero + nav + footer with the copy above.
4. How it works / Why Pumpa / Tips teaser sections.
5. Run Lighthouse (accessibility + SEO + performance), fix flagged issues, report scores.

Commit between each. Report the Lighthouse scores at the end — accessibility ≥95 is the
bar; if it's under, fix before calling it done.
