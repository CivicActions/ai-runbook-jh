// Emits the shared CSS block from theme.js.
// Both build.js (dashboard) and build-styleguide.js use this so the two pages
// can never drift visually.

const theme = require("./theme");

function colorVars() {
  return Object.entries(theme.colors)
    .map(([k, v]) => `      --c-${k}: ${v.value};`)
    .join("\n");
}

function spacingVars() {
  return Object.entries(theme.spacing)
    .map(([k, v]) => `      --s-${k}: ${v};`)
    .join("\n");
}

function roundedVars() {
  return Object.entries(theme.rounded)
    .map(([k, v]) => `      --r-${k}: ${v};`)
    .join("\n");
}

function typeVar(name) {
  const t = theme.typography[name];
  return `font-family: ${t.fontFamily}; font-size: ${t.fontSize}; font-weight: ${t.fontWeight}; line-height: ${t.lineHeight}; letter-spacing: ${t.letterSpacing};`;
}

// Inline SVG noise pattern for the paper grain. ~3% opacity, fractal turbulence.
const PAPER_GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.16  0 0 0 0 0.16  0 0 0 0 0.15  0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const FONTS_LINK = `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&family=IBM+Plex+Mono:wght@400;500;600&family=Caveat:wght@500;600&display=swap" rel="stylesheet">`;

