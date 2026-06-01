---
name: kiss
description: "Checks an implementation for unnecessary complexity and suggests the simplest approach. Use when the user says is this too complex, am I over-engineering this, simplify this, is there a simpler way, or do I need all of this. Apply when the user shares code and seems uncertain whether the approach is too involved."
---

# KISS (Keep It Simple)

## When to Use
Invoke when the user wants a simplicity check on a proposed or existing implementation, catching over-engineering, unnecessary abstraction, or complexity that doesn't earn its keep.

## Approach

1. **Understand the requirement**, what problem is actually being solved
2. **Review the implementation**, how much complexity does it introduce
3. **Ask the key question**, is there a simpler way to solve the same problem?
4. **Check for over-engineering signals**:
   - Abstractions with only one concrete use
   - Custom utilities that duplicate what the framework or standard library already provides
   - Premature generalization ("we might need this later")
   - Indirection that makes the code harder to follow without adding value
   - Configuration or services that could be inline logic
5. **Propose the simpler alternative**, concrete, not just "simplify this"

## Output Format

### Complexity Assessment
One sentence: is this appropriately simple, slightly over-engineered, or significantly over-engineered?

### Signals Found
For each complexity signal:
- What it is
- Why it adds cost without proportional value
- Simpler alternative with code example if helpful

### Recommended Approach
The simplest implementation that correctly solves the stated requirement.

## Voice
Apply `.agents/style/voice.md`. Keep feedback direct, name the problem plainly. Run shared KISS-check prose through `check-tone` before posting.

## Stack-specific checks
Read the active project's `## Stack` section from `.agents/profile.md` and apply its conventions
when judging complexity. The universal rules below hold regardless of stack; the framework name
fills in the specifics:
- Check what the framework / standard library already provides before building a custom utility
  (e.g. for a Drupal/Symfony stack, `vendor/symfony` includes HttpFoundation, Console, Validator,
  and more).
- Prefer the framework's core APIs over custom implementations.
- A reusable abstraction (service, helper, shared module) is warranted when logic is genuinely
  reused, not for single-use code.
- Powerful configuration mechanisms (e.g. Drupal config splits) add complexity, only use them when
  the underlying differences they manage are real.

If the profile defines no `## Stack`, apply the universal signals above without the stack-specific
detail.

## Example

**You ask:** `use the kiss skill on this implementation`

**You get:**

```
Complexity Assessment
Significantly over-engineered for the stated requirement.

Signals Found
- FilterContext + reducer + 3 hooks for what is a 4-line useState — adds indirection without reuse.
- Custom debounce util duplicates lodash.debounce already in dependencies.
- Three-layer Provider → Hook → Adapter chain for a single call site.

Recommended Approach
Inline `useState` in the component; use `lodash.debounce` directly. ~120 LOC removed.
```

## Related Skills

- **Pairs with:** `pattern-alignment` (KISS catches over-engineering; pattern-alignment catches under-aligned engineering, both are Build-phase critics)
- **Invoked by:** `frontend-peer-review`, `drupal-critic` (peer review applies KISS check as part of overall review)
- **Downstream:** `check-tone` (run shared KISS-check prose through tone check before posting)
