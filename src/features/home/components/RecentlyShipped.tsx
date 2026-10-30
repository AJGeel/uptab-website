import type { Route } from "next";
import Link from "next/link";

import { getReleases } from "@/features/changelog/api/get-releases";
import { plainText } from "@/features/changelog/utils/plain-text";

const SHOWN = 3;

const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(isoDate));

/** The latest releases from the changelog, each led by its first new feature. */
export const RecentlyShipped = async () => {
  const releases = (await getReleases()).slice(0, SHOWN);

  return (
    <section className="mx-auto max-w-310 reveal px-[clamp(1rem,4vw,2rem)] pt-[clamp(4.5rem,9vw,8rem)]">
      <div className="flex flex-wrap gap-10 rounded-[28px] bg-white p-[clamp(1.75rem,4vw,3.5rem)] ring-1 ring-[#e2e8ef] ring-inset">
        <div className="max-w-100 flex-[1_1_300px]">
          <p className="text-[13px] font-bold tracking-[0.12em] text-sky-800 uppercase">Changelog</p>
          <h2 className="mt-3 text-[clamp(1.875rem,3.2vw,2.625rem)] leading-heading font-extrabold tracking-[-0.03em]">
            Recently shipped
          </h2>
          <p className="mt-3.5 text-[17px] leading-relaxed text-muted">
            Fresh out of the oven. Spotted a bug or dreamt up a feature? Tell me on GitHub.
          </p>
          <Link
            href="/changelog"
            className="mt-3 inline-flex min-h-11 items-center gap-2 font-bold text-sky-800 transition-colors hover:text-black"
          >
            See what else is new
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <ol className="flex min-w-0 flex-[999_1_420px] flex-col divide-y divide-[#e8edf2]">
          {releases.map(({ version, date, items }) => {
            const headline = items.find(({ kind }) => kind === "added") ?? items[0];

            return (
              <li key={version} className="py-4.5 first:pt-0 last:pb-0">
                {/* Straight to that release in the changelog */}
                <Link
                  href={`/changelog#v${version}` as Route}
                  className="group flex flex-wrap gap-x-5 gap-y-2 rounded-lg transition-colors"
                >
                  <span className="flex-[0_0_72px] font-extrabold text-sky-800">v{version}</span>
                  <span className="flex-[1_1_260px] leading-normal group-hover:text-sky-800">
                    {headline && plainText(headline.text)}
                  </span>
                  <span className="flex-none text-sm text-muted">{formatDate(date)}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};
