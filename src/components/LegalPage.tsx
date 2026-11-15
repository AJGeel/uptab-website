import type { ReactNode } from "react";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  lead: string;
  updated: string;
  children: ReactNode;
};

export const LegalPage = ({ eyebrow, title, lead, updated, children }: LegalPageProps) => (
  <div className="mx-auto flex max-w-160 flex-col gap-8 px-[clamp(1rem,4vw,1.5rem)] pt-[clamp(3rem,9vw,6rem)] pb-[clamp(4rem,9vw,7.5rem)]">
    <header className="flex flex-col gap-3.5">
      <p className="text-[13px] font-bold tracking-[0.12em] text-sky-800 uppercase">{eyebrow}</p>
      <h1 className="text-[clamp(2.375rem,6vw,3.5rem)] leading-none font-extrabold tracking-[-0.04em]">{title}</h1>
      <p className="text-lg leading-relaxed text-body">{lead}</p>
      <p className="text-sm text-muted">Last updated: {updated}</p>
    </header>
    <div className="divide-y divide-[#e6ecf2] rounded-3xl bg-white px-[clamp(1.25rem,4vw,2rem)] ring-1 ring-[#e2e8ef] ring-inset">{children}</div>
  </div>
);

export const LegalSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="flex flex-col gap-3 py-6 text-base leading-relaxed text-body [&_li]:pl-1 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5 [&_ul]:marker:text-sky-500">
    <h2 className="text-xl font-extrabold tracking-tight text-black">{title}</h2>
    {children}
  </section>
);
