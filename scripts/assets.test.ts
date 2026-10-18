import { mkdir, mkdtemp, readdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { writeFileAtomically } from "./assets";

const tempDir = () => mkdtemp(path.join(tmpdir(), "uptab-assets-"));

describe("writeFileAtomically", () => {
  it("replaces the file and leaves no temp file behind", async () => {
    const dir = await tempDir();
    const file = path.join(dir, "backgrounds.json");

    await writeFile(file, "old");
    await writeFileAtomically(file, "new");

    expect(await readFile(file, "utf8")).toBe("new");
    expect(await readdir(dir)).toEqual(["backgrounds.json"]);
  });

  it("cleans up the temp file when replacing fails", async () => {
    const dir = await tempDir();
    // A directory can't be replaced by a file, so the rename fails
    const file = path.join(dir, "backgrounds.json");

    await mkdir(file);

    await expect(writeFileAtomically(file, "new")).rejects.toThrow();
    expect(await readdir(dir)).toEqual(["backgrounds.json"]);
  });
});
