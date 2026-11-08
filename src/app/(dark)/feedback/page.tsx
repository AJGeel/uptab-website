import type { Metadata } from "next";

import { FeedbackForm } from "@/features/feedback/components/FeedbackForm";

export const metadata: Metadata = {
  title: "Feedback — UpTab",
  description: "Bug, brainstorm or a big fat compliment. It all lands in my inbox, and I read every single one.",
};

const Page = () => (
  <div className="mx-auto flex max-w-160 flex-col gap-8 px-[clamp(1rem,4vw,1.5rem)] pt-[clamp(3rem,9vw,7.5rem)] pb-[clamp(4rem,9vw,7.5rem)]">
    <header className="flex flex-col gap-3.5">
      <p className="text-[13px] font-bold tracking-[0.12em] text-sky-400 uppercase">Feedback</p>
      <h1 className="text-[clamp(2.375rem,6vw,3.5rem)] leading-none font-extrabold tracking-[-0.04em] text-white">
        Thoughts? I’m all ears.
      </h1>
      <p className="text-lg leading-relaxed text-dark-body">
        Bug, brainstorm or a big fat compliment. It all lands in my inbox, and I read every single one.
      </p>
    </header>
    <FeedbackForm />
  </div>
);

export default Page;
