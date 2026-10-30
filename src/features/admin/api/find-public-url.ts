import { LIVE_BACKGROUNDS_URL } from "@/features/backgrounds/utils/paths";

const publicUrls = new Map<string, Promise<string | null>>();

/**
 * The photo's public URL on the live site, if it's still there, for reverse
 * image search. Remembers hits; misses are retried on the next load, so a
 * network hiccup doesn't stick.
 */
export const findPublicUrl = (file: string) => {
  const cached = publicUrls.get(file);

  if (cached) {
    return cached;
  }

  const url = `${LIVE_BACKGROUNDS_URL}${file}`;
  const check = fetch(url, { method: "HEAD", signal: AbortSignal.timeout(3000) })
    .then((response) => (response.ok ? url : null))
    .catch(() => null)
    .then((found) => {
      if (!found) {
        publicUrls.delete(file);
      }

      return found;
    });

  publicUrls.set(file, check);

  return check;
};
