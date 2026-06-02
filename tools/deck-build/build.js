// Copyright (c) 2026. Licensed under the MIT License.
const pptxgen = require("pptxgenjs");
const path = require("path");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 inches
pres.title = "ai-runbook-jh: AI-Assisted Ticket Workflow";

// ============ DESIGN TOKENS ============
const C = {
  navy: "0B2545",
  primary: "1A4480",
  primaryLight: "DBE9F7",
  preDevLight: "F0F7FC",
  voice: "54278F",
  voiceLight: "F5F0FA",
  security: "B50909",
  securityLight: "FAF0F0",
  gold: "FFBE2E",
  goldLight: "FFFBE8",
  textDark: "1B1B1B",
  textMid: "565C65",
  textMuted: "71767A",
  textOnDark: "FFFFFF",
  textOnDarkMuted: "AACDEC",
  textOnDarkSoft: "DBE9F7",
  borderLight: "E0E0E0",
  white: "FFFFFF",
};

const F = {
  header: "Trebuchet MS",
  body: "Calibri",
  code: "Courier New",
};

// ============ HELPERS ============
const TOTAL_SLIDES = 12;

function footer(slide, num) {
  slide.addText("ai-runbook-jh: AI-assisted ticket workflow", {
    x: 0.6, y: 7.1, w: 8, h: 0.3,
    fontSize: 10, fontFace: F.body, color: C.textMuted, margin: 0,
  });
  slide.addText(`${num} / ${TOTAL_SLIDES}`, {
    x: 12.5, y: 7.1, w: 0.7, h: 0.3,
    fontSize: 10, fontFace: F.body, color: C.textMuted,
    align: "right", margin: 0,
  });
}

function phaseBadge(slide, x, y, num, color = C.primary, size = 0.45) {
  slide.addShape(pres.shapes.OVAL, {
    x, y, w: size, h: size,
    fill: { color }, line: { type: "none" },
  });
  slide.addText(String(num), {
    x, y, w: size, h: size,
    fontSize: size < 0.4 ? 13 : 18, fontFace: F.header, bold: true,
    color: C.white, align: "center", valign: "middle", margin: 0,
  });
}

function slideTitle(slide, text, x = 0.6, y = 0.5) {
  slide.addText(text, {
    x, y, w: 12.1, h: 0.8,
    fontSize: 36, fontFace: F.header, bold: true,
    color: C.textDark, valign: "middle", margin: 0,
  });
}

function slideSubtitle(slide, text, x = 0.6, y = 1.25) {
  slide.addText(text, {
    x, y, w: 12.1, h: 0.5,
    fontSize: 16, fontFace: F.body, italic: true,
    color: C.textMid, valign: "middle", margin: 0,
  });
}

// ============ SLIDE 1: TITLE ============
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 7.5,
    fill: { color: C.gold }, line: { type: "none" },
  });

  s.addText("ai-runbook-jh", {
    x: 0.8, y: 1.8, w: 11.5, h: 1.2,
    fontSize: 60, fontFace: F.header, bold: true,
    color: C.textOnDark, margin: 0,
  });

  s.addText("An AI-Assisted Ticket Workflow", {
    x: 0.8, y: 3.05, w: 11.5, h: 0.7,
    fontSize: 32, fontFace: F.header,
    color: C.textOnDarkMuted, margin: 0,
  });

  s.addText("Six phases. A skill for each move. Voice and security run through all of them.", {
    x: 0.8, y: 4.1, w: 11.5, h: 0.5,
    fontSize: 17, fontFace: F.body, italic: true,
    color: C.textOnDarkSoft, margin: 0,
  });

  s.addText("ai-runbook-jh", {
    x: 0.8, y: 6.4, w: 6, h: 0.3,
    fontSize: 14, fontFace: F.body, bold: true,
    color: C.textOnDark, margin: 0,
  });
  s.addText("Framework v1 / May 2026", {
    x: 7, y: 6.4, w: 5.5, h: 0.3,
    fontSize: 14, fontFace: F.body,
    color: C.textOnDarkMuted, align: "right", margin: 0,
  });
}

