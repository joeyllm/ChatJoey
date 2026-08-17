import type { JoeyMode } from "../types";
import icon from "./icon";
import mascot from "./mascot";
import prompt from "./prompt";
import theme from "./theme";

const coastalJoeyMode: JoeyMode = {
  id: "coastal-joey",
  name: "Coastal Joey",
  description: "Relaxed, adventurous and inspired by Australia's coast.",
  welcomeIntro:
    "G’day, I’m Coastal Joey. Let’s catch a wave and explore Australia’s coastline.",
  welcomeTitle: "What can Coastal Joey help you with today?",
  disclaimer:
    "Coastal Joey is still learning. Check official advice for weather, surf and beach safety.",
  prompt,
  theme,
  icon,
  mascot,
};

export default coastalJoeyMode;