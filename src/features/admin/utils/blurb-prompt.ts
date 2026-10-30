export const buildBlurbPrompt = (name: string) =>
  [
    `Write the blurb for "${name}", a theme of background photos in UpTab, a new tab browser extension.`,
    "Keep it generic: about the theme as a whole, never about specific photos, places or photographers.",
    "Exactly one short sentence, concise and to the point, under 90 characters, with a dry bit of humour.",
    "No emoji, no quotation marks, no hashtags, no exclamation marks.",
    "Don't repeat the theme name in the blurb: it is shown right next to it.",
    "Examples of the tone:",
    "Pretty pictures of Holland. Our copywriter is still out in the field doing research.",
    "Mountains for your new tab. Altitude sickness not included.",
    "Concrete, glass and questionable parking. Your tabs have never looked so structural.",
    'Never start with "Discover" or "Explore", and never use words like serene or breathtaking.',
    "Reply with the blurb only.",
  ].join("\n");

/** Models like to wrap an answer in quotes, put it on several lines or start with "Theme name:". */
export const cleanBlurb = (text: string, name = "") =>
  text
    .replace(/\s+/g, " ")
    .trim()
    .replace(new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*:\\s*`, "i"), "")
    .replace(/^["“”']+|["“”']+$/g, "")
    .trim();
