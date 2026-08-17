import evilJoey from "./evil-joey/mode";
import ecoJoey from "./eco-joey/mode";
import littleJoey from "./little-joey/mode";
import sportsJoey from "./sports-joey/mode";
import sydneyJoey from "./sydney-joey/mode";

// Add new modes here as they're contributed:
// import bendigoJoey from "./bendigo-joey/mode";

/** Every registered mode — used to render the Joey Modes switcher. */
export const modes = [littleJoey, evilJoey, sydneyJoey, sportsJoey, ecoJoey];

const DEFAULT_MODE_ID = "little-joey";
