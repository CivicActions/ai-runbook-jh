---
name: commit-message-writer
description: "Writes a well-formed git commit message. Use when the user says write a commit, commit message, what should my commit say, help me commit, or draft a commit. Apply even when the user just says 'commit this' or shares a diff without explicitly asking for a message."
typicalNext: "Run `tone-check` if you want a second pass on the wording before committing."
---

# Commit Message Writer

## When to Use
Invoke when the user wants to write or improve a git commit message, given a diff, a list of changed files, or a plain-language description of what changed.

## Project contract
The commit-message format, issue-ref convention, and any required commit annotations are
**project-specific**. Read them from `.agents/project-contract.md` (shared contract), then layer `.agents/project-contract.personal.md` on top if it exists (personal entries win where they overlap):
- **`## Commit conventions`**: the message format, the required-fields regex (if any), and any
  per-commit annotations this project mandates (e.g. an embedded issue ref, a Release Notes line).
- **`## Tracker` → Issue ref format**: how this project writes an issue reference (e.g. `PROJ-123`
  for Jira, `#NNNN` for GitHub). Use this whenever the convention embeds a ref in the message.
- **`## Voice`**: the voice config to apply to the subject and body.
- **`## Attribution marker`**: only if the project contract defines one (see Attribution below).

If no project contract is present, fall back to the generic methodology below: conventional-commit-style
subject, imperative mood, one sentence, no required ref. Ask the user for the project's commit
convention rather than inventing a ref format.

## Approach

1. **Gather context**, diff, changed files, issue/ticket reference, or description of the change
2. **Identify the change type**: fix / feat / refactor / chore / test / docs / style
3. **Write the message** per the project contract's `## Commit conventions`:
   - Imperative mood ("Add", "Fix", "Remove", not "Added", "Fixed")
   - Apply the project contract's message **Format** (e.g. an embedded issue ref in the project contract's
     `## Tracker` → Issue ref format, or a conventional-commit prefix)
   - 1 sentence, 2 at most, no body block (unless the convention requires one, e.g. a
     Release Notes statement)
   - 10 characters minimum of meaningful subject, 72 characters max
   - Match any required-fields regex the project contract defines
4. **Check tone**, use `tone-check` skill on the drafted message before finalizing
5. **Flag if scope is too broad**, suggest splitting into multiple commits

## Output Format

Output the message in the project contract's commit format, e.g.:

```
[issue-ref or prefix]: Brief imperative description of the change.
```

Provide 1–3 alternatives if the change could be framed multiple ways.

## General conventions
These hold regardless of project:
- Use imperative mood in the subject line
- Keep it to 1 sentence, 2 at most, with no body block unless the convention requires one
- Never include "WIP" in a commit intended for merge
- Separate unrelated changes into separate commits

## Example

**You ask:** `use the commit-message-writer skill on this diff`

**You get:**

```
PROJ-1234: Clear overflow lock after facet deselect.

Alternatives:
  PROJ-1234: Remove stale overflow:hidden after ajaxComplete.
  PROJ-1234: Fix page scroll lock on filter deselect.
```

## Related Skills

- **Invokes:** `tone-check` (validates tone before finalizing any message)
- **Invoked by:** `organize-commits` (writes a message for each proposed commit), `squash-commits` (writes the squashed message)

## Voice
Apply the voice config from the project contract's `## Voice` section (e.g. `.agents/style/voice.md`). Apply
it to the subject line, body, and any alternatives generated.

## Attribution
A commit message is not a shared artifact in the same way a ticket or PR description is, so this
skill does not emit a marker by default. If the active project contract's `## Attribution marker` section
calls for marking AI-assisted commit messages, honor it; otherwise emit none.
