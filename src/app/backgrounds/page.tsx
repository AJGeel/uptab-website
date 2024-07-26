import { ChevronDoubleRightIcon } from "@heroicons/react/16/solid";
import { EyeIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

import { getAllBackgrounds } from "@/services/background";
import { targetBlank } from "@/utils/targetBlank";

const Hero = () => {
  const paragraphs = [
    "Our upcoming ✨ Themes ✨ feature will let you explore diverse visual worlds with every new tab. We're working hard to bring you this experience.",
    "In the meantime, your unique perspective matters. Have a captivating image to share? We welcome your contributions to our growing collection.",
    "Stay tuned for updates on this exciting feature!",
  ];

  return (
    <div className="mb-12 flex max-w-xl flex-col">
      <h1 className="mb-4 text-3xl font-bold">Backgrounds</h1>
      {paragraphs.map((text, index) => (
        <p
          key={index}
          className="my-1.5 text-pretty leading-relaxed text-black/90"
        >
          {text}
        </p>
      ))}
    </div>
  );
};

const Page = async () => {
  const themes = await getAllBackgrounds();

  return (
    <div className="mx-auto my-32 flex w-full max-w-5xl flex-col gap-32 px-4 md:px-6">
      <Hero />

      {themes.map(({ theme, images }) => (
        <div className="flex flex-col gap-4" key={theme}>
          <h2 className="font-bold capitalize">
            Theme:{" "}
            <Link
              href={`/api/background?theme=${theme}`}
              {...targetBlank}
              className="group inline-flex items-center justify-center gap-1"
            >
              <span className="text-sky-500 duration-150 group-hover:text-black">
                {theme}
              </span>
              <ChevronDoubleRightIcon className="size-4 text-sky-500 duration-150 group-hover:translate-x-0.5 group-hover:text-black" />
            </Link>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {images.map((imageSrc) => (
              <Link
                key={imageSrc}
                href={imageSrc}
                className="group flex size-full items-center justify-center overflow-hidden rounded-sm bg-black/10 duration-300 active:scale-90 sm:even:-mt-16"
                {...targetBlank}
              >
                <EyeIcon className="absolute z-10 size-8 text-black opacity-0 duration-500 ease-in-out group-hover:scale-105 group-hover:opacity-100" />
                <Image
                  src={imageSrc}
                  width={640}
                  height={360}
                  alt=""
                  className="aspect-[16/9] size-full duration-500 ease-in-out group-hover:scale-105 group-hover:opacity-60"
                />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Page;
