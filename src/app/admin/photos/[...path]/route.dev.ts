import { readFile } from "node:fs/promises";

import sharp from "sharp";

import { resolveSourcePath } from "../../../../../scripts/assets";
import { isLocalRequest } from "../../isLocalRequest";

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  tif: "image/tiff",
  tiff: "image/tiff",
};

/**
 * Small previews of the source photos in assets/backgrounds/, which aren't
 * served otherwise. Resized, because the originals are several MB each.
 * With `?original`, downloads the source file itself, e.g. to drop it into
 * a reverse image search.
 */
export const GET = async (
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) => {
  if (!(await isLocalRequest())) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const { path } = await params;
    const file = resolveSourcePath(path.join("/"));

    if (new URL(request.url).searchParams.has("original")) {
      const extension = file.slice(file.lastIndexOf(".") + 1).toLowerCase();

      return new Response(new Uint8Array(await readFile(file)), {
        headers: {
          "Content-Type": CONTENT_TYPES[extension] ?? "application/octet-stream",
          "Content-Disposition": `attachment; filename="${path.join("-")}"`,
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
    return new Response("Not found", { status: 404 });
  }
};
