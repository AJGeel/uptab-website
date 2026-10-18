import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-sm border border-slate-300 bg-white px-2 py-1 text-sm read-only:bg-slate-100 read-only:text-slate-500";

const BUTTON_VARIANTS = {
  primary: "bg-sky-500 text-white hover:brightness-110",
  dark: "bg-slate-800 text-white hover:brightness-150",
  danger: "bg-danger/10 text-danger hover:bg-danger hover:text-white",
  ghost: "text-slate-900 hover:bg-slate-900/5",
};

/** Fully rounded buttons, matching the header and CTA banner on the home page. */
export const buttonClass = (variant: keyof typeof BUTTON_VARIANTS = "dark") =>
  `inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap duration-150 active:scale-90 active:opacity-75 disabled:pointer-events-none disabled:opacity-40 ${BUTTON_VARIANTS[variant]}`;

export const cardClass = "crispy-outline rounded-lg bg-white p-4 shadow-sm";

export const Field = ({
  label,
  className = "text-slate-500",
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) => (
  <label className={`flex flex-col gap-1 text-xs font-medium ${className}`}>
    {label}
    {children}
  </label>
);

/** Published (green) and pending (amber) photos as one bar, with counts. */
export const ProgressBar = ({ published, pending }: { published: number; pending: number }) => {
  const total = published + pending;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex h-2 overflow-hidden rounded-full bg-slate-200">
        {total > 0 && (
          <>
            <div className="bg-green-500" style={{ width: `${(published / total) * 100}%` }} />
            <div className="bg-amber-400" style={{ width: `${(pending / total) * 100}%` }} />
          </>
        )}
      </div>
      <p className="text-xs text-slate-500">
        {total === 0 ? "No photos yet" : `${published} published · ${pending} pending`}
      </p>
    </div>
  );
};
