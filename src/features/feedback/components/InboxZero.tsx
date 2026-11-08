const CONFETTI = [
  "left-[22%] top-[18%] size-2 rotate-20 rounded-xs bg-sky-400",
  "right-[24%] top-[14%] size-1.5 rounded-full bg-dark-text [animation-delay:-.8s]",
  "left-[30%] top-[46%] size-1.25 rounded-full bg-[#8cd4ff] [animation-delay:-1.4s]",
  "right-[30%] top-[42%] h-1 w-2.25 rounded-xs bg-sky-400 [animation-delay:-.4s]",
];

export const InboxZero = () => (
  <section className="fb-in relative flex flex-col items-center gap-3 overflow-hidden rounded-[28px] bg-dark-surface px-6 py-12 text-center ring-1 ring-dark-line ring-inset">
    {CONFETTI.map((className) => (
      <span key={className} aria-hidden="true" className={`fb-conf absolute ${className}`} />
    ))}
    <svg viewBox="0 0 32 32" role="img" aria-label="A face wearing sunglasses" className="fb-hop size-26">
      <rect width="32" height="32" rx="8" fill="url(#fb-sky)" />
      <path d="M5.5 11.5H26.5V13.5Q26.5 18 22 18Q18 18 17.5 13.5H14.5Q14 18 10 18Q5.5 18 5.5 13.5Z" fill="#085884" />
      <path d="M11 21.5Q16 26.5 21 21.5" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
    <h2 className="mt-2 text-3xl leading-none font-extrabold tracking-[-0.03em] text-white">Inbox zero</h2>
    <p className="max-w-105 text-[17px] leading-relaxed text-dark-body">
      Every complaint read. Go outside, touch some grass.
    </p>
  </section>
);
