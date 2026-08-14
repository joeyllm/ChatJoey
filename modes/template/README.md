# Create a Joey Mode

1. Copy this whole `template/` folder to a new folder next to it, named
   after your mode (e.g. `modes/bendigo-joey/`).
2. In your copy, edit `mode.ts`: set `id` to match the folder name, then
   fill in `name`, `description`, `welcomeIntro`, and `disclaimer`.
3. Edit `prompt.ts` — additional instructions for your mode's personality
   and tone (not a full system prompt).
4. Edit `theme.ts` — only the colours you want to change; leave the rest
   commented out to keep Joey's normal defaults.
5. Replace `icon.tsx` with your own badge art (keep the same component
   shape — it accepts `SVGProps` and spreads them onto the root `<svg>`),
   or leave the placeholder in place for now.
6. Register your mode in `modes/index.ts`: import it and add it to the
   `modes` array.
7. Preview it locally: set `NEXT_PUBLIC_JOEY_MODE=your-mode-id` in
   `.env.local`, then `npm run dev`.
8. Open a pull request. Once it's reviewed, we'll deploy it to `beta` so you
   can test it against the real Joey LLM model.

See `AGENTS.md` in this folder for the rules an AI coding agent should
follow when building a mode, and `../AGENTS.md` for the rules that apply to
every mode.
