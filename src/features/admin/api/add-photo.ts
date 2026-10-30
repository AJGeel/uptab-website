"use server";

import sharp from "sharp";

import {
  commitChange,
  formText,
  loadState,
  runAction,
} from "@/features/admin/api/run-action";
import { addPhoto, toSlug } from "@/features/admin/utils/edits";
import { extensionForFormat, FORMAT_NAMES } from "@/features/backgrounds/utils/image-formats";

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
  const extension = extensionForFormat(format);

  if (!extension) {
    throw new Error(`${value.name} isn't a ${FORMAT_NAMES} image.`);
  }

  return { buffer, extension, name: value.name };
};

/**
 * Adds one uploaded photo. Published straight away with an author, pending
 * without. The batch upload calls this once per photo.
 */
export const addPhotoAction = async (form: FormData) =>
  await runAction(async () => {
    const upload = await readUpload(form.get("file"));
    const id = formText(form, "id") || toSlug(upload.name);
    const author = formText(form, "author");
    const state = await loadState();
    const change = addPhoto(state.metadata, {
      id,
      theme: formText(form, "theme"),
      author,
      link: formText(form, "link"),
      extension: upload.extension,
    });

    await commitChange(state, change, upload.buffer);

    return author ? `Added and published ${id}` : `Added ${id} as pending`;
  });
