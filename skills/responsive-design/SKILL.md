---
name: responsive-design
description: "Reviews or plans responsive behavior across mobile, tablet, and desktop breakpoints. Use when the user says check responsiveness, does this work on mobile, responsive review, test at different viewports, or how does this look on small screens. Apply when the user shares a component or layout and wants breakpoint validation."
---

# Responsive Design

## When to Use
Invoke when the user wants to review or plan the responsive behavior of a component or layout, checking breakpoints, grid usage, mobile-first styling, and touch/viewport behavior.

## Project contract
Breakpoints, the grid system, styling rules, and the browser tooling are **project-specific**. Read
them from `.agents/project-contract.md` (shared contract), then layer `.agents/project-contract.personal.md` on top if it exists (personal entries win where they overlap):
- **`## Breakpoints`**: the design system's breakpoint tokens. Use named breakpoint tokens rather
  than arbitrary pixel values.
- **`## Grid`**: the design system's grid utilities/mixins.
- **`## Stack`**: styling rules and conventions (mobile-first media queries, token-only colors,
  naming conventions).
- **`## Environments`**: the visual-regression tooling (e.g. Backstop references) that must be
  updated when responsive layout changes: the a11y tooling for verifying behavior.
- **`## Sanctioned AI`** → Browser inspection MCP: the browser tool `browser-check` drives for
  viewport simulation (e.g. chrome-devtools).
- **`## Voice`** and **`## Attribution marker`**: for prose and the shared-artifact marker (below).

If no project contract is present, keep the generic methodology and ask the user for the project's breakpoints,
grid system, and styling rules rather than assuming a specific design system.

## Approach

1. **Identify the component or layout**, what is being reviewed or designed
2. **Check breakpoints** against the design system's breakpoint tokens (project contract `## Breakpoints`). If the
   project contract doesn't list named breakpoints, ask for the project's breakpoints or fall back to the
   common mobile / tablet / desktop tiers.
3. **Verify mobile-first**, styles start at mobile, use `min-width` media queries to scale up (per
   the styling rules in project contract `## Stack`)
4. **Review grid usage**, the design system's grid utilities (project contract `## Grid`) used correctly
5. **Check touch targets**, interactive elements at least 44x44px on mobile
6. **Check overflow and wrapping**, no horizontal scroll, text wraps correctly, images don't overflow
7. **Check typography scaling**, font sizes and line heights appropriate at each breakpoint
8. **Validate with viewport simulation**, use the `browser-check` skill with the browser inspection
   MCP from the project contract `## Sanctioned AI`: navigate to the page, set the viewport to test at small,
   medium, and large widths (e.g. 375px, 768px, 1280px), capture screenshots at each breakpoint

## Output Format

### Breakpoint Behavior
| Breakpoint | Expected Layout | Status |
|------------|----------------|--------|
| Mobile (375px) | [description] | ✅ / ⚠️ / ❌ |
| Tablet (768px) | [description] | ✅ / ⚠️ / ❌ |
| Desktop (1280px) | [description] | ✅ / ⚠️ / ❌ |

### Issues Found
For each ⚠️ / ❌:
- Description of the problem
- Viewport where it occurs
- Suggested fix (in the project's styling conventions from the project contract `## Stack`)

### Accessibility Notes
- Touch target sizes
- Focus visibility at each breakpoint
- Any content reordering that affects reading order

## Voice
Apply the voice config from the project contract `## Voice`. Apply it to issue descriptions and fix suggestions. Run shared review prose through `tone-check` before posting.

## Styling Standards
Pull these from the project contract `## Stack` (and `## Environments` for visual regression). Typical rules:
- Mobile-first styling, `min-width` media queries only
- The design system's breakpoint tokens, no arbitrary pixel values
- Token-only colors and the project's styling restrictions (e.g. no hex, no `!important`, no ID
  selectors) per the project contract `## Stack`
- Touch targets minimum 44x44px
- Visual-regression references (project contract `## Environments`) must be updated if responsive layout changes

## Modern-first responsive patterns

AI training data over-represents older responsive techniques because they dominated for years
before modern CSS alternatives reached baseline support. When recommending responsive solutions,
actively prefer modern CSS when the project's browser support allows it.

**Before recommending a responsive pattern, ask:** is this the approach we'd use today given
current CSS support, or is this the pre-2022 workaround?

