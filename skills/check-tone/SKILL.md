---
name: check-tone
description: "Reviews written content for tone, clarity, and appropriateness. Use when the user says check the tone, does this sound right, review this writing, is this too formal, rewrite this, or shares a commit message/PR description/ticket comment and asks for feedback. Apply when the user wants a second opinion on any written communication."
---

# Check Tone

> **Voice vs. tone.** `voice.md` is the persistent style spec (how I write, always). `check-tone` is the situational register evaluator (does this specific piece of writing fit its context). This skill applies `voice.md` when suggesting rewrites; spec and evaluator, not duplicates.

## Project contract
Read the active project's `.agents/project-contract.md` (shared contract), then layer `.agents/project-contract.personal.md` on top if it exists (personal entries win where they overlap). Use the merged result for context that shapes the register:
- **`## Voice`**: the voice config path (default `.agents/style/voice.md`); apply it when writing rewrites. If a sibling `.agents/style/voice.personal.md` exists (per-engineer overlay, typically gitignored), load it too and let it supplant the shared profile where they overlap (e.g. permitted words, transition style, hedging). Don't double-flag something the personal overlay explicitly allows.
- **`## Tracker`**: the issue/comment system (e.g. Jira, GitHub) so tracker-comment register lands.
- **`## Commit conventions`**: the project's commit subject format, so commit-message tone checks
  match the real convention rather than a hardcoded one.
- **`## Team context`** / audience norms; who reads this (engineers, PMs, public OSS community,
  government plain-language audiences) shapes how direct or formal to be.

If no project contract is present, fall back to generic plain-language, direct-and-collegial defaults.

## When to Use
Invoke when the user wants to review written content for tone, clarity, professionalism, or appropriateness. Applies to commit messages, PR descriptions, tracker comments, documentation, handoff notes, or user-facing copy.

## Approach

1. **Identify content type**, commit message, PR description, ticket comment, docs, UI copy
2. **Assess tone** against the appropriate register:
   - **Technical docs / PR descriptions**: clear, direct, factual, no filler, no hedging
   - **Tracker comments / handoff notes**: professional, collegial, actionable
   - **User-facing copy**: plain language, accessible (apply any audience standard the project contract names: e.g. government plain-language for public-sector projects)
   - **Commit messages**: imperative mood, concise, no apology language
3. **Flag issues**:
   - Passive voice where active is clearer
   - Vague or filler phrases ("basically", "just", "simply", "obviously")
   - Overly apologetic or self-deprecating language
   - Jargon that won't land with the intended audience
   - Tone mismatches (too casual for docs, too stiff for a comment)
   - Em-dashes (use colons or semicolons instead, or restructure the sentence)
   - Code comments that read like spec writing rather than plain explanation; prefer "sits outside the form" over "escapes the form ancestor in the top layer stacking context"
4. **Suggest rewrites** for flagged passages

## Output Format

For each flagged item:
- **Original**: quoted text
- **Issue**: what's wrong with the tone or clarity
- **Suggested rewrite**: improved version

End with an overall tone assessment: ✅ Good / ⚠️ Needs minor adjustment / ❌ Needs rewrite.

## Voice
Apply the voice config named in the project contract's `## Voice` section (default `.agents/style/voice.md`)
when writing suggested rewrites. If `.agents/style/voice.personal.md` is also present, layer it
on top: personal overrides win where they overlap with the shared project contract. Common overlay
concerns: permitted filler words (e.g. a measured "basically" when actually simplifying),
transition vocabulary, hedging style.

The same rules that apply to flagging also apply to rewriting. If voice.md bans something
(e.g. em-dashes, academic connectors, corporate speak), do not produce it in suggested rewrites.
Flagging a violation in the input and then reproducing it in the rewrite is itself an error.

## Register notes
- If the project contract names a user-facing audience standard (e.g. government plain language), hold
  user-facing copy to it.
- PR descriptions and handoff notes are read by reviewers and stakeholders; be direct. Who exactly
  is in the audience comes from the project contract's `## Team context`.
- Avoid language that implies uncertainty about correctness ("I think this might work").
- When checking a commit message, match the project contract's `## Commit conventions` subject format rather
  than assuming one.

## Example

**You ask:** `use the check-tone skill on this PR description`

**You get:**

```
- Original: "We've basically just gone ahead and fixed the scroll bug"
  Issue: filler words ("basically", "just", "gone ahead and")
  Suggested rewrite: "Fixes the scroll bug on facet deselect."

- Original: "sorry it took so long!"
  Issue: apologetic tone inappropriate for a PR description
  Suggested rewrite: (remove)

- Original: "Hopefully this works."
  Issue: hedge implies uncertainty about correctness
  Suggested rewrite: "Regression test added."

Overall: Needs rewrite.
```

## Attribution marker
If the active project contract defines an attribution marker (see the project contract's `## Attribution marker`
section), always end the output with that marker as the last line — whether the output is findings
only, rewrites only, or both. One marker per invocation, covering everything above it.

Skip it entirely if the project contract defines no marker (e.g. public OSS contributions). Use the
project contract's exact wording.

```
[project contract's attribution marker as the last line]
```

## Related Skills

`check-tone` is the cross-cutting voice gate for the system. Any skill that produces prose can route its output through here.

- **Invoked by:** `commit-message-writer` (validates tone before finalizing), and recommended for any handoff, closure, refinement, or peer-review output before publishing
- **Pairs with:** `.agents/style/voice.md` (the per-project voice config that defines what "on-tone" means)
