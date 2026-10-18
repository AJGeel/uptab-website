/**
 * Where the catalogue's image URLs point. The extension only uses the URLs in
 * the catalogue, so this decides which deployment it downloads from.
 */
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
