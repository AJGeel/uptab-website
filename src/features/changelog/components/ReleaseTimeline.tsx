import { externalUrls } from "@/config";
import type { Release } from "@/features/changelog/utils/parse-changelog";
import { bumpOf, daysBetween } from "@/features/changelog/utils/release-facts";
import { cn } from "@/utils/cn";

/** How long the line takes to draw; the dots pop in as it passes them. */
const DRAW_SECONDS = 1.4;

/** Every release as a dot on a line, spaced by the days between them. */
export const ReleaseTimeline = ({ releases }: { releases: Release[] }) => {
  const oldestFirst = [...releases].reverse();
  const [first] = oldestFirst;
  const latest = oldestFirst[oldestFirst.length - 1];
  const span = Math.max(daysBetween(first.date, latest.date), 1);

  return (
    <figure aria-label={`${releases.length} releases over ${span} days`} className="flex flex-col gap-2">
      <div className="relative mx-1.5 mt-7 h-5">
        <div className="absolute inset-x-0 top-1/2 h-px origin-left -translate-y-1/2 bg-dark-line motion-safe:animate-timeline-draw" />
        {oldestFirst.map((release) => {
          const position = daysBetween(first.date, release.date) / span;
          const isLatest = release === latest;

          return (
            <a
              key={release.version}
              href={`${externalUrls.github}/releases/tag/V${release.version}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`v${release.version}, ${release.date}`}
              style={{ left: `${position * 100}%`, animationDelay: `${position * DRAW_SECONDS}s` }}
              className="group absolute top-1/2 -translate-1/2 p-1.5 hover:z-10 focus-visible:z-10 motion-safe:animate-timeline-pop"
            >
              <span
                className={cn(
                  "block rounded-full transition duration-150 group-hover:scale-150 group-focus-visible:scale-150",
                  isLatest ? "size-3 bg-log-added ring-4 ring-log-added/20" : bumpOf(release.version) === "patch" ? "size-1.5 bg-dark-muted group-hover:bg-white" : "size-2.5 bg-sky-400 group-hover:bg-white"
                )}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded-md bg-dark-surface px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 ring-1 ring-dark-line transition duration-150 ring-inset group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                v{release.version} · {release.date} ↗
              </span>
            </a>
          );
        })}
      </div>
      <figcaption className="flex justify-between text-xs text-[#7f8da0]">
        <span>
          v{first.version} · {first.date}
        </span>
        <span>{span}d</span>
        <span>
          v{latest.version} · {latest.date}
        </span>
      </figcaption>
    </figure>
  );
};
