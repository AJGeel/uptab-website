import { BgTheme, bgThemes } from "@/services/background/types";

export const findTheme = (theme?: string): BgTheme => {
  switch (theme) {
    case "holland":
      return bgThemes.holland;
    case "abstract":
      return bgThemes.abstract;
    default:
      return bgThemes.holland;
  }
};
