import type { Ref } from "react";

import { CategoryIcon } from "@/features/feedback/components/CategoryIcon";
import { CATEGORY_COLORS } from "@/features/feedback/utils/category-colors";
import { CATEGORY_LABELS, type Category } from "@/features/feedback/utils/schema";
import { cn } from "@/utils/cn";

type Props = {
  category: Category;
  selected: boolean;
  invalid: boolean;
  inputRef?: Ref<HTMLInputElement>;
  onSelect: () => void;
};

export const CategoryPill = ({ category, selected, invalid, inputRef, onSelect }: Props) => (
  <label
    className={cn(
      "inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full button-wipe pr-5 pl-4 text-base font-bold ring-1 [--wipe:linear-gradient(rgb(255_255_255/0.12),rgb(255_255_255/0.12))] ring-inset active:scale-[.97] has-focus-visible:outline-3 has-focus-visible:outline-offset-3 has-focus-visible:outline-sky-400",
      selected
        ? [CATEGORY_COLORS[category].selected, "text-black ring-transparent [--wipe-text:var(--color-black)]"]
        : ["bg-[#0a111c] text-[#dce5ee] [--wipe-text:#dce5ee]", invalid ? "ring-[#ff8597]" : "ring-[#2a374a]"]
    )}
  >
    <input
      ref={inputRef}
      type="radio"
      name="category"
      value={category}
      required
      checked={selected}
      onChange={onSelect}
      aria-describedby={invalid ? "fb-cat-err" : undefined}
      className="sr-only"
    />
    <CategoryIcon category={category} className={selected ? undefined : CATEGORY_COLORS[category].icon} />
    <span>{CATEGORY_LABELS[category]}</span>
  </label>
);
