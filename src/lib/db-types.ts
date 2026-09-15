/** Minimal better-sqlite3-compatible surface used by Hot Metal Press (Mixo). */
export type RunResult = { changes: number };

export type Statement = {
  get(...params: unknown[]): unknown;
  all(...params: unknown[]): unknown[];
  run(...params: unknown[]): RunResult;
};

export type AppDatabase = {
  prepare(sql: string): Statement;
  exec(sql: string): void;
  pragma(source: string): unknown;
};
