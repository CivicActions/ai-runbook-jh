---
name: performance-frontend
description: "Audits a page or component for frontend performance issues, render blocking, asset size, caching, Core Web Vitals. Use when the user says performance audit, this page is slow, check performance, Core Web Vitals, why is this loading slowly, or check my assets. Apply when the user wants to find or fix frontend performance problems."
---

# Performance Frontend

> Note: this skill is aspirational; not yet a habitual part of the workflow. Keep audits
> lightweight; reach for it when a page actually feels slow, not as a routine gate.

## Project profile
The local env, perf tooling, perf budgets, and stack-specific caching concerns are
**project-specific**. Read them from `.agents/profile.md`:
- **`## Environments`**: the local env to audit against, perf tooling (Lighthouse, axe, etc.),
  and any A11y/visual tooling that doubles as a perf signal.
- **`## Stack`**: the framework. Stack-specific perf checks below (Drupal aggregation, BigPipe,
  render-array caching, image styles) apply **only when the profile's Stack is Drupal**. For a
  vanilla / non-Drupal stack, skip them and audit generic asset/image/font/caching behavior.
- **`## Sanctioned AI` → Browser inspection MCP**: which MCP `browser-check` uses for the live audit.
- **`## Performance budgets`**: page-load / TTI / Lighthouse / asset-size targets, if defined.
  Not present in every profile; see "Performance targets" below for the fallback.

If no profile is present, fall back to the generic Core Web Vitals targets and ask the user for any
project-specific budgets.

## When to Use
Invoke when the user wants to audit a page, component, or asset pipeline for frontend performance issues, render blocking resources, oversized assets, missing lazy loading, caching gaps, or Core Web Vitals regressions.

## Approach

1. **Identify scope**, page URL, component, or asset pipeline area
2. **Live page audit**, use the `browser-check` skill with the profile's sanctioned browser MCP: navigate to the page (use the local env from the profile's `## Environments`), check network requests for asset sizes and render-blocking resources, capture console output, inspect DOM for lazy loading and image attributes
3. **Check Core Web Vitals targets**: LCP < 2.5s, CLS < 0.1, INP < 200ms
4. **Review asset loading**:
   - Render-blocking CSS or JS in `<head>`
   - JS not deferred or async where appropriate
   - CSS/JS aggregation enabled in production *(Drupal stack)*
   - Unused libraries loaded on the page
5. **Review images**:
   - WebP format used with fallbacks
   - Lazy loading on below-fold images
   - Responsive images with appropriate breakpoints *(Drupal: responsive image styles)*
   - No oversized images (see the profile's perf budgets for the max-size threshold)
6. **Review fonts**:
   - `font-display: swap` set
   - WOFF2 format used
   - Subset fonts where possible
7. **Review caching**:
   - *(Drupal stack)* Render array cache tags, contexts, and max-age set correctly
   - *(Drupal stack)* `#create_placeholder: TRUE` on lazy builders; BigPipe for dynamic regions
   - *(Drupal stack)* Object cache backend (e.g. Redis) active for sessions and application cache
   - CDN serving static assets in production
8. **Check for N+1 patterns** *(Drupal/backend stack)*, entity loads in loops, missing `loadMultiple()`

For a non-Drupal stack, drop the items marked *(Drupal stack)* and audit the framework's own
equivalents (bundler output, HTTP caching headers, CDN config).

## Output Format

For each finding:
- **Issue**: Short description
- **Location**: File, selector, or page area
- **Impact**: LCP / CLS / INP / load time / cache hit rate
- **Priority**: per the profile's `## Priority guide` (e.g. Highest / High / Medium / Low). See the
  performance lens below.
- **Fix**: Concrete corrective action

End with a summary of the highest-impact fixes to tackle first.

## Priority; performance lens
Map findings to the profile's `## Priority guide`. As a guide:
- **Highest**: Core functionality broken or unusable for public users due to load
- **High**: Significant performance regression on high-visibility pages
- **Medium**: Issues with workarounds or on lower-visibility pages
- **Low/Lowest**: Minor optimizations with negligible user impact

## Voice
Load the profile's voice config (`## Voice` → config path) before writing finding descriptions and
fix suggestions, and apply it to the prose. Run shared audit prose through `check-tone` before posting.

## Performance targets
Read targets from the profile's `## Performance budgets` (if defined): page-load / TTI thresholds,
the tooling score gate (e.g. Lighthouse), and the max image size. If the profile doesn't define
budgets, fall back to the generic Core Web Vitals targets (LCP < 2.5s, CLS < 0.1, INP < 200ms) plus:
- Images: WebP, lazy loaded below fold
- Fonts: WOFF2, `font-display: swap`
- Never load unnecessary JS on a page
- Never cache user-specific data without proper cache contexts *(Drupal: set cache contexts)*

## Attribution

If the active profile defines an attribution marker (`## Attribution marker`) and you share this
audit with the team (PR comment, chat, posted to the tracker) or use it to inform a business
decision, end the output with that marker as the last line.

If the audit is only for your own immediate use, or the profile defines no marker (e.g. public OSS
contributions), skip it. Don't name the specific AI tool; the marker is intentionally tool-agnostic
where one is defined (see `security-check`).

### Examples (using a profile that defines the CA marker)

**Shared** (e.g., posted as a PR review comment):

```markdown
## Performance audit for the landing page

- **Issue:** LCP at 3.8s, hero image is 2.4MB. **Priority:** High. **Fix:** [...]
- [...]

_AI-assisted draft, reviewed before submission._
```

**Personal use only** (no marker):

```markdown
## Performance audit for the landing page

- **Issue:** LCP at 3.8s, hero image is 2.4MB. **Priority:** High. **Fix:** [...]
- [...]
```

## Example

**You ask:** `use the performance-frontend skill on /search (local)`

**You get:**

```
- Issue: LCP at 3.2s on /search
  Location: hero region, /search
  Impact: LCP
  Priority: High
  Fix: defer chart library load until below-LCP region renders

- Issue: 14 unoptimized images on results grid
  Location: src/components/ResultCard
  Impact: load time, CLS
  Priority: Medium
  Fix: add width/height and loading="lazy"; convert to WebP

Top fixes first: chart-library defer, then image optimization.
```

## Related Skills

- **Upstream gate:** `security-check` (run before auditing any environment higher than local, or pasting HAR / network traces / production logs that may contain tokens, cookies, or PII)
- **Invokes:** `browser-check` (live network/asset/console audit)
- **Sibling Validate-phase skills:** `accessibility-audit`, `responsive-design`, `frontend-peer-review`, `drupal-peer-review` (Drupal stack only)
- **Downstream:** `qa-steps` (perf findings often produce specific QA verification steps), `check-tone` (run shared audit prose through tone check before posting)

## Security

Performance audits run against the **profile's local env by default** (see `## Environments`). AI
never accesses higher environments. If higher-environment perf data is needed:
- A human runs the audit and pastes summarized findings (tooling scores, asset sizes, Core Web Vitals), never raw network traces or HAR files
- Network requests may contain authenticated session data, redact tokens and cookies before sharing
- Production logs may contain PII, never paste raw log lines into AI
