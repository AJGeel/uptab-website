import { afterEach, expect, it, vi } from "vitest";

import { hasBasicPassword, hasBearer, isAdminKey } from "./admin-auth";

afterEach(() => vi.unstubAllEnvs());

const basic = (credentials: string) => `Basic ${btoa(credentials)}`;

it("accepts the password with any username", () => {
  expect(hasBasicPassword(basic("anyone:s3cret"), "s3cret")).toBe(true);
  expect(hasBasicPassword(basic(":s3cret"), "s3cret")).toBe(true);
});

it("keeps colons in the password", () => {
  expect(hasBasicPassword(basic("me:a:b"), "a:b")).toBe(true);
});

it("rejects a wrong, missing or malformed password", () => {
  expect(hasBasicPassword(basic("me:wrong"), "s3cret")).toBe(false);
  expect(hasBasicPassword(null, "s3cret")).toBe(false);
  expect(hasBasicPassword("Basic !!!", "s3cret")).toBe(false);
  expect(hasBasicPassword("Bearer s3cret", "s3cret")).toBe(false);
});

it("never authorizes when no password is configured", () => {
  expect(hasBasicPassword(basic("me:"), "")).toBe(false);
  expect(hasBasicPassword(basic("me:"), undefined)).toBe(false);
  expect(hasBearer("Bearer undefined", undefined)).toBe(false);
});

it("checks bearer tokens", () => {
  expect(hasBearer("Bearer abc", "abc")).toBe(true);
  expect(hasBearer("Bearer abd", "abc")).toBe(false);
  expect(hasBearer(null, "abc")).toBe(false);
});

it("only accepts the configured admin key", () => {
  vi.stubEnv("FEEDBACK_ADMIN_KEY", "k7x2");
  expect(isAdminKey("k7x2")).toBe(true);
  expect(isAdminKey("other")).toBe(false);
  expect(isAdminKey("")).toBe(false);
});

it("accepts no key when none is configured", () => {
  vi.stubEnv("FEEDBACK_ADMIN_KEY", "");
  expect(isAdminKey("")).toBe(false);
});
