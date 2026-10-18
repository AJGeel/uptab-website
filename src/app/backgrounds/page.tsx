import { getCatalogue } from "@/features/backgrounds/api/get-catalogue";
import { Gallery } from "@/features/backgrounds/components/Gallery";

const Hero = () => (
  <div className="flex flex-col gap-2">
    <h1 className="text-3xl font-bold">Backgrounds</h1>
    <p className="text-pretty text-black/70">Explore the world with every new tab. These are the themes currently included in UpTab.</p>
  </div>
);

const Page = async () => {
  const catalogue = await getCatalogue();

  return (
    <div className="my-32 flex w-full flex-col gap-20">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <Hero />
      </div>

      <Gallery catalogue={catalogue} />
    </div>
  );
};

export default Page;
