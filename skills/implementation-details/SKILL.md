---
name: implementation-details
description: "Writes the implementation details checklist for a ticket. Use when the user says write up the implementation details, add implementation details, or what would I do for this ticket. Produces a practical dev checklist of what to actually do, not a narrative of what was done. Reads project-specific values (tracker markup, stack, tooling) from the active project contract."
invokedBy: "issue-plan"
---

# Implementation Details

## Project contract
The methodology here is generic, but the markup and the stack-specific steps are
**project-specific**. Read them from `.agents/project-contract.md` (shared contract), then layer `.agents/project-contract.personal.md` on top if it exists (personal entries win where they overlap):
- **`## Tracker` → Checkbox markup**: how to render checklist items (e.g. `()` for Jira,
  `- [ ]` for GitHub Markdown).
- **`## Tracker` → Section heading markup**: used only when this checklist is embedded under a
  heading in a larger artifact (e.g. `h3.` for Jira, `##` for Markdown).
- **`## Stack`**: framework/templates/styling/tests, which decides whether template-specific,
  visual-regression, and test-framework steps apply (see Approach below).
- **`## Environments`**: the test/visual-regression tooling and the higher environments to call
  out for manual-only QA steps.
- **`## Definition of Done`**: the gating checks (linters, automated tests, a11y tool) that the
  implementation steps should anticipate; don't restate the full DoD here, make sure the
  checklist sets up the work the DoD will verify.
- **`## Attribution marker`**: whether the final artifact gets a marker (see Attribution below).

If no project contract is present, ask the user for the tracker markup and stack rather than assuming Jira
or a specific framework. The project contract is the single source of truth.

## When to Use
Invoke at the **start** of a ticket — before work begins — to produce a checklist of the major tasks a developer would actually do to work it. This is a planning artifact, not a retrospective one.

**Default assumption:** the ticket is not started. Do not generate a QA/verification list; generate the work.

**Exception:** if the user explicitly says the ticket is in-progress or done (e.g. "the branch is already built, write up what was done"), adapt accordingly — but only when told. Do not infer this from context.

## Approach

1. **Understand the ticket**, read the bug description, acceptance criteria, and any technical notes
2. **Think in major work phases**, not sub-steps — config, code, tests, visual regression, linting. Each item should represent a meaningful chunk of work, not a micro-task
3. **Include the non-obvious items** a developer might forget: updating visual-regression reference shots, exporting config, adding automated tests
4. **Keep each item short**, one line, action-oriented. No qualifiers, conditionals, or inline notes ("if X", "on Y env"). Those belong in the DoD or QA steps

### Stack-conditional steps
Tailor the test/template/styling steps to the project contract's `## Stack` and `## Environments`; don't
emit steps for tooling the project doesn't use:
- **Template safety** (e.g. Twig `|e` / `#plain_text`, SDC variable docs); only when the stack
  uses that template system (e.g. Drupal/Twig). Skip for a vanilla component library.
- **Visual regression**: name the project's tool (e.g. Backstop references, or the project's
  Storybook/snapshot tooling) from `## Environments`; skip if the project has none.
- **Automated tests**: name the project's frameworks from `## Environments` (e.g. Cypress/PHPUnit,
  or `npm test`/Jest). Don't reference Cypress/PHPUnit on a project that uses neither.
- **Linters**: use the project's lint command(s) from `## Environments` / the DoD.
- **Higher-environment manual QA**: call out the project's higher envs from `## Environments`
  (e.g. "on Stage…"); skip for a library with no hosted environment.

## Output Format

A flat checklist of unchecked items in the project contract's checkbox markup. For example, with Jira markup:

```
() [action]
() [action]
() [action]
```

No headers, no sections, no narrative. Just the list.

Items should cover:
- The core fix or implementation (one item, not broken into sub-steps)
- Viewport/responsive checks (mobile, tablet, desktop, call out specific ones if the bug is viewport-specific)
- Adjacent areas that could be affected
- Visual-regression reference shot updates if there are visual changes (only if the stack uses visual regression)
- Automated test additions or updates, in the project's test framework(s)
- Linter pass, using the project's lint command(s)
- Manual QA steps that can't be automated (e.g. testing on a higher environment named in the project contract)

