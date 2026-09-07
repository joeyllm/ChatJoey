# Joey Modes — rules for every mode

A Joey Mode is a presentation swap (name, welcome copy, theme colours,
icon, mascot), not a fork of the app. If you're building or reviewing a
mode, these rules apply.

## Where you work

Contributing a mode means working inside `modes/<your-mode>/` only. You
should not need to open `app/page.tsx`, `app/api/`, `app/globals.css`, or
any other shared app code to build a mode. If a mode idea seems to require
that, stop and raise it — it's a framework change, not a mode.

## The persona / tone text is server-side

A mode's actual instructions (personality, tone, mode-specific rules) live
in **JoeyBackend** (`src/persona.rs`), keyed by the mode `id`. The client
only sends `mode: "<id>"` to `/api/chat`; JoeyBackend builds the base
persona + mode system prompt and constructs the model conversation.

So a mode in this repo is **presentation only**. To change or add the
behavioural text for a mode, open a PR against JoeyBackend's
`src/persona.rs`; the two sides are linked by the `id`. A new mode needs an
`id` that exists in both places.

## `theme.ts` has limited control

Only the fields on `JoeyTheme` (see `types.ts`) can be set: `accent`,
`accentDeep`, `background`, `userMessage`, `speechBubble`, `sidebarTint`.
No arbitrary CSS, no layout or spacing changes, no component overrides.
Leave a field unset to keep Joey's normal default — don't restate the
default value just to "be explicit."

## `mascot.tsx` is optional per mode

Every mode needs a `mascot: ComponentType` in `mode.ts`, but the file that
supplies it doesn't have to be custom — see `template/mascot.tsx` for the
default pattern of re-exporting another mode's mascot. Only add your own
`mascot.tsx` (and `mascot.module.css` if it needs one) when your mode
actually wants different mascot art or animation, and keep it self-contained
in your mode's own folder — don't edit another mode's mascot to change
yours.

If a custom mascot is visually bigger/wider than the default and no longer
sits well against the heading/composer below it, set `introOffset: {x, y}`
in `mode.ts` (pixels) rather than touching shared layout — it nudges the
whole intro group (mascot + speech bubble) together as one unit.

## Testing a mode

1. `npm run dev` and choose the mode from the sidebar, or run
   `NEXT_PUBLIC_JOEY_MODE=your-mode-id npm run dev` to load it by default.
   Confirm it looks and behaves as intended (demo/mock replies are fine for
   this — see the root README for how demo mode works).
2. `npx tsc --noEmit` should be clean.

## Submitting a mode

Open a pull request. We don't hand out API keys — once reviewed, we deploy
approved modes to `beta` (`beta.joeyllm.ai`) to test against the real Joey
LLM model before merging.

See also: `template/AGENTS.md` (starting a new mode) and `little-joey/AGENTS.md`
(the default mode).
