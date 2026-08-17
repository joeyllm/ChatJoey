# 🦘 Joey LLM

Joey LLM's web app, built by [Southern Cross AI](https://southerncross.ai/).
Want to give Joey a new personality? Keep reading.

## 🎭 What are Joey Modes?

A Joey Mode swaps Joey's personality — prompt, name, colours, icon, mascot.
No core app editing required. Little Joey (default), Evil Joey, Sydney Joey,
and Outback Joey exist so far — switch between them from the sidebar to see it in
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

## 📱 Sprint 5 local action preview

The `outback-joey` branch implements Chen Nuo's S5-A01, S5-A06, and S5-A11
work as one client-review package.

### Changes

- Mobile navigation is closed by default below 768px and opens as an overlay
  drawer from a 44px menu button.
- The drawer closes from its close button, backdrop, Escape key, or a Joey
  Mode selection. Focus returns to the menu trigger after it closes.
- Closing the drawer restores the full phone-width chat interface; the
  existing desktop collapse and resize controls remain available at 768px
  and above.
- Outback Joey adds a calm, practical personality, restrained Australian
  humour, an outback/desert/sunset palette, and an independent SVG icon in
  `modes/outback-joey/`.

### Local reproduction

```bash
npm install
npm run dev
```

Open `http://localhost:3000`, reduce the viewport below 768px, open the menu,
and choose Outback Joey. With no `.env.local`, send a message to verify the
complete flow using the built-in mock response.

### Checks completed

- ESLint and TypeScript pass.
- At 320×568, 375×667, 390×844, and 430×932, a user can open navigation,
  select Outback Joey, type, send, and read a mock response.
- The four portrait sizes have no page-level horizontal overflow; the
  composer remains visible and the closed drawer leaves the full chat width
  usable.
- Mode-selection, backdrop, and Escape closing were verified locally.

### Current limitations

- This preview covers only S5-A01, S5-A06, and S5-A11; the other Sprint 5
  actions belong to their assigned owners.
- Real-model behaviour is not part of this local-only validation and no API
  key is required or used.
- The branch is published only for client review. It has not been deployed or
  merged into `main`, `live`, or `beta`.

### AI-tool contribution

OpenAI Codex was used to implement the responsive drawer, create the Outback
Joey mode files, and run the local validation matrix. The accountable owner
must review the diff and local behaviour before publication.

## 📬 Contribute it

Create a branch or fork → build your Joey Mode → open a pull request.

We review it, test it on beta, and if everything looks good, merge it.

## ❤️ Be respectful

Fun and weird is great. Hate, harassment, or unsafe content isn't — those
modes get rejected or removed.
