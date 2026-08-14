import type { JoeyMode } from "../types";
import icon from "./icon";
import prompt from "./prompt";
import theme from "./theme";

const evilJoeyMode: JoeyMode = {
  id: "evil-joey",
  name: "Evil Joey",
  description: "A cheeky, mischievous Joey who loves a wind-up — fun and light, never mean.",
  welcomeIntro:
    "Oi, it's Evil Joey. I'm not actually evil — just here to stir the pot a little and have some fun.",
  disclaimer:
    "Evil Joey is all mischief, no malice — still learning and can get things wrong. Please check important information.",
  prompt,
  theme,
  icon,
};

export default evilJoeyMode;
