import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: /(?:rich-text|media)\.spec\.ts/,
  timeout: 60_000,
  use: { baseURL: "http://localhost:3001", browserName: "chromium", channel: "msedge", headless: true },
  webServer: { command: "npm run preview:rich-text", url: "http://localhost:3001", reuseExistingServer: true, timeout: 120_000 },
});
