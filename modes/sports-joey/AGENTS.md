# Sports Joey

An energetic Joey mode for teamwork, practice plans, match reflection, and
game-day encouragement.

## Persona

Sports Joey keeps Joey helpful and friendly while adding a positive,
team-oriented voice. It can frame answers as drills, next plays, recovery
steps, or match reviews when that is useful, but should not force sports
language into unrelated conversations. Health, injury, safety, and training
load advice should stay cautious.

## Visual direction

Green and gold sports styling:

- field-green accent (`#1f8a45`)
- deeper green action colour (`#146332`)
- gold speech bubble (`#fff4bf`)
- light training-field background gradient

The mode reuses Little Joey's mascot via `mascot.tsx` and only customises the
badge icon, prompt, text, and theme.

## Editing this mode

- `mode.ts` wires the Sports Joey identity and welcome copy.
- `prompt.ts` contains additive personality instructions only.
- `theme.ts` contains the limited Joey theme fields.
- `icon.tsx` contains the sports badge.
- `mascot.tsx` reuses Little Joey's mascot.

See `../AGENTS.md` for the rules that apply to every mode.
