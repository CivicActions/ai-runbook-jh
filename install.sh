#!/bin/bash
# First-time setup for a target project.
# Creates required directories, scaffolds voice config from templates,
# then calls sync.sh to link skills and deploy the project profile.
#
# Run once per project. Safe to re-run: existing files are never overwritten.
#
# Required env vars:
#   PROJECT_ROOT  target project root (the repo you're working in)
#   PROFILE       which profiles/<name>.md to deploy
# Optional:
#   CUSTOM        this framework repo's location (default: the script's own directory)
#
# Example:
#   PROFILE=myproject PROJECT_ROOT=~/code/myproject ./install.sh

CUSTOM="${CUSTOM:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)}"
PROJECT_ROOT="${PROJECT_ROOT:-}"
PROFILE="${PROFILE:-}"

if [ -z "$PROJECT_ROOT" ]; then
  echo "ERROR: set PROJECT_ROOT to the target project root" >&2
  exit 1
fi
if [ -z "$PROFILE" ]; then
  echo "ERROR: set PROFILE to a profile name (see profiles/)" >&2
  exit 1
fi

# Verify .agents exists and is not itself a symlink pointing somewhere unexpected
agents_dir="$PROJECT_ROOT/.agents"
if [ -L "$agents_dir" ]; then
  echo "NOTE: .agents is a symlink -> $(readlink "$agents_dir"). Directories will be created inside the symlink target."
fi

# Create required directories (mkdir -p is safe: no-ops if already present)
for dir in .agents/skills .agents/style .agents/prompts/custom; do
  target="$PROJECT_ROOT/$dir"
  if [ -L "$target" ]; then
    echo "Skipped (symlink exists): $dir -> $(readlink "$target")"
  elif [ -d "$target" ]; then
    echo "Skipped (exists): $dir"
  else
    mkdir -p "$target"
    echo "Created: $dir"
  fi
done

# Scaffold voice.md from template (never overwrites)
voice_dest="$PROJECT_ROOT/.agents/style/voice.md"
if [ -e "$voice_dest" ]; then
  echo "Skipped (exists): .agents/style/voice.md"
else
  cp "$CUSTOM/templates/voice/voice.md" "$voice_dest"
  echo "Created: .agents/style/voice.md — review and customize before using check-tone"
fi

# Scaffold voice.personal.md from template (never overwrites)
personal_dest="$PROJECT_ROOT/.agents/style/voice.personal.md"
if [ -e "$personal_dest" ]; then
  echo "Skipped (exists): .agents/style/voice.personal.md"
else
  cp "$CUSTOM/templates/voice/voice.personal.template.md" "$personal_dest"
  echo "Created: .agents/style/voice.personal.md — fill in personal overrides, then gitignore it"
fi

# Wire skills and profile
CUSTOM="$CUSTOM" PROJECT_ROOT="$PROJECT_ROOT" PROFILE="$PROFILE" "$CUSTOM/sync.sh"
