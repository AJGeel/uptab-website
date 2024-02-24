import { slideConfig } from "@/config";
import Header from "../components/Header/Header";
import Hero from "../components/Hero";
import Slide from "../components/Slide";
import Faq from "@/components/Faq/Faq";
import { cn } from "@/utils/cn";
import CTABanner from "@/components/CTABanner";

const Home = () => {
  const containerStyle = "px-6 mx-auto max-w-2xl w-full";

  return (
    <main>
      <Header />
      <Hero className={cn(containerStyle, "flex pt-14")} />
      <div className={cn(containerStyle, "mb-20 mt-24 max-w-5xl space-y-10")}>
        {slideConfig.map((item, index) => (
          <Slide
            key={item.title}
            {...item}
            alignment={index % 2 === 0 ? "left" : "right"}
          />
        ))}
      </div>
      <Faq className={cn(containerStyle, "mt-32")} />
      <CTABanner className={cn(containerStyle, "max-w-5xl mt-24 mb-40")} />
    </main>
  );
};

export default Home;