function baseCss() {
  return `
    :root {
${colorVars()}
${spacingVars()}
${roundedVars()}
      --grain: ${PAPER_GRAIN};
      --content-w: 1180px;
      --prose-w: 720px;
    }

    * { box-sizing: border-box; }

    html { -webkit-text-size-adjust: 100%; }

    body {
      margin: 0;
      color: var(--c-ink);
      background-color: var(--c-paper);
      background-image: var(--grain);
      background-repeat: repeat;
      ${typeVar("body")}
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
    }

    a { color: var(--c-terracotta); text-decoration-thickness: 1px; text-underline-offset: 3px; }
    a:hover { text-decoration-thickness: 2px; }

    .container { max-width: var(--content-w); margin: 0 auto; padding: 0 var(--s-lg); }

    /* Skip link: hidden until focused via keyboard. */
    .skip-link {
      position: absolute;
      top: -100px;
      left: var(--s-sm);
      padding: var(--s-sm) var(--s-base);
      background: var(--c-ink);
      color: var(--c-paper);
      text-decoration: none;
      border-radius: var(--r-sm);
      z-index: 100;
    }
    .skip-link:focus { top: var(--s-sm); }

    /* ============ Typography ============ */
    h1.display { ${typeVar("display")} margin: 0 0 var(--s-sm); color: var(--c-ink); }
    h2.display-sm { ${typeVar("display-sm")} margin: 0 0 var(--s-sm); color: var(--c-ink); }
    .body-lg { ${typeVar("body-lg")} }
    .body { ${typeVar("body")} }
    .body-sm { ${typeVar("body-sm")} color: var(--c-bark); }
    .mono { ${typeVar("mono")} }
    .mono-sm { ${typeVar("mono-sm")} }
    .hand { ${typeVar("hand")} }

    /* ============ Page header ============ */
    .page-header {
      padding: var(--s-lg) var(--s-lg);
    }
    .page-header .eyebrow {
      ${typeVar("mono-sm")}
      color: var(--c-bark);
      text-transform: uppercase;
      margin-bottom: var(--s-sm);
    }
    .page-header .title-wrap {
      position: relative;
      display: inline-block;
      max-width: 100%;
      padding-bottom: 10px;
    }
    .page-header .title-wrap h1 {
      ${typeVar("display-sm")}
      font-size: clamp(22px, 3.6vw, 30px);
      line-height: 1.15;
      margin: 0;
      overflow-wrap: break-word;
      text-wrap: balance;
    }
    .page-header .title-wrap .underline {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 8px;
      color: var(--c-terracotta);
      stroke-dasharray: 600;
      stroke-dashoffset: 600;
      animation: drawUnderline 900ms cubic-bezier(.4,0,.2,1) 200ms forwards;
    }
    @keyframes drawUnderline { to { stroke-dashoffset: 0; } }
    @media (prefers-reduced-motion: reduce) {
      .page-header .title-wrap .underline { animation: none; stroke-dashoffset: 0; }
    }
    .page-header .tagline {
      ${typeVar("body-lg")}
      color: var(--c-bark);
      margin: var(--s-base) 0 0;
      max-width: var(--prose-w);
      text-wrap: balance;
    }
    .page-header .tagline-sub {
      ${typeVar("body-sm")}
      color: var(--c-bark);
      margin: var(--s-sm) 0 0;
      max-width: var(--prose-w);
      opacity: 0.85;
      text-wrap: balance;
    }
    .page-header .tagline-sub code {
      ${typeVar("mono-sm")}
      background: var(--c-paper-deep);
      padding: 1px 6px;
      border-radius: var(--r-sm);
      color: var(--c-ink);
      overflow-wrap: anywhere;
    }
    .newcomer-note {
      margin: var(--s-lg) 0 0;
      padding: var(--s-base) var(--s-lg);
      background: var(--c-paper-soft);
      border-left: 3px solid var(--c-moss);
      border-radius: 0 var(--r-md) var(--r-md) 0;
      max-width: var(--prose-w);
    }
    .newcomer-note p {
      ${typeVar("body-sm")}
      color: var(--c-ink);
      margin: 0;
      text-wrap: pretty;
    }
    .newcomer-note strong {
      color: var(--c-ink);
      font-weight: 600;
    }

    /* ============ Hero right rail (desktop only) ============ */
    .page-header__rail { display: none; }
    @media (min-width: 1100px) {
      .page-header {
        display: flex;
        align-items: flex-start;
        gap: var(--s-xl);
      }
      .page-header__main { flex: 1 1 auto; min-width: 0; }
      .page-header__rail {
        display: flex;
        flex-direction: column;
        gap: var(--s-base);
        flex: 0 0 220px;
        padding-top: var(--s-sm);
      }
      .rail-stat {
        display: block;
        text-decoration: none;
        color: var(--c-bark);
        padding: 6px 0;
        border-top: 1px solid var(--c-hairline);
      }
      .rail-stat:first-child { border-top: none; padding-top: 0; }
      .rail-stat__num {
        ${typeVar("display-sm")}
        display: block;
        color: var(--c-terracotta);
        font-size: 28px;
        line-height: 1;
        margin-bottom: 4px;
      }
      .rail-stat__label {
        ${typeVar("mono-sm")}
        color: var(--c-bark);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        line-height: 1.4;
      }
      .rail-stat__label--long {
        text-transform: none;
        letter-spacing: 0.02em;
        line-height: 1.35;
      }
      .rail-stat:hover .rail-stat__num { color: var(--c-ink); }
      .rail-stat:hover .rail-stat__label { color: var(--c-ink); }
      .rail-stat:focus-visible {
        outline: 2px solid var(--c-focus-ring);
        outline-offset: 3px;
      }
    }

    /* ============ Wave divider ============ */
    .wave-divider {
      display: block;
      width: 100%;
      height: 18px;
      color: var(--c-paper-deep);
      margin: var(--s-lg) 0;
    }

    /* ============ Disclosure (details) ============ */
    .disclosure {
      border-top: 1px solid var(--c-hairline);
      border-bottom: 1px solid var(--c-hairline);
      margin: var(--s-lg) 0;
    }
    .disclosure > summary {
      ${typeVar("mono-sm")}
      color: var(--c-bark);
      list-style: none;
      cursor: pointer;
      padding: var(--s-base) 0;
      display: flex;
      align-items: center;
      gap: var(--s-sm);
      text-transform: uppercase;
    }
    .disclosure > summary::-webkit-details-marker { display: none; }
    .disclosure > summary::before {
      content: "+";
      ${typeVar("mono")}
      color: var(--c-terracotta);
      width: 16px;
      display: inline-block;
      transition: transform 200ms ease;
    }
    .disclosure[open] > summary::before { content: "−"; }
    .disclosure > summary:hover { color: var(--c-ink); }
    .disclosure > summary:focus-visible {
      outline: 2px solid var(--c-focus-ring);
      outline-offset: 3px;
      border-radius: 2px;
    }
    .disclosure-body {
      padding: 0 0 var(--s-lg);
      ${typeVar("body")}
      color: var(--c-ink);
    }
    .disclosure-body p { max-width: var(--prose-w); }

    /* ============ Phase mini-map ============ */
    .minimap {
      display: flex;
      flex-wrap: wrap;
      gap: var(--s-sm);
      padding: var(--s-base) 0 var(--s-lg);
    }
    .minimap .pill {
      ${typeVar("mono-sm")}
      background: transparent;
      color: var(--c-bark);
      border: 1px solid var(--c-hairline);
      border-radius: var(--r-pill);
      padding: 6px 14px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      text-transform: uppercase;
    }
    .minimap .pill .num {
      color: var(--c-terracotta);
      font-weight: 600;
    }
    .minimap .pill:hover {
      border-color: var(--c-terracotta);
      color: var(--c-ink);
    }
    .minimap .pill.active {
      background: var(--c-terracotta);
      border-color: var(--c-terracotta);
      color: var(--c-on-terracotta);
    }
    .minimap .pill.active .num { color: var(--c-on-terracotta); }
    .minimap .pill:focus-visible {
      outline: 2px solid var(--c-focus-ring);
      outline-offset: 3px;
    }

    /* ============ Phase flow (visualized chain) ============ */
    .phaseflow {
      margin: var(--s-base) 0 var(--s-xl);
      padding: var(--s-base);
      background: var(--c-paper-soft);
      border: 1px solid var(--c-hairline);
      border-radius: var(--r-lg);
      position: relative;
    }
    .phaseflow-caption {
      ${typeVar("mono-sm")}
      color: var(--c-bark);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      text-align: center;
      margin: 0 0 var(--s-base);
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 6px;
    }
    .phaseflow-caption .num { color: var(--c-ink); font-weight: 600; }
    .phaseflow-caption .arrow { color: var(--c-terracotta); }
    .phaseflow-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--s-base);
      align-items: stretch;
    }
    .phaseflow-node {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
      padding: var(--s-base) var(--s-sm) var(--s-sm);
      background: var(--c-paper);
      border: 1px solid var(--c-hairline);
      border-radius: var(--r-md);
      text-decoration: none;
      color: var(--c-ink);
      transition: border-color 120ms ease, background 120ms ease;
    }
    .phaseflow-node:not(:last-child)::after {
      content: "";
      position: absolute;
      right: -12px;
      top: 50%;
      width: 8px;
      height: 8px;
      border-top: 1.5px solid var(--c-terracotta);
      border-right: 1.5px solid var(--c-terracotta);
      transform: translateY(-50%) rotate(45deg);
      z-index: 1;
      display: none;
      pointer-events: none;
    }
    .phaseflow-node .num {
      ${typeVar("mono-sm")}
      color: var(--c-ink);
      letter-spacing: 0.08em;
      font-weight: 600;
    }
    .phaseflow-node .name {
      ${typeVar("display-sm")}
      font-size: 18px;
      color: var(--c-ink);
      line-height: 1.2;
    }
    .phaseflow-node .gloss {
      ${typeVar("body-sm")}
      color: var(--c-bark);
      font-size: 12px;
      line-height: 1.4;
      margin-top: 4px;
    }
    .phaseflow-node:hover {
      border-color: var(--c-terracotta);
      background: var(--c-paper-deep);
    }
    .phaseflow-node:focus-visible {
      outline: 2px solid var(--c-focus-ring);
      outline-offset: 3px;
    }
    .phaseflow-band {
      margin-top: var(--s-base);
      padding: var(--s-sm) var(--s-base);
      background: var(--c-paper);
      border: 1px dashed var(--c-hairline);
      border-radius: var(--r-md);
      ${typeVar("mono-sm")}
      color: var(--c-bark);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      text-align: center;
    }
    .phaseflow-band a {
      color: var(--c-terracotta);
      text-decoration: none;
      border-bottom: 1px dotted var(--c-terracotta);
      padding-bottom: 1px;
    }
    .phaseflow-band a:hover { color: var(--c-ink); border-color: var(--c-ink); }
    .phaseflow-band .sep { color: var(--c-hairline); margin: 0 var(--s-sm); }

    .phaseflow-band-profiles {
      margin-top: var(--s-sm);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: var(--s-sm);
      text-transform: none;
      letter-spacing: 0;
      text-align: left;
    }
    .phaseflow-band-profiles .band-label {
      ${typeVar("mono-sm")}
      color: var(--c-terracotta);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .phaseflow-band-profiles .band-text {
      ${typeVar("body-sm")}
      color: var(--c-bark);
      flex: 1 1 320px;
      min-width: 260px;
      text-wrap: pretty;
    }
    .phaseflow-band-profiles .band-chips {
      display: inline-flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .phaseflow-band-profiles .band-chips a {
      border: none;
      padding: 0;
    }
    .phaseflow-band-profiles .band-chips code {
      ${typeVar("mono-sm")}
      background: var(--c-paper-deep);
      color: var(--c-ink);
      padding: 3px 9px;
      border-radius: var(--r-sm);
      border: 1px solid var(--c-hairline);
      text-transform: none;
      letter-spacing: 0;
    }
    .phaseflow-band-profiles .band-chips a:hover code {
      border-color: var(--c-terracotta);
      color: var(--c-terracotta);
    }

    /* Mobile-first: stack → 2-up → 3-up → 6-up. Arrows appear once nodes are in rows. */
    @media (min-width: 480px) {
      .phaseflow-row { grid-template-columns: repeat(2, 1fr); }
    }
    @media (min-width: 720px) {
      .phaseflow-row { grid-template-columns: repeat(3, 1fr); }
      .phaseflow-node:not(:last-child)::after { display: block; }
      .phaseflow-node:nth-child(3n)::after { display: none; }
    }
    @media (min-width: 1100px) {
      .phaseflow { padding: var(--s-lg) var(--s-base); }
      .phaseflow-row { grid-template-columns: repeat(6, 1fr); }
      .phaseflow-node:not(:last-child)::after { display: block; }
      .phaseflow-node:nth-child(3n)::after { display: block; }
    }

    /* ============ Usage modes (how you use the skills) ============ */
    .usage-modes {
      margin: var(--s-base) 0 var(--s-xl);
      padding: var(--s-lg) var(--s-base);
      background: var(--c-paper);
      border: 1px solid var(--c-hairline);
      border-radius: var(--r-lg);
    }
    .usage-modes-title {
      ${typeVar("display-sm")}
      font-size: 22px;
      color: var(--c-ink);
      margin: 0 0 var(--s-xs);
    }
    .usage-modes-intro {
      ${typeVar("body")}
      color: var(--c-bark);
      margin: 0 0 var(--s-lg);
      max-width: var(--prose-w);
      text-wrap: pretty;
    }
    .usage-modes-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--s-lg);
    }
    @media (min-width: 900px) {
      .usage-modes-list { grid-template-columns: repeat(3, 1fr); }
    }
    .usage-mode {
      display: flex;
      flex-direction: column;
      gap: var(--s-sm);
    }
    .usage-mode-head {
      ${typeVar("body")}
      color: var(--c-ink);
      text-wrap: pretty;
    }
    .usage-mode-head strong {
      ${typeVar("display-sm")}
      font-size: 18px;
      color: var(--c-ink);
      display: block;
      margin-bottom: 4px;
    }
    .usage-mode-mini {
      display: flex;
      flex-direction: column;
      gap: var(--s-xs);
      padding: var(--s-sm) var(--s-base);
      background: var(--c-paper-soft);
      border-left: 3px solid var(--c-hairline);
      border-radius: 0 var(--r-md) var(--r-md) 0;
      ${typeVar("body-sm")}
    }
    .usage-mode-row { display: flex; gap: var(--s-sm); align-items: baseline; }
    .usage-mode-who {
      ${typeVar("mono-sm")}
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--c-bark);
      flex: 0 0 44px;
    }
    .usage-mode-row[data-who="you"] .usage-mode-who { color: var(--c-terracotta); }
    .usage-mode-msg { color: var(--c-ink); flex: 1; }
    .usage-mode-msg code {
      ${typeVar("mono-sm")}
      background: var(--c-paper-deep);
      padding: 1px 5px;
      border-radius: var(--r-sm);
    }

    /* ============ Accent legend (tag meanings) ============ */
    .accent-legend {
      margin: var(--s-base) 0 var(--s-lg);
      padding: var(--s-sm) var(--s-base);
      border: 1px dashed var(--c-hairline);
      border-radius: var(--r-md);
      ${typeVar("body-sm")}
      color: var(--c-bark);
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--s-sm);
      align-items: start;
    }
    .accent-legend > span { display: block; text-wrap: pretty; }
    .accent-legend .accent-legend__intro {
      grid-column: 1 / -1;
      color: var(--c-ink);
      margin-bottom: 2px;
    }
    @media (min-width: 720px) {
      .accent-legend {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        column-gap: var(--s-lg);
      }
    }
    @media (min-width: 1100px) {
      .accent-legend { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }
    .accent-legend strong { color: var(--c-ink); font-weight: 600; }
    .accent-legend code {
      ${typeVar("mono-sm")}
      background: var(--c-paper-deep);
      padding: 1px 5px;
      border-radius: var(--r-sm);
      color: var(--c-ink);
    }
    .accent-legend .tag { vertical-align: baseline; }

    /* ============ Phase sections ============ */
    .phase {
      margin: var(--s-lg) 0;
      border-top: 1px solid var(--c-hairline);
    }
    .phase > summary {
      list-style: none;
      cursor: pointer;
      padding: var(--s-lg) 0 var(--s-base);
      display: flex;
      align-items: flex-start;
      gap: var(--s-base);
    }
    .phase > summary::-webkit-details-marker { display: none; }
    .phase > summary:focus-visible {
      outline: 2px solid var(--c-focus-ring);
      outline-offset: 4px;
      border-radius: 2px;
    }
    .phase .num {
      ${typeVar("mono-sm")}
      color: var(--c-terracotta);
      flex-shrink: 0;
      align-self: center;
    }
    .phase .name {
      ${typeVar("display-sm")}
      color: var(--c-ink);
      flex-shrink: 0;
      margin: 0;
    }
    .phase .phase-summary-text {
      display: flex;
      flex-direction: column;
      gap: var(--s-xs);
      min-width: 0;
      max-width: var(--prose-w);
      flex: 1;
    }
    .phase .summary-gloss {
      ${typeVar("body-lg")}
      color: var(--c-bark);
      font-style: italic;
      line-height: 1.35;
      text-wrap: pretty;
    }
    .phase .leaf {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
      align-self: center;
    }
    .phase[data-thread="moss"] .num,
    .phase[data-thread="moss"] .leaf { color: var(--c-moss); }
    .phase[data-thread="slate"] .num,
    .phase[data-thread="slate"] .leaf { color: var(--c-slate); }
    .phase[data-thread="bark"] .num,
    .phase[data-thread="bark"] .leaf { color: var(--c-bark); }

    .phase > summary::after {
      content: "▸";
      margin-left: auto;
      align-self: center;
      color: var(--c-bark);
      transition: transform 200ms ease;
      font-size: 14px;
    }
    .phase[open] > summary::after { transform: rotate(90deg); }

    .phase .gloss {
      ${typeVar("body-lg")}
      color: var(--c-bark);
      font-style: italic;
      margin: 0 0 var(--s-base);
      max-width: var(--prose-w);
    }
    .phase .gloss-formal {
      ${typeVar("body-sm")}
      color: var(--c-bark);
      margin: var(--s-xs) 0 var(--s-base);
      max-width: var(--prose-w);
    }

    /* ============ Skill cards ============ */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--s-base);
      padding: var(--s-base) 0 var(--s-lg);
    }
    .skill-card {
      background: var(--c-paper);
      border: 1px solid var(--c-hairline);
      border-radius: var(--r-lg);
      padding: var(--s-base) 22px;
      cursor: pointer;
      text-align: left;
      font: inherit;
      color: var(--c-ink);
      display: flex;
      flex-direction: column;
      gap: var(--s-sm);
      position: relative;
      transition: border-color 180ms ease, background 180ms ease;
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
    }
    .skill-card:hover {
      border-color: var(--c-terracotta);
      background: var(--c-paper-soft);
    }
    .skill-card:focus-visible {
      outline: 2px solid var(--c-focus-ring);
      outline-offset: 3px;
    }
    .skill-card .name {
      ${typeVar("mono")}
      color: var(--c-ink);
      display: inline-block;
      position: relative;
      width: fit-content;
    }
    .skill-card .name::after {
      content: "";
      position: absolute;
      left: 0; right: 0; bottom: -3px;
      height: 2px;
      background: var(--c-terracotta);
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform 250ms cubic-bezier(.4,0,.2,1);
    }
    .skill-card:hover .name::after,
    .skill-card:focus-visible .name::after { transform: scaleX(1); }
    .skill-card .desc {
      ${typeVar("body-sm")}
      color: var(--c-ink);
    }
    .skill-card .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
      margin-top: 2px;
    }
    .skill-card .open-hint {
      ${typeVar("mono-sm")}
      color: var(--c-bark);
      text-transform: uppercase;
      margin-top: auto;
      padding-top: var(--s-sm);
      border-top: 1px dashed var(--c-hairline);
      display: flex;
      gap: var(--s-xs);
      align-items: center;
    }
    .skill-card .open-hint::after { content: "→"; color: var(--c-terracotta); }

    /* Tags */
    .tag {
      ${typeVar("mono-sm")}
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: var(--r-sm);
      display: inline-block;
    }
    .tag-foundation { background: var(--c-terracotta-soft); color: var(--c-terracotta); }
    .tag-voice      { background: var(--c-moss-soft);       color: var(--c-moss); }
    .tag-security   { background: var(--c-slate-soft);      color: var(--c-slate); }

    /* Next chips */
    .next-row {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      align-items: center;
    }
    .next-row .label {
      ${typeVar("mono-sm")}
      color: var(--c-bark);
      text-transform: uppercase;
      margin-right: 4px;
    }
    .next-chip {
      ${typeVar("mono-sm")}
      background: var(--c-paper-soft);
      color: var(--c-ink);
      border: 1px solid var(--c-hairline);
      border-radius: var(--r-sm);
      padding: 3px 9px;
      cursor: pointer;
      font: inherit;
      ${typeVar("mono-sm")}
    }
    .next-chip:hover,
    .next-chip:focus-visible {
      border-color: var(--c-terracotta);
      color: var(--c-terracotta);
      outline: none;
    }
    .next-chip.is-static {
      cursor: default;
      color: var(--c-bark);
    }
    .next-chip.is-static:hover { border-color: var(--c-hairline); color: var(--c-bark); }

    /* ============ Modal (native <dialog>) ============ */
    .modal-dialog {
      padding: 0;
      border: none;
      color: var(--c-ink);
      background: var(--c-paper);
      background-image: var(--grain);
      width: 100vw;
      max-width: 100vw;
      max-height: 100vh;
      height: 100vh;
      margin: 0;
      border-radius: 0;
      overflow: hidden;
    }
    .modal-dialog::backdrop {
      background: rgba(42, 42, 40, 0.45);
    }
    .modal-inner {
      display: flex;
      flex-direction: column;
      height: 100%;
      max-height: 100vh;
    }
    @media (min-width: 700px) {
      .modal-dialog {
        width: calc(100% - var(--s-xl));
        max-width: 820px;
        height: auto;
        max-height: calc(100vh - var(--s-xl));
        margin: var(--s-lg) auto;
        border-radius: var(--r-lg);
        box-shadow: 0 12px 40px rgba(42, 42, 40, 0.18);
      }
    }
    .modal-header {
      padding: var(--s-base) var(--s-base) var(--s-sm);
      border-bottom: 1px solid var(--c-hairline);
      display: flex;
      align-items: baseline;
      gap: var(--s-base);
      flex-wrap: wrap;
    }
    @media (min-width: 700px) {
      .modal-header { padding: var(--s-lg) var(--s-lg) var(--s-base); }
    }
    .modal-header h2 {
      ${typeVar("display-sm")}
      ${typeVar("mono")}
      font-size: 22px;
      color: var(--c-terracotta);
      margin: 0;
      flex: 1;
    }
    .modal-close {
      background: transparent;
      border: 1px solid var(--c-hairline);
      border-radius: var(--r-pill);
      color: var(--c-bark);
      cursor: pointer;
      font: inherit;
      ${typeVar("mono-sm")}
      padding: 4px 12px;
    }
    .modal-close:hover { border-color: var(--c-terracotta); color: var(--c-terracotta); }
    .modal-nav {
      padding: var(--s-sm) var(--s-base);
      border-bottom: 1px solid var(--c-hairline);
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      background: var(--c-paper-soft);
    }
    @media (min-width: 700px) {
      .modal-nav { padding: var(--s-sm) var(--s-lg); }
    }
    .modal-nav-pill {
      ${typeVar("mono-sm")}
      background: transparent;
      color: var(--c-bark);
      border: 1px solid transparent;
      border-radius: var(--r-pill);
      padding: 4px 12px;
      cursor: pointer;
      text-decoration: none;
      text-transform: uppercase;
    }
    .modal-nav-pill:hover { color: var(--c-ink); border-color: var(--c-hairline); }
    .modal-nav-pill.active {
      background: var(--c-terracotta);
      color: var(--c-on-terracotta);
      border-color: var(--c-terracotta);
    }
    .modal-nav-sep {
      display: inline-block;
      width: 1px;
      height: 16px;
      background: var(--c-hairline);
      align-self: center;
      margin: 0 4px;
    }
    .modal-body {
      padding: var(--s-base);
      overflow-y: auto;
      ${typeVar("body")}
      flex: 1 1 auto;
      min-height: 0;
    }
    @media (min-width: 700px) {
      .modal-body { padding: var(--s-lg); }
    }
    .modal-section { margin-top: var(--s-lg); scroll-margin-top: 80px; }
    .modal-section:first-child { margin-top: 0; }
    .modal-section h3 {
      ${typeVar("mono-sm")}
      text-transform: uppercase;
      color: var(--c-bark);
      margin: 0 0 var(--s-sm);
      letter-spacing: 0.08em;
    }
    .modal-section .description {
      ${typeVar("body-lg")}
      color: var(--c-ink);
      font-style: italic;
      padding: var(--s-base) var(--s-lg);
      background: var(--c-paper-soft);
      border-left: 3px solid var(--c-terracotta);
      border-radius: 0 var(--r-md) var(--r-md) 0;
      margin: 0;
    }
    .modal-body p { margin: var(--s-sm) 0; }
    .modal-body ul, .modal-body ol { padding-left: 22px; margin: var(--s-sm) 0; }
    .modal-body li { margin-bottom: 4px; }
    .modal-body code {
      ${typeVar("mono-sm")}
      background: var(--c-paper-deep);
      padding: 1px 5px;
      border-radius: var(--r-sm);
    }
    .modal-body pre {
      background: var(--c-paper-soft);
      border: 1px solid var(--c-hairline);
      border-radius: var(--r-md);
      padding: var(--s-base) var(--s-lg);
      overflow-x: auto;
      ${typeVar("mono-sm")}
    }
    .modal-body pre code { background: none; padding: 0; }
    .modal-body .md-table {
      border-collapse: collapse;
      width: 100%;
      margin: var(--s-sm) 0 var(--s-base);
      ${typeVar("mono-sm")}
      background: var(--c-paper);
      border: 1px solid var(--c-hairline);
    }
    .modal-body .md-table th, .modal-body .md-table td {
      border: 1px solid var(--c-hairline);
      padding: 6px 10px;
      text-align: left;
      vertical-align: top;
    }
    .modal-body .md-table thead { background: var(--c-paper-soft); }
    .modal-body .md-table th { color: var(--c-bark); }
    .modal-footer-link {
      display: inline-block;
      margin-top: var(--s-lg);
      ${typeVar("mono-sm")}
      color: var(--c-terracotta);
      text-transform: uppercase;
    }

    /* ============ Chat-style example exchange ============ */
    .chat {
      display: flex;
      flex-direction: column;
      gap: var(--s-base);
      margin: 0;
    }
    .chat-turn {
      display: grid;
      grid-template-columns: 36px 1fr;
      gap: var(--s-sm);
      align-items: start;
    }
    @media (min-width: 600px) {
      .chat-turn { grid-template-columns: 44px 1fr; }
    }
    .chat-avatar {
      ${typeVar("mono-sm")}
      text-transform: uppercase;
      letter-spacing: 0.08em;
      width: 36px;
      font-size: 10px;
      padding: 4px 0;
      text-align: center;
      border-radius: var(--r-pill);
      border: 1px solid var(--c-hairline);
      background: var(--c-paper);
      color: var(--c-bark);
      align-self: start;
    }
    @media (min-width: 600px) {
      .chat-avatar { width: 44px; font-size: 11px; padding: 6px 0; }
    }
    .chat-ask .chat-avatar {
      color: var(--c-terracotta);
      border-color: var(--c-terracotta);
      background: var(--c-terracotta-soft);
    }
    .chat-get .chat-avatar {
      color: var(--c-bark);
      background: var(--c-paper-soft);
    }
    .chat-bubble {
      background: var(--c-paper-soft);
      border: 1px solid var(--c-hairline);
      border-radius: var(--r-lg);
      padding: var(--s-sm) var(--s-base);
      ${typeVar("body")}
      color: var(--c-ink);
      position: relative;
      overflow: hidden;
    }
    .chat-ask .chat-bubble {
      background: var(--c-paper);
      border-color: var(--c-terracotta);
      border-left-width: 3px;
    }
    .chat-ask .chat-bubble code {
      background: var(--c-terracotta-soft);
      color: var(--c-ink);
    }
    .chat-bubble > *:first-child { margin-top: 0; }
    .chat-bubble > *:last-child { margin-bottom: 0; }
    .chat-preamble {
      ${typeVar("body-sm")}
      color: var(--c-bark);
      font-style: italic;
      margin: 0 0 var(--s-sm);
    }
    .chat-preamble:only-child {
      margin: 0;
      font-style: normal;
      color: var(--c-ink);
    }
    .chat-code {
      margin: 0 !important;
      background: var(--c-paper) !important;
      border: 1px dashed var(--c-hairline) !important;
      border-radius: var(--r-md) !important;
      padding: var(--s-sm) var(--s-base) !important;
      max-height: 320px;
      overflow: auto;
      ${typeVar("mono-sm")}
      color: var(--c-ink);
    }
    .chat-output {
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
      color: var(--c-ink);
      max-height: 360px;
      overflow-y: auto;
    }
    .chat-output.is-prose {
      ${typeVar("body")}
      font-size: 15px;
    }
    .chat-output.is-code {
      ${typeVar("mono-sm")}
      background: var(--c-paper);
      border: 1px dashed var(--c-hairline);
      border-radius: var(--r-md);
      padding: var(--s-sm) var(--s-base);
    }
    .chat-note {
      ${typeVar("body-sm")}
      color: var(--c-bark);
      font-style: italic;
      margin: 0;
      padding-left: 52px;
    }

    /* Tier-specific */
    .modal-section.tier-graph .graph-row {
      display: flex;
      align-items: baseline;
      gap: var(--s-sm);
      padding: var(--s-sm) 0;
      border-bottom: 1px dashed var(--c-hairline);
    }
    .modal-section.tier-graph .graph-row:last-child { border-bottom: none; }
    .modal-section.tier-graph .graph-label {
      ${typeVar("mono-sm")}
      color: var(--c-bark);
      text-transform: uppercase;
      flex: 0 0 90px;
    }
    .modal-section.tier-graph .chip-row {
      display: flex; flex-wrap: wrap; gap: 6px; flex: 1;
    }
    .modal-footnotes {
      margin-top: var(--s-xl);
      padding-top: var(--s-base);
      border-top: 1px solid var(--c-hairline);
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--s-lg);
    }
    .modal-footnotes .modal-section { margin-top: 0; }

    /* ============ Colophon (footer) ============ */
    .colophon {
      margin-top: var(--s-section);
      padding: var(--s-xl) 0 var(--s-xl);
      border-top: 1px solid var(--c-hairline);
      text-align: center;
    }
    .colophon .sig {
      ${typeVar("hand")}
      color: var(--c-terracotta);
      margin: 0 0 var(--s-sm);
    }
    .colophon .meta {
      ${typeVar("mono-sm")}
      color: var(--c-bark);
      text-transform: uppercase;
    }
    .colophon .meta a { color: var(--c-bark); margin: 0 var(--s-sm); }
    .colophon .meta a:hover { color: var(--c-terracotta); }

    /* ============ Accessibility helpers ============ */
    .sr-only {
      position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
      overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
    }
    [hidden] { display: none !important; }

    /* ============ Mobile-first base scaling ============ */
    .skills-grid { grid-template-columns: 1fr; }
    .modal-footnotes { grid-template-columns: 1fr; }
    .phase > summary { flex-wrap: wrap; }

    @media (min-width: 700px) {
      .page-header { padding: var(--s-xl) var(--s-lg) var(--s-lg); }
      .skills-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
      .modal-footnotes { grid-template-columns: 1fr 1fr; }
    }
  `;
}

// Inline SVGs reused across pages
const SVG = {
  // Irregular hand-drawn underline path. Scaled by CSS.
  underline:
    `<svg class="underline" viewBox="0 0 300 12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true" preserveAspectRatio="none"><path d="M2 7 Q 30 3, 60 6 T 120 7 T 180 5 T 240 7 T 298 6" pathLength="600"/></svg>`,
  leaf:
    `<svg class="leaf" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d="M7 1 C 11 3, 13 7, 7 13 C 1 7, 3 3, 7 1 Z" opacity="0.85"/></svg>`,
  wave:
    `<svg class="wave-divider" viewBox="0 0 1200 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true" preserveAspectRatio="none"><path d="M0 9 Q 60 1 120 9 T 240 9 T 360 9 T 480 9 T 600 9 T 720 9 T 840 9 T 960 9 T 1080 9 T 1200 9"/></svg>`,
};

module.exports = { baseCss, FONTS_LINK, SVG, theme };
