export type FaqItemProps = {
  question: string;
  answer: string;
};

const FaqItem = ({ question, answer }: FaqItemProps) => (
  <div className="space-y-2">
    <h3 className="text-lg font-semibold text-balance">{question}</h3>
    <p className="text-slate-600 leading-relaxed">{answer}</p>
  </div>
);

export default FaqItem;
