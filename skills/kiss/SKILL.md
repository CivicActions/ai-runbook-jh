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
Apply `.agents/style/voice.md`. Keep feedback direct, name the problem plainly. Run shared KISS-check prose through `tone-check` before posting.

## Stack-specific checks
Read the active project's `## Stack` section from `.agents/project-contract.md` and apply its conventions
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

If the project contract defines no `## Stack`, apply the universal signals above without the stack-specific
detail.

### CSS/SCSS Coverage Check (when reviewing CSS/SCSS)

When the implementation under review includes CSS or SCSS, use the browser to check for unused selectors
before concluding. This catches rules that were written but never matched — a common KISS failure mode.

**Steps:**

1. Open the relevant page in the browser (DDEV sandbox if local).
2. Run this script in the iframe or document context — adjust the selector filter to match the feature under review:

```js
const results = [];

function collectRules(ruleList) {
  for (const rule of Array.from(ruleList || [])) {
    // Recurse into grouping rules (@media, @supports, @layer, etc.)
    if (rule.cssRules) {
      collectRules(rule.cssRules);
    } else if (rule.selectorText) {
      // Filter to your feature's selectors — adjust the condition:
      if (!rule.selectorText.includes('your-class')) continue;
      const matches = document.querySelectorAll(rule.selectorText);
      results.push({ selector: rule.selectorText, count: matches.length });
    }
  }
}

for (const sheet of document.styleSheets) {
  try { collectRules(sheet.cssRules); } catch(e) {}
}
return results.filter(r => r.count === 0);
```

3. **Categorize each zero-match selector:**
   - **Interactive state** (`:hover`, `:focus`, `::before`, `::after`, `:focus-within`) — keep, can't be matched statically
   - **Override suppressor** (e.g. `display: none` cancelling a base style) — keep if the base rule exists
   - **Conditional DOM** (element only present in a specific state like filtered/paginated) — verify by triggering that state
   - **Genuinely unused** — remove

4. Report findings in the standard output format below, limited to genuinely unused rules.

**What counts as genuinely unused:**
- A selector that matches 0 elements across all reachable states of the UI
- A property that duplicates the browser default or an already-inherited value
- A rule that was superseded by a later, more specific rule in the same stylesheet

## Example

**You ask:** `use the kiss skill on this implementation`

**You get:**

```
Complexity Assessment
Significantly over-engineered for the stated requirement.

Signals Found
- FilterContext + reducer + 3 hooks for what is a 4-line useState; adds indirection without reuse.
- Custom debounce util duplicates lodash.debounce already in dependencies.
- Three-layer Provider → Hook → Adapter chain for a single call site.

Recommended Approach
Inline `useState` in the component; use `lodash.debounce` directly. ~120 LOC removed.
```

## Related Skills

- **Pairs with:** `pattern-alignment` (KISS catches over-engineering; pattern-alignment catches under-aligned engineering, both are Build-phase critics)
- **Pairs with:** `evidence-check` (KISS keeps evidence citations lean; don't turn proof into a bureaucratic audit trail)
- **Invoked by:** `frontend-peer-review`, `drupal-peer-review` (peer review applies KISS check as part of overall review)
- **Downstream:** `tone-check` (run shared KISS-check prose through tone check before posting)