// ============ SLIDE 2: WHY ============
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  slideTitle(s, "Why this exists");
  slideSubtitle(s, "Two failure modes this system catches.");

  const leftX = 0.6, leftW = 6.0, cardY = 2.1, cardH = 4.4;

  s.addShape(pres.shapes.RECTANGLE, {
    x: leftX, y: cardY, w: leftW, h: cardH,
    fill: { color: C.preDevLight }, line: { color: C.primary, width: 1 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: leftX, y: cardY, w: 0.1, h: cardH,
    fill: { color: C.primary }, line: { type: "none" },
  });
  s.addText("The same things get forgotten every ticket.", {
    x: leftX + 0.4, y: cardY + 0.3, w: leftW - 0.6, h: 0.6,
    fontSize: 18, fontFace: F.header, bold: true, color: C.textDark, margin: 0,
  });
  s.addText([
    { text: "Backstop ref shots after a visual change.", options: { bullet: true, breakLine: true } },
    { text: "Adjacent viewports after a viewport-specific fix.", options: { bullet: true, breakLine: true } },
    { text: "Stakeholder-readable Purpose field.", options: { bullet: true, breakLine: true } },
    { text: "Cypress for the regression case, not just the happy path.", options: { bullet: true, breakLine: true } },
    { text: "Linking the PR in the Jira ticket.", options: { bullet: true } },
  ], {
    x: leftX + 0.4, y: cardY + 1.1, w: leftW - 0.6, h: cardH - 1.4,
    fontSize: 14, fontFace: F.body, color: C.textMid,
    paraSpaceAfter: 6,
  });

  const rightX = 6.9, rightW = 6.0;
  s.addShape(pres.shapes.RECTANGLE, {
    x: rightX, y: cardY, w: rightW, h: cardH,
    fill: { color: C.preDevLight }, line: { color: C.primary, width: 1 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: rightX, y: cardY, w: 0.1, h: cardH,
    fill: { color: C.primary }, line: { type: "none" },
  });
  s.addText("Left alone, it's easy to overengineer.", {
    x: rightX + 0.4, y: cardY + 0.3, w: rightW - 0.6, h: 0.6,
    fontSize: 18, fontFace: F.header, bold: true, color: C.textDark, margin: 0,
  });
  s.addText([
    { text: "Custom SCSS mixin for a one-time use.", options: { bullet: true, breakLine: true } },
    { text: "Drupal.behaviors for trivial DOM work.", options: { bullet: true, breakLine: true } },
    { text: "A new SDC component where a content block fits.", options: { bullet: true, breakLine: true } },
    { text: "A Twig macro used in one place.", options: { bullet: true, breakLine: true } },
    { text: "A Cypress helper for a single assertion.", options: { bullet: true } },
  ], {
    x: rightX + 0.4, y: cardY + 1.1, w: rightW - 0.6, h: cardH - 1.4,
    fontSize: 14, fontFace: F.body, color: C.textMid,
    paraSpaceAfter: 6,
  });

  s.addText("Small checklists, run at the moments that matter.", {
    x: 0.6, y: 6.55, w: 12.1, h: 0.4,
    fontSize: 16, fontFace: F.body, italic: true, bold: true,
    color: C.primary, align: "center", margin: 0,
  });

  footer(s, 2);
}

// ============ SLIDE 3: SIX PHASES OVERVIEW ============
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  slideTitle(s, "The six phases");
  slideSubtitle(s, "Pre-development gets the ticket ready. Development is the work.");

  s.addText("PRE-DEVELOPMENT", {
    x: 0.6, y: 2.0, w: 4.4, h: 0.3,
    fontSize: 11, fontFace: F.body, bold: true, charSpacing: 3,
    color: C.textMuted, align: "center", margin: 0,
  });

  s.addText("DEVELOPMENT", {
    x: 5.4, y: 2.0, w: 7.5, h: 0.3,
    fontSize: 11, fontFace: F.body, bold: true, charSpacing: 3,
    color: C.primary, align: "center", margin: 0,
  });

  s.addShape(pres.shapes.LINE, {
    x: 5.25, y: 2.4, w: 0, h: 1.75,
    line: { color: C.textMuted, width: 1.5, dashType: "dash" },
  });

  // Six phases. Phase 6 wider to hold its 7 skills.
  // Phase number badges sit centered above titles so titles aren't visually shifted.
  const phases = [
    { num: 1, icon: "🔍", name: "Triage",        desc: "First touch",     x: 0.6,  w: 2.1,  isPreDev: true,  nameSize: 14 },
    { num: 2, icon: "📝", name: "Refinement",    desc: "Prep estimation", x: 2.8,  w: 2.1,  isPreDev: true,  nameSize: 14 },
    { num: 3, icon: "🗺️", name: "Plan",          desc: "Approach first",  x: 5.4,  w: 1.5,  nameSize: 14 },
    { num: 4, icon: "🔨", name: "Build",         desc: "Implement",       x: 7.0,  w: 1.5,  nameSize: 14 },
    { num: 5, icon: "✅", name: "Validate",      desc: "Confirm",         x: 8.6,  w: 1.5,  nameSize: 14 },
    { num: 6, icon: "📣", name: "Communicate",   desc: "Hand off, reflect",x: 10.2, w: 2.7, nameSize: 14 },
  ];

  phases.forEach(p => {
    const fillColor = p.isPreDev ? C.preDevLight : C.primaryLight;
    const cardY = 2.5, cardH = 1.6;
    s.addShape(pres.shapes.RECTANGLE, {
      x: p.x, y: cardY, w: p.w, h: cardH,
      fill: { color: fillColor }, line: { color: C.primary, width: p.isPreDev ? 1 : 1.5 },
    });
    // Small badge centered horizontally at top of card
    const badgeSize = 0.28;
    phaseBadge(s, p.x + (p.w - badgeSize) / 2, cardY + 0.1, p.num, C.primary, badgeSize);
    s.addText([
      { text: p.icon + "  ", options: { fontFace: F.body } },
      { text: p.name, options: { fontFace: F.header, bold: true } },
    ], {
      x: p.x + 0.05, y: cardY + 0.5, w: p.w - 0.1, h: 0.45,
      fontSize: p.nameSize,
      color: C.textDark, align: "center", valign: "middle", margin: 0,
    });
    s.addText(p.desc, {
      x: p.x + 0.05, y: cardY + 1.05, w: p.w - 0.1, h: 0.4,
      fontSize: 10, fontFace: F.body, italic: true,
      color: C.textMid, align: "center", margin: 0,
    });
  });

  // Jira status caption row
  s.addText("JIRA", {
    x: 0.1, y: 4.25, w: 0.5, h: 0.3,
    fontSize: 9, fontFace: F.body, bold: true, charSpacing: 2,
    color: C.textMuted, margin: 0,
  });
  const jiraCaptions = [
    { x: 0.6,  w: 2.1, text: "Open" },
    { x: 2.8,  w: 2.1, text: "Open : Ready for Est" },
    { x: 5.4,  w: 1.5, text: "Selected : In Progress" },
    { x: 7.0,  w: 1.5, text: "In Progress" },
    { x: 8.6,  w: 1.5, text: "In Progress" },
    { x: 10.2, w: 2.7, text: "Visual/UX QA  ▸  Code Review  ▸  QA  ▸  Done" },
  ];
  // Use arrow glyph instead of colon for first two
  jiraCaptions[1].text = "Open  ▸  Ready for Est";
  jiraCaptions[2].text = "Selected  ▸  In Progress";
  jiraCaptions.forEach(j => {
    s.addText(j.text, {
      x: j.x, y: 4.25, w: j.w, h: 0.3,
      fontSize: 10, fontFace: F.body, italic: true,
      color: C.textMid, align: "center", margin: 0,
    });
  });

  // Cross-cutting concerns
  const ccY = 4.95;
  // Voice
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: ccY, w: 5.95, h: 1.0,
    fill: { color: C.voiceLight }, line: { type: "none" },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: ccY, w: 0.08, h: 1.0,
    fill: { color: C.voice }, line: { type: "none" },
  });
  s.addText("VOICE", {
    x: 0.85, y: ccY + 0.1, w: 2, h: 0.35,
    fontSize: 13, fontFace: F.header, bold: true, charSpacing: 2,
    color: C.voice, margin: 0,
  });
  s.addText("Every phase produces prose. A project voice config keeps the system from reading like 24 writers.", {
    x: 0.85, y: ccY + 0.45, w: 5.5, h: 0.5,
    fontSize: 11, fontFace: F.body, color: C.textDark, margin: 0,
  });

  // Security
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.75, y: ccY, w: 5.95, h: 1.0,
    fill: { color: C.securityLight }, line: { type: "none" },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.75, y: ccY, w: 0.08, h: 1.0,
    fill: { color: C.security }, line: { type: "none" },
  });
  s.addText("SECURITY", {
    x: 7.0, y: ccY + 0.1, w: 2.2, h: 0.35,
    fontSize: 13, fontFace: F.header, bold: true, charSpacing: 2,
    color: C.security, margin: 0,
  });
  s.addText("Pre-flight gate. Sanctioned vs. sensitive. AI is a thinking partner, not an auth agent.", {
    x: 7.0, y: ccY + 0.45, w: 5.5, h: 0.5,
    fontSize: 11, fontFace: F.body, color: C.textDark, margin: 0,
  });

  // PM transition note
  s.addText("PM/Practice Area confirms priority and pulls to \"Selected for Development\" between Phase 2 and 3.", {
    x: 0.6, y: 6.25, w: 12.1, h: 0.3,
    fontSize: 10, fontFace: F.body, italic: true,
    color: C.textMuted, align: "center", margin: 0,
  });

  footer(s, 3);
}

