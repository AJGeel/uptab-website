import { ViewTransition } from "react";

import { externalUrls } from "@/config";
import { getCatalogue } from "@/features/backgrounds/api/get-catalogue";
import { Gallery } from "@/features/backgrounds/components/Gallery";
import { plural } from "@/utils/plural";

const gutter = "mx-auto w-full max-w-310 px-[clamp(1rem,4vw,2rem)]";

const Page = async () => {
  const catalogue = await getCatalogue();

  return (
    <ViewTransition default="page-fade">
      <header className={`${gutter} pt-[clamp(3.5rem,7vw,6rem)]`}>
        <p className="text-[13px] font-bold tracking-[0.12em] text-sky-400 uppercase">Backgrounds</p>
        <h1 className="mt-3 max-w-225 text-[clamp(2.6rem,5.6vw,4.75rem)] leading-none font-extrabold tracking-[-0.045em]">
          See the world without leaving your <span className="text-sky-400">desk.</span>
        </h1>
        <p className="mt-5 max-w-155 text-[19px] leading-relaxed text-dark-body">
          {plural(catalogue.images.length, "photo")} across {plural(catalogue.themes.length, "collection")}, each
          credited to the lovely human who took it. Switch collections on or off in UpTab, or sneak in your own.
        </p>
      </header>

      <main className="flex flex-col gap-[clamp(2.5rem,5vw,4rem)] pt-[clamp(2.5rem,5vw,4rem)]">
        <Gallery catalogue={catalogue} />

        <section className={`${gutter} grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-5`}>
          <div className="flex flex-col gap-2.5 rounded-[28px] border-2 border-dashed border-[#2e3d52] p-8">
            <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
              <path d="M14 6v16M6 14h16" stroke="#25B1FF" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
            <h2 className="text-2xl font-extrabold tracking-tight">Bring your own photos</h2>
            <p className="leading-relaxed text-dark-body">
              Holiday snaps, your dog, your nan&rsquo;s garden. Add them in UpTab and they&rsquo;ll take turns with the
              collections.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 rounded-[28px] bg-linear-to-br from-[#13243a] to-[#0e1826] p-8 ring-1 ring-[#22344c] ring-inset">
            <h2 className="text-2xl font-extrabold tracking-tight text-white">Missing a place you love?</h2>
            <p className="leading-relaxed text-dark-body">
              Pitch the next collection. The best ideas sneak into a future release.
            </p>
            <a
              href={`${externalUrls.github}/issues/new`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-12 items-center self-start rounded-full bg-white button-wipe wipe-rainbow px-5 font-bold text-black active:scale-[.97]"
            >
              Suggest a collection
            </a>
          </div>
        </section>
      </main>
    </ViewTransition>
  );
};

export default Page;
