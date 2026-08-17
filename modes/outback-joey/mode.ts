import type { JoeyMode } from "../types";
import icon from "./icon";
import mascot from "./mascot";
import prompt from "./prompt";
import theme from "./theme";

const outbackJoey: JoeyMode = {
  id: "outback-joey",
  name: "Outback Joey",
  switcherLabel: "Outback Joey",
  description: "Calm, practical help with a dry dash of Australian humour.",
  welcomeIntro: "G'day. Let's sort it out one practical step at a time.",
  welcomeTitle: "What can Outback Joey help you tackle?",
  disclaimer: "Outback Joey can still wander off-track, so check important details.",
  prompt,
  theme,
  icon,
  mascot,
};

export default outbackJoey;
