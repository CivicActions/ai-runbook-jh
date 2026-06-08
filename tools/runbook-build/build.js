// Copyright (c) 2026. Licensed under the MIT License.
// Builds the self-contained ai-runbook-jh AI runbook at runbook/index.html.
// Reads SKILL.md frontmatter + key sections, then renders against tokens
// from theme.js via the shared css.js emitter.

const fs = require("fs");
const path = require("path");
const { baseCss, FONTS_LINK, SVG, theme } = require("./css");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const SKILLS_DIR = path.join(REPO_ROOT, "skills");
const OUTPUT = path.join(REPO_ROOT, "runbook", "index.html");

// ============ PHASE MAP ============
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
  "drupal-peer-review":          { phase: "validate" },
  "summarize-commits":      { phase: "communicate" },
  "qa-steps":               { phase: "communicate" },
  "issue-closure-notes":    { phase: "communicate" },
  "lessons-learned":        { phase: "communicate" },
  "check-tone":             { phase: "cross-cutting", crossCutting: "voice",    foundation: true },
  "security-check":         { phase: "cross-cutting", crossCutting: "security", foundation: true },
};

const PHASES = [
  { id: "triage",        num: 1,    name: "Triage",        formal: "First touch. Keep, defer, decline. Minimum required fields, initial priority, reviewed tag.",       state: "New" },
  { id: "refinement",    num: 2,    name: "Refinement",    formal: "Prep for estimation. User story, acceptance criteria, dependencies, definition of done.",            state: "Refined ▸ Ready for Estimate" },
  { id: "plan",          num: 3,    name: "Plan",          formal: "Write the approach as a file before touching code. Generates the implementation-details checklist.", state: "Selected ▸ Building" },
  { id: "build",         num: 4,    name: "Build",         formal: "Implement against the plan. Pattern and simplicity checks. Handoffs carry state across chats.",      state: "Building" },
  { id: "validate",      num: 5,    name: "Validate",      formal: "Confirm it works. Browser, accessibility, responsiveness, performance, peer review.",                state: "Building" },
  { id: "communicate",   num: 6,    name: "Communicate",   formal: "Hand off and reflect. PR summary, QA steps, closure notes, lessons captured at handoff.",            state: "Review ▸ QA ▸ Done" },
  { id: "cross-cutting", num: null, name: "Cross-cutting", formal: "Not tied to a phase. check-tone fires on anything written for an audience; security-check fires on anything touching secrets or sensitive data.", state: "Always on" },
];

for (const p of PHASES) {
  p.gloss  = theme.phaseGloss[p.id] || "";
  p.thread = theme.phaseThreads[p.id] || "bark";
}

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

// Parse the Example section into a chat-style exchange.
// Skill examples consistently use:
//   **You ask:** `command`
//   **You get:** [optional preamble like "a file at `path`:"]
//   ```fenced output```
// Returns an array of {role, text, code?, lang?} turns, or null if the
// section doesn't fit the pattern (caller falls back to plain markdown).
function parseExampleAsChat(md) {
  if (!md || !/\*\*You ask:\*\*/i.test(md)) return null;

  const segments = [];
  const lines = md.split("\n");
  let i = 0;
  let buf = [];
  const flushParagraph = () => {
    const text = buf.join("\n").trim();
    if (text) segments.push({ type: "p", text });
    buf = [];
  };
  while (i < lines.length) {
    if (/^```/.test(lines[i])) {
      flushParagraph();
      const lang = lines[i].replace(/^```/, "").trim();
      i++;
      const code = [];
      while (i < lines.length && !/^```/.test(lines[i])) { code.push(lines[i]); i++; }
      i++; // closing fence
      segments.push({ type: "code", lang, text: code.join("\n") });
    } else if (lines[i].trim() === "") {
      flushParagraph();
      i++;
    } else {
      buf.push(lines[i]);
      i++;
    }
  }
  flushParagraph();

  const turns = [];
  let j = 0;
  while (j < segments.length) {
    const seg = segments[j];
    if (seg.type === "p") {
      const askMatch = seg.text.match(/^\*\*You ask:\*\*\s*([\s\S]+)$/i);
      const getMatch = seg.text.match(/^\*\*You get:\*\*\s*([\s\S]*)$/i);
      if (askMatch) {
        turns.push({ role: "ask", text: askMatch[1].trim() });
        j++; continue;
      }
      if (getMatch) {
        const preamble = getMatch[1].trim();
        const next = segments[j + 1];
        if (next && next.type === "code") {
          turns.push({ role: "get", text: preamble, code: next.text, lang: next.lang });
          j += 2; continue;
        }
        turns.push({ role: "get", text: preamble });
        j++; continue;
      }
      turns.push({ role: "note", text: seg.text });
      j++; continue;
    }
    if (seg.type === "code") {
      turns.push({ role: "get", text: "", code: seg.text, lang: seg.lang });
      j++; continue;
    }
    j++;
  }

  const hasAsk = turns.some(t => t.role === "ask");
  const hasGet = turns.some(t => t.role === "get");
  if (!hasAsk || !hasGet) return null;
  return turns;
}

// ============ COLLECT ============

const dirs = Object.keys(SKILL_META).filter(name => {
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
    typicalNext:  fm.typicalNext || extractSection(body, /^Typical Next$/i),
    invokedBy:    fm.invokedBy || "",
    whenToUse:    extractSection(body, /^When to Use$/i),
    approach:     extractSection(body, /^Approach$/i),
    outputFormat: extractSection(body, /^Output Format$/i),
    voice:        extractSection(body, /^Voice$/i),
    security:     extractSection(body, /^Security$/i),
    related:      extractSection(body, /^Related Skills$/i),
    example:      extractSection(body, /^Example$/i),
    filePath:     `https://github.com/CivicActions/ai-runbook-jh/blob/main/skills/${name}/SKILL.md`,
  };
});

