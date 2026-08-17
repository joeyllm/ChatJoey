# 🦘 Joey LLM

Joey LLM's web app, built by [Southern Cross AI](https://southerncross.ai/).
Want to give Joey a new personality? Keep reading.

## 🎭 What are Joey Modes?

A Joey Mode swaps Joey's personality — prompt, name, colours, icon, mascot.
No core app editing required. Little Joey (default), Evil Joey, and Sydney
Joey exist so far — switch between them from the sidebar to see it in
action, and hover a mode's name for a one-line description of what it does.

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

## Sprint 5 local branch notes

### Branch: `xingyu/a14-sports-joey`

Purpose: covers S5-A14 by adding Sports Joey as an isolated Joey Mode.

Changes:

- Added `modes/sports-joey/` from the existing mode template.
- Created Sports Joey identity text, prompt, green/gold theme, and badge icon.
- Reused Little Joey's mascot through the template re-export pattern.
- Registered Sports Joey in `modes/index.ts`.

Local run steps:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in demo/mock mode and select Sports Joey from the
sidebar. No API key is required.

Local checks to run:

```bash
npm run lint
npx tsc --noEmit
```

Limitations:

- This branch is local-only and has not been deployed to Vercel or any other
  online platform.
- This branch does not merge into `main`, `live`, or `beta`.
- This branch does not add API keys, backend work, vector database work, or
  unrelated documentation.

AI-tool contribution:

- Codex inspected the Joey Modes rules, created the Sports Joey mode from the
  template, registered it, and updated README evidence for client review.
