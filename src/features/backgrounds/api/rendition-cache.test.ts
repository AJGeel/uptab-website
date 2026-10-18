import { mkdtemp, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it, vi } from "vitest";

import { createRenditionCache } from "./rendition-cache";

const tempDir = () => mkdtemp(path.join(tmpdir(), "uptab-cache-"));

describe("createRenditionCache", () => {
  it("creates on a miss and reuses on the next build", async () => {
    const dir = await tempDir();
    const create = vi.fn(() => Promise.resolve(Buffer.from("webp")));

    const first = await createRenditionCache("v1", dir);
    expect(await first.remember(["photo", 1920], create)).toEqual({ data: Buffer.from("webp"), hit: false });

    const second = await createRenditionCache("v1", dir);
    expect(await second.remember(["photo", 1920], create)).toEqual({ data: Buffer.from("webp"), hit: true });

    expect(create).toHaveBeenCalledTimes(1);
  });

  it("misses when the version changes", async () => {
    const dir = await tempDir();
    const create = vi.fn(() => Promise.resolve(Buffer.from("webp")));

    await (await createRenditionCache("v1", dir)).remember(["photo", 1920], create);
    await (await createRenditionCache("v2", dir)).remember(["photo", 1920], create);

    expect(create).toHaveBeenCalledTimes(2);
  });

  it("prunes entries the build didn't use", async () => {
    const dir = await tempDir();
    const create = () => Promise.resolve(Buffer.from("webp"));

    const first = await createRenditionCache("v1", dir);
    await first.remember(["kept"], create);
    await first.remember(["removed"], create);

    const second = await createRenditionCache("v1", dir);
    await second.remember(["kept"], create);

    expect(await second.prune()).toBe(1);
    expect(await readdir(dir)).toHaveLength(1);
  });
});