// Enrich with parsed chat turns where the Example follows the ask/get pattern.
for (const s of skills) {
  s.exampleChat = parseExampleAsChat(s.example);
}

console.log(`Parsed ${skills.length} skills.`);

// ============ render helpers (server-side) ============

function renderSkillCard(skill) {
  const tags = [];
  if (skill.foundation) tags.push('<span class="tag tag-foundation">Foundation</span>');
  if (skill.crossCutting === "voice")    tags.push('<span class="tag tag-voice">Voice</span>');
  if (skill.crossCutting === "security") tags.push('<span class="tag tag-security">Security</span>');
  const tagsHtml = tags.length ? `<div class="meta">${tags.join("")}</div>` : "";

  const next = [];
  if (skill.typicalNext) {
    const seen = new Set();
    const re = /`([a-z][a-z0-9-]*)`/g;
    let m;
    while ((m = re.exec(skill.typicalNext)) !== null) {
      const slug = m[1];
      if (slug !== skill.name && !seen.has(slug) && Object.prototype.hasOwnProperty.call(SKILL_META, slug)) {
        seen.add(slug);
        next.push(slug);
      }
      if (next.length >= 3) break;
    }
  }
  const nextHtml = next.length
    ? `<div class="next-row"><span class="label">Next</span>${next.map(s => `<span class="next-chip is-static">${s}</span>`).join("")}</div>`
    : "";

  return `
    <button type="button" class="skill-card" data-skill="${skill.name}">
      <span class="name">${skill.name}</span>
      <span class="desc">${escapeHtml(skill.description)}</span>
      ${tagsHtml}
      ${nextHtml}
      <span class="open-hint">open full skill</span>
    </button>`;
}

function renderPhase(phase, skillsInPhase) {
  if (skillsInPhase.length === 0) return "";
  const isOpen = phase.id === "triage" ? "open" : "";
  const num = phase.num ? String(phase.num).padStart(2, "0") : "✦";
  return `
    <details class="phase" id="phase-${phase.id}" data-thread="${phase.thread}" ${isOpen}>
      <summary>
        <span class="num">${num}</span>
        ${SVG.leaf}
        <span class="phase-summary-text">
          <h2 class="name">${phase.name}</h2>
          <span class="summary-gloss">${escapeHtml(phase.gloss)}</span>
        </span>
      </summary>
      <p class="gloss-formal">${escapeHtml(phase.formal)}</p>
      <div class="skills-grid">
        ${skillsInPhase.map(renderSkillCard).join("")}
      </div>
    </details>`;
}

// ============ RENDER HTML ============

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ai-runbook-jh — skills</title>
  ${FONTS_LINK}
  <style>${baseCss()}</style>
