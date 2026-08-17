# 🦘 Joey LLM

Joey LLM's web app, built by [Southern Cross AI](https://southerncross.ai/).
Want to give Joey a new personality? Keep reading.

## 🎭 What are Joey Modes?

A Joey Mode swaps Joey's personality — prompt, name, colours, icon, mascot.
No core app editing required. Little Joey (default), Evil Joey, and Sydney
Joey exist so far — switch between them from the sidebar to see it in
action, and hover a mode's name for a one-line description of what it does.

### Branch review note: Eco Joey

This local branch adds Eco Joey for Sprint 5 issue S5-A15.
For Sprint 5 review, the local-only client instruction overrides the
general contribution notes below.

- Purpose: create a calm, environmentally aware Joey Personality for local
  review.
- Main changes: added `modes/eco-joey/`, registered Eco Joey in
  `modes/index.ts`, and gave it an independent prompt, theme, icon, welcome
  text, and disclaimer.
- Local branch: `sunwen/eco-joey`.
- Local run steps: install dependencies with `npm install`, run
  `npm run dev`, then select Eco Joey from the Joey Modes list.
- Test plan: verify Eco Joey appears in the sidebar, can be selected in
  local demo/mock mode, keeps chat interactions working, and passes ESLint
  and TypeScript checks.
- Local checks completed on 17 August 2026: `npm run lint`,
  `npx tsc --noEmit`, `npm run build`, desktop Joey Mode switching,
  Enter/Shift+Enter composer behaviour, New Chat reset, local mock reply,
  and a 390x844 mobile overflow check.
- Limitations: no API key is used, no real JoeyLLM API is tested, and no
  Vercel or online deployment is performed.
- Review notes: on the current `origin/main` baseline, the 390px mobile
  sidebar remains visually cramped and mode selection is not reliable from
  the squeezed sidebar; this is tracked by the mobile-first workstream, not
  by the Eco Joey mode itself. `npm audit --audit-level=high` reports
  upstream `next` dependency-chain advisories in `postcss` and `sharp`;
  fixing them requires a Next version outside the current dependency range.
- AI-tool contribution: Codex helped draft and implement the isolated Eco
  Joey mode files and this README review note.

## 🚀 Run it locally

```bash
git clone git@github.com:joeyllm/ChatJoey.git
cd ChatJoey
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🎮 Demo mode

No setup needed — with no `.env.local`, Joey runs in demo mode automatically.
Good enough to build and test a mode.

## 🔑 Want to test with the real model?

Build and test your Joey Mode locally first using demo mode.

When you're ready, open a pull request. If the mode looks good, a Southern
Cross AI maintainer can deploy it to
[beta.joeyllm.ai](https://beta.joeyllm.ai) so you can test it against the
real Joey LLM model.

You do not need a local API key for that workflow.

## 🛠️ Create a Joey Mode

1. Copy the mode template, rename it
2. Edit the prompt, colours, icon (mascot is optional — most modes reuse
   the default)
3. Register it, done — no app code touched

## 👀 Test it

Run locally and pick your mode from the "Joey Modes" list in the sidebar —
no environment variables needed once it's registered.

Once your pull request is ready, we can deploy it to beta so you can see how
it behaves with the real Joey model.

## 📬 Contribute it

Create a branch or fork → build your Joey Mode → open a pull request.

We review it, test it on beta, and if everything looks good, merge it.

## ❤️ Be respectful

Fun and weird is great. Hate, harassment, or unsafe content isn't — those
modes get rejected or removed.
