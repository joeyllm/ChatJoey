import type { JoeyMode } from "../types";
import icon from "./icon";
import mascot from "./mascot";
import prompt from "./prompt";
import theme from "./theme";

// This file is a starting point, not a registered mode — copy this whole
// `template/` folder to a new folder (e.g. `bendigo-joey/`) and edit the
// copy, not this one. See README.md in this folder for the full steps.

const templateMode: JoeyMode = {
  // Match this to your new folder's name.
  id: "template",

  // Shown in the chat label and welcome bubble.
  name: "Template Joey",

  // Short blurb — will show in a future Joey Modes picker UI.
  description: "One-line description of your mode's personality.",

  // Mascot speech-bubble text on the welcome screen.
  welcomeIntro: "Hi, I'm Template Joey. Replace this with your mode's intro.",

  // Footer disclaimer sentence for this mode.
  disclaimer: "Template Joey is still learning and can get things wrong.",

  // See prompt.ts, theme.ts, icon.tsx, and mascot.tsx in this folder.
  prompt,
  theme,
  icon,
  mascot,
};

export default templateMode;
