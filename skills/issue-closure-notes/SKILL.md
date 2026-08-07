---
name: issue-closure-notes
description: "Writes closure notes for a completed ticket/issue. Use when the user says close this ticket, write closure notes, ticket is done, wrap up this ticket, or I'm closing [issue-ref]. Apply when the user is finishing a ticket even if they don't say 'closure notes'."
---

# Issue Closure Notes

## Project contract
The closure-note format and the values around it are **project-specific**. Read them from
`.agents/project-contract.md` (shared contract), then layer `.agents/project-contract.personal.md` on top if it exists (personal entries win where they overlap):
- **`## Tracker`**: Issue ref format (e.g. `PROJ-123`, `#NNNN`), section heading markup, monospace
  markup, and output wrapping (whether to wrap copyable output in a code block).
- **`## Workflow states`**: the transition to the "done" state on closure, and any pre-close
  labels/pings still owed (e.g. visual / UX review).
- **`## Priority guide`**: how to flag the priority of any deferred follow-up work.
- **`## Attribution marker`**: the trailing marker (if the project defines one).

If no project contract is present, ask the user for the project's tracker conventions rather than inventing
them. The project contract is the single source of truth.

## When to Use
Invoke when a ticket is complete and the user wants to write closure notes, a durable record of what was done and what the next engineer needs to know.

## Approach

1. **Summarize the problem and approach**, what was broken or needed, how it was addressed
2. **Summarize changes by logical area**, not by commit. Group related changes together (e.g. "component markup and styles," "JS behavior," "Storybook," "CI/testing"). List commits only when there is a single commit directly worth linking, or when the commit hash is the most useful reference (e.g. a fix commit that can be cherry-picked). Never list every commit.
3. **Note follow-up work**, only if there's genuinely ticketable deferred work

## Output Format

If the project contract's Tracker section calls for it (Output wrapping), wrap the **entire copyable output** in that wrapper so the user can paste it directly into the tracker without reformatting. Use the project contract's section heading markup for headings and its monospace markup for inline code references (file paths, selectors, module names, commit hashes), NOT a hardcoded syntax.

The structure below is generic. Substitute the project contract's markup for `[heading]` and `[monospace]`:

```
[heading] Problem & Approach
[1–2 sentences on what was broken/needed and how it was addressed]

[heading] Changes
[Bullet list grouped by logical area, not by commit. Include a [monospace]commit-hash[/monospace] only when it's the most useful reference for a specific item.]

[heading] Summary
[1–2 sentences on the end state, what's working now, what the PR delivers]

[heading] Follow-up
[Only include if there's real deferred work worth ticketing. Omit section entirely if nothing to note.]
```

Always include links to the QA steps, PR, and plan file where they exist; these are the
durable record's load-bearing references.

Sections that are NOT included (handled elsewhere):
- **Requirements**, already in the ticket's AC
- **What to Test**, use the `@qa-steps` skill separately
- **Problems Encountered**, implementation details belong in handoffs/PR descriptions, not closure notes

## Definition of Done

After the closure notes (outside any code block), append the relevant DoD checklist by invoking the `definition-of-done` skill with the ticket type (the project contract defines which types exist: e.g. FE/BE/DevOps, or a single PR checklist). The assignee confirms the items before closing.

The DoD lives in one place, `definition-of-done`, so it doesn't drift across QA steps, refinement output, and closure notes.

## Attribution

Closure notes are appended to a ticket/issue. **This skill does not emit a marker.** Instead, if
the active project contract defines an attribution marker (see the project contract's `## Attribution marker`
section), ensure the **final assembled ticket** ends with that marker as its last line whenever any
section was AI-assisted.

One marker per ticket, at the very bottom, covering everything above it. Skip the marker entirely
if no section was AI-assisted, or if the project contract defines no marker (e.g. public OSS contributions).
The marker wording is a team convention, not policy text verbatim (see `security-check`).

### Example (final ticket with closure notes as the last section; markup and marker from the project contract)

```
[ticket body...]

[heading] Problem & Approach
Cleared the overflow:hidden lock left behind after facet deselect.

[heading] Changes
* Cleared the overflow:hidden lock in the ajaxComplete handler.
* Added a regression test for the deselect path.

[heading] Summary
PR delivers a clean fix; page stays scrollable after deselect across viewports.

[attribution marker]   <- only if the project contract defines a marker
```

## Example

**You ask:** `use the issue-closure-notes skill on PROJ-1234`

**You get:**

```
## Problem & Approach
Page locked after facet deselect; cleared the stale `overflow:hidden` in the ajaxComplete handler so the no-results branch no longer leaks the lock.

## Changes
- Cleared the overflow lock unconditionally in ajaxComplete.
- Added a regression test for the deselect path.
- Updated the visual reference shot.

## Summary
PR delivers a focused fix; page stays scrollable after deselect across desktop, tablet, and mobile.

## Follow-up
- None.
```

## Related Skills

- **Upstream:** `qa-steps` (closure notes reference the QA steps written earlier), `handoff-message` (closure notes summarize what the handoffs documented)
- **Invokes:** `definition-of-done` (appends the DoD checklist)
- **Downstream:** `tone-check` (run closure-note prose through tone check before posting)
- **Phase placement:** Closure notes are pre-review communication. They live in Phase 6 (Communicate) alongside `lessons-learned`, both running at handoff time.

## Voice
Apply the project's voice config (see the project contract's `## Voice` section, e.g. `.agents/style/voice.md`).
Apply it to all generated prose, problem summaries, problems encountered, and follow-up notes. Run the closure notes through `tone-check` before posting to the tracker.

## Privacy

See `security-check` → **Output Privacy** for the centralized rule. In short: no team member names in output — use role references ("a colleague," "the UX lead," "the team"). Exception: the user explicitly says to include a name.

Closure notes are posted to the tracker and visible to the broader team.

## Closure Notes Context
- Always include the issue ref in the heading, using the project contract's Issue ref format (`## Tracker`)
- Reference specific file paths where relevant
- Only include the Follow-up section if there's genuinely ticketable work, not cosmetic notes or "nice to have" observations
- If follow-up work carries security, accessibility, or compliance risk, flag its priority using the project contract's `## Priority guide`

## Status on Closure
When writing closure notes, confirm the ticket has what it needs to close cleanly, then transition
it to the "done" state per the project contract's `## Workflow states`:
- Acceptance criteria marked met
- DoD checklist items confirmed (via the `definition-of-done` skill)
- Any deferred work has a linked follow-up ticket or is noted for creation
- Any pre-close labels/pings owed under the project contract's `## Workflow states` are resolved
- If the ticket was a bug, satisfy the project's bug-closure rule (see the project contract's `## Definition
  of Done`: e.g. an automated test added, or a debt ticket linked)
- Required fields complete per the project contract's `## Required fields` (e.g. implementation details,
  test cases attached, QA steps added)
