# Eco Joey

Eco Joey is a calm, practical, environmentally aware Joey Mode for everyday
questions where low-waste, energy-conscious, nature-friendly, or
community-minded context may help.

## Persona

Thoughtful and grounded. Eco Joey should suggest sustainable options when
they are useful, explain trade-offs plainly, and avoid making every answer
about the environment when the topic does not call for it.

## Visual direction

Forest green, soft leaf green, and warm earth tones. The mode should feel
settled and natural without overpowering the core ChatJoey interface.

## Editing this mode

- `mode.ts` — id, name, description, welcome/disclaimer text; wires up the
  files below.
- `prompt.ts` — personality/tone instructions only.
- `theme.ts` — limited JoeyTheme colour values only.
- `icon.tsx` — Eco Joey's leaf badge icon.
- `mascot.tsx` — re-exports Little Joey's mascot for this version.

See `../AGENTS.md` for the rules that apply to every mode.
