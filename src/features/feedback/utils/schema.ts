import { z } from "zod";

export const CATEGORIES = ["bug", "idea", "praise", "other"] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  bug: "Bug",
  idea: "Idea",
  praise: "Praise",
  other: "Other",
};

export const RATING_LABELS = ["Awful", "Meh", "Okay", "Good", "Love it"] as const;

export const MESSAGE_MAX = 2000;

/** What an UpTab version looks like. Shared so the form and the server agree. */
export const VERSION_PATTERN = /^[0-9A-Za-z.+-]{1,32}$/;

export const feedbackSchema = z.object({
  category: z.enum(CATEGORIES),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  message: z.string().trim().min(1).max(MESSAGE_MAX),
  email: z.email().max(254).optional(),
  // A malformed version is dropped rather than failing the whole submission
  version: z
    .string()
    .regex(VERSION_PATTERN)
    .optional()
    .catch(undefined),
  // What the visitor says they use, as opposed to user_agent, which the server reads from the request
  browser: z.string().trim().max(100).optional(),
  user_agent: z.string().max(300).optional(),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;

export type Feedback = {
  id: string;
  created_at: string;
  category: (typeof CATEGORIES)[number];
  rating: number | null;
  message: string;
  email: string | null;
  version: string | null;
  browser: string | null;
  user_agent: string | null;
};
