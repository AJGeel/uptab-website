import { Fragment } from "react";

import { Kbd } from "@/components/Kbd";
import { targetBlank } from "@/utils/targetBlank";

/** <kbd>, `code` and [links](url): the only inline markup the changelog uses. */
const INLINE = /<kbd>(.*?)<\/kbd>|`(.*?)`|\[(.*?)\]\((.*?)\)/g;

export const InlineText = ({ text }: { text: string }) => {
  const parts: React.ReactNode[] = [];
  let last = 0;

  for (const match of text.matchAll(INLINE)) {
    const [whole, kbd, code, label, href] = match;

    parts.push(text.slice(last, match.index));

    if (kbd !== undefined) {
      parts.push(
        <Kbd key={match.index} tone="dark">
          {kbd}
        </Kbd>
      );
    } else if (code !== undefined) {
      parts.push(
        <code key={match.index} className="rounded-md bg-dark-pill px-1.5 py-0.5 text-[0.9em] text-sky-400">
          {code}
        </code>
      );
    } else {
      parts.push(
        <a key={match.index} href={href} {...targetBlank} className="text-sky-400 underline underline-offset-2 hover:text-white">
          {label}
        </a>
      );
    }

    last = match.index + whole.length;
  }

  parts.push(text.slice(last));

  return parts.map((part, index) => <Fragment key={index}>{part}</Fragment>);
};
