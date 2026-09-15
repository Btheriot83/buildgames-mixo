import { describe, expect, it } from "vitest";
import {
  createMemoryDbAsync,
  createProject,
  deleteProject,
  getProject,
  listProjects,
} from "../../src/lib/db";

describe("sql.js memory adapter", () => {
  it("supports project CRUD without better-sqlite3", async () => {
    const db = await createMemoryDbAsync();
    const created = createProject(
      {
        title: "SQLJS Co",
        brief: {
          productName: "SQLJS Co",
          tagline: "Pure JS",
          audience: "Serverless",
          tone: "Direct",
          offer: "Works on Vercel",
        },
        sections: [],
        theme: "hot-metal",
      },
      db
    );
    expect(getProject(created.id, db)?.title).toBe("SQLJS Co");
    expect(listProjects(db).some((p) => p.id === created.id)).toBe(true);
    expect(deleteProject(created.id, db)).toBe(true);
    expect(getProject(created.id, db)).toBeNull();
  });
});
