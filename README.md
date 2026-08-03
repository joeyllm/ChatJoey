# ChatJoey

ChatJoey is the Next.js chat interface for JoeyLLM. The current branch provides a polished, responsive interface inspired by modern conversational products while retaining distinct JoeyLLM branding.

## Current scope

- Responsive desktop and mobile chat layout
- Collapsible conversation sidebar
- Light and dark colour themes
- Conversation suggestions and message interactions
- Mock server route for interface development while the client server is unavailable
- Replaceable API boundary for the client-provided JoeyLLM service
- Documented placeholders for future Qdrant and Vercel integration

## Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Connecting JoeyLLM

Copy `.env.example` to `.env.local` and set `JOEYLLM_API_URL` when the client endpoint is available. The browser talks only to `/api/chat`; the Next.js route forwards messages server-side so the interface does not need to change when the backend becomes available.

Qdrant configuration is intentionally not active yet. The team can add retrieval to the server route after confirming the embedding model, vector dimension, collection design and hosting plan with the client.
