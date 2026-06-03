---
name: ai-runbook-jh
description: >
  A digital-woodworking visual system. The job is to whittle AI output into
  something proper and minimal: planed-pine canvas, graphite mark as the single
  interactive signal, walnut/oak/ash phase threads, and one pencil-red accent
  reserved for the title underline and the colophon signature.

colors:
  paper:            { value: "#F6EFDD", role: "Default page canvas. Warm planed-pine off-white." }
  paper-soft:       { value: "#ECE2C9", role: "Recessed surface. Phase headers, modal nav, expanded cards." }
  paper-deep:       { value: "#DFD2B3", role: "Deeper recess. Card hover wash, code inline background." }
  ink:              { value: "#1F1E1B", role: "Primary text. Graphite: reads like a sharp pencil on raw wood." }
  bark:             { value: "#6B5A41", role: "Secondary text. Walnut tone: warm but quiet, never grey." }
  hairline:         { value: "#D9CDB1", role: "Kerf line: 1px dividers, quiet borders, dashed legends." }
  graphite:         { value: "#2B2A26", role: "The single interactive signal. JH mark, active pill fill, focus ring, hover-underline bar." }
  graphite-soft:    { value: "#E3DCC8", role: "Graphite wash. Foundation-tag background." }
  on-graphite:      { value: "#F6EFDD", role: "Text on graphite fill." }
  pencil-red:       { value: "#B8412A", role: "The one warm accent. Title underline, links, colophon signature. Never on fills or focus." }
  walnut:           { value: "#6B4A2B", role: "Phase thread A: Refinement, Validate." }
  walnut-soft:      { value: "#E6D9C0", role: "Walnut wash for collapsed phase headers and tags." }
  oak:              { value: "#8A6A3A", role: "Phase thread B: Plan, Communicate." }
  oak-soft:         { value: "#ECDFC4", role: "Oak wash for collapsed phase headers and tags." }
  ash:              { value: "#5C5A52", role: "Phase thread C: Triage, Build. Deliberately quietest of the three." }
  ash-soft:         { value: "#DDD6C5", role: "Ash wash for collapsed phase headers and tags." }
  focus-ring:       { value: "#2B2A26", role: "Keyboard focus outline. Same as graphite." }

typography:
  display:     { fontFamily: "Fraunces", fontSize: 48px, fontWeight: 600, lineHeight: 1.1,  role: "Page title: letterpress weight, used once per page." }
  display-sm:  { fontFamily: "Fraunces", fontSize: 28px, fontWeight: 600, lineHeight: 1.2,  role: "Phase headers, modal titles." }
  body-lg:     { fontFamily: "Source Serif 4", fontSize: 18px, fontWeight: 400, lineHeight: 1.65, role: "Lead paragraphs, plain-language glosses." }
  body:        { fontFamily: "Source Serif 4", fontSize: 16px, fontWeight: 400, lineHeight: 1.7,  role: "Default body. Book-style serif." }
  body-sm:     { fontFamily: "Source Serif 4", fontSize: 14px, fontWeight: 400, lineHeight: 1.6,  role: "Card descriptions, modal helper text." }
  mono:        { fontFamily: "Monaspace Xenon", fontSize: 14px, fontWeight: 500, lineHeight: 1.5,   role: "Skill names, code, technical labels. Slab-serif mono." }
  mono-sm:     { fontFamily: "Monaspace Xenon", fontSize: 11px, fontWeight: 500, lineHeight: 1.4,   role: "Phase numbers, tags, eyebrow labels. Drafted-label tracking (0.08em)." }
  hand:        { fontFamily: "Architects Daughter", fontSize: 22px, fontWeight: 400, lineHeight: 1.3,  role: "Colophon only: drafting-pencil signature in the footer. Used once." }

rounded:
  none: "0"
  sm:   "2px"
  md:   "4px"
  lg:   "8px"
  pill: "999px"
  note: "2px 18px 4px 14px"  # hand-cut paper corners: irregular radius, used rarely

spacing:
  xs:      "4px"
  sm:      "8px"
  md:      "12px"
  base:    "16px"
  lg:      "24px"
  xl:      "40px"
  xxl:     "64px"
  section: "96px"
---

# Design

> The visual rationale behind `ai-runbook-jh`. Token values live in
> [`tools/runbook-build/theme.js`](tools/runbook-build/theme.js); both this
> document and the [living styleguide](runbook/styleguide.html) read from there.

