---
name: work-intake
description: "Periodic sweep of the tracker and wiki for everything assigned to you or waiting on you, returned as one copy-pasteable digest. Use when the user says what am I on the hook for, sweep my tickets, what did I miss, catch me up on my queue, or comes back from time off. Answers what is on my plate, not what should I do about any one item."
typicalNext: "The digest is a list, not a decision. Items new to you go to `triage` for a keep/defer/decline call; kept items go to `ticket-refinement`. Stale items usually need a hand-off or a decline, not more grooming."
---

# Work Intake

A periodic sweep of the tracker and wiki for everything assigned to you, mentioning you, or quietly
waiting on you, returned as a single copy-pasteable block. Its job is to make the queue *visible*.
Deciding what any one item deserves is `triage`, downstream.

The failure this exists to prevent is the one nobody notices: work that is technically assigned to
you but has fallen out of your attention. A blocked ticket nobody unblocks, a review nobody chased,
a comment that reads as answered because time passed. Boards surface what is moving. This surfaces
what is not.

## Project contract
Tracker specifics are **project-specific**. Read them from `.agents/project-contract.md` (shared
contract), then layer `.agents/project-contract.personal.md` on top if it exists (personal entries
win where they overlap):
- **`## Tracker`**: which system, the issue-ref format, and the markup for output.
- **`## Workflow states`**: which states count as open, blocked, and awaiting-review, so "stale" and
  "waiting on me" mean what the team means by them.
- **`## Estimation`**: the scale and its owner. Say an item "needs an estimate" in the project's own
  vocabulary; do not assume story points, and do not assume sprints.
- **`## Team context`**: review norms, which tell you whether an unsubmitted review is a real blocker
  or routine.

If no project contract is present, ask for the tracker, the workflow states, and the estimation
vocabulary rather than inventing them. Generic agile words are the single most common way this
skill's output reads as written by someone who does not work here.

## When to Use
Run it on a **regular weekday cadence**, and any time you have been heads-down long enough to suspect
things piled up. Coming back from leave is the highest-value run.

Do not run it mid-task to decide what to do next; that is thrash. This is a sweep, not a feed.

## Goals
- Surface everything with your name on it, including the parts that stopped moving
- Separate *someone is blocked on you* from *this is yours and progressing*
- Name the action, not the ticket title
- Be honest about coverage: a query that failed must not read as a clean result

## Audience
Written for **you**, later, on a different machine, with no memory of this run. Assume the digest
gets pasted somewhere else entirely. That is why the output is one self-contained block and why
every line carries its own ref and URL.

## Approach

### 1. Probe capability before querying
Check which tracker and wiki tools are actually available and say so up front. Self-hosted
(Server/Data Center) instances differ from cloud in ways that matter here: advanced query functions
are often missing, and wiki mention indexing is inconsistent.

**Never let an unsupported query return quietly.** A search that errors out and a search that found
nothing look identical in a digest, and the first one is a hole in the sweep.

When a query is unsupported, fall back to the nearest available search, and mark that section
best-effort in the closing note.

