import { expect, it } from "vitest";

import { plainText } from "./plain-text";

it("strips the inline markup the changelog uses", () => {
  expect(plainText("Press <kbd>B</kbd> or run `bun dev`, see [the docs](https://example.com).")).toBe(
    "Press B or run bun dev, see the docs."
  );
});