| Legacy responsive pattern | Modern alternative | Notes |
|---|---|---|
| `@media` queries for component-level layout | `@container` queries | Component-intrinsic responsiveness |
| `vh` units (100vh mobile bug) | `dvh` / `svh` / `lvh` | Dynamic viewport units |
| Negative margins for grid gutters | `gap` property | Works on flex and grid |
| Media-query-based show/hide | Container queries + `display` | Context-aware, not viewport-aware |
| JS-based resize observers for layout | CSS container queries | Declarative, no JS |
| Complex `calc()` for fluid type | `clamp()` for fluid typography | Cleaner, more readable |
| Escalating z-index values to force stacking order | `isolation: isolate` to contain a component's stacking, deliberate tokenized `z-index` between siblings | `isolation` only creates a new stacking context at its existing stack level — it doesn't reorder above a sibling by itself, so genuine sibling layering still needs explicit `z-index`. Use it to stop a component's internal stacking from leaking into or being disturbed by the rest of the page. `@layer` controls cascade specificity, not stacking context — don't reach for it here |
| Grid frameworks (12-col via classes) | Native CSS Grid with `auto-fit`/`auto-fill` | No class dependencies |
| `subgrid` polyfills or workarounds | Native `subgrid` | Check current support |
| Manual aspect-ratio padding trick | `aspect-ratio` property | Baseline since 2021 |

**The directive:** When the project's browser support targets (read from the project contract or
inferred from the stack) accommodate modern CSS features, recommend them as the primary approach.
If support is uncertain, use web research to confirm. Don't default to the legacy workaround as
the "safe" path when the modern property is already baseline.

**Interaction with existing code:** If the project's existing responsive patterns use legacy
approaches, note the modern alternative as available but don't create inconsistency without
flagging it. "Your existing breakpoint system uses media queries; container queries are now
supported and would let this component respond to its own container width rather than the viewport.
Worth considering for new components, or as a broader migration."

## Progressive enhancement for responsive features

When recommending a responsive technique that isn't Baseline Widely Available, always specify the
fallback layout for non-supporting browsers. A responsive design that breaks in older browsers
isn't responsive — it's broken.

**Read the project contract's `## Browser support` section** for the baseline policy and fallback
strategy. Apply the same tiered approach:

| Support tier | Responsive design requirement |
|---|---|
| Baseline Widely Available | Use freely (e.g. flexbox, grid, `gap`, `clamp()`) |
| Baseline Newly Available | Specify the media-query or simpler-CSS fallback |
| Not yet baseline | Full fallback layout: what the user sees WITHOUT the feature |

**For responsive recommendations specifically:**
- **Container queries:** Fallback is media queries at equivalent breakpoints. Spec both.
- **`dvh`/`svh` units:** Fallback is `vh` with the known mobile-toolbar issue documented.
- **Subgrid:** Fallback is explicit grid-template on the child, duplicating the parent's tracks.
- **`@layer`:** Fallback is specificity management via source order and BEM (existing practice).
- **`has()` selector:** Fallback is a parent class toggled by JS, or a simpler layout that works
  without the conditional.

**In the output:** If any recommended technique requires a fallback, add a "Fallback" column or
note to the Breakpoint Behavior table showing what non-supporting browsers get. Don't bury it;
make it as visible as the primary recommendation.

## Attribution

If the active project contract defines an attribution marker (project contract `## Attribution marker`) and you share
this responsive review with the team (PR comment, chat message, posted to the tracker) or use it to
inform a business decision, end the output with that marker as the last line.

If the review is only for your own immediate use, or the project contract defines no marker (e.g. public OSS
contributions), skip it. Use the project contract's exact marker wording; don't name the specific AI tool if
the marker is intentionally tool-agnostic (see `security-check`).

### Examples

**Shared** (e.g., posted as a PR review comment), project contract defines a marker:

```markdown
## Responsive review for the filter panel

### Breakpoint Behavior
| Breakpoint | Expected Layout | Status |
|------------|-----------------|--------|
| Mobile (375px) | [...] | OK |
| [...]

[attribution marker from project contract, if defined]
```

**Personal use only** (no marker):

```markdown
## Responsive review for the filter panel

### Breakpoint Behavior
| Breakpoint | Expected Layout | Status |
|------------|-----------------|--------|
| Mobile (375px) | [...] | OK |
| [...]
```

## Example

**You ask:** `use the responsive-design skill on the filter sidebar`

**You get:**

```
Breakpoint Behavior
| Breakpoint       | Expected Layout              | Status |
|------------------|------------------------------|--------|
| Mobile (375px)   | Filter drawer, off-canvas    | Fail   |
| Tablet (768px)   | Inline filters above results | Warn   |
| Desktop (1280px) | Sticky sidebar, left column  | Pass   |

Issues Found
- Mobile: drawer overlaps content (z-index too low); raise to design-system overlay token.
- Tablet: filter buttons render at 38px height; bump to 44px per touch-target rule.

Accessibility Notes
- Focus visible at all breakpoints.
- Filter order matches visual order; no reflow surprises.
```

## Related Skills

- **Upstream gate:** `security-check` (run before inspecting any environment higher than local, or capturing viewport screenshots that may contain PII or authored content)
- **Invokes:** `browser-check` (viewport simulation via the project contract's browser inspection MCP)
- **Sibling Validate-phase skills:** `accessibility-audit`, `performance-frontend`, `frontend-peer-review`
- **Downstream:** `qa-steps` (responsive checks often produce specific QA viewport scenarios), `tone-check` (run shared review prose through tone check before posting)
