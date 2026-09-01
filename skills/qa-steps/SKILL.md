---
name: qa-steps
description: "Writes QA steps for a ticket or PR. Use when the user says write QA steps, add testing instructions, how do I test this, write the QA section, or what should QA check. Apply when the user is preparing a ticket or PR for review and needs test instructions."
---

# QA Steps

## Project contract
The output markup, review labels, and environment details are **project-specific**. Read them from
`.agents/project-contract.md` (shared contract), then layer `.agents/project-contract.personal.md` on top if it exists (personal entries win where they overlap):
- **`## Tracker`**: heading/checkbox/monospace markup and how to wrap output.
- **`## Workflow states`**: any review labels (e.g. visual / UX QA) that gate certain changes.
- **`## Environments`**: local URL pattern, local-vs-CI differences, higher-env validation, a11y
  test commands, and any tooling caveats.
- **`## Sanctioned AI` → Browser inspection MCP**: which browser tool `browser-check` uses.

If no project contract is present, ask the user for the tracker markup and test environment.

## When to Use
Invoke to write QA steps for a ticket or PR: clear instructions for a reviewer or QA engineer to
verify the change works correctly.

## Approach
1. **Summarize what changed**: one paragraph on the scope of the change
2. **Environment setup**: what environment to use, any setup steps (enable a module, create
   content, use a specific URL), per the project contract's `## Environments`
3. **Execute browser validation**: use `browser-check` (with the project contract's browser MCP) to
   navigate the relevant pages, capture screenshots, check console for errors, and validate DOM
4. **Test steps**: ordered, concrete steps to verify the change
5. **Expected results**: what success looks like for each step
6. **Regression check**: what adjacent functionality to spot-check
7. **Success criteria**: the minimum bar for the change to be considered passing

## Scope rules

**Source of truth for scenarios is the ticket's AC, not the implementation.**

- Derive scenarios from the acceptance criteria and user story. If it's not in the AC, don't test for it.
- Do not add checks for things discovered and fixed during the build (implementation details, regressions caught mid-work, intermediate states). Those are solved; they add noise to QA steps and imply QA should re-validate internal implementation decisions.
- Keep the scenario set to the MVP: the minimum steps needed to confirm the AC is met. One scenario per distinct AC area is usually enough. Prefer fewer, clearer scenarios over exhaustive checklists.
- If a bug was fixed as part of the work, one scenario confirming the fixed behavior is fine — but only if it was a stated AC item or was explicitly called out in the ticket, not because it happened to come up during implementation.
- **When no ticket or AC is available** (e.g. PR-only request): derive scenarios from the PR description and the user-stated expected behavior. State that AC was not available and list the source used.

## Output

**ALWAYS write the QA steps to a file artifact** at `.agents/qa/[ISSUE-REF]-qa.md` (issue-ref
format per the project contract's `## Tracker`; e.g. `.agents/qa/NSF-14384-qa.md`). When no ticket
exists (PR-only request), name it for the PR (e.g. `.agents/qa/pr-164-qa.md`). Writing to a file
makes the steps easy to copy into the tracker or PR without re-scrolling the chat.

If `.agents/qa/` does not exist, create it before writing. After writing, tell the user where the
file was saved.

The file contents use the project contract's `## Tracker` markup (see Output Format below), so the
saved artifact is paste-ready for the tracker.

## Output Format
Render using the project contract's `## Tracker` markup. In the structure below, `[heading]` = the project contract's
section-heading markup, `[checkbox]` = its checkbox markup, and `[step]` = a plain bullet (no
checkbox). Wrap the full output per the project contract's output-wrapping convention.

```
[heading] What Changed
[1 sentence summary in plain language]

[heading] Setup
[Any prerequisite steps, login state, content needed, environment]

[heading] Caveats
[Known edge cases, limitations, or follow-up decisions — list BEFORE scenarios so the reviewer
knows what to expect before they start. Omit section if none.]

[heading] <Review label section, e.g. Visual QA>
[Include only if the project contract defines such a label AND the change has the relevant surface]
[step] Setup step
[step] Navigation step
[checkbox] Validation: what to verify

[heading] Test Scenarios

[heading] Scenario 1: [Plain language description]
[step] Setup or navigation step
[step] Setup or navigation step
[checkbox] Expected: [what you should see]
[checkbox] Expected: [what you should see]

[heading] Scenario 2: [Plain language description]
[step] Step
...
```

- Use plain bullets for setup/navigation steps (no checkbox)
- Use the project contract's checkbox markup before validation/expected lines
- Omit sections that don't apply (e.g. no review-label section if purely functional, no Caveats if
  none)
- For bug tickets, Scenario 1 should be the reproduce-then-verify flow
- Include Desktop and Mobile device views as separate checkbox lines when layout differs

## Voice
Apply `.agents/style/voice.md` to the "What Changed" summary and any explanatory prose.

## Environment notes
Pull from the project contract's `## Environments`: note local-vs-CI differences, reference the project's
local URL pattern, flag if higher-environment validation is required, add the project contract's a11y check
command when the change has accessibility implications, and respect any tooling caveats.

## Attribution
QA steps are appended to a ticket/PR. **This skill does not emit a marker.** If the active project contract
defines an attribution marker, ensure the **final assembled ticket/PR** ends with that marker as its
last line whenever any section was AI-assisted: one marker per artifact, at the very bottom. Skip
it entirely if no section was AI-assisted, or if the project contract defines no marker (e.g. public OSS).

## Example

**You ask:** `use the qa-steps skill on PROJ-1234`

**You get:** a file at `.agents/qa/PROJ-1234-qa.md`, and a note telling you where it was saved:

```
## What Changed
Page now stays scrollable after deselecting any facet on /search.

## Setup
- Use local environment at the project's local URL.
- No special content or login required.

## Caveats
- None.

## Test Scenarios

### Scenario 1: Reproduce and verify fix
- Go to /search
- Select any facet (e.g. "Funding > Grants")
- Wait for results to refresh
- Deselect the facet
- [ ] Expected: page scrolls; before fix it was locked

### Scenario 2: Cross-viewport
- Repeat Scenario 1 at 768px and 375px
- [ ] Expected: scrolls at all viewports
- [ ] Expected: no console errors

```

## Git exclusion
QA-step files are personal working artifacts; exclude `.agents/qa/` via `.git/info/exclude`, not
`.gitignore`. Never add AI runbook working directories to the team-owned `.gitignore`.

## Related Skills
- **Invokes:** `browser-check` (live page validation)
- **Often invoked by:** `issue-closure-notes` (closure notes link to QA steps), `ticket-refinement`
  (QA steps may be written ahead of time during refinement)
- **Downstream:** `tone-check` (run the "What Changed" summary and explanatory prose through tone check before posting)
