"use client";

import { useState } from "react";

/** The hero photo, fading in over the placeholder colour once it has loaded instead of painting line by line. */
export const HeroPhoto = ({ src, srcSet }: { src: string; srcSet: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    // A plain img: next/image would re-encode the renditions, softening them
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      srcSet={srcSet}
      sizes="100vw"
      alt=""
      fetchPriority="high"
      // A cached image can finish loading before React attaches onLoad
      ref={(image) => {
        if (image?.complete) {
          setIsLoaded(true);
        }
      }}
      onLoad={() => setIsLoaded(true)}
      className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none ${isLoaded ? "opacity-100" : "opacity-0"}`}
    />
  );
};
