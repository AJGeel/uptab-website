"use server";

import { execFile } from "node:child_process";
import { mkdir, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify, stripVTControlCharacters } from "node:util";

import { revalidatePath } from "next/cache";
import sharp from "sharp";

import type { ActionState } from "@/features/backgrounds/types/action-state";
import { describeSave } from "@/features/backgrounds/utils/describe-save";
import {
  addPhoto,
  assertValidChange,
  type Change,
  createTheme,
  type PhotoFields,
  removePhoto,
  saveEdits,
  type ThemeEdits,
  toSlug,
} from "@/features/backgrounds/utils/edits";
import { readMetadata, type SourceMetadata } from "@/features/backgrounds/utils/metadata";

import { isLocalRequest } from "./is-local-request";
import {
  listSourceFiles,
  readMetadataJson,
  resolveSourcePath,
  writeMetadata,
} from "./source-files";


const execFileAsync = promisify(execFile);

const EXTENSIONS: Record<string, string> = {
  jpeg: ".jpg",
  png: ".png",
  webp: ".webp",
  tiff: ".tiff",
};

const NOT_LOCAL: ActionState = {
  error: "The admin only works on localhost.",
  message: null,
};

/** Refreshes every admin page, including their status banners. */
const refresh = () => revalidatePath("/admin", "layout");

type Outcome = string | { message: string; details: string | null };

/** Runs a task and reports its outcome, refreshing the admin on success. */
const run = async (task: () => Promise<Outcome>): Promise<ActionState> => {
  if (!(await isLocalRequest())) {
    return NOT_LOCAL;
  }

  try {
    const outcome = await task();

    refresh();

    return typeof outcome === "string"
      ? { error: null, message: outcome }
      : { error: null, ...outcome };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      message: null,
    };
  }
};

type State = { metadata: SourceMetadata; files: string[] };

const loadState = async (): Promise<State> => ({
  metadata: readMetadata(await readMetadataJson()),
  files: await listSourceFiles(),
});

/** Validates a change, then writes, moves or deletes its files and saves the metadata. */
const commit = async ({ metadata, files }: State, change: Change, upload?: Buffer) => {
  assertValidChange(metadata, files, change);

  for (const file of change.files) {
    if (file.kind === "add" && upload) {
      const to = resolveSourcePath(file.to);

      await mkdir(path.dirname(to), { recursive: true });
      await writeFile(to, upload, { flag: "wx" });
    }

    if (file.kind === "move") {
      const to = resolveSourcePath(file.to);

      await mkdir(path.dirname(to), { recursive: true });
      await rename(resolveSourcePath(file.from), to);
    }
  }

  await writeMetadata(change.metadata);

  for (const file of change.files) {
    if (file.kind === "delete") {
      await unlink(resolveSourcePath(file.from));
    }
  }
};

const text = (form: FormData, name: string) => String(form.get(name) ?? "").trim();

/** Reads an upload, checking it's an image sharp can encode. */
const readUpload = async (value: FormDataEntryValue | null) => {
  if (!(value instanceof File) || value.size === 0) {
    throw new Error("Choose a photo to upload.");
  }

  const buffer = Buffer.from(await value.arrayBuffer());
  const format = await sharp(buffer)
    .metadata()
    .then((metadata) => metadata.format)
    .catch(() => undefined);
  const extension = format && EXTENSIONS[format];

  if (!extension) {
    throw new Error(`${value.name} isn't a JPEG, PNG, WebP or TIFF image.`);
  }

  return { buffer, extension, name: value.name };
};

/**
 * Turns the edit form's "<group>:<field>" names back into edits, e.g.
 * "photo:koppelpoort:author" and "theme:name". Only changed groups are sent.
 */
const readEdits = (form: FormData): ThemeEdits => {
  const groups = new Map<string, Record<string, string>>();

  for (const [name, value] of form.entries()) {
    const split = name.lastIndexOf(":");
    const group = name.slice(0, split);

    groups.set(group, { ...groups.get(group), [name.slice(split + 1)]: String(value) });
  }

  const theme = groups.get("theme");
  const photos = [...groups]
    .filter(([group]) => group.startsWith("photo:"))
    .map(([group, fields]) => ({
      originalId: group.slice("photo:".length),
      fields: {
        id: (fields.id ?? "").trim(),
        theme: fields.theme ?? "",
        author: fields.author ?? "",
        link: fields.link ?? "",
      } satisfies PhotoFields,
    }));

  return {
    theme: theme ? { id: theme.id ?? "", name: theme.name ?? "" } : undefined,
    photos,
  };
};

export const createThemeAction = async (form: FormData) =>
  await run(async () => {
    const state = await loadState();
    const change = createTheme(state.metadata, {
      id: text(form, "id"),
      name: text(form, "name"),
    });

    await commit(state, change);

    return `Created ${change.metadata.themes.at(-1)?.name}`;
  });

/** Saves everything changed on a theme's page in one go. */
export const saveThemeAction = async (form: FormData) =>
  await run(async () => {
    const state = await loadState();
    const edits = readEdits(form);
    const saved = saveEdits(state.metadata, edits);

    await commit(state, saved);

    return describeSave(edits, saved);
  });

export const addPhotoAction = async (form: FormData) =>
  await run(async () => {
    const upload = await readUpload(form.get("file"));
    const id = text(form, "id") || toSlug(upload.name);
    const author = text(form, "author");
    const state = await loadState();
    const change = addPhoto(state.metadata, {
      id,
      theme: text(form, "theme"),
      author,
      link: text(form, "link"),
      extension: upload.extension,
    });

    await commit(state, change, upload.buffer);

    return author ? `Added and published ${id}` : `Added ${id} as pending`;
  });

export const removePhotoAction = async (id: string) =>
  await run(async () => {
    const state = await loadState();

    await commit(state, removePhoto(state.metadata, id));

    return `Removed ${id}`;
  });

let isRebuilding = false;

/** Runs the build script, as `prebuild` does, and returns its log. */
export const rebuildAction = async (): Promise<ActionState> => {
  if (!(await isLocalRequest())) {
    return NOT_LOCAL;
  }

  // Two runs at once would both clear and rewrite public/backgrounds/v1/
  if (isRebuilding) {
    return { error: "A rebuild is already running.", message: null };
  }

  isRebuilding = true;

  try {
    const { stdout, stderr } = await execFileAsync(
      "bun",
      ["scripts/build-backgrounds.ts"],
      { cwd: process.cwd(), maxBuffer: 10 * 1024 * 1024 }
    );

    refresh();
    revalidatePath("/backgrounds");

    return {
      error: null,
      message: "Catalogue rebuilt",
      log: stripVTControlCharacters(stdout + stderr),
    };
  } catch (error) {
    const { stdout = "", stderr = "" } = error as { stdout?: string; stderr?: string };

    return {
      error: "The build script failed. See the log below the rebuild button.",
      message: null,
      log: stripVTControlCharacters(stdout + stderr) || String(error),
    };
  } finally {
    isRebuilding = false;
  }
};
