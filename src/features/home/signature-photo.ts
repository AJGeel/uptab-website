import type { BackgroundImage } from "@/features/backgrounds/types/catalogue";

/** Christina Gottardi's Dolomites photo: the fixed face of the site in link previews. The home page rotates its photos. */
const SIGNATURE_PHOTO_ID = "cristina-gottardi-cspju6hyo-0-unsplash";

export const findSignaturePhoto = (images: BackgroundImage[]) =>
  images.find(({ id }) => id === SIGNATURE_PHOTO_ID) ?? images[0];
