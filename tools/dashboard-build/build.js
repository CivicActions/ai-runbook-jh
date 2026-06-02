// Copyright (c) 2026. Licensed under the MIT License.
// Builds a self-contained HTML skills explorer.
// Reads all SKILL.md files from skills/, extracts frontmatter +
// key sections, and emits a single index.html with embedded data.

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const SKILLS_DIR = path.join(REPO_ROOT, "skills");
const OUTPUT = path.join(REPO_ROOT, "dashboard", "index.html");

// ============ PHASE MAP ============
// Maps each skill to its phase + classification.
// foundation = called by 2+ other skills (true reuse), not a workflow step run standalone
// crossCutting = voice / security keystone
const SKILL_META = {
  triage:                   { phase: "triage" },
  "ticket-refinement":      { phase: "refinement" },
  "definition-of-done":     { phase: "refinement", foundation: true },
  "issue-plan":             { phase: "plan" },
  "implementation-details": { phase: "plan" },
  "pattern-alignment":      { phase: "build" },
  "component-design":       { phase: "build" },
  kiss:                     { phase: "build" },
  "handoff-message":        { phase: "build" },
  "organize-commits":       { phase: "build" },
  "squash-commits":         { phase: "build" },
  "commit-message-writer":  { phase: "build" },
  "browser-check":          { phase: "validate", foundation: true },
  "accessibility-audit":    { phase: "validate" },
  "responsive-design":      { phase: "validate" },
  "performance-frontend":   { phase: "validate" },
  "frontend-peer-review":   { phase: "validate" },
  "drupal-critic":          { phase: "validate" },
  "summarize-commits":      { phase: "communicate" },
  "qa-steps":               { phase: "communicate" },
  "issue-closure-notes":    { phase: "communicate" },
  "lessons-learned":        { phase: "communicate" },
  "check-tone":             { phase: "cross-cutting", crossCutting: "voice", foundation: true },
  "security-check":         { phase: "cross-cutting", crossCutting: "security", foundation: true },
};


const PHASES = [
  { id: "triage",        num: 1, icon: "🔍",  name: "Triage",        desc: "First touch. Keep, defer, decline. Minimum required fields, initial priority, reviewed tag.", state: "New", section: "pre-dev" },
  { id: "refinement",    num: 2, icon: "📝",  name: "Refinement",    desc: "Prep for Estimation. User story, acceptance criteria, dependencies, DoD.",                         state: "Refined  ▸  Ready for Estimate", section: "pre-dev" },
  { id: "plan",          num: 3, icon: "🗺️",  name: "Plan",          desc: "Write the approach as a file before touching code. Generates the implementation-details checklist.", state: "Selected  ▸  Building", section: "dev" },
  { id: "build",         num: 4, icon: "🔨",  name: "Build",         desc: "Implement against the plan. Pattern and simplicity checks. Handoffs carry state across chats. Clean commits before handoff.",     state: "Building", section: "dev" },
  { id: "validate",      num: 5, icon: "✅",  name: "Validate",      desc: "Confirm it works. Browser, accessibility, responsiveness, performance, peer review.",               state: "Building", section: "dev" },
  { id: "communicate",   num: 6, icon: "📣",  name: "Communicate",   desc: "Hand off and reflect. PR summary, QA steps, closure notes, lessons captured at handoff.",        state: "Review  ▸  QA  ▸  Done", section: "dev" },
  { id: "cross-cutting", num: null, icon: "⚙️", name: "Cross-cutting", desc: "Not tied to a phase. check-tone fires on anything written for an audience; security-check fires on anything touching secrets or sensitive data.", state: "Always on", section: "cross" },
];

// ============ PARSE SKILL.md ============

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { fm: {}, body: text };
  const fm = {};
  m[1].split("\n").forEach(line => {
    const k = line.match(/^(\w+):\s*(.*)$/);
    if (k) fm[k[1]] = k[2].replace(/^"|"$/g, "");
  });
  return { fm, body: m[2] };
}

