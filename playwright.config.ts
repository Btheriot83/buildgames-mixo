import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 120_000,
  webServer: {
    command: "npm run build && npm run start -- -p 3010",
    url: "http://127.0.0.1:3010",
    reuseExistingServer: true,
    timeout: 300_000,
  },
  use: {
    baseURL: "http://127.0.0.1:3010",
    headless: true,
  },
});
