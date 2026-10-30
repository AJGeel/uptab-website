import type { Theme } from "@/features/backgrounds/types/catalogue";

/** Until a theme has its own blurb, a joke stands in. */
export const blurbOf = ({ name, blurb }: Theme) =>
  blurb ?? `Pretty pictures of ${name}. Our copywriter is still out in the field doing research.`;
