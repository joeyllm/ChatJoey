# Joey LLM

**Live application:** [https://chat-joey.vercel.app/](https://chat-joey.vercel.app/)

Joey LLM's web interface, built by [Southern Cross AI](https://github.com/joeyllm). The canonical application consolidates the `Yingzhe_Xu` prototype into `main` and connects the browser to the real Joey LLM service through a server-only Next.js API route.

## Current capabilities

- Responsive chat UI for desktop and narrow windows
- Accessible labels, semantic HTML, keyboard submission, focus styles, and live status updates
- Conversation state in the current browser session
- Real Joey LLM replies through the server-side `/api/chat` boundary
- Explicit local preview mode when backend credentials are absent during development
- Visible production errors instead of silent mock replies when deployment configuration is missing

Qdrant, embeddings, RAG, authentication, uploads, and persistent conversations are not implemented.

## Architecture

```text
Browser
  -> Next.js app
  -> POST /api/chat (server-only route)
  -> Joey LLM /v1/models and /v1/chat/completions
```

The browser never receives the Joey LLM API key. The route reads server-only environment variables, selects a configured or available model, consumes Joey LLM's SSE response, and returns one JSON assistant message to the UI.

System-wide architecture, decisions, current state, deployment, and Qdrant/RAG notes live in the sibling [`ChatDocs`](../ChatDocs) repo, not here.

## Technology stack

- Next.js 16.2.12
- React 19.2.4
- App Router
- TypeScript
- CSS Modules and a small global stylesheet
- npm with a committed `package-lock.json`

## Environment variables

Copy `.env.example` to `.env.local` and supply the server-only values:

```dotenv
JOEYLLM_API_URL=https://api.joeyllm.ai
JOEYLLM_API_KEY=replace-with-a-current-development-key
JOEYLLM_MODEL=
JOEYLLM_MOCK_MODE=false
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `JOEYLLM_API_URL` | Production | Joey LLM service base URL |
| `JOEYLLM_API_KEY` | Production | Bearer credential used only by the Next.js server |
| `JOEYLLM_MODEL` | No | Fixed model ID; otherwise the first `/v1/models` result is used |
| `JOEYLLM_MOCK_MODE` | No | `true` enables explicit local preview mode outside production |

Never commit `.env.local`, expose these values through `NEXT_PUBLIC_*`, or paste a key into source code. Production never falls back to mock mode.

## Local development

Install the locked dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without server credentials, development uses a clearly labelled local preview response. Add `.env.local` to test the real service.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run lint` | Run ESLint with the Next.js and TypeScript rules |
| `npm run build` | Run Next.js production compilation and TypeScript validation |
| `npm run start` | Serve an existing production build |

`package.json` does not define dedicated `test` or `typecheck` scripts. TypeScript validation is included in `npm run build`.

## Deployment

The production Vercel project must define `JOEYLLM_API_URL` and `JOEYLLM_API_KEY` for the Production environment. `JOEYLLM_MODEL` is optional. Do not configure `JOEYLLM_MOCK_MODE=true` in production.

Follow the complete [Vercel deployment guide](../ChatDocs/docs/DEPLOYMENT.md), including environment verification, redeployment, smoke testing, and rollback guidance.

## Project structure

```text
app/
  api/chat/route.ts    Server-only Joey LLM proxy
  globals.css          Global reset and design variables
  layout.tsx           Root metadata and layout
  page.module.css      Component-scoped responsive styles
  page.tsx             Chat UI, state, and API calls
```

System docs, the Qdrant/RAG introduction, and the API smoke-test script moved to the sibling [`ChatDocs`](../ChatDocs) repo — this repo is app-only.
