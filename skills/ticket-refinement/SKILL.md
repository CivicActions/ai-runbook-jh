---
name: ticket-refinement
description: "Deeper refinement of a ticket/issue to advance it toward Ready for Estimation or Ready for Dev. Use when the user says refine this ticket, prep this ticket, get this ready for estimation, write up the ticket body, this ticket needs more detail, or fill in the AC. Apply after triage when a ticket needs full acceptance criteria, implementation details, and LOE-readiness."
typicalNext: "Once a refined ticket is selected for development, `issue-plan` writes the implementation plan from the refined ticket content. Estimation (setting LOE) happens in between, owned by the practice area, not this skill."
---

# Ticket Refinement

Takes a triaged ticket and refines it to the point where it can be estimated and pulled into a
sprint. Outputs tracker-ready content for the ticket body.

This is the second pass on a ticket, not the first. If the ticket hasn't been triaged yet, use
`triage` first.

## Project contract

The tracker markup, required fields, workflow-state language, priority guide, and any
estimation/LOE scale are **project-specific**. Read them from `.agents/project-contract.md`:
- **`## Tracker`**: issue-ref format, checkbox/section/monospace markup, and output wrapping for
  the ticket body.
- **`## Required fields`**: the fields a ticket needs (component, functional area, Purpose-statement
  format, etc.) before it advances.
- **`## Workflow states`**: the lifecycle this project uses and the gates between states (what a
  ticket needs to move from refinement-ready to estimation-ready to dev-ready), plus any pre-merge
  review labels (e.g. visual / UX QA) and who pulls work onto the board.
- **`## Priority guide`**: for revisiting the initial priority if scope or risk understanding shifts.
- **`## Estimation`**: the LOE/estimation scale, *if the project contract defines one* (see note below).
- **`## Environments`** / **`## Stack`**: for the project-specific context flags (config exports,
  shared infrastructure, higher-env validation, compliance surfaces).
- **`## Attribution marker`**: the trailing marker for shared output, *if the project contract defines one*.

If no project contract is present, ask the user for the project's fields, workflow states, and markup rather
than inventing them.

