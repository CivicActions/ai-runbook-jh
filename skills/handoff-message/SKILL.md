---
name: handoff-message
description: "Writes a structured handoff note at the end of a work session. Use when the user says handoff, write a handoff, I'm done for the day, end of session, picking this up later, or hand this off. Apply when the user is wrapping up work even if they don't say 'handoff'."
---

# Handoff Message

## Project contract
The handoff methodology below is generic, but a few values are **project-specific**. Read them from
`.agents/project-contract.md`:
- **`## Tracker` → Issue ref format**: how to name the issue in the handoff (e.g. `PROJ-123` for
  Jira, `#NNNN` for GitHub).
- **`## Branch / plan conventions`**: branch-name pattern and the plan-file path format used when
  linking the plan (e.g. `.agents/plans/PROJ-[ticket]-plan.md`).
- **`## Environments`**: the validation tooling whose skip/run status is worth noting (e.g.
  Backstop/Pa11y/Cypress on one project contract; lint/test/axe for another stack).
- **`## Attribution marker`**: the shared-artifact marker, if the project defines one.

Handoff storage stays at `.agents/handoffs/` regardless of project contract; that's a deploy-path
convention shared across projects, not a project-specific value. If no project contract is present, keep the
generic behavior and ask the user for the issue-ref format and base branch.

## When to Use
Invoke at the end of a work session to write a structured handoff note, capturing enough context that another engineer (or the same engineer next session) can pick up without losing momentum.

Handoffs are session-bracketed. **One per session, not one per problem.** If you're about to write a second handoff in the same session, the more useful action is usually to keep working, handoffs are for carrying state across chat boundaries, not for tracking sub-steps of a single in-flight effort. If the work has genuinely shifted scope mid-session (e.g. a new ticket pulled in, a different area of the codebase), then a second handoff is warranted, but mark the new one clearly so the trail stays readable.

## Approach

1. **Identify the ticket and branch**, the issue ref in the project contract's `## Tracker` format, branch name (per the project contract's `## Branch / plan conventions`), area of the codebase
1a. **Reference the plan file**, check `.agents/plans/` for a plan file matching the ticket (use the project contract's plan-file path format from `## Branch / plan conventions`, e.g. `[TICKET]-plan.md` or `[TICKET]-implementation-plan.md`); if one exists, link it in the handoff
1b. **Reference prior handoffs**, check `.agents/handoffs/` for earlier handoff files matching the same ticket; if any exist, list each one individually under a "Prior handoffs" field so the reader can trace the full session history. Use the actual filenames, not a glob pattern.
1c. **Include reference links**, if a PR has been opened, include the URL. If there's a tracker link (Jira, GitHub issue, etc.), include it. If there are related PRs or tickets, list them.
2. **Summarize what was completed**, concrete deliverables, not effort
3. **Capture current file state**, which files changed, what the notable lines are
4. **Document decisions and rationale**, why choices were made, tradeoffs accepted
5. **List what was validated**, environments tested, commands run, results observed
6. **Identify known risks and open questions**, anything uncertain or deferred
7. **Write next steps**, concrete, ordered, with commands where applicable

## Output Format

If `.agents/handoffs/` does not exist, create it before writing.
Save to `.agents/handoffs/[TICKET]-[YYYY-MM-DD]-[HHMM]-handoff.md`

```markdown
# Handoff: [TICKET] [Brief Description]

- Session timestamp: [YYYY-MM-DD HH:MM]
- Branch: `[branch-name]`
- Area: [brief description of codebase area]
- Plan: `.agents/plans/[plan-file].md` _(if exists, otherwise omit this line)_
- Prior handoffs: _(list each file individually; omit section if none)_
  - `.agents/handoffs/[TICKET]-[date]-[time]-handoff.md`
  - `.agents/handoffs/[TICKET]-[date]-[time]-handoff.md`

## Context
[1–2 sentences on what this work is and why it matters]

## What was completed
[Bullet list of concrete deliverables]

## Why these choices
[Key decisions and rationale]

## Current file state
[Notable files and line references]

## Validation performed
[What was tested, in which environment, with what result]

## Known risks and open questions
[Anything uncertain, deferred, or needing follow-up]

## Next steps
1. [First concrete step, include command if applicable]
2. [Second step]
3. [Third step]
```

## Voice
Apply `.agents/style/voice.md`. Apply it to all generated text, handoff prose, next steps, risk notes. Run shared handoff prose through `check-tone` before publishing.

## Project-specific notes
- Always include the issue ref in the project contract's `## Tracker` format (e.g. `PROJ-123`, `#NNNN`)
- Reference specific file paths and line numbers where helpful
- Note if any validation tooling from the project contract's `## Environments` was skipped and why (e.g.
  Backstop/Pa11y/Cypress on one project contract; lint/test/axe for a library project)
