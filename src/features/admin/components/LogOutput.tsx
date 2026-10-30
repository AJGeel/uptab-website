import type { ReactNode } from "react";

import { jetBrainsMono } from "@/features/admin/components/ui/mono-font";
import { cn } from "@/utils/cn";

// The symbols in front of each line come from the build script's CLI, clack
const SYMBOLS: Record<string, string> = {
  "◆": "text-sky-400",
  "●": "text-sky-400",
  "◇": "text-[#7f8da0]",
  "▲": "text-amber-300",
  "■": "text-red-400",
  "┌": "text-[#7f8da0]",
  "│": "text-[#7f8da0]",
  "└": "text-[#7f8da0]",
};

const TOKEN = /(\b[\w./-]+\.(?:json|webp|avif|jpe?g|png)\b|\b[\w-]+\/[\w./-]+)|(\b\d+(?:\.\d+)?(?:\s?(?:MB|KB|ms|s))?\b)|(·)/g;

const highlightText = (text: string, isError: boolean) => {
  const nodes: ReactNode[] = [];
  let last = 0;

  for (const match of text.matchAll(TOKEN)) {
    const [token, path, number] = match;

    nodes.push(text.slice(last, match.index));
    nodes.push(
      <span key={match.index} className={path ? "text-sky-400" : number ? "text-amber-300" : "text-[#7f8da0]"}>
        {token}
      </span>
    );
    last = match.index + token.length;
  }

  nodes.push(text.slice(last));

  return <span className={isError ? "text-red-300" : undefined}>{nodes}</span>;
};

/** The rebuild's log, with its status symbols, paths and numbers coloured. */
export const LogOutput = ({ text, className }: { text: string; className?: string }) => (
  <pre className={cn(jetBrainsMono.className, "overflow-auto text-xs leading-relaxed whitespace-pre-wrap text-dark-text", className)}>
    {text.split("\n").map((line, index) => {
      const [symbol] = line.trimStart();
      const tone = SYMBOLS[symbol];

      if (!tone) {
        return <div key={index}>{highlightText(line, /error|failed/i.test(line))}</div>;
      }

      const start = line.indexOf(symbol);

      return (
        <div key={index}>
          {line.slice(0, start)}
          <span className={tone}>{symbol}</span>
          {highlightText(line.slice(start + 1), symbol === "■")}
        </div>
      );
    })}
  </pre>
);
