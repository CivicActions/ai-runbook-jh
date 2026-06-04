# Project Profile: <PROJECT NAME>

> Copy this to `profiles/<project>.md` and fill in every section for your project. Skills read the
> deployed copy at `.agents/profile.md` (see `sync.sh`). Keep the section set intact so skills
> resolve every reference; if a section truly doesn't apply, say so rather than deleting it.
> See `profiles/uswds.md` for a worked example.

## Tracker
- **System:** <Jira / GitHub Issues / GitLab / drupal.org / ...>
- **Issue ref format:** <e.g. `PROJ-XXXX`, `#NNNN`>
- **Checkbox markup:** <e.g. `()` for Jira, `- [ ]` for Markdown>
- **Section heading markup:** <e.g. `h3.` for Jira, `##` for Markdown>
- **Monospace markup:** <e.g. `{{...}}` for Jira, backticks for Markdown>
- **Output wrapping:** <how to wrap copyable output, if at all>

## Required fields
- <minimum fields to fill on triage/refinement>
- **Purpose/summary format:** <the one-line value-statement format, if any>

## Review markers / tags
- **Reviewed marker:** <tag/label, or "n/a; maintainers triage">
- **Stakeholder/prioritization tag:** <if any>
- **Pre-merge review labels:** <labels that gate certain changes; e.g. visual QA, UX QA, accessibility-review; or "none">

## Priority guide
- <bug priority levels + criteria, or the project's triage considerations>
- **Accessibility impact:** <how a11y findings map to priority; a11y is typically elevated>

## Estimation
- **Scale:** <story points / t-shirt / hours / "not contributor-owned">
- **Owner:** <who sets LOE>
- **Gate:** <what makes an item estimation-ready>

## Workflow states
- <lifecycle / board columns; any review labels and when they apply>
- **Phase → state map** (the tracker state each of the six framework phases corresponds to):
  - Triage: <state>
  - Refinement: <state>
  - Plan: <state>
  - Build: <state>
  - Validate: <state>
  - Communicate: <state(s)>

## Team context
- <team size and review norms; sets how formal vs. lightweight peer review should be>

## Knowledge base
- <where durable knowledge / process notes get filed>

## Environments
- **Local:** <local dev env + URL pattern, e.g. DDEV, Storybook `npm start`>
- **Higher:** <test/stage/prod, or "none" for a library>
- **CI:** <CI system + relevant phases>
- **A11y tooling:** <Pa11y, axe, cypress-axe, ...>
- **Visual regression:** <Backstop, etc., or "none">

## Stack
- **Framework:** <e.g. Drupal, none/vanilla lib, React> (determines whether `drupal-peer-review` applies)
- **Templates:** <templating language + dynamic-output handling>
- **Styling:** <design-system tokens, naming convention, prohibitions (hex, `!important`, IDs)>
- **Breakpoints:** <named breakpoint tokens + values>
- **Grid:** <grid utilities/mixins>
- **JS:** <behavior/init pattern, language conventions>
- **Library registration:** <where CSS/JS is declared, if applicable>
- **A11y baseline:** <e.g. WCAG 2.1 AA, Section 508>

## Performance budgets
- <page/component perf targets; Core Web Vitals goals>

## Patterns / canon
- **Component source / canon:** <where the canonical components / source of truth live>
- **Design system docs:** <the live catalog / docs>
- **Reference order:** <where to look first for an existing pattern>

## Branch / plan conventions
- **Base branch:** <e.g. develop, main>
- **Branch name:** <naming convention>
- **Plan file path:** <where plan files go>

## Commit conventions
- **Format:** <commit-message format / convention>
- **Issue ref:** <in the subject, or linked in the PR/ticket>
- <signing requirements, shared-branch rules>

## Definition of Done
- <the DoD checklist(s), by type; render in the Tracker's checkbox markup>

## Sanctioned AI
- **Code:** <approved AI client(s) for code>
- **Non-code:** <approved tools for prose/reasoning>
- **Banned:** <disallowed tools>
- **Browser inspection MCP:** <e.g. chrome-devtools>
- **Invocation model:** <auto-fire vs. explicit-reference>

## Voice
- **Config path:** `.agents/style/voice.md` (author this per project)

## Attribution marker
- <the AI-assisted-output marker string and when to apply it; or "none" (e.g. public OSS),
  in which case human review is still required before sharing>
