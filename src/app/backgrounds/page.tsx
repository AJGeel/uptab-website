import { getCatalogue } from "@/features/backgrounds/api/get-catalogue";
import { Gallery } from "@/features/backgrounds/components/Gallery";

const Hero = () => {
  const paragraphs = [
    "Our upcoming™ ✨ Themes ✨ feature will let you explore diverse visual worlds with every new tab. We're working hard to bring you this experience.",
    "In the meantime, your unique perspective matters. Have a captivating image to share? We welcome your contributions to our growing collection.",
  ];

  return (
    <div className="mb-12 flex max-w-xl flex-col">
      <h1 className="mb-4 text-3xl font-bold">Backgrounds</h1>
      {paragraphs.map((text, index) => (
        <p
          key={index}
          className="my-1.5 leading-relaxed text-pretty text-black/90"
        >
          {text}
        </p>
      ))}
    </div>
  );
};

const Page = async () => {
  const catalogue = await getCatalogue();

  return (
    <div className="mx-auto my-32 flex w-full max-w-5xl flex-col gap-32 px-4 md:px-6">
      <Hero />

      <Gallery catalogue={catalogue} />
    </div>
  );
};

export default Page;
