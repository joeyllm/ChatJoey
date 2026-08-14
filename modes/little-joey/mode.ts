import type { JoeyMode } from "../types";
import icon from "./icon";
import mascot from "./mascot";
import prompt from "./prompt";
import theme from "./theme";

const littleJoeyMode: JoeyMode = {
  id: "little-joey",
  name: "Little Joey",
  description: "Friendly, simple and playful.",
  welcomeIntro:
    "Hi, I’m Little Joey. I’m new here and still learning what it means to be Australian.",
  welcomeTitle: "What can Little Joey help you with today?",
  disclaimer:
    "Little Joey is still learning and can get things wrong. Please check important information.",
  prompt,
  theme,
  icon,
  mascot,
};

export default littleJoeyMode;
