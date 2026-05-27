# ai-runbook-jh

> An AI-assisted ticket workflow: a library of short, single-purpose **skills** (Markdown
> checklists, one per phase of work: `triage`, `qa-steps`, `handoff-message`, and 21 more) plus a
> per-project **profile** that names the specifics: your ticket tracker, stack, per-ticket
> Definition of Done, approved AI clients. Battle-tested on front-end work, but the skills are
> discipline-agnostic: the same `triage` skill fits a CSS bug, a backend API change, or an
> infrastructure ticket; a backend or DevOps profile drops in the same way. Runs on whatever AI
> client a project approves, but most useful with agentic chat in an IDE. The skills stay **project-agnostic**;
> the **profile** supplies every project-specific detail. Take what's useful, adapt/remove the rest.

---

## How you use the skills

There's no one right way to run this; freedom is the point. Three common modes:

- **Autonomous chain.** An agent runs the phases end-to-end, invoking skills as their triggers fire. Minimal hand-driving.
  *e.g. you paste the ticket body and say "triage this and bring it to ready-for-estimation"; the agent runs `triage`, then `ticket-refinement`, then `definition-of-done`, and hands back a refined ticket you paste into the tracker.*
- **One-off.** Pull a single skill when you want it. No chain, no agent in charge.
  *e.g. "`@check-tone` on this commit message"; only `check-tone` runs, nothing before or after.*
- **Mix.** Agent drives some phases; you take the wheel for others. Most common in practice.
  *e.g. you write the plan by hand, then say "implement step 2 of `plans/NSF-13412-plan.md`"; the agent runs Build while you steer commits.*

---

## How it works

Each skill is a checklist for one phase. The checklists are generic; they describe *what* to do,
not *which tracker / stack / conventions* a given project uses. Those specifics live in one place: a
project **profile** at `.agents/profile.md`. A skill reads the profile, then produces output in the
project's tracker markup, with the project's fields, priority scheme, Definition of Done, and so on.

This means the same skill works for a Drupal site tracked in Jira and a JavaScript component library
tracked on GitHub; only the profile changes.

