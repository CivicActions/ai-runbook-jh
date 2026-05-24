#!/bin/bash
# Wires this workflow framework into a target project via symlinks:
#   - symlinks each skill directory into <project>/.agents/skills/
#   - deploys the chosen profile to <project>/.agents/profile.md
#
# Required env vars:
#   PROJECT_ROOT  target project root (the repo you're working in)
#   PROFILE       which profiles/<name>.md to deploy
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
  echo "ERROR: set PROFILE to a profile name (see profiles/)" >&2
  exit 1
fi

# Sync skills
for skill in "$CUSTOM"/skills/*/; do
  name=$(basename "$skill")
  link="$PROJECT_ROOT/.agents/skills/$name"
  if [ ! -e "$link" ]; then
    ln -s "$skill" "$link"
    echo "Linked skill: $name"
  fi
done

# Deploy the chosen project profile to .agents/profile.md
profile_src="$CUSTOM/profiles/$PROFILE.md"
profile_link="$PROJECT_ROOT/.agents/profile.md"
if [ ! -f "$profile_src" ]; then
  echo "ERROR: profile not found: $profile_src (see profiles/)" >&2
  exit 1
elif [ -L "$profile_link" ]; then
  echo "Profile already linked: $(readlink "$profile_link")"
elif [ -e "$profile_link" ]; then
  echo "WARNING: $profile_link exists and is not a symlink; leaving it alone"
else
  ln -s "$profile_src" "$profile_link"
  echo "Linked profile: $PROFILE"
fi

echo "Done."
