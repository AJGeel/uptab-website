import CTABanner from "@/components/CTABanner";
import Faq from "@/components/Faq/Faq";
import { slideConfig } from "@/config";
import { cn } from "@/utils/cn";

import Hero from "../components/Hero";
import Slide from "../components/Slide";

const Home = () => {
  const containerStyle = "px-4 md:px-6 mx-auto max-w-2xl w-full";

  return (
    <main>
      <Hero className={cn(containerStyle, "flex pt-14")} />
      <div
        className={cn(
          containerStyle,
          "my-24 max-w-5xl space-y-16 md:space-y-10 bg-white border-t md:border-t-0 border-black/10 md:bg-transparent py-10 pt-0 md:py-0"
        )}
      >
        {slideConfig.map((item, index) => (
          <Slide
            key={item.title}
            {...item}
            alignment={index % 2 === 0 ? "left" : "right"}
          />
        ))}
      </div>
      <Faq className={cn(containerStyle, "mt-12 md:mt-32")} />
      <CTABanner className={cn(containerStyle, "max-w-5xl mt-32 mb-20")} />
    </main>
  );
};

export default Home;
