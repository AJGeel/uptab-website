import { readFile } from "node:fs/promises";

import sharp from "sharp";

import { isLocalRequest } from "@/features/admin/api/is-local-request";
import { resolveSourcePath } from "@/features/backgrounds/api/source-files";
import { mimeTypeOf } from "@/features/backgrounds/utils/image-formats";

const notFound = () => new Response("Not found", { status: 404 });

/**
 * Serves a source photo from assets/backgrounds/, which isn't public: a small
 * preview, resized because the originals are several MB each, or with
 * `?preview` a full-screen one, or with `?original` the file itself as a
 * download, e.g. for a reverse image search.
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

    // Full-screen size, for the extension preview in an iframe
    const width = new URL(request.url).searchParams.has("preview") ? 1920 : 480;
    const thumbnail = await sharp(file)
      .autoOrient()
      .resize({ width })
      .webp({ quality: width === 480 ? 70 : 80 })
      .toBuffer();

    return new Response(new Uint8Array(thumbnail), {
      headers: {
        "Content-Type": "image/webp",
        // The previewer cycles through photos quickly, and reuses what it preloaded
        "Cache-Control": width === 480 ? "no-store" : "private, max-age=300",
      },
    });
  } catch {
    return notFound();
  }
};
