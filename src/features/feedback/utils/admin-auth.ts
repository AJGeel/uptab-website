import { createHash, timingSafeEqual } from "node:crypto";

/** Must match the folder name in src/app/(dark)/. */
export const ADMIN_BASE = "/the-complaints-department";

const digest = (value: string) => createHash("sha256").update(value).digest();

/** Hashing first gives both sides the same length, which timingSafeEqual requires. */
export const safeEqual = (a: string, b: string) => timingSafeEqual(digest(a), digest(b));

/** The secret part of the admin URL. Unset means no key is valid. */
export const isAdminKey = (key: string) => {
  const expected = process.env.FEEDBACK_ADMIN_KEY;

  return Boolean(expected) && safeEqual(key, expected as string);
};

/** The username is ignored; only the password counts. */
export const hasBasicPassword = (header: string | null, password: string | undefined) => {
  if (!password || !header?.startsWith("Basic ")) {
    return false;
  }

  try {
    const credentials = atob(header.slice("Basic ".length));

    return safeEqual(credentials.slice(credentials.indexOf(":") + 1), password);
  } catch {
    return false;
  }
};

export const hasBearer = (header: string | null, secret: string | undefined) =>
  Boolean(secret) && header !== null && safeEqual(header, `Bearer ${secret}`);
