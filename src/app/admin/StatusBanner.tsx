import Link from "next/link";

import type { CatalogueStatus } from "./data";
import { RebuildButton } from "./RebuildButton";

const STYLES = {
  error: "bg-red-50 text-red-800 crispy-outline",
  warning: "bg-amber-50 text-amber-900 crispy-outline",
  ok: "bg-green-50 text-green-800 crispy-outline",
};

const describe = (problems: string[], catalogue: CatalogueStatus) => {
  if (problems.length > 0) {
    return {
      tone: "error" as const,
      message: `backgrounds.json has ${problems.length} ${problems.length === 1 ? "problem" : "problems"}. The build fails until they're fixed.`,
    };
  }

  if (catalogue.state === "missing") {
    return { tone: "warning" as const, message: "The catalogue hasn't been generated yet." };
  }

  if (catalogue.state === "stale") {
    return {
      tone: "warning" as const,
      message: "You have changes that aren't in the catalogue yet.",
    };
  }

  return {
    tone: "ok" as const,
    message: `The catalogue is up to date, generated ${catalogue.generatedAt.toLocaleString("en-GB")}.`,
  };
};

const linkClass = "underline decoration-current/30 hover:decoration-current";

/** Validation and catalogue state, with a rebuild button, at the top of every admin page. */
export const StatusBanner = ({
  problems,
  catalogue,
}: {
  problems: string[];
  catalogue: CatalogueStatus;
}) => {
  const { tone, message } = describe(problems, catalogue);

  return (
    <div className={`flex flex-col gap-3 rounded-lg px-4 py-3 ${STYLES[tone]}`}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="grow text-sm font-medium">{message}</p>
        <p className="text-sm">
          <Link href="/backgrounds" className={linkClass}>
            Gallery
          </Link>{" "}
          ·{" "}
          <Link href="/backgrounds/v1/catalogue.json" className={linkClass}>
            catalogue.json
          </Link>
        </p>
        <RebuildButton />
      </div>
      {problems.length > 0 && (
        <ul className="list-inside list-disc text-sm">
          {problems.map((problem) => (
            <li key={problem}>{problem}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
