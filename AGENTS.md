# Joey LLM Agent Instructions

Web frontend for Joey LLM. Model serving, Kubernetes, GPUs, inference, and
backend services live in a separate project — not in scope here.

## Architecture

```
Browser → Next.js app → /api/chat → Joey LLM API
```

## Current focus: Joey Modes framework

Building a pluggable system so contributors can add a new Joey personality
(prompt, name, theme, icon) as a small folder + PR, without touching core
app code (`page.tsx`, `/api/chat`, etc). Not yet implemented — see
`README.md` for the target contributor workflow. Design the mode config
schema and discovery mechanism before writing the first mode, so it isn't a
one-off hack that has to be rewritten later.

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
