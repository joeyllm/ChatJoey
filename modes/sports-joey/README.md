# Sports Joey

Sports Joey is an energetic, encouraging Joey Mode for teamwork, practice,
match reflection, and game-day momentum.

## Files

- `mode.ts` defines the Sports Joey identity and welcome copy.
- `prompt.ts` adds Sports Joey's active, team-oriented tone.
- `theme.ts` sets the green and gold visual direction.
- `icon.tsx` provides the sports badge art.
- `mascot.tsx` reuses Little Joey's mascot.

## Local preview

Run the app locally in demo/mock mode and choose Sports Joey from the sidebar:

```bash
npm install
npm run dev
```

To load this mode first during local testing:

```bash
NEXT_PUBLIC_JOEY_MODE=sports-joey npm run dev
```

Do not add an API key, deploy this branch, or merge it into `main`, `live`,
or `beta` without client review.

See `AGENTS.md` in this folder and `../AGENTS.md` for mode contribution
rules.
