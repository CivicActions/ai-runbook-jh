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

## Modes
- **Single-item triage**: one ticket/issue, first-touch assessment. Default mode.
- **Batch / backlog review**: a list of items being worked through. Add the Pre-review bulk prep
  step below before going one-by-one, and prefer the per-item summary block output over the table
  when the review will be read narratively rather than sorted.

In either mode, this skill is the *first* pass only. Refinement and estimation are downstream
(`ticket-refinement`).

### Backlog review phases (context)
A backlog review typically runs in phases. This skill covers Phase 1 only; the rest is coordinated
by the team outside the skill.
1. **Initial pass** *(this skill)*: decline / defer / categorize, fill minimum fields, set initial
   priority, apply the profile's review marker.
2. **Categorize remaining**: validate that bugs still reproduce, fold orphan items into the
   project's grouping scheme (component / area / epic), hand judgment calls to whoever owns the
   functional area.
3. **Prioritize within groupings**: stakeholder / PM sets priority on customer-facing items;
   engineering sets it on tech-debt items. Defer whole low-value groupings if warranted.
4. **Refine and estimate**: in priority order, write the AC, generate implementation details
   (`implementation-details`), estimate LOE, move to Ready for Dev. Use `ticket-refinement` here.

## Goals
- Cull aggressively, but err toward keep-with-low-priority over decline
- Fill the minimum fields so the item is findable and groupable
- Set an initial priority so it can be sorted against others
- Tag with the profile's review marker so the next reviewer knows it's been touched

## Audience
Triage output is written for the **next engineer** who will pick the item up (for refinement,
estimation, or work). Lead with developer impact. Flag where coordination with another practice
area is needed (design, QA, DevOps, backend) so the next person knows who to loop in before
starting.

## Approach

### Pre-review bulk prep (batch mode only)
Before going item-by-item, do the bulk passes that don't need per-ticket judgment. These cut noise
and make the per-item pass faster:
- **Reset stale priorities** to "none" (or the profile's equivalent unset value), so a long-stale
  Medium doesn't masquerade as a deliberate prioritization. Items will get an initial priority
  during the per-item pass.
- **Ensure every item has the profile's required grouping field(s)** (e.g. a component / functional
  area / equivalent from `## Required fields`). Items missing them sort to the top of the per-item
  pass for a fast fill-in.
- **Pull a list of orphan items** (no parent, no grouping, no review marker) so they're visible
  during the per-item pass; the Epic / orphan cleanup step below handles them.

### Per-item pass
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

### Epic / parent and orphan cleanup (batch mode)
Once per-item triage is done on a batch, sweep the parent and orphan picture:
- **Low-value parents (epics, initiatives, etc.)**: parents whose only remaining children are
  Low/Lowest items. Either reassociate the children to the project's grouping scheme so they're
  trackable without the parent, then close the parent; or close both if nothing's worth keeping.
- **Orphan items**: items with no parent and no grouping. Re-tag with a grouping field (per the
  profile's `## Required fields`) if still relevant, decline if not.
- **Other closable parents**: parents whose work has shipped or whose scope no longer applies.

## Output Format
Pick the format that matches the mode:
- **Table** (default for batch mode): scan and sort many items at once.
- **Per-item summary block**: read one item at a time, narratively; better when each item needs
  context the table can't hold. Default for single-item mode.

Render either format using the profile's `## Tracker` markup (issue-ref format, heading and
emphasis markup, monospace for code/paths).

### Table format
For each item:

| Item | Decision | Priority (proposed) | Stakeholder Review? | Min Fields Filled | Needs Refinement |
|------|----------|---------------------|---------------------|-------------------|------------------|
| [ref] | Keep / Defer / Decline | [priority] | [stakeholder tag if applicable] | list | Yes / No |

### Per-item summary block format
One compact block per item, separated by a horizontal rule. Use the profile's emphasis/heading
markup; the field names below are generic, substitute the project's actual field names from
`## Required fields`:

```
[ref] — [Title]
Decision: Keep / Defer / Decline — [brief rationale]
[Grouping field 1]: [value] | [Grouping field 2]: [value] | Priority: [value] | Review marker: [profile's marker]
Type: [bug/task/feature/debt/spike] | Scope: [small/medium/large/unknown] | Risk: [low/med/high] | Dependencies: [refs or none]
```

### Common follow-up sections (both formats)
Follow the per-item output with:
- **Blockers**: items that gate other work
- **Quick wins**: small scope, low risk, high value
- **Needs grooming**: items too vague to estimate, route to `ticket-refinement`
- **Decline list**: items and brief reasons
- **Defer list**: items and conditions for revisiting
- **Refinement queue**: kept items that need `ticket-refinement` before estimation
- **Parent / orphan cleanup** *(batch mode)*: parents to close or reassociate, orphans to re-tag or decline

## Voice
Apply `.agents/style/voice.md` to decision rationales and any prose. Run shared output through
`check-tone` before publishing.

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

## Example

**You ask:** `use the triage skill on PROJ-1234`

**You get:**

```
PROJ-1234 — Facet deselect locks page scroll
Decision: Keep — repro confirmed, recent regression
Component: Search | Functional area: Filters | Priority: High | Review marker: triaged
Type: bug | Scope: small | Risk: med | Dependencies: none
```

## Related Skills
- **Upstream gate:** `security-check` (run before pasting user reports, support tickets, or external-author content into the session)
- **Next step:** `ticket-refinement` for kept items that need deeper refinement before estimation
- **Reference:** `definition-of-done` (used during refinement, not triage)
- **Downstream:** `check-tone` (run shared triage prose through tone check before publishing)
