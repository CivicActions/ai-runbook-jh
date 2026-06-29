# Quickstart

First-time install. For subsequent skill updates, see [Keeping skills current](#keeping-skills-current).

---

## Prerequisites

- `ai-runbook-jh` cloned somewhere on your machine (e.g. `~/Sites/ai-runbook-jh`)
- A project repo you want to wire it into (the "target project")

---

## Step 1: Create a project contract

A project contract is a single Markdown file that tells skills everything project-specific: tracker, stack, DoD, voice config, sanctioned AI, branch conventions, and more. Skills stay generic; the project contract supplies the details.

Copy the template and fill it in (or have your AI do a first pass from a project description):

```bash
cp contracts/_template.md contracts/<project>.md
```

Then open `contracts/<project>.md` and fill in every section. Keep all section headings intact; skills resolve references by name, so a missing section means a skill falls back to generic behavior. See `contracts/uswds.md` for a worked example.

**Optional validation tip:** run a second model/client pass on the finished contract before first use. Validate that all required sections are present, no placeholder `<...>` tokens remain, and sanctioned-AI plus branch/plan conventions are concrete.

**Security note:** client-specific project contracts can contain internal URLs, tracker formats, and team conventions that shouldn't be public. In a companion repo, prefer local-only exclusion via `.git/info/exclude` for contract files. Use `.gitignore` only when you intentionally want a shared team-wide ignore rule.

---

## Step 2: Run install.sh

```bash
export CONTRACT=<project> PROJECT_ROOT=/path/to/your/project
./install.sh
```

Creates `.agents/skills/`, `.agents/style/`, `.agents/prompts/custom/`, and artifact directories (`.agents/plans/`, `.agents/handoffs/`, `.agents/lessons/`), scaffolds `voice.md` and `voice.personal.md` from templates, then symlinks skills and deploys the contract. Safe to re-run; existing files are never overwritten.

---

## Step 3: Customize voice.md

Every skill loads `.agents/style/voice.md` before generating prose. `tone-check` uses it as its gate. Without it, output reads like different writers each time.

The install step copies the baseline template, which is usable as-is. Tune it to match how the team actually writes (tone, avoid-lists, technical writing patterns), and commit it so the whole team gets consistent output.

**Personal overlay:** `.agents/style/voice.personal.md` lets individuals override the shared baseline. Gitignore it; don't commit it.

---

## Step 4: Verify

```bash
# Skills are symlinked
ls .agents/skills/

# Contract is linked
ls -la .agents/project-contract.md

# Artifact directories exist
ls .agents/plans .agents/handoffs .agents/lessons

# Voice config exists
ls .agents/style/voice.md
```

Try a skill to confirm invocation works:

```
@qa-steps
```

**GitHub Copilot** (VS Code agent mode, cloud agent, code review, CLI): no extra steps. Copilot natively scans `.agents/skills/` and auto-selects skills based on your prompt and each skill's `description`. The symlinks created by `install.sh` are sufficient.

**Amazon Q** (IDE): skills in `.agents/prompts/custom/` need a corresponding symlink in `~/.aws/amazonq/prompts/` before `@skill-name` works. `sync.sh` creates the `.agents/prompts/custom/` symlinks; the final link into `~/.aws/amazonq/prompts/` is set up separately (see [FAQ](FAQ.md)).

---

## What you now have

25 skills covering the full ticket lifecycle:

| Phase | Skills |
|---|---|
| Triage | `triage` |
| Refinement | `ticket-refinement`, `definition-of-done` |
| Plan | `issue-plan`, `implementation-details` |
| Build | `pattern-alignment`, `component-design`, `kiss`, `handoff-message`, `organize-commits`, `squash-commits`, `commit-message-writer` |
| Validate | `browser-check`, `accessibility-audit`, `responsive-design`, `performance-frontend`, `frontend-peer-review`, `drupal-peer-review` |
| Communicate | `summarize-commits`, `qa-steps`, `issue-closure-notes`, `lessons-learned` |
| Cross-cutting | `tone-check`, `security-check`, `evidence-check` |

Invoke with `@` in Amazon Q or let Copilot auto-select based on your prompt. See [FAQ](FAQ.md) for per-client invocation details.

---

## Keeping skills current

`sync.sh` is the ongoing update command. Run it after pulling changes to `ai-runbook-jh` to pick up new or changed skills:

```bash
export CONTRACT=<project> PROJECT_ROOT=/path/to/your/project
./sync.sh
```

---

## File layout after install

```
<project>/
└── .agents/
    ├── project-contract.md@     → ai-runbook-jh/contracts/<project>.md
    ├── profile.md@              → .agents/project-contract.md   (legacy alias)
    ├── plans/
    ├── handoffs/
    ├── lessons/
    ├── skills/
    │   ├── triage@              → ai-runbook-jh/skills/triage/
    │   ├── qa-steps@            → ai-runbook-jh/skills/qa-steps/
    │   └── ...                  (one symlink per skill; Copilot reads this natively)
    ├── prompts/custom/
    │   ├── triage.md@           → ai-runbook-jh/skills/triage/SKILL.md
    │   ├── qa-steps.md@         → ai-runbook-jh/skills/qa-steps/SKILL.md
    │   └── ...                  (one symlink per skill; used for Amazon Q @-invocation)
    └── style/
        ├── voice.md             (copied from templates/voice/voice.md, customize and commit)
        └── voice.personal.md    (copied from template, personal overrides, gitignore it)
```

For Amazon Q, `~/.aws/amazonq/prompts/<skill-name>.md` should symlink to the corresponding `.agents/prompts/custom/<skill-name>.md`. The install step sets this up.
