import { z } from "zod";

export const buildKeywordsPrompt = (name: string, blurb?: string) =>
  [
    `UpTab is a browser extension that shows a background photo on the new tab page. "${name}" is one of its themes of background photos${blurb ? `: ${blurb}` : "."}`,
    "Suggest 8 different search phrases to find more photos for this theme on Unsplash.",
    "Each is one to three plain words someone would really type into a photo search (no invented words), and each points at a different subject, place or mood within the theme.",
    "Photos need plenty of clear, low-detail space in the top part of the frame, so favour subjects like skies, water, fog, open landscapes and plain surfaces.",
    'Answer as JSON like {"keywords":["...","..."]}.',
  ].join("\n");

const responseSchema = z.object({ keywords: z.array(z.string()) });

/** The model's search phrases, without blanks or duplicates. */
export const parseKeywords = (json: string): string[] => {
  const parsed = responseSchema.safeParse(JSON.parse(json));

  if (!parsed.success) {
    throw new Error("The model's answer wasn't in the expected shape.");
  }

  const seen = new Set<string>();

  return parsed.data.keywords.flatMap((keyword) => {
    const trimmed = keyword.trim();
    const key = trimmed.toLowerCase();

    if (!key || seen.has(key)) {
      return [];
    }

    seen.add(key);

    return [trimmed];
  });
};
