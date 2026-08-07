---
name: squash-commits
description: "Squashes WIP commits into clean commits before merge. Use when the user says squash commits, clean up commits, squash these, combine commits, or I have a bunch of WIP commits. Apply when the user wants to tidy history before opening a PR even if they don't say 'squash'."
---

# Squash Commits

## Project contract
The git mechanics here (interactive rebase, `merge --squash`) are project-agnostic. The
commit-message *format* is project-specific. Read it from `.agents/project-contract.md` (shared contract), then layer `.agents/project-contract.personal.md` on top if it exists (personal entries win where they overlap):
- **`## Commit conventions`**: subject-line format, issue-ref prefix, wrap width, and what the body
  should cover. If the project contract has no `## Commit conventions` section, fall back to
  `## Tracker` → **Issue ref format** for the prefix and use a sensible default (imperative subject,
  72-char wrap, body explains the why).
- **`## Branch / plan conventions`**: **Base branch** (the target you squash a feature branch into)
  and the branch-name pattern.
- **`## Voice`**: the voice config to apply to the squashed message (see Voice below).
- **`## Attribution marker`**: whether the project defines one (see Attribution below).

If no project contract is present, ask the user for the commit-message convention rather than inventing one.

## When to Use
Invoke when the user wants to squash multiple WIP or incremental commits into one clean commit (or a small number of logical commits) before merging.

## Approach

1. **Review the commits to squash**, `git log --oneline` to see the range
2. **Identify the logical groupings**, should this be one commit or a few?
3. **Write the squashed commit message(s)**, following the project contract's commit conventions and voice profile
4. **Provide the git commands**, interactive rebase or `git merge --squash`

## Output Format

### Proposed Squashed Message
Format the subject line per the project contract's `## Commit conventions` (issue-ref prefix from
`## Tracker` → Issue ref format, imperative description, project contract wrap width). Subject line
only — no body — unless the project contract's `## Commit conventions` explicitly requires one (e.g.
a required body annotation or Release Notes statement):
```
[<issue-ref>] Brief imperative description
```
If the project contract requires a body, include it per its format.

### Commands
Use the project contract's **Base branch** wherever a target branch is referenced:
```bash
# Squash last N commits interactively
git rebase -i HEAD~N

# Or squash a branch into one commit from the base branch (see project contract Base branch)
git merge --squash <feature-branch>
git commit
```

### Notes
Flag if any commits in the range should be kept separate rather than squashed.

## Voice
Apply the voice config from the project contract's `## Voice` section (e.g. `.agents/style/voice.md`) to the
squashed commit message.

## Commit Conventions
Pull the specifics from the project contract's `## Commit conventions` section. Convention-independent rules
that hold across projects:
- Imperative mood in the subject line
- Subject prefixed with the issue ref (project contract `## Tracker` → Issue ref format), when the project uses one
- If the project contract's `## Commit conventions` defines an enforced subject-line regex, every squashed
  subject must match it
- Body explains the why, not the how
- Never squash commits already pushed to a shared branch without coordinating with the team

## Example

**You ask:** `use the squash-commits skill on these 4 commits`

**You get:**

```
Proposed Squashed Message
PROJ-1234 Clear overflow lock after facet deselect

Adds a regression test covering the deselect path. Lock was leaking from
the no-results branch of ajaxComplete.

Commands
git rebase -i HEAD~4
# mark commits 2–4 as `squash`

Notes
- WIP commits collapse cleanly; no commit in the range warrants staying separate.
```

## Related Skills

- **Invokes:** `commit-message-writer` (writes the squashed commit message)
- **Sibling:** `organize-commits` (use when staging working-tree changes from scratch rather than collapsing existing commits)
- **Downstream:** `summarize-commits` (write the PR description after squashing)
