import { faqConfig } from "@/config";
import { cn } from "@/utils/cn";
import FaqItem from "./partials/FaqItem";

type FaqProps = {
  className?: string;
};

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
