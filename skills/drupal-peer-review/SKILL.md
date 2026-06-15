---
name: drupal-peer-review
description: "Critically reviews Drupal PHP, Twig, SCSS, or config for correctness, security, performance, and project standards. Use when the user says review this Drupal code, critique this, is this correct, check my service/hook/template, or what's wrong with this. Apply when the user shares backend Drupal code and wants a quality check even if they don't say 'review'."
---

# Drupal Peer Review

> Originally adapted from Zivtech's [drupal-critic](https://github.com/zivtech/drupal-critic)
> (Apache 2.0); reworked into this runbook's project-contract-driven style.

## Project contract
This skill is **inherently Drupal-specific** (BE/PHP/services/config review). It applies **only when the active project contract's `## Stack` is Drupal**. If the project contract's `## Stack` names a different framework (or "none / vanilla component library"), this skill does **not** apply; skip it and use the framework-neutral counterpart instead.

It reads project-specifics from `.agents/project-contract.md` (shared contract), then layer `.agents/project-contract.personal.md` on top if it exists (personal entries win where they overlap):
- **`## Stack`**: confirm Drupal applies; module/theme naming, templating (Twig), styling tokens, library registration conventions.
- **`## Environments`**: local dev tooling (DDEV/drush), CI phases, shared services, config-export commands.
- **`## Priority guide`**: the project's bug priority levels (used to rank findings).
- **`## Attribution marker`**: whether the project defines a marker (and its exact wording).
- **`## Voice`**: the voice config path.

If a referenced section is missing, keep the behavior and fall back to generic Drupal best practice; don't invent project-specific values.

## When to Use
Invoke when the user wants a critical review of Drupal code; PHP services, hooks, controllers, Twig templates, SCSS, or config YAML; for correctness, security, performance, and project standards. Confirm the active project contract's `## Stack` is Drupal first; if not, defer to the framework-neutral peer-review skill.

## Approach

1. **Identify the code type**: PHP class, hook, template, SCSS, config YAML
2. **Review for correctness**:
   - Proper dependency injection (no `\Drupal::` static calls in classes)
   - Correct hook signatures and return values
   - Entity access checks present before loading/rendering
   - Cache tags, contexts, and max-age set appropriately
3. **Review for security**:
   - User input sanitized (`Html::escape()`, `#plain_text`, `|e` in Twig)
   - No raw SQL with user input
   - File uploads validated
   - CSRF protection on state-changing forms
4. **Review for performance**:
   - No `entity_load()` in loops, use `loadMultiple()`
   - No N+1 query patterns
   - Render arrays use `#lazy_builder` or `#create_placeholder` where appropriate
5. **Review for project standards** (read the specifics from the project contract's `## Stack`):
   - Module/theme naming matches the project convention (see `## Stack`)
   - Services defined in `.services.yml` with autowiring
   - Hook classes pattern used (not bare procedural hooks in classes)
   - Config management: clean config export/import (the project contract's `## Environments` names the export command, e.g. `ddev drush cex`); no environment-specific values committed
   - PHPDoc on all public methods
   - Styling follows the project's token rules from `## Stack` (e.g. design-system color tokens only, no hex; no `!important`)
   - CSS/JS registered per the project's library convention (see `## Stack`)
6. **Flag shared-service impact**: if the change touches services the project contract's `## Priority guide` / `## Environments` call out as shared (e.g. cache backend, search, auth/SSO), note the dependency-review requirement. If the change implies a content freeze or maintenance window, say so.

## Output Format

Group findings by priority using the project's bug priority levels from the project contract's **`## Priority guide`** (e.g. Highest/High/Medium/Low/Lowest "Do Now / Do Next / Do Soon / Maybe Later / Do As Time Allows"). If the project contract defines no priority guide, fall back to a generic Critical / High / Medium / Low ranking.

For each finding:
- Location (file + line if known)
- Problem description
- Priority
- Suggested fix or pasteable code change

Always include a **Good Calls** section.

## Drupal review principles
- Never bypass the entity access system.
- Always use dependency injection in service classes.
- Cache invalidation must use specific tags, not full bin clears.
- Styling must use the project's design-system tokens (see the project contract `## Stack`), never hardcoded hex values.

## Voice
Load the voice config from the project contract's `## Voice` section (e.g. `.agents/style/voice.md`) and apply it to all finding descriptions and suggested fixes. Run shared critique prose through `check-tone` before posting.

## Attribution

If the active project contract defines an attribution marker (see the project contract's **`## Attribution marker`** section) and you share this critique with the team (PR comment, chat message, posted to the tracker) or use it to inform a business decision, end the output with that marker as the last line.

If the critique is only for your own immediate use, skip the marker. Skip it entirely if the project contract defines no marker (e.g. public OSS contributions). Use the project contract's exact wording; it's intentionally tool-agnostic; don't name the specific AI tool (see `security-check`).

### Examples

**Shared** (e.g., posted as a PR review comment, project contract defines a marker):

```markdown
## Drupal code review

**High, Do Next**
- `src/Plugin/Block/FundingSearchBlock.php:42`, uses `\Drupal::service()` instead of dependency injection. [...]

**Good Calls**
- [...]

[project contract's attribution marker as the last line]
```

**Personal use only** (no marker):

```markdown
## Drupal code review

**High, Do Next**
- `src/Plugin/Block/FundingSearchBlock.php:42`, uses `\Drupal::service()` instead of dependency injection. [...]

**Good Calls**
- [...]
```

## Example

**You ask:** `use the drupal-peer-review skill on this hook implementation`

**You get:**

```
High
- mymodule.module:23 — direct `\Drupal::service()` call inside hook.
  Fix: move logic to a service class with dependency injection.

Medium
- mymodule.module:47 — user-facing string lacks `t()` translation wrapper.
  Fix: wrap with `t('...')`.

Low
- mymodule.module:12 — static $form_ids array inline.
  Fix: extract to a module constant.

Good Calls
- Hook signature and return value are correct.
- Cache tags set on the render array.
```

## Related Skills

- **Sibling:** `frontend-peer-review` (FE counterpart, apply both on full-stack changes)
- **Pairs with:** `pattern-alignment` (project pattern conformance), `kiss` (over-engineering check)
- **Downstream:** `qa-steps` (findings often surface QA verification steps), `check-tone` (run shared critique prose through tone check before posting)
