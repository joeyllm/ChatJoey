# Coastal Joey

A relaxed, friendly Joey inspired by Australia's entire coastline. Coastal
context should be useful and natural rather than forced into every response.

## Persona

Warm, optimistic, calm, and adventurous. Coastal Joey enjoys discussing
Australian beaches, coastal communities, marine life, surfing, swimming,
walking, conservation, and responsible coastal travel.

Use Australian expressions sparingly and naturally. Do not exaggerate the
accent or turn the personality into a stereotype. Coastal Joey remains
helpful with ordinary questions that have no connection to the coast.

Never claim to have live knowledge of tides, weather, surf conditions, water
quality, shark alerts, or beach closures. For time-sensitive coastal safety
questions, direct users to official local sources and lifeguard advice.
Encourage swimming between the red and yellow flags where available.

## Visual direction

Ocean teal accents (`#168c96` / `#0b6670`), a sky-to-sea-to-sand background
gradient, a warm cream speech bubble, and a light coastal sidebar tint.

The welcome mascot strictly preserves Little Joey's original kangaroo
geometry and proportions. Coastal-only additions are layered around that
original artwork: a teal surfboard beneath Joey, ocean waves in the
background, and a warm yellow sun. The original white eye highlights remain,
while the irises use coastal green.

Keep the mascot recognisably part of the existing Joey family. Do not replace
it with a differently proportioned or unrelated kangaroo illustration.

## Editing this mode

- `mode.ts` — id, name, description, welcome text, disclaimer, and imports.
  Keep personality details out of this coordinator file.
- `prompt.ts` — additive personality, coastal context, environmental
  responsibility, and safety guidance. It must not replace or override
  Joey's backend system prompt or safety behaviour.
- `theme.ts` — Coastal Joey's approved theme colours only. Do not add layout
  or component overrides.
- `icon.tsx` — the Coastal Joey badge, using coastal colours and maintaining
  the Joey family resemblance.
- `mascot.tsx` / `mascot.module.css` — a self-contained copy of Little Joey's
  original mascot with Coastal Joey's surfboard, waves, sun, and green iris
  treatment. Do not edit Little Joey's files to change Coastal Joey.
- Keep all Coastal-specific visual changes inside `modes/coastal-joey/`.

## Validation

Before submitting changes:

1. Run `npx tsc --noEmit`.
2. Run `npm run lint`.
3. Run `npm run build`.
4. Preview Coastal Joey locally and verify Mode switching, welcome content,
   theme colours, mascot layering, composer interaction, and representative
   tablet/mobile layouts.
5. Use mock/demo mode only; do not use a real JoeyLLM API key or deploy the
   branch.

See `../AGENTS.md` for the rules that apply to every Joey Mode.
