import type { Feedback } from "@/features/feedback/utils/schema";
import { describeUserAgent } from "@/features/feedback/utils/user-agent";

type Part = { text: string; missing: boolean };

/**
 * What to show for the version and browser. When the visitor left the browser
 * empty, the request's own user agent gives a guess, labelled as one. There is
 * nothing to guess the version from.
 */
export const describeSetup = ({ version, browser, user_agent }: Pick<Feedback, "version" | "browser" | "user_agent">) => {
  const guess = describeUserAgent(user_agent);

  const browserPart: Part = browser
    ? { text: browser, missing: false }
    : {
        text: guess
          ? `${guess} (guessed)`
          : "Browser unknown",
        missing: true,
      };

  const versionPart: Part = version
    ? { text: `v${version}`, missing: false }
    : { text: "No version", missing: true };

  return { version: versionPart, browser: browserPart };
};