// ============ SLIDE 4: PRE-DEVELOPMENT (Triage + Refinement) ============
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  slideTitle(s, "Pre-development: Triage & Refinement");
  slideSubtitle(s, "Get the ticket ready before anyone codes.");

  const cardY = 2.0, cardH = 4.6;

  // Triage card
  const tx = 0.6, tw = 6.0;
  s.addShape(pres.shapes.RECTANGLE, {
    x: tx, y: cardY, w: tw, h: cardH,
    fill: { color: C.preDevLight }, line: { color: C.primary, width: 1.5 },
  });
  phaseBadge(s, tx + 0.35, cardY + 0.35, 1);
  s.addText([
    { text: "🔍  ", options: { fontFace: F.body } },
    { text: "Triage", options: { fontFace: F.header, bold: true } },
  ], {
    x: tx + 1.0, y: cardY + 0.3, w: tw - 1.2, h: 0.55,
    fontSize: 26, color: C.textDark, margin: 0,
  });
  s.addText("First touch", {
    x: tx + 1.0, y: cardY + 0.85, w: tw - 1.2, h: 0.35,
    fontSize: 13, fontFace: F.body, italic: true, color: C.textMid, margin: 0,
  });
  s.addText([
    { text: "Keep / defer / decline", options: { bullet: true, breakLine: true, bold: true } },
    { text: "Fill the minimum required fields", options: { bullet: true, breakLine: true, bold: true } },
    { text: "Propose an initial priority", options: { bullet: true, breakLine: true, bold: true } },
    { text: "Tag with the project's review marker", options: { bullet: true, bold: true } },
  ], {
    x: tx + 0.4, y: cardY + 1.55, w: tw - 0.6, h: 2,
    fontSize: 14, fontFace: F.body, color: C.textDark,
    paraSpaceAfter: 6,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: tx + 0.4, y: cardY + 3.6, w: tw - 0.8, h: 0.7,
    fill: { color: C.white }, line: { color: C.primary, width: 1 },
  });
  s.addText([
    { text: "SKILL:  ", options: { fontFace: F.body, fontSize: 10, bold: true, color: C.textMuted } },
    { text: "triage", options: { fontFace: F.code, fontSize: 14, color: C.primary } },
  ], {
    x: tx + 0.6, y: cardY + 3.65, w: tw - 1.2, h: 0.6,
    valign: "middle", margin: 0,
  });

  // Refinement card
  const rx = 6.9, rw = 6.0;
  s.addShape(pres.shapes.RECTANGLE, {
    x: rx, y: cardY, w: rw, h: cardH,
    fill: { color: C.preDevLight }, line: { color: C.primary, width: 1.5 },
  });
  phaseBadge(s, rx + 0.35, cardY + 0.35, 2);
  s.addText([
    { text: "📝  ", options: { fontFace: F.body } },
    { text: "Refinement", options: { fontFace: F.header, bold: true } },
  ], {
    x: rx + 1.0, y: cardY + 0.3, w: rw - 1.2, h: 0.55,
    fontSize: 26, color: C.textDark, margin: 0,
  });
  s.addText("Prep for Estimation", {
    x: rx + 1.0, y: cardY + 0.85, w: rw - 1.2, h: 0.35,
    fontSize: 13, fontFace: F.body, italic: true, color: C.textMid, margin: 0,
  });
  s.addText([
    { text: "User story or What's-wrong / What-should-happen", options: { bullet: true, breakLine: true, bold: true } },
    { text: "Acceptance criteria (or steps to reproduce)", options: { bullet: true, breakLine: true, bold: true } },
    { text: "Dependencies, open questions, DoD", options: { bullet: true, breakLine: true, bold: true } },
    { text: "Implementation surface area (detail comes in Phase 3)", options: { bullet: true, bold: true } },
  ], {
    x: rx + 0.4, y: cardY + 1.55, w: rw - 0.6, h: 2,
    fontSize: 14, fontFace: F.body, color: C.textDark,
    paraSpaceAfter: 6,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: rx + 0.4, y: cardY + 3.6, w: rw - 0.8, h: 0.7,
    fill: { color: C.white }, line: { color: C.primary, width: 1 },
  });
  s.addText([
    { text: "SKILLS:  ", options: { fontFace: F.body, fontSize: 10, bold: true, color: C.textMuted } },
    { text: "ticket-refinement", options: { fontFace: F.code, fontSize: 12, color: C.primary } },
    { text: "  ·  ", options: { fontFace: F.body, fontSize: 12, color: C.textMid } },
    { text: "definition-of-done", options: { fontFace: F.code, fontSize: 12, color: C.primary } },
  ], {
    x: rx + 0.55, y: cardY + 3.65, w: rw - 1.1, h: 0.6,
    valign: "middle", margin: 0,
  });

  s.addText("PM/Practice Area confirms priority and pulls the ticket to \"Selected for Development\" before Phase 3.", {
    x: 0.6, y: 6.75, w: 12.1, h: 0.3,
    fontSize: 11, fontFace: F.body, italic: true,
    color: C.textMuted, align: "center", margin: 0,
  });

  footer(s, 4);
}

