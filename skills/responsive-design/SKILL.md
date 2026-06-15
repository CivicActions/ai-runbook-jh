---
name: responsive-design
description: "Reviews or plans responsive behavior across mobile, tablet, and desktop breakpoints. Use when the user says check responsiveness, does this work on mobile, responsive review, test at different viewports, or how does this look on small screens. Apply when the user shares a component or layout and wants breakpoint validation."
---

# Responsive Design

## When to Use
Invoke when the user wants to review or plan the responsive behavior of a component or layout, checking breakpoints, grid usage, mobile-first styling, and touch/viewport behavior.

## Project contract
Breakpoints, the grid system, styling rules, and the browser tooling are **project-specific**. Read
them from `.agents/project-contract.md`:
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
Apply the voice config from the project contract `## Voice`. Apply it to issue descriptions and fix suggestions. Run shared review prose through `check-tone` before posting.

## Styling Standards
Pull these from the project contract `## Stack` (and `## Environments` for visual regression). Typical rules:
- Mobile-first styling, `min-width` media queries only
- The design system's breakpoint tokens, no arbitrary pixel values
- Token-only colors and the project's styling restrictions (e.g. no hex, no `!important`, no ID
  selectors) per the project contract `## Stack`
- Touch targets minimum 44x44px
- Visual-regression references (project contract `## Environments`) must be updated if responsive layout changes

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
- **Downstream:** `qa-steps` (responsive checks often produce specific QA viewport scenarios), `check-tone` (run shared review prose through tone check before posting)
