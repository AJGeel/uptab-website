import { ReactNode } from "react";

import { faqConfig } from "@/config";
import { cn } from "@/utils/cn";

type FaqProps = {
  className?: string;
};

export type FaqItemProps = {
  question: string;
  answer: string | ReactNode;
};

const FaqItem = ({ question, answer }: FaqItemProps) => (
  <div className="space-y-2">
    <h3 className="text-balance font-semibold md:text-lg">{question}</h3>
    <p className="text-sm leading-relaxed text-slate-600 md:text-base">
      {answer}
    </p>
  </div>
);

const Faq = ({ className }: FaqProps) => (
  <div className={cn("space-y-8", className)}>
    {faqConfig.map((item) => (
      <FaqItem key={item.question} {...item} />
    ))}
  </div>
);

export default Faq;
