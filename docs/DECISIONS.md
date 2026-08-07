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
