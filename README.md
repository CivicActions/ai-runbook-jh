# ai-runbook-jh

> A runbook for taking a ticket from inbox to closure with AI assistance (triage, refinement, plan,
> build, validate, communicate) without the AI going off-voice, leaking project specifics, or
> deciding on what "done" means.
>
> Developed against front-end work, but the skills are discipline-agnostic: the same `triage` skill
> works for any kind of ticket. Extend it by adding new specialized skills for any area.
>
> 24 single-purpose **skills** (Markdown checklists, one per task you want done the same way every
> time: `triage`, `qa-steps`, `handoff-message`, and 21 more) plus a per-project **profile** that
> names ticket tracker, stack, per-ticket Definition of Done, voice config, and approved AI
> clients. Skills stay generic; the profile supplies every project-specific detail.
>
> Runs with whatever AI is approved for a project. Most useful with agentic chat in an IDE or CLI
> where the AI can read files directly. Also works ad-hoc: paste a skill's Markdown into a browser
> chat (Gemini, ChatGPT, Claude) and the model will follow it, asking you for any inputs it can't
> see (profile values, ticket body, diff). Take what's useful, adapt the rest.

Browse the hosted **[AI runbook](https://civicactions.github.io/ai-runbook-jh/runbook/)** for a visual catalog of every skill.

---

## How you use the skills

There's no one right way to run this. Three common ways to do it:

- **Skills work with each other in a chain.** An agent runs the phases end-to-end, invoking skills as their triggers fire. Minimal hand-driving.
  *e.g. you paste the ticket body and say "triage this and bring it to ready-for-estimation"; the agent runs `triage`, then `ticket-refinement`, then `definition-of-done`, and hands back a refined ticket you paste into the tracker.*
- **One-off skills.** Pull a single skill when you want it. No chain, no agent in charge.
  *e.g. "`@check-tone` on this commit message"; only `check-tone` runs, nothing before or after. Or paste the skill's Markdown into a browser chat with no repo access; the model will ask for the inputs it needs.*
- **Mixed approach.** Agent drives some phases; you take the wheel for others. Most common in practice when iterating.
  *e.g. you write the plan by hand, then say "implement step 2 of `plans/NSF-13412-plan.md`"; the agent runs Build while you steer commits.*

---

## How it works

A skill is a generic checklist for one phase. The project profile at `.agents/profile.md` supplies
the tracker, stack, conventions, and DoD. Same skill, different profile, different output.

> **Looks like:** you run `@triage` on a fresh Jira ticket. The skill reads `.agents/profile.md`,
> sees the tracker is Jira and the priority scale runs Lowest to Highest, and returns output
> wrapped in Jira's `{code}` blocks using your project's priority levels and "reviewed" tag. The
> same skill on the [USWDS](https://github.com/uswds/uswds) component library reads a different
> profile and produces GitHub Markdown with USWDS labels (`Needs: Confirmation`, `Type: Bug`,
> `Affects: Accessibility`) and an a11y-aware priority suggestion. Same skill, different profile.

## The six phases

1. **Triage**: first touch. Keep/defer/decline, fill the minimum required fields, set an initial priority, tag as reviewed.
2. **Refinement**: bring to ready-for-estimation: user story, acceptance criteria (or steps to reproduce), dependencies, Definition of Done.
3. **Plan**: write the approach as a file before touching code.
4. **Build**: implement with simplicity and pattern-alignment checks. Handoffs live here, carrying state across sessions so you can start fresh chats often.
5. **Validate**: browser, accessibility, responsiveness, performance, peer review.
6. **Communicate**: clean commits, QA steps, closure notes, and a lessons-learned reflection.

## Profiles: how the skills stay generic

A profile is a single Markdown file describing one project. Skills reference its sections by name
(tracker, stack, required fields, DoD, sanctioned AI, voice, and so on). The full annotated section
set lives in [`profiles/_template.md`](profiles/_template.md); keep that set identical across
profiles so skills resolve every reference.

### Example profiles

- **`profiles/uswds.md`**: a public open-source component library on GitHub (vanilla JS/Sass, no
  Drupal). A good reference for a non-Jira, non-Drupal project.
- **`profiles/_template.md`**: a blank, annotated profile. Copy it to start a new one.
- A client-specific profile (e.g. a federal Drupal project) is typically kept **out of version
  control**; see `.gitignore`. Create your own locally from the template.

## AI runbook

Browse the hosted **[AI runbook](https://civicactions.github.io/ai-runbook-jh/runbook/)**, or
open [`runbook/index.html`](runbook/index.html) locally for the full catalog: one card per
skill, grouped by phase, with when-to-use, output template, and the skill-call graph.
`drupal-peer-review` applies only when the profile's stack is Drupal; `check-tone` and `security-check`
are the cross-cutting gates.

See [`DESIGN.md`](DESIGN.md) for the visual rationale and
[`runbook/styleguide.html`](runbook/styleguide.html) for the living styleguide that renders
every token and component from a single source.

## Setup

1. Clone `ai-runbook-jh`.
2. Copy `profiles/_template.md` to `profiles/<project>.md` and fill it in (or start from
   `profiles/uswds.md` as a worked example).
3. Author `.agents/style/voice.md` at the project root. Start from
   [`templates/voice/voice.md`](templates/voice/voice.md) (a baseline for humanizing AI-generated
   prose). Optionally copy
   [`templates/voice/voice.personal.template.md`](templates/voice/voice.personal.template.md) to
   `.agents/style/voice.personal.md` as a personal overlay; entries there win over the shared
   profile and the file is typically gitignored.
4. Deploy with `sync.sh`: `PROFILE=<project> PROJECT_ROOT=/path/to/project ./sync.sh` symlinks the
   skills into the project's `.agents/skills/` and copies the profile to `.agents/profile.md`.
   Override paths via `PROJECT_ROOT`, `CUSTOM`, or `PROFILE` env vars (see `sync.sh` comments;
   `CUSTOM` points at a profile kept outside this repo, useful when client details aren't safe to
   commit).
5. Try one skill on your next ticket; `qa-steps` is a good low-risk start.

**Invocation differs by AI client.** Some clients auto-invoke skills by keyword; others require an
explicit `@`-reference. For one-off use without a local install, paste the skill's Markdown
directly into the chat; the model will ask for any inputs it can't read. The skill files are the
same either way; only how they're invoked changes.

## Voice is the keystone

Every skill loads `.agents/style/voice.md` before generating prose; `check-tone` is the gate to run
drafts through. Without a project-level voice config, output reads like many different writers.

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

## Security posture

Built for use within CivicActions; usage must follow the
[CivicActions AI Usage Policy](https://civicactions.atlassian.net/wiki/x/AwC3Ig). External
adopters are welcome but should align with their own organization's equivalent policy. The skills
also line up with the
[NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework).

The core rule: don't paste sensitive content: PII, PHI, CUI, client-proprietary, or company-confidential (legal/financial/HR), into an AI prompt. Content you're authorized to access, like a normal project ticket, is fine; it's the sensitive data that might be inside it you redact first. Run `security-check` at the start of any session that will ingest user data, screenshots from higher environments, production logs, or auth-adjacent artifacts.

**What AI does *not* do:**

- Authenticate to any environment (no login URLs, SSH keys, or SAML tokens)
- Access higher environments (test/stage/prod) on a user's behalf
- Ingest **PII** (personal info), **PHI** (protected health info), **CUI** (controlled unclassified
  info, a federal designation), client-proprietary, or company-confidential information
- Ship code or take agentic actions; every output is a draft for human review

Project-specific sanctioned AI, environments, and attribution markers come from the profile. Run
`security-check` before any session that touches sensitive data. Skill guardrails do the rest:
browser checks run against local by default, handoffs and plans carry no credentials, and
screenshots are PII-redacted before being saved.

## Notes

- The methodology (six phases, voice keystone, security guardrails) works with any AI client, ideally within an IDE. The phases are durable; the skills are disposable.
- Working artifacts (plans, handoffs, reviews, drafts) are personal/local and git-ignored; they may
  contain ticket details and shouldn't be committed.

## Acknowledgments

`drupal-peer-review` began as a fork of Zivtech's
[drupal-critic](https://github.com/zivtech/drupal-critic) (Apache 2.0) - it was originally
named `drupal-critic` too. It's since been reworked so heavily into this runbook's
profile-driven style that little of the original remains, but the lineage is theirs.
Credit and thanks to Zivtech.

## License

MIT; see [LICENSE](LICENSE).
