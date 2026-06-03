---
name: ai-runbook-jh
description: >
  A warm, organic, universally-legible visual system. Recycled-paper canvas,
  soft charcoal ink, terracotta as the single human signal, with quiet moss
  and slate-blue threads to differentiate the six phases.

colors:
  paper:            { value: "#FBF7F0", role: "Default page canvas. Warm recycled-paper off-white." }
  paper-soft:       { value: "#F5EFE3", role: "Recessed surface. Phase headers, expanded card backs." }
  paper-deep:       { value: "#EDE5D2", role: "Deeper recess. Hover wash, mini-map ground." }
  ink:              { value: "#2A2A28", role: "Primary text. Soft charcoal — easier on eyes than pure black." }
  bark:             { value: "#6E5B47", role: "Secondary text. Muted, warm brown — never grey." }
  hairline:         { value: "#E5DCC9", role: "1px dividers and quiet borders." }
  terracotta:       { value: "#C65D3E", role: "The single primary signal. Active state, hover underline, JH mark, one stroke per phase header." }
  terracotta-soft:  { value: "#F2D9CE", role: "Terracotta wash. Active-pill background, focus ring fill." }
  moss:             { value: "#5B7553", role: "Phase thread A — Refinement, Validate. Earthy, calm." }
  moss-soft:        { value: "#DCE4D6", role: "Moss wash for collapsed phase headers." }
  slate:            { value: "#5C7A99", role: "Phase thread B — Plan, Communicate. Cool but warm-leaning." }
  slate-soft:       { value: "#D7E0EA", role: "Slate wash for collapsed phase headers." }
  focus-ring:       { value: "#C65D3E", role: "Keyboard focus outline. Same as terracotta — visible against paper." }
  on-terracotta:    { value: "#FBF7F0", role: "Text on terracotta fill. AA contrast 6.1:1." }

typography:
  display:     { fontFamily: "Fraunces", fontSize: 48px, fontWeight: 500, lineHeight: 1.1,  role: "Page title — used once per page." }
  display-sm:  { fontFamily: "Fraunces", fontSize: 28px, fontWeight: 500, lineHeight: 1.2,  role: "Phase headers, modal titles." }
  body-lg:     { fontFamily: "Source Serif 4", fontSize: 18px, fontWeight: 400, lineHeight: 1.65, role: "Lead paragraphs, plain-language glosses." }
  body:        { fontFamily: "Source Serif 4", fontSize: 16px, fontWeight: 400, lineHeight: 1.7,  role: "Default body. Book-style serif." }
  body-sm:     { fontFamily: "Source Serif 4", fontSize: 14px, fontWeight: 400, lineHeight: 1.6,  role: "Card descriptions, modal helper text." }
  mono:        { fontFamily: "IBM Plex Mono", fontSize: 14px, fontWeight: 500, lineHeight: 1.5,   role: "Skill names, code, technical labels." }
  mono-sm:     { fontFamily: "IBM Plex Mono", fontSize: 11px, fontWeight: 500, lineHeight: 1.4,   role: "Phase numbers, tags, eyebrow labels." }
  hand:        { fontFamily: "Caveat",         fontSize: 20px, fontWeight: 500, lineHeight: 1.3,  role: "Colophon only — 'kept by jh'. Used once." }

rounded:
  none: "0"
  sm:   "3px"
  md:   "6px"
  lg:   "12px"
  pill: "999px"
  note: "2px 18px 4px 14px"  # hand-cut paper corners — irregular radius, used rarely

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
> [`tools/dashboard-build/theme.js`](tools/dashboard-build/theme.js); both this
> document and the [living styleguide](dashboard/styleguide.html) read from there.

## Overview

The runbook is a personal working document. It captures how I — JH — take a ticket from inbox
to closure with AI help. It lives at CivicActions, where the audience is engineers, designers,
content strategists, project managers, and clients ranging from federal agencies to nonprofits.

The visual system has to do two things at once:

- **Feel like a notebook**, not a SaaS product. This is a runbook, kept by a person, not a status
  board for monitoring something. Warm, hand-kept, calm.
- **Read clearly for anyone**, including readers who don't share the engineering vocabulary. The
  six phases get plain-language glosses surfaced above the formal definitions. Color is never the
  only signal — phase number and name carry the load.

The aesthetic: warm recycled paper, soft charcoal ink, one terracotta accent that does the human
signal work, and two quiet earthy threads (moss, slate-blue) that differentiate the phases without
shouting.

## Colors

Four groups, each with a single job. Anything that doesn't fit one of these groups doesn't belong
on the page.

**Surfaces.** `paper` is the canvas — a warm off-white that softens the screen. `paper-soft` and
`paper-deep` recede further when a section needs to feel slightly indented (expanded card backs,
mini-map ground). No pure white anywhere.

**Ink.** `ink` is a soft charcoal, not black — long reading sessions matter. `bark` is the
secondary text color, a muted warm brown. `hairline` is the single border tone, used at 1px for
quiet divisions. No grey scale: every neutral has warmth in it.

**Signal.** `terracotta` is the only primary accent. It marks the active phase pill, draws the
hand-drawn underline under the page title and (on hover) under each skill card name, fills the
focus ring, and stamps "kept by jh" in the colophon. It never becomes a fill color on large
surfaces. If two things on the page are terracotta, one of them is probably wrong.