// ============ SLIDE 5: PLAN & BUILD ============
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  slideTitle(s, "Plan & Build");
  slideSubtitle(s, "Write the approach as a file before touching code. Then implement against it.");

  const cardY = 2.0, cardH = 4.6;

  const px = 0.6, pw = 6.0;
  s.addShape(pres.shapes.RECTANGLE, {
    x: px, y: cardY, w: pw, h: cardH,
    fill: { color: C.primaryLight }, line: { color: C.primary, width: 1.5 },
  });
  phaseBadge(s, px + 0.35, cardY + 0.35, 3);
  s.addText([
    { text: "🗺️  ", options: { fontFace: F.body } },
    { text: "Plan", options: { fontFace: F.header, bold: true } },
  ], {
    x: px + 1.0, y: cardY + 0.3, w: pw - 1.2, h: 0.55,
    fontSize: 26, color: C.textDark, margin: 0,
  });
  s.addText("File before code", {
    x: px + 1.0, y: cardY + 0.85, w: pw - 1.2, h: 0.35,
    fontSize: 13, fontFace: F.body, italic: true, color: C.textMid, margin: 0,
  });
  s.addText([
    { text: "Plan file in .agents/plans/[TICKET]-plan.md", options: { bullet: true, breakLine: true, bold: true } },
    { text: "Goal, scope, dependencies", options: { bullet: true, breakLine: true } },
    { text: "Generates the implementation-details checklist", options: { bullet: true, breakLine: true, bold: true } },
    { text: "Risks, complexity, branch name", options: { bullet: true } },
  ], {
    x: px + 0.4, y: cardY + 1.55, w: pw - 0.6, h: 2,
    fontSize: 13, fontFace: F.body, color: C.textDark,
    paraSpaceAfter: 5,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: px + 0.4, y: cardY + 3.6, w: pw - 0.8, h: 0.7,
    fill: { color: C.white }, line: { color: C.primary, width: 1 },
  });
  s.addText([
    { text: "SKILLS:  ", options: { fontFace: F.body, fontSize: 10, bold: true, color: C.textMuted } },
    { text: "issue-plan", options: { fontFace: F.code, fontSize: 13, color: C.primary } },
    { text: "  ·  ", options: { fontFace: F.body, fontSize: 13, color: C.textMid } },
    { text: "implementation-details", options: { fontFace: F.code, fontSize: 13, color: C.primary } },
  ], {
    x: px + 0.55, y: cardY + 3.65, w: pw - 1.1, h: 0.6,
    valign: "middle", margin: 0,
  });

  const bx = 6.9, bw = 6.0;
  s.addShape(pres.shapes.RECTANGLE, {
    x: bx, y: cardY, w: bw, h: cardH,
    fill: { color: C.primaryLight }, line: { color: C.primary, width: 1.5 },
  });
  phaseBadge(s, bx + 0.35, cardY + 0.35, 4);
  s.addText([
    { text: "🔨  ", options: { fontFace: F.body } },
    { text: "Build", options: { fontFace: F.header, bold: true } },
  ], {
    x: bx + 1.0, y: cardY + 0.3, w: bw - 1.2, h: 0.55,
    fontSize: 26, color: C.textDark, margin: 0,
  });
  s.addText("Implement the plan", {
    x: bx + 1.0, y: cardY + 0.85, w: bw - 1.2, h: 0.35,
    fontSize: 13, fontFace: F.body, italic: true, color: C.textMid, margin: 0,
  });
  s.addText([
    { text: "Pattern-alignment and KISS checks while writing", options: { bullet: true, breakLine: true, bold: true } },
    { text: "Design check when introducing new components", options: { bullet: true, breakLine: true } },
    { text: "Mid-session handoffs carry state across chats", options: { bullet: true, breakLine: true, bold: true } },
    { text: "Clean commits before handoff (organize, squash, message)", options: { bullet: true } },
  ], {
    x: bx + 0.4, y: cardY + 1.55, w: bw - 0.6, h: 2,
    fontSize: 13, fontFace: F.body, color: C.textDark,
    paraSpaceAfter: 5,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: bx + 0.4, y: cardY + 3.4, w: bw - 0.8, h: 0.95,
    fill: { color: C.white }, line: { color: C.primary, width: 1 },
  });
  s.addText("SKILLS", {
    x: bx + 0.55, y: cardY + 3.45, w: bw - 1.1, h: 0.25,
    fontSize: 9, fontFace: F.body, bold: true, charSpacing: 2,
    color: C.textMuted, margin: 0,
  });
  s.addText([
    { text: "pattern-alignment", options: { fontFace: F.code, fontSize: 10.5, color: C.primary } },
    { text: "  ", options: { fontFace: F.body, fontSize: 10.5, color: C.textMid } },
    { text: "component-design", options: { fontFace: F.code, fontSize: 10.5, color: C.primary } },
    { text: "  ", options: { fontFace: F.body, fontSize: 10.5, color: C.textMid } },
    { text: "kiss", options: { fontFace: F.code, fontSize: 10.5, color: C.primary } },
    { text: "  ", options: { fontFace: F.body, fontSize: 10.5, color: C.textMid } },
    { text: "handoff-message", options: { fontFace: F.code, fontSize: 10.5, color: C.primary, breakLine: true } },
    { text: "organize-commits", options: { fontFace: F.code, fontSize: 10.5, color: C.primary } },
    { text: "  ", options: { fontFace: F.body, fontSize: 10.5, color: C.textMid } },
    { text: "squash-commits", options: { fontFace: F.code, fontSize: 10.5, color: C.primary } },
    { text: "  ", options: { fontFace: F.body, fontSize: 10.5, color: C.textMid } },
    { text: "commit-message-writer", options: { fontFace: F.code, fontSize: 10.5, color: C.primary } },
  ], {
    x: bx + 0.55, y: cardY + 3.7, w: bw - 1.1, h: 0.65,
    valign: "top", margin: 0,
  });

  footer(s, 5);
}

