export const bgThemes = {
  holland: "holland",
  abstract: "abstract",
} as const;

export type BgTheme = (typeof bgThemes)[keyof typeof bgThemes];
