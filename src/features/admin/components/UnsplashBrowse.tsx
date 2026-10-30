"use client";

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/16/solid";
import { useState, useTransition } from "react";

import { suggestKeywordsAction } from "@/features/admin/api/suggest-keywords";
import { AiLabel } from "@/features/admin/components/ui/AiLabel";
import { Button } from "@/features/admin/components/ui/Button";
import { useActionToast } from "@/features/admin/hooks/use-action-toast";
import { unsplashSearchUrl } from "@/features/admin/utils/theme-suggestions";

const pillClass =
  "inline-flex items-center gap-2 rounded-full bg-dark-pill py-2 pr-3 pl-4 text-sm font-semibold text-white duration-150 hover:bg-[#222f44] active:scale-95";

/**
 * Where to find more photos for a theme: a search on Unsplash for its name,
 * and a local Ollama model's ideas for related searches.
 */
export const UnsplashBrowse = ({ name, blurb }: { name: string; blurb?: string }) => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const notify = useActionToast();

  const suggest = () =>
    startTransition(async () => {
      const result = await suggestKeywordsAction(name, blurb);

      if (result.error !== null) {
        notify({ error: result.error, message: null });
      } else {
        setKeywords(result.keywords);
      }
    });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <a href={unsplashSearchUrl(name)} target="_blank" rel="noopener noreferrer" className={pillClass}>
          Browse more on Unsplash
          <ArrowTopRightOnSquareIcon className="size-4 text-sky-400" />
        </a>
        <Button type="button" variant="dark" onClick={suggest} disabled={isPending}>
          <AiLabel isPending={isPending}>Suggest keywords</AiLabel>
        </Button>
      </div>
      {keywords.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {keywords.map((keyword) => (
            <li key={keyword}>
              <a
                href={unsplashSearchUrl(keyword)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full bg-dark-surface px-3 py-1.5 text-sm text-dark-text duration-150 hover:bg-[#222f44] active:scale-95"
              >
                {keyword}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
