---
name: pattern-alignment
description: "Checks whether a new implementation follows existing codebase patterns, read from the active project contract. Use when the user says does this follow our patterns, is this consistent, how do we normally do this, check my approach, or am I doing this the right way. Apply when the user shares new code and wants to know if it fits the project conventions."
---

# Pattern Alignment

The methodology is project-agnostic: **match existing patterns before inventing new ones.** Find
the canonical example, compare, flag divergences, suggest alignment. The project-specific bits
(where the canon lives, and which stack-specific conventions to check) come from the project contract.

## Project contract
Read project-specific values from `.agents/project-contract.md` (shared contract), then layer `.agents/project-contract.personal.md` on top if it exists (personal entries win where they overlap):
- **`## Patterns / canon`**: where this project's canonical components/patterns live (the
  component library, design source of truth, Storybook/docs). This is the first place to look for a
  reference example. If the section is absent, fall back to locating 1–2 existing examples of the
  same type anywhere in the codebase.
- **`## Stack`**: the framework, template, styling, and JS conventions to check (design-system
  rules like tokens and BEM, naming, banned constructs). Only apply stack-specific checks the
  project contract actually defines; skip checks for a stack this project doesn't use.
- **`## Attribution marker`**: whether to append a marker to shared output (see Attribution).
- **`## Voice`**: the voice config to apply to prose.

If no project contract is present, fall back to the generic behavior described below.

## When to Use
Invoke when the user wants to check whether a new implementation is consistent with existing
patterns in the codebase, before or after writing code.

**Scope boundary:** `pattern-alignment` covers code conventions: how things are written in this
project (services, hooks, styling architecture, tests, commits). For questions about whether a
component's structure or markup matches the project's design system or design spec, use
`component-design` instead.

## Approach

1. **Identify the implementation type**, service, hook, template, styling component, test, migration, etc.
2. **Find the canonical pattern**, start at the project contract's `## Patterns / canon` (the component library / design source of truth); otherwise locate 1–2 existing examples of the same type in the codebase. Before asserting a convention exists, verify it with at least one real example from the codebase — don't infer conventions from the project contract alone if the actual files contradict them.
3. **Compare**, does the new implementation follow the same structure, naming, and conventions?
4. **Flag divergences**, note where it differs and whether the difference is intentional or accidental
5. **Suggest alignment**, provide the corrected pattern with a concrete code example

## Output Format

### Pattern Reference
- Canonical example: `[file path]`
- Key conventions: [list the pattern's defining characteristics]

### Alignment Check
| Aspect | Expected | Actual | Status |
|--------|----------|--------|--------|
| [naming / structure / convention] | [expected] | [actual] | ✅ / ⚠️ / ❌ |

### Divergences
For each ❌ or ⚠️:
- What differs
- Whether it's a problem or an intentional variation
- Suggested fix with code example

## Voice
Apply the voice config named in the project contract's `## Voice` section (e.g. `.agents/style/voice.md`).
Apply it to divergence descriptions and suggestions. Run shared alignment-check prose through `tone-check` before posting.

## Patterns to Check
What to check depends on the project's stack; read the project contract's `## Stack` section and apply only
the conventions it defines. Make stack-specific checks conditional: a check for a construct the
project doesn't use (e.g. Drupal hooks on a non-Drupal project) doesn't apply.

Generic categories, mapped to the project contract's `## Stack` rules:
- **Styling / design system:** follow the project contract's design-system rules: design tokens (no raw
  hex), the project's BEM/naming convention, mobile-first media queries, and any banned constructs
  (e.g. no `!important`, no ID selectors).
- **Templates:** the project's escaping convention for dynamic output, and its component-variable
  documentation convention (e.g. SDC `.component.yml`).
- **JS:** the project's behavior/init pattern, `const`/`let` over `var`, no inline handlers,
  accessible keyboard/focus handling.
- **Tests:** the project's test tags, setup/cleanup convention, and structure (e.g. page object).
- **Commits:** the project contract's commit format (issue-ref prefix if any, imperative mood); defer to
  the project contract's `## Commit conventions` for exact rules.

Stack-specific examples (apply only when the project contract's `## Stack` declares them):
- **Drupal/PHP:** services via dependency injection, `.services.yml` with autowiring, no `\Drupal::`
  static calls; Hook class in `src/Hook/` with a procedural shim in `.module`.

## Attribution

Append an attribution marker **only if the project contract's `## Attribution marker` section defines one**.
When it does, and you share this alignment check with the team (PR comment, chat message, posted to
the tracker) or use it to inform a business decision, end the output with that marker as the last
line. If the check is only for your own immediate use, or the project contract defines no marker (e.g. a
public OSS project), skip it. The marker is intentionally tool-agnostic (don't name the specific AI
tool), and the wording is a team convention, not policy text verbatim (see `security-check`).

### Examples

**Shared** (e.g., posted as a PR review comment), with a project-contract-defined marker:

```markdown
## Pattern alignment check

### Pattern Reference
- Canonical example: `[path to a canonical example from ## Patterns / canon]`
- [...]

### Divergences
- [...]

[attribution marker from the project contract, only if one is defined]
```

**Personal use only, or no project contract marker** (no marker line):

```markdown
## Pattern alignment check

### Pattern Reference
- Canonical example: `[path to a canonical example from ## Patterns / canon]`
- [...]

### Divergences
- [...]
```

## Example

**You ask:** `use the pattern-alignment skill on this patch`

**You get:**

```
Pattern Reference
- Canonical example: src/state/FilterContext.jsx
- Key conventions: shared context for filter state; hook-based consumers

Alignment Check
| Aspect           | Expected      | Actual         | Status |
|------------------|---------------|----------------|--------|
| State management | FilterContext | local useState | Fail   |
| Handler naming   | handleClick   | handleClk      | Warn   |

Divergences
- State: replace local useState with FilterContext (see canonical example).
- Naming: rename `handleClk` → `handleClick` per project convention.
```

## Related Skills

- **Pairs with:** `kiss` (pattern-alignment catches under-aligned engineering; KISS catches over-engineering, both are Build-phase critics)
- **Pairs with:** `evidence-check` ("matches the canonical pattern" and "no existing helper" are claims; confirm them by reading the code, not from memory)
- **Invoked by:** `frontend-peer-review`, `drupal-peer-review` (peer review applies pattern check as part of overall review)
- **Downstream:** `tone-check` (run shared alignment-check prose through tone check before posting)
