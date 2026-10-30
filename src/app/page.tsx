import { ViewTransition } from "react";

import Footer from "@/components/Footer";
import { SiteNav } from "@/components/SiteNav";
import { getCatalogue } from "@/features/backgrounds/api/get-catalogue";
import { Bento } from "@/features/home/components/Bento";
import { ClosingCta } from "@/features/home/components/ClosingCta";
import { Collections } from "@/features/home/components/Collections";
import { Faq } from "@/features/home/components/Faq";
import { Hero } from "@/features/home/components/Hero";
import { RecentlyShipped } from "@/features/home/components/RecentlyShipped";
import { SellingPoints } from "@/features/home/components/SellingPoints";
import { StoreActions } from "@/features/home/components/StoreActions";
import { Tour } from "@/features/home/components/Tour";
import { featuredThemes } from "@/features/home/featured-themes";
import { pickPhotos } from "@/features/home/pick-photos";
import { weatherFor } from "@/features/home/season-weather";

import "@/features/home/home.css";

/** The themes whose first photo stands in for the extension in the keyboard demo. */
const KEYBOARD_DEMO_THEMES = ["mountains", "holland", "safari"];

/** Rebuilt hourly, so the hero photo rotates every couple of hours, the demo weather follows the season and "Recently shipped" the changelog. */
export const revalidate = 3600;

const Home = async () => {
  const catalogue = await getCatalogue();
  const { images } = catalogue;
  const themes = featuredThemes(catalogue.themes);
  const { hero, cta } = pickPhotos(images);
  const firstOf = (themeId: string) => images.find((image) => image.theme === themeId) ?? [];
  const collections = themes.flatMap((theme) => {
    const photo = firstOf(theme.id);

    return Array.isArray(photo) ? [] : [{ name: theme.name, photo }];
  });
  const demoPhotos = {
    keyboard: KEYBOARD_DEMO_THEMES.flatMap(firstOf),
    pace: themes.flatMap(({ id }) => firstOf(id)),
  };

  return (
    <ViewTransition default="page-fade">
      <div className="ut-home min-h-screen bg-page text-black antialiased">
        <SiteNav theme="light" />
        {/* The hero fills the first screen, so the marquee starts just below the fold. Shorter screens get the hero's full content. */}
        <Hero photo={hero}>
          <StoreActions elevated className="mt-8" otherClassName="text-[#16222f]" />
        </Hero>
        <SellingPoints photoCount={images.length} />
        <main>
          <Tour />
          <Bento photos={demoPhotos} weather={weatherFor(new Date())} collections={collections} />
          <Collections catalogue={catalogue} themes={themes} />
          <RecentlyShipped />
          <Faq />
          <ClosingCta photo={cta} />
        </main>
        <Footer theme="light" />
      </div>
    </ViewTransition>
  );
};

export default Home;
