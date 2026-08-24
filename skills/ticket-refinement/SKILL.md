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
estimation/LOE scale are **project-specific**. Read them from `.agents/project-contract.md` (shared contract), then layer `.agents/project-contract.personal.md` on top if it exists (personal entries win where they overlap):
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

Invoke when a ticket has passed triage and now needs the full description, acceptance criteria, and technical context required to move it to the next workflow state before estimation (see the project contract's `## Workflow states`). The output is intended to be pasted directly into the tracker ticket body.

## Approach

1. **Classify the ticket type** before writing anything else. Choose one:
   - **Bug**: something is broken — a feature exists but behaves incorrectly, produces wrong output, or fails in a reproducible way. Use the Bug Body template.
   - **Task / Story**: new functionality, a configuration change, a cleanup, or an improvement to existing behavior that isn't broken. Use the Task / Story Body template.

   Base the classification on the source ticket content and any codebase evidence gathered. If the source ticket was filed as a Task but investigation reveals a defect (wrong behavior, not just missing behavior), reclassify it as a Bug and note the reclassification in chat before writing the body. Do not defer this decision — pick the template first, then write.

2. **Confirm scope**: what's in, what's explicitly out
3. **Write the user story**: `As a [user], I want to [action], so that I can [outcome]`
4. **Define acceptance criteria** (for tasks/stories) or steps to reproduce + expected behavior (for
   bugs). Write each criterion as an observable outcome, not an implementation step. A reviewer or
   stakeholder should be able to verify it without reading the diff. Avoid file paths, internal
   naming, and technical shorthand in criterion text; move those details to Technical notes. For
   batched housekeeping or cleanup tickets, describe the end state of the batch rather than
   itemizing each individual fix.
5. **Preserve useful source content (CRITICAL: do not lose context)**: if the source ticket or
   epic contains anything that would help a person or AI understand, execute, or plan the work,
   keep it verbatim or as a clearly labeled block. Do not summarize it into a single line or drop
   it in the interest of brevity. When in doubt, keep it.

   Specifically, NEVER drop or summarize away:
   - **Links** (Confluence, docs, setup guides, external references, related tickets)
   - **Environment or tooling prerequisites** (VM setup, special hardware, credentials needed)
   - **Reproduction-critical details** (specific URLs, browser/AT versions, device configurations)
   - **Quoted conversations** that contain diagnostic observations or ruling-out info
   - **Attachments, screenshots, or video references**
   - **Workarounds or partial fixes** already attempted

   These should appear in the refined body in their original form (or lightly reformatted for
   readability). A link to a Confluence page about NVDA setup, for example, is not "context you
   can paraphrase": it's an actionable prerequisite the developer needs. Embed it where a
   developer would look for it (usually Context/background or Technical notes).
6. **Fold dependencies and surface area into Technical notes**: other tickets, modules, services, files, and people who need to weigh in all go in Technical notes as bullets; no separate sections.
7. **Answer open questions first, then flag what remains**: if the ticket already has open questions, attempt to resolve them using available context (codebase, config, existing docs, triage notes) before listing them as still-open. Only surface a question if it genuinely cannot be answered from what's available. The goal is to reduce open questions, not accumulate them.

   Questions that can be resolved by reading the codebase (e.g. "what selector targets X?", "which file handles Y?") must be answered in Technical notes, not listed as open questions. Open questions are for decisions that require another person or external input — things like scope calls, product decisions, confirmation from a stakeholder, or investigation that requires running the site.
8. **Accessibility bugs: map WCAG criteria**: if the ticket is an accessibility bug (Component =
   Accessibility, or the issue describes an AT/keyboard/perceivability failure), identify the
   specific WCAG 2.1 success criteria violated and recommend them as Jira labels in the format
   `WCAG-X.X.X` (e.g. `WCAG-4.1.2`, `WCAG-2.4.7`). Use the `accessibility-wcag` skill's
   checklist and process reference to determine the correct criteria. Include multiple labels if
   more than one criterion applies. These labels go in the "Recommended fields" output alongside
   Component, Priority, etc.
9. **Confirm fields, labels, and priority**: fill the project contract's `## Required fields`; add any
   pre-merge review labels the project contract defines (e.g. visual / UX QA) when the relevant surface changes;
   revisit the initial priority set during triage if scope or risk understanding has shifted, using
   the project contract's `## Priority guide`
10. **Append Definition of Done**: invoke the `definition-of-done` skill for the appropriate subset, then prune items that genuinely don't apply to this ticket. Base pruning on the ticket type and surface area:
    - Drop visual/UX review-label lines if the change has no visual or UX surface (e.g. a config-only or backend-only change).
    - Drop the layout builder palette contrast line if the change doesn't touch a layout builder component.
    - Drop environment-comparison lines if the change is internal-only or has no user-facing output to compare.
    - For bugs, the DoD is typically smaller than for features — err toward dropping items that are clearly N/A rather than leaving everything in.
    - When in doubt, leave the item in. An assignee can mark "N/A" faster than they can remember a missing item later.

## Output Format

**Save the ticket body to a file** at `.agents/reports/[ISSUE-KEY]-refined.txt` rather than emitting it in a chat code block. Chat code blocks impose a fixed column width that causes long lines to wrap and paste into Jira as hard line breaks. A plain `.txt` file copies cleanly with no wrapping artifacts.

The file must use the tracker's native markup throughout — read from the project contract's `## Tracker` section. Apply it consistently to section labels, checkboxes, bullets, and inline code identifiers (file paths, function names, class names, variables). No markdown conventions in the file; the output is for the tracker, not for a markdown renderer.

Section labels must be bolded using the project contract's tracker markup. For Jira that means
`*Label:*` syntax. Use the project contract's `## Tracker` section for the exact markup rules.

After saving, tell the user the file path so they can open and copy from it directly.

### Suggested title

Always output 1–3 suggested titles **in chat** (not in the file) before reporting the file path. Titles should be concise, action-oriented, and specific enough to distinguish the ticket from similar work. Lead with the affected area or component, not generic verbs like "Fix" or "Update" when a more specific framing exists.

```
Suggested title(s):
1. [Primary option — clearest and most specific]
2. [Alternative if primary is debatable]
```

### Task / Story Body

```
*Purpose:*
[Audience]: [Value statement in plain language, stakeholder-readable. See project contract Purpose statement format.]

*User story:*
As a [type of user], I want to [perform an action], so that I can [achieve a goal/benefit].

*Acceptance criteria:*
* [observable outcome, verifiable without reading the diff; no file paths or internal naming]
* [observable outcome]

*Context/background:*
[1–2 paragraphs setting the stage, what's the world look like now, why does this matter]

*Technical notes:*
[Hypotheses, file paths, related areas of code, high-level surface area (modules, services, files likely affected), dependencies (other tickets, people who need to weigh in). Prefer concise bullets. Lead each bullet with the key fact; save full sentences for genuinely complex reasoning that can't be compressed. Detailed implementation checklist is generated during Plan via `issue-plan` + `implementation-details`.]

*Definition of Done:*
[Use @definition-of-done for the appropriate subset]
```

### Bug Body

```
*Purpose:*
[Audience]: [Value statement in plain language, stakeholder-readable. See project contract Purpose statement format.]

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
[Hypotheses, file paths, related areas of code, and high-level implementation surface area (modules, services, files likely affected). Prefer concise bullets over prose paragraphs. Lead each bullet with the key fact; save full sentences for genuinely complex reasoning that can't be compressed. Detailed implementation checklist is generated during Plan via `issue-plan` + `implementation-details`.]

*Questions for refinement:*
* [open question that needs a decision before estimation]

*Definition of Done:*
[Use @definition-of-done for the appropriate subset]
```

> **Context preservation check (run before finalizing):** Compare the refined body against the
> source ticket. Every link, URL, doc reference, prerequisite instruction, and quoted diagnostic
> observation from the original must appear somewhere in the refined output. If something was
> dropped, add it back. Conciseness never justifies losing actionable information.

## Workflow / Lifecycle

Refinement advances a ticket through the project's lifecycle (see the project contract's `## Workflow
states`). Generically:

