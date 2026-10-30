import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";

import { ProgressBar } from "@/features/admin/components/ProgressBar";
import { cardClass } from "@/features/admin/components/ui/card";
import { FadeImage } from "@/features/admin/components/ui/FadeImage";
import type { ThemeSummary } from "@/features/admin/utils/theme-summary";
import { cn } from "@/utils/cn";


export const ThemeCard = ({ theme }: { theme: ThemeSummary }) => (
  <a
    href={`/adminland/themes/${theme.id}`}
    draggable={false}
    className={cn(cardClass, "group flex h-full flex-col gap-3 duration-150 hover:shadow-md")}
  >
    <div className="grid aspect-video grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-sm bg-dark-pill">
      {theme.thumbnails.map((src) => (
        <FadeImage
          key={src}
          unoptimized
          draggable={false}
          src={src}
          width={240}
          height={135}
          alt=""
          className="size-full object-cover"
        />
      ))}
    </div>
    <div>
      <h3 className="font-bold duration-150 group-hover:text-sky-400">{theme.name}</h3>
      <p className="text-xs text-[#7f8da0]">{theme.id}</p>
    </div>
    {theme.blurb ? (
      <p className="line-clamp-2 text-sm text-dark-body">{theme.blurb}</p>
    ) : (
      <p className="flex items-start gap-1.5 text-sm text-amber-300">
        <ExclamationTriangleIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        No blurb yet. The website shows a joke instead.
      </p>
    )}
    <ProgressBar published={theme.published} pending={theme.pending} />
  </a>
);
