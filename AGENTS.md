# Joey LLM Agent Instructions

Web frontend for Joey LLM. Model serving, Kubernetes, GPUs, inference, and
backend services live in a separate project — not in scope here.

## Architecture

```
Browser → Next.js app → /api/chat → Joey LLM API
```

## Current focus: Joey Modes framework

A pluggable system so contributors can add a new Joey personality (prompt,
name, theme, icon, mascot) as a small folder under `modes/` + PR, without
touching core app code (`app/page.tsx`, `app/api/`, etc). Implemented — see
`modes/AGENTS.md` for the rules, `modes/template/` to start a new mode, and
`README.md` for the contributor workflow. Little Joey, Evil Joey, Sydney
Joey, Sports Joey, Eco Joey, Coastal Joey, and Outback Joey exist as working
modes; the sidebar has a live switcher between registered modes.

Mode prompts are delivered as a primed user+assistant turn pair, not a
`role: "system"` message — see the comment on `prompt` in `modes/types.ts`
for why.

## Scope

Work on: chat interface, conversation UI, accessibility, and the Joey Modes
framework itself. Do not add model-serving or Kubernetes infrastructure
here.

## Project state

`main` is canonical. Branch from `main`, return via pull request.

No API keys are handed out for local testing against the real model —
`.env.local` absent means demo/mock mode. A merged/reviewed PR gets deployed
to `beta` (`beta.joeyllm.ai`) for testing against the real Joey LLM model.

## Docs

The sibling `ChatDocs` repo has deeper architecture/decisions/state notes,
but it's due for a cleanup pass and isn't being actively maintained right
now — treat it as background reference, not a required read.

## S5-A08 test branch notes

- Keyboard and focus coverage lives in `tests/keyboard-focus.spec.ts` and is
  configured by `playwright.config.ts`.
- Run it with `npm run test:a08`; the local production test server uses port
  `3006` and must not deploy the application or require a real API key.
- Keep Playwright reports and test artifacts out of version control.
- The S5-A01 drawer test deliberately throws a labelled dependency error until
  its navigation trigger, Escape handling, and focus restoration exist.
- Do not change product code solely to make this test-only branch pass.
