---
name: component-design
description: "Produces a component design spec (variables, markup sketch, states, a11y notes) against the active project's design system, not working code. Use when the user says design this component, how should this look, plan this UI, sketch this out, what component should I use, or review this design. Apply before implementation to align on structure."
typicalNext: "After confirming the component structure, move to `pattern-alignment` to review your CSS/SCSS architecture and JavaScript behavior for codebase consistency. If you're writing the CSS/JS, use `pattern-alignment` before committing."
---

# Component Design

## Project contract
The design-system rules, framework, and component conventions are **project-specific**. Read them
from `.agents/profile.md`:
- **`## Stack` → Framework**: the project's framework (e.g. Drupal, or a vanilla component
  library). Determines whether framework-specific guidance below applies (templates, behaviors,
  component definitions, library registration).
- **`## Stack` → Templates**: the templating language and how dynamic output / component variables
  are handled.
- **`## Stack` → Styling**: the design-system styling rules: token system, naming convention, and
  the prohibitions (e.g. no hex, no `!important`, no ID selectors). Treat these as hard constraints.
- **`## Patterns / canon`**: where the project's existing component library or design-system
   catalog lives; check this first before proposing custom structures.
- **`## Breakpoints`**: the project's canonical responsive breakpoint tokens.
- **`## Grid`**: the project's canonical grid utilities/mixins.
- **`## Stack` → JS**: the JavaScript pattern for behaviors.
- **`## Stack` → Library registration**: where CSS/JS is declared, if the framework requires it.
- **`## Stack` → A11y baseline**: the accessibility standard the design must meet.
- **`## Voice`**: the voice config to apply to prose.
- **`## Attribution marker`**: the marker to append to shared output, if the project defines one.

If no profile is present, ask the user for the project's design system and framework rather than
inventing conventions. The profile is the single source of truth.

## When to Use
Invoke when the user wants to design a new frontend component, review a layout approach, or evaluate
a UI pattern against the project's design system and theme conventions, before or during
implementation.

## Approach

1. **Understand the requirement**, what is the component, who uses it, what states does it have
2. **Check the design system first**, does an existing component in the project's design system
   already solve this? Check `## Patterns / canon` for the project's component/design-system
   catalog and use existing patterns before building custom
3. **Map to Atomic Design tier**:
   - Atom: single-purpose element (button, icon, label)
   - Molecule: composed of atoms (card, form field with label, nav item)
   - Organism: complex section (header, search bar, teaser list)
4. **Define component structure** (apply the framework-specific items only when the profile's
   `## Stack` → Framework calls for them):
   - Template variables and their types (templating language per `## Stack` → Templates)
   - CSS class naming per the design system's convention (`## Stack` → Styling)
   - JavaScript behavior (if any), using the pattern in `## Stack` → JS
   - Component definition file, if the framework uses one (e.g. SDC `.component.yml` on a Drupal
     stack)
5. **Accessibility requirements**, keyboard nav, ARIA roles, focus management, color contrast; meet
   the `## Stack` → A11y baseline
6. **Responsive behavior**, mobile-first behavior using `## Breakpoints` and layout behavior using
   `## Grid`
7. **Library definition**, register the CSS/JS where the framework requires it (`## Stack` →
   Library registration), if applicable

## Output Format

### Component Overview
- Name, tier (atom/molecule/organism), purpose

### Template Variables
| Variable | Type | Required | Description |

(Use the templating language from `## Stack` → Templates.)

### Markup Sketch
Simplified HTML/template markup showing structure and key classes

### States
- Default, hover, focus, active, disabled, error (as applicable)

### Accessibility Notes
- ARIA requirements, keyboard behavior, focus management

### Open Questions
- Anything needing design or content decisions before implementation

## Voice
Apply the voice config from the profile's `## Voice` section (e.g. `.agents/style/voice.md`). Apply
it to component overview prose and open questions. Run shared design proposals through `check-tone` before posting.

## Design-system standards
Pull the hard constraints from the profile's `## Stack` → Styling section and apply them as
non-negotiable. For a USWDS-based design system (depends on the profile) that means:
- Design tokens only, never hex
- The design system's naming convention (e.g. BEM, `usa-` prefixes)
- No ID selectors, no `!important`

Generic frontend best practices that apply regardless of stack:
- `font-display: swap` for custom fonts
- SVG-first for icons

## Attribution

If you share this design with the team (PR comment, Slack message, posted to the tracker, attached
to a ticket, used to inform a business decision) **and the active profile defines an attribution
marker** (see the profile's `## Attribution marker` section), end the output with that marker as the
last line.

If the design is only for your own immediate use, or the profile defines no marker (e.g. public OSS
contributions), skip it. The marker wording is a project convention, not policy text verbatim (see
`security-check`).

### Examples

**Shared, profile defines a marker** (e.g., attached to a refinement ticket):

```markdown
## Frontend design proposal: funding-search filter chip

### Component Overview
Name: filter-chip. Tier: molecule. Purpose: [...]

### Template Variables
| Variable | Type | Required | Description |
| [...]

[attribution marker from the profile, as the last line]
```

**Personal use only, or no marker defined** (no marker):

```markdown
## Frontend design proposal: funding-search filter chip

### Component Overview
Name: filter-chip. Tier: molecule. Purpose: [...]

### Template Variables
| Variable | Type | Required | Description |
| [...]
```

## Example

**You ask:** `use the component-design skill on the new filter sidebar`

**You get:**

```
Component Overview
Name: filter-sidebar. Tier: organism. Purpose: faceted filtering for search results.

Template Variables
| Variable | Type  | Required | Description                  |
|----------|-------|----------|------------------------------|
| facets   | array | yes      | List of facet groups         |
| selected | array | no       | Currently selected facet IDs |

Markup Sketch
<aside class="filter-sidebar"><h2/><ul class="filter-sidebar__group">…</ul></aside>

States
Default, expanded, collapsed (mobile drawer), disabled.

Accessibility Notes
aria-expanded on toggle; focus returns to toggle on close; 44px tap targets.

Open Questions
- Should selected filters persist across page loads?
```

## Related Skills

- **Downstream:** `pattern-alignment` (once designed, verify implementation follows established patterns), `kiss` (verify the design isn't over-engineered), `check-tone` (run shared design proposals through tone check before posting)
- **Upstream:** `ticket-refinement` (design thinking often surfaces during refinement, component-design can shape AC and IDs)