## Overview

The runbook is a personal working document. It captures how I (JH) take a ticket from inbox
to closure with AI help. It lives at CivicActions, where the audience is engineers, designers,
content strategists, project managers, and clients ranging from federal agencies to nonprofits.

The metaphor is **digital woodworking**: AI gives you raw stock, the job is to whittle it into
something proper and minimal. Everything chrome in this system reaches for that idea: planed-pine
surfaces, a graphite mark for interaction, walnut/oak/ash threads for the six phases, and one
pencil-red moment to mark the page.

Two constraints stay non-negotiable across the metaphor shift:

- **Feel like a workbench, not a SaaS product.** This is a runbook, kept by a person, not a status
  board.
- **Read clearly for anyone**, including readers who don't share the engineering vocabulary. The
  six phases get plain-language glosses surfaced above the formal definitions. Color is never the
  only signal: phase number and name carry the load.

## Colors

Four groups, each with a single job. Anything that doesn't fit one of these groups doesn't belong
on the page.

**Surfaces.** `paper` is the canvas: planed-pine off-white, slightly yellow, warm. `paper-soft`
and `paper-deep` recede further when a section needs to feel indented (modal nav, expanded card
backs, code background). No pure white anywhere.

**Ink.** `ink` is graphite: darker than the previous charcoal so a sharp pencil mark reads
against the warmer wood. `bark` is the secondary text color, a walnut tone: warm, never grey.
`hairline` is the kerf line, used at 1px for quiet division.

**Signal.** `graphite` is the only interactive signal. It fills the active pill, draws the focus
ring, stamps the JH mark, and forms the hover bar under skill-card names. It never becomes a fill
on a large surface. If two interactive things on the page are graphite-filled, one of them is
probably wrong.

**Accent.** `pencil-red` is the warm mark, used in exactly three places: the hand-drawn underline
under the page title, body links, and the colophon signature. That's it. No buttons, no focus, no
fills. The rarity is the point.

**Phase threads.** `walnut`, `oak`, and `ash` are three wood *values* (dark / medium / cool grey)
that mark phase sections so a reader scanning vertically can see "this is a different phase"
without reading the heading. Triage and Build wear `ash` (quietest, so the graphite signal still
dominates). Refinement and Validate wear `walnut`. Plan and Communicate wear `oak`. Color is
*never* the only signal: the phase number (`01`–`06`) and the phase name always travel with the
thread.

## Typography

Five working levels and one human moment, drawn from three faces (plus one for the colophon).

- **Fraunces** does the display work: a friendly, slightly bookish serif with character. Used at
  48px for the page title (once per page) and 28px for phase and modal headers. Weight 600 reads
  like letterpress, not like a webpage.
- **Source Serif 4** carries the body. It's a book-grade serif tuned for screen: warm, readable.
  Default size 16px, line-height 1.7 (generous).
- **Monaspace Xenon** handles technical labels and skill names. Slab-serif monospace from
  GitHub Next: the chunky brackets and serifs read like joinery rather than terminal output.
  Used at 14px for skill names and 11px for tags, eyebrow labels, and phase numbers. Tracked at
  0.08em so the small mono reads like a drafted blueprint label.
- **Architects Daughter** appears exactly once, in the footer colophon: *kept by jh*, in
  pencil-red. Literally a drafting-pencil hand. One signature is the warmest thing on the page;
  two would be twee.

Fraunces and Source Serif 4 are Google Fonts; Architects Daughter is Google Fonts; Monaspace
Xenon is loaded via fontsource on jsDelivr.

## Layout

Generous, not packed. The prose column maxes at **720px** so reading paragraphs stay comfortable;
the wider content column (cards, mini-map, phase grids) maxes at **1180px**. Line-height defaults
to **1.7**. Section gaps are large (`xl`, `xxl`, `section` from the spacing scale) because the
page has time and space: rushing it would betray the aesthetic.

Spacing is a single eight-point-leaning scale (4 / 8 / 12 / 16 / 24 / 40 / 64 / 96 px). No micro
increments; if a margin is between two steps, pick the larger one.

## Elevation & Depth

There are no shadows. Depth comes from three places instead:

1. **Paper grain.** A subtle SVG turbulence filter sits over the canvas. You stop noticing it
   consciously after a moment but it removes the flat-screen feeling.
