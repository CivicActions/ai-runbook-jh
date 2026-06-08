# FAQ

## Invocation

**How do I call a skill?**

Use `@skill-name` in your AI client's chat. `sync.sh` handles everything needed for invocation: it symlinks each skill directory into `.agents/skills/` and also symlinks each `SKILL.md` into `.agents/prompts/custom/`. From there, your AI client picks them up — either directly or via a final link from `~/.aws/amazonq/prompts/`.

Invocation behavior varies by client:

- **Amazon Q (IDE):** `sync.sh` symlinks each `SKILL.md` into `.agents/prompts/custom/`. A second symlink from `~/.aws/amazonq/prompts/<skill-name>.md` to that file makes it invokable via `@skill-name`. The install step sets this up; re-run `sync.sh` after pulling changes to pick up new skills.
- **GitHub Copilot (VS Code agent mode, cloud agent, code review, CLI):** no `@` invocation needed. Copilot natively reads `SKILL.md` files from `.agents/skills/` (as well as `.github/skills/`, `.claude/skills/`, `~/.copilot/skills/`, `~/.agents/skills/`) and auto-selects skills based on the `description` front matter and your prompt. The symlinks `sync.sh` creates in `.agents/skills/` are sufficient; no additional wiring required. Skills can also be managed with `gh skill install/update` (GitHub CLI v2.90.0+).
- **Other IDE clients:** behavior varies; check your client's docs
- **Browser chat (Gemini, ChatGPT, Claude):** no file access; paste the skill's `SKILL.md` content directly into the chat; the model will ask for any inputs it can't read

**Do I need the repo cloned locally to use skills?**

For IDE use, yes. For one-off use in a browser chat, no — paste the skill's Markdown directly and the model will prompt you for missing context (profile values, ticket body, diff, etc.).

---

## Profiles

**Should I commit my profile to the `ai-runbook-jh` repo?**

Only if it contains nothing client-sensitive. Client-specific project profiles often include internal URLs, tracker formats, and team conventions that shouldn't be public. Add your project profile to `.gitignore` and keep it local. See the existing `profiles/nsf.md` entry in `.gitignore` as a pattern.

**What if I skip a section in the project profile?**

Skills fall back to generic behavior for any section that's missing. It still works; you just get less project-specific output. Keep all section headings intact even if a value is "none" or "n/a".

---

## Voice

**Do I have to customize `voice.md`?**

No. The baseline template is usable as-is. But the more it reflects how your team actually writes, the more consistent and on-tone the output will be.

**What's the difference between `voice.md` and `voice.personal.md`?**

`voice.md` is the shared project baseline — commit it so the whole team gets consistent output. `voice.personal.md` is a personal overlay for individual style preferences; entries there win over the shared file. Gitignore it.

---

## Updating

**How do I pick up new skills after pulling changes to `ai-runbook-jh`?**

Run `sync.sh`. It adds symlinks for any new skills and skips everything already wired.

**Why is there both `install.sh` and `sync.sh`?**

`install.sh` is for first-time setup: creates directories, scaffolds voice files, then calls `sync.sh`. `sync.sh` is for ongoing updates: links new skills, deploys the profile. Run install once; run sync whenever you pull upstream changes.
