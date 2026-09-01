---
name: accessibility-audit
description: "Audits a page, component, or template for WCAG 2.1 AA / Section 508 compliance. Use when the user says accessibility audit, check a11y, find accessibility issues, is this accessible, Section 508 check, or review this for accessibility. Apply when the user shares a page or component and wants compliance validation even if they don't say 'audit'."
typicalNext: "Document the findings in the ticket/issue (or a new one), prioritize by impact level and user reach, and open follow-up items for anything that won't ship in the current scope. Re-run the validation commands after fixes land."
---

# Accessibility Audit

## Project contract
The impact-to-priority mapping, validation tooling, environment, and stack-specific checks are
**project-specific**. Read them from `.agents/project-contract.md` (shared contract), then layer `.agents/project-contract.personal.md` on top if it exists (personal entries win where they overlap):
- **`## Priority guide` → Accessibility impact levels**: the A/B/C (or equivalent) impact-to-
  priority mapping and bump up/down rules.
- **`## Environments`**: local environment to audit against, and the a11y validation tooling
  (e.g. Pa11y, cypress-axe, axe).
- **`## Stack`**: design-system styling rules (tokens vs. hex, `!important`, BEM) and the a11y
  baseline; whether the stack is Drupal/Twig (enables the template checks below).
- **`## Sanctioned AI` → Browser inspection MCP**: which browser tool `browser-check` uses.

If no project contract is present, default to WCAG 2.1 AA and ask the user for the project's tooling.

## When to Use
Invoke to audit a page, template, component, or test spec for accessibility issues; WCAG 2.1 AA,
Section 508, or project-specific a11y requirements.

## Approach
1. **Identify scope**: page URL, component path, or template file
2. **Live page inspection**: use `browser-check` (with the project contract's browser MCP) to navigate,
   capture screenshots, and inspect the rendered DOM before static analysis
   - **Cross-browser a11y note:** Firefox's accessibility inspector surfaces ARIA issues and
     computed accessible names differently than Chromium. When the project contract lists
     `firefox-devtools` as an available cross-browser MCP, consider running the a11y inspection
     in Firefox too, especially for ARIA widget patterns (combobox, dialog, tabs) where
     browser-specific accessibility tree construction varies.
3. **Static analysis**: review markup for:
   - Missing or inadequate alt text on images
   - Heading hierarchy violations (skipped levels, multiple H1s)
   - Form inputs without associated labels
   - Links with non-descriptive text ("click here", "read more")
   - Color used as the only means of conveying information
   - Missing ARIA roles, labels, or landmarks where needed
   - Keyboard trap risks (modals, dropdowns, custom widgets)
   - Focus management gaps in dynamic content
4. **Design-system checks**: verify the project contract's `## Stack` styling rules (e.g. color tokens, no
   hex; no `!important`; class-based styling)
