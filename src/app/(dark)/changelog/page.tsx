import { JetBrains_Mono } from "next/font/google";
import { ViewTransition } from "react";

import { externalUrls } from "@/config";
import { getReleases } from "@/features/changelog/api/get-releases";
import { ReleaseList } from "@/features/changelog/components/ReleaseList";

const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

const gutter = "px-[clamp(1rem,4vw,2rem)]";

const Stat = ({ label, children, className }: { label: string; children: string; className?: string }) => (
  <div className="rounded-xl bg-dark-surface px-3.5 py-3 ring-1 ring-dark-line ring-inset">
    <dt className="text-[11px] tracking-widest text-[#7f8da0] uppercase">{label}</dt>
    <dd className={`mt-1 text-base font-bold ${className ?? ""}`}>{children}</dd>
  </div>
);

const Page = async () => {
  const releases = await getReleases();

  if (releases.length === 0) {
    return <p className="py-32 text-center">The changelog could not be read. Perhaps the GitHub API is down.</p>;
  }

  const [latest] = releases;
  const first = releases[releases.length - 1];

  return (
    <ViewTransition default="page-fade">
      <div className={`${jetBrainsMono.variable} mx-auto max-w-260 font-mono ${gutter} pt-[clamp(3rem,6vw,5.5rem)]`}>
        <div className="overflow-hidden rounded-[18px] bg-[#0c131d] shadow-[0_30px_60px_-40px_rgba(0,0,0,0.9)] ring-1 ring-dark-line ring-inset">
          <div className="flex items-center gap-2 border-b border-dark-line px-4 py-3" aria-hidden="true">
            {[0, 1, 2].map((dot) => (
              <span key={dot} className="size-[11px] rounded-full bg-[#2a374a]" />
            ))}
            <span className="ml-2.5 text-xs text-[#7f8da0]">~/uptab — zsh</span>
          </div>
          <div className="flex flex-col gap-4.5 p-[clamp(1.25rem,3vw,2rem)]">
            <p className="text-[15px] text-dark-muted">
              <span className="text-log-added">arthur@uptab</span> <span className="text-sky-400">~/uptab</span>{" "}
              <span className="text-dark-text">$</span>{" "}
              <span className="inline-block max-w-[34ch] overflow-hidden align-bottom whitespace-nowrap text-dark-text motion-safe:animate-type">
                git log --tags --oneline | head -5
              </span>
              <span aria-hidden="true" className="ml-0.5 inline-block h-4.5 w-2.25 bg-dark-text align-[-3px] motion-safe:animate-caret" />
            </p>
            <h1 className="font-sans text-[clamp(2.5rem,5.4vw,4.5rem)] leading-none font-extrabold tracking-[-0.045em] text-white">
              Changelog<span className="text-sky-400">.md</span>
            </h1>
            <p className="max-w-170 text-[15px] leading-prose text-dark-body">
              {"// Every notable change to UpTab, newest first. Format loosely follows Keep a Changelog; versions follow SemVer (MAJOR.MINOR.PATCH)."}
            </p>
            <dl className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-2.5">
              <Stat label="latest" className="text-log-added">{`v${latest.version}`}</Stat>
              <Stat label="tagged releases">{String(releases.length)}</Stat>
              <Stat label="first release">{`v${first.version} · ${first.date}`}</Stat>
              <Stat label="targets">chrome · firefox</Stat>
            </dl>
          </div>
        </div>

        <ReleaseList releases={releases} />

        <div className="mt-12 flex flex-wrap items-center justify-between gap-5 rounded-[20px] bg-linear-to-br from-[#13243a] to-[#0e1826] p-[clamp(1.5rem,4vw,2.5rem)] ring-1 ring-[#22344c] ring-inset">
          <div className="flex flex-col gap-2 font-sans">
            <p className="font-mono text-sm text-dark-muted">
              <span className="text-dark-text">$</span> gh issue create --label &quot;idea&quot;
            </p>
            <h2 className="text-[26px] font-extrabold tracking-tight text-white">Got an idea for the next release?</h2>
            <p className="text-base text-dark-body">Feature wishes, bug sightings and pull requests all welcome.</p>
          </div>
          <a
            href={`${externalUrls.github}/issues/new`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center rounded-xl bg-white px-5 font-sans text-[15px] font-bold text-black transition duration-150 hover:-translate-y-px active:scale-[.97]"
          >
            Open an issue
          </a>
        </div>
      </div>
    </ViewTransition>
  );
};

export default Page;
