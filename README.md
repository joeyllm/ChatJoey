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

## 📱 Mobile header and chat viewport branch

Branch: `codex/mobile-drawer-responsive`

This branch covers S5-A02 and S5-A03 only:

- adds a compact mobile header with Joey branding, a 44 px navigation control,
  and visible `Ready`, `Thinking`, `Demo`, `Live`, and `Error` states;
- keeps the chat shell on `100dvh`, with messages scrolling independently and
  the composer anchored to the bottom of the dynamic viewport;
- adds iPhone safe-area padding and a compact landscape/soft-keyboard layout.

Local checks completed: ESLint, TypeScript, and responsive browser checks at
320×568, 375×667, 430×932, 667×375, 844×390, 768×1024, and 1024×768.
No API key or deployment is required. Codex implemented and locally verified
the interface changes; `AGENTS.md` did not require a scope update.

Once your pull request is ready, we can deploy it to beta so you can see how
it behaves with the real Joey model.

## 📬 Contribute it

Create a branch or fork → build your Joey Mode → open a pull request.

We review it, test it on beta, and if everything looks good, merge it.

## ❤️ Be respectful

Fun and weird is great. Hate, harassment, or unsafe content isn't — those
modes get rejected or removed.

## Sprint 5 local branch notes

### Branch: `xingyu/mobile-a04-a05-overflow-tablet`

Purpose: covers S5-A04 and S5-A05 for local-only mobile-first interface work.

Changes:

- Constrained narrow-screen chat content so long messages, URLs, and continuous
  characters wrap instead of widening the page.
- Kept code blocks and Markdown tables scrollable inside their own content
  containers when they need horizontal space.
- Tightened welcome, speech-bubble, message, and composer sizing on phone
  viewports.
- Added tablet-specific responsive rules around the 641px to 900px range while
  preserving desktop sidebar collapse, resize, and Joey Mode tooltip behaviour.

Local run steps:

```bash
npm install
npm run dev
```

Open http://localhost:3000 and test in demo/mock mode. Do not add `.env.local`
or use a real JoeyLLM API key for this branch.

Local checks to run:

```bash
npm run lint
npx tsc --noEmit
```

Suggested viewport checks:

- Phone: 320x568, 375x667, 390x844, 430x932.
- Tablet and desktop: 768x1024, 1024x768, and a desktop-width viewport.
- Content: long URL, continuous long word, fenced code block, and Markdown
  table.

Limitations:

- This branch is local-only and has not been deployed to Vercel or any other
  online platform.
- This branch does not merge into `main`, `live`, or `beta`.
- This branch uses local demo/mock mode only.

AI-tool contribution:

- Codex inspected the existing ChatJoey CSS and Sprint 5 constraints, then
  updated responsive overflow handling and this README evidence section.
