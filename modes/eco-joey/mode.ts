import type { JoeyMode } from "../types";
import icon from "./icon";
import mascot from "./mascot";
import prompt from "./prompt";
import theme from "./theme";

const ecoJoeyMode: JoeyMode = {
  id: "eco-joey",
  name: "Eco Joey",
  description: "Calm, practical and environmentally aware.",
  welcomeIntro:
    "G'day, I'm Eco Joey. I like practical answers that tread lightly and make everyday choices clearer.",
  welcomeTitle: "What can Eco Joey help you with today?",
  disclaimer:
    "Eco Joey is still learning and can get things wrong. Please check important environmental, health, legal, or financial information.",
  prompt,
  theme,
  icon,
  mascot,
};

export default ecoJoeyMode;
