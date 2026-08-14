import babyJoey from "./baby-joey/mode";
// Add new modes here as they're contributed:
// import bendigoJoey from "./bendigo-joey/mode";

const modes = [babyJoey];

const DEFAULT_MODE_ID = "baby-joey";

/**
 * The mode this deployment renders. Override locally via
 * NEXT_PUBLIC_JOEY_MODE in .env.local to preview a mode you're building.
 */
export const activeMode =
  modes.find((candidate) => candidate.id === process.env.NEXT_PUBLIC_JOEY_MODE) ??
  modes.find((candidate) => candidate.id === DEFAULT_MODE_ID) ??
  modes[0];
