// Copyright (c) 2026. Licensed under the MIT License.
// Builds the living styleguide at runbook/styleguide.html.
// Reads tokens from theme.js and renders every color, type style, spacing
// step, radius, and component live, side by side with its token reference.
// If the runbook and the styleguide ever diverge, this file is the source
// of truth — change tokens here, both pages update on the next build.

const fs = require("fs");
const path = require("path");
const { baseCss, FONTS_LINK, SVG, theme } = require("./css");

const OUTPUT = path.join(path.resolve(__dirname, "..", ".."), "runbook", "styleguide.html");

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function colorSwatch(name, def) {
  return `
    <div class="sg-swatch">
      <div class="sg-swatch-chip" style="background: ${def.value}"></div>
      <div class="sg-swatch-meta">
        <code class="mono-sm">{colors.${name}}</code>
        <code class="mono-sm sg-value">${def.value}</code>
        <p class="body-sm">${esc(def.role)}</p>
      </div>
    </div>`;
}

function typeRow(name, def) {
  const style = `font-family: ${def.fontFamily}; font-size: ${def.fontSize}; font-weight: ${def.fontWeight}; line-height: ${def.lineHeight}; letter-spacing: ${def.letterSpacing};`;
  const sample = name === "hand" ? "kept by jh" : name.startsWith("mono") ? "skill-name-here" : "The quick brown fox jumps over the lazy dog.";
  return `
    <div class="sg-type-row">
      <div class="sg-type-meta">
        <code class="mono-sm">{typography.${name}}</code>
        <p class="body-sm">${esc(def.role)}</p>
        <p class="mono-sm sg-value">${def.fontSize} · ${def.fontWeight} · lh ${def.lineHeight}</p>
      </div>
      <div class="sg-type-sample" style="${style}">${sample}</div>
    </div>`;
}

function spacingRow(name, value) {
  const px = parseInt(value, 10) || 0;
  return `
    <div class="sg-space-row">
      <code class="mono-sm">{spacing.${name}}</code>
      <code class="mono-sm sg-value">${value}</code>
      <div class="sg-space-bar" style="width: ${Math.min(px, 280)}px"></div>
    </div>`;
}

function roundedRow(name, value) {
  return `
    <div class="sg-round-row">
      <code class="mono-sm">{rounded.${name}}</code>
      <code class="mono-sm sg-value">${value}</code>
      <div class="sg-round-box" style="border-radius: ${value}"></div>
    </div>`;
}

