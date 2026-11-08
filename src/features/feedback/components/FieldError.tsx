import type { ReactNode } from "react";

export const FieldError = ({ id, children }: { id: string; children: ReactNode }) => (
  <p id={id} role="alert" className="flex items-center gap-2 text-sm font-semibold text-[#ff9aaa]">
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <path d="M8 4.5v4.2M8 11.2v.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
    {children}
  </p>
);
