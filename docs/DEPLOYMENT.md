# Vercel Deployment

ChatJoey is deployed as a Next.js application. Vercel hosts both the browser bundle and the server-side `/api/chat` route; JoeyLLM remains a separate service.

## Production environment variables

Configure these values in the Vercel project under **Settings -> Environment Variables**:

| Name | Environment | Value |
| --- | --- | --- |
| `JOEYLLM_API_URL` | Production | The approved JoeyLLM base URL |
| `JOEYLLM_API_KEY` | Production | A current JoeyLLM bearer credential |
| `JOEYLLM_MODEL` | Production | Optional fixed model ID |

Do not add `NEXT_PUBLIC_` to any of these names. Do not configure `CHATJOEY_MOCK_MODE=true` in production. Changes to Vercel environment variables apply only to new deployments, so redeploy after adding or rotating a value.

## Deployment procedure

1. Confirm `main` contains the intended commit and the local validation commands pass.
2. Confirm the Vercel project is linked to the ChatJoey Git repository.
3. Confirm the production branch is `main`.
4. Add or update the server-only environment variables listed above.
5. Deploy the latest `main` commit, or redeploy it after an environment change.
6. Open the production URL and submit a short, non-sensitive message.
7. Confirm the UI status changes to **JoeyLLM live** and a real assistant response appears.
8. Check the Vercel function logs for `/api/chat` if the UI reports a connection problem. Logs must not contain credentials or complete request headers.

## Production checks

- `GET /` returns the ChatJoey interface.
- Empty messages cannot be submitted.
- `POST /api/chat` returns `200` with `mode: "live"` for a valid message.
- The browser network response does not contain the API key.
- Missing server configuration returns a visible `503` error and never a mock response.
- Upstream failures return a sanitised `502` response.
- English is the default and all six language options remain usable.

## Rollback and key rotation

Use Vercel's deployment history to promote the last known-good deployment if a release fails. When rotating a JoeyLLM key, update `JOEYLLM_API_KEY` in Vercel and redeploy. Revoke any credential that has appeared in source code, Git history, logs, screenshots, chat messages, or other shared material.
