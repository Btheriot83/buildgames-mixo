import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  // Native + WASM SQLite backends stay external to the server bundle.
  serverExternalPackages: ["better-sqlite3", "sql.js"],
  outputFileTracingIncludes: {
    "/*": ["./node_modules/sql.js/dist/sql-wasm.wasm"],
    "/**": ["./node_modules/sql.js/dist/sql-wasm.wasm"],
    "/api/**/*": ["./node_modules/sql.js/dist/sql-wasm.wasm"],
    "/projects/**/*": ["./node_modules/sql.js/dist/sql-wasm.wasm"],
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
