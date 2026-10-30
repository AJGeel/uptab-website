import Image from "next/image";

import type { BackgroundImage } from "@/features/backgrounds/types/catalogue";
import { StoreActions } from "@/features/home/components/StoreActions";

/** The last nudge: a photo with a frosted panel over it. */
export const ClosingCta = ({ photo }: { photo: BackgroundImage }) => (
  <section className="reveal px-[clamp(1rem,4vw,2rem)] pt-[clamp(4.5rem,9vw,8rem)]">
    <div className="relative mx-auto flex min-h-120 max-w-310 items-center overflow-hidden rounded-4xl bg-[#8fc3d0]">
      <Image
        src={new URL(photo.sources[0].url).pathname}
        alt=""
        fill
        sizes="(min-width: 1240px) 1240px, 100vw"
        className="object-cover object-[50%_60%]"
      />
      <div className="relative m-[clamp(1rem,4vw,3.5rem)] max-w-140 rounded-[26px] bg-white/85 p-[clamp(1.5rem,3.4vw,2.75rem)] shadow-[0_30px_60px_-30px_rgba(2,14,44,0.6)] ring-1 ring-white/70 backdrop-blur-xl backdrop-saturate-150 ring-inset">
        <h2 className="text-[clamp(2.125rem,4.2vw,3.375rem)] leading-heading font-extrabold tracking-[-0.04em]">
          Convinced? Your next tab <span
            className="ut-accent text-(--lovely)"
            style={{ ["--hero-color" as string]: photo.palette[0] ?? "#25B1FF" }}
          >
            has a view
          </span>.
        </h2>
        <p className="mt-3.5 text-lg font-medium text-[#2a3848]">
          Installing takes about ten seconds. The views last a lot longer.
        </p>
        <StoreActions className="mt-7" otherClassName="text-[#2a3848]" />
      </div>
    </div>
  </section>
);
