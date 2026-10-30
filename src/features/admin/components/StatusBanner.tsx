import type { CatalogueStatus } from "@/features/admin/api/load-admin";
import { cn } from "@/utils/cn";

import { CatalogueDialog } from "./CatalogueDialog";
import { RebuildButton } from "./RebuildButton";


const STYLES = {
  error: "bg-red-500/10 text-red-300 ring-1 ring-red-400/30 ring-inset",
  warning: "bg-amber-400/10 text-amber-200 ring-1 ring-amber-300/30 ring-inset",
  ok: "bg-sky-400/10 text-sky-400 ring-1 ring-sky-400/30 ring-inset",
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
    <div className={cn("flex flex-col gap-3 rounded-lg px-4 py-3", STYLES[tone])}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="grow text-sm font-medium">{message}</p>
        <CatalogueDialog className={cn("text-sm", linkClass)} />
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
