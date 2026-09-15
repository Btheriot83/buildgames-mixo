import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Brief, Project, ProjectRow, Section, ThemeId } from "./types";
import { getSampleProject } from "./sample";
import type { AppDatabase } from "./db-types";
import { openSqlJsDatabase } from "./db-sqljs";

export type { AppDatabase, RunResult, Statement } from "./db-types";

const globalForDb = globalThis as unknown as {
  __mixoDb?: AppDatabase;
  __mixoDbInit?: Promise<AppDatabase>;
  __mixoBackend?: "better-sqlite3" | "sql.js";
};

function dataDir(): string {
  if (process.env.MIXO_DATA_DIR) {
    return path.isAbsolute(process.env.MIXO_DATA_DIR)
      ? process.env.MIXO_DATA_DIR
      : path.join(process.cwd(), process.env.MIXO_DATA_DIR);
  }
  // Vercel / serverless: only /tmp is writable
  if (process.env.VERCEL || process.env.USE_SQLJS === "1") {
    return "/tmp";
  }
  return path.join(process.cwd(), "data");
}

function resolveDbPath(): string {
  return path.join(dataDir(), "mixo.sqlite");
}

function migrate(db: AppDatabase) {
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
}

function preferSqlJs(): boolean {
  if (process.env.USE_SQLJS === "1") return true;
  if (process.env.USE_BETTER_SQLITE3 === "1") return false;
  if (process.env.VERCEL) return true;
  return false;
}

function tryOpenBetterSqlite3(dbPath: string): AppDatabase | null {
  try {
    // Dynamic require so Vercel/webpack does not hard-fail on the native addon.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require("better-sqlite3") as typeof import("better-sqlite3");
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    const db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    migrate(db as unknown as AppDatabase);
    seedIfEmpty(db as unknown as AppDatabase);
    return db as unknown as AppDatabase;
  } catch (err) {
    console.warn(
      "[mixo] better-sqlite3 unavailable, falling back to sql.js:",
      err instanceof Error ? err.message : err
    );
    return null;
  }
}

async function openDatabase(): Promise<AppDatabase> {
  const dbPath = resolveDbPath();

  if (!preferSqlJs()) {
    const native = tryOpenBetterSqlite3(dbPath);
    if (native) {
      globalForDb.__mixoBackend = "better-sqlite3";
      return native;
    }
  }

  globalForDb.__mixoBackend = "sql.js";
  const db = await openSqlJsDatabase({ filePath: dbPath });
  migrate(db);
  seedIfEmpty(db);
  return db;
}

/**
 * Ensure the database is ready. Call from API routes / RSC pages before CRUD.
 * Safe to call repeatedly — caches on globalThis across hot reloads / warm lambdas.
 */
export async function initDb(): Promise<AppDatabase> {
  if (globalForDb.__mixoDb) {
    return globalForDb.__mixoDb;
  }
  if (!globalForDb.__mixoDbInit) {
    globalForDb.__mixoDbInit = openDatabase()
      .then((db) => {
        globalForDb.__mixoDb = db;
        return db;
      })
      .catch((err) => {
        globalForDb.__mixoDbInit = undefined;
        throw err;
      });
  }
  return globalForDb.__mixoDbInit;
}

/** Sync accessor — only valid after await initDb() (or local better-sqlite3). */
export function getDb(): AppDatabase {
  if (globalForDb.__mixoDb) {
    return globalForDb.__mixoDb;
  }
  // Local DX: open better-sqlite3 synchronously when possible.
  if (!preferSqlJs()) {
    const native = tryOpenBetterSqlite3(resolveDbPath());
    if (native) {
      globalForDb.__mixoDb = native;
      globalForDb.__mixoBackend = "better-sqlite3";
      return native;
    }
  }
  throw new Error(
    "Database not initialized. Call `await initDb()` first (required on Vercel / sql.js)."
  );
}

export function getDbPath(): string {
  return resolveDbPath();
}

export function getDbBackend(): "better-sqlite3" | "sql.js" | "unknown" {
  return globalForDb.__mixoBackend ?? "unknown";
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

function seedIfEmpty(db: AppDatabase) {
  const count = db.prepare("SELECT COUNT(*) as c FROM projects").get() as {
    c: number;
  };
  if (count.c > 0) return;
  const sample = getSampleProject();
  db.prepare(
    `INSERT INTO projects (id, title, brief_json, sections_json, theme, is_sample, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    sample.id,
    sample.title,
    JSON.stringify(sample.brief),
    JSON.stringify(sample.sections),
    sample.theme,
    1,
    sample.createdAt,
    sample.updatedAt
  );
}

export function listProjects(db?: AppDatabase): Project[] {
  const rows = (db ?? getDb())
    .prepare("SELECT * FROM projects ORDER BY updated_at DESC")
    .all() as ProjectRow[];
  return rows.map(rowToProject);
}

export function getProject(id: string, db?: AppDatabase): Project | null {
  const row = (db ?? getDb())
    .prepare("SELECT * FROM projects WHERE id = ?")
    .get(id) as ProjectRow | undefined;
  return row ? rowToProject(row) : null;
}

export function createProject(
  input: {
    title: string;
    brief: Brief;
    sections: Section[];
    theme?: ThemeId;
    isSample?: boolean;
  },
  db?: AppDatabase
): Project {
  const conn = db ?? getDb();
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
  conn
    .prepare(
      `INSERT INTO projects (id, title, brief_json, sections_json, theme, is_sample, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      project.id,
      project.title,
      JSON.stringify(project.brief),
      JSON.stringify(project.sections),
      project.theme,
      project.isSample ? 1 : 0,
      project.createdAt,
      project.updatedAt
    );
  return project;
}

export function updateProject(
  id: string,
  patch: Partial<Pick<Project, "title" | "brief" | "sections" | "theme">>,
  db?: AppDatabase
): Project | null {
  const conn = db ?? getDb();
  const existing = getProject(id, conn);
  if (!existing) return null;
  const updated: Project = {
    ...existing,
    title: patch.title ?? existing.title,
    brief: patch.brief ?? existing.brief,
    sections: patch.sections ?? existing.sections,
    theme: patch.theme ?? existing.theme,
    updatedAt: new Date().toISOString(),
  };
  conn
    .prepare(
      `UPDATE projects SET title=?, brief_json=?, sections_json=?, theme=?, updated_at=? WHERE id=?`
    )
    .run(
      updated.title,
      JSON.stringify(updated.brief),
      JSON.stringify(updated.sections),
      updated.theme,
      updated.updatedAt,
      id
    );
  return updated;
}

export function deleteProject(id: string, db?: AppDatabase): boolean {
  const result = (db ?? getDb())
    .prepare("DELETE FROM projects WHERE id = ?")
    .run(id);
  return result.changes > 0;
}

/** Test helper: clear cached connection and point at a fresh data dir. */
export function resetDbForTests(filePath: string) {
  globalForDb.__mixoDb = undefined;
  globalForDb.__mixoDbInit = undefined;
  globalForDb.__mixoBackend = undefined;
  process.env.MIXO_DATA_DIR = path.dirname(filePath);
  process.env.USE_SQLJS = undefined;
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

/** Async in-memory sql.js DB for environments without better-sqlite3. */
export async function createMemoryDbAsync(): Promise<AppDatabase> {
  const db = await openSqlJsDatabase({ filePath: null, memory: true });
  migrate(db);
  return db;
}
