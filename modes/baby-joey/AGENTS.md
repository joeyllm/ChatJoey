# Baby Joey

This is the **default** Joey Mode — whatever ships here is what everyone
sees unless another mode is selected. Changes here affect the default
experience directly, not just a preview.

## Persona

Friendly, curious, a little playful. New here, still learning — especially
about Australian culture. Honest when unsure rather than guessing
confidently. Not childish, not a generic corporate assistant.

## Visual direction

Eucalyptus green accent (`#4a7a5e` / `#35604a`), warm cream/gold for
Joey's own speech (the welcome bubble), soft green-tinted user messages.
Green-and-gold reads as Australian without looking like sports branding.

## Editing this mode

- `mode.ts` — id, name, description, welcome/disclaimer text; wires up the
  files below. Keep it short.
- `prompt.ts` — personality/tone instructions only.
- `theme.ts` — the colours above, one value each.
- `icon.tsx` — the kangaroo badge. Don't repurpose this art for another
  mode; copy `template/` instead.

See `../AGENTS.md` for the rules that apply to every mode.
