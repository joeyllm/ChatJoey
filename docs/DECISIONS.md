# Decisions

A log of architectural and scope decisions for ChatJoey. Append new entries
at the bottom; don't rewrite history. Each PR that makes a real
architectural call should add an entry here.

## 2026-08-07 — Frontend/backend split

ChatJoey (this repo) is the frontend only. JoeyLLM model serving,
Kubernetes, GPU inference, and training live in a separate repository and
are out of scope here, including for coding agents.

**Why:** keeps the student-facing repo scoped to frontend work and prevents
infra/ML concerns from leaking into a codebase students are expected to own
end-to-end.

## 2026-08-07 — AGENTS.md + docs/ as persistent orientation

Added a root `AGENTS.md` plus `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`,
and `docs/CURRENT_STATE.md` as the standing entry point for any coding
agent working in this repo, so context doesn't have to be rediscovered each
session.

**Why:** prior to this, `main` had no implementation and no documentation
beyond a one-line README — all project context lived only in scattered
student branches. `AGENTS.md` stays intentionally small and points here
instead of accumulating history itself.

## 2026-08-10 — Consolidate the `Yingzhe_Xu` frontend

The team selected the `Yingzhe_Xu` prototype as the canonical frontend
baseline. Its responsive CSS Modules interface, App Router structure,
accessibility work, and six-language runtime switching are consolidated
into `main`. Prototype-only wording and browser-local mock behaviour are
updated for the real service boundary.

**Why:** this baseline already satisfies the agreed UI, internationalisation,
and accessibility goals, allowing the team to converge on one application
instead of maintaining competing versions.

## 2026-08-10 — Server-side JoeyLLM proxy

The browser calls a Next.js `POST /api/chat` route. The route keeps the
JoeyLLM URL and bearer credential server-side, selects a model through
`/v1/models` when necessary, consumes the upstream SSE response, and returns
one JSON assistant message to the browser. Local development may use an
explicit preview response, while production configuration failures remain
visible.

**Why:** this follows the established frontend/backend boundary, prevents
credentials entering the browser bundle, and delivers a small end-to-end
Sprint 1 contract without introducing model-serving infrastructure.
