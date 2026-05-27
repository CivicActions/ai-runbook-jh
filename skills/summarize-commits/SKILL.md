---
name: summarize-commits
description: "Summarizes commits into a PR description, changelog, or sprint summary. Use when the user says summarize these commits, write a PR description, what changed in this branch, write release notes, or sprint summary. Apply when the user shares a git log and wants a human-readable summary."
---

# Summarize Commits

## When to Use
Invoke when the user wants a plain-language summary of what changed across a set of commits, for a PR description, release note, sprint summary, or changelog entry.

## Project profile
Summarizing a range of commits is mostly project-agnostic, but a few touch points are
**project-specific**. Read them from `.agents/profile.md`:
- **`## Tracker` → Issue ref format**: how to cite tickets/issues in the summary (e.g. `PROJ-123`
  for Jira, `#NNNN` for GitHub). Use this format wherever the summary references an issue.
- **`## Tracker` → Output wrapping / markup**: where a PR description or summary lands (a Jira
  comment, a GitHub PR body, a standup post) and how to mark it up. Wrap copyable output per the
  profile (e.g. a code block for Jira ticket output, fenced blocks on GitHub).
- **`## Stack` / `## Environments`**: what counts as a deploy-affecting or compliance-relevant
  change worth flagging (see Project Context below).
- **`## Attribution marker`**: the marker wording (if the profile defines one) and whether it
  applies to the destination surface.
- **`## Voice`**: the voice config path for all generated prose.

If no profile is present, fall back to generic behavior: cite issues however the user references
them, plain Markdown output, no attribution marker.

## Approach

1. **Get the commit range**, ask for `git log --oneline [range]` output or a list of commits
2. **Group by theme**, bug fixes, features, refactors, tests, config, docs
3. **Write in plain language**, what changed and why it matters, not just what files were touched
4. **Calibrate detail level**, PR description needs more detail than a changelog entry

## Output Format

### For a PR Description

Keep the body to **1–4 sentences total** (excluding the marker and "how" line). PR descriptions exist to be skimmed, the diff carries the detail. If the profile defines an attribution marker and any commit being summarized was AI-assisted, end the PR description with that marker as the very last block, followed (or preceded) by a one-sentence "how" line that honestly describes what AI did. Wrap and mark up the output per the profile's Tracker section.

```
[1–4 sentences total. State what the PR fixes/adds and any one or two facts a reviewer needs to know. Link the issue (profile Tracker issue-ref format) if not auto-linked.]

[attribution marker, if the profile defines one and a commit was AI-assisted]
[Honest "how" line, see Attribution section for the full menu of variants.]
```

See `## Attribution` below for full rules.

### For a Changelog / Release Note
```
## [Version or Sprint], [Date]

### Fixed
- [Bug description]

### Added
- [Feature description]

### Changed
- [Refactor or improvement]
```

### For a Sprint Summary
Plain prose grouped by ticket, 1–2 sentences per ticket.

## Voice
Apply the voice config from the profile's `## Voice` section (e.g. `.agents/style/voice.md`) to all
generated prose. Run the result through `check-tone` before publishing.

## Project Context
- Reference issue numbers where known, using the profile's Tracker issue-ref format.
- Note if any change requires a deployment step beyond the project's normal release (per the
  profile's `## Environments` / `## Stack`, e.g. a cache clear, config import, or migration).
- Flag if any change has accessibility, security, or compliance implications (per the profile's
  a11y baseline and priority guide).

## Attribution

Attribution depends on whether the active profile defines a marker (the profile's
`## Attribution marker` section). If it does **not** (e.g. a public OSS project where a marker
reads oddly), skip everything below: human-review the output before posting. The rest of this
section applies when the profile **does** define a marker.

When the output is used as a **PR description**, the marker is mandatory whenever any commit being summarized was AI-assisted; the PR description is the disclosure surface for AI-assisted code. PR descriptions are also capped at **1–4 sentences total**.

- **Marker placement:** at the **bottom** of the PR description as the very last block.
- **Marker wording:** use the exact wording from the profile's `## Attribution marker` section (a team convention, not policy text verbatim; see `security-check` for context).
- **"How" line:** include a one-sentence "how" line accompanying the marker. Disclosure asks for "if/how," not just "if." Be honest about what AI actually did, no boilerplate.
- **Don't name the AI tool**: the marker is intentionally tool-agnostic.

When the output is a **changelog, release note, or sprint summary**, the marker is conditional: apply it if the artifact gets shared (Slack, Confluence, customer-facing notes); skip it if it's for your own review.

### "How" line, pick the one that matches reality

| What AI actually did | "How" line |
|---|---|
| Wrote only this PR description | `AI drafted only the description; production code is human-written.` |
| Wrote tests, not the code | `AI drafted the tests; production code is human-written.` |
| Co-authored, both AI and human edited | `AI co-authored the code ([files/scope]); human-edited and reviewed line by line.` |
| Wrote most/all of the code, you reviewed | `AI authored the code; human-reviewed and edited.` |
| Wrote everything in an agent loop | `AI authored end-to-end (code, tests, description) under human supervision; human-reviewed before submission.` |

A canned "AI drafted the description" line on a PR where AI actually wrote the code understates involvement. The "how" should describe what actually happened.

### Example (whole PR description, 1–4 sentences, AI co-authored the code)

The issue ref (`PROJ-123`) and marker below follow a Jira-style profile. Substitute the active
profile's issue-ref format and attribution marker.

```
Fixes PROJ-123 by restoring focus to the active filter after the result list re-renders. Retries kick in only after the async update completes; existing keyboard handlers are unchanged.

_AI-assisted draft, reviewed before submission._
AI co-authored the code (filter-button.js + regression test); human-edited and reviewed line by line.
```

## Related Skills

- **Upstream:** `organize-commits` or `squash-commits` (summary is easier when commits are clean)
- **Sibling:** `issue-closure-notes` (closure notes are ticket-scoped; summarize-commits is range-scoped, for PR descriptions, sprint summaries, release notes)
- **Downstream:** `check-tone` (run summary prose through tone check before publishing)