// ============ SLIDE 6: VALIDATE & COMMUNICATE ============
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  slideTitle(s, "Validate & Communicate");
  slideSubtitle(s, "Confirm the change yourself. Then hand it off cleanly and capture what you learned.");

  const cardY = 2.0, cardH = 4.6;

  // Validate card
  const vx = 0.6, vw = 6.0;
  s.addShape(pres.shapes.RECTANGLE, {
    x: vx, y: cardY, w: vw, h: cardH,
    fill: { color: C.primaryLight }, line: { color: C.primary, width: 1.5 },
  });
  phaseBadge(s, vx + 0.35, cardY + 0.35, 5);
  s.addText([
    { text: "✅  ", options: { fontFace: F.body } },
    { text: "Validate", options: { fontFace: F.header, bold: true } },
  ], {
    x: vx + 1.0, y: cardY + 0.3, w: vw - 1.2, h: 0.55,
    fontSize: 26, color: C.textDark, margin: 0,
  });
  s.addText("Confirm it works (still In Progress)", {
    x: vx + 1.0, y: cardY + 0.85, w: vw - 1.2, h: 0.35,
    fontSize: 13, fontFace: F.body, italic: true, color: C.textMid, margin: 0,
  });
  s.addText([
    { text: "browser-check is the foundation", options: { bullet: true, breakLine: true, bold: true } },
    { text: "Then a11y, responsive, performance", options: { bullet: true, breakLine: true } },
    { text: "Then peer review (FE and BE)", options: { bullet: true, breakLine: true } },
    { text: "All engineer-side. Ticket stays In Progress.", options: { bullet: true } },
  ], {
    x: vx + 0.4, y: cardY + 1.55, w: vw - 0.6, h: 2,
    fontSize: 13, fontFace: F.body, color: C.textDark,
    paraSpaceAfter: 5,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: vx + 0.4, y: cardY + 3.4, w: vw - 0.8, h: 0.95,
    fill: { color: C.white }, line: { color: C.primary, width: 1 },
  });
  s.addText("SKILLS", {
    x: vx + 0.55, y: cardY + 3.45, w: vw - 1.1, h: 0.25,
    fontSize: 9, fontFace: F.body, bold: true, charSpacing: 2,
    color: C.textMuted, margin: 0,
  });
  s.addText([
    { text: "browser-check", options: { fontFace: F.code, fontSize: 10.5, color: C.primary } },
    { text: "  ", options: { fontFace: F.body, fontSize: 10.5, color: C.textMid } },
    { text: "accessibility-audit", options: { fontFace: F.code, fontSize: 10.5, color: C.primary } },
    { text: "  ", options: { fontFace: F.body, fontSize: 10.5, color: C.textMid } },
    { text: "responsive-design", options: { fontFace: F.code, fontSize: 10.5, color: C.primary, breakLine: true } },
    { text: "performance-frontend", options: { fontFace: F.code, fontSize: 10.5, color: C.primary } },
    { text: "  ", options: { fontFace: F.body, fontSize: 10.5, color: C.textMid } },
    { text: "frontend-peer-review", options: { fontFace: F.code, fontSize: 10.5, color: C.primary } },
    { text: "  ", options: { fontFace: F.body, fontSize: 10.5, color: C.textMid } },
    { text: "drupal-critic", options: { fontFace: F.code, fontSize: 10.5, color: C.primary } },
  ], {
    x: vx + 0.55, y: cardY + 3.7, w: vw - 1.1, h: 0.65,
    valign: "top", margin: 0,
  });

  // Communicate card
  const cx = 6.9, cw = 6.0;
  s.addShape(pres.shapes.RECTANGLE, {
    x: cx, y: cardY, w: cw, h: cardH,
    fill: { color: C.primaryLight }, line: { color: C.primary, width: 1.5 },
  });
  phaseBadge(s, cx + 0.35, cardY + 0.35, 6);
  s.addText([
    { text: "📣  ", options: { fontFace: F.body } },
    { text: "Communicate", options: { fontFace: F.header, bold: true } },
  ], {
    x: cx + 1.0, y: cardY + 0.3, w: cw - 1.2, h: 0.55,
    fontSize: 26, color: C.textDark, margin: 0,
  });
  s.addText("Hand off, reflect, move on", {
    x: cx + 1.0, y: cardY + 0.85, w: cw - 1.2, h: 0.35,
    fontSize: 13, fontFace: F.body, italic: true, color: C.textMid, margin: 0,
  });
  s.addText([
    { text: "Summarize commits for the PR description", options: { bullet: true, breakLine: true, bold: true } },
    { text: "QA steps for review handoff", options: { bullet: true, breakLine: true } },
    { text: "Closure notes (pre-review) and lessons captured", options: { bullet: true, breakLine: true, bold: true } },
    { text: "Ticket moves through visual/UX QA, code review, QA, done", options: { bullet: true } },
  ], {
    x: cx + 0.4, y: cardY + 1.55, w: cw - 0.6, h: 2,
    fontSize: 13, fontFace: F.body, color: C.textDark,
    paraSpaceAfter: 5,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: cx + 0.4, y: cardY + 3.4, w: cw - 0.8, h: 0.95,
    fill: { color: C.white }, line: { color: C.primary, width: 1 },
  });
  s.addText("SKILLS", {
    x: cx + 0.55, y: cardY + 3.45, w: cw - 1.1, h: 0.25,
    fontSize: 9, fontFace: F.body, bold: true, charSpacing: 2,
    color: C.textMuted, margin: 0,
  });
  s.addText([
    { text: "summarize-commits", options: { fontFace: F.code, fontSize: 11, color: C.primary } },
    { text: "  ", options: { fontFace: F.body, fontSize: 11, color: C.textMid } },
    { text: "qa-steps", options: { fontFace: F.code, fontSize: 11, color: C.primary } },
    { text: "  ", options: { fontFace: F.body, fontSize: 11, color: C.textMid } },
    { text: "issue-closure-notes", options: { fontFace: F.code, fontSize: 11, color: C.primary } },
    { text: "  ", options: { fontFace: F.body, fontSize: 11, color: C.textMid } },
    { text: "lessons-learned", options: { fontFace: F.code, fontSize: 11, color: C.primary } },
  ], {
    x: cx + 0.55, y: cardY + 3.7, w: cw - 1.1, h: 0.65,
    valign: "top", margin: 0,
  });

  footer(s, 6);
}

// ============ SLIDE 7: VOICE ============
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.4, h: 7.5,
    fill: { color: C.voice }, line: { type: "none" },
  });

  slideTitle(s, "Voice: the keystone", 0.7);

  s.addText("Every phase produces prose. Without a project voice config, output reads like a different writer each time.", {
    x: 0.7, y: 1.4, w: 12.1, h: 0.8,
    fontSize: 20, fontFace: F.body,
    color: C.textDark, margin: 0,
  });

  // Three stacked sub-blocks across the slide
  const blockY = 2.7, blockH = 3.4, blockW = 4.0, gap = 0.15;
  const blockX0 = 0.7;

  const blocks = [
    {
      label: "THE CONFIG",
      body: [
        { text: ".agents/style/voice.md", options: { bold: true, fontFace: F.code, breakLine: true } },
        { text: " ", options: { breakLine: true, fontSize: 6 } },
        { text: "At your project root. Defines tone, register, cadence, what to avoid. Every skill loads it before generating.", options: {} },
      ],
    },
    {
      label: "THE GATE",
      body: [
        { text: "check-tone", options: { bold: true, fontFace: F.code, breakLine: true } },
        { text: " ", options: { breakLine: true, fontSize: 6 } },
        { text: "Runs any draft through the voice config before publishing. Flags passive voice, hedging, drift.", options: {} },
      ],
    },
    {
      label: "PER PROJECT",
      body: [
        { text: "No default ships.", options: { bold: true, breakLine: true } },
        { text: " ", options: { breakLine: true, fontSize: 6 } },
        { text: "You author voice.md per project so the system writes the way that project writes, not the framework default.", options: {} },
      ],
    },
  ];

  blocks.forEach((b, i) => {
    const x = blockX0 + i * (blockW + gap);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: blockY, w: blockW, h: blockH,
      fill: { color: C.voiceLight }, line: { type: "none" },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: blockY, w: blockW, h: 0.08,
      fill: { color: C.voice }, line: { type: "none" },
    });
    s.addText(b.label, {
      x: x + 0.3, y: blockY + 0.25, w: blockW - 0.6, h: 0.4,
      fontSize: 12, fontFace: F.body, bold: true, charSpacing: 3,
      color: C.voice, margin: 0,
    });
    s.addText(b.body, {
      x: x + 0.3, y: blockY + 0.75, w: blockW - 0.6, h: blockH - 1.0,
      fontSize: 14, fontFace: F.body, color: C.textDark, margin: 0,
      valign: "top",
    });
  });

  footer(s, 7);
}