Each item should be one action at the right level of granularity, not a sub-step, not a vague category. "Fix the overflow lock" not "Identify where the lock is set, then trace the unlock path, then remove the handler." "Confirm fix on desktop, tablet, and mobile" not one item per viewport.

## Voice
Terse. Imperative. No filler. Each item should read like a sticky note to yourself.

## Examples

Write items as if starting the ticket, not finishing it. Don't assume the solution is known, "Trace where overflow: hidden is being set and clear it" not "Remove the mousedown handler in filter-button.js." Don't describe what was done; describe what to do.

Good (Jira markup, Drupal/Cypress/Backstop stack):
```
() Trace where overflow: hidden is getting set and clear it after facet deselect
() Confirm fix on desktop, tablet, and mobile
() On Stage: confirm page stays scrollable a few seconds after unchecking (can't automate)
() Add Cypress regression test for the deselect case
() Update Backstop ref shot for Funding Search Filters
() Run JS linter
```

The same ticket on a different project contract (GitHub markup, vanilla JS library, `npm test`, no Backstop)
would read:
```
- [ ] Trace where overflow: hidden is getting set and clear it after facet deselect
- [ ] Confirm fix on desktop, tablet, and mobile
- [ ] Add a test for the deselect case (npm test)
- [ ] npm run lint
```

Bad (written after the fact / too specific about solution):
```
() Remove the mousedown handler and replace with window.scrollTo() at ajaxSend
() Replace the conditional overflow unlock with unconditional removeProperty calls
```

Bad (too granular / micro-tasks):
```
() Identify where the lock is set in filter-button.js
() Trace the unlock path in ajaxComplete
() Remove the mousedown handler
() Confirm fix on desktop
() Confirm fix on tablet
() Confirm fix on mobile
```

Bad (too granular / QA verification list instead of work items):
```
() Verify help text renders on each option
() Check each style at full-width, half-width, and one-third-width
() Confirm border-radius renders at every breakpoint
() Run Pa11y contrast check for each palette option
() Check browser console for errors```

Bad (too vague):
```
() Implement a comprehensive solution to address the overflow issue
() Ensure cross-browser compatibility across all supported browsers
() Update documentation as needed
```

## Attribution

The implementation-details checklist is appended to a ticket. **This skill does not emit a marker.** If the active project contract defines an attribution marker (see the project contract's `## Attribution marker` section), ensure the **final assembled ticket** ends with that marker as its last line whenever any section was AI-assisted:

- One marker per ticket, at the very bottom, covering everything above it.
- Skip the marker entirely if no section was AI-assisted, or if the project contract defines no marker (e.g. public OSS contributions).

### Example (final ticket with IDs near the bottom)

Using the project contract's section-heading and checkbox markup (Jira shown here):

```
[ticket body...]

h3. Implementation Details
() Trace where overflow: hidden is getting set and clear it after facet deselect
() Confirm fix on desktop, tablet, and mobile
() On Stage: confirm page stays scrollable after unchecking (can't automate)
() Add a regression test in the project's test framework
() Update visual-regression ref shot
() Run the linter

_AI-assisted draft, reviewed before submission._   <- only if the project contract defines a marker
```

## Example

**You ask:** `use the implementation-details skill on PROJ-1234`

**You get:**

```
() Trace where overflow: hidden is set and clear it after facet deselect
() Confirm fix on desktop, tablet, mobile
() Add a regression test for the deselect case
() Update visual reference shot
() Run the linter
```

## Related Skills

- **Invoked by:** `ticket-refinement` (the IDs checklist is part of the refined ticket body), `issue-plan` (the plan includes a generated IDs checklist as Step 7)
- **Invokes:** `definition-of-done` is the canonical source for the gating checks this checklist anticipates
- **Pairs with:** `evidence-check` (the surface-area pointers here are claims about the code; confirm them by reading, don't list files from memory)
- **Standalone use:** also useful when a ticket already exists and only needs its IDs filled in without a full refinement pass
