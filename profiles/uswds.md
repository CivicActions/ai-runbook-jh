# Project Profile: USWDS (uswds/uswds, GitHub)

> A worked example for a public OSS component library, and the proving ground for the profile
> abstraction. Scope: the `uswds/uswds` GitHub repo (JS + Sass component library).

## Tracker
- **System:** GitHub (Issues + Pull Requests)
- **Issue ref format:** `#NNNN`
- **Checkbox markup:** `- [ ]` (GitHub Markdown)
- **Section heading markup:** `##` / `###`
- **Monospace markup:** backticks `` ` ``
- **Output wrapping:** fenced code blocks ```` ``` ````

## Required fields
GitHub uses labels, not custom fields. For a confirmation contribution, the "fields" are the body
of a confirming comment:
- Confirmed / not reproduced
- Exact reproduction steps
- Environment (browser, OS, USWDS version, Storybook vs. site)
- Screenshot or recording
- Relevant WCAG criterion when it's an a11y issue

### Key labels
- `Needs: Confirmation` (the confirm-lane targets), `Type: Bug`, `Type: Feature Request`,
  `Affects: Accessibility`, `A11y Audit`, `good first issue`, `help wanted`,
  `Status: Voting Open` (feature upvotes).

## Review markers / tags
- Contributors don't set labels; maintainers do. The contributor equivalent of "reviewed" is
  **posting a confirming comment** (with repro) on a `Needs: Confirmation` issue, or a **PR
  review**. No project-wide reviewed tag.
- **Pre-merge review labels:** none (maintainers handle gating via the GitHub review flow).

## Priority guide
USWDS triages by three considerations (from CONTRIBUTING.md): **Size** (fits a sprint?),
**Severity** (functionality impact / workaround?), **Priority** (aligns with USWDS vision/roadmap).
- **USWDS explicitly prioritizes issues that affect accessibility.** Treat a11y findings as
  elevated by default.
- Contributors propose, maintainers decide; don't assert a final priority; frame as a suggestion.

### Accessibility impact (carry over generically)
WCAG 2.1 AA baseline; Section 508 alignment. USWDS-specific gotchas seen in the queue: non-text
contrast 1.4.11 (3:1) on component edges, focus-indicator thickness, forced-colors/high-contrast
support. Use the generic A/B/C impact-to-priority mapping; lead with the WCAG criterion number.

## Workflow states
GitHub lifecycle: **open/confirm issue → maintainer triage (Size/Severity/Priority) → branch from
`develop` → PR → human review by a USWDS Administrator/Maintainer → merge.**
- Contributor lanes (no special access needed): confirm issues, review/test PRs, join Discussions,
  test releases, submit PRs.
- The original issue creator ushers an issue through its lifecycle.

