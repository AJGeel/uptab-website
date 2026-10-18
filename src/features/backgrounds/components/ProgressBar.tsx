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
