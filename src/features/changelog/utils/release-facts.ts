export type Bump = "major" | "minor" | "patch";

export const bumpOf = (version: string): Bump => {
  const [, minor, patch] = version.split(".").map(Number);

  if (patch > 0) {
    return "patch";
  }

  return minor > 0 ? "minor" : "major";
};

const DAY_MS = 86_400_000;

/** Whole days from one ISO date to a later one. */
export const daysBetween = (from: string, to: string) =>
  Math.round((new Date(to).getTime() - new Date(from).getTime()) / DAY_MS);
