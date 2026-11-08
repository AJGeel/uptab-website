const hits = new Map<string, number[]>();

/*
 * Best effort: the counts live in one server instance's memory, so they reset
 * on a cold start and aren't shared between instances. Enough to slow down a
 * script, which the honeypot and the message cap already discourage.
 */
export const isRateLimited = (key: string, now = Date.now(), limit = 10, windowMs = 10 * 60 * 1000) => {
  for (const [other, times] of hits) {
    if (times.every((time) => now - time >= windowMs)) {
      hits.delete(other);
    }
  }

  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);

  if (recent.length >= limit) {
    return true;
  }

  hits.set(key, [...recent, now]);

  return false;
};
