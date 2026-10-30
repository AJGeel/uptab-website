"use client";

import { useState } from "react";

import { externalUrls } from "@/config";
import { InlineText } from "@/features/changelog/components/InlineText";
import type { ChangeKind, Release } from "@/features/changelog/utils/parse-changelog";
import { bumpOf, daysBetween } from "@/features/changelog/utils/release-facts";
import { cn } from "@/utils/cn";

/** How many releases are listed in full. */
const SHOWN = 5;

const KINDS: Record<ChangeKind, { sign: string; text: string; tint: string; ring: string }> = {
  added: { sign: "+", text: "text-log-added", tint: "bg-log-added/12", ring: "ring-log-added" },
  changed: { sign: "~", text: "text-sky-400", tint: "bg-sky-400/12", ring: "ring-sky-400" },
  fixed: { sign: "!", text: "text-log-fixed", tint: "bg-log-fixed/12", ring: "ring-log-fixed" },
};

const KIND_ORDER: ChangeKind[] = ["added", "changed", "fixed"];

const countOf = (release: Release, kind: ChangeKind) => release.items.filter((item) => item.kind === kind).length;

/**
 * The newest releases, each in its own card, with toggles to filter the
 * changes by kind. Patch releases are never merged.
 */
export const ReleaseList = ({ releases }: { releases: Release[] }) => {
  const [enabled, setEnabled] = useState<Record<ChangeKind, boolean>>({ added: true, changed: true, fixed: true });
  const shown = releases.slice(0, SHOWN);
  const older = releases.slice(SHOWN);
  const totals = (kind: ChangeKind) => shown.reduce((sum, release) => sum + countOf(release, kind), 0);

  return (
    <>
      <div className="mt-8 flex flex-wrap items-center gap-2.5">
        <span className="text-[13px] text-[#7f8da0]">--filter</span>
        {KIND_ORDER.map((kind) => (
          <button
            key={kind}
            type="button"
            aria-pressed={enabled[kind]}
            onClick={() => setEnabled((current) => ({ ...current, [kind]: !current[kind] }))}
            className={cn(
              "inline-flex min-h-10 items-center gap-2 rounded-full button-wipe px-3.5 text-sm font-bold ring-1 [--wipe-text:currentColor] [--wipe:linear-gradient(rgb(255_255_255/0.12),rgb(255_255_255/0.12))] ring-inset active:scale-[.97]",
              enabled[kind] ? [KINDS[kind].tint, KINDS[kind].text, KINDS[kind].ring] : "bg-dark-surface text-[#7f8da0] ring-[#243042]"
            )}
          >
            <span>{enabled[kind] ? "[x]" : "[ ]"}</span>
            {kind}
            <span className="opacity-70">({totals(kind)})</span>
          </button>
        ))}
      </div>

      <ol className="mt-6 flex flex-col gap-4">
        {shown.map((release, index) => {
          const previous = releases[index + 1];
          const bump = bumpOf(release.version);
          const items = release.items.filter((item) => enabled[item.kind]);

          return (
            // Scrolls to just below the fixed header when linked to, e.g. from the home page
            <li key={release.version} id={`v${release.version}`} className="scroll-mt-28">
              <article className="overflow-hidden rounded-2xl bg-[#0e151f] ring-1 ring-dark-line transition-shadow duration-300 ring-inset hover:ring-[#33465f] [li:target_&]:ring-sky-400/70">
                <header className="flex flex-wrap items-center gap-x-3.5 gap-y-2 border-b border-dark-pill bg-dark-surface px-5 py-4">
                  <h2 className="text-lg font-bold">
                    <span className="text-[#7f8da0]">## </span>
                    <a href={`#v${release.version}`} className="text-white hover:text-sky-400">
                      [{release.version}]
                    </a>
                  </h2>
                  <span className="text-sm text-dark-muted">— {release.date}</span>
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-xs font-bold ring-1 ring-inset",
                      bump === "patch" ? "text-dark-muted ring-dark-muted" : "text-sky-400 ring-sky-400"
                    )}
                  >
                    {bump}
                  </span>
                  {index === 0 && <span className="rounded-md bg-log-added px-2 py-0.5 text-xs font-bold text-[#04170f]">HEAD</span>}
                  <span className="flex-auto" />
                  {previous && (
                    <span className="text-[13px] text-[#7f8da0]">
                      Δ {daysBetween(previous.date, release.date)}d since {previous.version}
                    </span>
                  )}
                  <span className="inline-flex gap-2 text-[13px] font-bold">
                    {KIND_ORDER.map((kind) => (
                      <span key={kind} className={KINDS[kind].text}>
                        {KINDS[kind].sign}
                        {countOf(release, kind)}
                      </span>
                    ))}
                  </span>
                  <span aria-hidden="true" className="inline-flex gap-0.5">
                    {KIND_ORDER.flatMap((kind) =>
                      Array.from({ length: countOf(release, kind) }, (_, i) => (
                        <span key={`${kind}-${i}`} className={cn("size-2 rounded-xs", KINDS[kind].text, "bg-current")} />
                      ))
                    )}
                  </span>
                </header>

                <div className="py-2">
                  {items.map((item, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[28px_minmax(0,1fr)] items-baseline py-1.5 pr-5 text-sm leading-relaxed transition-colors duration-150 hover:bg-white/[0.035] min-[600px]:grid-cols-[34px_92px_minmax(0,1fr)]"
                    >
                      <span className={cn("text-center font-bold", KINDS[item.kind].text)}>{KINDS[item.kind].sign}</span>
                      <span
                        className={cn(
                          "hidden justify-self-start rounded-md px-2 py-px text-xs font-bold min-[600px]:inline",
                          KINDS[item.kind].tint,
                          KINDS[item.kind].text
                        )}
                      >
                        {item.kind}
                      </span>
                      <span className="text-[#dce5ee]">
                        <InlineText text={item.text} />
                        {item.details.length > 0 && (
                          <ul className="mt-1 space-y-0.5 text-dark-muted">
                            {item.details.map((detail, d) => (
                              <li key={d} className="before:mr-2 before:text-[#7f8da0] before:content-['·']">
                                <InlineText text={detail} />
                              </li>
                            ))}
                          </ul>
                        )}
                      </span>
                    </div>
                  ))}
                  {items.length === 0 && <p className="px-5 py-1.5 text-sm text-[#7f8da0] min-[600px]:pl-8.5">{"// nothing matches your --filter here"}</p>}
                </div>
              </article>
            </li>
          );
        })}
      </ol>

      {older.length > 0 && (
        <div className="mt-5 flex flex-wrap justify-between gap-2.5 rounded-xl border border-dashed border-[#2a374a] px-5 py-3.5 text-sm text-dark-muted">
          <span>
            … {older.length} older {older.length === 1 ? "tag" : "tags"} (v{older[0].version} → v{older[older.length - 1].version})
          </span>
          <a href={`${externalUrls.github}/releases`} target="_blank" rel="noopener noreferrer" className="font-bold text-sky-400 hover:text-white">
            git log --all →
          </a>
        </div>
      )}
    </>
  );
};
