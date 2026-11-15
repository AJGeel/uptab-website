const HOUR_MS = 60 * 60 * 1000;

/** The next write is due 24 hours from now, give or take 12, so the rhythm never looks like a cron. */
export const nextDueAt = (now: Date, random = Math.random) => new Date(now.getTime() + (12 + random() * 24) * HOUR_MS);
