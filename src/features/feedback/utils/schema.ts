import { z } from "zod";

export const CATEGORIES = ["bug", "idea", "praise", "other"] as const;

export const CATEGORY_LABELS: Record<(typeof CATEGORIES)[number], string> = {
  bug: "Bug",
  idea: "Idea",
  praise: "Praise",
  other: "Other",
};

export const RATING_LABELS = ["Awful", "Meh", "Okay", "Good", "Love it"] as const;

export const MESSAGE_MAX = 2000;

export const feedbackSchema = z.object({
  category: z.enum(CATEGORIES),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  message: z.string().trim().min(1).max(MESSAGE_MAX),
  email: z.email().max(254).optional(),
  // A malformed version is dropped rather than failing the whole submission
  version: z
    .string()
    .regex(/^[0-9A-Za-z.+-]{1,32}$/)
    .optional()
    .catch(undefined),
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
  user_agent: string | null;
};