2. **Hairlines.** 1px borders in `hairline` color do all the structural division. Cards, phase
   sections, dividers: all hairline. Dashed hairlines mark accent legends and quieter dividers,
   like a kerf line on a workbench.
3. **Tone shift.** Backgrounds step from `paper` → `paper-soft` → `paper-deep` to indicate
   recession.

The mental model is a workbench in afternoon light: the surface itself has texture, not a
hovering card with a drop shadow.

## Shapes

A small radius scale: `0` / `2` / `4` / `8` / `999px`. Sharper than the previous scale: corners
that read as joinery, not pillow. Cards use `lg` (8px). Buttons use `md` (4px). Pills use full
radius (the active pill stays soft against the sharp surroundings).

One non-standard radius exists: `note` is `2px 18px 4px 14px`, intentionally irregular, like a
corner cut by hand. Reserved for rare hand-cut motifs.

## Motifs

Three SVG glyphs carry the workshop signal:

- **Hand-drawn pencil-red underline.** Appears under the page title on load and as the hover bar
  under skill-card names. The one warm decorative moment.
- **Dovetail notch.** A small dovetail-tail outline (trapezoid wider at top). Replaces a generic bullet in
  phase-section title rows. Tinted with the phase thread color (walnut, oak, or ash).
- **Kerf line.** A hairline with three short ticks, used as a section divider. Reads as a
  measurement mark on the bench.

Motion is intentionally restrained: the page-load underline reveal, 150ms ease-out on pill and
card hover states, and a `prefers-reduced-motion` fallback that kills the underline animation.

## Components

Every component the runbook renders is defined as a token recipe in
[`theme.js`](tools/runbook-build/theme.js) and rendered live in the
[styleguide](runbook/styleguide.html). The set:

| Component        | Role                                                                  |
|------------------|-----------------------------------------------------------------------|
| `btn-primary`    | Primary action. Graphite fill: one per region.                       |
| `btn-quiet`      | Secondary action. Hairline border, no fill.                           |
| `card`           | Skill card, collapsed. Hairline border, no shadow.                    |
| `card-expanded`  | Skill card, expanded. Soft-paper back signals open state.             |
| `pill`           | Phase mini-map tab, modal nav pill. Active state fills with graphite. |
| `pill-active`    | Active pill state.                                                    |
| `chip`           | typicalNext chip. Small clickable token.                              |
| `tag-foundation` | Foundation tag: wears the graphite signal.                           |
| `tag-voice`      | Voice cross-cutting tag: walnut thread.                              |
| `tag-security`   | Security cross-cutting tag: oak thread.                              |
| `gloss-block`    | Plain-language gloss under each phase title. Italic.                  |
| `hand-underline` | Pencil-red SVG underline. Animates on load and on hover.              |
| `dovetail-notch` | Small dovetail-tail SVG glyph. Replaces a bullet in phase title rows.  |
| `kerf-line`      | Hairline + three ticks as a section divider.                          |
| `colophon`       | Footer signature: 'kept by jh', in pencil-red. Used once.             |

If a new component is needed, add it to `theme.js` first, render its CSS in `css.js`, then add a
live render in `build-styleguide.js`. The styleguide is the contract.

## Do's and Don'ts

**Do**

- Use `graphite` as the single interactive signal. One filled affordance per region.
- Keep `pencil-red` to the three places it lives today: title underline, links, colophon. Adding
  a fourth dilutes the page.
- Pair every color cue with a label, number, or shape. Phase threads always travel with the phase
  number and name.
- Let sections breathe. When in doubt about spacing, pick the larger step.
- Add new tokens to `theme.js` first. Both the styleguide and the runbook read from it.

**Don't**

- Add shadows. Use hairlines and tone shifts instead.
- Use `graphite` as a fill color on a large surface. It loses its signal power.
- Use `pencil-red` for fills, focus rings, or interactive states. It's the warm mark, not the
  signal.
- Ship a color-only affordance. Anything conveyed by color alone needs a second cue.
- Add a second handwritten moment. The colophon is the one.
- Edit CSS in `css.js` to change a brand value. Change `theme.js` and rebuild.

## Known gaps

- Dark mode: tracked in [issue #1](https://github.com/CivicActions/ai-runbook-jh/issues/1)
  (after-hours oiled-walnut workshop direction).
- Print stylesheet: out of scope for v1.
- No icon set beyond the three motif glyphs.
