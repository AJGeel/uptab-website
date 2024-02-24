import { slideConfig } from "@/config";
import Header from "../components/Header/Header";
import Hero from "../components/Hero";
import Slide from "../components/Slide";
import Faq from "@/components/Faq/Faq";
import { cn } from "@/utils/cn";
import CTABanner from "@/components/CTABanner";

const Home = () => {
  const containerStyle = "px-4 md:px-6 mx-auto max-w-2xl w-full";

  return (
    <main>
      <Header />
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
      <CTABanner className={cn(containerStyle, "max-w-5xl mt-32 mb-40")} />
    </main>
  );
};

export default Home;