// ============ SLIDE 8: SECURITY ============
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.4, h: 7.5,
    fill: { color: C.security }, line: { type: "none" },
  });

  slideTitle(s, "Security posture", 0.7);
  s.addText("Aligned to the CivicActions AI Usage Policy and the NIST AI Risk Management Framework.", {
    x: 0.7, y: 1.3, w: 12.1, h: 0.4,
    fontSize: 14, fontFace: F.body, italic: true,
    color: C.textMid, margin: 0,
  });

  const ldx = 0.7, ldy = 2.0, ldw = 6.0;
  s.addShape(pres.shapes.RECTANGLE, {
    x: ldx, y: ldy, w: ldw, h: 4.6,
    fill: { color: C.securityLight }, line: { color: C.security, width: 1 },
  });
  s.addText("What AI does NOT do", {
    x: ldx + 0.3, y: ldy + 0.2, w: ldw - 0.6, h: 0.5,
    fontSize: 18, fontFace: F.header, bold: true, color: C.security, margin: 0,
  });
  s.addText([
    { text: "Authenticate to any environment", options: { bullet: true, bold: true, breakLine: true } },
    { text: "    no one-time login URLs, no SSH keys, no SAML tokens", options: { italic: true, color: C.textMid, fontSize: 11, breakLine: true } },
    { text: " ", options: { breakLine: true, fontSize: 4 } },
    { text: "Access higher environments (stage, prod, etc.)", options: { bullet: true, bold: true, breakLine: true } },
    { text: "    on your behalf. That's a human action.", options: { italic: true, color: C.textMid, fontSize: 11, breakLine: true } },
    { text: " ", options: { breakLine: true, fontSize: 4 } },
    { text: "Ingest PII, PHI, CUI, client proprietary, or CA confidential", options: { bullet: true, bold: true, breakLine: true } },
    { text: "    content. security-check is the pre-flight gate.", options: { italic: true, color: C.textMid, fontSize: 11, breakLine: true } },
    { text: " ", options: { breakLine: true, fontSize: 4 } },
    { text: "Ship code or take agentic actions", options: { bullet: true, bold: true, breakLine: true } },
    { text: "    every output is a draft for human review", options: { italic: true, color: C.textMid, fontSize: 11 } },
  ], {
    x: ldx + 0.3, y: ldy + 0.8, w: ldw - 0.6, h: 3.6,
    fontSize: 12, fontFace: F.body, color: C.textDark,
    paraSpaceAfter: 2,
  });

  const rdx = 7.0, rdw = 5.8;
  s.addText("Sanctioned vs. sensitive", {
    x: rdx, y: 2.0, w: rdw, h: 0.5,
    fontSize: 18, fontFace: F.header, bold: true, color: C.security, margin: 0,
  });
  s.addText("Not 'public vs. private'. Most of what we work with is private but client-approved.", {
    x: rdx, y: 2.5, w: rdw, h: 0.5,
    fontSize: 12, fontFace: F.body, italic: true,
    color: C.textMid, margin: 0,
  });

  s.addText("SANCTIONED", {
    x: rdx, y: 3.1, w: 2.7, h: 0.3,
    fontSize: 11, fontFace: F.body, bold: true, charSpacing: 2,
    color: C.primary, margin: 0,
  });
  s.addText([
    { text: "The project codebase", options: { breakLine: true } },
    { text: "Confluence + Jira", options: { breakLine: true } },
    { text: "Internal team docs", options: { breakLine: true } },
    { text: "Public refs and libraries", options: {} },
  ], {
    x: rdx, y: 3.4, w: 2.7, h: 1.5,
    fontSize: 12, fontFace: F.body, color: C.textDark,
  });

  s.addText("SENSITIVE", {
    x: rdx + 3.0, y: 3.1, w: 2.8, h: 0.3,
    fontSize: 11, fontFace: F.body, bold: true, charSpacing: 2,
    color: C.security, margin: 0,
  });
  s.addText([
    { text: "PII, PHI, CUI", options: { breakLine: true } },
    { text: "Credentials, tokens", options: { breakLine: true } },
    { text: "Client proprietary data", options: { breakLine: true } },
    { text: "CA confidential", options: {} },
  ], {
    x: rdx + 3.0, y: 3.4, w: 2.8, h: 1.5,
    fontSize: 12, fontFace: F.body, color: C.textDark,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: rdx, y: 5.0, w: rdw, h: 1.6,
    fill: { color: C.preDevLight }, line: { color: C.primary, width: 1 },
  });
  s.addText("Sanctioned AI is per-project", {
    x: rdx + 0.2, y: 5.1, w: rdw - 0.4, h: 0.4,
    fontSize: 13, fontFace: F.header, bold: true, color: C.primary, margin: 0,
  });
  s.addText([
    { text: "Which tools are approved depends on the client. ", options: {} },
    { text: "Read the profile's Sanctioned AI section", options: { bold: true } },
    { text: " before using any AI client on project work.", options: {} },
  ], {
    x: rdx + 0.2, y: 5.5, w: rdw - 0.4, h: 0.7,
    fontSize: 11, fontFace: F.body, color: C.textDark, margin: 0,
  });
  s.addText("Skills are portable across clients; the profile names what's allowed.", {
    x: rdx + 0.2, y: 6.25, w: rdw - 0.4, h: 0.3,
    fontSize: 10, fontFace: F.body, italic: true, color: C.textMid, margin: 0,
  });

  footer(s, 8);
}

