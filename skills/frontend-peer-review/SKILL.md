---
name: frontend-peer-review
description: "Peer reviews a frontend change; templates, styles, JavaScript, or component files; before merge. Use when the user says review this, peer review, look at my frontend change, is this ready to merge, or review this PR. Apply when the user shares frontend code and wants a second opinion even if they don't say 'peer review'."
---

# Frontend Peer Review

## Project profile
The stack conventions, visual-regression tooling, and team context are **project-specific**. Read
them from `.agents/profile.md`:
- **`## Stack`**: framework (Drupal/Twig or not), template/JS conventions, design-system styling
  rules (tokens vs. hex, `!important`, BEM), library registration, and whether `drupal-critic`
  applies.
- **`## Environments`**: visual-regression references (e.g. Backstop) and the CI surface.
- **`## Team context`**: team size / review norms (sets how formal vs. lightweight the review is).
- **`## Sanctioned AI` → Browser inspection MCP**: which browser tool `browser-check` uses.

If no profile is present, default to a small-team, direct-and-efficient review and ask about the
stack conventions.

## When to Use
Invoke for a peer review of a frontend change; templates, styles, JavaScript, component files, or
config; before merge.

Match the review weight to the profile's `## Team context`. Default (small team): direct and
efficient; a second set of eyes that catches what the author missed, not a formal audit. Focus on
real issues that matter, not process overhead.

## Approach
1. **Understand the change**: what was the intent, what files changed
2. **Review styles** (per the profile's `## Stack` styling rules):
   - Design-system tokens only, no hex values
   - No `!important`
   - No ID selectors
   - BEM naming consistent with existing components
   - Mobile-first media queries
3. **Review JavaScript** (per the profile's `## Stack` JS conventions):
   - The stack's behavior/init pattern used correctly
   - `const`/`let`, no `var`
   - No inline event handlers
   - Accessible keyboard and focus handling
4. **If the profile's stack is Drupal/Twig**, additionally review:
   - Dynamic output uses `|e` filter or `#plain_text`
   - No logic that belongs in PHP/preprocess
   - Template hierarchy is correct (not overriding more than needed)
   - SDC variables documented in `.component.yml`
   - CSS/JS properly declared in the theme's library file
5. **Review for regressions**:
   - Does the change affect shared styles or templates?
   - Are visual-regression references (per the profile's `## Environments`) updated if output changed?
   - Are accessibility requirements maintained?
   - Use `browser-check` (with the profile's browser MCP) to validate visually
6. **Check library registration** if the stack requires it (per the profile's `## Stack`)

## Output Format
Keep it concise; match the profile's `## Team context`. On a small team, a long formal review
creates more friction than value.

### Overall Assessment
One sentence on whether the branch is ready to merge, needs a fix, or needs a quick conversation.

### Must Fix
Only real blockers; correctness, security, accessibility regressions, or things that will break in
production. Include a pasteable fix where possible.

### Worth Noting
Standards violations or things that will cause pain later, but don't block merge if the author has a
good reason. Frame as a suggestion.

### Nits
Only if genuinely quick to fix. Skip nits entirely if there are Must Fix items.

### Good Calls
At least one thing done well.

### Open Questions
Anything that needs a quick message or a short conversation before merge.

## Voice
Apply `.agents/style/voice.md` to the overall assessment, must-fix descriptions, and open questions.
Write like you're talking to a colleague, not filing a report.

## Attribution
If the active profile defines an attribution marker (see its `## Attribution marker` section), end a
shared review with that marker as the last line. Skip it for personal-use output, or if the profile
defines no marker (e.g. public OSS). Don't name the specific AI tool (see `security-check`).

## Related Skills
- **Invokes:** `browser-check` (visual confirmation), `pattern-alignment` (checks against the
  project's canonical patterns), `kiss` (flags over-engineering)
- **Sibling:** `drupal-critic` (BE counterpart for PHP/services/config review); applies only when
  the profile's stack is Drupal
- **Downstream:** `qa-steps` (peer review findings often surface QA scenarios)