function extractSection(body, headerRegex) {
  const lines = body.split("\n");
  let inSection = false;
  let depth = 0;
  let inFence = false;
  const out = [];
  for (const line of lines) {
    if (/^```/.test(line)) {
      inFence = !inFence;
      if (inSection) out.push(line);
      continue;
    }
    const headerMatch = !inFence && line.match(/^(#+)\s+(.+)$/);
    if (headerMatch) {
      const lineDepth = headerMatch[1].length;
      if (headerRegex.test(headerMatch[2])) {
        inSection = true;
        depth = lineDepth;
        continue;
      } else if (inSection && lineDepth <= depth) {
        break;
      }
    }
    if (inSection) out.push(line);
  }
  return out.join("\n").trim();
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// minimal markdown → html for skill detail sections
function mdToHtml(md) {
  if (!md) return "";
  // Code blocks
  let html = md.replace(/```[a-z]*\n([\s\S]*?)```/g, (_, code) =>
    `<pre><code>${escapeHtml(code)}</code></pre>`
  );
  // Inline code
  html = html.replace(/`([^`]+)`/g, (_, code) => `<code>${escapeHtml(code)}</code>`);
  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // Italic
  html = html.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  // Lists
  const lines = html.split("\n");
  const out = [];
  let inList = false;
  for (const line of lines) {
    const li = line.match(/^[-*]\s+(.+)$/);
    if (li) {
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push(`  <li>${li[1]}</li>`);
    } else {
      if (inList) { out.push("</ul>"); inList = false; }
      if (line.trim() === "") {
        out.push("");
      } else if (!line.startsWith("<")) {
        out.push(`<p>${line}</p>`);
      } else {
        out.push(line);
      }
    }
  }
  if (inList) out.push("</ul>");
  return out.join("\n");
}

// ============ COLLECT ============

const dirs = Object.keys(SKILL_META)
  .filter(name => {
    const dir = path.join(SKILLS_DIR, name);
    return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
  });

const skills = dirs.map(name => {
  const filePath = path.join(SKILLS_DIR, name, "SKILL.md");
  const text = fs.readFileSync(filePath, "utf8");
  const { fm, body } = parseFrontmatter(text);
  const meta = SKILL_META[name];

  return {
    name,
    phase: meta.phase,
    foundation: !!meta.foundation,
    crossCutting: meta.crossCutting || null,
    description: fm.description || "",
    typicalNext: fm.typicalNext || extractSection(body, /^Typical Next$/i),
    invokedBy: fm.invokedBy || "",
    whenToUse: extractSection(body, /^When to Use$/i),
    approach: extractSection(body, /^Approach$/i),
    outputFormat: extractSection(body, /^Output Format$/i),
    voice: extractSection(body, /^Voice$/i),
    security: extractSection(body, /^Security$/i),
    related: extractSection(body, /^Related Skills$/i),
    example: extractSection(body, /^Example$/i),
    filePath: `skills/${name}/SKILL.md`,
  };
});

console.log(`Parsed ${skills.length} skills:`, skills.map(s => s.name).join(", "));

// ============ RENDER HTML ============

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ai-runbook-jh: Skills Explorer</title>
  <style>
    :root {
      --navy: #0b2545;
      --primary: #1a4480;
      --primary-mid: #2d5a8e;
      --primary-light: #dbe9f7;
      --pre-dev-light: #f0f7fc;
      --voice: #54278f;
      --voice-light: #f5f0fa;
      --security: #b50909;
      --security-light: #faf0f0;
      --gold: #ffbe2e;
      --gold-light: #fffbe8;
      --text-dark: #1b1b1b;
      --text-mid: #565c65;
      --text-muted: #71767a;
      --border: #e0e0e0;
      --bg: #fafafa;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: var(--text-dark);
      background: var(--bg);
      line-height: 1.5;
    }

    .container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }

    /* Header */
    .site-header {
      background: var(--navy);
      color: white;
      padding: 32px 0 28px;
      position: relative;
    }
    .site-header::before {
      content: "";
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 6px;
      background: var(--gold);
    }
    .site-header h1 {
      margin: 0 0 8px;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .site-header .subtitle {
      font-weight: 400;
      font-size: 22px;
      color: #aacdec;
    }
    .site-header .tagline {
      margin: 0;
      font-size: 15px;
      color: #dbe9f7;
      font-style: italic;
    }
    .site-header .meta {
      margin-top: 4px;
      font-size: 12px;
      color: #aacdec;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    /* Controls */
    .controls {
      position: sticky;
      top: 0;
      background: var(--bg);
      border-bottom: 1px solid var(--border);
      padding: 16px 24px;
      z-index: 10;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    }
    .controls-inner {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
      max-width: 1280px;
      margin: 0 auto;
    }
    #search {
      flex: 1;
      min-width: 240px;
      padding: 10px 14px;
      font-size: 15px;
      border: 1.5px solid var(--border);
      border-radius: 6px;
      background: white;
      font-family: inherit;
    }
    #search:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(26, 68, 128, 0.15);
    }
    .filters {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .filter-btn {
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 600;
      border: 1.5px solid var(--border);
      background: white;
      color: var(--text-mid);
      border-radius: 6px;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.12s ease;
    }
    .filter-btn:hover {
      border-color: var(--primary);
      color: var(--primary);
    }
    .filter-btn.active {
      background: var(--primary);
      border-color: var(--primary);
      color: white;
    }
    .filter-btn .count {
      opacity: 0.7;
      margin-left: 4px;
      font-weight: 400;
    }

    /* Phase mini-map strip */
    .phase-minimap {
      background: white;
      border-bottom: 1px solid var(--border);
      padding: 12px 24px;
    }
    .phase-minimap-inner {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      gap: 6px;
      align-items: stretch;
      overflow-x: auto;
      scrollbar-width: thin;
    }
    .phase-tile {
      flex: 1 1 0;
      min-width: 110px;
      padding: 8px 10px;
      background: var(--pre-dev-light);
      border: 1.5px solid transparent;
      border-radius: 6px;
      cursor: pointer;
      font-family: inherit;
      color: var(--text-dark);
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 3px;
      align-items: center;
      transition: all 0.12s ease;
    }
    .phase-tile[data-section="dev"] { background: var(--primary-light); }
    .phase-tile[data-section="cross"] { background: #f4f4f8; }
    .phase-tile[data-filter="all"] { background: white; border-color: var(--border); }
    .phase-tile:hover {
      border-color: var(--primary);
      transform: translateY(-1px);
    }
    .phase-tile.active {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(26, 68, 128, 0.15);
    }
    .phase-tile:focus-visible {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }
    .phase-tile-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      font-weight: 700;
      font-size: 11px;
      flex-shrink: 0;
    }
    .phase-tile[data-section="cross"] .phase-tile-badge { background: var(--text-muted); font-size: 10px; }
    .phase-tile[data-filter="all"] .phase-tile-badge { background: var(--navy); }
    .phase-tile-name {
      font-size: 12px;
      font-weight: 700;
      color: var(--text-dark);
      line-height: 1.2;
    }
    .phase-tile-count {
      font-size: 10px;
      color: var(--text-muted);
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    /* Main */
    main { padding: 32px 0 64px; }

    .phase-section {
      margin-bottom: 32px;
    }
    .phase-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
      padding: 16px 20px;
      background: var(--pre-dev-light);
      border-left: 6px solid var(--primary);
      border-radius: 4px;
    }
    .phase-section[data-section="dev"] .phase-header {
      background: var(--primary-light);
    }
    .phase-section[data-section="cross"] .phase-header {
      background: #f4f4f8;
      border-left-color: var(--text-muted);
    }
    .phase-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      font-weight: 700;
      font-size: 16px;
      flex-shrink: 0;
    }
    .phase-section[data-section="cross"] .phase-badge {
      background: var(--text-muted);
      font-size: 14px;
    }
    .phase-header-text { flex: 1; }
    .phase-header h2 {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
      color: var(--text-dark);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .phase-icon {
      font-size: 24px;
      line-height: 1;
      flex-shrink: 0;
    }
    .phase-header p {
      margin: 4px 0 0;
      font-size: 14px;
      color: var(--text-mid);
    }
    .phase-header .state-pill {
      display: inline-block;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      background: white;
      color: var(--text-muted);
      border: 1px solid var(--border);
      border-radius: 4px;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 14px;
    }
    .skill-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 16px 18px;
      cursor: pointer;
      transition: all 0.15s ease;
      display: flex;
      flex-direction: column;
      gap: 8px;
      text-align: left;
      font-family: inherit;
      color: var(--text-dark);
    }
    .skill-card:hover {
      border-color: var(--primary);
      box-shadow: 0 2px 8px rgba(26, 68, 128, 0.1);
      transform: translateY(-1px);
    }
    .skill-card-name {
      font-family: "Courier New", Consolas, monospace;
      font-size: 15px;
      font-weight: 700;
      color: var(--primary);
    }
    .skill-card[data-cross="voice"] .skill-card-name { color: var(--voice); }
    .skill-card[data-cross="security"] .skill-card-name { color: var(--security); }
    .skill-card-desc {
      font-size: 13px;
      color: var(--text-mid);
      line-height: 1.5;
    }
    .skill-card-tags {
      display: flex;
      gap: 6px;
      margin-top: 4px;
    }
    .tag {
      font-size: 10px;
      letter-spacing: 0.5px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 3px;
    }
    .tag-foundation {
      background: var(--gold-light);
      color: #8a6300;
      border: 1px solid var(--gold);
    }
    .tag-voice {
      background: var(--voice-light);
      color: var(--voice);
      border: 1px solid var(--voice);
    }
    .tag-security {
      background: var(--security-light);
      color: var(--security);
      border: 1px solid var(--security);
    }

    /* typicalNext chips on cards: always visible */
    .skill-card-nextrow {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 6px;
      padding-top: 8px;
      border-top: 1px dashed var(--border);
      align-items: center;
    }
    .skill-card-nextrow-label {
      font-size: 10px;
      letter-spacing: 1px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-right: 2px;
    }
    .next-chip {
      font-family: "Courier New", Consolas, monospace;
      font-size: 11px;
      font-weight: 600;
      color: var(--primary);
      background: white;
      border: 1px solid var(--primary-light);
      border-radius: 3px;
      padding: 2px 7px;
      cursor: pointer;
      transition: all 0.12s ease;
    }
    .next-chip:hover,
    .next-chip:focus-visible {
      background: var(--primary-light);
      border-color: var(--primary);
      outline: none;
    }
    /* Modal typicalNext chips render inline within prose */
    .modal-body .next-chip {
      font-size: 12px;
      padding: 1px 7px;
      margin: 0 1px;
      vertical-align: baseline;
    }
    /* Card is a div with role=button: ensure visible keyboard focus */
    .skill-card:focus-visible {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
      border-color: var(--primary);
    }

    /* Tier/cross-cutting accent borders */
    .skill-card { border-left-width: 3px; }
    .skill-card[data-foundation="1"] { border-left-color: var(--gold); }
    .skill-card[data-cross="voice"]    { border-left-color: var(--voice); }
    .skill-card[data-cross="security"] { border-left-color: var(--security); }

    /* Filter button keyboard focus */
    .filter-btn:focus-visible {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }

    /* Mini-map tile keyboard focus */
    .phase-tile:focus-visible {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }

    /* Accent legend: decodes the card border-left colors */
    .accent-legend {
      max-width: 1280px;
      margin: 20px auto 16px;
      padding: 0 24px;
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;
      font-size: 11px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--text-muted);
    }
    .accent-legend-label { margin-right: 4px; }
    .accent-legend-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--text-mid);
    }
    .accent-legend-swatch {
      display: inline-block;
      width: 14px;
      height: 14px;
      border-radius: 2px;
      border: 1px solid rgba(0, 0, 0, 0.12);
    }
    .accent-legend-swatch[data-accent="foundation"] { background: var(--gold); }
    .accent-legend-swatch[data-accent="voice"]      { background: var(--voice); }
    .accent-legend-swatch[data-accent="security"]   { background: var(--security); }
    .accent-legend-note {
      flex-basis: 100%;
      margin-top: 4px;
      font-size: 11px;
      font-weight: 400;
      letter-spacing: 0;
      text-transform: none;
      color: var(--text-muted);
    }

    /* Usage modes: framing strip between hero and search */
    .usage-modes {
      background: #fff;
      border-bottom: 1px solid var(--border);
    }
    .usage-modes-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 18px 24px 20px;
    }
    .usage-modes-title {
      font-size: 11px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--text-muted);
      margin: 0 0 10px;
    }
    .usage-modes-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      font-size: 13px;
      line-height: 1.5;
      color: var(--text-mid);
    }
    .usage-modes-list li strong {
      color: var(--text-dark);
      display: block;
      margin-bottom: 2px;
      font-size: 13px;
    }
    .usage-modes-list code {
      font-size: 12px;
      background: var(--bg);
      padding: 1px 4px;
      border-radius: 3px;
    }
    .usage-mode-example {
      display: block;
      margin-top: 6px;
      font-size: 12px;
      line-height: 1.5;
      color: var(--text-muted);
    }
    .usage-mode-example em {
      color: var(--text-mid);
      font-style: italic;
    }
    .usage-mode-example code {
      font-size: 11px;
    }
    .usage-mode-chat {
      margin-top: 10px;
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 8px 10px;
      font-size: 12px;
      line-height: 1.5;
    }
    .usage-mode-chat-row {
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }
    .usage-mode-chat-row + .usage-mode-chat-row {
      margin-top: 4px;
      padding-top: 4px;
      border-top: 1px dashed var(--border);
    }
    .usage-mode-chat-who {
      flex: 0 0 auto;
      width: 44px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 9.5px;
      padding-top: 3px;
    }
    .usage-mode-chat-msg {
      color: var(--text-dark);
      flex: 1 1 auto;
    }
    .usage-mode-chat-msg code {
      font-size: 11px;
      background: var(--bg);
      padding: 1px 4px;
      border-radius: 3px;
    }
    .usage-mode-chat-row[data-who="agent"] .usage-mode-chat-msg {
      color: var(--text-mid);
    }

    .empty-state {
      padding: 64px 0;
      text-align: center;
      color: var(--text-muted);
    }
    .empty-state h3 { margin: 0 0 8px; font-size: 18px; color: var(--text-dark); }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(11, 37, 69, 0.4);
      z-index: 100;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .modal-backdrop.open { display: flex; }
    .modal {
      background: white;
      border-radius: 8px;
      max-width: 800px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    }
    .modal-header {
      position: sticky;
      top: 0;
      background: white;
      border-bottom: 1px solid var(--border);
      padding: 20px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .modal-header h2 {
      margin: 0;
      font-family: "Courier New", Consolas, monospace;
      font-size: 22px;
      color: var(--primary);
      flex: 1;
    }
    .modal-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: var(--text-muted);
      padding: 4px 8px;
      line-height: 1;
    }
    .modal-close:hover { color: var(--text-dark); }
    .modal-nav {
      position: sticky;
      top: 64px;
      background: white;
      border-bottom: 1px solid var(--border);
      padding: 8px 24px;
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      z-index: 1;
    }
    .modal-nav-pill {
      font-family: inherit;
      font-size: 11px;
      font-weight: 600;
      color: var(--text-mid);
      background: transparent;
      border: 1px solid var(--border);
      border-radius: 999px;
      padding: 3px 10px;
      cursor: pointer;
      letter-spacing: 0.3px;
      transition: all 0.12s ease;
    }
    .modal-nav-pill:hover {
      border-color: var(--primary);
      color: var(--primary);
    }
    .modal-nav-pill.active {
      background: var(--primary);
      border-color: var(--primary);
      color: white;
    }
    .modal-nav-pill:focus-visible {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }
    .modal-nav-sep {
      display: inline-block;
      width: 1px;
      height: 14px;
      background: var(--border);
      margin: 0 6px;
      align-self: center;
    }
    .modal-body { padding: 20px 24px 32px; }
    .modal-section { margin-top: 20px; scroll-margin-top: 110px; }
    .modal-section:first-child { margin-top: 8px; }
    .modal-section h3 {
      margin: 0 0 8px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--text-muted);
    }
    .modal-section .description {
      font-size: 15px;
      color: var(--text-dark);
      font-style: italic;
      padding: 12px 16px;
      background: var(--pre-dev-light);
      border-left: 4px solid var(--primary);
      border-radius: 4px;
      margin: 0 0 8px;
    }
    .modal-body ul { padding-left: 22px; margin: 4px 0; }
    .modal-body li { margin-bottom: 4px; font-size: 14px; }
    .modal-body p { margin: 8px 0; font-size: 14px; line-height: 1.55; }
    .modal-body .md-table {
      border-collapse: collapse;
      width: 100%;
      margin: 10px 0 14px;
      font-size: 12.5px;
      font-family: "Courier New", Consolas, monospace;
      background: #fafafa;
      border: 1px solid var(--border);
    }
    .modal-body .md-table th,
    .modal-body .md-table td {
      border: 1px solid var(--border);
      padding: 6px 8px;
      text-align: left;
      vertical-align: top;
      color: var(--text-dark);
    }
    .modal-body .md-table thead {
      background: #fff;
    }
    .modal-body .md-table th {
      font-weight: 700;
      color: var(--text-mid);
    }
    .modal-body code {
      font-family: "Courier New", Consolas, monospace;
      font-size: 13px;
      background: #f0f0f0;
      padding: 1px 5px;
      border-radius: 3px;
    }
    .modal-body pre {
      background: #f5f5f5;
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 12px 16px;
      overflow-x: auto;
      font-size: 12px;
    }
    .modal-body pre code {
      background: none;
      padding: 0;
    }
    .modal-footer-link {
      display: inline-block;
      margin-top: 16px;
      font-size: 13px;
      color: var(--primary);
      font-family: "Courier New", Consolas, monospace;
    }

    /* ===== modal tiers ===== */
    .modal-section.tier-lead .example-block p { margin: 6px 0; }
    .modal-section.tier-lead .example-block p:first-child { margin-top: 0; }
    .modal-section.tier-lead .example-block p:last-child { margin-bottom: 0; }
    .modal-section.tier-lead .example-block pre { margin: 8px 0 0; }

    .modal-section.tier-graph .graph-row {
      display: flex;
      align-items: baseline;
      gap: 10px;
      padding: 6px 0;
      border-bottom: 1px dashed var(--border);
    }
    .modal-section.tier-graph .graph-row:last-child { border-bottom: none; }
    .modal-section.tier-graph .graph-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--text-muted);
      flex: 0 0 96px;
      padding-top: 2px;
      white-space: nowrap;
    }
    .modal-section.tier-graph .chip-row {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 6px;
      flex: 1;
    }
    .modal-section.tier-graph .chip-row .graph-note {
      font-size: 12.5px;
      color: var(--text-mid);
      font-style: italic;
    }

    .modal-footnotes {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .modal-footnotes .modal-section { margin-top: 0; }
    .modal-footnotes .modal-section h3 {
      font-size: 11px;
      letter-spacing: 1.5px;
      color: var(--text-muted);
    }
    .modal-footnotes .modal-section p,
    .modal-footnotes .modal-section li { font-size: 13px; }
    @media (max-width: 600px) {
      .modal-footnotes { grid-template-columns: 1fr; }
      .modal-section.tier-graph .graph-row { flex-direction: column; gap: 4px; }
      .modal-section.tier-graph .graph-label { flex: none; }
    }

    footer {
      border-top: 1px solid var(--border);
      padding: 24px 0;
      text-align: center;
      color: var(--text-muted);
      font-size: 13px;
    }
    footer p { margin: 4px 0; }
    footer a { color: var(--primary); text-decoration: none; }
    footer a:hover { text-decoration: underline; }

    /* Hidden helpers */
    [hidden] { display: none !important; }

    @media (max-width: 640px) {
      .site-header h1 { font-size: 24px; }
      .site-header .subtitle { font-size: 18px; }
      .controls-inner { flex-direction: column; align-items: stretch; }
      .phase-header { flex-direction: column; align-items: flex-start; }
      .skills-grid { grid-template-columns: 1fr; }
      .phase-minimap { padding: 10px 12px; }
      .phase-tile { min-width: 92px; padding: 6px 8px; }
      .phase-tile-name { font-size: 11px; }
      .accent-legend { padding: 0 16px; gap: 10px; font-size: 10px; margin-top: 14px; }
      .usage-modes-list { grid-template-columns: 1fr; gap: 12px; }
      .usage-modes-inner { padding: 14px 16px 16px; }
    }
  </style>
</head>
<body>
  <header class="site-header">
    <div class="container">
      <h1>ai-runbook-jh<span class="subtitle">: Skills Explorer</span></h1>
      <p class="tagline">Six phases. A skill for each move. Voice and security run through all of them.</p>
    </div>
  </header>

  <section class="usage-modes" aria-label="How to use this framework">
    <div class="usage-modes-inner">
      <h2 class="usage-modes-title">How you use the skills</h2>
      <ul class="usage-modes-list">
        <li><strong>Autonomous chain.</strong> An agent runs the phases end-to-end, invoking skills as their triggers fire. Minimal hand-driving.<div class="usage-mode-chat"><div class="usage-mode-chat-row" data-who="you"><span class="usage-mode-chat-who">You</span><span class="usage-mode-chat-msg">(paste the ticket body) Triage this and bring it to ready-for-estimation.</span></div><div class="usage-mode-chat-row" data-who="agent"><span class="usage-mode-chat-who">Agent</span><span class="usage-mode-chat-msg">Runs <code>triage</code> &rarr; <code>ticket-refinement</code> &rarr; <code>definition-of-done</code>, hands back a refined ticket to paste back into the tracker.</span></div></div></li>
        <li><strong>One-off.</strong> Pull a single skill when you want it. No chain, no agent in charge.<div class="usage-mode-chat"><div class="usage-mode-chat-row" data-who="you"><span class="usage-mode-chat-who">You</span><span class="usage-mode-chat-msg"><code>@check-tone</code> on this commit message.</span></div><div class="usage-mode-chat-row" data-who="agent"><span class="usage-mode-chat-who">Agent</span><span class="usage-mode-chat-msg">Runs only <code>check-tone</code>. Nothing before or after.</span></div></div></li>
        <li><strong>Mix.</strong> Agent drives some phases; you take the wheel for others. Most common in practice; freedom is the point.<div class="usage-mode-chat"><div class="usage-mode-chat-row" data-who="you"><span class="usage-mode-chat-who">You</span><span class="usage-mode-chat-msg">(write the plan by hand) Implement step 2 of <code>plans/NSF-13412-plan.md</code>.</span></div><div class="usage-mode-chat-row" data-who="agent"><span class="usage-mode-chat-who">Agent</span><span class="usage-mode-chat-msg">Runs Build skills against the plan.</span></div><div class="usage-mode-chat-row" data-who="you"><span class="usage-mode-chat-who">You</span><span class="usage-mode-chat-msg">Take back over for commits and the handoff.</span></div></div></li>
      </ul>
    </div>
  </section>

  <div class="controls">
    <div class="controls-inner">
      <input type="search" id="search" placeholder="Search skills by name, description, or content...">
    </div>
  </div>

  <nav class="phase-minimap" id="phase-minimap" aria-label="Phase navigation">
    <div class="phase-minimap-inner" id="phase-minimap-inner"></div>
  </nav>

  <div class="accent-legend" aria-label="Card accent legend">
    <span class="accent-legend-label">Card accents:</span>
    <span class="accent-legend-item" title="Invoked by other skills more than used alone."><span class="accent-legend-swatch" data-accent="foundation" aria-hidden="true"></span>Foundation</span>
    <span class="accent-legend-item" title="Runs alongside every phase. Voice gates prose; security gates sensitive data."><span class="accent-legend-swatch" data-accent="voice" aria-hidden="true"></span>Voice cross-cutting</span>
    <span class="accent-legend-item" title="Runs alongside every phase. Voice gates prose; security gates sensitive data."><span class="accent-legend-swatch" data-accent="security" aria-hidden="true"></span>Security cross-cutting</span>
    <span class="accent-legend-note"><strong>Foundation</strong>: called by other skills more than invoked directly. <strong>Cross-cutting</strong>: not tied to a phase. <code>check-tone</code> fires on anything written for an audience; <code>security-check</code> fires on anything touching secrets or sensitive data.</span>
  </div>

  <main class="container" id="main">
    <!-- phase sections rendered here -->
  </main>

  <div class="modal-backdrop" id="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal">
      <div class="modal-header">
        <h2 id="modal-title"></h2>
        <span id="modal-tags"></span>
        <button class="modal-close" id="modal-close" aria-label="Close">✕</button>
      </div>
      <nav id="modal-nav" class="modal-nav" hidden></nav>
      <div class="modal-body" id="modal-body"></div>
    </div>
  </div>

  <footer>
    <div class="container">
      <p>ai-runbook-jh: Skills Explorer</p>
      <p>
        <a href="../README.md">Canonical doc</a> ·
        <a href="../skills/">Skills directory</a> ·
        <a href="../diagrams/six-phase-flow.svg">One-pager</a> ·
        <a href="../decks/ai-runbook-jh.pptx">Deck</a>
      </p>
    </div>
  </footer>

  <script>
    const SKILLS = ${JSON.stringify(skills, null, 2)};
    const PHASES = ${JSON.stringify(PHASES, null, 2)};

    // ============ STATE ============
    let activeFilter = "all";
    let searchTerm = "";

    // ============ RENDER ============
    // Set of known skill slugs, used to linkify typicalNext references.
    const KNOWN_SKILLS = new Set(SKILLS.map(s => s.name));
    let modalOpener = null;

    // Extract up to \`limit\` unique known-skill slugs referenced inside backticks
    // within a typicalNext string. Preserves first-occurrence order.
    function extractNextSlugs(md, limit) {
      if (!md) return [];
      const cap = limit || 3;
      const out = [];
      const seen = new Set();
      const re = /\`([a-z][a-z0-9-]*)\`/g;
      let m;
      while ((m = re.exec(md)) !== null) {
        const slug = m[1];
        if (KNOWN_SKILLS.has(slug) && !seen.has(slug)) {
          seen.add(slug);
          out.push(slug);
          if (out.length >= cap) break;
        }
      }
      return out;
    }

    // Pre-pass: turn backtick-wrapped known-skill slugs into chip buttons.
    // Unknown backtick tokens fall through to the normal <code> renderer.
    function linkifyNextRefs(md) {
      if (!md) return md;
      return md.replace(/\`([a-z][a-z0-9-]*)\`/g, (full, slug) => {
        if (KNOWN_SKILLS.has(slug)) {
          return \`<button type="button" class="next-chip" data-skill="\${slug}">\${slug}</button>\`;
        }
        return full;
      });
    }

    function renderNextRow(skill) {
      const slugs = extractNextSlugs(skill.typicalNext, 3).filter(s => s !== skill.name);
      if (slugs.length === 0) return "";
      const chips = slugs.map(s =>
        \`<button type="button" class="next-chip" data-skill="\${s}" aria-label="Open skill: \${s}">\${s}</button>\`
      ).join("");
      return \`<div class="skill-card-nextrow"><span class="skill-card-nextrow-label">Next →</span>\${chips}</div>\`;
    }

    function renderSkillCard(skill) {
      const tags = [];
      if (skill.foundation) tags.push('<span class="tag tag-foundation">Foundation</span>');
      if (skill.crossCutting === "voice") tags.push('<span class="tag tag-voice">Voice</span>');
      if (skill.crossCutting === "security") tags.push('<span class="tag tag-security">Security</span>');
      const tagsHtml = tags.length ? \`<div class="skill-card-tags">\${tags.join("")}</div>\` : "";
      const nextRowHtml = renderNextRow(skill);

      // Card is a div+role=button so we can nest real <button> chips inside
      // without producing invalid nested-button HTML.
      return \`
        <div class="skill-card" role="button" tabindex="0" data-skill="\${skill.name}" data-cross="\${skill.crossCutting || ""}" data-foundation="\${skill.foundation ? "1" : ""}">
          <span class="skill-card-name">\${skill.name}</span>
          <span class="skill-card-desc">\${escapeHtml(skill.description)}</span>
          \${tagsHtml}
          \${nextRowHtml}
        </div>
      \`;
    }

    function renderPhaseSection(phase, skillsInPhase) {
      if (skillsInPhase.length === 0) return "";
      const badge = phase.num ? phase.num : "✦";
      const statePill = phase.id === "cross-cutting" ? "" : \`<span class="state-pill">\${phase.state}</span>\`;
      return \`
        <section class="phase-section" data-phase="\${phase.id}" data-section="\${phase.section}">
          <div class="phase-header">
            <span class="phase-badge">\${badge}</span>
            <div class="phase-header-text">
              <h2><span class="phase-icon" aria-hidden="true">\${phase.icon}</span><span>\${phase.name}</span></h2>
              <p>\${phase.desc}</p>
            </div>
            \${statePill}
          </div>
          <div class="skills-grid">
            \${skillsInPhase.map(renderSkillCard).join("")}
          </div>
        </section>
      \`;
    }

    function escapeHtml(s) {
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function filterSkills() {
      return SKILLS.filter(skill => {
        // filter chips
        if (activeFilter === "foundation" && !skill.foundation) return false;
        if (activeFilter !== "all" && activeFilter !== "foundation" && skill.phase !== activeFilter) return false;

        // search
        if (searchTerm) {
          const haystack = [skill.name, skill.description, skill.whenToUse, skill.approach, skill.related]
            .join(" ").toLowerCase();
          if (!haystack.includes(searchTerm.toLowerCase())) return false;
        }
        return true;
      });
    }

    function render() {
      const filtered = filterSkills();
      const main = document.getElementById("main");

      if (filtered.length === 0) {
        main.innerHTML = \`
          <div class="empty-state">
            <h3>No skills match your search.</h3>
            <p>Try a different keyword or clear the filter.</p>
          </div>
        \`;
        return;
      }

      // Group filtered skills by phase
      const html = PHASES.map(phase => {
        const skillsInPhase = filtered.filter(s => s.phase === phase.id);
        return renderPhaseSection(phase, skillsInPhase);
      }).join("");

      main.innerHTML = html;
      attachCardHandlers();
    }

    function updateCounts() {
      const el = document.getElementById("count-all");
      if (el) el.textContent = \`(\${SKILLS.length})\`;
    }

    // Count of skills per phase (computed once, used by the mini-map).
    function countSkillsInPhase(phaseId) {
      return SKILLS.filter(s => s.phase === phaseId).length;
    }

    // Render the phase mini-map strip: one tile per phase + an "All" tile.
    // Tiles mirror the active filter and act as both filter + scroll-to nav.
    function renderMiniMap() {
      const inner = document.getElementById("phase-minimap-inner");
      const allActive = activeFilter === "all" ? "active" : "";
      const tiles = [
        \`<button type="button" class="phase-tile \${allActive}" data-filter="all" data-section="all" aria-pressed="\${activeFilter === "all"}">
          <span class="phase-tile-badge">★</span>
          <span class="phase-tile-name">All</span>
          <span class="phase-tile-count">\${SKILLS.length} skills</span>
        </button>\`
      ];
      for (const phase of PHASES) {
        const count = countSkillsInPhase(phase.id);
        if (count === 0) continue;
        const active = activeFilter === phase.id ? "active" : "";
        const badge = phase.num ? String(phase.num) : "✦";
        tiles.push(\`
          <button type="button" class="phase-tile \${active}" data-filter="\${phase.id}" data-section="\${phase.section}" aria-pressed="\${activeFilter === phase.id}">
            <span class="phase-tile-badge">\${badge}</span>
            <span class="phase-tile-name">\${phase.name}</span>
            <span class="phase-tile-count">\${count} skill\${count === 1 ? "" : "s"}</span>
          </button>
        \`);
      }
      inner.innerHTML = tiles.join("");
      inner.querySelectorAll(".phase-tile").forEach(tile => {
        tile.addEventListener("click", () => {
          setActiveFilter(tile.dataset.filter, { scroll: true });
        });
      });
    }

    // Single source of truth for filter changes: syncs the filter chips,
    // the mini-map, re-renders the grid, and optionally scrolls the matching
    // phase section into view.
    function setActiveFilter(filter, opts) {
      activeFilter = filter;
      document.querySelectorAll(".filter-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.filter === filter);
      });
      render();
      renderMiniMap();
      if (opts && opts.scroll) {
        if (filter === "all" || filter === "foundation") {
          window.scrollTo({ top: document.getElementById("main").offsetTop - 80, behavior: "smooth" });
        } else {
          const section = document.querySelector(\`.phase-section[data-phase="\${filter}"]\`);
          if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }

    // ============ MODAL ============
    function mdToHtmlInline(md) {
      if (!md) return "";
      // 1) Extract fenced code blocks into placeholders so their internals
      // can't trip the block-level passes.
      const fences = [];
      let html = md.replace(/\`\`\`[a-z]*\\n([\\s\\S]*?)\`\`\`/g, (_, code) => {
        fences.push(\`<pre><code>\${escapeHtml(code)}</code></pre>\`);
        return \`@@FENCE\${fences.length - 1}@@\`;
      });
      // 2) Inline transforms
      html = html.replace(/\`([^\`]+)\`/g, (_, code) => \`<code>\${escapeHtml(code)}</code>\`);
      html = html.replace(/\\*\\*([^*]+)\\*\\*/g, "<strong>$1</strong>");
      html = html.replace(/(^|[^*])\\*([^*\\n]+)\\*/g, "$1<em>$2</em>");

      // 2.5) GFM tables: |a|b|\\n|---|---|\\n|x|y|...
      {
        const tLines = html.split("\\n");
        const tOut = [];
        const isRow = (ln) => /^\\s*\\|.+\\|\\s*$/.test(ln);
        const isSep = (ln) => /^\\s*\\|?[\\s\\-:|]+\\|[\\s\\-:|]+\\s*$/.test(ln) && /-/.test(ln);
        const cells = (ln) => ln.trim().replace(/^\\||\\|$/g, "").split("|").map(c => c.trim());
        let ti = 0;
        while (ti < tLines.length) {
          if (isRow(tLines[ti]) && ti + 1 < tLines.length && isSep(tLines[ti + 1])) {
            const header = cells(tLines[ti]);
            ti += 2;
            const rows = [];
            while (ti < tLines.length && isRow(tLines[ti])) {
              rows.push(cells(tLines[ti]));
              ti++;
            }
            const thead = "<thead><tr>" + header.map(c => \`<th>\${c}</th>\`).join("") + "</tr></thead>";
            const tbody = "<tbody>" + rows.map(r => "<tr>" + r.map(c => \`<td>\${c}</td>\`).join("") + "</tr>").join("") + "</tbody>";
            tOut.push(\`<table class="md-table">\${thead}\${tbody}</table>\`);
          } else {
            tOut.push(tLines[ti]);
            ti++;
          }
        }
        html = tOut.join("\\n");
      }

      // 3) Block-level pass with indent-aware nested lists + headings.
      const lines = html.split("\\n");
      const out = [];
      const stack = []; // { type: 'ul'|'ol', indent }
      let lastWasBlank = false;
      const closeTo = (indent) => {
        while (stack.length && stack[stack.length - 1].indent >= indent) {
          out.push(\`</\${stack.pop().type}>\`);
        }
      };
      for (const raw of lines) {
        const heading = raw.match(/^(#{2,6})\\s+(.+)$/);
        if (heading) {
          closeTo(-1);
          out.push(\`<h4>\${heading[2]}</h4>\`);
          lastWasBlank = false;
          continue;
        }
        const item = raw.match(/^(\\s*)([-*]|(\\d+)\\.)\\s+(.+)$/);
        if (item) {
          const indent = item[1].length;
          const isOl = /^\\d+\\./.test(item[2]);
          const type = isOl ? "ol" : "ul";
          const num = isOl ? parseInt(item[3], 10) : 0;
          while (stack.length && stack[stack.length - 1].indent > indent) {
            out.push(\`</\${stack.pop().type}>\`);
          }
          if (!stack.length || stack[stack.length - 1].indent < indent) {
            out.push(isOl && num > 1 ? \`<ol start="\${num}">\` : \`<\${type}>\`);
            stack.push({ type, indent });
          } else if (stack[stack.length - 1].type !== type) {
            out.push(\`</\${stack.pop().type}>\`);
            out.push(isOl && num > 1 ? \`<ol start="\${num}">\` : \`<\${type}>\`);
            stack.push({ type, indent });
          }
          out.push(\`<li>\${item[4]}</li>\`);
          lastWasBlank = false;
          continue;
        }
        if (raw.trim() === "") {
          out.push("");
          lastWasBlank = true;
          continue;
        }
        // Lazy continuation: a non-blank, non-list, non-heading line that follows
        // a list item with no blank between them is appended to the previous <li>.
        if (stack.length && !lastWasBlank) {
          const prevIdx = out.length - 1;
          const prev = out[prevIdx];
          if (prev && prev.endsWith("</li>")) {
            out[prevIdx] = prev.slice(0, -"</li>".length) + " " + raw.trim() + "</li>";
            continue;
          }
        }
        closeTo(-1);
        if (raw.startsWith("@@FENCE") || /^<(pre|table|div|h[1-6]|ul|ol|li|blockquote)\\b/i.test(raw)) {
          out.push(raw);
        } else {
          out.push(\`<p>\${raw}</p>\`);
        }
        lastWasBlank = false;
      }
      closeTo(-1);
      let result = out.join("\\n");
      // 4) Restore fenced code blocks.
      result = result.replace(/@@FENCE(\\d+)@@/g, (_, i) => fences[+i]);
      return result;
    }

    function openModal(skillName) {
      const skill = SKILLS.find(s => s.name === skillName);
      if (!skill) return;

      const tags = [];
      if (skill.foundation) tags.push('<span class="tag tag-foundation">Foundation</span>');
      if (skill.crossCutting === "voice") tags.push('<span class="tag tag-voice">Voice</span>');
      if (skill.crossCutting === "security") tags.push('<span class="tag tag-security">Security</span>');

      document.getElementById("modal-title").textContent = skill.name;
      document.getElementById("modal-tags").innerHTML = tags.join(" ");

      const sections = [];

      // ===== Tier 1: Lead =====
      if (skill.description) {
        sections.push(\`
          <div class="modal-section tier-lead" data-section="description">
            <h3>Description</h3>
            <p class="description">\${escapeHtml(skill.description)}</p>
          </div>
        \`);
      }
      if (skill.example) {
        sections.push(\`<div class="modal-section tier-lead" data-section="example"><h3>Example</h3><div class="example-block">\${mdToHtmlInline(skill.example)}</div></div>\`);
      }

      // ===== Tier 2: Reference =====
      if (skill.whenToUse) {
        sections.push(\`<div class="modal-section" data-section="when"><h3>When to Use</h3>\${mdToHtmlInline(skill.whenToUse)}</div>\`);
      }
      if (skill.approach) {
        sections.push(\`<div class="modal-section" data-section="approach"><h3>Approach</h3>\${mdToHtmlInline(skill.approach)}</div>\`);
      }
      if (skill.outputFormat) {
        const tpl = skill.outputFormat.trim();
        const outer = tpl.match(/^\`\`\`[a-z]*\\n([\\s\\S]*?)\`\`\`\\s*$/);
        const body = outer
          ? \`<pre><code>\${escapeHtml(outer[1])}</code></pre>\`
          : mdToHtmlInline(tpl);
        sections.push(\`<div class="modal-section" data-section="output"><h3>Output template</h3>\${body}</div>\`);
      }

      // ===== Tier 3: Skill graph (merged Called by + Typical Next + Related) =====
      const graphRows = [];
      // Called by (frontmatter invokedBy)
      const callers = (skill.invokedBy || "")
        .split(",").map(s => s.trim()).filter(s => KNOWN_SKILLS.has(s) && s !== skill.name);
      if (callers.length) {
        const chips = callers.map(s => \`<button type="button" class="next-chip" data-skill="\${s}">\${s}</button>\`).join("");
        graphRows.push(\`<div class="graph-row"><span class="graph-label">Called by</span><span class="chip-row">\${chips}</span></div>\`);
      }
      // Typical next (frontmatter typicalNext)
      const nextSlugs = extractNextSlugs(skill.typicalNext, 5).filter(s => s !== skill.name);
      if (nextSlugs.length) {
        const chips = nextSlugs.map(s => \`<button type="button" class="next-chip" data-skill="\${s}">\${s}</button>\`).join("");
        graphRows.push(\`<div class="graph-row"><span class="graph-label">Next</span><span class="chip-row">\${chips}</span></div>\`);
      }
      // Related (skills referenced anywhere in the ## Related Skills section, minus the two above)
      if (skill.related) {
        const dedupe = new Set([skill.name, ...callers, ...nextSlugs]);
        const relatedSlugs = [];
        const seen = new Set();
        const re = /\`([a-z][a-z0-9-]*)\`/g;
        let m;
        while ((m = re.exec(skill.related)) !== null) {
          const slug = m[1];
          if (KNOWN_SKILLS.has(slug) && !dedupe.has(slug) && !seen.has(slug)) {
            seen.add(slug);
            relatedSlugs.push(slug);
          }
        }
        if (relatedSlugs.length) {
          const chips = relatedSlugs.map(s => \`<button type="button" class="next-chip" data-skill="\${s}">\${s}</button>\`).join("");
          graphRows.push(\`<div class="graph-row"><span class="graph-label">Related</span><span class="chip-row">\${chips}</span></div>\`);
        }
      }
      if (graphRows.length) {
        sections.push(\`<div class="modal-section tier-graph" data-section="graph"><h3>Skill graph</h3>\${graphRows.join("")}</div>\`);
      }

      // ===== Tier 4: Footnotes (Voice + Security) =====
      const foot = [];
      if (skill.voice) {
        foot.push(\`<div class="modal-section tier-foot" data-section="voice"><h3>Voice</h3>\${mdToHtmlInline(skill.voice)}</div>\`);
      }
      if (skill.security) {
        foot.push(\`<div class="modal-section tier-foot" data-section="security"><h3>Security</h3>\${mdToHtmlInline(skill.security)}</div>\`);
      }
      if (foot.length) {
        sections.push(\`<div class="modal-footnotes">\${foot.join("")}</div>\`);
      }

      sections.push(\`<a class="modal-footer-link" href="../\${skill.filePath}">View SKILL.md →</a>\`);

      document.getElementById("modal-body").innerHTML = sections.join("");
      attachNextChipHandlers(document.getElementById("modal-body"));
      renderModalNav();
      document.getElementById("modal-backdrop").classList.add("open");
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        const closeBtn = document.querySelector(".modal-close");
        if (closeBtn) closeBtn.focus();
      });
    }

    function renderModalNav() {
      const body = document.getElementById("modal-body");
      const nav = document.getElementById("modal-nav");
      if (!body || !nav) return;
      const sections = body.querySelectorAll(".modal-section[data-section]");
      if (sections.length < 2) { nav.innerHTML = ""; nav.hidden = true; return; }
      const labels = { description:"Description", example:"Example", when:"When", approach:"Approach", output:"Output template", graph:"Graph", voice:"Voice", security:"Security" };
      const footnoteSlugs = new Set(["voice", "security"]);
      let sepInserted = false;
      const pills = Array.from(sections).map(sec => {
        const slug = sec.dataset.section;
        let prefix = "";
        if (!sepInserted && footnoteSlugs.has(slug)) {
          prefix = '<span class="modal-nav-sep" aria-hidden="true"></span>';
          sepInserted = true;
        }
        return \`\${prefix}<a class="modal-nav-pill" href="#" data-target="\${slug}">\${labels[slug] || slug}</a>\`;
      }).join("");
      nav.innerHTML = pills;
      nav.hidden = false;
      nav.querySelectorAll(".modal-nav-pill").forEach(pill => {
        pill.addEventListener("click", (e) => {
          e.preventDefault();
          const target = body.querySelector(\`.modal-section[data-section="\${pill.dataset.target}"]\`);
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    }

    function closeModal() {
      document.getElementById("modal-backdrop").classList.remove("open");
      document.body.style.overflow = "";
      if (modalOpener && typeof modalOpener.focus === "function") {
        modalOpener.focus();
      }
      modalOpener = null;
    }

    function attachCardHandlers() {
      document.querySelectorAll(".skill-card").forEach(card => {
        card.addEventListener("click", (e) => {
          if (e.target.closest(".next-chip")) return;
          modalOpener = card;
          openModal(card.dataset.skill);
        });
        card.addEventListener("keydown", (e) => {
          if (e.target.closest(".next-chip")) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            modalOpener = card;
            openModal(card.dataset.skill);
          }
        });
      });
      attachNextChipHandlers(document);
    }

    // Wire chip clicks within a given root (card grid or modal body).
    // Stops propagation so the parent card click handler doesn't fire.
    function attachNextChipHandlers(root) {
      root.querySelectorAll(".next-chip").forEach(chip => {
        chip.addEventListener("click", (e) => {
          e.stopPropagation();
          modalOpener = chip;
          openModal(chip.dataset.skill);
        });
      });
    }

    // ============ EVENT WIRING ============
    document.getElementById("search").addEventListener("input", (e) => {
      searchTerm = e.target.value.trim();
      render();
    });

    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        setActiveFilter(btn.dataset.filter, { scroll: false });
      });
    });

    document.getElementById("modal-close").addEventListener("click", closeModal);
    document.getElementById("modal-backdrop").addEventListener("click", (e) => {
      if (e.target.id === "modal-backdrop") closeModal();
    });
    document.addEventListener("keydown", (e) => {
      const open = document.getElementById("modal-backdrop").classList.contains("open");
      if (e.key === "Escape" && open) {
        closeModal();
        return;
      }
      // Trap Tab within the modal so keyboard users can't tab out into the
      // background page while the dialog is open.
      if (e.key === "Tab" && open) {
        const modal = document.querySelector(".modal");
        const focusables = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // ============ INIT ============
    updateCounts();
    render();
    renderMiniMap();
  </script>
</body>
</html>
`;

fs.writeFileSync(OUTPUT, html);
console.log(`Wrote ${OUTPUT} (${(html.length / 1024).toFixed(1)} KB)`);
