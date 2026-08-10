# Architecture

## System boundary

ChatJoey is the frontend only. It talks to JoeyLLM over HTTP; it does not
host or serve a model itself.

```
Browser
  ↓
Next.js ChatJoey  (this repo)
  ↓
/api/chat          (Next.js route handler, server-side)
  ↓
JoeyLLM API         (separate repository/service)
```

Model serving, GPU inference, Kubernetes, and training infrastructure are
owned by the JoeyLLM project and are explicitly out of scope here. If a
change would require adding any of that to this repo, stop and raise it as
a decision rather than implementing it — see DECISIONS.md.

## API boundary

`/api/chat` is the seam between client and backend. It should:

- Forward requests to the JoeyLLM API when a backend URL is configured.
- Fail visibly (not silently mock) when misconfigured in a real deployment,
  while still allowing a local "preview/mock mode" for frontend-only
  development when no backend is configured.

Keep backend credentials and URLs server-side (env vars), never exposed to
the client bundle.

### Implemented request flow

The browser sends JSON to `POST /api/chat`:

```json
{
  "messages": [
    { "role": "user", "content": "Hello" }
  ]
}
```

The route validates message roles, content, length, and conversation size.
It reads `JOEYLLM_API_URL` and `JOEYLLM_API_KEY` only on the server. When
`JOEYLLM_MODEL` is unset, it selects the first model returned by
`GET /v1/models`. It then calls `POST /v1/chat/completions` with streaming
enabled, consumes the SSE deltas on the server, and returns JSON:

```json
{
  "mode": "live",
  "model": "selected-model-id",
  "message": { "role": "assistant", "content": "..." }
}
```

Development can return `mode: "mock"` when configuration is absent or
`CHATJOEY_MOCK_MODE=true`. Production never silently falls back to this
mode: missing configuration returns `503`, and an upstream failure returns
a sanitised `502` response.

The first implementation intentionally aggregates the upstream stream into
one JSON response. Browser-level token streaming is a future enhancement;
this keeps the credential boundary and client contract small for Sprint 1.

### Server-only configuration

- `JOEYLLM_API_URL` — required JoeyLLM service base URL in production.
- `JOEYLLM_API_KEY` — required bearer credential in production.
- `JOEYLLM_MODEL` — optional fixed model ID.
- `CHATJOEY_MOCK_MODE` — optional local-development switch; never a
  production fallback.

## Retrieval (RAG) — not yet implemented

Several prototypes stubbed source/citation UI and env vars for Qdrant, but
no retrieval layer is wired up anywhere yet. When this is built, it should
sit behind the server-side API boundary (`/api/chat` or a dedicated route),
not be called directly from the browser. Record the actual design here once
it's decided — this section is a placeholder, not a spec.

## Internationalisation & accessibility

Multiple early prototypes treated i18n and accessibility (aria labels,
aria-live regions, keyboard interaction) as first-class concerns. Preserve
that bar in whatever becomes the canonical implementation.
