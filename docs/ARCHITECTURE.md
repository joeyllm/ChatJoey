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
