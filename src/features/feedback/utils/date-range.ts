export const DATE_RANGES = { month: "Last month", year: "Last year", all: "All time" } as const;

export type DateRange = keyof typeof DATE_RANGES;

export const parseDateRange = (value: string | undefined): DateRange =>
  value && value in DATE_RANGES ? (value as DateRange) : "month";

/** Undefined for all time, so the query has no date condition at all. */
export const dateRangeSince = (range: DateRange) => {
  if (range === "all") {
    return undefined;
  }

  const since = new Date();
  since.setMonth(since.getMonth() - (range === "month" ? 1 : 12));
  return since;
};