- Flag any untracked or uncommitted files that are part of the work
- If this companion repo uses a sync/symlink step (see the project's `sync.sh`), and a new skill was
  created during this session, remind the user to run it to wire up the skill

## Git exclusion
Handoff files are personal working artifacts — exclude `.agents/handoffs/` via `.git/info/exclude`, not `.gitignore`. Never add AI runbook working directories to the team-owned `.gitignore`.

## Security

Handoffs live in your personal companion repo (not the official project repo). They're shareable on request for peer review or audit. Treat them as personal artifacts that may end up team-visible, nothing in a handoff should be sensitive.

- **Never include**: credentials, auth tokens, one-time login URLs (e.g. `drush uli`), session IDs, `.env` contents, SSH keys
- **Never include**: PII (user emails, names, addresses), PHI, CUI, client proprietary data
- **Reference URLs and credentials by name, not by value**, `[local admin login URL]` not the actual URL
- **Redact before writing**, if a handoff would naturally contain any of the above, redact before writing the file

Run `security-check` before pasting external content into the handoff session.

## Attribution

Attribution is **conditional on the project contract defining a marker** (see the project contract's `## Attribution
marker` section). If the project contract defines one and you share this handoff with the team (linked in
chat, posted to the tracker, handed to another engineer for pickup, or used to inform a business
decision), end the handoff file with that marker as the last line.

If the handoff is only for your own next session, skip the marker. If the project contract defines no marker
(e.g. public OSS contributions), skip it too. Where a marker exists, don't name the specific AI
tool, it's intentionally tool-agnostic, and the wording is a team convention, not policy text
verbatim (see `security-check`).

### Examples

**Shared** (e.g., handed off to another engineer; marker shown is the one from the active project contract):

```markdown
# Handoff: [TICKET] facet deselect

- Session timestamp: 2026-05-18 14:30
- Branch: `[branch-name]`

## What was completed
- [...]

## Next steps
1. [...]

[attribution marker from project contract, if defined]
```

**Personal use only** (no marker):

```markdown
# Handoff: [TICKET] facet deselect

- Session timestamp: 2026-05-18 14:30
- Branch: `[branch-name]`
[...]
```

## Example

**You ask:** `use the handoff-message skill for PROJ-1234`

**You get:** a file at `.agents/handoffs/PROJ-1234-2026-06-01-1430-handoff.md`:

```
# Handoff: PROJ-1234 Facet deselect scroll lock

- Session timestamp: 2026-06-01 14:30
- Branch: fix/PROJ-1234-facet-scroll
- Area: search filters
- Plan: .agents/plans/PROJ-1234-plan.md

## Context
Page locks after facet deselect; tracked to a stale overflow style.

## What was completed
- Reproduced in browser-check; isolated to overflow lock in filter-button.js

## Why these choices
- Cleared unconditionally in ajaxComplete to avoid the no-results branch gap

## Current file state
- filter-button.js: overflow clear added (~L120)

## Validation performed
- Local: deselect across desktop/tablet/mobile — passes

## Known risks and open questions
- ajaxComplete may race with manual unlock

## Next steps
1. Add regression test
2. Update visual reference shot
3. Verify on higher env
```

## Related Skills

- **Upstream gate:** `security-check` (run before summarizing external content, user reports, or higher-env findings into the handoff)
- **Phase placement:** Handoff is part of the Build phase. It's a mid-work pause/resume mechanic for carrying state across chat sessions. For end-of-work communication (after build is done), use `issue-closure-notes`. For lessons captured at handoff time, use `lessons-learned`.
- **Often references:** `issue-plan` (the plan file is linked from the handoff), prior handoffs in `.agents/handoffs/`
- **Downstream:** `check-tone` (run shared handoff prose through tone check before publishing)
