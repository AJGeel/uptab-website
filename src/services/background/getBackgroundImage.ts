import { promises as fs } from "fs";
import path from "path";

import { dailyRandomNumber } from "@/utils/dailyRandomNumber";
import { randomToRange } from "@/utils/randomToRange";

import { BgTheme } from "./types";

export const getBackgroundImage = async (theme: BgTheme): Promise<Blob> => {
  const bgDir = path.join(process.cwd(), `/public/backgrounds/${theme}`);

  // Get all files in the directory
  const files = await fs.readdir(bgDir);

  // Filter for image files (assuming jpg, jpeg, png)
  const imageFiles = files.filter((file) => /\.(jpe?g|png)$/i.test(file));

  if (imageFiles.length === 0) {
    throw new Error(`No image files found in ${bgDir}`);
  }

  // Select a random image file
  const seed = dailyRandomNumber(1);
  const randomIndex = randomToRange(seed, imageFiles.length - 1);
  const randomImageFile = imageFiles[randomIndex];

  // Read the selected file
  const filePath = path.join(bgDir, randomImageFile);
  const file = await fs.readFile(filePath);

  // Create and return a Blob
  const blob = new Blob([file], { type: "image/jpeg" });
  return blob;
};
