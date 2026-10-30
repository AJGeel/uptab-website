"use server";

import { isLocalRequest } from "@/features/admin/api/is-local-request";
import { NOT_LOCAL } from "@/features/admin/api/run-action";
import { parseUnsplashUrl } from "@/features/admin/utils/unsplash";

const API = "https://api.unsplash.com";

type UnsplashPhoto = {
  id: string;
  user: { name: string };
  links: { html: string; download_location: string };
};

class RateLimitError extends Error {}

const callApi = async <T>(url: string, key: string) => {
  const response = await fetch(url, {
    headers: { Authorization: `Client-ID ${key}`, "Accept-Version": "v1" },
    signal: AbortSignal.timeout(30_000),
  });

  if (response.status === 403 && response.headers.get("X-Ratelimit-Remaining") === "0") {
    throw new RateLimitError("the Unsplash rate limit is reached (50 requests an hour, 2 per photo)");
  }

  if (!response.ok) {
    throw new Error(`Unsplash answered ${response.status}`);
  }

  return (await response.json()) as T;
};

/**
 * Downloads one photo from its Unsplash page URL, with its real credit. The
 * download endpoint is called first, as the API guidelines require.
 */
export const fetchUnsplashPhotoAction = async (
  url: string
): Promise<
  | { photo: { data: string; name: string; author: string; link: string }; error: null }
  | { photo: null; error: string; rateLimited?: boolean }
> => {
  if (!(await isLocalRequest())) {
    return { photo: null, error: NOT_LOCAL.error as string };
  }

  const key = process.env.UNSPLASH_ACCESS_KEY;
  const id = parseUnsplashUrl(url);

  if (!key) {
    return { photo: null, error: "Set UNSPLASH_ACCESS_KEY in .env to add photos from links." };
  }

  if (!id) {
    return { photo: null, error: `${url} isn't an Unsplash photo link.` };
  }

  try {
    const { user, links } = await callApi<UnsplashPhoto>(`${API}/photos/${id}`, key);
    const { url: fileUrl } = await callApi<{ url: string }>(links.download_location, key);
    const file = await fetch(fileUrl, { signal: AbortSignal.timeout(120_000) });

    if (!file.ok) {
      throw new Error(`The download answered ${file.status}`);
    }

    const authorSlug = user.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    return {
      photo: {
        data: Buffer.from(await file.arrayBuffer()).toString("base64"),
        name: `${authorSlug}-${id}-unsplash.jpg`,
        author: user.name,
        link: links.html.split("?")[0],
      },
      error: null,
    };
  } catch (error) {
    return {
      photo: null,
      error: `Couldn't fetch ${id}: ${error instanceof Error ? error.message : error}`,
      rateLimited: error instanceof RateLimitError,
    };
  }
};
