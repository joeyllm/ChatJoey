import type { ComponentType, SVGProps } from "react";

/**
 * Visual properties a mode may customise. Deliberately small — no layout,
 * spacing, or component overrides. Any field left out falls back to Joey's
 * normal default (wired in app/globals.css).
 */
export type JoeyTheme = {
  accent?: string;
  accentDeep?: string;
  background?: string;
  userMessage?: string;
  speechBubble?: string;
  sidebarTint?: string;
};

export type JoeyMode = {
  /** Folder name, e.g. "baby-joey". Must be unique across modes. */
  id: string;
  /** Persona name — shown in the chat label and welcome bubble. */
  name: string;
  /** Short description — for a future Joey Modes picker UI (unused for now). */
  description: string;
  /** Mascot speech-bubble text shown on the welcome screen. */
  welcomeIntro: string;
  /** Footer disclaimer sentence for this mode. */
  disclaimer: string;
  /**
   * Additional instructions layered on top of Joey's normal behaviour —
   * personality, tone, mode-specific rules. Not a replacement for Joey's
   * real backend system prompt. Imported from this mode's prompt.ts.
   */
  prompt: string;
  /** Imported from this mode's theme.ts. */
  theme: JoeyTheme;
  /** Imported from this mode's icon.tsx. */
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};
