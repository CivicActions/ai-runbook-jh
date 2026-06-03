// Single source of truth for the ai-runbook-jh visual system.
// Both build.js (dashboard) and build-styleguide.js read this file.
// The rationale for every value lives in /DESIGN.md.

module.exports = {
  name: "ai-runbook-jh",
  description:
    "A digital-woodworking aesthetic. The job is to whittle AI output into something proper and minimal: planed-pine canvas, graphite mark as the single signal, walnut/oak/ash phase threads, and one rare pencil-red accent on the title underline and colophon signature.",

  colors: {
    // Surfaces: planed pine, three values
    paper:        { value: "#F6EFDD", role: "Default page canvas. Warm planed-pine off-white." },
    "paper-soft": { value: "#ECE2C9", role: "Recessed surface. Phase headers, modal nav, expanded cards." },
    "paper-deep": { value: "#DFD2B3", role: "Deeper recess. Card hover wash, code inline background." },

    // Ink: graphite values
    ink:          { value: "#1F1E1B", role: "Primary text. Graphite: darker than charcoal, reads like a sharp pencil on raw wood." },
    bark:         { value: "#6B5A41", role: "Secondary text. Walnut tone: warm but quiet, never grey." },
    hairline:     { value: "#D9CDB1", role: "Kerf line: 1px dividers, quiet borders, dashed legends." },

    // Primary signal: graphite mark (interactive states)
    graphite:        { value: "#2B2A26", role: "The single primary signal. JH mark, active pill fill, focus ring, hover-underline bar. The carpenter's mark on the wood." },
    "graphite-soft": { value: "#E3DCC8", role: "Graphite wash. Foundation-tag background, active-pill hover halo." },
    "on-graphite":   { value: "#F6EFDD", role: "Text on graphite fill. AA contrast against the new ink." },

    // Sharp accent: used twice site-wide
    "pencil-red": { value: "#B8412A", role: "Pencil-red accent. The hand-drawn title underline, the colophon signature, the link mark. Never on fills or focus." },

    // Phase threads: three wood values (dark/medium/cool-grey), reinforced by name + number
    walnut:        { value: "#6B4A2B", role: "Phase thread A: Refinement, Validate. Deep wood: the longest grain." },
    "walnut-soft": { value: "#E6D9C0", role: "Walnut wash for collapsed phase headers and tags." },
    oak:           { value: "#8A6A3A", role: "Phase thread B: Plan, Communicate. Medium wood: ringed and even." },
    "oak-soft":    { value: "#ECDFC4", role: "Oak wash for collapsed phase headers and tags." },
    ash:           { value: "#5C5A52", role: "Phase thread C: Triage, Build. Cool grey-tan; deliberately quietest so it does not compete with the graphite signal." },
    "ash-soft":    { value: "#DDD6C5", role: "Ash wash for collapsed phase headers and tags." },

    // Semantic
    "focus-ring": { value: "#2B2A26", role: "Keyboard focus outline. Same as graphite: sharp against planed-pine." },
  },

  typography: {
    display: {
      fontFamily: '"Fraunces", Georgia, "Times New Roman", serif',
      fontSize: "48px",
      fontWeight: 600,
      lineHeight: 1.1,
      letterSpacing: "-0.015em",
      role: "Page title. Fraunces 600: letterpress weight, used once per page.",
    },
    "display-sm": {
      fontFamily: '"Fraunces", Georgia, serif',
      fontSize: "28px",
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: "-0.005em",
      role: "Phase headers, modal titles. Fraunces 600.",
    },
    "body-lg": {
      fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif',
      fontSize: "18px",
      fontWeight: 400,
      lineHeight: 1.65,
      letterSpacing: "0",
      role: "Lead paragraphs, plain-language glosses.",
    },
    body: {
      fontFamily: '"Source Serif 4", "Source Serif Pro", Georgia, serif',
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: 1.7,
      letterSpacing: "0",
      role: "Default body. Book-style serif for readability and warmth.",
    },
    "body-sm": {
      fontFamily: '"Source Serif 4", Georgia, serif',
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: "0",
      role: "Card descriptions, modal helper text.",
    },
    mono: {
      fontFamily: '"Monaspace Xenon", "JetBrains Mono", "IBM Plex Mono", Consolas, monospace',
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: "0",
      role: "Skill names, code, technical labels. Slab-serif mono: brackets and serifs read like joinery.",
    },
    "mono-sm": {
      fontFamily: '"Monaspace Xenon", "JetBrains Mono", "IBM Plex Mono", Consolas, monospace',
      fontSize: "11px",
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: "0.08em",
      role: "Phase numbers, tags, eyebrow labels. Drafted-label tracking.",
    },
    hand: {
      fontFamily: '"Architects Daughter", "Bradley Hand", cursive',
      fontSize: "22px",
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: "0",
      role: "Colophon only. The 'kept by jh' drafting-pencil signature in the footer.",
    },
  },

  rounded: {
    none: "0",
    sm:   "2px",
    md:   "4px",
    lg:   "8px",
    pill: "999px",
    note: "2px 18px 4px 14px",  // hand-cut paper corners: irregular radius
  },

  spacing: {
    xs:      "4px",
    sm:      "8px",
    md:      "12px",
    base:    "16px",
    lg:      "24px",
    xl:      "40px",
    xxl:     "64px",
    section: "96px",
  },

  // Phase threads: which quiet color marks each phase.
  // Always supplemented by phase name + number: never color-alone.
  phaseThreads: {
    triage:        "ash",
    refinement:    "walnut",
    plan:          "oak",
    build:         "ash",
    validate:      "walnut",
    communicate:   "oak",
    "cross-cutting": "bark",
  },

  // Plain-language gloss for each phase. Surfaced under the formal name.
  phaseGloss: {
    triage:      "Deciding which tickets are worth working on right now.",
    refinement:  "Filling in the gaps so the team can estimate and start the work.",
    plan:        "Writing down the approach in a file before opening the editor.",
    build:       "Doing the work, and keeping the commits clean as you go.",
    validate:    "Checking it actually works: for keyboards, screens, and real browsers.",
    communicate: "Wrapping it up so the next person, including future you, isn't lost.",
    "cross-cutting": "Two habits that run alongside everything: watch your tone, watch what you share.",
  },

  // Component recipes. Each maps to CSS in css.js and a live render in the styleguide.
  components: {
    "btn-primary": {
      backgroundColor: "{colors.graphite}",
      textColor:       "{colors.on-graphite}",
      typography:      "{typography.mono-sm}",
      rounded:         "{rounded.md}",
      padding:         "10px 18px",
      role: "Primary action. Graphite fill: used sparingly, one per region.",
    },
    "btn-quiet": {
      backgroundColor: "transparent",
      textColor:       "{colors.ink}",
      typography:      "{typography.mono-sm}",
      rounded:         "{rounded.md}",
      padding:         "10px 14px",
      role: "Secondary action. Hairline border, no fill.",
    },
    card: {
      backgroundColor: "{colors.paper}",
      textColor:       "{colors.ink}",
      rounded:         "{rounded.lg}",
      padding:         "20px 22px",
      role: "Skill card, collapsed state. Hairline border, no shadow.",
    },
    "card-expanded": {
      backgroundColor: "{colors.paper-soft}",
      textColor:       "{colors.ink}",
      rounded:         "{rounded.lg}",
      padding:         "20px 22px 24px",
      role: "Skill card, expanded inline. Soft-paper back signals open state.",
    },
    pill: {
      backgroundColor: "transparent",
      textColor:       "{colors.bark}",
      typography:      "{typography.mono-sm}",
      rounded:         "{rounded.pill}",
      padding:         "6px 14px",
      role: "Phase mini-map tab, modal nav pill. Active state fills with graphite.",
    },
    "pill-active": {
      backgroundColor: "{colors.graphite}",
      textColor:       "{colors.on-graphite}",
      typography:      "{typography.mono-sm}",
      rounded:         "{rounded.pill}",
      padding:         "6px 14px",
      role: "Active pill. Graphite fill, planed-pine text.",
    },
    chip: {
      backgroundColor: "{colors.paper-soft}",
      textColor:       "{colors.ink}",
      typography:      "{typography.mono-sm}",
      rounded:         "{rounded.sm}",
      padding:         "3px 9px",
      role: "typicalNext chip. Renders as a small clickable token.",
    },
    "tag-foundation": {
      backgroundColor: "{colors.graphite-soft}",
      textColor:       "{colors.graphite}",
      typography:      "{typography.mono-sm}",
      rounded:         "{rounded.sm}",
      padding:         "3px 8px",
      role: "Foundation tag: skill is called by other skills more than used directly. Wears the graphite signal.",
    },
    "tag-voice": {
      backgroundColor: "{colors.walnut-soft}",
      textColor:       "{colors.walnut}",
      typography:      "{typography.mono-sm}",
      rounded:         "{rounded.sm}",
      padding:         "3px 8px",
      role: "Voice cross-cutting tag. Walnut thread.",
    },
    "tag-security": {
      backgroundColor: "{colors.oak-soft}",
      textColor:       "{colors.oak}",
      typography:      "{typography.mono-sm}",
      rounded:         "{rounded.sm}",
      padding:         "3px 8px",
      role: "Security cross-cutting tag. Oak thread.",
    },
    "gloss-block": {
      backgroundColor: "transparent",
      textColor:       "{colors.bark}",
      typography:      "{typography.body-lg}",
      role: "Plain-language gloss under each phase title. Italic, slightly indented.",
    },
    "hand-underline": {
      role: "Hand-drawn pencil-red underline. Animates in on page load under the title; reused as the hover bar under skill-card names. The one warm decorative motif.",
    },
    "dovetail-notch": {
      role: "Small dovetail-tail SVG glyph (trapezoid wider at top). Replaces a generic bullet in phase-section title rows. Tinted with the phase thread color (walnut, oak, or ash).",
    },
    "kerf-line": {
      role: "Hairline + three short ticks as a section divider. Reads like a kerf cut on the bench.",
    },
    colophon: {
      typography: "{typography.hand}",
      textColor:  "{colors.pencil-red}",
      role: "Footer signature: 'kept by jh'. Architects Daughter pencil hand in pencil-red, the rarest mark on the page.",
    },
    "skip-link": {
      backgroundColor: "{colors.graphite}",
      textColor:       "{colors.paper}",
      rounded:         "{rounded.sm}",
      role: "Hidden until keyboard focus jumps it on; sends focus to the #phases main landmark.",
    },
    "newcomer-note": {
      backgroundColor: "{colors.paper-soft}",
      borderLeft:      "3px solid {colors.walnut}",
      typography:      "{typography.body-sm}",
      rounded:         "0 {rounded.md} {rounded.md} 0",
      padding:         "{spacing.base} {spacing.lg}",
      role: "Hero aside that orients newcomers. Walnut thread (supportive context), not graphite (signal).",
    },
    "phaseflow-node": {
      backgroundColor: "{colors.paper}",
      textColor:       "{colors.ink}",
      rounded:         "{rounded.md}",
      padding:         "{spacing.base} {spacing.sm}",
      role: "One of the six numbered cards in the phase-flow nav. Anchor link that opens the matching phase section.",
    },
    "phaseflow-band": {
      backgroundColor: "{colors.paper-soft}",
      textColor:       "{colors.bark}",
      typography:      "{typography.mono-sm}",
      rounded:         "{rounded.md}",
      padding:         "{spacing.sm} {spacing.base}",
      role: "Horizontal strip beneath the phase nodes. Carries cross-cutting + profiles metadata.",
    },
    "usage-modes": {
      backgroundColor: "{colors.paper}",
      border:          "1px solid {colors.hairline}",
      rounded:         "{rounded.lg}",
      padding:         "{spacing.lg} {spacing.base}",
      role: "Three-column panel below the phase cards: autonomous chain, one-off, mix. Explains how to drive the skills.",
    },
    "accent-legend": {
      border:          "1px dashed {colors.hairline}",
      textColor:       "{colors.bark}",
      typography:      "{typography.body-sm}",
      rounded:         "{rounded.md}",
      padding:         "{spacing.sm} {spacing.base}",
      role: "Key for the card accent tags (Foundation, Voice, Security). Sits at the top of #phases as a caption for the cards below.",
    },
  },

  // Things this system explicitly does NOT do.
  knownGaps: [
    "Dark mode: tracked in issue #1 (after-hours oiled-walnut workshop).",
    "Animation timings beyond the page-load reveal, underline hover, and 150ms pill/card transitions.",
    "Print stylesheet: out of scope for v1.",
    "Color-only signals: every color cue is reinforced by a label, number, or shape.",
  ],
};
