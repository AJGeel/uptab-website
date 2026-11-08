import { CATEGORY_LABELS, type Feedback } from "@/features/feedback/utils/schema";

const PREVIEW_COUNT = 5;
const PREVIEW_LENGTH = 200;

const plural = (count: number) => `${count} new feedback ${count === 1 ? "entry" : "entries"}`;

/** Plain text, so nothing a visitor typed is ever interpreted as markup. */
export const buildDigest = (entries: Feedback[], adminUrl: string) => {
  const previews = entries.slice(0, PREVIEW_COUNT).map(({ category, rating, message }) => {
    const text = message.length > PREVIEW_LENGTH ? `${message.slice(0, PREVIEW_LENGTH)}…` : message;

    return `[${CATEGORY_LABELS[category]}${rating ? `, ${rating}/5` : ""}] ${text}`;
  });
  const hidden = entries.length - previews.length;

  return {
    subject: `UpTab: ${plural(entries.length)}`,
    text: [
      `${plural(entries.length)} in the last 24 hours.`,
      "",
      ...previews,
      ...(hidden > 0 ? ["", `…and ${hidden} more.`] : []),
      "",
      `Read them all: ${adminUrl}`,
    ].join("\n"),
  };
};
