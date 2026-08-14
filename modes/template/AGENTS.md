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

Steps:

1. `cp -r modes/template modes/your-mode-id`
2. Edit `mode.ts`, `prompt.ts`, `theme.ts`, `icon.tsx` in your new folder.
3. Register it in `modes/index.ts` (import + add to the `modes` array).
4. Preview locally: `NEXT_PUBLIC_JOEY_MODE=your-mode-id npm run dev`.
5. Open a pull request. Do not touch `app/page.tsx`, `app/api/`, or any
   other shared app code — if the task seems to require that, stop and
   flag it instead of doing it.

See `../AGENTS.md` for the rules that apply to every mode.
