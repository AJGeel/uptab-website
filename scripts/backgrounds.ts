/**
 * Pure logic for scripts/build-backgrounds.ts: metadata validation, base URL
 * resolution, rendition widths and catalogue assembly. No file system or
 * image processing, so it can be tested directly.
 */
import { z } from "zod";

import type {
  BackgroundImage,
  Catalogue,
  Theme,
} from "../src/services/background/types";

export const WIDTHS = [1920, 2560, 3840];

/** IDs end up in URLs, file names and users' settings, so keep them simple. */
export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const SLUG_HINT = "Use lowercase letters, digits and dashes";

const slug = z.string().regex(SLUG_PATTERN, SLUG_HINT);

/*
 * Strict objects reject unknown keys, so a typo such as "creditPendng" fails
 * instead of silently publishing an uncredited photo.
 */
const metadataSchema = z.strictObject({
  themes: z.array(z.strictObject({ id: slug, name: z.string().min(1) })),
  images: z.array(
    z.strictObject({
      id: slug,
      theme: z.string(),
      file: z.string().min(1),
      author: z.string().min(1).nullable().optional(),
      link: z.url({ protocol: /^https?$/ }).nullable().optional(),
      creditPending: z.boolean().optional(),
    })
  ),
});

export type SourceMetadata = z.infer<typeof metadataSchema>;
export type SourceEntry = SourceMetadata["images"][number];

const findDuplicates = (values: string[]) => [
  ...new Set(values.filter((value, index) => values.indexOf(value) !== index)),
];

/** Names the image by its ID when it has one, e.g. "images[3] (koppelpoort).link". */
const formatIssue = (raw: unknown, { path, message }: z.core.$ZodIssue) => {
  const [section, index, ...rest] = path;

  if (section !== "images" || typeof index !== "number") {
    return `${path.join(".") || "backgrounds.json"}: ${message}`;
  }

  const { id } = (raw as { images: { id?: unknown }[] }).images[index] ?? {};
  const name = typeof id === "string" ? ` (${id})` : "";
  const field = rest.length > 0 ? `.${rest.join(".")}` : "";

  return `images[${index}]${name}${field}: ${message}`;
};

const invalid = (problems: string[]) =>
  new Error(`Invalid backgrounds.json:\n- ${problems.join("\n- ")}`);

const parseJson = (json: string): unknown => {
  try {
    return JSON.parse(json);
  } catch (error) {
    throw new Error(`backgrounds.json is not valid JSON: ${error}`);
  }
};

const findProblems = (metadata: SourceMetadata, sourceFiles: string[]) => {
  const problems: string[] = [];
  const themeIds = metadata.themes.map(({ id }) => id);
  const listedFiles = metadata.images.map(({ file }) => file);

  for (const id of findDuplicates(themeIds)) {
    problems.push(`Duplicate theme ID: ${id}`);
  }

  for (const id of findDuplicates(metadata.images.map((image) => image.id))) {
    problems.push(`Duplicate image ID: ${id}`);
  }

  for (const file of findDuplicates(listedFiles)) {
    problems.push(`File listed more than once: ${file}`);
  }

  for (const image of metadata.images) {
    if (!themeIds.includes(image.theme)) {
      problems.push(`${image.id}: unknown theme "${image.theme}"`);
    }

    if (!sourceFiles.includes(image.file)) {
      problems.push(`${image.id}: file not found: ${image.file}`);
    }

    if (!image.creditPending && !("author" in image)) {
      problems.push(
        `${image.id}: published images need an "author" key (use null to hide the credit)`
      );
    }
  }

  for (const file of sourceFiles) {
    if (!listedFiles.includes(file)) {
      problems.push(`No entry in backgrounds.json for: ${file}`);
    }
  }

  return problems;
};

/** Every problem with the metadata, checked against the files on disk. Empty when valid. */
export const listProblems = (raw: unknown, sourceFiles: string[]) => {
  const result = metadataSchema.safeParse(raw);

  return result.success
    ? findProblems(result.data, sourceFiles)
    : result.error.issues.map((issue) => formatIssue(raw, issue));
};

/**
 * Reads backgrounds.json for editing. It must have the right shape, but may
 * be out of sync with the files on disk, so those problems can be fixed.
 */
export const readMetadata = (json: string): SourceMetadata => {
  const raw = parseJson(json);
  const result = metadataSchema.safeParse(raw);

  if (!result.success) {
    throw invalid(result.error.issues.map((issue) => formatIssue(raw, issue)));
  }

  return result.data;
};

/**
 * Parses backgrounds.json and checks it against the source files on disk.
 * Throws one error listing every problem, so they can all be fixed at once.
 */
export const parseMetadata = (
  json: string,
  sourceFiles: string[]
): SourceMetadata => {
  const metadata = readMetadata(json);
  const problems = findProblems(metadata, sourceFiles);

  if (problems.length > 0) {
    throw invalid(problems);
  }

  return metadata;
};

type Env = Record<string, string | undefined>;

/**
 * Explicit env var first. Otherwise Vercel's stable production URL in
 * production and the deployment's own URL in previews, since a preview's
 * new hashes don't exist on the production domain.
 */
export const getBaseUrl = (env: Env = process.env) => {
  const {
    NEXT_PUBLIC_SITE_URL,
    VERCEL_ENV,
    VERCEL_PROJECT_PRODUCTION_URL,
    VERCEL_URL,
  } = env;

  if (NEXT_PUBLIC_SITE_URL) {
    if (!URL.canParse(NEXT_PUBLIC_SITE_URL)) {
      throw new Error(`NEXT_PUBLIC_SITE_URL is not a URL: ${NEXT_PUBLIC_SITE_URL}`);
    }

    const { protocol, origin } = new URL(NEXT_PUBLIC_SITE_URL);

    if (protocol !== "https:" && protocol !== "http:") {
      throw new Error(`NEXT_PUBLIC_SITE_URL must use http(s): ${NEXT_PUBLIC_SITE_URL}`);
    }

    return origin;
  }

  if (VERCEL_ENV === "production") {
    if (!VERCEL_PROJECT_PRODUCTION_URL) {
      // The deployment URL changes every deploy, so never publish it in production
      throw new Error(
        "Production build without VERCEL_PROJECT_PRODUCTION_URL. Set NEXT_PUBLIC_SITE_URL instead."
      );
    }

    return `https://${VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (VERCEL_URL) {
    return `https://${VERCEL_URL}`;
  }

  if (VERCEL_ENV) {
    throw new Error("Running on Vercel, but no base URL could be determined.");
  }

  return "http://localhost:3000";
};

/** Never upscale, and always produce at least one rendition. */
export const pickWidths = (sourceWidth: number) => {
  const widths = WIDTHS.filter((width) => width <= sourceWidth);

  return widths.length > 0 ? widths : [sourceWidth];
};

export const toHexColor = ({ r, g, b }: { r: number; g: number; b: number }) =>
  `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`;

export const buildCatalogue = (
  themes: Theme[],
  images: BackgroundImage[],
  generatedAt = new Date()
): Catalogue => ({
  version: 1,
  generatedAt: generatedAt.toISOString(),
  // Leave out empty themes, so the extension never offers one
  themes: themes.filter(({ id }) => images.some((image) => image.theme === id)),
  images,
});
