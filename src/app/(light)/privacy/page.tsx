import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { ExternalLink } from "@/components/ExternalLink";
import { LegalPage, LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy — UpTab",
  description: "No accounts, no analytics, no ads. Here’s what stays on your device and the few things that don’t.",
};

const outgoing: { title: string; text: ReactNode }[] = [
  { title: "Weather", text: "Open-Meteo gets your location’s coordinates while a location is active." },
  { title: "Place search", text: "Open-Meteo gets what you type in “add a location”, only while you type." },
  {
    title: "Use my location",
    text: "OpenStreetMap Nominatim gets approximate coordinates (about 1 km) to find a place name. Only the area name is kept.",
  },
  {
    title: "Backgrounds",
    // The catalogue's image URLs are built from the site's own URL (scripts/build-backgrounds.ts)
    text: "The UpTab site (uptab.vercel.app) hosts the photos, so it’s contacted on new tabs and sees the photo size, which follows your screen width.",
  },
  {
    title: "Icons",
    text: "Bookmark icons come from the site itself, then DuckDuckGo as a last resort (it sees the hostname, not the full address). A custom icon URL loads from whoever hosts it.",
  },
  {
    title: "Search",
    text: "Only when you press Enter on a query with no bookmark match, the query goes to your search engine (DuckDuckGo by default).",
  },
  {
    title: "Calendar",
    text: "Optional. Google or Microsoft gets the request for your calendar feed, straight from your browser. Nothing goes to UpTab. Clicking a location sends its text to Google Maps, only then.",
  },
  {
    title: "Error reports",
    text: "Opt-in only. GlitchTip gets the error message, stack trace, extension version and browser. No page addresses, locations, bookmarks, searches, calendar addresses or events.",
  },
];

const permissions: [string, string][] = [
  ["storage, unlimitedStorage", "your settings, shortlinks, saved places and uploaded photos"],
  ["bookmarks", "show your bookmarks, and edit them when you do"],
  ["favicon (Chrome only)", "website icons"],
  ["history (optional)", "sorting by “Recently” or “Most visited”"],
  ["location (optional)", "“Use my location”"],
  ["calendar.google.com, outlook.live.com or outlook.office365.com (optional)", "reading your calendar. Asked only when you connect, for that one site."],
];

const policies: [string, string][] = [
  ["Open-Meteo", "https://open-meteo.com/en/terms"],
  ["OpenStreetMap", "https://osmfoundation.org/wiki/Privacy_Policy"],
  ["DuckDuckGo", "https://duckduckgo.com/privacy"],
  ["GlitchTip", "https://glitchtip.com"],
  ["Unsplash", "https://unsplash.com/license"],
  ["Google", "https://policies.google.com/privacy"],
  ["Microsoft", "https://privacy.microsoft.com/privacystatement"],
  ["Mozilla", "https://www.mozilla.org/privacy/"],
];

const Page = () => (
  <LegalPage
    eyebrow="Privacy"
    title="Your tabs are your business."
    lead="UpTab has no accounts, no analytics and no ads. It doesn’t sell or share data. Most of it stays on your device. The few things that leave it are listed here."
    updated="19 November 2026"
  >
    <LegalSection title="What stays on your device">
      <ul>
        <li>Settings, shortlinks, saved places, custom icons and uploaded photos. Photos are resized and never uploaded.</li>
        <li>Your bookmarks. They’re read to show them and changed only when you do that. The list is never sent anywhere.</li>
        <li>
          Calendar, if you connect one. Your secret calendar address stays on this device only (it doesn’t sync). Today and the next two days
          (title, times, location, meeting link and, for Google, whether you accepted) are kept for up to 24 hours so they show offline.
        </li>
        <li>
          With browser sync on, only your background themes and the day’s photo pick sync, through your browser’s own service.
        </li>
      </ul>
    </LegalSection>

    <LegalSection title="What leaves your device">
      <p>
        Like any app that connects to the internet, the services below can see your IP address when UpTab contacts them. Here’s what else they
        get.
      </p>
      <ul>
        {outgoing.map(({ title, text }) => (
          <li key={title}>
            <strong className="text-black">{title}.</strong> {text}
          </li>
        ))}
      </ul>
    </LegalSection>

    <LegalSection title="You’re in control">
      <ul>
        <li>Error reporting, location and history are off until you turn them on. Revoke them in UpTab’s Privacy settings or the browser’s extension settings.</li>
        <li>
          Calendar is off until you connect it. It’s read-only: UpTab never creates, changes or answers events. “Disconnect” in Settings
          deletes the address and cached events. Resetting the secret address in Google Calendar or Outlook also cuts off access.
        </li>
        <li>
          History is only used for sorting. It’s read on your device and never stored, sent or shared.
        </li>
        <li>
          Location uses the browser’s own prompt on Chrome, and on Firefox asks only when you click “Use my location”. Saved places never use GPS.
          Only the area name and your saved places are kept.
        </li>
      </ul>
    </LegalSection>

    <LegalSection title="Permissions">
      <ul>
        {permissions.map(([name, why]) => (
          <li key={name}>
            <strong className="text-black">{name}:</strong> {why}
          </li>
        ))}
      </ul>
    </LegalSection>

    <LegalSection title="Odds and ends">
      <ul>
        <li>The feedback link adds your extension version, browser and operating system to the address.</li>
        <li>When you uninstall UpTab, the browser opens a YouTube page. It’s a rickroll, and UpTab sends nothing to it.</li>
      </ul>
    </LegalSection>

    <LegalSection title="This website">
      <ul>
        <li>No analytics, no ads, no accounts.</li>
        <li>
          The feedback form saves your message and category, plus the rating, email, extension version and browser if you fill them in.
          It saves your browser’s user agent too. It’s stored in Supabase and sent to me in a daily email.
        </li>
        <li>Your IP address is only used to slow down spam. It isn’t saved with your message.</li>
      </ul>
    </LegalSection>

    <LegalSection title="Other policies">
      <p>
        The services above have their own:{" "}
        {policies.map(([name, href], index) => (
          <span key={href}>
            {index > 0 && ", "}
            <ExternalLink href={href}>{name}</ExternalLink>
          </span>
        ))}
        .
      </p>
      <p>
        Questions? Use the{" "}
        <Link href="/feedback" className="font-semibold text-sky-800 underline-offset-2 hover:underline">
          feedback page
        </Link>
        .
      </p>
    </LegalSection>
  </LegalPage>
);

export default Page;
