export type ChangeKind = "added" | "changed" | "fixed";

export type ChangeItem = {
  kind: ChangeKind;
  text: string;
  /** Nested bullets under the item. */
  details: string[];
};

export type Release = {
  /** Without the "V": "1.5.1". */
  version: string;
  /** ISO date: "2026-10-17". */
  date: string;
  items: ChangeItem[];
};

const RELEASE_HEADING = /^##\s+\[?v?(\d+\.\d+\.\d+)\]?\s*[—–-]\s*(\d{4}-\d{2}-\d{2})/i;
const KIND_HEADING = /^###\s+(.*)$/;
const BULLET = /^(\s*)[-*]\s+(.*)$/;

/** Sections other than Added and Fixed (e.g. Removed) count as changes. */
const kindOf = (heading: string): ChangeKind => {
  if (/added/i.test(heading)) {
    return "added";
  }

  return /fixed/i.test(heading) ? "fixed" : "changed";
};

/**
 * Reads the repo's CHANGELOG.md (Keep a Changelog format) into releases, newest
 * first as in the file. Anything it doesn't recognise, e.g. the link
 * references at the bottom, is skipped.
 */
export const parseChangelog = (markdown: string): Release[] => {
  const releases: Release[] = [];
  let kind: ChangeKind | null = null;
  let item: ChangeItem | null = null;

  for (const line of markdown.split("\n")) {
    const release = RELEASE_HEADING.exec(line);

    if (release) {
      releases.push({ version: release[1], date: release[2], items: [] });
      kind = null;
      item = null;
      continue;
    }

    const current = releases[releases.length - 1];
    const heading = KIND_HEADING.exec(line);

    if (heading) {
      kind = kindOf(heading[1]);
      item = null;
      continue;
    }

    if (!current || !kind) {
      continue;
    }

    const bullet = BULLET.exec(line);
    const text = (bullet?.[2] ?? line).trim();

    if (bullet && bullet[1].length === 0) {
      item = { kind, text, details: [] };
      current.items.push(item);
    } else if (bullet && item) {
      item.details.push(text);
    } else if (item && text && /^\s/.test(line)) {
      // A wrapped line continues the previous bullet
      if (item.details.length > 0) {
        item.details[item.details.length - 1] += ` ${text}`;
      } else {
        item.text += ` ${text}`;
      }
    }
  }

  return releases;
};
