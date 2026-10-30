/**
 * URL paths for backgrounds, in one place. Safe to use anywhere; file system
 * paths are in api/source-files.ts.
 */

/** The generated catalogue and renditions, under public/ and as URL path. */
export const CATALOGUE_DIR = "backgrounds/v1";
export const CATALOGUE_PATH = `/${CATALOGUE_DIR}/catalogue.json`;

/*
 * Before remote backgrounds, the live site served the source photos at
 * /backgrounds/<theme>/<file>. Reverse image search needs a public URL, and
 * these keep working until that deploy is replaced.
 */
export const LIVE_BACKGROUNDS_URL = "https://uptab.vercel.app/backgrounds/";

const encodePath = (file: string) => file.split("/").map(encodeURIComponent).join("/");

/** The admin's preview of a source photo, e.g. "holland/koppelpoort.jpg". */
export const thumbnailUrl = (file: string) => `/adminland/photos/${encodePath(file)}`;

/** The full-size source photo, downloaded rather than shown. */
export const originalUrl = (file: string) => `${thumbnailUrl(file)}?original`;
