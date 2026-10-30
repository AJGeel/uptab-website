/**
 * Public contract for the remote backgrounds catalogue, served at
 * /backgrounds/v1/catalogue.json. Additive changes only: installed extensions
 * rely on this shape, so breaking changes go to /backgrounds/v2/.
 */
export type Catalogue = {
  version: 1;
  /** ISO timestamp of the build that generated this file. */
  generatedAt: string;
  /**
   * Short hash of the themes and images. Unlike `generatedAt` it only changes
   * when the content does, so it tells whether a rebuild changed anything.
   */
  revision: string;
  themes: Theme[];
  images: BackgroundImage[];
};

export type Theme = {
  /** Stable slug, e.g. "holland". Stored in users' settings, never rename. */
  id: string;
  /** Display name, e.g. "Holland". */
  name: string;
  /** A short, playful description for the website. Optional; the extension ignores it. */
  blurb?: string;
};

export type BackgroundImage = {
  /** Stable slug, unique across all themes, e.g. "koppelpoort". */
  id: string;
  /** A Theme.id. */
  theme: string;
  /** Photographer, shown as "Photo by …". null hides the credit. */
  author: string | null;
  /** Optional link for the credit, e.g. an Unsplash page. */
  link: string | null;
  /** Dominant colour as "#rrggbb", shown while the image loads. */
  color: string;
  /** Up to three vivid colours of the photo as "#rrggbb", most prominent first. Empty for a monochrome photo. */
  palette: string[];
  /** Original aspect ratio, width / height (e.g. 1.5). */
  aspectRatio: number;
  /** Available renditions, smallest first. Never larger than the source. */
  sources: { width: number; url: string }[];
  /** A small preview, e.g. for a theme picker. Never a background, so not in `sources`. */
  thumbnail?: { width: number; url: string };
};
