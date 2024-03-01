import { promises as fs } from "fs";

import { dailyRandomNumber } from "@/utils/dailyRandomNumber";
import { randomToRange } from "@/utils/randomToRange";

import { BgTheme } from "./types";

export const getBackgroundImage = async (theme: BgTheme): Promise<Blob> => {
  const numBgs = await fs.readdir(
    process.cwd() + `/public/backgrounds/${theme}`
  );

  const seed = dailyRandomNumber();
  const randomNumber = randomToRange(seed, numBgs.length - 1);

  const file = await fs.readFile(
    process.cwd() + `/public/backgrounds/${theme}/${randomNumber}.jpg`
  );

  const blob = new Blob([file], { type: "image/jpeg" });

  return blob;
};