**Phase → state map** (mapped to GitHub issue / PR state, since there's no board)
- Triage: open issue (awaiting `Needs: Confirmation` → maintainer triage)
- Refinement: triaged, Size/Severity/Priority set
- Plan: assigned / branch open (pre-PR)
- Build: PR open, draft or work-in-progress
- Validate: PR ready for review
- Communicate: PR in maintainer review ▸ merged

## Estimation
- Not contributor-owned. USWDS maintainers triage by Size / Severity / Priority (see
  `## Priority guide`). As a contributor you don't set LOE; scope your own PR to a sprint-sized
  change and let maintainers prioritize.

## Team context
- Open-source community project. "Peer review" here = reviewing other contributors' PRs as a
  community member, and your own PRs are reviewed by USWDS Administrators/Maintainers before merge.
  Be constructive, plain-spoken, and patient (community guidelines); you're a guest contributor,
  not a gatekeeper.

## Knowledge base
- Durable knowledge filed to: GitHub Discussions and repo docs.

## Environments
- **Local:** the repo's own dev server; `npm install` then `npm start` → Storybook at
  `localhost:6006`. Lint: `npm run lint`. Tests: `npm test`. Format: `npm run prettier`.
- **Higher:** none (it's a library, not a hosted site).
- **CI:** USWDS's GitHub Actions.
- **A11y tooling:** browser + axe/manual; verify contrast ratios numerically, don't eyeball.

## Stack
- **Framework:** none / vanilla component library (NOT Drupal). **`drupal-peer-review` does NOT apply.**
- **Templates:** Twig templates inside packages (`packages/usa-*/src/*.twig`) for component markup
  + Storybook stories.
- **Styling:** USWDS Sass; design tokens via `color("…")`, `units("…")`, `radius("…")` etc.;
  `usa-` BEM naming; **no hex, no `!important`**. Source lives under `packages/usa-*/src/styles/`.
- **Breakpoints:** USWDS breakpoint tokens via Sass (`at-media('tablet')` etc.); `mobile-lg` 480,
  `tablet` 640, `tablet-lg` 880, `desktop` 1024, `desktop-lg` 1200.
- **Grid:** USWDS grid (`grid-container`, `grid-row`, `grid-col-*`; source under
  `packages/usa-layout-grid`).
- **JS:** vanilla component init (the USWDS receptor/behavior pattern), `const`/`let`. No
  `Drupal.behaviors`.
- **A11y baseline:** WCAG 2.1 AA; accessibility is a first-class priority for the project.

## Performance budgets
- It's a component library, not a hosted page; budgets are component-level: minimal/no unnecessary
  JS, no heavy dependencies, Sass compiles cleanly. Page-load/TTI/Lighthouse targets apply to
  consuming sites, not the library itself. Core Web Vitals (LCP < 2.5s, CLS < 0.1, INP < 200ms) are
  the downstream goal components must not undermine.

## Patterns / canon
- **Component source / canon:** the USWDS component packages under `packages/usa-*/src/` (Twig
  markup + Sass + stories) are the source of truth.
- **Design system docs:** the live USWDS design system docs (designsystem.digital.gov) + Storybook
  at `localhost:6006`.
- **Reference order:** an existing `packages/usa-*` component of the same type → the design system
  docs → nearby package patterns.

## Branch / plan conventions
- **Base branch:** `develop`.
- **Branch name:** lightly descriptive, e.g. `fix-range-slider-contrast`.
- **Plan file path:** `.agents/plans/[issue-number]-plan.md`.
- **Commits must be verified-signed** (GPG or SSH; signing key registered as a Signing Key on
  GitHub). PRs are rejected otherwise.

## Commit conventions
- **Format:** conventional commits; `type(scope): subject` (e.g. `fix(usa-range): raise slider
  edge contrast`), imperative mood, lowercase type/subject, no trailing period.
- **Issue ref:** not in the subject; link the issue in the PR body (`closes #NNNN`).
- **Release Notes:** the PR body carries the bold Release Notes statement (per the DoD), not the
  commit message.
- Commits must be verified-signed (see Branch / plan conventions above).
- Never rewrite/squash commits already pushed to a shared branch without coordinating.

## Definition of Done
```
- [ ] Branched from develop.
- [ ] Commits are verified-signed.
- [ ] Linked to an issue (closes #NNNN / resolves #NNNN).
- [ ] PR body has a bold Release Notes statement.
- [ ] PR body has a "How to Test" section.
- [ ] npm run lint passes.
- [ ] npm test passes.
- [ ] Accessibility verified where relevant (contrast ratios, keyboard, focus).
```
(For a confirmation-only contribution, "done" = a clear confirming comment with repro + env +
evidence, no PR.)

## Sanctioned AI
- **Code:** Claude via GitHub Copilot in VS Code (agent mode); the repo driver.
- **Non-code (reasoning, prose, diff review):** ChatGPT, Gemini.
- **Note:** sanctioned tools vary by client; always confirm the per-project profile rather than
  assuming a given tool is allowed.
- **Browser inspection:** Copilot/VS Code tooling or chrome-devtools.

## Voice
- **Config path:** `.agents/style/voice.md`. USWDS community norms: plain language, constructive,
  patient (per the Digital.gov community guidelines / TTS code of conduct). Consider authoring a
  USWDS-specific `voice.md` so public comments match community tone.

## Attribution marker
USWDS has no project-wide attribution-marker convention, and an AI-assistance marker would read
oddly on a public federal OSS repo. Default here: **omit any attribution marker on public USWDS
comments/PRs, but human-review every AI-assisted output before posting.**
