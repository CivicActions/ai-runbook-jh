---
name: issue-closure-notes
description: "Writes closure notes for a completed ticket/issue. Use when the user says close this ticket, write closure notes, ticket is done, wrap up this ticket, or I'm closing [issue-ref]. Apply when the user is finishing a ticket even if they don't say 'closure notes'."
---

# Issue Closure Notes

## Project profile
The closure-note format and the values around it are **project-specific**. Read them from
`.agents/profile.md`:
- **`## Tracker`**: Issue ref format (e.g. `PROJ-123`, `#NNNN`), section heading markup, monospace
  markup, and output wrapping (whether to wrap copyable output in a code block).
- **`## Workflow states`**: the transition to the "done" state on closure, and any pre-close
  labels/pings still owed (e.g. UXQA/VXQA).
- **`## Priority guide`**: how to flag the priority of any deferred follow-up work.
- **`## Attribution marker`**: the trailing marker (if the project defines one).

If no profile is present, ask the user for the project's tracker conventions rather than inventing
them. The profile is the single source of truth.

## When to Use
Invoke when a ticket is complete and the user wants to write closure notes, a durable record of what was done and what the next engineer needs to know.

## Approach

1. **Summarize the problem and approach**, what was broken or needed, how it was addressed
2. **List changes by commit**, concrete deliverables with commit hashes if available
3. **Note follow-up work**, only if there's genuinely ticketable deferred work

## Output Format

If the profile's Tracker section calls for it (Output wrapping), wrap the copyable output so the
user can paste it directly into the tracker. Use the profile's section heading markup for headings
and its monospace markup for inline code references (file paths, selectors, module names, commit
hashes), NOT a hardcoded syntax.

The structure below is generic. Substitute the profile's markup for `[heading]` and `[monospace]`:

```
[heading] Problem & Approach
[1–2 sentences on what was broken/needed and how it was addressed]

[heading] Changes
[Bullet list: [monospace]commit-hash[/monospace], description of what the commit does]

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

After the closure notes (outside any code block), append the relevant DoD checklist by invoking the `definition-of-done` skill with the ticket type (the profile defines which types exist: e.g. FE/BE/DevOps, or a single PR checklist). The assignee confirms the items before closing.

The DoD lives in one place, `definition-of-done`, so it doesn't drift across QA steps, refinement output, and closure notes.

## Attribution

Closure notes are appended to a ticket/issue. **This skill does not emit a marker.** Instead, if
the active profile defines an attribution marker (see the profile's `## Attribution marker`
section), ensure the **final assembled ticket** ends with that marker as its last line whenever any
section was AI-assisted.

One marker per ticket, at the very bottom, covering everything above it. Skip the marker entirely
if no section was AI-assisted, or if the profile defines no marker (e.g. public OSS contributions).
The marker wording is a team convention, not policy text verbatim (see `security-check`).

### Example (final ticket with closure notes as the last section; markup and marker from the profile)

```
[ticket body...]

[heading] Problem & Approach
Cleared the overflow:hidden lock left behind after facet deselect.

[heading] Changes
* [monospace]a1b2c3d[/monospace], clear lock in ajaxComplete handler
* [monospace]e4f5g6h[/monospace], add regression test

[heading] Summary
PR delivers a clean fix; page stays scrollable after deselect across viewports.

[attribution marker]   <- only if the profile defines a marker
```

## Related Skills

- **Upstream:** `qa-steps` (closure notes reference the QA steps written earlier), `handoff-message` (closure notes summarize what the handoffs documented)
- **Invokes:** `definition-of-done` (appends the DoD checklist)
- **Phase placement:** Closure notes are pre-review communication. They live in Phase 6 (Communicate) alongside `lessons-learned`, both running at handoff time.

## Voice
Apply the project's voice config (see the profile's `## Voice` section, e.g. `.agents/style/voice.md`).
Apply it to all generated prose, problem summaries, problems encountered, and follow-up notes.

## Closure Notes Context
- Always include the issue ref in the heading, using the profile's Issue ref format (`## Tracker`)
- Reference specific file paths and commit hashes where available
- Only include the Follow-up section if there's genuinely ticketable work, not cosmetic notes or "nice to have" observations
- If follow-up work carries security, accessibility, or compliance risk, flag its priority using the profile's `## Priority guide`

## Status on Closure
When writing closure notes, confirm the ticket has what it needs to close cleanly, then transition
it to the "done" state per the profile's `## Workflow states`:
- Acceptance criteria marked met
- DoD checklist items confirmed (via the `definition-of-done` skill)
- Any deferred work has a linked follow-up ticket or is noted for creation
- Any pre-close labels/pings owed under the profile's `## Workflow states` are resolved
- If the ticket was a bug, satisfy the project's bug-closure rule (see the profile's `## Definition
  of Done`: e.g. an automated test added, or a debt ticket linked)
- Required fields complete per the profile's `## Required fields` (e.g. implementation details,
  test cases attached, QA steps added)
