import { type Mood } from "@/components/MoodFace";
import { externalUrls } from "@/config";
import { WiggleFace } from "@/features/home/components/WiggleFace";
import { externalUrlOpts } from "@/utils/externalUrlOpts";

const QUESTIONS: { mood: Mood; question: string; answer: string }[] = [
  {
    mood: "happy",
    question: "Does it work with my existing bookmarks?",
    answer: "Yep. UpTab reads the bookmarks already in your browser. No imports, no syncs.",
  },
  {
    mood: "wink",
    question: "Do you store my data or browsing history?",
    answer: "Nope. No tracking, no peeking. Your settings live on your device and nowhere else.",
  },
  {
    mood: "grin",
    question: "Is it really free?",
    answer: "Yup, it's free. And your data is never for sale.",
  },
  {
    mood: "whoa",
    question: "Wen new features??!",
    answer: "Soon-ish! Updates land regularly. Keep Update news switched on and UpTab will give you a little nudge.",
  },
  {
    mood: "hmm",
    question: "I found a bug. What now?",
    answer: "Whoops! While you open an issue on GitHub, I’ll grab the fly swatter.",
  },
];

const cardClass = "ut-mood flex flex-col gap-3.5 rounded-3xl p-6.5";

/** Every answer on show, each with a face to match its mood. */
export const Faq = () => (
  <section id="faq" className="mx-auto max-w-310 reveal scroll-mt-24 px-[clamp(1rem,4vw,2rem)] pt-[clamp(4.5rem,9vw,8rem)]">
    <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
      <div className="max-w-160">
        <p className="text-[13px] font-bold tracking-[0.12em] text-sky-800 uppercase">FAQ</p>
        <h2 className="mt-3 text-[clamp(2.125rem,4vw,3.25rem)] leading-heading font-extrabold tracking-[-0.035em]">
          Questions, answered.
        </h2>
      </div>
      <p className="max-w-90 text-[17px] leading-relaxed text-body">
        Straight answers from the one human behind it. With feelings.
      </p>
    </div>

    <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-5">
      {QUESTIONS.map(({ mood, question, answer }) => (
        <article key={question} className={`${cardClass} bg-white ring-1 ring-[#e2e8ef] ring-inset`}>
          <WiggleFace mood={mood} />
          <h3 className="text-[19px] leading-snug font-extrabold tracking-[-0.01em]">{question}</h3>
          <p className="leading-relaxed text-body">{answer}</p>
        </article>
      ))}

      <article className={`${cardClass} bg-black text-dark-text`}>
        <WiggleFace mood="party" />
        <h3 className="text-[19px] leading-snug font-extrabold tracking-[-0.01em] text-white">Still curious?</h3>
        <p className="leading-relaxed text-dark-body">
          Something odd, something missing, or just want to say hi? Arthur reads every issue.
        </p>
        <a
          href={`${externalUrls.github}/issues`}
          {...externalUrlOpts}
          className="mt-auto inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-white button-wipe px-4.5 text-[15px] font-bold text-black active:scale-[.97]"
        >
          Ask on GitHub
        </a>
      </article>
    </div>
  </section>
);
