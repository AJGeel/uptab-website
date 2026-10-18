import { readFile } from "node:fs/promises";

import sharp from "sharp";

import { isLocalRequest } from "@/features/backgrounds/api/is-local-request";
import { resolveSourcePath } from "@/features/backgrounds/api/source-files";
import { mimeTypeOf } from "@/features/backgrounds/utils/image-formats";

const notFound = () => new Response("Not found", { status: 404 });

/**
 * Serves a source photo from assets/backgrounds/, which isn't public: a small
 * preview, resized because the originals are several MB each, or with
 * `?original` the file itself as a download, e.g. for a reverse image search.
 */
export const servePhoto = async (request: Request, segments: string[]) => {
  if (!(await isLocalRequest())) {
    return notFound();
  }

  try {
    const file = resolveSourcePath(segments.join("/"));

    if (new URL(request.url).searchParams.has("original")) {
      return new Response(new Uint8Array(await readFile(file)), {
        headers: {
          "Content-Type": mimeTypeOf(file),
          "Content-Disposition": `attachment; filename="${segments.join("-")}"`,
        },
      });
    }

    const thumbnail = await sharp(file)
      .autoOrient()
      .resize({ width: 480 })
      .webp({ quality: 70 })
      .toBuffer();

    return new Response(new Uint8Array(thumbnail), {
      headers: { "Content-Type": "image/webp", "Cache-Control": "no-store" },
    });
  } catch {
    return notFound();
  }
};
