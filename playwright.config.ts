import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["html", { open: "never" }]],

  use: {
    baseURL: "http://127.0.0.1:3006",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],

  webServer: {
    command: "npm run build && npm run start -- -p 3006",
    url: "http://127.0.0.1:3006",
    reuseExistingServer: false,
    timeout: 240_000,
  },
});
