import { describeSetup } from "@/features/feedback/utils/describe-setup";
import { CATEGORY_LABELS, type Feedback, RATING_LABELS } from "@/features/feedback/utils/schema";

const PROMPT = `You are helping the maker of UpTab, a browser extension, make sense of user feedback.
Below are the feedback entries from one view of the inbox. Analyse them and answer:

1. Themes: the 3-7 recurring themes, each with how many entries mention it and one or two short quotes.
2. Bugs: every distinct bug, with how often it was reported and the versions/browsers involved. Order by impact.
3. Requests: the ideas and feature requests, grouped and ranked by demand.
4. Praise: what people love, so I know what to protect.
5. Sentiment: the overall mood, and how it differs by version or browser if there is a pattern.
6. Next steps: the 3 things most worth doing next, with a one-line reason each.

Be concrete and base everything on the entries. If something has only one mention, say so rather than calling it a trend. Say when the sample is too small to conclude anything.`;

export const buildFeedbackExport = (entries: Feedback[], viewLabel: string) => {
  const blocks = entries.map((entry, index) => {
    const setup = describeSetup(entry);
    const meta = [
      CATEGORY_LABELS[entry.category],
      entry.rating ? `${entry.rating}/5 ${RATING_LABELS[entry.rating - 1]}` : "no rating",
      entry.created_at.slice(0, 10),
      setup.version.text,
      setup.browser.text,
    ].join(" | ");

    return `### ${index + 1}. ${meta}\n${entry.message}`;
  });

  return `${PROMPT}\n\n---\n\nView: ${viewLabel} (${entries.length} ${entries.length === 1 ? "entry" : "entries"})\n\n${blocks.join("\n\n")}\n`;
};
