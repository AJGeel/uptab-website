/**
 * Generates the remote backgrounds catalogue and WebP renditions in
 * public/backgrounds/v1/ from the photos and metadata in assets/backgrounds/.
 * Runs as `prebuild`, or on its own with `bun run backgrounds`.
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

import {
  CATALOGUE_FILE,
  listSourceFiles,
  OUTPUT_DIR,
  readMetadataJson,
  SOURCE_DIR,
} from "@/features/backgrounds/api/source-files";
import type { BackgroundImage } from "@/features/backgrounds/types/catalogue";
import { getBaseUrl } from "@/features/backgrounds/utils/base-url";
import {
  buildCatalogue,
  pickWidths,
  toHexColor,
  WIDTHS,
} from "@/features/backgrounds/utils/catalogue";
import { parseMetadata, type SourceEntry } from "@/features/backgrounds/utils/metadata";
import { CATALOGUE_DIR, CATALOGUE_PATH } from "@/features/backgrounds/utils/paths";
import { plural } from "@/utils/plural";

import { header, p, pc, runCli, step } from "./cli";


type BuildResult = {
  image: BackgroundImage;
  sizes: { width: number; bytes: number }[];
};

const buildImage = async (
  entry: SourceEntry,
  baseUrl: string
): Promise<BuildResult> => {
  const input = await readFile(path.join(SOURCE_DIR, entry.file));
  const source = sharp(input);
  // Dimensions after applying EXIF orientation, matching the renditions
  const { width, height } = (await source.metadata()).autoOrient;
  const { dominant } = await source.stats();

  const widths = pickWidths(width);
  const themeDir = path.join(OUTPUT_DIR, entry.theme);
  await mkdir(themeDir, { recursive: true });

  const sources = await Promise.all(
    widths.map(async (renditionWidth) => {
      const output = await sharp(input)
        .autoOrient()
        .resize({ width: renditionWidth, withoutEnlargement: true })
        .webp({ quality: 80, effort: 6 })
        .toBuffer();

      const hash = createHash("sha256").update(output).digest("hex").slice(0, 6);
      const fileName = `${entry.id}-${renditionWidth}-${hash}.webp`;

      await writeFile(path.join(themeDir, fileName), output);

      return {
        width: renditionWidth,
        url: `${baseUrl}/${CATALOGUE_DIR}/${entry.theme}/${fileName}`,
        bytes: output.length,
      };
    })
  );

  return {
    image: {
      id: entry.id,
      theme: entry.theme,
      author: entry.author ?? null,
      link: entry.link ?? null,
      color: toHexColor(dominant),
      aspectRatio: Math.round((width / height) * 1000) / 1000,
      sources: sources.map(({ width, url }) => ({ width, url })),
    },
    sizes: sources.map(({ width, bytes }) => ({ width, bytes })),
  };
};

const formatKb = (bytes: number) => `${Math.round(bytes / 1024)} KB`;

/** One row per image, one column per width, e.g. "koppelpoort  327 KB  548 KB  1062 KB". */
const formatSizeTable = (results: BuildResult[]) => {
  const idWidth = Math.max(...results.map(({ image }) => image.id.length));
  const cell = (text: string) => text.padStart(9);
  const head = `${"".padEnd(idWidth)}${WIDTHS.map((width) => cell(String(width))).join("")}`;
  const rows = results.map(({ image, sizes }) => {
    const cells = WIDTHS.map((width) => {
      const size = sizes.find((candidate) => candidate.width === width);

      return size ? cell(formatKb(size.bytes)) : pc.dim(cell("—"));
    });

    return `${image.id.padEnd(idWidth)}${cells.join("")}`;
  });

  return [pc.dim(head), ...rows].join("\n");
};

const formatSeconds = (startedAt: number) =>
  `${((performance.now() - startedAt) / 1000).toFixed(1)}s`;

const main = async () => {
  header("UpTab · Backgrounds");

  const metadata = await step(
    "Checking backgrounds.json",
    async () =>
      parseMetadata(await readMetadataJson(), await listSourceFiles()),
    (data) => `backgrounds.json is valid · ${data.images.length} photos listed`
  );

  const baseUrl = getBaseUrl();
  const published = metadata.images.filter((image) => !image.creditPending);
  const pending = metadata.images.filter((image) => image.creditPending);

  p.log.info(`Image URLs start with ${pc.cyan(baseUrl)}`);

  const startedAt = performance.now();
  const results = await step(
    `Encoding ${published.length} backgrounds`,
    async (update) => {
      // Start clean, so renditions from earlier runs don't linger
      await rm(OUTPUT_DIR, { recursive: true, force: true });

      const built: BuildResult[] = [];

      // One image at a time: sharp already uses every core per image
      for (const [index, entry] of published.entries()) {
        update(`Encoding ${entry.id} (${index + 1}/${published.length})`);
        try {
          built.push(await buildImage(entry, baseUrl));
        } catch (error) {
          throw new Error(`Couldn't encode ${entry.id} (${entry.file}): ${error}`);
        }
      }

      return built;
    },
    (built) => {
      const files = built.flatMap(({ sizes }) => sizes);
      const totalMb = files.reduce((sum, { bytes }) => sum + bytes, 0) / 1024 ** 2;

      return `Encoded ${built.length} backgrounds · ${files.length} files, ${totalMb.toFixed(1)} MB in ${formatSeconds(startedAt)}`;
    }
  );

  p.note(formatSizeTable(results), "Rendition sizes");

  const images = results.map(({ image }) => image);
  const catalogue = buildCatalogue(metadata.themes, images);

  await writeFile(
    CATALOGUE_FILE,
    `${JSON.stringify(catalogue, null, 2)}\n`
  );

  if (pending.length > 0) {
    p.log.warn(
      `Skipped ${pending.length} photos with creditPending: ${pc.dim(pending.map(({ id }) => id).join(", "))}`
    );
  }

  p.outro(
    `${pc.green(`Wrote ${CATALOGUE_PATH.slice(1)}`)} ${pc.dim(`· ${plural(catalogue.themes.length, "theme")}, ${plural(images.length, "image")}`)}`
  );
};

runCli(main);
