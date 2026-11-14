import { test as base, chromium, expect } from '@playwright/test';
import path from 'path';
import 'dotenv/config';
import SimpleFormPage from '../pages/simpleFormPage';
import DragDropRangeSlidersPage from '../pages/dragDropRangeSlidersPage';
import InputFormPage from '../pages/inputFormPage';

type Pages = {
  simpleForm: SimpleFormPage;
  dragDropRangeSliders: DragDropRangeSlidersPage;
  inputForm: InputFormPage;
};

// Desired capabilities for the TestMu AI (LambdaTest) cloud.
// Network logs, video, console logs and screenshots are all enabled.
const buildCapabilities = (browserName: string, browserVersion: string, platform: string, testName: string) => ({
  browserName,                 // Chrome | MicrosoftEdge | pw-chromium | pw-firefox | pw-webkit
  browserVersion,
  'LT:Options': {
    platform,
    build: 'Playwright 101 Assignment',
    name: testName,
    user: process.env.LT_USERNAME,
    accessKey: process.env.LT_ACCESS_KEY,
    network: true,
    tunnel: false,
    video: true,
    console: true,
    screenshots: true,
  },
});

export const test = base.extend<Pages>({
  page: async ({}, use, testInfo) => {
    const fileName = testInfo.file.split(path.sep).pop();
    const isCloudRun = /lambdatest/.test(testInfo.project.name);

    if (isCloudRun) {
      if (!process.env.LT_USERNAME || !process.env.LT_ACCESS_KEY) {
        throw new Error('LT_USERNAME / LT_ACCESS_KEY missing. Create a .env file first (see README).');
      }

      // Project name format: "<browser>:<version>:<platform>@lambdatest"
      const [browserName, browserVersion, platform] = testInfo.project.name.split('@')[0].split(':');
      const capabilities = buildCapabilities(
        browserName,
        browserVersion,
        platform,
        `${testInfo.title} - ${fileName}`,
      );

      const browser = await chromium.connect(
        `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`,
      );
      const context = await browser.newContext({
        baseURL: testInfo.project.use.baseURL,
        viewport: testInfo.project.use.viewport,
      });
      const page = await context.newPage();

      await use(page);

      // Tell the TestMu AI dashboard whether this test passed or failed
      const testStatus = {
        action: 'setTestStatus',
        arguments: {
          status: testInfo.status,
          remark: testInfo.error?.stack || testInfo.error?.message || '',
        },
      };
      await page.evaluate(() => {}, `lambdatest_action: ${JSON.stringify(testStatus)}`);

      await page.close();
      await context.close();
      await browser.close();
    } else {
      // Local run: opens a visible Chromium window
      const browser = await chromium.launch({ headless: false });
      const context = await browser.newContext({ baseURL: testInfo.project.use.baseURL });
      const page = await context.newPage();

      await use(page);

      await page.close();
      await context.close();
      await browser.close();
    }
  },

  simpleForm: async ({ page }, use) => {
    await use(new SimpleFormPage(page));
  },
  dragDropRangeSliders: async ({ page }, use) => {
    await use(new DragDropRangeSlidersPage(page));
  },
  inputForm: async ({ page }, use) => {
    await use(new InputFormPage(page));
  },
});

export { expect };