// ============ SLIDE 9: THE REAL FLOW ============
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addText("What this looks like in practice", {
    x: 0.6, y: 0.5, w: 12.1, h: 0.8,
    fontSize: 36, fontFace: F.header, bold: true,
    color: C.textOnDark, valign: "middle", margin: 0,
  });
  s.addText("The six phases are not strictly linear. The real flow has loops.", {
    x: 0.6, y: 1.25, w: 12.1, h: 0.5,
    fontSize: 16, fontFace: F.body, italic: true,
    color: C.textOnDarkMuted, margin: 0,
  });

  const startY = 2.05, rowH = 1.25, gap = 0.15;

  const c1 = "F9E795";
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: startY, w: 0.1, h: rowH,
    fill: { color: c1 }, line: { type: "none" },
  });
  s.addText("Iteration within a phase", {
    x: 0.9, y: startY, w: 11.8, h: 0.4,
    fontSize: 16, fontFace: F.header, bold: true,
    color: C.textOnDark, margin: 0,
  });
  s.addText([
    { text: "In Build: write a chunk, run ", options: {} },
    { text: "pattern-alignment", options: { fontFace: F.code } },
    { text: ", run ", options: {} },
    { text: "kiss", options: { fontFace: F.code } },
    { text: ", fix, repeat. Skills aren't one-shot. You iterate between them as the work develops.", options: {} },
  ], {
    x: 0.9, y: startY + 0.45, w: 11.8, h: 0.75,
    fontSize: 13, fontFace: F.body, color: C.textOnDarkSoft, margin: 0,
  });

  const c2 = "DBE9F7";
  const y2 = startY + rowH + gap;
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: y2, w: 0.1, h: rowH,
    fill: { color: c2 }, line: { type: "none" },
  });
  s.addText("Chat handoffs when sessions run long", {
    x: 0.9, y: y2, w: 11.8, h: 0.4,
    fontSize: 16, fontFace: F.header, bold: true,
    color: C.textOnDark, margin: 0,
  });
  s.addText([
    { text: "Long AI sessions degrade. Before context drifts, run ", options: {} },
    { text: "handoff-message", options: { fontFace: F.code, bold: true } },
    { text: ", open a fresh chat, paste the handoff. Same ticket, clean state.", options: {} },
  ], {
    x: 0.9, y: y2 + 0.45, w: 11.8, h: 0.75,
    fontSize: 13, fontFace: F.body, color: C.textOnDarkSoft, margin: 0,
  });

  const c3 = "F96167";
  const y3 = startY + 2 * (rowH + gap);
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: y3, w: 0.1, h: rowH,
    fill: { color: c3 }, line: { type: "none" },
  });
  s.addText("Kickbacks bend the flow backward", {
    x: 0.9, y: y3, w: 11.8, h: 0.4,
    fontSize: 16, fontFace: F.header, bold: true,
    color: C.textOnDark, margin: 0,
  });
  s.addText("Visual/UX QA, code review, or QA can return the ticket to In Progress. Re-enter Phase 4 or 5. The framework supports the bounce; you re-run the relevant skills.", {
    x: 0.9, y: y3 + 0.45, w: 11.8, h: 0.75,
    fontSize: 13, fontFace: F.body, color: C.textOnDarkSoft, margin: 0,
  });

  s.addText("The phases name the shape of the work. The skills are the moves you reach for inside it.", {
    x: 0.6, y: 6.4, w: 12.1, h: 0.35,
    fontSize: 12, fontFace: F.body, italic: true,
    color: C.textOnDarkSoft, align: "center", margin: 0,
  });

  s.addText("ai-runbook-jh: AI-assisted ticket workflow", {
    x: 0.6, y: 7.1, w: 8, h: 0.3,
    fontSize: 10, fontFace: F.body, color: C.textOnDarkMuted, margin: 0,
  });
  s.addText("9 / 12", {
    x: 12.5, y: 7.1, w: 0.7, h: 0.3,
    fontSize: 10, fontFace: F.body, color: C.textOnDarkMuted,
    align: "right", margin: 0,
  });
}

