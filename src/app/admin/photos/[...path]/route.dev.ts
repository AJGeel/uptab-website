import sharp from "sharp";

import { resolveSourcePath } from "../../../../../scripts/assets";
import { isLocalRequest } from "../../isLocalRequest";

/**
 * Small previews of the source photos in assets/backgrounds/, which aren't
 * served otherwise. Resized, because the originals are several MB each.
 */
export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) => {
  if (!(await isLocalRequest())) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const { path } = await params;
    const thumbnail = await sharp(resolveSourcePath(path.join("/")))
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
