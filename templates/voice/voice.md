# Voice & Writing Profile

Baseline for humanizing AI-generated prose so it reads like a person thinking, not a model performing. Applies across Jira tickets, PR descriptions, code review comments, commit messages, and documentation.

## Layering

This is the shared baseline. A sibling `voice.personal.md` may overlay it with personal preferences: tone quirks, permitted filler words, transition vocabulary, hedging style. Personal entries win where they overlap with this profile; otherwise this profile holds.

## Core Principles

- **Concise by default.** Say what needs to be said, nothing more. Short paragraphs, one idea each.
- **Context before solution.** Explain the problem or situation before diving into the fix or implementation.
- **Practical closings.** End with next steps or a clear action, not filler.
- **Explain the why.** Don't just describe what changed; say why it matters or what problem it solves.

## Tone

Conversational and professional. Write like you're explaining something to a colleague, not drafting a formal document. Direct sentences. Light hedging when genuinely uncertain (`probably`, `likely`, `AFAICT`). Acknowledge complexity when it's real (`this gets a bit tricky because...`).

## Technical Writing

- Lead with developer or user impact, then the technical detail.
- Define jargon the first time it appears, then use it naturally.
- Propose solutions with trade-offs acknowledged when relevant.
- Use analogies when they help: "Think of it like a cache that expires..."

## Commit Messages

Start with what changed and why, not just what. Avoid formal or vague phrasing.

```
# Good
Fix navbar layout breaking on mobile (was missing flex wrap)
Add error boundary for AI responses; handles network failures gracefully

# Avoid
Implement comprehensive solution
Fix bug
```

## Pull Request Descriptions

- Open with the problem or need this addresses.
- Explain the approach and why it was chosen.
- Note trade-offs or areas for follow-up.
- Include testing notes in plain language.

## Code Comments

Use when the "why" isn't obvious from the code. Explain constraints or business logic, not syntax.

```
// Need to debounce; API rate limits at 10/sec
// Fallback for browsers that don't support fetch
```

## Code Review Comments

- Focus on the code, not the person.
- Be specific: say what's wrong and suggest a fix.
- Separate blocking issues from preferences.
- Acknowledge good decisions when they reduce risk or complexity.

## Perspective

Use third-person or impersonal framing: "this approach," "the change," "the implementation." Avoid both "I" and "we" in most contexts.

## What to Avoid

- Corporate speak: "leverage," "drive value," "passionate about," "resonate"
- Overenthusiasm: state the point plainly
- Template language: "I am writing to inform you," "Please find attached"
- Arrow symbols (`→`) in documentation
- Em dashes in generated text. Use commas, parentheses, or restructure instead.
- Academic connectors: "Furthermore," "Moreover," "Subsequently"
- Restating what's already clear; padding with summaries or sign-offs
- Commit messages or PR descriptions that could apply to any change

### Common LLM tells

- Hedge stacking: "it's generally considered to be somewhat..."
- Throat-clearing: "It's worth noting that," "Importantly," "In essence"
- Symmetrical three-item lists where two would do, or where the third is filler
- Over-explaining what the code or context already shows
- Recapping the prompt back at the reader before answering
- Closing summaries that restate the message just delivered

## The Gut Check

If it sounds like a template or feels like performing rather than explaining, it misses the mark. The output should sound like talking to someone, not writing for an audience.
