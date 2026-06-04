---
name: lessons-learned
description: "Writes a lessons-learned note after completing a ticket, sprint, or project phase. Use when the user says lessons learned, retrospective, what did we learn, what went wrong, what would I do differently, or I just finished this and want to reflect. Apply at the end of any significant piece of work."
---

# Lessons Learned

## Project profile
The reflection methodology below is generic. A few touchpoints are **project-specific** and read from
`.agents/profile.md`:
- **`## Tracker` → Issue ref format**: how to label the note (e.g. `PROJ-123`, `#NNNN`).
- **`## Voice` → Config path**: the voice file to apply to generated prose.
- **`## Attribution marker`**: whether to append a marker, and its exact wording (skip if the
  profile defines none).
- Recurring-pattern hooks, where lessons get filed, and what a process change should propagate into
  are project-specific too; see **Project Context** below.

If no profile is present, keep the generic behavior: label the note however the user refers to the
work, apply whatever voice convention they have, and ask where the note should live.

## When to Use
Invoke after completing a ticket, sprint, or project phase when the user wants to capture what went well, what didn't, and what to carry forward.

## Approach

1. **Identify the scope**, single ticket, sprint, or larger effort
2. **What went well**, approaches, tools, or decisions that paid off
3. **What didn't go well**, blockers, missteps, or things that cost time
4. **Root causes**, for each thing that didn't go well, what was the underlying reason
5. **What to do differently**, concrete changes to process, tooling, or approach
6. **What to carry forward**, patterns or decisions worth repeating

## Output Format

Label the note with the work's issue reference using the profile's `## Tracker` → Issue ref format
(e.g. `PROJ-123`, `#NNNN`).

```
## Lessons Learned: [Ticket / Sprint / Feature]

### What Went Well
- [item]

### What Didn't Go Well
- [item], root cause: [brief explanation]

### What to Do Differently
- [Concrete change to process, tooling, or approach]

### Carry Forward
- [Pattern or decision worth repeating on future work]
```

## Voice
Apply the voice config named in the profile's `## Voice` section (e.g. `.agents/style/voice.md`).
Apply it to all generated prose, keep it direct and honest, not performative. Run shared lessons-learned notes through `check-tone` before publishing.

## Project Context
- Note if a lesson applies to a recurring pattern in the codebase (the profile's `## Stack` and
  `## Environments` sections name the project's known gotchas, e.g. AJAX form state, Entity Browser,
  container OOM on ARM64, depending on the profile).
- Flag if a lesson has implications for the testing strategy or CI/CD pipeline (see the profile's
  `## Environments` → CI for the pipeline in play).
- Note if a process change should be documented where the project files durable knowledge (e.g.
  the profile's `## Knowledge base`). See **Output goes where** under Related Skills.

## Attribution

If the active profile defines an attribution marker (its `## Attribution marker` section), and you
share this lessons-learned note with the team (linked in Slack, posted to the team wiki, added to
the memory bank, or used to inform a future business or process decision), end the note with that
marker as the last line.

Most lessons-learned notes end up shared or referenced later, that's their purpose, so when the
profile defines a marker, default to including it. Only skip it for private reflections you'll
genuinely read once and discard, or if the profile defines no marker (e.g. public OSS contributions).
Don't name the specific AI tool, the marker is intentionally tool-agnostic. The marker wording is a
team convention, not policy text verbatim (see `security-check`); for a lessons note specifically a
slightly more natural phrasing (e.g. `_AI-assisted reflection._`) is fine if the profile's marker
allows it.

### Examples

**Shared / referenced later, profile defines a marker** (typical case):

```markdown
## Lessons Learned: PROJ-123 filter focus restore

### What Went Well
- [...]

### What Didn't Go Well
- [...]

### Carry Forward
- [...]

_AI-assisted draft, reviewed before submission._   <- only if the profile defines a marker
```

**Private one-time reflection, or no profile marker** (no marker):

```markdown
## Lessons Learned: PROJ-123 filter focus restore

### What Went Well
- [...]
```

## Example

**You ask:** `use the lessons-learned skill on PROJ-1234`

**You get:** a file at `.agents/lessons/PROJ-1234-lessons.md`:

```
## Lessons Learned: PROJ-1234 facet deselect scroll lock

### What Went Well
- Reproducing in browser-check first surfaced the ajaxComplete race quickly.

### What Didn't Go Well
- First fix attempt (mousedown handler) only treated the symptom.
  Root cause: didn't audit all overflow-toggling paths before patching.

### What to Do Differently
- For scroll-lock bugs, enumerate every overflow toggle path before choosing a patch site.

### Carry Forward
- The "reproduce in browser-check first" habit is paying off; keep doing it for AJAX-state bugs.
```

## Related Skills

`lessons-learned` lives at the end of the Communicate phase. It runs at handoff time, alongside `issue-closure-notes`, while the work is still fresh, before the ticket leaves your hands for downstream review (e.g. visual/UX QA, code review, QA per the profile's `## Workflow states`).

- **Phase placement:** end of Phase 6 (Communicate), not a separate phase. Reflection happens as you hand off, not after merge. By the time the ticket is Done, you're already on the next thing.
- **Upstream:** all prior phase artifacts (plan, handoffs, closure notes) feed into the reflection
- **Sibling:** `issue-closure-notes` (the comms artifact); this is the discipline artifact
- **Downstream:** `check-tone` (run shared lessons through tone check before publishing)
- **Output goes where:** `.agents/lessons/`, plus wherever the project files durable knowledge (the
  profile's `## Knowledge base`). Lessons that change process should
  also propagate back into the skills themselves.
