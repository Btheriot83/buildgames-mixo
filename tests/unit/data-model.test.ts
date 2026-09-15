import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("data model + generate workflow", () => {
  let dataDir: string;
  let dbPath: string;

  beforeEach(async () => {
    dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "mixo-test-"));
    dbPath = path.join(dataDir, "mixo.sqlite");
    vi.resetModules();
    process.env.MIXO_DATA_DIR = dataDir;
    delete process.env.USE_SQLJS;
    delete process.env.VERCEL;
  });

  afterEach(() => {
    fs.rmSync(dataDir, { recursive: true, force: true });
  });

  it("seeds sample and CRUD projects", async () => {
    const db = await import("../../src/lib/db");
    db.resetDbForTests(dbPath);
    await db.initDb();
    const list = db.listProjects();
    expect(list.length).toBeGreaterThanOrEqual(1);
    expect(list[0].isSample).toBe(true);
    expect(list[0].title).toMatch(/SAMPLE/i);

    const created = db.createProject({
      title: "Test Co",
      brief: {
        productName: "Test Co",
        tagline: "Sharp pages",
        audience: "Builders",
        tone: "Direct",
        offer: "Export HTML",
      },
      sections: list[0].sections,
      theme: "hot-metal",
    });
    expect(created.id).toBeTruthy();
    const got = db.getProject(created.id);
    expect(got?.title).toBe("Test Co");

    const updated = db.updateProject(created.id, { title: "Test Co v2" });
    expect(updated?.title).toBe("Test Co v2");

    expect(db.deleteProject(created.id)).toBe(true);
    expect(db.getProject(created.id)).toBeNull();
  });

  it("generateLocal returns full section set", async () => {
    const { generateLocal } = await import("../../src/lib/generate");
    const result = generateLocal({
      productName: "Inkbound",
      tagline: "Pages with bite",
      audience: "Solo operators",
      tone: "Editorial wry",
      offer: "Brief to static export",
    });
    expect(result.mode).toBe("local");
    expect(result.sections.map((s) => s.type)).toEqual(
      expect.arrayContaining(["hero", "features", "cta", "footer"])
    );
    expect(result.theme).toMatch(/hot-metal|night-press|proof-sheet/);
  });
});