> **Looks like:** you run `@triage` on a fresh Jira ticket. The skill reads `.agents/profile.md`,
> sees the tracker is Jira and the priority scale runs Lowest to Highest, and returns output
> wrapped in Jira's `{code}` blocks using your project's priority levels and "reviewed" tag. The
> same skill on the [USWDS](https://github.com/uswds/uswds) component library reads a different
> profile and produces GitHub Markdown with USWDS labels (`Needs: Confirmation`, `Type: Bug`,
> `Affects: Accessibility`) and an a11y-aware priority suggestion. Same skill, different profile.

## The six phases

1. **Triage**: first touch. Keep/defer/decline, fill the minimum required fields, set an initial
   priority, tag as reviewed.
   *Example: a customer-support ticket lands. `@triage` returns "keep, P2-Medium, tagged for review" or "decline; duplicate of NSF-13301".*
2. **Refinement**: bring to ready-for-estimation: user story, acceptance criteria (or steps to
   reproduce), dependencies, Definition of Done.
   *Example: `@ticket-refinement` expands "navbar breaks on mobile" into a user story, three acceptance criteria, two open questions for the PM, and a DoD checklist tailored to your project.*
3. **Plan**: write the approach as a file before touching code.
   *Example: `plans/NSF-13412-plan.md` holds the goal, dependencies (one Drupal SDC + one Sass partial), a numbered implementation-details checklist, branch name, and any open risks.*
4. **Build**: implement with simplicity and pattern-alignment checks. Handoffs live here;
   they carry state across sessions.
   *Example: mid-task your AI session is getting long and drifting; you run `@handoff-message`, paste the resulting summary into a fresh chat, and resume with no context loss.*
5. **Validate**: browser, accessibility, responsiveness, performance, peer review.
   *Example: `@browser-check` opens the page in your local environment, captures screenshots at three viewports, and eyeballs the result against the design.*
6. **Communicate**: clean commits, QA steps, closure notes, and a lessons-learned reflection.
   *Example: `@summarize-commits` turns five "WIP" commits into one PR description paragraph; `@qa-steps` generates a "on stage, navigate to X, expect Y" list for the reviewer.*

## Profiles: how the skills stay generic

A profile is a single Markdown file describing one project. Skills reference its sections by name.
The profile carries these sections (keep the set identical across profiles so skills resolve every
reference):

| Section | What it defines |
|---|---|
| `## Tracker` | Issue-ref format, checkbox/heading/monospace markup, output wrapping |
| `## Required fields` | Minimum fields on triage/refinement, and the purpose-statement format |
| `## Review markers / tags` | "Reviewed" marker, stakeholder-prioritization tag |
| `## Priority guide` | Bug priority levels + criteria, accessibility impact mapping |
| `## Estimation` | LOE scale, who estimates, the estimation-ready gate |
| `## Workflow states` | Lifecycle / board columns, review labels |
| `## Team context` | Team size / review norms (sets review formality) |
| `## Knowledge base` | Where durable knowledge gets filed |
| `## Environments` | Local + higher envs, CI, a11y/visual-regression tooling, URLs |
| `## Stack` | Framework, templates, styling rules, JS conventions, breakpoints, grid, a11y baseline |
| `## Performance budgets` | Page/component perf targets |
| `## Patterns / canon` | Where the canonical components / design source of truth live |
| `## Branch / plan conventions` | Base branch, branch naming, plan-file path |
| `## Commit conventions` | Commit-message format, issue-ref handling |
| `## Definition of Done` | The DoD checklist(s), by type |
| `## Sanctioned AI` | Approved AI clients (code vs. non-code), banned tools, browser MCP |
| `## Voice` | Path to the project's `.agents/style/voice.md` |
| `## Attribution marker` | The AI-assisted-output marker, or none (e.g. public OSS) |

> **Looks like:** an excerpt from `profiles/uswds.md`:
>
> ```markdown
> ## Tracker
> - **System:** GitHub (Issues + Pull Requests)
> - **Issue ref format:** `#NNNN`
> - **Checkbox markup:** `- [ ]` (GitHub Markdown)
>
> ## Priority guide
> USWDS triages by Size, Severity, Priority. Accessibility findings are elevated by default.
> ```
>
> When `@triage` runs in this project it picks up those values and emits a GitHub comment with
> `- [ ]` checkboxes and an a11y-aware priority suggestion. In a Jira project with a different
> profile, the same skill emits `{code}` blocks and that project's priority levels.

### Example profiles
- **`profiles/uswds.md`**: a public open-source component library on GitHub (vanilla JS/Sass, no
  Drupal). A good reference for a non-Jira, non-Drupal project.
- **`profiles/_template.md`**: a blank, annotated profile. Copy it to start a new one.
- A client-specific profile (e.g. a federal Drupal project) is typically kept **out of version
  control**; see `.gitignore`. Create your own locally from the template.

### Adding a new project profile
1. `cp profiles/_template.md profiles/<project>.md`
2. Fill in every section for your project (tracker, stack, DoD, conventions, sanctioned AI, etc.).
3. Author `.agents/style/voice.md` at the project root describing how the system should write.
4. Deploy: `PROFILE=<project> PROJECT_ROOT=/path/to/project ./sync.sh`
   *Example: `PROFILE=uswds PROJECT_ROOT=~/Projects/uswds ./sync.sh` symlinks all 24 skills into `~/Projects/uswds/.agents/skills/` and copies `profiles/uswds.md` to `~/Projects/uswds/.agents/profile.md`.*
5. Try one skill on your next ticket.

## Skills by phase

| Phase | Skills |
|---|---|
| Triage | `triage` |
| Refinement | `ticket-refinement`, `definition-of-done` |
| Plan | `issue-plan`, `implementation-details` |
| Build | `pattern-alignment`, `frontend-design`, `kiss`, `handoff-message`, `organize-commits`, `squash-commits`, `commit-message-writer` |
| Validate | `browser-check`, `accessibility-audit`, `responsive-design`, `performance-frontend`, `frontend-peer-review`, `drupal-critic` |
| Communicate | `summarize-commits`, `qa-steps`, `issue-closure-notes`, `lessons-learned` |
| Cross-cutting | `check-tone` (+ the project's `.agents/style/voice.md`), `security-check` |

`browser-check`, `check-tone`, `definition-of-done`, `implementation-details`, and `security-check` are foundation
skills, invoked by others more than used alone (e.g., `qa-steps` calls `browser-check` under the
hood; you rarely run `browser-check` directly). `drupal-critic` applies only when the profile's
stack is Drupal. `security-check` is the pre-flight gate when sensitive data is involved.

## Deployment

`sync.sh` wires the framework into a target project:
- Symlinks each skill directory into the project's `.agents/skills/`.
- Deploys the chosen profile to the project's `.agents/profile.md`.

Override via env vars (see the comments in `sync.sh`): `PROJECT_ROOT`, `CUSTOM`, `PROFILE`.
*Example: `CUSTOM=~/.profiles/client-x.md PROJECT_ROOT=~/Projects/client-x ./sync.sh` deploys a profile kept outside this repo (useful when client details aren't safe to commit).*

**Invocation differs by AI client.** Some clients auto-invoke skills by keyword; others require an
explicit `@`-reference and never auto-run. The skill files are the same either way; only how they're
invoked changes.

> **Looks like:** in a keyword-driven client you might type "triage this Jira ticket" and the
> agent picks up the `triage` skill automatically. In a strict `@`-reference client (e.g., some
> Claude Code setups) you'd type `@triage` to invoke it explicitly. No skill changes between
> clients; only the invocation does.

## Voice is the keystone

Every phase produces prose. Without a project-level `.agents/style/voice.md` defining how the system
should write, output reads like many different writers. Every skill loads the voice config before
generating; `check-tone` is the gate to run drafts through.

> **Looks like:** a few lines from a project's `.agents/style/voice.md`:
>
> ```markdown
> ## Tone
> Conversational and professional. Direct sentences. Light hedging when genuinely uncertain.
>
> ## What to Avoid
> - Corporate speak: "leverage," "drive value," "passionate about"
> - Em dashes in generated text; use commas, parentheses, or restructure instead.
> ```
>
> When `@check-tone` runs on a draft PR description it flags any em-dash or "leverage" and
> suggests a rewrite that matches the rest of the file.

## Security posture

The skills are opinionated about what AI is and isn't allowed to do; they're built to line up with
the [CivicActions AI Usage Policy](https://civicactions.atlassian.net/wiki/x/AwC3Ig) and the
[NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework), so the
guardrails below aren't optional extras, they're the point.

**What AI does *not* do:**
- Authenticate to any environment (no login URLs, SSH keys, or SAML tokens)
- Access higher environments (test/stage/prod) on a user's behalf
- Ingest **PII** (personal info like names, emails, SSNs), **PHI** (protected health info),
  **CUI** (controlled unclassified info, a federal designation), client-proprietary, or
  company-confidential information
- Ship code or take agentic actions; every output is a draft for human review

**Per-project specifics come from the profile:** which AI clients are sanctioned (and which are
banned), which environments are local vs. higher, and whether AI-assisted output carries an
attribution marker. `security-check` is the pre-flight gate (run it before you start; it asks
"does this work touch sensitive data?" and either green-lights or stops the session).

**Guardrails baked into the skills:** browser checks run against the local environment by default;
handoffs and plans carry no credentials, tokens, or PII; triage and refinement redact user data
before ingestion; screenshots are PII-redacted before being saved anywhere persistent.

## Setup

1. Clone `ai-runbook-jh`.
2. Pick or create a profile: copy `profiles/_template.md` to `profiles/<project>.md` and fill it in
   (or start from `profiles/uswds.md` as a worked example).
3. Author `.agents/style/voice.md` at the project root.
4. Run `sync.sh` with the right `PROFILE` and `PROJECT_ROOT`.
5. Try one skill on your next ticket; `qa-steps` is a good low-risk start.

## Notes

- The methodology (six phases, voice keystone, security guardrails) works with any AI client or with
  paper checklists. The phases are durable; the skills are disposable.
- Working artifacts (plans, handoffs, reviews, drafts) are personal/local and git-ignored; they may
  contain ticket details and shouldn't be committed.

## License

MIT; see [LICENSE](LICENSE).
