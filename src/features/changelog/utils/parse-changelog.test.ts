import { describe, expect, it } from "vitest";

import { parseChangelog } from "./parse-changelog";
import { bumpOf, daysBetween } from "./release-facts";

const SAMPLE = `# Changelog

UpTab adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [V2.0.0] — 2026-10-22

### ✨ Added

- Pick your backgrounds. Press <kbd>B</kbd> to manage themes.
  - Browse photos with <kbd>←</kbd>.
  - Upload your own!  
- Weather for other locations.

### ♻️ Changed

- A 97% smaller download.

## [V1.0.1] — 2023-12-10

### 🧹 Removed

- The CTRL+U command.

### 🐛 Fixed

- Fix a stale cache
  that wraps onto a second line.

[V1.0.1]: https://github.com/AJGeel/uptab/compare/v1.0.0...v1.0.1
`;

describe("parseChangelog", () => {
  const [latest, older] = parseChangelog(SAMPLE);

  it("reads versions and dates, newest first", () => {
    expect([latest.version, latest.date]).toEqual(["2.0.0", "2026-10-22"]);
    expect([older.version, older.date]).toEqual(["1.0.1", "2023-12-10"]);
  });

  it("sorts bullets under their section", () => {
    expect(latest.items.map(({ kind, text }) => [kind, text])).toEqual([
      ["added", "Pick your backgrounds. Press <kbd>B</kbd> to manage themes."],
      ["added", "Weather for other locations."],
      ["changed", "A 97% smaller download."],
    ]);
  });

  it("keeps nested bullets as details", () => {
    expect(latest.items[0].details).toEqual(["Browse photos with <kbd>←</kbd>.", "Upload your own!"]);
  });

  it("counts other sections as changes, and joins wrapped lines", () => {
    expect(older.items.map(({ kind, text }) => [kind, text])).toEqual([
      ["changed", "The CTRL+U command."],
      ["fixed", "Fix a stale cache that wraps onto a second line."],
    ]);
  });

  it("ignores the link references at the bottom", () => {
    expect(older.items).toHaveLength(2);
  });
});

describe("release facts", () => {
  it("names the kind of bump", () => {
    expect([bumpOf("2.0.0"), bumpOf("1.4.0"), bumpOf("1.5.1")]).toEqual(["major", "minor", "patch"]);
  });

  it("counts days between dates", () => {
    expect(daysBetween("2026-10-16", "2026-10-17")).toBe(1);
    expect(daysBetween("2026-09-04", "2026-10-16")).toBe(42);
  });
});