</head>
<body>
  <a class="skip-link" href="#phases">Skip to skills</a>
  <header class="page-header container">
    <div class="page-header__main">
      <div class="title-wrap">
        <h1>How I work with AI.</h1>
        ${SVG.underline}
      </div>
      <p class="tagline">This is my AI runbook for taking a ticket from inbox to shipped: keep the writing clear and keep sensitive details out of chat.</p>
      <aside class="newcomer-note" aria-label="New to AI skills">
        <p><strong>New to AI skills?</strong> A "skill" is a short Markdown (text) file that tells an AI assistant how to do one specific job, like a checklist a coworker would follow for you. Reference one in your agent (<code>@triage</code>), paste it into a browser chat. Browse docs at <a href="https://agentskills.io/">agentskills.io</a>. If you can paste text into a chat window, you can use one.</p>
      </aside>
    </div>
    <aside class="page-header__rail" aria-label="At a glance">
      <a class="rail-stat" href="#phases">
        <span class="rail-stat__num">${String(skills.length).padStart(2, "0")}</span>
        <span class="rail-stat__label">skills</span>
      </a>
      <a class="rail-stat" href="#phases">
        <span class="rail-stat__num">${String(PHASES.filter(p => p.num).length).padStart(2, "0")}</span>
        <span class="rail-stat__label">phases</span>
      </a>
      <a class="rail-stat" href="#phase-cross-cutting">
        <span class="rail-stat__num">${String(skills.filter(s => s.phase === "cross-cutting").length).padStart(2, "0")}</span>
        <span class="rail-stat__label rail-stat__label--long">always-on gates<br>voice + security</span>
      </a>
    </aside>
  </header>

  <div class="container">
    <nav class="phaseflow" aria-label="Six-phase flow">
      <p class="phaseflow-lede">The six phases below are the lifecycle of a ticket, from creation to a change shipped, done, and explained.</p>
      <p class="phaseflow-caption" aria-hidden="true"><span class="num">01</span><span class="arrow">→</span><span class="num">02</span><span class="arrow">→</span><span class="num">03</span><span class="arrow">→</span><span class="num">04</span><span class="arrow">→</span><span class="num">05</span><span class="arrow">→</span><span class="num">06</span></p>
      <div class="phaseflow-row">
        ${PHASES.filter(p => p.num).map(p => `
          <a class="phaseflow-node" href="#phase-${p.id}">
            <span class="num">${String(p.num).padStart(2, "0")}</span>
            <span class="name">${p.name}</span>
            <span class="gloss">${escapeHtml(p.gloss)}</span>
          </a>
        `).join("")}
      </div>
      <div class="phaseflow-band">
        cross-cutting · run through every phase ·
        <a href="#phase-cross-cutting">voice</a><span class="sep">·</span><a href="#phase-cross-cutting">security</a>
      </div>
      <div class="phaseflow-band phaseflow-band-profiles">
        <span class="band-label">Project contracts:</span>
        <span class="band-text">Each skill reads a per-project contract for tracker, stack, voice, and DoD: same skill, different contract, different output</span>
        <span class="band-chips">
          <a href="../profiles/uswds.md"><code>uswds</code></a>
          <a href="../profiles/_template.md"><code>_template</code></a>
        </span>
      </div>
    </nav>

    ${SVG.wave}

    <main id="phases">
      <p class="accent-legend">
        <span class="accent-legend__intro">Skills are marked when they are foundational, voice-sensitive, or security-sensitive.</span>
        <span><span class="tag tag-foundation">Foundation</span> called by other skills more than invoked directly</span>
        <span><span class="tag tag-voice">Voice</span> fires on anything written for an audience</span>
        <span><span class="tag tag-security">Security</span> fires on anything touching secrets or sensitive data</span>
      </p>
      ${PHASES.map(phase => renderPhase(phase, skills.filter(s => s.phase === phase.id))).join("")}
    </main>

    ${SVG.wave}

    <section class="usage-modes" aria-label="How you use the skills">
      <h2 class="usage-modes-title">Three ways to drive the skills</h2>
      <p class="usage-modes-intro">There's no single "right" way to use these. Pick the mode that fits the work in front of you.</p>
      <ul class="usage-modes-list">
        <li class="usage-mode">
          <p class="usage-mode-head"><strong>Autonomous chain</strong>An agent runs the phases end-to-end, invoking skills as their triggers fire.</p>
          <div class="usage-mode-mini">
            <div class="usage-mode-row" data-who="you"><span class="usage-mode-who">you</span><span class="usage-mode-msg">(paste a ticket) triage this and bring it to ready-for-estimate.</span></div>
            <div class="usage-mode-row" data-who="ai"><span class="usage-mode-who">ai</span><span class="usage-mode-msg">runs <code>triage</code> → <code>ticket-refinement</code> → <code>definition-of-done</code>, hands back a refined ticket.</span></div>
          </div>
        </li>
        <li class="usage-mode">
          <p class="usage-mode-head"><strong>One-off</strong>Pull a single skill when you want it. No chain, no agent in charge.</p>
          <div class="usage-mode-mini">
            <div class="usage-mode-row" data-who="you"><span class="usage-mode-who">you</span><span class="usage-mode-msg"><code>@check-tone</code> on this commit message.</span></div>
            <div class="usage-mode-row" data-who="ai"><span class="usage-mode-who">ai</span><span class="usage-mode-msg">runs only <code>check-tone</code>. Nothing before or after.</span></div>
          </div>
        </li>
        <li class="usage-mode">
          <p class="usage-mode-head"><strong>Mix</strong>Agent drives some phases; you take the wheel for others. Most common in practice.</p>
          <div class="usage-mode-mini">
            <div class="usage-mode-row" data-who="you"><span class="usage-mode-who">you</span><span class="usage-mode-msg">(wrote the plan by hand) implement step 2 of <code>plans/PROJ-1234-plan.md</code>.</span></div>
            <div class="usage-mode-row" data-who="ai"><span class="usage-mode-who">ai</span><span class="usage-mode-msg">runs Build skills against the plan.</span></div>
            <div class="usage-mode-row" data-who="you"><span class="usage-mode-who">you</span><span class="usage-mode-msg">take back over for commits and the handoff.</span></div>
          </div>
        </li>
      </ul>
    </section>
  </div>

  <dialog class="modal-dialog" id="modal-dialog" aria-labelledby="modal-title">
    <div class="modal-inner">
      <div class="modal-header">
        <h2 id="modal-title"></h2>
        <span id="modal-tags"></span>
        <button type="button" class="modal-close" id="modal-close" aria-label="Close">close</button>
      </div>
      <nav id="modal-nav" class="modal-nav" aria-label="Skill section navigation" hidden></nav>
      <div class="modal-body" id="modal-body"></div>
    </div>
  </dialog>

  <footer class="colophon container">
    <p class="meta">
      <a href="https://github.com/civicactions/ai-runbook-jh">github</a> ·
      <a href="./index.html">AI runbook</a> ·
      <a href="./styleguide.html">styleguide</a> ·
      <a href="../diagrams/six-phase-flow.svg">one-pager</a>
    </p>
  </footer>

  <script>
    const SKILLS = ${JSON.stringify(skills)};
    const KNOWN_SKILLS = new Set(SKILLS.map(s => s.name));

    function escapeHtml(s) {
      return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
    }

    function extractNextSlugs(md, limit) {
      if (!md) return [];
      const cap = limit || 3;
      const out = []; const seen = new Set();
      const re = /\`([a-z][a-z0-9-]*)\`/g;
      let m;
      while ((m = re.exec(md)) !== null) {
        const slug = m[1];
        if (KNOWN_SKILLS.has(slug) && !seen.has(slug)) {
          seen.add(slug); out.push(slug);
          if (out.length >= cap) break;
        }
      }
      return out;
    }

    function mdToHtmlInline(md) {
      if (!md) return "";
      const fences = [];
      let html = md.replace(/\`\`\`[a-z]*\\n([\\s\\S]*?)\`\`\`/g, (_, code) => {
        fences.push(\`<pre><code>\${escapeHtml(code)}</code></pre>\`);
        return \`@@FENCE\${fences.length - 1}@@\`;
      });
      html = html.replace(/\`([^\`]+)\`/g, (_, code) => \`<code>\${escapeHtml(code)}</code>\`);
      html = html.replace(/\\*\\*([^*]+)\\*\\*/g, "<strong>$1</strong>");
      html = html.replace(/(^|[^*])\\*([^*\\n]+)\\*/g, "$1<em>$2</em>");

      {
        const tLines = html.split("\\n");
        const tOut = [];
        const isRow = (ln) => /^\\s*\\|.+\\|\\s*$/.test(ln);
        const isSep = (ln) => /^\\s*\\|?[\\s\\-:|]+\\|[\\s\\-:|]+\\s*$/.test(ln) && /-/.test(ln);
        const cells = (ln) => ln.trim().replace(/^\\||\\|$/g, "").split("|").map(c => c.trim());
        let ti = 0;
        while (ti < tLines.length) {
          if (isRow(tLines[ti]) && ti + 1 < tLines.length && isSep(tLines[ti + 1])) {
            const header = cells(tLines[ti]); ti += 2;
            const rows = [];
            while (ti < tLines.length && isRow(tLines[ti])) { rows.push(cells(tLines[ti])); ti++; }
            const thead = "<thead><tr>" + header.map(c => \`<th>\${c}</th>\`).join("") + "</tr></thead>";
            const tbody = "<tbody>" + rows.map(r => "<tr>" + r.map(c => \`<td>\${c}</td>\`).join("") + "</tr>").join("") + "</tbody>";
            tOut.push(\`<table class="md-table">\${thead}\${tbody}</table>\`);
          } else { tOut.push(tLines[ti]); ti++; }
        }
        html = tOut.join("\\n");
      }

      const lines = html.split("\\n");
      const out = [];
      const stack = [];
      let lastWasBlank = false;
      const closeTo = (indent) => {
        while (stack.length && stack[stack.length - 1].indent >= indent) {
          out.push(\`</\${stack.pop().type}>\`);
        }
      };
      for (const raw of lines) {
        const heading = raw.match(/^(#{2,6})\\s+(.+)$/);
        if (heading) { closeTo(-1); out.push(\`<h4>\${heading[2]}</h4>\`); lastWasBlank = false; continue; }
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
        if (raw.trim() === "") { out.push(""); lastWasBlank = true; continue; }
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
      result = result.replace(/@@FENCE(\\d+)@@/g, (_, i) => fences[+i]);
      return result;
    }

    // Render an example as a chat-style exchange of bubbles.
    // turns: [{role: 'ask'|'get'|'note', text, code?, lang?}]
    function renderChat(turns) {
      const parts = ['<div class="chat">'];
      for (const t of turns) {
        if (t.role === "ask") {
          parts.push(\`
            <div class="chat-turn chat-ask">
              <span class="chat-avatar" aria-hidden="true">you</span>
              <div class="chat-bubble">\${mdToHtmlInline(t.text)}</div>
            </div>\`);
        } else if (t.role === "get") {
          const preamble = t.text ? \`<div class="chat-preamble">\${mdToHtmlInline(t.text)}</div>\` : "";
          const isCode = t.lang && t.lang.length > 0;
          const body = t.code != null
            ? \`<div class="chat-output \${isCode ? 'is-code' : 'is-prose'}">\${escapeHtml(t.code)}</div>\`
            : "";
          parts.push(\`
            <div class="chat-turn chat-get">
              <span class="chat-avatar" aria-hidden="true">ai</span>
              <div class="chat-bubble">\${preamble}\${body}</div>
            </div>\`);
        } else {
          parts.push(\`<p class="chat-note">\${mdToHtmlInline(t.text)}</p>\`);
        }
      }
      parts.push("</div>");
      return parts.join("");
    }

    function openModal(skillName) {
      const skill = SKILLS.find(s => s.name === skillName);
      if (!skill) return;

      const tags = [];
      if (skill.foundation) tags.push('<span class="tag tag-foundation">Foundation</span>');
      if (skill.crossCutting === "voice")    tags.push('<span class="tag tag-voice">Voice</span>');
      if (skill.crossCutting === "security") tags.push('<span class="tag tag-security">Security</span>');

      document.getElementById("modal-title").textContent = skill.name;
      document.getElementById("modal-tags").innerHTML = tags.join(" ");

      const sections = [];

      if (skill.description) {
        sections.push(\`<div class="modal-section tier-lead" data-section="description"><h3>In one line</h3><p class="description">\${escapeHtml(skill.description)}</p></div>\`);
      }
      if (skill.exampleChat && skill.exampleChat.length) {
        sections.push(\`<div class="modal-section tier-lead" data-section="example"><h3>Example exchange</h3>\${renderChat(skill.exampleChat)}</div>\`);
      } else if (skill.example) {
        sections.push(\`<div class="modal-section tier-lead" data-section="example"><h3>Example</h3>\${mdToHtmlInline(skill.example)}</div>\`);
      }
      if (skill.whenToUse) {
        sections.push(\`<div class="modal-section" data-section="when"><h3>When to use</h3>\${mdToHtmlInline(skill.whenToUse)}</div>\`);
      }
      if (skill.approach) {
        sections.push(\`<div class="modal-section" data-section="approach"><h3>Approach</h3>\${mdToHtmlInline(skill.approach)}</div>\`);
      }
      if (skill.outputFormat) {
        const tpl = skill.outputFormat.trim();
        const outer = tpl.match(/^\`\`\`[a-z]*\\n([\\s\\S]*?)\`\`\`\\s*$/);
        const body = outer ? \`<pre><code>\${escapeHtml(outer[1])}</code></pre>\` : mdToHtmlInline(tpl);
        sections.push(\`<div class="modal-section" data-section="output"><h3>Output template</h3>\${body}</div>\`);
      }

      const graphRows = [];
      const callers = (skill.invokedBy || "").split(",").map(s => s.trim()).filter(s => KNOWN_SKILLS.has(s) && s !== skill.name);
      if (callers.length) {
        const chips = callers.map(s => \`<button type="button" class="next-chip" data-skill="\${s}">\${s}</button>\`).join("");
        graphRows.push(\`<div class="graph-row"><span class="graph-label">Called by</span><span class="chip-row">\${chips}</span></div>\`);
      }
      const nextSlugs = extractNextSlugs(skill.typicalNext, 5).filter(s => s !== skill.name);
      if (nextSlugs.length) {
        const chips = nextSlugs.map(s => \`<button type="button" class="next-chip" data-skill="\${s}">\${s}</button>\`).join("");
        graphRows.push(\`<div class="graph-row"><span class="graph-label">Next</span><span class="chip-row">\${chips}</span></div>\`);
      }
      if (skill.related) {
        const dedupe = new Set([skill.name, ...callers, ...nextSlugs]);
        const relatedSlugs = [];
        const seen = new Set();
        const re = /\`([a-z][a-z0-9-]*)\`/g;
        let m;
        while ((m = re.exec(skill.related)) !== null) {
          const slug = m[1];
          if (KNOWN_SKILLS.has(slug) && !dedupe.has(slug) && !seen.has(slug)) {
            seen.add(slug); relatedSlugs.push(slug);
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

      const foot = [];
      if (skill.voice)    foot.push(\`<div class="modal-section" data-section="voice"><h3>Voice</h3>\${mdToHtmlInline(skill.voice)}</div>\`);
      if (skill.security) foot.push(\`<div class="modal-section" data-section="security"><h3>Security</h3>\${mdToHtmlInline(skill.security)}</div>\`);
      if (foot.length) sections.push(\`<div class="modal-footnotes">\${foot.join("")}</div>\`);

      sections.push(\`<a class="modal-footer-link" href="\${skill.filePath}" target="_blank" rel="noopener">view SKILL.md →</a>\`);

      document.getElementById("modal-body").innerHTML = sections.join("");
      attachNextChipHandlers(document.getElementById("modal-body"));
      renderModalNav();
      const dlg = document.getElementById("modal-dialog");
      if (!dlg.open) dlg.showModal();
    }

    function renderModalNav() {
      const body = document.getElementById("modal-body");
      const nav = document.getElementById("modal-nav");
      if (!body || !nav) return;
      const sections = body.querySelectorAll(".modal-section[data-section]");
      if (sections.length < 2) { nav.innerHTML = ""; nav.hidden = true; return; }
      const labels = { description:"In one line", example:"Example", when:"When", approach:"Approach", output:"Output", graph:"Graph", voice:"Voice", security:"Security" };
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
      const dlg = document.getElementById("modal-dialog");
      if (dlg.open) dlg.close();
    }

    function attachCardHandlers() {
      document.querySelectorAll(".skill-card").forEach(card => {
        card.addEventListener("click", () => openModal(card.dataset.skill));
      });
      attachNextChipHandlers(document);
    }

    function attachNextChipHandlers(root) {
      root.querySelectorAll("button.next-chip").forEach(chip => {
        chip.addEventListener("click", (e) => {
          e.stopPropagation();
          openModal(chip.dataset.skill);
        });
      });
    }

    // Phase-flow + cross-cutting band: open the target details on click.
    document.querySelectorAll(".phaseflow a[href^='#']").forEach(link => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          if (target.tagName === "DETAILS") target.open = true;
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    document.getElementById("modal-close").addEventListener("click", closeModal);
    // Click outside the modal content (on the ::backdrop) closes the dialog.
    document.getElementById("modal-dialog").addEventListener("click", (e) => {
      if (e.target.id === "modal-dialog") closeModal();
    });
    // Defensive: ensure Escape closes the dialog in all contexts.
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const dlg = document.getElementById("modal-dialog");
      if (dlg && dlg.open) { e.preventDefault(); dlg.close(); }
    });

    attachCardHandlers();
  </script>
</body>
</html>
`;

fs.writeFileSync(OUTPUT, html);
console.log(`Wrote ${OUTPUT} (${(html.length / 1024).toFixed(1)} KB)`);
