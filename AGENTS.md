# Joey LLM Agent Instructions

This repo is the web frontend for Joey LLM.

Joey LLM model serving, Kubernetes infrastructure, GPUs, inference,
and backend services live in a separate project and are not part
of this repository.

## Architecture

Browser
  ↓
Next.js app
  ↓
/api/chat
  ↓
Joey LLM API

Future RAG functionality may use Qdrant through an appropriate
server-side API boundary. See `../ChatDocs/docs/ARCHITECTURE.md` for detail.

## Student Scope

Students primarily work on:

- Chat interface
- Conversation UI
- Accessibility
- Source/citation presentation
- File upload UI
- Frontend integration with the Joey LLM API

Do not add model-serving or Kubernetes infrastructure here.

## Before Making Changes

Read (in the sibling `ChatDocs` repo):

- `../ChatDocs/docs/ARCHITECTURE.md`
- `../ChatDocs/docs/DECISIONS.md`
- `../ChatDocs/docs/CURRENT_STATE.md`

## Project State

`main` is the canonical implementation.

Do not treat old student prototype branches as current architecture.
Several early solo prototype branches (2026-08-03) explored the same
brief independently before any consolidation into `main` — see
`../ChatDocs/docs/CURRENT_STATE.md` for what, if anything, has actually
been merged.

New work should branch from `main` and return through pull requests.

## History

The current implementation was consolidated from the Yingzhe_Xu
prototype branch by an AI coding agent (Codex), merged as PR #4 on
2026-08-10. That work is now fully represented in `main`; the
`codex/consolidate-yingzhe-xu` branch was deleted after the merge
since it held nothing beyond what `main` already has.

## Documentation

If a change alters architecture, update `../ChatDocs/docs/ARCHITECTURE.md`
or `../ChatDocs/docs/DECISIONS.md`.

If a change significantly changes what is currently implemented,
update `../ChatDocs/docs/CURRENT_STATE.md`.
