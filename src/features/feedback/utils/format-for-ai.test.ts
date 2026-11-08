import { expect, it } from "vitest";

import { buildFeedbackExport } from "./format-for-ai";
import type { Feedback } from "./schema";

const entry = (overrides: Partial<Feedback>): Feedback => ({
  id: "1",
  created_at: "2026-11-05T09:12:00Z",
  category: "bug",
  rating: 2,
  message: "Tabs vanish",
  email: "someone@example.com",
  version: "1.4.0",
  browser: "Chrome",
  user_agent: null,
  ...overrides,
});

it("lists each entry under the prompt, with the view described", () => {
  const text = buildFeedbackExport(
    [entry({}), entry({ id: "2", category: "praise", rating: null, message: "Love it", version: null })],
    "Last month, unread"
  );

  expect(text).toContain("View: Last month, unread (2 entries)");
  expect(text).toContain("### 1. Bug | 2/5 Meh | 2026-11-05 | v1.4.0 | Chrome\nTabs vanish");
  expect(text).toContain("### 2. Praise | no rating | 2026-11-05 | No version | Chrome\nLove it");
});

it("keeps email addresses out of the text", () => {
  expect(buildFeedbackExport([entry({})], "All time")).not.toContain("someone@example.com");
});
