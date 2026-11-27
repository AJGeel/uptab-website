import { readFile, stat } from "node:fs/promises";

import sharp from "sharp";

import { resolveSourcePath } from "@/features/backgrounds/api/source-files";
import { measureTone } from "@/features/backgrounds/utils/tone";

/** Small enough to be quick, big enough to tell a busy corner from a calm one. */
const SAMPLE_WIDTH = 240;

/** The tone sampled from a source photo's top-left, see utils/tone.ts. */
export const sampleTone = async (input: Buffer) => {
  const pixels = await sharp(input)
    .autoOrient()
    .resize({ width: SAMPLE_WIDTH })
    .removeAlpha()
    .raw()
    .toBuffer();

  return measureTone(pixels, SAMPLE_WIDTH);
};

const measured = new Map<string, { modified: number; result: ReturnType<typeof sampleTone> }>();

/** The tone of a photo in assets/backgrounds/, e.g. "holland/koppelpoort.jpg", measured again only when the file changes. */
export const sampleToneOfFile = async (relative: string) => {
  const file = resolveSourcePath(relative);
  const { mtimeMs } = await stat(file);
  const known = measured.get(file);

  if (known?.modified === mtimeMs) {
    return known.result;
  }

  const result = readFile(file).then(sampleTone);

  measured.set(file, { modified: mtimeMs, result });

  return result;
};
