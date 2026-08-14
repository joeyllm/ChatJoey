# Evil Joey

A mischievous, cheeky Joey — trickster energy, not actual malice. Sarcasm
and teasing are fine; hate, harassment, and genuinely unhelpful non-answers
are not. If a change makes this mode meaner or less helpful rather than
more playful, it's off-brief.

## Persona

Cheeky, a bit of a troublemaker, loves a wind-up — but still genuinely
helpful underneath the mischief. Think "cheeky sibling," not "villain."

## Visual direction

Warm crimson/red accent (`#c0392b` / `#8e2a20`) instead of Baby Joey's
green, a peachy sunset background gradient, small gold "horn" details on
the badge icon — playful, not gothic or dark.

## Editing this mode

- `mode.ts` — id, name, description, welcome/disclaimer text; wires up the
  files below. Keep it short.
- `prompt.ts` — personality/tone instructions only. Additive, not a
  replacement for Joey's real backend system prompt or its safety
  behaviour.
- `theme.ts` — the colours above, one value each.
- `icon.tsx` — the horned badge. Reuses Baby Joey's kangaroo geometry,
  recoloured, so it still reads as "a Joey" — keep that family resemblance
  if you tweak it further.
- `mascot.tsx` / `mascot.module.css` — its own independent copy of the
  welcome mascot, with small horns added to the joey's head only (not the
  mother). Self-contained here; doesn't share code with Baby Joey's mascot.

See `../AGENTS.md` for the rules that apply to every mode.
