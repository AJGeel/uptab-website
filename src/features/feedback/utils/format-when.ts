const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/** "Today 09:12", "Yesterday 21:05", then "Thu 5 Nov" (with the year when it isn't this one). In the viewer's timezone. */
export const formatWhen = (iso: string, now: number) => {
  const date = new Date(iso);
  const days = Math.round((startOfDay(new Date(now)) - startOfDay(date)) / DAY_MS);
  const time = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

  if (days === 0) {
    return `Today ${time}`;
  }

  if (days === 1) {
    return `Yesterday ${time}`;
  }

  const sameYear = date.getFullYear() === new Date(now).getFullYear();

  return date
    .toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: sameYear ? undefined : "numeric" })
    .replace(",", "");
};
