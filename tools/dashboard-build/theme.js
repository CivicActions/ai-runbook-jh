// Single source of truth for the ai-runbook-jh visual system.
// Both build.js (dashboard) and build-styleguide.js read this file.
// The rationale for every value lives in /DESIGN.md.

module.exports = {
  name: "ai-runbook-jh",
  description:
    "A warm, organic, universally-legible aesthetic. Recycled-paper canvas, soft charcoal ink, terracotta as the single human signal, with quiet moss and slate-blue threads to differentiate the six phases.",

  colors: {
    // Surfaces
    paper:        { value: "#FBF7F0", role: "Default page canvas. Warm recycled-paper off-white." },
    "paper-soft": { value: "#F5EFE3", role: "Recessed surface. Phase headers, expanded card backs." },
    "paper-deep": { value: "#EDE5D2", role: "Deeper recess. Hover wash, mini-map ground." },

    // Ink
    ink:          { value: "#2A2A28", role: "Primary text. Soft charcoal — easier on eyes than pure black." },
    bark:         { value: "#6E5B47", role: "Secondary text. Muted, warm brown — never grey." },
    hairline:     { value: "#E5DCC9", role: "1px dividers and quiet borders." },

    // Signal
    terracotta:        { value: "#C65D3E", role: "The single primary signal. Active state, hover underline, JH mark, one stroke per phase header. Never decorative fill on large surfaces." },
    "terracotta-soft": { value: "#F2D9CE", role: "Terracotta wash. Active-pill background, focus ring fill." },

    // Phase threads (quiet differentiation — always reinforced by name + number, never color-alone)
    moss:        { value: "#5B7553", role: "Phase thread A — Refinement, Validate. Earthy, calm." },
    "moss-soft": { value: "#DCE4D6", role: "Moss wash for collapsed phase headers." },
    slate:       { value: "#5C7A99", role: "Phase thread B — Plan, Communicate. Cool but warm-leaning." },
    "slate-soft":{ value: "#D7E0EA", role: "Slate wash for collapsed phase headers." },

    // Semantic
    "focus-ring":{ value: "#C65D3E", role: "Keyboard focus outline. Same as terracotta — visible against paper." },
    "on-terracotta": { value: "#FBF7F0", role: "Text on terracotta fill. AA contrast 6.1:1." },
  },

  typography: {
    display: {
      fontFamily: '"Fraunces", Georgia, "Times New Roman", serif',
      fontSize: "48px",
      fontWeight: 500,
      lineHeight: 1.1,
      letterSpacing: "-0.01em",
      role: "Page title. Fraunces — friendly serif with character. Used once per page.",
    },
    "display-sm": {
      fontFamily: '"Fraunces", Georgia, serif',
      fontSize: "28px",
      fontWeight: 500,
      lineHeight: 1.2,
      letterSpacing: "-0.005em",
      role: "Phase headers, modal titles.",
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
      fontFamily: '"IBM Plex Mono", "JetBrains Mono", Consolas, monospace',
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: "0",
      role: "Skill names, code, technical labels. Humanist mono.",
    },
    "mono-sm": {
      fontFamily: '"IBM Plex Mono", Consolas, monospace',
      fontSize: "11px",
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: "0.04em",
      role: "Phase numbers, tags, eyebrow labels. Slightly tracked.",
    },
    hand: {
      fontFamily: '"Caveat", "Bradley Hand", cursive',
      fontSize: "20px",
      fontWeight: 500,
      lineHeight: 1.3,
      letterSpacing: "0",
      role: "Colophon only. The 'kept by jh' moment in the footer. Used once.",
    },
  },

  rounded: {
    none: "0",
    sm:   "3px",
    md:   "6px",
    lg:   "12px",
    pill: "999px",
    note: "2px 18px 4px 14px",  // hand-cut paper corners — irregular radius
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
  // Always supplemented by phase name + number — never color-alone.
  phaseThreads: {
    triage:        "terracotta",
    refinement:    "moss",
    plan:          "slate",
    build:         "terracotta",
    validate:      "moss",
    communicate:   "slate",
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
      backgroundColor: "{colors.terracotta}",
      textColor:       "{colors.on-terracotta}",
      typography:      "{typography.mono-sm}",
      rounded:         "{rounded.md}",
      padding:         "10px 18px",
      role: "Primary action. Used sparingly — one per region.",
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
      role: "Phase mini-map tab, modal nav pill. Active state fills with terracotta.",
    },
    "pill-active": {
      backgroundColor: "{colors.terracotta}",
      textColor:       "{colors.on-terracotta}",
      typography:      "{typography.mono-sm}",
      rounded:         "{rounded.pill}",
      padding:         "6px 14px",
      role: "Active pill. Terracotta fill, paper text.",
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
      backgroundColor: "{colors.terracotta-soft}",
      textColor:       "{colors.terracotta}",
      typography:      "{typography.mono-sm}",
      rounded:         "{rounded.sm}",
      padding:         "3px 8px",
      role: "Foundation tag — skill is called by other skills more than used directly.",
    },
    "tag-voice": {
      backgroundColor: "{colors.moss-soft}",
      textColor:       "{colors.moss}",
      typography:      "{typography.mono-sm}",
      rounded:         "{rounded.sm}",
      padding:         "3px 8px",
      role: "Voice cross-cutting tag.",
    },
    "tag-security": {
      backgroundColor: "{colors.slate-soft}",
      textColor:       "{colors.slate}",
      typography:      "{typography.mono-sm}",
      rounded:         "{rounded.sm}",
      padding:         "3px 8px",
      role: "Security cross-cutting tag.",
    },
    "gloss-block": {
      backgroundColor: "transparent",
      textColor:       "{colors.bark}",
      typography:      "{typography.body-lg}",
      role: "Plain-language gloss under each phase title. Italic, slightly indented.",
    },
    "hand-underline": {
      role: "Irregular hand-drawn SVG underline. Animates in on page load under the title and on skill-card name hover. Single decorative motif, used sparingly.",
    },
    "leaf-bullet": {
      role: "Small leaf-shaped SVG bullet. Replaces disc in phase-section title rows. Tinted with the phase thread color.",
    },
    "wave-divider": {
      role: "Wavy SVG divider between major sections. Hairline weight, paper-deep color.",
    },
    colophon: {
      typography: "{typography.hand}",
      textColor:  "{colors.bark}",
      role: "Footer signature: 'kept by jh'. Caveat script, used once.",
    },
    "skip-link": {
      backgroundColor: "{colors.ink}",
      textColor:       "{colors.paper}",
      rounded:         "{rounded.sm}",
      role: "Hidden until keyboard focus jumps it on; sends focus to the #phases main landmark.",
    },
    "newcomer-note": {
      backgroundColor: "{colors.paper-soft}",
      borderLeft:      "3px solid {colors.moss}",
      typography:      "{typography.body-sm}",
      rounded:         "0 {rounded.md} {rounded.md} 0",
      padding:         "{spacing.base} {spacing.lg}",
      role: "Hero aside that orients newcomers. Moss thread (supportive context), not terracotta (signal).",
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
    "Dark mode — one canvas mode only.",
    "Animation timings beyond the page-load reveal and underline hover.",
    "Print stylesheet — out of scope for v1.",
    "Color-only signals — every color cue is reinforced by a label, number, or shape.",
  ],
};
