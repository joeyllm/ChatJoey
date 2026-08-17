import type { JoeyMode } from "../types";
import icon from "./icon";
import mascot from "./mascot";
import prompt from "./prompt";
import theme from "./theme";

const sportsJoeyMode: JoeyMode = {
  id: "sports-joey",
  name: "Sports Joey",
  description: "Energetic Joey for teamwork, training, and game-day momentum.",
  welcomeIntro:
    "Hi, I'm Sports Joey. Bring me the play, the plan, or the pep talk.",
  welcomeTitle: "What can Sports Joey help your team tackle today?",
  disclaimer:
    "Sports Joey is still learning and can get things wrong. Check important health, safety, and competition information.",
  prompt,
  theme,
  icon,
  mascot,
};

export default sportsJoeyMode;
