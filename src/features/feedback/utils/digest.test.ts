import { expect, it } from "vitest";

import { buildDigest } from "./digest";
import type { Feedback } from "./schema";

const entry = (message: string, overrides: Partial<Feedback> = {}): Feedback => ({
  id: "1",
  created_at: "2026-11-08T07:00:00+00:00",
  category: "idea",
  rating: null,
  message,
  email: null,
  version: null,
  user_agent: null,
  ...overrides,
});

it("summarizes a single entry with the admin link", () => {
  const { subject, text } = buildDigest([entry("More themes", { rating: 5 })], "https://x.test/admin");

  expect(subject).toBe("UpTab: 1 new feedback entry");
  expect(text).toContain("[Idea, 5/5] More themes");
  expect(text).toContain("Read them all: https://x.test/admin");
});

it("previews five entries, truncates long messages and counts the rest", () => {
  const entries = Array.from({ length: 7 }, (_, index) => entry(`${index}`.repeat(300)));
  const { subject, text } = buildDigest(entries, "https://x.test/admin");

  expect(subject).toBe("UpTab: 7 new feedback entries");
  expect(text).toContain(`${"0".repeat(200)}…`);
  expect(text).not.toContain("0".repeat(201));
  expect(text).toContain("…and 2 more.");
});