- **Into estimation-ready**: the ticket needs a full description, acceptance criteria (task) or steps to reproduce (bug), technical notes covering surface area and dependencies, links to related issues, and any required labels (e.g. the project contract's pre-merge review labels). This is what refinement delivers.
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

## Verbosity

Ticket bodies are read by humans under time pressure. Every sentence competes for attention.

**Principles:**
- One fact per bullet. No compound sentences.
- Technical notes orient the developer; they don't explain the fix. If it's discoverable in the code or PR, don't write it here.
- Context/background: 1–2 sentences max. If you need more, the ticket is too big.
- User story: keep the formula, drop the filler. "As a developer, I want X, so Y" — not "As a developer working on the NSF.gov platform, I want to be able to X in order to ensure that Y."
- Acceptance criteria: observable outcomes only. "Tests pass" not "All 9 test cases in the spec file execute successfully without failures."
- Prune the DoD to what actually applies. A test-only change doesn't need visual regression, responsiveness, or browser console checks.

**Anti-patterns:**
- Restating the title in the user story
- Explaining *why* the fix works (that's PR description territory)
- Listing every file that might be touched (one primary file is enough; the rest is discoverable)
- Hedging language ("This might be related to...", "It's possible that...")
- Repeating information across sections

**Test:** If a section could be deleted and the developer would still know what to do, delete it.

## Voice

Apply `.agents/style/voice.md` to context/background prose, technical notes, and open questions. Run the assembled ticket body through `tone-check` before pasting it into the tracker.

## Security

Refined ticket bodies are published to the tracker and visible to the broader team.

- **Redact PII** from any external content folded into the ticket: names, emails, account IDs
- **No CUI** in ticket bodies; Controlled Unclassified Information must not be entered
- **Reference, don't reproduce**: link to internal docs, support ticket IDs, or PR URLs rather than
  pasting their contents
- **Do not name team members in output**: refer to colleagues by role ("the UX lead," "the prior contributor") — never by name. Exception: the user explicitly says to include a name.

See `security-check` → **Output Privacy** for team member name rules (use role references, not names).

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
* [observable outcome, verifiable without reading the diff; no file paths or internal naming]
* [observable outcome]

[remaining sections...]

Definition of Done:
[checkbox] Acceptance Criteria are met.
[checkbox] [...]

_AI-assisted draft, reviewed before submission._   <- only if the project contract defines a marker
```

## Example

**You ask:** `use the ticket-refinement skill on PROJ-1234`

**You get (in chat):**

```
Suggested title(s):
1. Facet deselect: restore page scroll after filter toggle
2. Search page locks after facet deselect
```

Ticket body saved to `.agents/reports/PROJ-1234-refined.txt`.

**Contents of `.agents/reports/PROJ-1234-refined.txt`:**

```
*User story:*
As a search user, I want the page to stay scrollable after deselecting a facet, so I can keep browsing results.

*Acceptance criteria:*
* Deselecting any facet leaves the page scrollable.
* No regression on facet checkbox interactions.
* Verified on desktop, tablet, mobile.

*Context/background:*
Users report the page locks after deselect; introduced in the recent filter refactor.

*Technical notes:*
* Suspect overflow:hidden left on body by the ajaxSend handler.
* Surface area: filter button JS, facet AJAX lifecycle (detailed checklist during Plan).

*Definition of Done:*
[Use definition-of-done]
```

## Related Skills

- **Upstream gate:** `security-check` (run before pasting user reports, support tickets, or external-author content into the refinement session)
- **Upstream:** `triage` (refinement only happens on tickets that survived triage)
- **Invokes:** `definition-of-done` (generates DoD subset)
- **Downstream:** `issue-plan` (once selected for development, writes the implementation plan from
  refined ticket content), `tone-check` (run the assembled ticket body through tone check before publishing)
