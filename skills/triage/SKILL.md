---
name: triage
description: "First-touch assessment of a ticket/issue, decline/defer/keep, fill minimum required fields, set initial priority, tag as reviewed. Use when the user says triage this, first pass on this ticket, quick assess this, or shares a ticket/issue they're seeing for the first time. The goal is a fast keep/cut decision, not a full refinement."
typicalNext: "After triaging, items marked 'Keep' move to `ticket-refinement` for deeper work: write the acceptance criteria, break out implementation details, and estimate LOE. Use the triage results as context for the refinement pass."
---

# Triage

First-touch assessment of a ticket/issue. Decide whether it survives, fill in the minimum required
fields, set an initial priority, and tag it as reviewed. Anything deeper; full acceptance
criteria, implementation details, LOE-readiness; belongs in `ticket-refinement`.

## Project contract
The fields, tags, priority guide, and markup are **project-specific**. Read them from
`.agents/project-contract.md` (shared contract), then layer `.agents/project-contract.personal.md` on top if it exists (personal entries win where they overlap):
- **`## Tracker`**: issue-ref format and checkbox/markup for output.
- **`## Required fields`**: the minimum fields to fill (and the Purpose-statement format).
- **`## Review markers / tags`**: the "reviewed" marker and any stakeholder-prioritization tag.
- **`## Priority guide`**: bug priority levels + criteria, and always-high categories.

If no project contract is present, ask the user for the project's fields and priority scheme rather than
inventing one.

## When to Use
Invoke for an initial pass on a ticket/issue; deciding whether it survives, filling the minimum
fields, and setting an initial priority. This is the *first* pass, not the *final* pass. A triaged
item should be ready to be picked up later for refinement before estimation. Applies to new bug
intake and any "I just opened this and need to figure out what to do with it" moment.

This skill is the *first* pass only. Refinement and estimation are downstream (`ticket-refinement`).

## Goals
- Cull aggressively, but err toward keep-with-low-priority over decline
- Fill the minimum fields so the item is findable and groupable
- Set an initial priority so it can be sorted against others
- Tag with the project contract's review marker so the next reviewer knows it's been touched

## Audience
Triage output is written for the **next engineer** who will pick the item up (for refinement,
estimation, or work). Lead with developer impact. Flag where coordination with another practice
area is needed (design, QA, DevOps, backend) so the next person knows who to loop in before
starting.

## Approach

### Per-item pass
1. **Decline or defer check**
   - Bug: does it still exist in the current codebase? Verify if uncertain.
   - References a technology no longer in use? Likely decline.
   - Vague to the point of unactionable? Decline or send back to the author.
   - Err toward keep-with-low-priority over outright decline.
2. **Fill in the minimum fields** for kept items; use the project contract's `## Required fields` (including
   the Purpose-statement format if the project contract defines one).
3. **Set initial priority**: propose a working priority for every kept item so it can be sorted and
   reported on, using the project contract's `## Priority guide`:
   - Tech debt / engineering-owned: engineer sets the priority directly.
   - Customer-facing or stakeholder-owned: propose a priority based on visible impact, *and* apply
     the project contract's stakeholder-prioritization tag (if defined) so it surfaces in the stakeholder's
     review; the stakeholder can override.
   - Bugs: classify per the project contract's bug priority levels.
   - Tasks/features: judgment based on user impact and dependencies.
4. **Flag for deeper refinement**: note items that need a full refinement pass before estimation.
   Use `ticket-refinement` for that work.

## Output Format
Render output using the project contract's `## Tracker` markup (issue-ref format, heading and emphasis
markup, monospace for code/paths). One compact block per item; substitute the project's actual
field names from `## Required fields` for the generic ones below:

```
[ref]: [Title]
Decision: Keep / Defer / Decline ([brief rationale])
[Grouping field 1]: [value] | [Grouping field 2]: [value] | Priority: [value] | Review marker: [project contract's marker]
Type: [bug/task/feature/debt/spike] | Scope: [small/medium/large/unknown] | Risk: [low/med/high] | Dependencies: [refs or none]
```

### Common follow-up sections
Follow the per-item output with:
- **Blockers**: items that gate other work
- **Quick wins**: small scope, low risk, high value
- **Needs grooming**: items too vague to estimate, route to `ticket-refinement`
- **Decline list**: items and brief reasons
- **Defer list**: items and conditions for revisiting
- **Refinement queue**: kept items that need `ticket-refinement` before estimation

## Voice
Apply `.agents/style/voice.md` to decision rationales and any prose. Run shared output through
`tone-check` before publishing.

## Security
When triage involves external content (user reports, support tickets, customer emails):
- **Redact PII before ingestion**: names, emails, account IDs replaced with placeholders
- **Strip CUI**: Controlled Unclassified Information must not enter AI prompts
- **Describe the change, not the reporter**: purpose/summary text describes the impact, never the
  person who reported it
- **Do not name team members in output**: refer to colleagues by role ("the UX lead," "the prior contributor") — never by name. Exception: the user explicitly says to include a name.

See `security-check` → **Output Privacy** for team member name rules (use role references, not names).

Run `security-check` before pasting external user reports or support content.

## Attribution
If the active project contract defines an attribution marker (see its `## Attribution marker` section), end
shared output with that marker as the last line. Skip it for personal-use output, or if the project contract
defines no marker. Tool-agnostic wording (see `security-check`).

## Example

**You ask:** `use the triage skill on PROJ-1234`

**You get:**

```
PROJ-1234: Facet deselect locks page scroll
Decision: Keep (repro confirmed, recent regression)
Component: Search | Functional area: Filters | Priority: High | Review marker: triaged
Type: bug | Scope: small | Risk: med | Dependencies: none
```

## Related Skills
- **Upstream gate:** `security-check` (run before pasting user reports, support tickets, or external-author content into the session)
- **Next step:** `ticket-refinement` for kept items that need deeper refinement before estimation
- **Reference:** `definition-of-done` (used during refinement, not triage)
- **Downstream:** `tone-check` (run shared triage prose through tone check before publishing)
