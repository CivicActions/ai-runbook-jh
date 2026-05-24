# ai-runbook-jh

> An AI-assisted ticket workflow: phase-based skills + per-project profiles. Built for and
> battle-tested on front-end work, but the skills are discipline-agnostic — BE/DevOps profiles can
> follow. Runs on whatever AI client a project sanctions, or by hand on paper. The skills stay
> **project-agnostic**; a per-project **profile** supplies every project
> specific. Take what's useful, adapt the rest.

---

## How it works

Each skill is a checklist for one phase. The checklists are generic — they describe *what* to do,
not *which tracker / stack / conventions* a given project uses. Those specifics live in one place: a
project **profile** at `.agents/profile.md`. A skill reads the profile, then produces output in the
project's tracker markup, with the project's fields, priority scheme, Definition of Done, and so on.

This means the same skill works for a Drupal site tracked in Jira and a JavaScript component library
tracked on GitHub — only the profile changes.

## The six phases

**Pre-development**
1. **Triage** — first touch. Keep/defer/decline, fill the minimum required fields, set an initial
   priority, tag as reviewed.
2. **Refinement** — bring to ready-for-estimation: user story, acceptance criteria (or steps to
   reproduce), dependencies, Definition of Done.

**Development**
3. **Plan** — write the approach as a file before touching code.
4. **Build** — implement with simplicity and pattern-alignment checks. Handoffs live here for
   carrying state across sessions.
5. **Validate** — browser, accessibility, responsiveness, performance, peer review.
6. **Communicate** — clean commits, QA steps, closure notes, and a lessons-learned reflection.

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

### Example profiles
- **`profiles/uswds.md`** — a public open-source component library on GitHub (vanilla JS/Sass, no
  Drupal). A good reference for a non-Jira, non-Drupal project.
- **`profiles/_template.md`** — a blank, annotated profile. Copy it to start a new one.
- A client-specific profile (e.g. a federal Drupal project) is typically kept **out of version
  control** — see `.gitignore`. Create your own locally from the template.

### Adding a new project profile
1. `cp profiles/_template.md profiles/<project>.md`
2. Fill in every section for your project (tracker, stack, DoD, conventions, sanctioned AI, etc.).
3. Author `.agents/style/voice.md` at the project root describing how the system should write.
4. Deploy: `PROFILE=<project> PROJECT_ROOT=/path/to/project ./sync.sh`
5. Try one skill on your next ticket.

## Skills by phase

| Phase | Skills |
|---|---|
| Triage | `triage` |
| Refinement | `ticket-refinement`, `definition-of-done` |
| Plan | `issue-plan`, `implementation-details` |
| Build | `frontend-design`, `kiss`, `pattern-alignment`, `handoff-message` |
| Validate | `browser-check`, `accessibility-audit`, `responsive-design`, `performance-frontend`, `frontend-peer-review`, `drupal-critic` |
| Communicate | `organize-commits`, `squash-commits`, `commit-message-writer`, `summarize-commits`, `qa-steps`, `issue-closure-notes`, `lessons-learned` |
| Cross-cutting | `check-tone` (+ the project's `.agents/style/voice.md`) |
| Security | `security-check` |

`browser-check`, `check-tone`, `definition-of-done`, and `implementation-details` are foundation
skills, invoked by others more than used alone. `drupal-critic` applies only when the profile's
stack is Drupal. `security-check` is the pre-flight gate when sensitive data is involved.

## Deployment

`sync.sh` wires the framework into a target project:
- Symlinks each skill directory into the project's `.agents/skills/`.
- Deploys the chosen profile to the project's `.agents/profile.md`.

Override via env vars (see the comments in `sync.sh`): `PROJECT_ROOT`, `CUSTOM`, `PROFILE`.

**Invocation differs by AI client.** Some clients auto-invoke skills by keyword; others require an
explicit `@`-reference and never auto-run. The skill files are the same either way — only how they're
invoked changes.

## Voice is the keystone

Every phase produces prose. Without a project-level `.agents/style/voice.md` defining how the system
should write, output reads like many different writers. Every skill loads the voice config before
generating; `check-tone` is the gate to run drafts through.

## Security posture

The skills are opinionated about what AI is and isn't allowed to do — they're built to line up with
the [CivicActions AI Usage Policy](https://civicactions.atlassian.net/wiki/x/AwC3Ig) and the
[NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework), so the
guardrails below aren't optional extras, they're the point.

**What AI does *not* do:**
- Authenticate to any environment (no login URLs, SSH keys, or SAML tokens)
- Access higher environments (test/stage/prod) on a user's behalf
- Ingest PII, PHI, CUI, client-proprietary, or company-confidential information
- Ship code or take agentic actions; every output is a draft for human review

**Per-project specifics come from the profile:** which AI clients are sanctioned (and which are
banned), which environments are local vs. higher, and whether AI-assisted output carries an
attribution marker. `security-check` is the pre-flight before any sensitive-surface session.

**Guardrails baked into the skills:** browser checks run against the local environment by default;
handoffs and plans carry no credentials, tokens, or PII; triage and refinement redact user data
before ingestion; screenshots are PII-redacted before being saved anywhere persistent.

## Setup

1. Clone `ai-runbook-jh`.
2. Pick or create a profile: copy `profiles/_template.md` to `profiles/<project>.md` and fill it in
   (or start from `profiles/uswds.md` as a worked example).
3. Author `.agents/style/voice.md` at the project root.
4. Run `sync.sh` with the right `PROFILE` and `PROJECT_ROOT`.
5. Try one skill on your next ticket — `qa-steps` is a good low-risk start.

## Notes

- The methodology (six phases, voice keystone, security guardrails) works with any AI client or with
  paper checklists. The phases are durable; the skills are disposable.
- Working artifacts (plans, handoffs, reviews, drafts) are personal/local and git-ignored — they may
  contain ticket details and shouldn't be committed.
