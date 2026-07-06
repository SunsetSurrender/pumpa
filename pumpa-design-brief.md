# Pumpa — Design Direction Brief

A spec for the visual redesign. Goal: **clean, trustworthy, warm, and human** — a
product that clearly works and that a person obviously cared about making. Explicitly
NOT the "generic AI-generated" look: no relentless monospace, no two-tone amber-on-black,
no uniform rounded boxes everywhere, no `UPPERCASE MONO LABELS` on every element.

This brief is opinionated on purpose. Execute the specifics; the point is direction the
build can follow, not room to improvise defaults.

---

## 1. The core shift

The old look = a literal retro trip-computer taken across the whole site (mono
everywhere, amber doing every job, LCD styling on all panels). It read as a gimmick.

The new look = **a clean, warm, modern product that keeps ONE signature nod to that
heritage: the LCD cost readout.** Amber becomes a sparing accent. Everything else gets
quiet, human, and legible.

Keep: the LCD trip-cost readout as a single signature "moment" (hero + calculator result
only). Amber as an accent color. The name Pumpa.

Drop: mono font as body/label default, amber as a dominant surface color, LCD treatment
on every card, uppercase-mono section headers everywhere.

---

## 2. Color palette

Move from 2 notes to a proper system with mid-tones and warmth. Dark is retained but
warmed — no pure #000, no clinical grey.

**Recommended palette (warm dark, light content pages):**

Ink / surfaces (warm-charcoal, not blue-black, not pure black):
- `--ink-900: #1a1715`   (deepest bg — note the warm/brown bias vs old cold black)
- `--ink-800: #221e1b`   (raised surface)
- `--ink-700: #2e2926`   (borders, hairlines)
- `--ink-600: #453f3a`   (muted strokes)

Paper (for light content/tips/about pages — warm off-white, NOT #fff):
- `--paper: #f7f3ee`     (warm off-white page)
- `--paper-2: #efe9e1`   (cards on paper)
- `--ink-on-paper: #2a2521`

Text:
- `--text-hi: #f4efe9`   (on dark)
- `--text-mid: #b3aaa1`  (on dark, secondary)
- `--text-lo: #7d746c`   (on dark, tertiary)

Accent — amber, but demoted to accent-only:
- `--amber: #ffb238`     (primary accent — buttons, key highlights, LCD)
- `--amber-deep: #d9891a` (hover/pressed)

Supporting hues (this is what breaks the two-tone monotony — introduce a secondary):
- `--teal: #4fb8a5`      (secondary accent — links, "good/savings" states, map pins)
- `--teal-deep: #2f8375`
- `--positive: #4fb8a5`  (savings/under budget — reuse teal, warmer than pure green)
- `--negative: #e06a5c`  (over budget — a warm coral, not a harsh red)

**Usage rule:** amber is a *seasoning*, not a *surface*. If a screen looks amber-dominated,
it's wrong. Amber ≈ 5–10% of any given view: the primary button, the LCD number, a single
highlighted word. Teal carries links and positive states so amber isn't doing everything.

---

## 3. Typography

The single biggest "AI-made" tell was mono-everywhere. Fix: a warm humanist sans for
everything readable, a characterful display face for headlines, and mono kept ONLY for
the LCD readout and raw data values (where it belongs).

- **Display / headlines:** a characterful but friendly face. Recommended:
  **"Bricolage Grotesque"** (has warmth + personality, not robotic) or **"Fraunces"**
  (soft serif, very human, if leaning editorial). Pick Bricolage for the clean-modern
  read, Fraunces if we want more warmth/editorial soul. Default: **Bricolage Grotesque**.
- **Body / UI:** a humanist sans that's clean but not cold. Recommended:
  **"Inter"** is the safe modern default but leans neutral; prefer something warmer like
  **"Figtree"** or **"Hanken Grotesk"** for a friendlier read. Default: **Figtree**.
- **Mono (data only):** keep a mono ONLY for the LCD readout and tabular numbers.
  **"Space Mono"** or the existing **"Share Tech Mono"** — but confined to numbers, never
  body text or labels again.

Rules:
- Headlines: large, tight leading, confident. Sentence case or title case — NOT all-caps.
- Labels: sentence case, normal weight. Kill the `UPPERCASE MONO` section labels; replace
  with small warm-sans labels, maybe in `--text-lo`, letter-spacing minimal.
- Numbers in the LCD and data tables: mono, tabular figures. Everywhere else: the sans.
- Generous line-height on body (1.6ish). Let it breathe.

---

## 4. Logo

Current "P in a rounded amber square" is a placeholder and reads generic. Direction for a
real mark:

- Concept: tie to fuel/motion/gauge without being a literal gas-pump cliché. Options to
  explore: a stylized fuel-gauge needle, a droplet, a subtle "P" that incorporates a
  gauge sweep or a road. Keep it simple enough to work at 24px in the nav.
- Warmth: rounded terminals, not sharp geometric. One color + the amber accent.
- Wordmark: "Pumpa" set in the display face (Bricolage), the accent used on a single
  detail (a dot, the gauge sweep), not the whole word.
- Deliver as inline SVG so it scales and can be themed for dark/light pages.

(If a true custom logo is out of scope for the agent, at minimum: set the wordmark in
Bricolage, replace the flat amber square with a small SVG gauge/needle mark, and stop
there — better a clean wordmark than a generic app-icon square.)

---

## 5. Layout & components

- **Use the width.** Old build was one narrow column in a sea of dark. Landing and
  calculator should use real desktop layout: hero split (copy left, LCD readout right),
  multi-column "how it works", content max-width ~1100–1200px, collapsing to single
  column on mobile.
- **Cards:** soften and vary. Not every block is a bordered dark box. Use whitespace and
  subtle dividers as often as borders. Border radius consistent (~12–14px), border color
  `--ink-700` at low contrast, no heavy glows except the ONE LCD readout.
- **The LCD moment:** the trip-cost readout keeps its warm amber glow — this is the
  signature. Because it's now the *only* glowing element, it reads as intentional, not
  noisy. Everything around it stays calm.
- **Buttons:** primary = solid amber, dark text, warm. Secondary = quiet outline in
  `--ink-600`. Links = teal. Clear single primary action per view.
- **Light content pages** (Tips, About, Privacy): use the `--paper` warm off-white with
  dark ink text — reading long content on warm paper feels human and is easier on the
  eyes than long-form on black. Dark stays for the app/hero; light for reading. (This is
  the "dark hero, light content" split — deliberate, not inconsistent.)

---

## 6. Microcopy & tone

Warmth lives in words too. Keep copy plain, honest, a little personable. The existing
hero line "Know what every trip really costs" is good — that voice. Avoid corporate
filler and avoid trying-too-hard quirk. Honest and clear beats clever.

---

## 7. What "done" looks like

A first-time visitor on desktop should feel: *this is clean and I trust it, and also a
real person with taste made this.* The amber LCD readout should be the one thing their eye
goes to. Nothing on screen should feel like a default template or a mono-terminal cosplay.
Warm charcoal, warm off-white, one confident accent, one friendly-but-characterful
headline face, real breathing room.

---

## Constraints (unchanged)

- Preserve all tool functionality, localStorage keys, unit/currency system, Pro gating.
- Responsive, mobile-clean.
- Fonts via Google Fonts or self-hosted; keep the LCD/mono confined to data.
- Plan first, stage the work, commit between phases. Don't rewrite tool logic to restyle
  it — this is a presentation-layer change.
