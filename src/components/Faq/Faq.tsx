import { faqConfig } from "@/config";
import { cn } from "@/utils/cn";

type FaqProps = {
  className?: string;
};

export type FaqItemProps = {
  question: string;
  answer: string;
};

const FaqItem = ({ question, answer }: FaqItemProps) => (
  <div className="space-y-2">
    <h3 className="md:text-lg font-semibold text-balance">{question}</h3>
    <p className="text-sm md:text-base text-slate-600 leading-relaxed">
      {answer}
    </p>
  </div>
);

const Faq = ({ className }: FaqProps) => {
  return (
    <div className={cn("space-y-8", className)}>
      {faqConfig.map((item) => (
        <FaqItem key={item.question} {...item} />
      ))}
    </div>
  );
};

export default Faq;
