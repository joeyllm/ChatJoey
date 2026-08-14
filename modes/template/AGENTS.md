# You are creating a new Joey Mode

Copy this folder, rename it, then modify these files — and nothing outside
this mode's folder unless explicitly required:

- `mode.ts` — id, name, description, welcome/disclaimer text. Coordinator
  only: import from `prompt.ts`/`theme.ts`/`icon.tsx`, don't inline a large
  prompt or CSS here.
- `prompt.ts` — additional instructions only (personality, tone, mode
  rules). This is not a replacement for Joey's real backend system prompt.
- `theme.ts` — a small set of optional colours (`JoeyTheme` in `../types.ts`
  lists all of them). Leave a field out to keep Joey's normal default. No
  arbitrary CSS, layout, or spacing here.
- `icon.tsx` — your mode's badge icon. Fine to leave the placeholder in
  place if you don't have custom art yet.
- `mascot.tsx` — the welcome-screen mascot. By default this re-exports
  Baby Joey's mascot (see the file) — leave that as-is unless your mode
  wants custom mascot art/animation. If you do customise it, keep the
  component and its `mascot.module.css` (if any) self-contained in this
  folder; don't edit another mode's mascot files.

Steps:

1. `cp -r modes/template modes/your-mode-id`
2. Edit `mode.ts`, `prompt.ts`, `theme.ts`, `icon.tsx`, and (optionally)
   `mascot.tsx` in your new folder.
3. Register it in `modes/index.ts` (import + add to the `modes` array).
4. Preview locally with `npm run dev` and the sidebar switcher, or run
   `NEXT_PUBLIC_JOEY_MODE=your-mode-id npm run dev` to load it by default.
5. Open a pull request. Do not touch `app/page.tsx`, `app/api/`, or any
   other shared app code — if the task seems to require that, stop and
   flag it instead of doing it.

See `../AGENTS.md` for the rules that apply to every mode.
