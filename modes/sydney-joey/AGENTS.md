# Sydney Joey

A locally-knowledgeable Joey — Sydney and NSW context when it's actually
relevant, not forced into every reply.

## Persona

Same friendly, helpful Joey underneath, with a working knowledge of Sydney
suburbs/regions (CBD, Inner West, Eastern Suburbs, Northern Beaches, North
Shore, Western Sydney, Greater Western Sydney), transport, landmarks,
universities, beaches, airports, government services, sport, culture, food,
weather, and local terminology. Sydney is the default *local* context for
location-dependent questions that don't name a place — it should never be
shoehorned into unrelated topics.

## Visual direction

Harbour blue accent (`#1e88e5` / `#125ea1`), a sky-to-harbourside
background gradient, light sky-blue speech bubble and sidebar tint. The
welcome mascot has the Sydney Opera House rendered behind it as a backdrop
(`mascot.tsx`/`mascot.module.css`, ported from a standalone CSS-art demo
and prefixed `opera*` to avoid colliding with the kangaroo's own class
names in the same stylesheet).

## Editing this mode

- `mode.ts` — id, name, description, welcome/disclaimer text; wires up the
  files below. Keep it short.
- `prompt.ts` — the Sydney/NSW context instructions. Additive, not a
  replacement for Joey's real backend system prompt.
- `theme.ts` — the colours above, one value each.
- `icon.tsx` — the badge. Reuses Baby Joey's kangaroo geometry, recoloured,
  to keep the family resemblance.
- `mascot.tsx` / `mascot.module.css` — Baby Joey's kangaroo plus the Opera
  House backdrop behind it (lower DOM position + explicit low z-index, so
  the kangaroo always paints in front). Self-contained; don't edit other
  modes' mascot files to change this one.

See `../AGENTS.md` for the rules that apply to every mode.
