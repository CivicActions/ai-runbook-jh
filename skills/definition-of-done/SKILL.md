---
name: definition-of-done
description: "Outputs the appropriate Definition of Done checklist for a ticket type (FE, BE, DevOps), read from the active project profile. Use when the user says DoD checklist, definition of done, append the DoD, what's the checklist, or when another skill (ticket-refinement, qa-steps, issue-closure-notes) needs to append the DoD. Single canonical source so the DoD list doesn't drift across artifacts."
invokedBy: "ticket-refinement, qa-steps, issue-closure-notes"
---

# Definition of Done

Emits the Definition of Done for the active project. Other skills invoke this rather than
duplicating the lists, so the DoD never drifts across artifacts.

## Project contract
The DoD lists, ticket types, and checkbox markup are **project-specific**. Read them from
`.agents/project-contract.md` (shared contract), then layer `.agents/project-contract.personal.md` on top if it exists (personal entries win where they overlap):
- **`## Definition of Done`**: the checklist(s) for this project, keyed by type.
- **`## Tracker` → Checkbox markup**: how to render checkboxes (e.g. `()` for Jira, `- [ ]` for
  GitHub Markdown).

If no profile is present, ask the user for the project's DoD rather than inventing one. The profile
is the single source of truth; if the DoD changes, update the profile, not this skill.

## When to Use
Invoke when a skill or user needs the Definition of Done for a ticket/PR. Identify the type (the
profile defines which exist: e.g. one profile may define FE/BE/DevOps; a GitHub project may have one PR checklist)
and output the appropriate subset.

Most commonly invoked by:
- `ticket-refinement`, appended to the ticket body during refinement
- `qa-steps`, appended after the QA scenarios
- `issue-closure-notes`, confirmed before closing

## Approach
1. **Identify the ticket/PR type** from the profile's Definition of Done section (e.g. FE, BE,
   DevOps, or a single PR checklist)
2. **Identify whether bug or task/story**: bugs may use a smaller subset
3. **Output the relevant checklist** in the profile's checkbox markup
4. **Prune items that don't apply**, but err toward including items that are arguably relevant

## Output Format
Use the checkbox markup from the profile's Tracker section. Output only the relevant subset for the
type. Pull the exact line items from the profile's `## Definition of Done` section; do not
paraphrase or reorder them.

## Pruning Guidance
For bug tickets, the DoD may be smaller than for stories/features. Common prunes:
- Drop visual / UX review-label lines if the change has no relevant surface
- Drop component-specific lines unless the change touches that component
- Drop environment-comparison lines if the change isn't environment-dependent

When in doubt, leave the item in. The assignee can mark "N/A" faster than they can remember a
missing item later.

## Attribution
The checklist is appended to a ticket/PR. **This skill does not emit a marker.** The checklist
itself is canon (not AI-drafted prose), but if you generate it via this skill it still counts as
AI-assisted content.

If the active profile defines an attribution marker (see the profile's `## Attribution marker`
section), ensure the **final assembled artifact** ends with that marker as its last line whenever
any section was AI-assisted; one marker per artifact, at the very bottom, covering everything
above it. Skip it entirely if no section was AI-assisted, or if the profile defines no marker (e.g.
public OSS contributions).

### Example (final ticket with DoD as the last section before the marker)
```
[ticket body...]

[heading] Definition of Done
[checkbox] Acceptance Criteria are met.
[checkbox] [...]

_AI-assisted draft, reviewed before submission._   <- only if the profile defines a marker
```

## Example

**You ask:** `use the definition-of-done skill on PROJ-1234 (frontend bug)`

**You get:**

```
- [ ] Regression test added
- [ ] Manual QA confirmed on desktop, tablet, mobile
- [ ] Visual reference shot updated (or marked unchanged)
- [ ] Linter passes
- [ ] Reviewed by frontend peer
- [ ] Acceptance criteria verified on the project's higher env
```

## Related Skills
- **Invoked by:** `ticket-refinement` (appended during refinement), `qa-steps` (appended after QA
  scenarios), `issue-closure-notes` (confirmed before closing)
