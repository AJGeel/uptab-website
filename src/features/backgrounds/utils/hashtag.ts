/** A theme name as a hashtag: "Safari" → "#Safari", "Under Water" → "#UnderWater". */
export const hashtag = (name: string) => `#${name.replace(/\s+/g, "")}`;