function componentBlock(name, recipe) {
  // Render a live instance of every component.
  const role = recipe.role || "";
  const tokens = Object.entries(recipe)
    .filter(([k]) => k !== "role")
    .map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`)
    .join("");
  const live = renderLive(name);
  return `
    <article class="sg-component">
      <header class="sg-component-head">
        <h3 class="mono">${name}</h3>
        <p class="body-sm">${esc(role)}</p>
      </header>
      <div class="sg-component-live">${live}</div>
      <details class="disclosure sg-tokens">
        <summary>Token recipe</summary>
        <div class="disclosure-body">
          <dl class="sg-dl">${tokens}</dl>
        </div>
      </details>
    </article>`;
}

// Live demo HTML for each component.
function renderLive(name) {
  switch (name) {
    case "btn-primary":
      return `<button class="sg-demo-btn-primary">Primary action</button>`;
    case "btn-quiet":
      return `<button class="sg-demo-btn-quiet">Quiet action</button>`;
    case "card":
      return `
        <div class="skill-card" style="max-width:320px">
          <span class="name">example-skill</span>
          <span class="desc">A short, calm description of what this skill is for.</span>
          <span class="open-hint">open full skill</span>
        </div>`;
    case "card-expanded":
      return `
        <div class="skill-card" style="max-width:320px; background: var(--c-paper-soft); border-color: var(--c-terracotta)">
          <span class="name">example-skill</span>
          <span class="desc">Expanded state. Hairline shifts to terracotta; back lifts to paper-soft.</span>
          <div class="meta"><span class="tag tag-foundation">Foundation</span></div>
          <div class="next-row"><span class="label">Next</span><button class="next-chip">next-skill</button></div>
          <span class="open-hint">open full skill</span>
        </div>`;
    case "pill":
      return `<a class="pill" href="#">01 Triage</a>`;
    case "pill-active":
      return `<a class="pill active" href="#">01 Triage</a>`;
    case "chip":
      return `<button class="next-chip">next-skill</button>`;
    case "tag-foundation":
      return `<span class="tag tag-foundation">Foundation</span>`;
    case "tag-voice":
      return `<span class="tag tag-voice">Voice</span>`;
    case "tag-security":
      return `<span class="tag tag-security">Security</span>`;
    case "gloss-block":
      return `<p class="gloss" style="font-style:italic; color:var(--c-bark); max-width:520px; ${typeInline("body-lg")}">Deciding which tickets are worth working on right now.</p>`;
    case "hand-underline":
      return `<div style="position:relative; display:inline-block; padding-bottom:14px"><span style="${typeInline("display-sm")}">Underlined title</span>${SVG.underline}</div>`;
    case "leaf-bullet":
      return `<span style="color: var(--c-moss); display:inline-flex; align-items:center; gap:8px">${SVG.leaf}<code class="mono-sm">moss thread</code></span> &nbsp;<span style="color: var(--c-slate); display:inline-flex; align-items:center; gap:8px">${SVG.leaf}<code class="mono-sm">slate thread</code></span> &nbsp;<span style="color: var(--c-terracotta); display:inline-flex; align-items:center; gap:8px">${SVG.leaf}<code class="mono-sm">terracotta thread</code></span>`;
    case "wave-divider":
      return SVG.wave;
    case "colophon":
      return `<div style="text-align:center"><p class="hand" style="color:var(--c-terracotta); margin:0 0 8px">kept by jh</p><p class="mono-sm" style="color:var(--c-bark); text-transform:uppercase">canon · design · skills</p></div>`;
    case "skip-link":
      return `<a class="skip-link" href="#" style="position:static; top:auto" onclick="event.preventDefault()">Skip to skills</a>`;
    case "newcomer-note":
      return `<aside class="newcomer-note" style="margin:0; max-width:520px"><p><strong>New to AI skills?</strong> A "skill" is a short Markdown file that tells an AI how to do one specific job, like a checklist a coworker would follow.</p></aside>`;
    case "phaseflow-node":
      return `<a class="phaseflow-node" href="#" style="max-width:180px" onclick="event.preventDefault()"><span class="num">01</span><span class="name">Triage</span><span class="gloss">Deciding which tickets are worth working on right now.</span></a>`;
    case "phaseflow-band":
      return `<div class="phaseflow-band" style="margin:0; max-width:520px">cross-cutting · run through every phase · <a href="#" onclick="event.preventDefault()">voice</a><span class="sep">·</span><a href="#" onclick="event.preventDefault()">security</a></div>`;
    case "usage-modes":
      return `<section class="usage-modes" style="margin:0; max-width:560px"><h2 class="usage-modes-title">Three ways to drive the skills</h2><p class="usage-modes-intro">Pick the mode that fits the work in front of you.</p><ul class="usage-modes-list" style="grid-template-columns:1fr"><li class="usage-mode"><p class="usage-mode-head"><strong>One-off</strong>Pull a single skill when you want it.</p></li></ul></section>`;
    case "accent-legend":
      return `<p class="accent-legend" style="margin:0; max-width:560px"><span class="accent-legend__intro">Skills are marked when they are foundational, voice-sensitive, or security-sensitive.</span><span><span class="tag tag-foundation">Foundation</span> called by other skills</span><span><span class="tag tag-voice">Voice</span> written for an audience</span><span><span class="tag tag-security">Security</span> touches secrets</span></p>`;
    default:
      return `<em class="body-sm">No live demo defined.</em>`;
  }
}

function typeInline(name) {
  const t = theme.typography[name];
  return `font-family: ${t.fontFamily}; font-size: ${t.fontSize}; font-weight: ${t.fontWeight}; line-height: ${t.lineHeight}; letter-spacing: ${t.letterSpacing};`;
}

const phaseThreadList = Object.entries(theme.phaseThreads)
  .map(([phase, color]) => `<li><code class="mono-sm">${phase}</code> &rarr; <code class="mono-sm">{colors.${color}}</code></li>`)
  .join("");

const phaseGlossList = Object.entries(theme.phaseGloss)
  .map(([phase, gloss]) => `<li><strong>${phase}</strong> — <em>${esc(gloss)}</em></li>`)
  .join("");

const gapList = theme.knownGaps.map(g => `<li>${esc(g)}</li>`).join("");

// ============ HTML ============

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ai-runbook-jh — styleguide</title>
  ${FONTS_LINK}
  <style>
    ${baseCss()}

    /* ============ Styleguide-only ============ */
    .sg-toc {
      position: sticky;
      top: 0;
      background: var(--c-paper);
      background-image: var(--grain);
      border-bottom: 1px solid var(--c-hairline);
      padding: var(--s-base) 0;
      z-index: 5;
    }
    .sg-toc nav {
      display: flex;
      flex-wrap: wrap;
      gap: var(--s-sm);
    }
    .sg-toc a {
      ${typeInline("mono-sm")}
      color: var(--c-bark);
      text-transform: uppercase;
      text-decoration: none;
      padding: 4px 12px;
      border-radius: var(--r-pill);
      border: 1px solid var(--c-hairline);
    }
    .sg-toc a:hover { color: var(--c-terracotta); border-color: var(--c-terracotta); }

    .sg-section {
      padding: var(--s-xl) 0 var(--s-lg);
      border-top: 1px solid var(--c-hairline);
    }
    .sg-section:first-of-type { border-top: none; }
    .sg-section h2 {
      ${typeInline("display-sm")}
      margin: 0 0 var(--s-sm);
      color: var(--c-ink);
    }
    .sg-section .sg-lede {
      ${typeInline("body-lg")}
      color: var(--c-bark);
      max-width: var(--prose-w);
      margin: 0 0 var(--s-lg);
    }

    .sg-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--s-base);
    }

    /* Colors */
    .sg-swatch {
      background: var(--c-paper);
      border: 1px solid var(--c-hairline);
      border-radius: var(--r-lg);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .sg-swatch-chip {
      height: 80px;
      border-bottom: 1px solid var(--c-hairline);
    }
    .sg-swatch-meta { padding: var(--s-base); display: flex; flex-direction: column; gap: 4px; }
    .sg-value { color: var(--c-bark); }
    .sg-swatch-meta p { margin: 6px 0 0; }

    /* Type */
    .sg-type-row {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: var(--s-lg);
      align-items: center;
      padding: var(--s-base) 0;
      border-bottom: 1px dashed var(--c-hairline);
    }
    .sg-type-row:last-child { border-bottom: none; }
    .sg-type-meta { display: flex; flex-direction: column; gap: 4px; }
    .sg-type-meta p { margin: 0; }
    .sg-type-sample { color: var(--c-ink); }
    @media (max-width: 700px) {
      .sg-type-row { grid-template-columns: 1fr; }
    }

    /* Spacing */
    .sg-space-row, .sg-round-row {
      display: grid;
      grid-template-columns: 140px 80px 1fr;
      gap: var(--s-base);
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px dashed var(--c-hairline);
    }
    .sg-space-bar { height: 14px; background: var(--c-terracotta-soft); border-left: 2px solid var(--c-terracotta); }
    .sg-round-box { width: 60px; height: 60px; background: var(--c-paper-soft); border: 1px solid var(--c-hairline); }

    /* Components */
    .sg-component {
      background: var(--c-paper);
      border: 1px solid var(--c-hairline);
      border-radius: var(--r-lg);
      padding: var(--s-lg);
      display: flex;
      flex-direction: column;
      gap: var(--s-base);
    }
    .sg-component-head h3 { margin: 0; color: var(--c-terracotta); font-size: 16px; }
    .sg-component-head p { margin: 4px 0 0; color: var(--c-bark); }
    .sg-component-live {
      padding: var(--s-lg);
      background: var(--c-paper-soft);
      border-radius: var(--r-md);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 80px;
      gap: var(--s-sm);
      flex-wrap: wrap;
    }
    .sg-tokens { margin: 0; border: none; }
    .sg-dl {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: 4px var(--s-base);
      margin: 0;
    }
    .sg-dl dt { ${typeInline("mono-sm")} color: var(--c-bark); text-transform: uppercase; }
    .sg-dl dd { margin: 0; ${typeInline("mono-sm")} color: var(--c-ink); }

    /* Demo buttons in styleguide only */
    .sg-demo-btn-primary {
      background: var(--c-terracotta);
      color: var(--c-on-terracotta);
      ${typeInline("mono-sm")}
      text-transform: uppercase;
      border: none;
      border-radius: var(--r-md);
      padding: 10px 18px;
      cursor: pointer;
    }
    .sg-demo-btn-primary:hover { background: var(--c-ink); }
    .sg-demo-btn-quiet {
      background: transparent;
      color: var(--c-ink);
      ${typeInline("mono-sm")}
      text-transform: uppercase;
      border: 1px solid var(--c-hairline);
      border-radius: var(--r-md);
      padding: 10px 14px;
      cursor: pointer;
    }
    .sg-demo-btn-quiet:hover { border-color: var(--c-terracotta); color: var(--c-terracotta); }

    .sg-phases {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--s-lg);
    }
    @media (max-width: 700px) { .sg-phases { grid-template-columns: 1fr; } }
    .sg-phases ul { padding-left: 22px; }
    .sg-phases li { margin-bottom: 6px; }
  </style>
</head>
<body>
  <header class="page-header container">
    <div class="eyebrow">ai-runbook-jh · living styleguide</div>
    <div class="title-wrap">
      <h1>Styleguide: the system, in use.</h1>
      ${SVG.underline}
    </div>
    <p class="tagline">Every token and component renders here from the same source the AI runbook uses. If something looks wrong, fix it in <code>tools/runbook-build/theme.js</code> and rebuild - both pages update together.</p>
  </header>

  <div class="sg-toc">
    <div class="container">
      <nav aria-label="Styleguide sections">
        <a href="#colors">Colors</a>
        <a href="#typography">Typography</a>
        <a href="#spacing">Spacing</a>
        <a href="#rounded">Radii</a>
        <a href="#phases">Phase threads</a>
        <a href="#components">Components</a>
        <a href="#gaps">Known gaps</a>
      </nav>
    </div>
  </div>

  <main class="container">
    <section class="sg-section" id="colors">
      <h2>Colors</h2>
      <p class="sg-lede">Warm paper canvas. Soft charcoal ink. Terracotta as the single primary signal. Moss and slate as quiet phase threads — never used alone to convey meaning.</p>
      <div class="sg-grid">
        ${Object.entries(theme.colors).map(([k, v]) => colorSwatch(k, v)).join("")}
      </div>
    </section>

    <section class="sg-section" id="typography">
      <h2>Typography</h2>
      <p class="sg-lede">Fraunces for display, Source Serif 4 for body, IBM Plex Mono for technical labels, Caveat for one moment of human warmth in the footer.</p>
      ${Object.entries(theme.typography).map(([k, v]) => typeRow(k, v)).join("")}
    </section>

    <section class="sg-section" id="spacing">
      <h2>Spacing</h2>
      <p class="sg-lede">A modest scale. Generous rhythm comes from line-height and section gaps, not from packing more steps onto the ladder.</p>
      ${Object.entries(theme.spacing).map(([k, v]) => spacingRow(k, v)).join("")}
    </section>

    <section class="sg-section" id="rounded">
      <h2>Radii</h2>
      <p class="sg-lede">Soft, not pillowy. <code>note</code> is intentionally irregular — used on rare hand-cut elements only.</p>
      ${Object.entries(theme.rounded).map(([k, v]) => roundedRow(k, v)).join("")}
    </section>

    <section class="sg-section" id="phases">
      <h2>Phase threads &amp; plain-language gloss</h2>
      <p class="sg-lede">Each of the six phases carries a quiet color thread and a plain-words gloss. The thread differentiates; the gloss makes the phase legible to anyone, regardless of role.</p>
      <div class="sg-phases">
        <div>
          <h3 class="mono-sm" style="color:var(--c-bark); text-transform:uppercase">Threads</h3>
          <ul>${phaseThreadList}</ul>
        </div>
        <div>
          <h3 class="mono-sm" style="color:var(--c-bark); text-transform:uppercase">Plain-language glosses</h3>
          <ul>${phaseGlossList}</ul>
        </div>
      </div>
    </section>

    <section class="sg-section" id="components">
      <h2>Components</h2>
      <p class="sg-lede">Every component used in the AI runbook renders below, live. Each carries its token recipe as a disclosure — open it to see exactly which tokens compose it.</p>
      <div class="sg-grid" style="grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))">
        ${Object.entries(theme.components).map(([k, v]) => componentBlock(k, v)).join("")}
      </div>
    </section>

    <section class="sg-section" id="gaps">
      <h2>Known gaps</h2>
      <p class="sg-lede">What this system explicitly does not cover. Honest limits keep the contract clear.</p>
      <ul>${gapList}</ul>
    </section>
  </main>

  <footer class="colophon container">
    <p class="meta">
      <a href="https://github.com/civicactions/ai-runbook-jh">github</a> ·
      <a href="./index.html">AI runbook</a> ·
      <a href="./styleguide.html">styleguide</a> ·
      <a href="../diagrams/six-phase-flow.svg">one-pager</a>
    </p>
  </footer>
</body>
</html>
`;

fs.writeFileSync(OUTPUT, html);
console.log(`Wrote ${OUTPUT} (${(html.length / 1024).toFixed(1)} KB)`);
