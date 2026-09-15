import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Brief, Project, ProjectRow, Section, ThemeId } from "./types";
import { getSampleProject } from "./sample";

function dataDir() {
  return process.env.MIXO_DATA_DIR || path.join(process.cwd(), "data");
}
function dbPath() {
  return path.join(dataDir(), "mixo.sqlite");
}

let dbInstance: Database.Database | null = null;

function ensureDir() {
  const dir = dataDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getDb(): Database.Database {
  if (dbInstance) return dbInstance;
  ensureDir();
  const db = new Database(dbPath());
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      brief_json TEXT NOT NULL,
      sections_json TEXT NOT NULL,
      theme TEXT NOT NULL DEFAULT 'hot-metal',
      is_sample INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  dbInstance = db;
  seedIfEmpty(db);
  return db;
}

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    brief: JSON.parse(row.brief_json) as Brief,
    sections: JSON.parse(row.sections_json) as Section[],
    theme: row.theme as ThemeId,
    isSample: Boolean(row.is_sample),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function seedIfEmpty(db: Database.Database) {
  const count = db.prepare("SELECT COUNT(*) as c FROM projects").get() as {
    c: number;
  };
  if (count.c > 0) return;
  const sample = getSampleProject();
  db.prepare(
    `INSERT INTO projects (id, title, brief_json, sections_json, theme, is_sample, created_at, updated_at)
     VALUES (@id, @title, @brief_json, @sections_json, @theme, @is_sample, @created_at, @updated_at)`
  ).run({
    id: sample.id,
    title: sample.title,
    brief_json: JSON.stringify(sample.brief),
    sections_json: JSON.stringify(sample.sections),
    theme: sample.theme,
    is_sample: 1,
    created_at: sample.createdAt,
    updated_at: sample.updatedAt,
  });
}

export function listProjects(): Project[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM projects ORDER BY updated_at DESC")
    .all() as ProjectRow[];
  return rows.map(rowToProject);
}

export function getProject(id: string): Project | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM projects WHERE id = ?").get(id) as
    | ProjectRow
    | undefined;
  return row ? rowToProject(row) : null;
}

export function createProject(input: {
  title: string;
  brief: Brief;
  sections: Section[];
  theme?: ThemeId;
  isSample?: boolean;
}): Project {
  const db = getDb();
  const now = new Date().toISOString();
  const project: Project = {
    id: randomUUID(),
    title: input.title,
    brief: input.brief,
    sections: input.sections,
    theme: input.theme || "hot-metal",
    isSample: Boolean(input.isSample),
    createdAt: now,
    updatedAt: now,
  };
  db.prepare(
    `INSERT INTO projects (id, title, brief_json, sections_json, theme, is_sample, created_at, updated_at)
     VALUES (@id, @title, @brief_json, @sections_json, @theme, @is_sample, @created_at, @updated_at)`
  ).run({
    id: project.id,
    title: project.title,
    brief_json: JSON.stringify(project.brief),
    sections_json: JSON.stringify(project.sections),
    theme: project.theme,
    is_sample: project.isSample ? 1 : 0,
    created_at: project.createdAt,
    updated_at: project.updatedAt,
  });
  return project;
}

export function updateProject(
  id: string,
  patch: Partial<Pick<Project, "title" | "brief" | "sections" | "theme">>
): Project | null {
  const existing = getProject(id);
  if (!existing) return null;
  const updated: Project = {
    ...existing,
    title: patch.title ?? existing.title,
    brief: patch.brief ?? existing.brief,
    sections: patch.sections ?? existing.sections,
    theme: patch.theme ?? existing.theme,
    updatedAt: new Date().toISOString(),
  };
  getDb()
    .prepare(
      `UPDATE projects SET title=@title, brief_json=@brief_json, sections_json=@sections_json,
       theme=@theme, updated_at=@updated_at WHERE id=@id`
    )
    .run({
      id,
      title: updated.title,
      brief_json: JSON.stringify(updated.brief),
      sections_json: JSON.stringify(updated.sections),
      theme: updated.theme,
      updated_at: updated.updatedAt,
    });
  return updated;
}

export function deleteProject(id: string): boolean {
  const result = getDb().prepare("DELETE FROM projects WHERE id = ?").run(id);
  return result.changes > 0;
}

export function resetDbForTests(filePath: string) {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
  process.env.MIXO_DATA_DIR = path.dirname(filePath);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}
