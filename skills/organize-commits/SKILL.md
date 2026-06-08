---
name: organize-commits
description: "Organizes unstaged changes into clean logical commits ready to push, following the active project's commit conventions. Use when the user says organize commits, stage my changes, help me commit, prep for a PR, or my changes are a mess. Prefer squash-commits when the user only wants to squash existing commits, not organize working tree changes."
---

# Organize Commits

The git-hygiene methodology here (group by logical unit, one change per commit, stage with
`git add -p`, don't rewrite shared history) is project-agnostic. The commit-message format and
issue-reference convention are project-specific; read them from the profile.

## Project contract
Read project-specific values from `.agents/project-contract.md`:
- **`## Tracker` → Issue ref format**: how to reference a tracker item in a commit subject (e.g.
  `PROJ-123` for Jira, `#NNNN` for GitHub).
- **`## Commit conventions`**: the commit-message format and any subject-line regex the project
  enforces (see "Commit message format" below).
- **`## Branch / plan conventions` → Base branch**: the shared branch (e.g. `develop`); never
  rewrite commits already pushed there.

If no profile is present, ask the user for the project's commit format and issue-ref convention
rather than inventing one. The profile is the single source of truth.

## When to Use
Invoke when the user has unstaged or uncommitted changes and wants them organized into clean, logical commits before pushing.

## Approach

1. **Review the working tree**, run `git status` and `git diff` to understand what changed
2. **Group by logical unit**, identify natural groupings: bug fix, feature, refactor, test, config, docs
3. **Propose a commit sequence**, ordered list of commits, each scoped to one logical change
4. **Write commit messages**, use `commit-message-writer` skill for each proposed commit
5. **Provide the git commands**, exact `git add` / `git add -p` commands to stage each group, followed by the commit

## Output Format
Use the profile's issue-ref format and commit-message format below in place of the `<ISSUE-REF>`
placeholder shown here.

### Proposed Commit Sequence
```
1. <ISSUE-REF> Subject, files / hunks included
2. <ISSUE-REF> Subject, files / hunks included
```

### Commands
```bash
# Commit 1
git add path/to/file path/to/other
git commit -m "<ISSUE-REF> Subject"

# Commit 2
git add -p path/to/file   # select relevant hunks only
git commit -m "<ISSUE-REF> Subject"
```

### Notes
Flag anything that needs a decision before committing, e.g. unrelated changes that belong in a separate ticket, or hunks that mix concerns and need `git add -p`.

## Example

**You ask:** `use the organize-commits skill on my last 6 commits`

**You get:**

```
Proposed Commit Sequence
1. PROJ-1234 Clear overflow lock after facet deselect — filter-button.js
2. PROJ-1234 Add regression test for deselect — tests/e2e/facets.spec.js
3. chore: update visual reference shot — backstop_data/

Commands
git add src/components/filter-button.js
git commit -m "PROJ-1234 Clear overflow lock after facet deselect"

git add tests/e2e/facets.spec.js
git commit -m "PROJ-1234 Add regression test for facet deselect"

git add backstop_data/
git commit -m "chore: update visual reference shot"

Notes
- Ref-shot update is unrelated to the fix; keep it separate so it can be reverted independently.
```

## Related Skills

- **Invokes:** `commit-message-writer` (writes a message for each proposed commit, which in turn invokes `check-tone`)
- **Sibling skills:** `squash-commits` (use when squashing existing commits rather than organizing working-tree changes), `summarize-commits` (use to write the PR description after commits are organized)

## Commit message format
These rules are project-agnostic; apply them on every project:
- Use imperative mood in the subject line.
- One logical change per commit.
- Never rewrite commits already pushed to a shared branch (the profile's `## Branch / plan
  conventions` → Base branch).

The subject prefix and any enforced regex are project-specific. Read them from the profile's
`## Commit conventions` section and prepend the issue ref (profile `## Tracker` → Issue ref format).
If the profile defines a subject-line regex, every generated commit message must match it; surface
that regex to `commit-message-writer` so it produces a conforming subject.

If the profile has no `## Commit conventions` section, fall back to a conventional subject:
`<ISSUE-REF> Subject in imperative mood`; and ask the user whether the project enforces a stricter
format before committing.