5. **Template checks (if the project contract's stack is Drupal/Twig)**: confirm `|e` filter on dynamic
   output, `#plain_text` for user content
6. **Validate recommendations against current guidance** (see "Web research validation" below):
   before recommending a specific ARIA pattern, technique, or remediation, confirm it reflects
   current WAI-ARIA Authoring Practices and browser/AT support. Accessibility guidance evolves;
   don't prescribe patterns from stale training data.
7. **Report findings**: classify each by impact level and priority using the project contract's
   Accessibility impact levels

## Web research validation

Before recommending an accessibility fix, use web research to confirm the technique is current,
well-supported by assistive technologies, and aligned with the latest WCAG and ARIA guidance.
Accessibility best practices evolve as specs mature, browser implementations improve, and screen
reader support changes.

**Always validate externally when recommending:**
- ARIA roles, states, and properties (the Authoring Practices get rewritten; patterns that were
  recommended two years ago may now carry "warning: avoid this pattern" notes)
- Specific ARIA widget patterns (combobox, dialog, disclosure, tabs, treegrid) — these are the
  patterns most likely to have shifted between APG versions
- New semantic HTML elements that may reduce ARIA need (e.g. `<search>`, `<dialog>`, `popover`)
- Screen reader support for specific techniques (what works in NVDA may not work in VoiceOver;
  don't assume uniform AT support)
- WCAG version applicability (2.1 AA vs. 2.2 AA vs. 3.0 draft — know which version the project
  targets and whether a newer criterion applies)
- Focus management patterns (especially `inert`, focus-trapping in dialogs, `focusgroup`)
- Color contrast algorithm changes (APCA vs. WCAG 2.x contrast ratio)

**What to check:**
- WAI-ARIA Authoring Practices Guide (w3.org/WAI/ARIA/apg/) for current recommended patterns
- WCAG 2.2 Understanding documents for success criterion interpretation
- a11ysupport.io for real-world assistive technology support data
- MDN for HTML element and ARIA attribute browser support
- Scott O'Hara, Adrian Roselli, Sara Soueidan (established a11y practitioners whose blogs often
  surface AT support issues that specs don't capture)

**How this interacts with the audit:** Findings from steps 1–5 describe *what's wrong* (observed
in the DOM or against the spec). The fix recommendation is where staleness risk lives. A finding
like "dialog has no `aria-modal`" is observational (valid). But the fix "use the ARIA dialog
pattern with manual focus trapping" is a claim about current best practice that should be
validated — the native `<dialog>` element with `showModal()` may now be the better path, and the
APG may have updated its guidance since training.

## Output Format
Return a flat list of findings. For each:
- **Issue**: short description
- **Location**: file path or selector
- **WCAG criterion**: e.g. 1.1.1, 2.4.6
- **Impact level**: per the project contract's impact typology
- **Priority**: per the project contract's priority scheme
- **Fix**: concrete corrective action

End with a summary count by priority and the project contract's a11y validation commands to verify the fix.

## Voice
Apply `.agents/style/voice.md` to finding descriptions and fix suggestions. Run shared audit prose through `tone-check` before posting.

## Attribution
If the active project contract defines an attribution marker (see its `## Attribution marker` section), end
shared findings with that marker as the last line. Skip it for personal-use output, or if the
project contract defines no marker. Don't name the specific AI tool (see `security-check`).

## Example

**You ask:** `use the accessibility-audit skill on the new filter sidebar`

**You get:**

```
- Issue: Filter checkbox missing label association
  Location: src/components/Filter.jsx:23
  WCAG: 1.3.1, 4.1.2 | Impact: serious | Priority: High
  Fix: wrap input in <label> or add htmlFor

- Issue: Sidebar toggle button has no aria-expanded
  Location: src/components/Sidebar.jsx:11
  WCAG: 4.1.2 | Impact: serious | Priority: High
  Fix: add aria-expanded reflecting open state

Summary: 2 serious findings. Verify with the project's a11y command.
```

## Related Skills
- **Upstream gate:** `security-check` (run before auditing any environment higher than local, or pasting screenshots / tooling output that may contain PII or authored content)
- **Invokes:** `browser-check` (live page inspection before static analysis)
- **Sibling Validate-phase skills:** `responsive-design`, `performance-frontend`,
  `frontend-peer-review`, `drupal-peer-review` (the last only when the project contract's stack is Drupal); these
  may all run on the same change
- **Downstream:** `qa-steps` (a11y findings often produce QA verification steps), `tone-check` (run shared audit prose through tone check before posting)

## Security
Audit against the project contract's **local environment by default**. If a higher-environment audit is
needed:
- A human runs the audit and pastes findings (selectors, contrast ratios, screen reader output)
  into the AI session, never raw page state
- Screenshots saved to `.agents/reviews/` are PII-redacted before commit (author emails, user
  content, draft content)
- Tooling output (Pa11y, cypress-axe, etc.) is reviewed for PII before sharing
