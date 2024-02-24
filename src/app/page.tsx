import { slideConfig } from "@/config";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Slide from "./components/Slide";

const Home = () => (
  <main>
    <Header />
    <Hero className="px-6 mx-auto flex w-full max-w-2xl pt-14" />
    <div className="px-6 mx-auto mb-20 mt-24 w-full max-w-5xl space-y-10">
      {slideConfig.map((item, index) => (
        <Slide
          key={item.title}
          {...item}
          alignment={index % 2 === 0 ? "left" : "right"}
        />
      ))}
    </div>
  </main>
);

export default Home;
