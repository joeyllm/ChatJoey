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

## Branch note: S5-A02 and S5-A03 mobile interface work

The `mobile-drawer-responsive` branch changes the shared chat interface for
two mobile-first actions. It does not change the chat API, backend behaviour,
Joey Modes configuration, or model integration.

### Interface changes

- **S5-A02 — mobile header and status:** `app/page.tsx` adds a compact mobile
  header identity with the Joey wordmark and an accessible navigation control.
  Ready, Thinking, Demo, Live, and Error are rendered as visible status pills.
  `app/page.module.css` aligns the menu, brand, and status at mobile widths,
  gives the primary mobile controls approximately 44 px touch targets, and
  provides distinguishable status colours and a reduced-motion-safe Thinking
  indicator.
- **S5-A03 — chat viewport and composer:** the page and chat shell use `100dvh`
  with constrained grid rows so the conversation scrolls independently while
  the composer stays at the dynamic viewport bottom. The CSS includes iPhone
  safe-area padding, touch scrolling, and compact rules for phone landscape and
  reduced-height/soft-keyboard conditions.

### AI contribution and validation

Codex inspected the existing Next.js and CSS Modules structure, implemented
the scoped TSX/CSS changes, added accessibility attributes, updated the branch
README and this agent handover, and performed local-only validation. Checks
included ESLint, TypeScript, a production build, mock chat interaction, and
responsive browser measurements at phone, landscape, tablet, and desktop
sizes. No API key, deployment, or protected-branch merge was used.

Reviewers should pay particular attention to real-device iPhone safe-area and
software-keyboard behaviour, because desktop viewport simulation cannot fully
reproduce mobile Safari browser chrome. The Thinking state may also be brief in
local mock mode because the mock response returns immediately.

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
