#!/bin/bash
# Wires this workflow framework into a target project via symlinks:
#   - symlinks each skill directory into <project>/.agents/skills/
#   - deploys the chosen project contract to <project>/.agents/project-contract.md
#   - maintains <project>/.agents/profile.md as a legacy alias symlink
#
# Required env vars:
#   PROJECT_ROOT  target project root (the repo you're working in)
#   PROFILE       which profiles/<name>.md contract to deploy
# Optional:
#   CUSTOM        this framework repo's location (default: the script's own directory)
#
# Example:
#   PROFILE=uswds PROJECT_ROOT=~/code/uswds ./sync.sh

CUSTOM="${CUSTOM:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)}"
PROJECT_ROOT="${PROJECT_ROOT:-}"
PROFILE="${PROFILE:-}"

if [ -z "$PROJECT_ROOT" ]; then
  echo "ERROR: set PROJECT_ROOT to the target project root" >&2
  exit 1
fi
if [ -z "$PROFILE" ]; then
  echo "ERROR: set PROFILE to a contract name (see profiles/)" >&2
  exit 1
fi

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
contract_src="$CUSTOM/profiles/$PROFILE.md"
contract_link="$PROJECT_ROOT/.agents/project-contract.md"
legacy_link="$PROJECT_ROOT/.agents/profile.md"

if [ ! -f "$contract_src" ]; then
  echo "ERROR: contract not found: $contract_src (see profiles/)" >&2
  exit 1
fi

if [ -L "$contract_link" ]; then
  echo "Contract already linked: $(readlink "$contract_link")"
elif [ -e "$contract_link" ]; then
  echo "WARNING: $contract_link exists and is not a symlink; leaving it alone"
else
  ln -s "$contract_src" "$contract_link"
  echo "Linked contract: $PROFILE"
fi

# Legacy compatibility alias: .agents/profile.md -> .agents/project-contract.md
if [ -L "$legacy_link" ]; then
  echo "Legacy alias already linked: $(readlink "$legacy_link")"
elif [ -e "$legacy_link" ]; then
  echo "WARNING: $legacy_link exists and is not a symlink; leaving it alone"
else
  ln -s "$contract_link" "$legacy_link"
  echo "Linked legacy alias: profile.md -> project-contract.md"
fi

echo "Done."
