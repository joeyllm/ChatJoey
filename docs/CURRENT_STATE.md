# Current State

_Last updated: 2026-08-10_

## `main`

The team selected the former `Yingzhe_Xu` prototype as the canonical
frontend baseline and consolidated it into the architecture defined by this
repository.

Implemented:

- Next.js 16.2.12 App Router application using TypeScript and CSS Modules;
- responsive chat interface for desktop and narrow windows;
- English, French, Chinese, Russian, Spanish, and Japanese UI switching;
- semantic structure, explicit labels, keyboard submission, visible focus,
  live status, empty-input protection, and long-message wrapping;
- browser-to-server `POST /api/chat` contract;
- server-only JoeyLLM URL and bearer credential handling;
- real `/v1/models` discovery and `/v1/chat/completions` integration;
- server-side consumption of JoeyLLM SSE content;
- explicit local preview mode and visible production configuration errors;
- Vercel environment and deployment documentation;
- Qdrant/RAG introductory documentation.

## Runtime boundary

```text
Browser -> Next.js /api/chat -> JoeyLLM API
```

The browser stores the current conversation in React state. `/api/chat`
validates the conversation and returns one complete assistant message after
consuming the upstream stream. Credentials remain server-side.

## Historical prototype branches

`origin/Yingzhe_Xu` is the selected baseline. The other student prototype
branches remain useful historical comparisons but are not canonical:

- `origin/chennuo`
- `origin/wen-sun`
- `origin/XiangChang`
- `origin/XingyuLi`

`origin/design` remains the bilingual product and UX documentation branch.

## Not yet implemented

- browser-visible token-by-token streaming;
- Qdrant connection, embeddings, retrieval, RAG prompt construction, or
  source citations;
- persistent conversation storage;
- authentication and authorisation;
- real file upload handling;
- automated browser test suite;
- production observability beyond platform function logs.

## Next step

After Sprint 1 deployment is stable, prioritise automated end-to-end tests,
then design the RAG boundary behind the existing server-side API without
allowing Qdrant or model credentials into the browser.
