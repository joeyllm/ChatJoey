# Joey LLM Agent Instructions

Web frontend for Joey LLM. Model serving, Kubernetes, GPUs, inference, and
backend services live in a separate project — not in scope here.

## Architecture

```
Browser → Next.js app → /api/chat      → Joey LLM API  (/chat)
                      → /api/telemetry  → Joey LLM API  (/events)
```

## Frontend context + anonymous session telemetry

`app/lib/telemetry.ts` is the whole thing. Automatic, unobtrusive, best-effort
— nothing here is awaited by the UI, and every browser API access is guarded.

- **Ids.** `visitorId()` — persistent anonymous id in `localStorage`
  (`joey_visitor_id`). `sessionId()` — per-visit id in `sessionStorage`
  (`joey_session_id`), new for each tab/visit.
- **`frontendContext(mode)`** — a snapshot of what the browser already knows:
  the two ids, full page URL + origin/host/path/query/hash, `document.referrer`,
  mode, `navigator.userAgent` + UA client hints, platform, language(s), locale,
  timezone (+ offset), screen + viewport, device pixel ratio, touch capability,
  `navigator.connection`, and UTM/campaign params (`utm_*`, `gclid`, …) when
  present. `app/page.tsx` attaches it to each `/api/chat` body as `client`;
  JoeyBackend stores it on the `chat_interactions` row.
- **`trackEvent(type, detail?)`** — queued UI events, flushed in small batches
  to `/api/telemetry` (which forwards to JoeyBackend `/events` with the
  server-side key) via `navigator.sendBeacon`, falling back to `fetch`. Types:
  `page_view`, `mode_select`, `chat_start`, `message_submit`,
  `response_complete`, `error`, `downtime`. Each carries visitor id, session
  id, timestamp, page URL/path and — after a `/api/chat` call — the
  `X-Interaction-Id` the proxy surfaces from JoeyBackend.
- Both API routes stay thin proxies: they add the bearer key, cap size, and
  forward. No telemetry logic lives server-side in ChatJoey.

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

## Sprint 5 mobile integration notes

- This branch integrates S5-A01 through S5-A05 and validates S5-A07/A08.
- Responsive layout coverage lives in `tests/responsive-layout.spec.ts`;
  keyboard and focus coverage lives in `tests/keyboard-focus.spec.ts`.
- Run `npm run test:mobile`; the local production test server uses port `3005`.
- Mobile navigation must remain closed and inert by default, restore focus to
  its trigger when closed, and keep focus inside while open.
- Keep Playwright reports and test artifacts out of version control. Do not
  deploy, use a real API key, or mix unrelated changes into this branch.
