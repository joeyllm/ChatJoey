# Current State

_Last updated: 2026-08-07_

## `main`

No chat implementation yet. Contains only `README.md`, `AGENTS.md`, and
this `docs/` folder. Nothing has been merged from the prototype branches
below.

## Unmerged prototype branches

Five students independently built a full frontend prototype of the same
brief in one sprint (all dated 2026-08-03), before any consolidation
decision was made. None of these are canonical — they exist for comparison
only, and should not be treated as the current architecture:

- `origin/chennuo` — most complete integration boundary: a real `/api/chat`
  route with a `JOEYLLM_API_URL` server-side fallback to an explicit mock
  mode, light/dark theme, `.env.example` with Qdrant placeholders.
- `origin/Yingzhe_Xu` — 6-language i18n, accessibility focus, live Vercel
  deploy, Chinese-language Qdrant/RAG notes (docs only, not implemented).
- `origin/wen-sun` — richest UI surface area: multi-thread sidebar, file
  upload UI, model-selector dropdown, own `PROJECT_PROGRESS.md` log.
- `origin/XiangChang` — lean prototype with source/citation UI stubbed for
  future retrieval results.
- `origin/XingyuLi` — lean, polished "Apple-inspired" chat workspace.

All five are frontend-only: canned/delayed mock replies, no real model or
Qdrant call anywhere.

## `origin/design` (orphan branch)

Not code. Bilingual (EN/中文) product definition, user research, personas,
usage scenarios, and user stories, plus a linked Figma prototype. Hasn't
been reconciled with any code branch yet.

## Not yet implemented anywhere

- Real JoeyLLM API integration (all branches mock this)
- Qdrant / RAG retrieval
- Persistence of chat history
- Auth
- Real file-upload handling (existing UI previews filenames only)

## Next step

Decide which prototype (or combination) becomes the base for `main`, or
rebuild from `docs/ARCHITECTURE.md` — see DECISIONS.md for whichever path
is chosen, and update this file once something actually merges.
