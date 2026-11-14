import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  timeout: 120 * 1000,
  retries: 0,
  fullyParallel: true,

  projects: [
    {
      // Cloud run on TestMu AI (LambdaTest hub): Firefox on macOS Sonoma
      name: 'pw-firefox:latest:macOS Sonoma@lambdatest',
      use: { viewport: { width: 1920, height: 1080 } },
    },
    {
      // Cloud run on TestMu AI (LambdaTest hub): Chrome on Windows 11
      name: 'chrome:latest:Windows 11@lambdatest',
      use: { viewport: { width: 1280, height: 720 } },
    },
    {
      // Local run only (npm test)
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  use: {
    baseURL: 'https://www.testmuai.com/selenium-playground/',
    headless: true,
    screenshot: 'on',
    video: 'on',
    trace: 'on',
  },

  reporter: [
    ['list'],
    ['json', { outputFile: 'jsonReports/jsonReport.json' }],
    ['html', { open: 'never' }],
  ],
});
