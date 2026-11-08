/** Just enough of a user agent for "Firefox 144 · macOS". Order matters: Edge and Opera also say Chrome. */
const BROWSERS: [RegExp, string][] = [
  [/Edg\/(\d+)/, "Edge"],
  [/OPR\/(\d+)/, "Opera"],
  [/Firefox\/(\d+)/, "Firefox"],
  [/Chrome\/(\d+)/, "Chrome"],
  [/Version\/(\d+).*Safari/, "Safari"],
];

// Android and iOS also say Linux and Mac OS X, and ChromeOS says Linux
const SYSTEMS: [RegExp, string][] = [
  [/Android/, "Android"],
  [/iPhone|iPad/, "iOS"],
  [/CrOS/, "ChromeOS"],
  [/Windows/, "Windows"],
  [/Macintosh/, "macOS"],
  [/Linux/, "Linux"],
];

export const parseUserAgent = (userAgent: string | null) => {
  const agent = userAgent ?? "";
  const browser = BROWSERS.map(([pattern, name]) => [agent.match(pattern), name] as const).find(([match]) => match);
  const system = SYSTEMS.find(([pattern]) => pattern.test(agent));

  return {
    browser: browser?.[0] ? `${browser[1]} ${browser[0][1]}` : null,
    system: system?.[1] ?? null,
  };
};

/** "Firefox 144 on macOS", with whichever half is known. Empty when neither is. */
export const describeUserAgent = (userAgent: string | null) => {
  const { browser, system } = parseUserAgent(userAgent);

  return [browser, system].filter(Boolean).join(" on ");
};
