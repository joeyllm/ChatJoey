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
`README.md` for the contributor workflow. Little Joey, Evil Joey, and Sydney
Joey exist as working modes; the sidebar has a live switcher between
registered modes.

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

## S5-A07 test branch notes

- Responsive end-to-end coverage lives in
  `tests/responsive-layout.spec.ts` and is configured by
  `playwright.config.ts`.
- Run it with `npm run test:a07`; the production test server uses local port
  `3005` and must not deploy the application or require a real API key.
- Keep Playwright output (`playwright-report/`, `test-results/`, and
  `blob-report/`) out of version control.
- The S5-A01 mobile drawer check deliberately throws a clearly labelled
  dependency error until A01 is complete. Do not weaken or silently skip it.
- Perform final acceptance on an integration branch containing S5-A02 through
  S5-A05. Do not change product code solely to make this test branch pass.
