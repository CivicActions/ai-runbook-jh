# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
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

### Changed
- Renamed the `check-tone` skill to `tone-check`, for consistency with the `-check` skill family (`evidence-check`, `security-check`, `browser-check`)
- README tightened (~40% shorter lede); removed `Pre-development` section; general clarity/consistency pass
- Em-dashes and arrow glyphs purged across skills, profiles, README, and deck per voice rules

### Fixed
- Stale `jiraCaptions` entry in deck no longer uses arrow glyphs

### Chore
- `lessons/` directory gitignored

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
