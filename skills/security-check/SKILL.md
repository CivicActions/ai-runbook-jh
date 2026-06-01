---
name: security-check
description: "Pre-flight checklist before pasting context into an AI prompt. Use at the start of an AI session, before pasting user data, before sharing screenshots, before authentication-adjacent work, or when the user says is this safe to share, can I paste this, security check, AI safety, will this contain PII. Apply whenever the next action involves sending substantive content to an AI tool."
---

# Security Check

Pre-flight checklist run before pasting substantive context into an AI prompt. Aligned to the [CivicActions AI Usage Policy](https://civicactions.atlassian.net/wiki/x/AwC3Ig) and the NIST AI Risk Management Framework.

The policy is simple: **never input sensitive or confidential information into AI tools.** This skill makes that rule actionable.

## Project profile

The CA-wide security posture below is generic. The **project-specific** seams (which AI clients are sanctioned for which work, which environments are off-limits, and the attribution-marker string) are read from `.agents/profile.md`:

- **`## Sanctioned AI`**: which tools are approved for code vs. non-code work on this project, and which are banned. This is the key project-specific seam: the tool one project sanctions, another may ban. Never hardcode a tool list; read it here.
- **`## Environments`**: the local env (safe to screenshot/share) vs. the higher envs (AI never accesses; redact before sharing).
- **`## Attribution marker`**: the exact marker string and one-marker-per-artifact convention.

If no profile is present, keep the generic CA posture (never input sensitive/confidential data; AI never authenticates or accesses higher envs) and ask the user which AI tools are sanctioned for this project rather than assuming.

## When to Use

Invoke at the start of any AI session that will involve pasting:

- User data, support tickets, or any content authored by external parties
- Screenshots from any environment higher than local
- Production logs, error traces, or database dumps
- Configuration files, `.env` contents, or auth URLs
- Any artifact that might contain PII, PHI, CUI, client proprietary, or CA confidential data

Skip when the context is code from the project's sanctioned codebase, wiki/ticket content you have legitimate access to, internal team documentation, or general technical questions with no embedded sensitive data.

The distinction is *sanctioned vs. sensitive*, not *public vs. private*. A project codebase may be private but client-approved for AI use; you don't need to run this check on every code question. Run it when content from outside that sanctioned envelope is about to enter the session, user reports, support tickets, production logs, screenshots from higher environments, anything authored by external parties.

## Approach

1. **Classify the content** against the CA policy's Sensitive Information categories:
   - **PII**, names, emails, addresses, phone numbers, SSN, user account details
   - **PHI**, Personal Health Information
   - **CUI**, Controlled Unclassified Information (federal)
   - **Client proprietary**, content the client has explicitly NOT sanctioned for AI use (e.g. client research/grant data, business operations data, anything marked proprietary or restricted, *not* the sanctioned codebase or team Confluence)
   - **CA confidential**, legal, financial, contractual, HR

2. **Verify AI client tier** against the profile's `## Sanctioned AI` section:
   - **Code work**: only the tool(s) the profile sanctions for code generation
   - **Non-code work**: only the tool(s) the profile sanctions for non-code (refinement, QA prose, summarization)
   - **Never**: any tool the profile lists as banned, personal-license versions, or anything not named in the profile. The banned/sanctioned split inverts between projects, so always read the profile rather than relying on memory.

3. **Verify environment scope** against the profile's `## Environments` section:
   - **Local env**, generally ok to share screenshots, console output, network details
   - **Higher environments** (per the profile), redact before sharing; never paste auth/one-time-login URLs; never share session tokens. AI never accesses higher envs.
   - **Production logs**, redact line-by-line; user accounts and content authors are PII

4. **Decision**:
   - **Go**, content is safe to share as-is
   - **Redact first**, specific items must be removed or anonymized before sharing
   - **No-go**, content is sensitive enough that it should not be in an AI prompt at all

## Output Format

```
Content type: [code / documentation / user data / screenshot / log / config / other]
Classification: [Public / Internal / Confidential / Sensitive]
AI client appropriate: [Yes / No, reason]
Environment scope: [Local / Higher env, note]
Decision: [Go / Redact first / No-go]

Redaction list (if applicable):
- [What to remove or anonymize]

Reasoning:
[1-2 sentences on the classification call]
```

## Sensitive Information Categories

Per the CA AI Usage Policy:

- **PII**, Personally Identifiable Information
- **PHI**, Personal Health Information
- **CUI**, Controlled Unclassified Information (federal classification)
- **Client proprietary**, content the client has explicitly NOT sanctioned for AI use (client research/grant data, business operations data, anything marked proprietary or restricted; *not* the sanctioned codebase or accessible team Confluence/Jira)
- **CivicActions confidential**, legal, financial, contractual, HR

## Project context

- Sanctioned tools differ per project, read the profile's `## Sanctioned AI` section rather than assuming
- Higher-environment access (the envs in the profile's `## Environments`) is a human action, AI never authenticates on your behalf
- Migration data and user accounts on any environment are PII, redact before sharing
- Audit/compliance context may apply (e.g. FISMA, Section 508); AI artifacts may be subject to review
- Config exports may contain admin emails or internal URLs, review before pasting

## Audit Trail

All AI-touched artifacts live under `.agents/` in the repo:
- `.agents/plans/`, implementation plans
- `.agents/handoffs/`, session handoffs
- `.agents/reviews/`, screenshots (PII-redacted)
- `.agents/lessons/`, lessons-learned

These are version-controlled and reviewable. Nothing AI sees or produces is hidden from the team.

## Labeling AI-Assisted Output

Per CA policy: "Clearly disclose and label AI-generated or AI-assisted content internally."

The canonical marker string is read from the profile's `## Attribution marker` section. The original CA convention is:

`_AI-assisted draft, reviewed before submission._`

**Important:** this marker wording is a **team-chosen convention** to satisfy CA policy, not policy text verbatim. CA policy requires clear disclosure and labeling; this specific phrasing is one way to do that. If a surface needs a more accurate phrasing (e.g., "AI-assisted reflection" reads more naturally on a lessons-learned note), prioritize honest disclosure over wording fidelity. The skills default to the profile's marker for consistency. If the profile defines no marker (e.g. public OSS contributions where the marker reads oddly), skip it but still human-review every AI-assisted output.

Don't name the specific AI tool, the marker is intentionally tool-agnostic.

### Placement: at the bottom

Marker goes at the **bottom** of the artifact, as the last block of what gets shared. For a PR description, that's the last block. For a plan or handoff file, the last block. For a Jira ticket, the last block of the assembled body.

Why bottom: keeps the artifact's content first (what the reader cares about), pushes the meta-label out of the way without hiding it. Top-of-document placement also works for policy purposes, but bottom is the team norm.

### Where to apply it

- **File artifacts** (plans, handoffs, refinement output, reviews, lessons): append the marker at the bottom when the artifact is shared with the team or used to inform a business decision. Skip it for purely personal one-time-use artifacts. See each skill's `## Attribution` section for specifics.
- **Ticket bodies**: append the marker at the very bottom of the **final assembled ticket** whenever AI was involved in drafting any section. `ticket-refinement` ends its body output with the marker. Appendix skills (`qa-steps`, `issue-closure-notes`, `definition-of-done`, `implementation-details`) **do not** emit a marker themselves, the final ticket has exactly one marker as its last line. If you assemble appendices below the refined body, move the marker to remain the last line.
- **PR descriptions**: end the description with the marker plus a one-sentence "how" line whenever any commit in the PR was AI-assisted. Body itself is 1–4 sentences. `summarize-commits` does this. The "how" line must honestly describe what AI did, see the menu in `summarize-commits/SKILL.md`.
- **Commits**: not required per CA policy, the PR description covers the AI disclosure for the code inside.

### Example markers

Use the profile's `## Attribution marker` string in place of the placeholder below.

A typical shared artifact:

```
[content]

[profile marker]
```

A PR description specifically (marker + "how" line as the last block):

```
Fixes [issue ref] by [...]. [1–4 sentences total.]

[profile marker]
AI co-authored the code ([files/scope]); human-edited and reviewed line by line.
```

## Example

**You ask:** `use the security-check skill on this support ticket before I paste it`

**You get:**

```
Content type:         user data (support ticket)
Classification:       Sensitive (contains PII)
AI client appropriate: only the sanctioned non-code tool per profile
Environment scope:    N/A (ticket content)
Decision:             Redact first

Redaction list:
  - Reporter name + email
  - 3 user account IDs in the repro steps
  - Screenshot showing logged-in admin user

Reasoning: ticket contains identifiable user data; safe to share after redaction.
```

## Related Skills

This skill is the gate that runs *before* other skills when they're about to ingest sensitive data or operate against higher environments.

- **Runs before:** `browser-check` (especially higher envs), `handoff-message` (when summarizing external content), `triage` and `ticket-refinement` (when summarizing user reports or support tickets), any skill that ingests external data
- **References:** [CivicActions AI Usage Policy](https://civicactions.atlassian.net/wiki/x/AwC3Ig), [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
