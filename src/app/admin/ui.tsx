import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-sm border border-slate-300 bg-white px-2 py-1 text-sm read-only:bg-slate-100 read-only:text-slate-500";

export const buttonClass =
  "crispy-outline rounded-sm bg-white px-3 py-1 text-sm font-medium whitespace-nowrap shadow-xs duration-150 hover:bg-slate-50 disabled:opacity-50";

export const cardClass = "crispy-outline rounded-lg bg-white p-4 shadow-sm";

export const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
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
