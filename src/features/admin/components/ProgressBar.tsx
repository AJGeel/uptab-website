/**
 * Published (blue), pending (amber) and poor-fit (red) photos as one bar, with
 * counts. Poor fits are published photos, so they count towards "published" too.
 */
export const ProgressBar = ({
  published,
  pending,
  poorFit = 0,
}: {
  published: number;
  pending: number;
  poorFit?: number;
}) => {
  const total = published + pending;
  const share = (count: number) => `${(count / total) * 100}%`;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex h-2 overflow-hidden rounded-full bg-[#0b121c]">
        {total > 0 && (
          <>
            <div className="bg-sky-400" style={{ width: share(published - poorFit) }} />
            <div className="bg-rose-400" style={{ width: share(poorFit) }} />
            <div className="bg-amber-400" style={{ width: share(pending) }} />
          </>
        )}
      </div>
      <p className="text-xs text-[#7f8da0]">
        {total === 0 ? (
          "No photos yet"
        ) : (
          <>
            {published} published · {pending} pending
            {poorFit > 0 && (
              <span
                title="Published photos where neither text colour reads well in the top-left corner"
                className="text-rose-300"
              >
                {" "}
                · {poorFit} poor fit
              </span>
            )}
          </>
        )}
      </p>
    </div>
  );
};
