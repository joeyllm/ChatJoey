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

## Sprint 5 — S5-A08 keyboard and focus tests

This branch adds Playwright coverage for keyboard interaction and focus
behaviour across desktop, tablet portrait, and mobile landscape layouts.

The suite verifies:

- Enter sends a message and keeps focus in the composer
- Shift+Enter inserts a newline without sending
- Primary controls are reachable with Tab and show keyboard focus
- Joey Mode, sidebar, and New Chat buttons work with Enter and Space
- The sidebar resize separator responds to arrow keys
- The S5-A01 mobile drawer closes with Escape and restores trigger focus

Run locally:

```bash
npm install
npx playwright install chromium
npm run test:a08
```

Open the latest report with `npm run test:a08:report`. The production test
server uses local port `3006`; no API key or deployment is required.

The mobile drawer test intentionally reports an explicit S5-A01 dependency
failure until A01 is complete. Final acceptance should be run against the
integrated Sprint 5 implementation.
