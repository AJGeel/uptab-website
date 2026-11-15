import type { Metadata } from "next";
import Link from "next/link";

import { ExternalLink } from "@/components/ExternalLink";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { externalUrls } from "@/config";

export const metadata: Metadata = {
  title: "Terms — UpTab",
  description: "UpTab is free, open-source software. Here’s the short version of what that means.",
};

const Page = () => (
  <LegalPage
    eyebrow="Terms"
    title="The short version."
    lead="UpTab is free, open-source software. Use it, tweak it, share it. Here’s what to know."
    updated="15 November 2026"
  >
    <LegalSection title="It’s free software">
      <p>
        UpTab is open source under the <ExternalLink href={`${externalUrls.github}/blob/main/LICENSE`}>MIT licence</ExternalLink>. The code
        lives in the <ExternalLink href={externalUrls.github}>GitHub repository</ExternalLink>.
      </p>
    </LegalSection>

    <LegalSection title="No warranty">
      <ul>
        <li>UpTab is provided “as is”, without warranty of any kind.</li>
        <li>I’m not liable for any damage that comes from using it.</li>
      </ul>
    </LegalSection>

    <LegalSection title="Other people’s services">
      <p>
        UpTab leans on third-party services: Open-Meteo, OpenStreetMap, DuckDuckGo, GlitchTip and the host of the background photos.
        They can change or go away. Weather and place names are provided as-is.
      </p>
      <p>
        What each one sees is in the <Link href="/privacy" className="font-semibold text-sky-800 underline-offset-2 hover:underline">privacy page</Link>.
      </p>
    </LegalSection>

    <LegalSection title="Photos and icons">
      <ul>
        <li>Background photos are credited to their photographers wherever they’re shown.</li>
        <li>Photos you upload stay yours.</li>
        <li>
          The weather icons are <ExternalLink href="https://github.com/basmilius/weather-icons">Meteocons</ExternalLink> by Bas Milius, MIT
          licensed. {/* TODO: confirm the final icon set before publishing */}
        </li>
      </ul>
    </LegalSection>

    <LegalSection title="Changes">
      <p>These terms and the privacy page can change. The date of the latest update is at the top of each page.</p>
      <p>
        Questions? Use the <Link href="/feedback" className="font-semibold text-sky-800 underline-offset-2 hover:underline">feedback page</Link>.
      </p>
    </LegalSection>
  </LegalPage>
);

export default Page;
