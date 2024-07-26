import { promises as fs } from "fs";
import path from "path";

import { allThemes } from "./findTheme";

export const getAllBackgrounds = async () => {
  const data = await Promise.all(
    allThemes.map(async (theme) => {
      const prefix = path.join(process.cwd(), `/public/backgrounds/${theme}`);

      const imageFiles = await fs.readdir(prefix);

      const sortedImageFiles = imageFiles.sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
      );

      const images = sortedImageFiles.map(
        (file) => `/backgrounds/${theme}/${file}`
      );

      return {
        theme,
        images,
      };
    })
  );

  return data;
};
