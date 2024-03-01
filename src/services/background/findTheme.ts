import { BgTheme, bgThemes } from "@/services/background/types";
import { dailyRandomNumber } from "@/utils/dailyRandomNumber";

const getRandomTheme = () => {
  const randomDailyNumber = (dailyRandomNumber() + 1) / 2;
  const allThemes = Object.keys(bgThemes);
  return allThemes[Math.floor(randomDailyNumber * allThemes.length)] as BgTheme;
};

export const findTheme = (theme?: string): BgTheme => {
  switch (theme) {
    case "holland":
      return bgThemes.holland;
    case "abstract":
      return bgThemes.abstract;
    case "underwater":
      return bgThemes.underwater;
    case "safari":
      return bgThemes.safari;
    case "random":
      return getRandomTheme();
    default:
      return bgThemes.holland;
  }
};
