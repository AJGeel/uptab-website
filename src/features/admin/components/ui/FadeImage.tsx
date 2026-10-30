"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

import { cn } from "@/utils/cn";

/** An image that fades in once it has loaded, instead of popping in line by line. */
export const FadeImage = ({ className, alt, ...props }: ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Image
      {...props}
      alt={alt}
      // A cached image can finish loading before React attaches onLoad
      ref={(image) => {
        if (image?.complete) {
          setIsLoaded(true);
        }
      }}
      onLoad={() => setIsLoaded(true)}
      className={cn("transition-opacity duration-500 ease-out motion-reduce:transition-none", isLoaded ? "opacity-100" : "opacity-0", className)}
    />
  );
};
