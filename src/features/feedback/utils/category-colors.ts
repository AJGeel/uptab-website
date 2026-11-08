import type { Category } from "@/features/feedback/utils/schema";

/** Bug is the warning colour, idea yellow, praise love-pink and other the brand blue. */
export const CATEGORY_COLORS: Record<Category, { icon: string; selected: string; tag: string }> = {
  bug: { icon: "text-orange-400", selected: "bg-orange-400", tag: "bg-orange-400/15 text-orange-300" },
  idea: { icon: "text-yellow-300", selected: "bg-yellow-300", tag: "bg-yellow-300/15 text-yellow-300" },
  praise: { icon: "text-pink-400", selected: "bg-pink-400", tag: "bg-pink-400/15 text-pink-300" },
  other: { icon: "text-sky-400", selected: "bg-sky-400", tag: "bg-sky-400/15 text-sky-400" },
};
