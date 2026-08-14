import type { JoeyMode } from "../types";
import icon from "./icon";
import mascot from "./mascot";
import prompt from "./prompt";
import theme from "./theme";

const babyJoeyMode: JoeyMode = {
  id: "baby-joey",
  name: "Baby Joey",
  switcherLabel: "Little Joey",
  description: "Friendly, simple and playful.",
  welcomeIntro:
    "Hi, I’m Baby Joey. I’m new here and still learning what it means to be Australian.",
  welcomeTitle: "What can little Joey help you with today?",
  disclaimer:
    "Baby Joey is still learning and can get things wrong. Please check important information.",
  prompt,
  theme,
  icon,
  mascot,
};

export default babyJoeyMode;
