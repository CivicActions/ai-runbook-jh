---
name: issue-plan
description: "Writes an implementation plan for a ticket/issue. Use when the user says plan this ticket, plan this issue, break this down, what's the approach, stub out this ticket, or I need to write up a ticket. Apply when the user wants to think through a ticket/issue before starting work."
typicalNext: "After writing the plan file, open it in a fresh chat and start implementation (e.g. `implement <plan-path>`) so the implementer runs with the full plan in view. The plan is your working document for the Build phase."
---

# Issue Plan

## Project contract
The plan-file path, branch convention, base branch, workflow gating, and project context are
**project-specific**. Read them from `.agents/project-contract.md` (shared contract), then layer `.agents/project-contract.personal.md` on top if it exists (personal entries win where they overlap):
- **`## Branch / plan conventions`**: where to write the plan file, the branch-naming format, and
  the base branch.
- **`## Workflow states`**: the state at which a plan is appropriate (after triage/refinement, when
  the item is ready for development).
- **`## Priority guide`, `## Environments`, `## Stack`**: for flagging risk, env steps, and
  compliance implications in project terms.

If no project contract is present, ask the user where plans live and what the branch convention is.

## Output
**ALWAYS write the plan to the file path defined in the project contract's `## Branch / plan conventions`**
(named for the ticket/issue) and stop. Do NOT begin implementing any steps. Do NOT create files,
run commands, or modify code. The plan is the only deliverable.

Before writing, check for existing files in `.agents/plans/`. The contract path is authoritative;
existing files may inform slug formatting only when consistent with the contract (e.g. if the
contract specifies `NSF-[ticket]-plan.md` and existing files use a description slug like
`NSF-13747-select-file-plan.md`, adopt the slug format). If existing files contradict the contract,
follow the contract.
If `.agents/plans/` does not exist, create it before writing.

After writing the file, tell the user where the plan was saved and ask if they'd like to proceed
with implementation.

## When to Use
Invoke to plan a ticket/issue before implementation; breaking the work into ordered steps,
identifying risks, and clarifying acceptance criteria.

## Approach
1. **Understand the item**: the goal, what's in scope, what's explicitly out of scope
2. **Identify dependencies**: other tickets, modules, environments, or people needed
3. **Inspect the source branch** (if one exists): read the diff, understand what's already built,
   what config/code state the plan inherits. Don't plan work that's already done. If the ticket
   references a parent branch, feature branch, or upstream PR, run `git diff` and read the
   relevant files to ground the plan in the actual current state, not a remembered or assumed state.
4. **Break down the work**: ordered, concrete, actionable implementation steps
5. **Define acceptance criteria**: what does done look like, how will it be verified
6. **Flag risks**: anything that could block progress or require a decision
7. **Estimate complexity**: small / medium / large / spike
8. **Generate task list**: use `implementation-details` to produce a concrete ordered task set
9. **Include branch creation**: first implementation step creates a feature branch from the
   project contract's base branch, named per the project contract's branch convention
10. **Map skill usage**: scan `.agents/skills/` for skills relevant to the plan's execution phases
    (build, validate, pre-push, session end). Include a skill-usage table showing which skills fire
    at which point. Exclude skills that don't apply and state why.

## Project context
Flag, in the project's terms (read from the project contract):
- Environment steps the change requires (e.g. config export); see `## Environments`
- Whether the change touches shared infrastructure or carries elevated risk; see `## Priority guide`
- Whether higher-environment validation is required before production; see `## Environments`
- Security, accessibility, or compliance implications, classified per the project contract's priority scheme

## Workflow gating
A plan is written once an item reaches the project contract's "ready for development" state (triage and
refinement have already produced the AC, implementation details, LOE, and priority). The plan is the
implementer's working document, not a refinement artifact. If the item isn't there yet, the right
skill is `triage` (first touch) or `ticket-refinement` (deeper refinement), not this one.

## Workflow-state field requirements
End the plan with a checklist of the remaining workflow states ahead of the work and the fields
that must be filled to enter each one. Read both the state sequence and the per-state required
fields from the project contract (`## Workflow states` and `## Required fields`); don't hardcode them here.

Generic shape (substitute the project contract's actual states and fields):

```
- [State A] → needs: [field, field, field]
- [State B] → needs: [field, field], plus [tag] if [condition]
- [State C] → needs: [field set by which role]
- [State D] → needs: [field set by which role]
```

The implementer ticks each off as the work progresses, so the item moves through the workflow
without stalling on missing required fields.

## Voice
Apply `.agents/style/voice.md` to goal descriptions, risk notes, and open questions. Run shared
plan prose through `tone-check` before publishing.

## Git exclusion
Plan files are personal working artifacts; exclude `.agents/plans/` via `.git/info/exclude`, not `.gitignore`. Never add AI runbook working directories to the team-owned `.gitignore`.

## Security
Plan files are personal artifacts that may end up team-visible (shareable on request for peer review
or audit):
- **No credentials, tokens, or auth URLs** in plan files
- **No PII**: describe the change, not the user who reported it
- **No CUI or client-confidential content**: link to internal docs by reference, don't paste them

## Attribution
If the active project contract defines an attribution marker (see its `## Attribution marker` section), end a
shared plan with that marker as the last line. Skip it for a personal-only plan, or if the project contract
defines no marker. Don't name the specific AI tool (see `security-check`).

## Example

**You ask:** `use the issue-plan skill on PROJ-1234`

**You get:** a file at `.agents/plans/PROJ-1234-plan.md`:

```
# Plan: PROJ-1234 Facet deselect scroll lock

Goal: clear overflow:hidden after facet deselect; add regression test.
Out of scope: rework of facet UI; perf tuning.

Approach
  1. Reproduce in browser-check on local.
  2. Trace overflow toggle paths in filter-button.js.
  3. Clear overflow unconditionally in ajaxComplete.
  4. Add regression test in the project's test framework.

Risks: ajaxComplete may race with manual unlock.
Branch: fix/PROJ-1234-facet-scroll  (base: develop)

Implementation details: (generated checklist)
Workflow-state requirements: (per the project contract)
```

## Related Skills
- **Upstream:** `triage` (first touch), `ticket-refinement` (deeper refinement, produces the AC and
  IDs this plan elaborates)
- **Invokes:** `implementation-details` (the plan includes a generated IDs checklist)
- **Pairs with:** `evidence-check` (the plan's approach and surface-area claims run through the recommendation protocol: state what was checked, cite it, flag the unverified parts)
- **Downstream:** `handoff-message` (the plan is linked from each session's handoff so the trail is
  traceable), `tone-check` (run shared plan prose through tone check before publishing)
