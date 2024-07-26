import { BgTheme, bgThemes } from "@/services/background/types";
import { dailyRandomNumber } from "@/utils/dailyRandomNumber";

export const allThemes = Object.keys(bgThemes);

const getRandomTheme = () => {
  const randomDailyNumber = (dailyRandomNumber() + 1) / 2;

  return allThemes[Math.floor(randomDailyNumber * allThemes.length)] as BgTheme;
};

export const findTheme = (theme?: string): BgTheme => {
  switch (theme) {
    case "abstract":
      return bgThemes.abstract;
    case "underwater":
      return bgThemes.underwater;
    case "safari":
      return bgThemes.safari;
    case "random":
      return getRandomTheme();
    case "holland":
    default:
      return bgThemes.holland;
  }
};
