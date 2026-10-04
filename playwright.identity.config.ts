import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "identity.spec.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  use: { trace: "retain-on-failure" },
  projects: [
    { name: "identity-chromium", use: { ...devices["Desktop Chrome"] } },
    {
      name: "identity-mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
    { name: "identity-webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
