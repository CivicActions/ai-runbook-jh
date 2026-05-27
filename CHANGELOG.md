# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [1.0.0] - 2026-05-24

### Added
- Six-phase AI-assisted ticket workflow (triage → refinement → plan → build → validate → communicate)
- 24 discipline-agnostic skills covering all phases
- Project profile system; generic skills + per-project profile (`profiles/_template.md`)
- Example profiles: `profiles/uswds.md`
- `sync.sh` deployment script; symlinks skills and deploys a profile into a target project
- Dashboard builder (`tools/dashboard-build/`); self-contained HTML skills explorer
- Deck builder (`tools/deck-build/`)
- Voice template (`templates/voice/`)
- Security guardrails baked into skills; `security-check` skill as pre-flight gate