**Phase threads.** `moss` and `slate` are the quiet differentiators. They mark phase sections so a
reader scanning vertically can see "this is a different phase" without having to read the heading.
But — and this is the rule — color is *never* the only signal. The phase number (`01`–`06`) and the
phase name always travel with the thread. A user with color vision differences sees the same
information.

## Typography

Five working levels and one human moment, drawn from three faces (plus one for the colophon).

- **Fraunces** does the display work — a friendly, slightly bookish serif with character. Used at
  48px for the page title (once per page) and 28px for phase and modal headers.
- **Source Serif 4** carries the body. It's a book-grade serif tuned for screen — warm, readable,
  and it doesn't feel like a help center. Default size 16px, line-height 1.7 (generous).
- **IBM Plex Mono** handles technical labels and skill names. Humanist mono — readable, not cold.
  Used at 14px for skill names and 11px (lightly tracked) for tags, eyebrow labels, and phase
  numbers.
- **Caveat** appears exactly once, in the footer colophon: *kept by jh*. One moment of handwriting
  is enough to mark this as a personal document. Two would be twee.

All four faces are Google Fonts; the skills catalog fetches them at load time.

## Layout

Generous, not packed. The prose column maxes at **720px** so reading paragraphs stay comfortable;
the wider content column (cards, mini-map, phase grids) maxes at **1180px**. Line-height defaults to
**1.7**. Section gaps are large (`xl`, `xxl`, `section` from the spacing scale) because the page
has time and space — rushing it would betray the aesthetic.

Spacing is a single eight-point-leaning scale (4 / 8 / 12 / 16 / 24 / 40 / 64 / 96 px). No micro
increments; if a margin is between two steps, pick the larger one.

## Elevation & Depth

There are no shadows. Depth comes from three places instead:

1. **Paper grain.** A subtle SVG turbulence filter sits at ~6% opacity over the canvas. You stop
   noticing it consciously after a moment but it removes the flat-screen feeling.
2. **Hairlines.** 1px borders in `hairline` color do all the structural division. Cards, phase
   sections, dividers — all hairline.
3. **Tone shift.** Backgrounds step from `paper` → `paper-soft` → `paper-deep` to indicate
   recession (expanded card backs, hover states, mini-map ground).

The mental model is a paper notebook lit by a window. Light doesn't fall on it from above with a
shadow underneath; it's the page itself that has texture.

## Shapes

A small radius scale: `0` / `3` / `6` / `12` / `999px`. Soft, not pillowy. Cards use `lg` (12px).
Buttons use `md` (6px). Pills use full radius.

One non-standard radius exists: `note` is `2px 18px 4px 14px` — intentionally irregular, like a
corner cut by hand. Reserved for rare hand-cut motifs; not used in the runbook at v1,
but available in the system.

## Components

Every component the skills catalog renders is defined as a token recipe in
[`theme.js`](tools/dashboard-build/theme.js) and rendered live in the
[styleguide](dashboard/styleguide.html). The set:

| Component        | Role                                                                  |
|------------------|-----------------------------------------------------------------------|
| `btn-primary`    | Primary action. Used sparingly — one per region.                      |
| `btn-quiet`      | Secondary action. Hairline border, no fill.                           |
| `card`           | Skill card, collapsed. Hairline border, no shadow.                    |
| `card-expanded`  | Skill card, expanded. Soft-paper back signals open state.             |
| `pill`           | Phase mini-map tab, modal nav pill. Active state fills with terracotta. |
| `pill-active`    | Active pill state.                                                    |
| `chip`           | typicalNext chip. Small clickable token.                              |
| `tag-foundation` | Foundation tag — skill is invoked by others more than used directly.  |
| `tag-voice`      | Voice cross-cutting tag.                                              |
| `tag-security`   | Security cross-cutting tag.                                           |
| `gloss-block`    | Plain-language gloss under each phase title. Italic.                  |
| `hand-underline` | Irregular hand-drawn SVG underline. Animates on load and on hover.    |
| `leaf-bullet`    | Small leaf-shaped SVG. Replaces disc in phase title rows.             |
| `wave-divider`   | Wavy SVG divider between major sections.                              |
| `colophon`       | Footer signature: 'kept by jh'. Caveat script, used once.             |

If a new component is needed, add it to `theme.js` first, render its CSS in `css.js`, then add a
live render in `build-styleguide.js`. The styleguide is the contract.

## Do's and Don'ts

**Do**

- Use `terracotta` as the single signal. One per region, used to mark *the* active thing.
- Pair every color cue with a label, number, or shape. Phase threads always travel with the phase
  number and name.
- Let sections breathe. When in doubt about spacing, pick the larger step.
- Add new tokens to `theme.js` first. The styleguide and skills catalog both read from it.

**Don't**

- Add shadows. Use hairlines and tone shifts instead.
- Use `terracotta` as a fill color on a large surface. It loses its signal power.
- Ship a color-only affordance. Anything conveyed by color alone needs a second cue.
- Introduce dark mode in v1. One canvas, kept consistent.
- Add a second handwritten moment. The colophon is the one — adding more makes the page twee.
- Edit CSS in `css.js` to change a brand value. Change `theme.js` and rebuild.
