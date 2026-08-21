import evilJoey from "./evil-joey/mode";
import ecoJoey from "./eco-joey/mode";
import littleJoey from "./little-joey/mode";
import sportsJoey from "./sports-joey/mode";
import sydneyJoey from "./sydney-joey/mode";

// Add new modes here as they're contributed:
// import bendigoJoey from "./bendigo-joey/mode";

/** Every registered mode — used to render the Joey Modes switcher. */
export const modes = [
  littleJoey,
  evilJoey,
  sydneyJoey,
  sportsJoey,
  ecoJoey,
];

const DEFAULT_MODE_ID = "little-joey";

/**
 * The mode this deployment renders by default. Override locally via
 * NEXT_PUBLIC_JOEY_MODE in .env.local to preview a mode you're building.
 * The sidebar switcher can change the active mode at runtime from here.
 */
export const activeMode =
  modes.find((candidate) => candidate.id === process.env.NEXT_PUBLIC_JOEY_MODE) ??
  modes.find((candidate) => candidate.id === DEFAULT_MODE_ID) ??
  modes[0];
