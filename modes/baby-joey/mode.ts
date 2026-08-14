import type { JoeyMode } from "../types";
import icon from "./icon";
import prompt from "./prompt";
import theme from "./theme";

const babyJoeyMode: JoeyMode = {
  id: "baby-joey",
  name: "Baby Joey",
  description: "The default Joey persona — friendly, curious, still learning.",
  welcomeIntro:
    "Hi, I’m Baby Joey. I’m new here and still learning what it means to be Australian.",
  disclaimer:
    "Baby Joey is still learning and can get things wrong. Please check important information.",
  prompt,
  theme,
  icon,
};

export default babyJoeyMode;
