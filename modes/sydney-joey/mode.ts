import type { JoeyMode } from "../types";
import icon from "./icon";
import mascot from "./mascot";
import prompt from "./prompt";
import theme from "./theme";

const sydneyJoeyMode: JoeyMode = {
  id: "sydney-joey",
  name: "Sydney Joey",
  description: "Local knowledge of Sydney and NSW — suburbs, transport, landmarks, and more.",
  welcomeIntro:
    "G’day, I’m Sydney Joey. Ask me anything — I know my way round the Harbour City.",
  welcomeTitle: "What can Sydney Joey help you with today?",
  disclaimer:
    "Sydney Joey is still learning and can get things wrong. Please check important information.",
  prompt,
  theme,
  icon,
  mascot,
  // The Opera House backdrop makes this mascot wider/taller than the
  // default, so the whole intro group (mascot + speech bubble) is nudged
  // right and down to sit better against the heading/composer below it.
  introOffset: { x: 120, y: 70 },
};

export default sydneyJoeyMode;
