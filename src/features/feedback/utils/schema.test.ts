import { expect, it } from "vitest";

import { feedbackSchema, MESSAGE_MAX } from "./schema";

const valid = { category: "bug", message: "It crashed" };

it("accepts the minimum: a category and a message", () => {
  expect(feedbackSchema.parse(valid)).toEqual(valid);
});

it("trims the message and coerces the rating from form text", () => {
  expect(feedbackSchema.parse({ ...valid, message: "  hi  ", rating: "4" })).toMatchObject({ message: "hi", rating: 4 });
});

it.each([
  { category: "spam" },
  { rating: "6" },
  { rating: "0" },
  { rating: "2.5" },
  { message: "   " },
  { message: "x".repeat(MESSAGE_MAX + 1) },
  { email: "not-an-email" },
])("rejects %j", (override) => {
  expect(feedbackSchema.safeParse({ ...valid, ...override }).success).toBe(false);
});
