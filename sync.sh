#!/bin/bash
# Wires this workflow framework into a target project via symlinks:
#   - symlinks each skill directory into <project>/.agents/skills/
#   - deploys the chosen project contract to <project>/.agents/project-contract.md
#   - maintains <project>/.agents/profile.md as a legacy alias symlink
#
# Personal overlay: if .agents/project-contract.personal.md exists at PROJECT_ROOT,
# skills will layer it on top of the shared contract at runtime (personal entries win).
# Exclude it via .git/info/exclude, not .gitignore.
#
# Required env vars:
#   PROJECT_ROOT  target project root (the repo you're working in)
#   CONTRACT      which contracts/<name>.md contract to deploy
# Optional:
#   CUSTOM        this framework repo's location (default: the script's own directory)
#
# Example:
#   CONTRACT=uswds PROJECT_ROOT=~/code/uswds ./sync.sh

CUSTOM="${CUSTOM:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)}"
PROJECT_ROOT="${PROJECT_ROOT:-}"
CONTRACT="${CONTRACT:-${PROFILE:-}}"

if [ -z "$PROJECT_ROOT" ]; then
  echo "ERROR: set PROJECT_ROOT to the target project root" >&2
  exit 1
fi
if [ -z "$CONTRACT" ]; then
  echo "ERROR: set CONTRACT to a contract name (see contracts/)" >&2
  exit 1
fi

# Ensure base .agents dirs exist for first-time installs and fresh repos.
mkdir -p "$PROJECT_ROOT/.agents/skills" "$PROJECT_ROOT/.agents/prompts/custom"

# Sync skills and link each skill's SKILL.md into .agents/prompts/custom/
for skill in "$CUSTOM"/skills/*/; do
  name=$(basename "$skill")

  # Skill directory symlink
  link="$PROJECT_ROOT/.agents/skills/$name"
  if [ ! -e "$link" ]; then
    ln -s "$skill" "$link"
    echo "Linked skill: $name"
  fi

  # Prompt symlink into custom/ for Amazon Q invocation
  prompt_dir="$PROJECT_ROOT/.agents/prompts/custom"
  prompt_link="$prompt_dir/$name.md"
  if [ -d "$prompt_dir" ]; then
    if [ ! -e "$prompt_link" ]; then
      ln -s "${skill}SKILL.md" "$prompt_link"
      echo "Linked prompt: $name"
    fi
  fi
done

# Deploy the chosen project contract to .agents/project-contract.md
contract_src="$CUSTOM/contracts/$CONTRACT.md"
contract_link="$PROJECT_ROOT/.agents/project-contract.md"
legacy_link="$PROJECT_ROOT/.agents/profile.md"

if [ ! -f "$contract_src" ]; then
  echo "ERROR: contract not found: $contract_src (see contracts/)" >&2
  exit 1
fi

if [ -L "$contract_link" ]; then
  # If the symlink target no longer exists, repair it to the resolved source.
  if [ ! -e "$contract_link" ]; then
    rm "$contract_link"
    ln -s "$contract_src" "$contract_link"
    echo "Re-linked contract: $CONTRACT"
  else
    echo "Contract already linked: $(readlink "$contract_link")"
  fi
elif [ -e "$contract_link" ]; then
  echo "WARNING: $contract_link exists and is not a symlink; leaving it alone"
else
  # Migration helper: if users only have a legacy profile.md symlink, reuse that target.
  if [ -L "$legacy_link" ] && [ -e "$legacy_link" ]; then
    ln -s "$(readlink "$legacy_link")" "$contract_link"
    echo "Migrated contract link from legacy profile.md"
  else
    ln -s "$contract_src" "$contract_link"
    echo "Linked contract: $CONTRACT"
  fi
fi

# Legacy compatibility alias: .agents/profile.md -> .agents/project-contract.md
if [ -L "$legacy_link" ]; then
  # Normalize old behavior where profile.md linked directly to the contract source.
  if [ "$(readlink "$legacy_link")" = "$contract_link" ]; then
    echo "Legacy alias already linked: $(readlink "$legacy_link")"
  else
    rm "$legacy_link"
    ln -s "$contract_link" "$legacy_link"
    echo "Updated legacy alias: profile.md -> project-contract.md"
  fi
elif [ -e "$legacy_link" ]; then
  echo "WARNING: $legacy_link exists and is not a symlink; leaving it alone"
else
  ln -s "$contract_link" "$legacy_link"
  echo "Linked legacy alias: profile.md -> project-contract.md"
fi

# Check for personal project contract overlay
personal_overlay="$PROJECT_ROOT/.agents/project-contract.personal.md"
if [ -f "$personal_overlay" ]; then
  echo "Personal overlay found: $personal_overlay (will be applied by skills at runtime)"
else
  echo "Tip: create .agents/project-contract.personal.md to override specific sections for personal use (see contracts/_template.md)."
fi

echo "Done."