### 2. Sweep the tracker
In priority order:
1. Open items assigned to you (per the contract's `## Workflow states`)
2. Items where you are mentioned recently but are **not** the assignee
3. Items you raised that are now blocked, flagged, or waiting on you
4. Items assigned to you with no movement in 14+ days
5. Items awaiting your review

### 3. Sweep the wiki
1. Pages where you are mentioned recently
2. Comments directed at you with no reply from you
3. Pages you own or authored carrying an open action item or unresolved comment

### 4. Use a fixed lookback, not one matched to the cadence
Keep the recent-activity window at **14 days** even on a daily run. A window sized to the interval
means a single skipped day drops items permanently. An overlapping window means items resurface until
they are actually cleared, and the dedupe on merge absorbs the repetition.

Most runs will be mostly already-seen. That is the window working, not a reason to narrow it.

## Output Format
Use the project contract's `## Tracker` markup. One line per item:

```
- [ ] **<short imperative title>** - <what it is, why it needs you, ref + URL>
```

Grouped under exactly these headings, in this order:

```
### Waiting on me (someone else is stopped until you act)
### Assigned & moving
### Follow-up needed (actionable but not blocking)
### Stale (14+ days no movement)
```

Waiting-on-me leads because it is the only group with someone else's time attached.

Rules:
- **Waiting-on-me has one test: would someone else's work proceed if you acted today?** If the
  honest answer is no, it belongs in another group or nowhere. A mention, an open review, or a
  comment with no reply under it are *signals* worth checking — none of them is the test. The
  common false positives, all of which look identical to a real blocker in a query result:
  - Someone claiming work for themselves ("I'll add a draft for DevOps") reads as an unanswered
    comment, but nothing is owed.
  - A pull request sitting in review is routine unless the project contract's `## Team context`
    says an unsubmitted review blocks the merge.
  - A thread you already handled somewhere else — in a call, in chat, in the code — has no reply
    *in* it, which is not the same as no reply.
  - A ping you sent that went cold is your follow-up to chase, not someone else's move to make.
  When the signal is real but the test fails, downgrade rather than drop: it is `Assigned & moving`
  if it is yours and active, `Follow-up needed` if it requires your action but isn't blocking
  anyone else (cold pings to chase, non-blocking mentions, items you raised), `Stale` if it has
  aged out, and absent if it is none of these.
  A false positive here is expensive out of proportion to its size, because downstream tools rank
  this group highest *on the promise that someone is blocked* — so a wrong row outranks correct
  ones, and the reader learns to distrust the whole section.
- **Title is the action, not the ticket's title verbatim.** "Document sandbox access in the VM setup"
  beats "PROJ-8685". If the reader has to open the ticket to learn what they are being asked to do,
  the line failed.
- Always carry the ref and full URL in the description half.
- Only include a due date if the item actually has one. Do not infer one from a cadence.
- If an item qualifies under two headings, list it **once**, under the more urgent one, with both
  angles folded into the description. Duplicates inflate the queue and get merged inconsistently.
- Empty section: write "None." Keep the heading. Do not pad.
- No preamble, no summary, no commentary inside the block. It is going straight into another tool.
- Put coverage caveats in a short plain-text note **after** the block, never inside it.

## Voice
Apply `.agents/style/voice.md`. The digest is terse by design, but "terse" is not "cryptic": a line
whose meaning depends on context you had at sweep time and will not have at read time is a broken
line.

## Security
This sweep reads real client and project content, and its whole purpose is to move that content to
somewhere more convenient. That combination deserves care.

- **Keep items to titles, refs, and one line of context.** The digest is an index, not an export.
- **Omit sensitive items entirely rather than abbreviating them.** An abbreviated line about
  restricted work still tells you it exists, and still travels. If it should not leave the system,
  it should not be in the block at all. Say how many items you dropped, not what they were.
- **Redact PII** in any quoted comment text.
- Confirm where the digest is going to be pasted before including anything you would not put in that
  destination.

Run `security-check` if the sweep pulls in external-author content (support tickets, customer
correspondence).

## Attribution
If the active project contract defines an attribution marker, end shared output with that marker as
the last line. Skip it for personal-use output; a digest read only by its author is personal use.

## Example

**You ask:** `use the work-intake skill`

**You get:**

```
### Waiting on me (someone else is stopped until you act)

- [ ] **Approve or reject the PROJ-1377 schema so QA can build fixtures** - QA moved the ticket to Blocked naming your sign-off as the gate; two people have the work queued behind it. https://tracker.example/browse/PROJ-1377

### Assigned & moving

- [ ] **Estimate PROJ-1414: front-end AI guidance** - In "Ready for Estimation" since the 23rd; needs an LOE before it can be pulled into an iteration. https://tracker.example/browse/PROJ-1414

### Stale (14+ days no movement)

- [ ] **Unblock or hand off PROJ-1268: lint enforcement** - Assigned to you, blocked since May (~89 days), gated on a tooling decision that may already have landed. Check the blocker first, then proceed or hand off. https://tracker.example/browse/PROJ-1268
```

```
Coverage: comment-mention search fell back to plain text search (advanced query
functions unavailable on this instance), so section 2 is best-effort. Wiki
mention search returned nothing and was replaced by an authored-pages sweep.
```

Note the estimation line borrows the project's vocabulary ("LOE", "iteration") from the contract
rather than defaulting to points and sprints.

Note also what the waiting-on-me line does and does not say. It names who is stopped and what
unblocks them. "Reviewer replied and there is no reply from you" would describe the same ticket
and fail the test — an open thread is a signal, not a blocker.

## Related Skills
- **Next step:** `triage` for any swept item you have not assessed yet
- **Downstream:** `ticket-refinement` for kept items needing depth before estimation
- **Upstream gate:** `security-check` when the sweep ingests external-author content
- **Reference:** `handoff-message` when a stale item's real answer is to give it to someone else