// ============ SLIDE 10: PER-PROJECT PROFILES ============
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  slideTitle(s, "Where this fits: per-project profiles");
  slideSubtitle(s, "The skills are project-agnostic. One profile file per project supplies the specifics.");

  const lx = 0.6, ly = 2.0, lw = 6.0;
  s.addShape(pres.shapes.RECTANGLE, {
    x: lx, y: ly, w: lw, h: 4.5,
    fill: { color: C.preDevLight }, line: { color: C.primary, width: 1 },
  });
  s.addText("SHARED (project-agnostic)", {
    x: lx + 0.3, y: ly + 0.2, w: lw - 0.6, h: 0.4,
    fontSize: 12, fontFace: F.body, bold: true, charSpacing: 2,
    color: C.primary, margin: 0,
  });
  s.addText([
    { text: "skills/", options: { fontFace: F.code, bold: true, breakLine: true } },
    { text: "24 phase-based skills, all project-agnostic", options: { color: C.textMid, breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "profiles/_template.md", options: { fontFace: F.code, bold: true, breakLine: true } },
    { text: "Annotated starting point for a new profile", options: { color: C.textMid, breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "profiles/uswds.md", options: { fontFace: F.code, bold: true, breakLine: true } },
    { text: "Public worked example (open-source library on GitHub)", options: { color: C.textMid, breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "sync.sh", options: { fontFace: F.code, bold: true, breakLine: true } },
    { text: "Wires the framework into a target project", options: { color: C.textMid } },
  ], {
    x: lx + 0.3, y: ly + 0.7, w: lw - 0.6, h: 3.7,
    fontSize: 11, fontFace: F.body, color: C.textDark,
    paraSpaceAfter: 0,
  });

  const rx = 6.9, rw = 6.0;
  s.addShape(pres.shapes.RECTANGLE, {
    x: rx, y: ly, w: rw, h: 4.5,
    fill: { color: C.goldLight }, line: { color: C.gold, width: 1 },
  });
  s.addText("PROFILE (one file, per project)", {
    x: rx + 0.3, y: ly + 0.2, w: rw - 0.6, h: 0.4,
    fontSize: 12, fontFace: F.body, bold: true, charSpacing: 2,
    color: C.primary, margin: 0,
  });
  s.addText([
    { text: ".agents/profile.md", options: { fontFace: F.code, bold: true, breakLine: true } },
    { text: "One Markdown file. Skills reference its sections by name.", options: { color: C.textMid, breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "## Tracker  ·  ## Required fields", options: { fontFace: F.code, bold: true, breakLine: true } },
    { text: "Issue ref format, markup, minimum fields", options: { color: C.textMid, breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "## Workflow states  ·  ## Stack  ·  ## DoD", options: { fontFace: F.code, bold: true, breakLine: true } },
    { text: "Board lifecycle, framework, definition of done", options: { color: C.textMid, breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "## Sanctioned AI  ·  ## Voice", options: { fontFace: F.code, bold: true, breakLine: true } },
    { text: "Approved clients; path to the project's voice.md", options: { color: C.textMid } },
  ], {
    x: rx + 0.3, y: ly + 0.7, w: rw - 0.6, h: 3.7,
    fontSize: 11, fontFace: F.body, color: C.textDark,
    paraSpaceAfter: 0,
  });

  s.addText("Adopt the shared skills once; add a profile per project. The profile supplies the specifics, the skills stay portable.", {
    x: 0.6, y: 6.8, w: 12.1, h: 0.3,
    fontSize: 11, fontFace: F.body, italic: true,
    color: C.textMid, align: "center", margin: 0,
  });

  footer(s, 10);
}

// ============ SLIDE 11: SETUP ============
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  slideTitle(s, "Setup in 4 steps");
  slideSubtitle(s, "About 10 minutes start to finish. Voice config is the step that does the most work.");

  const steps = [
    {
      n: 1, title: "Clone ai-runbook-jh",
      detail: "Clone the repo somewhere alongside your project checkouts",
    },
    {
      n: 2, title: "Pick or create a profile",
      detail: "Copy profiles/_template.md to profiles/<project>.md and fill it in (or start from profiles/uswds.md as a worked example)",
    },
    {
      n: 3, title: "Author the voice config",
      detail: ".agents/style/voice.md at your project root describes how the system should write",
    },
    {
      n: 4, title: "Run sync.sh",
      detail: "PROFILE=<name> PROJECT_ROOT=<path> ./sync.sh: symlinks the skills into .agents/skills/ and deploys the profile to .agents/profile.md",
    },
  ];

  const cardW = 3.0, cardH = 4.0, cardY = 2.05, gap = 0.15;
  steps.forEach((step, idx) => {
    const x = 0.6 + idx * (cardW + gap);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: cardY, w: cardW, h: cardH,
      fill: { color: C.preDevLight }, line: { color: C.primary, width: 1 },
    });
    s.addText(String(step.n), {
      x: x + 0.2, y: cardY + 0.2, w: 1.4, h: 1.2,
      fontSize: 80, fontFace: F.header, bold: true,
      color: C.primary, valign: "top", margin: 0,
    });
    s.addText(step.title, {
      x: x + 0.2, y: cardY + 1.5, w: cardW - 0.4, h: 0.8,
      fontSize: 16, fontFace: F.header, bold: true,
      color: C.textDark, margin: 0,
    });
    s.addText(step.detail, {
      x: x + 0.2, y: cardY + 2.3, w: cardW - 0.4, h: 1.6,
      fontSize: 11, fontFace: F.body, color: C.textMid, margin: 0,
    });
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 6.25, w: 12.1, h: 0.55,
    fill: { color: C.goldLight }, line: { color: C.gold, width: 1.5 },
  });
  s.addText("Then try one skill on your next ticket; qa-steps is a good low-risk start. Adopt only the ones you actually reach for.", {
    x: 0.8, y: 6.27, w: 11.7, h: 0.5,
    fontSize: 13, fontFace: F.body, italic: true, bold: true,
    color: C.textDark, valign: "middle", margin: 0,
  });

  footer(s, 11);
}

// ============ SLIDE 12: HONEST GAPS + FEEDBACK ============
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 7.5,
    fill: { color: C.gold }, line: { type: "none" },
  });

  s.addText("Honest gaps. What I'd love feedback on.", {
    x: 0.7, y: 0.6, w: 12, h: 0.9,
    fontSize: 32, fontFace: F.header, bold: true,
    color: C.textOnDark, valign: "middle", margin: 0,
  });

  const lx = 0.7, ly = 1.9, lw = 6.0;
  s.addText("KNOWN GAPS", {
    x: lx, y: ly, w: lw, h: 0.4,
    fontSize: 13, fontFace: F.body, bold: true, charSpacing: 3,
    color: C.gold, margin: 0,
  });
  s.addText([
    { text: "performance-frontend", options: { fontFace: F.code, bold: true, breakLine: true } },
    { text: "Aspirational. Written, not yet habitual.", options: { color: C.textOnDarkSoft, breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "No cadence skills", options: { bold: true, breakLine: true } },
    { text: "Monday planning, sprint retro, post-merge follow-up. Those happen in standups.", options: { color: C.textOnDarkSoft, breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: ".agents/style/voice.md ships empty", options: { bold: true, breakLine: true } },
    { text: "You author it per project. Without it, output stays generic.", options: { color: C.textOnDarkSoft, breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "Manual @ invocation", options: { bold: true, breakLine: true } },
    { text: "Skills are tools you reach for, not automations that fire.", options: { color: C.textOnDarkSoft } },
  ], {
    x: lx, y: ly + 0.5, w: lw, h: 5.0,
    fontSize: 13, fontFace: F.body, color: C.textOnDark,
    paraSpaceAfter: 2,
  });

  const rx = 7.0, rw = 6.0;
  s.addText("WHAT I'D LOVE FEEDBACK ON", {
    x: rx, y: ly, w: rw, h: 0.4,
    fontSize: 13, fontFace: F.body, bold: true, charSpacing: 3,
    color: C.gold, margin: 0,
  });
  s.addText([
    { text: "Does the 6-phase model match how you work?", options: { bold: true, breakLine: true } },
    { text: "Or is it over-fitted to my workflow?", options: { color: C.textOnDarkSoft, italic: true, breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "Which skills would you reach for in a normal week?", options: { bold: true, breakLine: true } },
    { text: "Which are noise? I'd rather a tight 12 than a sprawling 24.", options: { color: C.textOnDarkSoft, italic: true, breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "What's missing?", options: { bold: true, breakLine: true } },
    { text: "Cadence skills, post-merge follow-up, design partnership. What would you add?", options: { color: C.textOnDarkSoft, italic: true, breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "Is the security posture defensible?", options: { bold: true, breakLine: true } },
    { text: "Would the tech lead and the AI policy owner sign off as-is?", options: { color: C.textOnDarkSoft, italic: true } },
  ], {
    x: rx, y: ly + 0.5, w: rw, h: 5.0,
    fontSize: 13, fontFace: F.body, color: C.textOnDark,
    paraSpaceAfter: 2,
  });

  s.addText("Canonical doc: ai-runbook-jh/README.md  /  Skills: ai-runbook-jh/skills/  /  Diagram: ai-runbook-jh/diagrams/six-phase-flow.svg", {
    x: 0.7, y: 7.1, w: 12.1, h: 0.3,
    fontSize: 10, fontFace: F.body, italic: true,
    color: C.textOnDarkMuted, align: "center", margin: 0,
  });
}

// ============ WRITE FILE ============
pres.writeFile({ fileName: path.join(__dirname, "..", "..", "decks", "ai-runbook-jh.pptx") })
  .then(fn => console.log("Wrote:", fn))
  .catch(err => { console.error(err); process.exit(1); });
