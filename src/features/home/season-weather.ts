export type Season = "winter" | "spring" | "summer" | "autumn";

export type Weather = {
  temperature: number;
  condition: string;
  /** The next three days. */
  forecast: { day: string; high: number; low: number }[];
};

/** Northern hemisphere, by calendar month: December to February is winter, and so on. */
export const seasonOf = (date: Date): Season => {
  const month = date.getUTCMonth();

  if (month === 11 || month < 2) {
    return "winter";
  }

  if (month < 5) {
    return "spring";
  }

  return month < 8 ? "summer" : "autumn";
};

const BY_SEASON: Record<Season, { temperature: number; condition: string; highs: number[]; lows: number[] }> = {
  winter: { temperature: 2.4, condition: "Crisp and clear", highs: [4, 3, 5], lows: [-2, -3, -1] },
  spring: { temperature: 12.1, condition: "Partly cloudy", highs: [14, 12, 15], lows: [6, 5, 7] },
  summer: { temperature: 24.6, condition: "Sunny", highs: [27, 29, 26], lows: [16, 17, 15] },
  autumn: { temperature: 13.2, condition: "Partly cloudy", highs: [14, 12, 13], lows: [8, 7, 9] },
};

/** A made-up local forecast that fits the time of year, so the demo never says 25° in January. */
export const weatherFor = (date: Date): Weather => {
  const { temperature, condition, highs, lows } = BY_SEASON[seasonOf(date)];
  const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: "UTC" });

  return {
    temperature,
    condition,
    forecast: highs.map((high, index) => ({
      day: weekday.format(new Date(date.getTime() + (index + 1) * 86_400_000)),
      high,
      low: lows[index],
    })),
  };
};
