import { defineConfig, devices } from '@playwright/test';

// Lokal (dieses Environment) kann ein vorinstalliertes Chromium über
// PW_EXECUTABLE_PATH verwendet werden; in GitHub CI liefert `playwright install`
// den Browser (dann Variable nicht setzen).
const executablePath = process.env.PW_EXECUTABLE_PATH || undefined;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: executablePath ? { executablePath } : {},
      },
    },
  ],
  webServer: {
    command: 'pnpm build:ci && pnpm preview --port 4321',
    url: 'http://localhost:4321/',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
