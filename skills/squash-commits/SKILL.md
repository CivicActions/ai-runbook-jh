---
name: squash-commits
description: "Squashes WIP commits into clean commits before merge. Use when the user says squash commits, clean up commits, squash these, combine commits, or I have a bunch of WIP commits. Apply when the user wants to tidy history before opening a PR even if they don't say 'squash'."
---

# Squash Commits

## Project profile
The git mechanics here (interactive rebase, `merge --squash`) are project-agnostic. The
commit-message *format* is project-specific. Read it from `.agents/profile.md`:
- **`## Commit conventions`**: subject-line format, issue-ref prefix, wrap width, and what the body
  should cover. If the profile has no `## Commit conventions` section, fall back to
  `## Tracker` → **Issue ref format** for the prefix and use a sensible default (imperative subject,
  72-char wrap, body explains the why).
- **`## Branch / plan conventions`**: **Base branch** (the target you squash a feature branch into)
  and the branch-name pattern.
- **`## Voice`**: the voice config to apply to the squashed message (see Voice below).
- **`## Attribution marker`**: whether the project defines one (see Attribution below).

If no profile is present, ask the user for the commit-message convention rather than inventing one.

## When to Use
Invoke when the user wants to squash multiple WIP or incremental commits into one clean commit (or a small number of logical commits) before merging.

## Approach

1. **Review the commits to squash**, `git log --oneline` to see the range
2. **Identify the logical groupings**, should this be one commit or a few?
3. **Write the squashed commit message(s)**, following the profile's commit conventions and voice profile
4. **Provide the git commands**, interactive rebase or `git merge --squash`

## Output Format

### Proposed Squashed Message
Format the subject line per the profile's `## Commit conventions` (issue-ref prefix from
`## Tracker` → Issue ref format, imperative description, profile wrap width):
```
[<issue-ref>] Brief imperative description

Optional body explaining what changed and why. Wrap per the profile (default 72 characters).
```

### Commands
Use the profile's **Base branch** wherever a target branch is referenced:
```bash
# Squash last N commits interactively
git rebase -i HEAD~N

# Or squash a branch into one commit from the base branch (see profile Base branch)
git merge --squash <feature-branch>
git commit
```

### Notes
Flag if any commits in the range should be kept separate rather than squashed.

## Voice
Apply the voice config from the profile's `## Voice` section (e.g. `.agents/style/voice.md`) to the
squashed commit message.

## Commit Conventions
Pull the specifics from the profile's `## Commit conventions` section. Convention-independent rules
that hold across projects:
- Imperative mood in the subject line
- Subject prefixed with the issue ref (profile `## Tracker` → Issue ref format), when the project uses one
- Body explains the why, not the how
- Never squash commits already pushed to a shared branch without coordinating with the team

## Related Skills

- **Invokes:** `commit-message-writer` (writes the squashed commit message)
- **Sibling:** `organize-commits` (use when staging working-tree changes from scratch rather than collapsing existing commits)
- **Downstream:** `summarize-commits` (write the PR description after squashing)
