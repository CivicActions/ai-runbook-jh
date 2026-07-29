# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- `work-intake` skill: periodic sweep of the tracker and wiki for everything assigned to you or waiting on you, returned as one copy-pasteable digest. Leads with the items other people are blocked on, holds a fixed 14-day lookback so a skipped run drops nothing, and requires failed queries to be reported so an unsupported search never reads as a clean result. Estimation and workflow vocabulary come from the project contract rather than defaulting to points and sprints.
- `evidence-check` skill: cross-cutting honesty gate that makes claims carry verified evidence instead of guesses, with a state-claims-default-to-Unverified rule, an unchecked-guardrail flag, and a human-SME routing clause
- Hosted AI runbook at https://civicactions.github.io/ai-runbook-jh/runbook/ (GitHub Pages); README links from intro and AI runbook sections
- AI Usage Policy surfaced in `README.md` and `CONTRIBUTING.md`
- Voice template split into humanizing baseline (`templates/voice/voice.md`) and personal overlay (`templates/voice/voice.personal.template.md`); `check-tone` layers `voice.personal.md` over `voice.md` when present
- `security-check` wired as upstream gate for skills that ingest external content
- `Example` section added to skills, showing template-aligned sample output
- Batch/backlog triage mode for `triage`; workflow-state requirements for plan skills; broader `check-tone` wiring
- Skills catalog: phase icons on phase headers; usage modes, accent legend, called-by modal; redesigned skill modal into tiered layout with example block; fixed modal Markdown rendering
- Deck: phase icons and Batch A/B copy polish
- README: worked examples and inline definitions for jargon; ad-hoc browser-chat use called out alongside IDE/CLI

### Added
- Runbook: a client-side filter above the phase list, so a 25+ skill catalog can be searched by name or description instead of scrolled through.

### Changed
- Runbook: swapped the one-sided `border-left` accent (the classic AI-UI tell) for a full border on the usage-mode example cards, modal description blockquote, and chat-ask bubble; kept it only on the hero newcomer note, the one place it reads as an actual footnote convention. Also reworded the phase-flow lede off a declarative "the six phases are the lifecycle of a ticket" claim to "how I take a ticket" -- it's one person's framework, not a universal fact.
- Completed the `profile` to `contract` naming convention: `profiles/` directory renamed to `contracts/`, `PROFILE` env var to `CONTRACT` (with `PROFILE` kept as a backward-compat shim), and the terminology carried across the docs. `.agents/profile.md` stays as a legacy alias.
- Renamed the `check-tone` skill to `tone-check`, for consistency with the `-check` skill family (`evidence-check`, `security-check`, `browser-check`)
- README tightened (~40% shorter lede); removed `Pre-development` section; general clarity/consistency pass
- Em-dashes and arrow glyphs purged across skills, profiles, README, and deck per voice rules

### Fixed
- Stale `jiraCaptions` entry in deck no longer uses arrow glyphs
- `contracts/uswds.md` was missing the `## Browser support` section `_template.md` now requires; filled it in against the repo's real `.browserslistrc`
- `skills/responsive-design/SKILL.md` mapped z-index stacking hacks to CSS `@layer`, which is wrong (`@layer` governs cascade specificity, not stacking contexts) -- swapped in `isolation: isolate`

### Chore
- `lessons/` directory gitignored
- Dropped hardcoded skill counts from README, QUICKSTART, and the deck -- every addition meant hunting down and bumping a number in four places, and one already drifted out of sync. Also removed the decorative `01→02→03→04→05→06` eyebrow above the runbook's phase row; it just repeated the numbers already on the phase cards below it.

## [1.0.0] - 2026-05-24

### Added
- Six-phase AI-assisted ticket workflow (triage → refinement → plan → build → validate → communicate)
- 24 discipline-agnostic skills covering all phases
- Project profile system; generic skills + per-project profile (`profiles/_template.md`)
- Example profiles: `profiles/uswds.md`
- `sync.sh` deployment script; symlinks skills and deploys a profile into a target project
- AI runbook builder (`tools/runbook-build/`); self-contained HTML view of every skill
- Deck builder (`tools/deck-build/`)
- Voice template (`templates/voice/`)
- Security guardrails baked into skills; `security-check` skill as pre-flight gate