> **Estimation/LOE:** refinement gets a ticket *ready* to be estimated; it does not set the LOE
> itself (that's owned by the estimating practice area/team). If the project contract defines a `## Estimation`
> section, reference its scale when flagging what estimation still needs. If it doesn't, flag
> that the ticket is ready for estimation per the project contract's workflow states.

## When to Use

Invoke when a ticket has passed triage and now needs the full description, acceptance criteria,
implementation surface area, and dependency analysis required to move it to the next workflow state
before estimation (see the project contract's `## Workflow states`). The output is intended to be pasted
directly into the tracker ticket body.

## Approach

1. **Confirm scope**: what's in, what's explicitly out
2. **Write the user story**: `As a [user], I want to [action], so that I can [outcome]`
3. **Define acceptance criteria** (for tasks/stories) or steps to reproduce + expected behavior (for
   bugs). Write each criterion as an observable outcome, not an implementation step. A reviewer or
   stakeholder should be able to verify it without reading the diff. Avoid file paths, internal
   naming, and technical shorthand in criterion text; move those details to Technical notes. For
   batched housekeeping or cleanup tickets, describe the end state of the batch rather than
   itemizing each individual fix.
4. **Preserve useful source content**: if the source ticket or epic contains anything that would
   help a person or AI understand, execute, or plan the work — templates, checklists, ordered
   lists, background context, reference structures, scope notes, or open questions — keep it
   verbatim or as a clearly labeled block. Do not summarize it into a single line or drop it
   in the interest of brevity. When in doubt, keep it.
5. **Identify dependencies**: other tickets, modules, environments, people who need to weigh in
6. **Note implementation surface area**: high-level pointers to modules, services, files. The
   detailed `implementation-details` checklist gets generated later, during Plan.
7. **Flag risks and open questions**: anything that needs a decision before work starts
8. **Confirm fields, labels, and priority**: fill the project contract's `## Required fields`; add any
   pre-merge review labels the project contract defines (e.g. visual / UX QA) when the relevant surface changes;
   revisit the initial priority set during triage if scope or risk understanding has shifted, using
   the project contract's `## Priority guide`
9. **Append Definition of Done**: invoke the `definition-of-done` skill for the appropriate subset

## Output Format

Wrap the output per the project contract's `## Tracker` output-wrapping rule (e.g. a code block) so the user
can paste it directly into the tracker, and render headings/checkboxes/monospace using the project contract's
Tracker markup. The structure below is generic; substitute the project contract's markup for the labels and
checkboxes.

Section labels must be bolded using the project contract's tracker markup. For Jira that means
`*Label:*` syntax. Use the project contract's `## Tracker` section for the exact markup rules.

### Task / Story Body

```
*User story:*
As a [type of user], I want to [perform an action], so that I can [achieve a goal/benefit].

*Acceptance criteria:*
* [observable outcome — verifiable without reading the diff; no file paths or internal naming]
* [observable outcome]

*Context/background:*
[1–2 paragraphs setting the stage, what's the world look like now, why does this matter]

*Technical notes:*
[Implementation hints, gotchas, file paths to look at, related modules, no prescribed solutions]

*Questions for refinement:*
* [open question that needs a human decision before estimation]

*Definition of Done:*
[Use @definition-of-done for the appropriate subset]
```

### Bug Body

```
*User story:*
As a [type of user], I want to [perform an action], so that I can [achieve a goal/benefit].

*What's wrong?*
[Current behavior, what users actually see]

*What should happen?*
[Expected behavior, what users should see]

*How to reproduce:*
1. [step]
2. [step]
3. [observed result]

*Technical notes:*
[Hypotheses, file paths, related areas of code]

*Questions for refinement:*
* [open question that needs a human decision before estimation]

*Definition of Done:*
[Use @definition-of-done for the appropriate subset]
```

## Workflow / Lifecycle

Refinement advances a ticket through the project's lifecycle (see the project contract's `## Workflow
states`). Generically:

- **Into estimation-ready**: the ticket needs the implementation surface area, full description,
  acceptance criteria (task) or steps to reproduce (bug), links to related issues, and any required
  labels (e.g. the project contract's pre-merge review labels). This is what refinement delivers.
- **Estimation-ready → dev-ready**: needs LOE set by the estimating practice area/team (per the
  project contract's `## Estimation` scale, if defined). Done in estimation, not refinement.
- **Dev-ready → selected for development**: whoever the project contract names (e.g. PM/practice area) sets
  the working priority and pulls it onto the board.

Flag any ticket that lacks the fields/labels above before moving it forward.

## Project context flags

Surface project-specific risks during refinement, drawn from the project contract's `## Environments`,
`## Stack`, and `## Priority guide`:

- Note if the ticket requires a **config export** (the project contract's config-export command, e.g. for a
  Drupal project).
- Flag if the change touches **shared infrastructure / services** the project contract calls out (e.g. Redis,
  Elasticsearch, SAML, migrations) so dependency review happens.
- Note if **higher-environment validation** (stage / pre-prod / etc.) is required before production.
- Flag **security, accessibility, or compliance** implications (the project contract's always-high
  categories) so they're caught before estimation.
- If **UX or VX changes** are involved and the project contract defines pre-merge review labels, add them and
  note that the relevant team needs to weigh in pre-merge.

(These are the project-specific instances; pull the exact services, commands, and labels from the
project contract rather than assuming a default set.)

## Voice

Apply `.agents/style/voice.md` to context/background prose, technical notes, and open questions. Run the assembled ticket body through `check-tone` before pasting it into the tracker.

## Security

Refined ticket bodies are published to the tracker and visible to the broader team.

- **Redact PII** from any external content folded into the ticket: names, emails, account IDs
- **No CUI** in ticket bodies; Controlled Unclassified Information must not be entered
- **Reference, don't reproduce**: link to internal docs, support ticket IDs, or PR URLs rather than
  pasting their contents

Run `security-check` before pasting external content (user reports, customer emails, support
tickets) into the refinement session.

## Attribution

If the active project contract defines an attribution marker (see its `## Attribution marker` section), end
the **final assembled ticket** with that marker as its last line; one marker per ticket, at the
very bottom, covering everything above it. Skip it for personal-use output, or if the project contract
defines no marker (e.g. public OSS contributions). Tool-agnostic wording (see `security-check`).

**Assembly note:** if you append more AI-assisted sections later (e.g., `qa-steps`,
`definition-of-done`), those appendix skills don't emit their own markers. Move the marker so it
stays the last line of the final assembled ticket.

### Example (final ticket with DoD as the last section before the marker)

```
User story:
As a [type of user], I want to [perform an action], so that I can [achieve a goal/benefit].

Acceptance criteria:
* [observable outcome — verifiable without reading the diff; no file paths or internal naming]
* [observable outcome]

[remaining sections...]

Definition of Done:
[checkbox] Acceptance Criteria are met.
[checkbox] [...]

_AI-assisted draft, reviewed before submission._   <- only if the project contract defines a marker
```

## Example

**You ask:** `use the ticket-refinement skill on PROJ-1234`

**You get:**

```
User story:
As a search user, I want the page to stay scrollable after deselecting a facet, so I can keep browsing results.

Acceptance criteria:
- Deselecting any facet leaves the page scrollable
- No regression on facet checkbox interactions
- Verified on desktop, tablet, mobile

Context/background:
Users report the page locks after deselect; introduced in the recent filter refactor.

Technical notes:
Suspect overflow:hidden left on body by the ajaxSend handler.

Implementation surface area:
Filter button JS; facet AJAX lifecycle. Detailed checklist generated during Plan.

Questions for refinement:
- Should the fix also cover the no-results branch?

Dependencies:
- None

Definition of Done:
[Use definition-of-done]
```

## Related Skills

- **Upstream gate:** `security-check` (run before pasting user reports, support tickets, or external-author content into the refinement session)
- **Upstream:** `triage` (refinement only happens on tickets that survived triage)
- **Invokes:** `definition-of-done` (generates DoD subset)
- **Downstream:** `issue-plan` (once selected for development, writes the implementation plan from
  refined ticket content), `check-tone` (run the assembled ticket body through tone check before publishing)
