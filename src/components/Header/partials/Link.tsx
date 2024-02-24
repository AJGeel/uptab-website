import { cn } from "@/utils/cn";
import { externalUrlOpts } from "@/utils/externalUrlOpts";
import { CodeBracketIcon, PlusIcon } from "@heroicons/react/16/solid";

type LinkProps = {
  label: string;
  href: string;
  iconName?: "plus" | "arrowUp";
};

export const Link = ({ label, href, iconName }: LinkProps) => (
  <a
    className={cn(
      "flex items-center gap-1.5 duration-150 active:opacity-75 active:scale-90 text-white rounded-full px-4 py-2 hover:brightness-110",
      iconName === "plus" ? "bg-sky-500" : "bg-slate-800 hover:brightness-150"
    )}
    {...externalUrlOpts}
    href={href}
  >
    <span>{label}</span>
    {iconName === "plus" ? (
      <PlusIcon className="size-5" />
    ) : (
      <CodeBracketIcon className="size-5" />
    )}
  </a>
);
