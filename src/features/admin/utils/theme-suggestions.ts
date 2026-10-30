import { z } from "zod";

export type ThemeSuggestion = { name: string; why: string; search: string };

/** Random starting points, so each press of the button goes somewhere different. */
const ANGLES = [
  "retro futurism",
  "food and drink",
  "weird nature",
  "neon cities at night",
  "space and astronomy",
  "vintage technology",
  "sports and hobbies",
  "abstract colour and gradients",
  "miniatures and toys",
  "underwater worlds",
  "cosy interiors",
  "extreme weather",
  "old maps and paper",
  "street life in faraway places",
  "animals doing their thing",
  "machines and industry",
  "festivals and celebrations",
  "surreal and dreamlike scenes",
];

export const unsplashSearchUrl = (search: string) =>
  `https://unsplash.com/s/photos/${encodeURIComponent(search.trim().toLowerCase()).replace(/%20/g, "-")}?orientation=landscape`;

export const pickAngles = (count = 3) =>
  [...ANGLES].sort(() => Math.random() - 0.5).slice(0, count);

export const buildSuggestionsPrompt = (themes: { name: string; blurb?: string }[], angles: string[]) =>
  [
    "UpTab is a browser extension that replaces the new tab page with a background photo, with a weather widget, clock and shortcuts on top of it.",
    "Its users are everyday browser users who open many tabs a day. They want cool backgrounds that make their browsing feel fresher and more fun. Calm is fine, but not required.",
    "The photos are grouped into themes. These themes exist already:",
    ...themes.map(({ name, blurb }) => `- ${name}${blurb ? `: ${blurb}` : ""}`),
    "Suggest 6 new themes that the existing ones don't cover. Don't repeat or rephrase an existing theme.",
    "Be varied and bold: mix a few safe picks with surprising, quirky or downright weird ones. A person will review the list, so odd ideas are welcome. Avoid obvious stock-photo categories, and overused name words like drift, bloom, echoes, dreams or voidwalker.",
    `For inspiration, lean on some of these this time: ${angles.join(", ")}.`,
    "One hard rule: every theme must be photographable with plenty of clear, low-detail space in the top part of the frame (sky, fog, water, a plain wall, a gradient, a dark void), so the widgets stay readable.",
    "Avoid themes that are mostly busy, high-detail texture from edge to edge, such as dense crowds, foliage close-ups or patterns.",
    'Give each a name of one to three words, a "why" of one short, punchy sentence about what makes it fun and where the empty space is, and a "search" of one to three plain words someone would type into Unsplash to find photos of it (no invented words).',
    'Answer as JSON like {"themes":[{"name":"...","why":"...","search":"..."}]}.',
  ].join("\n");

const responseSchema = z.object({
  themes: z.array(z.object({ name: z.string(), why: z.string(), search: z.string().optional() })),
});

/** The model's suggestions, without any that duplicate an existing theme or each other. */
export const parseSuggestions = (json: string, existingNames: string[]): ThemeSuggestion[] => {
  const parsed = responseSchema.safeParse(JSON.parse(json));
  const seen = new Set(existingNames.map((name) => name.trim().toLowerCase()));

  if (!parsed.success) {
    throw new Error("The model's answer wasn't in the expected shape.");
  }

  return parsed.data.themes.flatMap(({ name, why, search }) => {
    const key = name.trim().toLowerCase();

    if (!key || seen.has(key)) {
      return [];
    }

    seen.add(key);

    return [{ name: name.trim(), why: why.trim(), search: search?.trim() || name.trim() }];
  });
};
