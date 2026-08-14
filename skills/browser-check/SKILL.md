---
name: browser-check
description: "Validates a change in the browser using the project's sanctioned browser-inspection MCP, navigating pages, inspecting DOM/console/network, capturing screenshots. Use when the user says browser check, validate locally, test this in the browser, check the console, does this look right, or check this page. Apply when validating any frontend change even if the user does not say 'browser check'."
invokedBy: "accessibility-audit, responsive-design, performance-frontend"
---

# Browser Check

## Project contract
The browser-inspection tool, local environment, and URL pattern are **project-specific**. Read them
from `.agents/project-contract.md` (shared contract), then layer `.agents/project-contract.personal.md` on top if it exists (personal entries win where they overlap):
- **`## Sanctioned AI` → Browser inspection MCP**: which MCP to drive (e.g. chrome-devtools). Use
  the tool the project contract sanctions; do not assume one.
- **`## Environments` → Local**: the local dev server and URL pattern to validate against (e.g.
  DDEV at `https://myproject.ddev.site:8443/[path]`, or a component-library dev server like Storybook at
  `localhost:6006`). The environment can differ sharply per project; always read it here.
- **`## Environments` → Higher**: the higher environments that exist (if any) and their
  human-only access rule.
- **`## Voice` → Config path**: the voice file to load before writing prose.

If no project contract is present, ask the user which browser-inspection MCP and local URL to use rather than
assuming a stack. The project contract is the single source of truth.

## When to Use
Invoke when the user wants to validate a frontend change, bug fix, or new feature in the browser, checking visual output, console errors, network requests, and DOM state.

## Approach

1. **Identify scope**, which pages, flows, or components to validate
2. **Establish environment**, the project contract's local dev server by default (`## Environments` → Local);
   higher environments (`## Environments` → Higher) are human-only; see Security
3. **Pre-inspection verification** — confirm you're testing current code before debugging:
   - Run the project's build/compile command (per `## Environments` → Local)
   - Use cache-busting reload or hard refresh
   - Confirm asset URLs changed (check query strings in Network tab for JS/CSS files)
   - If a local cache clear command hangs, restart the dev environment rather than manually clearing cache tables — partial clears produce misleading results
4. **Navigate and inspect using the project contract's browser-inspection MCP** (`## Sanctioned AI`):
   - Navigate to the target page(s)
   - Capture a screenshot to confirm visual output
   - Check the console for errors, warnings, and debug log output (if instrumented)
   - Inspect relevant DOM elements
   - Review network requests for failures
   - Take additional screenshots for specific states or viewports
   (Exact tool names vary by MCP; map these steps to the sanctioned tool's API.)
5. **Debug instrumentation** (only when investigating unexpected behavior):
   - If something isn't working as expected during step 3, add temporary `console.log`
     statements at key decision points in the code under test before re-navigating
   - Use a consistent prefix (e.g. `[debug:browser-check]`) so logs are easy to filter
   - Target: function entry/exit, conditional branches, AJAX/event callbacks, DOM mutation points
   - Keep instrumentation minimal but sufficient to trace the execution path
   - Skip this step entirely for straightforward validation where behavior matches expectations
   - Remove all debug logs before finishing the check (they are ephemeral, not committed)
6. **Cross-viewport check**, test at mobile (375px), tablet (768px), and desktop (1280px) widths where relevant
7. **Authenticated flows**, use the project's local admin-access method (`## Environments` →
   Local: e.g. a Drupal `drush uli` URL, a login route, or none for a public component library)
8. **Document results**, record what was checked, what passed, what failed
9. **Clean up**, remove any debug instrumentation added in step 5

## Output Format

### Environment
- URL and environment name
- Browser and viewport

### What Was Checked
- List of pages/flows validated

### Results
- ✅ Pass / ❌ Fail / ⚠️ Warning for each check
- Console errors (if any)
- Network failures (if any)
- Screenshots saved to `.agents/reviews/` (if applicable)

### Open Questions
- Anything that could not be validated (access denied, environment unavailable, etc.)

## Voice
Apply the voice file named in the project contract's `## Voice` section (e.g. `.agents/style/voice.md`) to all
generated text: results summaries, open questions, environment notes.

## Environment notes
- Use the project's local admin-access method from the project contract (`## Environments` → Local) for
  authenticated pages.
- Higher environments may require VPN or project credentials; see Security; AI never accesses them.
- Note if any environment or page was inaccessible, and document what was skipped.
- Save screenshots to `.agents/reviews/[ISSUE-REF]-[description].png` (issue-ref format per the
  project contract's `## Tracker`).

**Embedded content testing:**
When validating behavior in embedded contexts (iframes, modals, third-party widgets):
- Test in the actual deployment context, not direct/shortcut URLs
- Direct URLs may disable AJAX wiring, change runtime configuration, or alter the JS event context
- The surrounding container's JS context, event bubbling, and configuration objects can all differ between direct access and embedded access

## Security

`browser-check` operates against the **project contract's local environment only by default**
(`## Environments` → Local). Higher-environment access (`## Environments` → Higher) is a human
action, not an AI action.

- **Never paste session-token URLs into AI prompts** (e.g. a Drupal `drush uli` URL); they grant
  authenticated access
- **Never authenticate to higher environments via AI**: AI is a thinking partner, not an auth agent
- **Screenshots may contain PII**, review and redact author emails, user accounts, and content drafts before saving anywhere persistent
- **Higher-env validation**, if a check needs a higher environment, a human runs the check and pastes findings (not raw page state) into the AI session
- **Where screenshots live**, `.agents/reviews/` is in your personal companion repo, not the project repo. Treat screenshots as personal artifacts that may be shared with the team on request; redact PII regardless

Run `security-check` before any session that will involve screenshots or higher-env context.

## Example

**You ask:** `use the browser-check skill on /search to verify the facet deselect flow on local`

**You get:**

```
Environment
- URL: http://local.example.test/search
- Browser: Chromium, viewport 1280×800

What Was Checked
- Facet select/deselect flow
- Console errors, network failures

Results
- Pass: Page loads, 200 OK
- Pass: Facet select refreshes results (47 → 12)
- Fail: Deselect leaves page locked at overflow:hidden
- Pass: No JS errors; ajaxComplete fired

Screenshot: .agents/reviews/PROJ-1234-deselect.png

Open Questions
- None
```

## Related Skills

`browser-check` is a foundation skill that other Validate-phase skills build on:

- **Upstream gate:** `security-check` (run before inspecting any environment higher than local, or capturing screenshots that may contain PII / authenticated content)
- **Invoked by:** `qa-steps` (live validation during QA writing), `accessibility-audit` (DOM inspection for a11y), `responsive-design` (viewport testing), `performance-frontend` (network and asset audit), `frontend-peer-review` (visual confirmation pre-merge)
- **Independent use:** also useful standalone for any "check this in the browser" moment
