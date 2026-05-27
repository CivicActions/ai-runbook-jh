---
name: triage
description: "First-touch assessment of a ticket/issue, decline/defer/keep, fill minimum required fields, set initial priority, tag as reviewed. Use when the user says triage this, first pass on this ticket, quick assess this, clean up the backlog, or shares a ticket/issue they're seeing for the first time. Apply for individual items or batches when the goal is a fast keep/cut decision, not a full refinement."
typicalNext: "After triaging, items marked 'Keep' move to `ticket-refinement` for deeper work: write the acceptance criteria, break out implementation details, and estimate LOE. Use the triage results as context for the refinement pass."
---

# Triage

First-touch assessment of a ticket/issue. Decide whether it survives, fill in the minimum required
fields, set an initial priority, and tag it as reviewed. Anything deeper; full acceptance
criteria, implementation details, LOE-readiness; belongs in `ticket-refinement`.

## Project profile
The fields, tags, priority guide, and markup are **project-specific**. Read them from
`.agents/profile.md`:
- **`## Tracker`**: issue-ref format and checkbox/markup for output.
- **`## Required fields`**: the minimum fields to fill (and the Purpose-statement format).
- **`## Review markers / tags`**: the "reviewed" marker and any stakeholder-prioritization tag.
- **`## Priority guide`**: bug priority levels + criteria, and always-high categories.

If no profile is present, ask the user for the project's fields and priority scheme rather than
inventing one.

## When to Use
Invoke for an initial pass on a ticket/issue or batch; deciding whether each survives, filling the
minimum fields, and setting an initial priority. This is the *first* pass, not the *final* pass. A
triaged item should be ready to be picked up later for refinement before estimation. Applies to
backlog reviews, new bug intake, and any "I just opened this and need to figure out what to do with
it" moment.

## Goals
- Cull aggressively, but err toward keep-with-low-priority over decline
- Fill the minimum fields so the item is findable and groupable
- Set an initial priority so it can be sorted against others
- Tag with the profile's review marker so the next reviewer knows it's been touched

## Approach
1. **Decline or defer check**
   - Bug: does it still exist in the current codebase? Verify if uncertain.
   - References a technology no longer in use? Likely decline.
   - Vague to the point of unactionable? Decline or send back to the author.
   - Err toward keep-with-low-priority over outright decline.
2. **Fill in the minimum fields** for kept items; use the profile's `## Required fields` (including
   the Purpose-statement format if the profile defines one).
3. **Set initial priority**: propose a working priority for every kept item so it can be sorted and
   reported on, using the profile's `## Priority guide`:
   - Tech debt / engineering-owned: engineer sets the priority directly.
   - Customer-facing or stakeholder-owned: propose a priority based on visible impact, *and* apply
     the profile's stakeholder-prioritization tag (if defined) so it surfaces in the stakeholder's
     review; the stakeholder can override.
   - Bugs: classify per the profile's bug priority levels.
   - Tasks/features: judgment based on user impact and dependencies.
4. **Flag for deeper refinement**: note items that need a full refinement pass before estimation.
   Use `ticket-refinement` for that work.

## Output Format
For each item (render using the profile's `## Tracker` markup and issue-ref format):

| Item | Decision | Priority (proposed) | Stakeholder Review? | Min Fields Filled | Needs Refinement |
|------|----------|---------------------|---------------------|-------------------|------------------|
| [ref] | Keep / Defer / Decline | [priority] | [stakeholder tag if applicable] | list | Yes / No |

Follow with:
- **Decline list**: items and brief reasons
- **Defer list**: items and conditions for revisiting
- **Refinement queue**: kept items that need `ticket-refinement` before estimation

## Voice
Apply `.agents/style/voice.md` to decision rationales and any prose.

## Security
When triage involves external content (user reports, support tickets, customer emails):
- **Redact PII before ingestion**: names, emails, account IDs replaced with placeholders
- **Strip CUI**: Controlled Unclassified Information must not enter AI prompts
- **Describe the change, not the reporter**: purpose/summary text describes the impact, never the
  person who reported it

Run `security-check` before pasting external user reports or support content.

## Attribution
If the active profile defines an attribution marker (see its `## Attribution marker` section), end
shared output with that marker as the last line. Skip it for personal-use output, or if the profile
defines no marker. Tool-agnostic wording (see `security-check`).

## Related Skills
- **Next step:** `ticket-refinement` for kept items that need deeper refinement before estimation
- **Reference:** `definition-of-done` (used during refinement, not triage)
