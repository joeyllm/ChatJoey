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
  /** Folder name, e.g. "little-joey". Must be unique across modes. */
  id: string;
  /** Persona name — shown in the chat label and welcome bubble. */
  name: string;
  /**
   * Label shown in the sidebar Joey Modes switcher, if different from
   * `name` (e.g. a shorter nickname). Falls back to `name` when unset.
   */
  switcherLabel?: string;
  /**
   * Very short description shown when hovering/focusing this mode's button
   * in the sidebar switcher. Keep it to one short sentence.
   */
  description: string;
  /** Mascot speech-bubble text shown on the welcome screen. */
  welcomeIntro: string;
  /** Welcome screen heading, e.g. "What can little Joey help you with today?" */
  welcomeTitle: string;
  /** Footer disclaimer sentence for this mode. */
  disclaimer: string;
  /**
   * The persona / tone instructions for this mode now live server-side in
   * JoeyBackend (`src/persona.rs`), keyed by this mode's `id`. The client
   * sends `mode: id` to `/api/chat`; JoeyBackend builds the system prompt.
   * A mode here is presentation only — name, welcome copy, theme, mascot.
   */
  /** Imported from this mode's theme.ts. */
  theme: JoeyTheme;
  /** Imported from this mode's icon.tsx. */
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /**
   * The welcome-screen mascot. Imported from this mode's mascot.tsx. A mode
   * that doesn't want a custom mascot can just re-export another mode's
   * (see modes/template/mascot.tsx) instead of duplicating the markup/CSS.
   */
  mascot: ComponentType;
  /**
   * Optional pixel offset for the whole welcome intro group (mascot +
   * speech bubble), moved together as one unit. Rarely needed — only for a
   * mode whose mascot is visually larger/wider than the default and needs
   * repositioning to sit well against the heading/composer below it.
   */
  introOffset?: { x: number; y: number };
};
