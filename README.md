# Playwright 101 Assignment: TestMu AI Selenium Playground

Automated tests (Playwright + TypeScript) for three scenarios on the TestMu AI Selenium Playground
(https://www.testmuai.com/selenium-playground/). Each scenario runs in parallel on two browser/OS
combinations on the TestMu AI cloud:

| Project | Browser | OS |
|---|---|---|
| `pw-firefox:latest:macOS Sonoma@lambdatest` | Firefox (Playwright) | macOS Sonoma |
| `chrome:latest:Windows 11@lambdatest` | Chrome | Windows 11 |

## Project structure

```
fixtures/index.ts                     Cloud/local browser setup + desired capabilities
pages/simpleFormPage.ts               Page object: Simple Form Demo
pages/dragDropRangeSlidersPage.ts     Page object: Drag & Drop Sliders
pages/inputFormPage.ts                Page object: Input Form Submit
tests/simple-form-demo.spec.ts        Test Scenario 1
tests/drag-slider.spec.ts             Test Scenario 2
tests/input-form-submit.spec.ts       Test Scenario 3
playwright.config.ts                  Projects, baseURL, reporters
```

Locators used (at least 3 different types, as the assignment requires): `getByRole` with
link/textbox/button/combobox names, the CSS `#id` selectors (`#message`, `#slider3`), attribute
selectors (`input[type="range"]`), and `.success-msg` class selectors.

## Setup

1. Install Node.js 18 or newer (https://nodejs.org).
2. Install the dependencies:
   ```
   npm install
   npx playwright install --with-deps
   ```
3. Create your credentials file: copy `.env.example` to `.env` and fill in your TestMu AI
   username and access key (found in the TestMu AI dashboard under Account / Settings):
   ```
   LT_USERNAME=your_email_or_username
   LT_ACCESS_KEY=your_access_key
   ```
   `.env` is git-ignored. Never commit it.

## Running the tests

**Cloud run (required for submission), runs in parallel on both browser/OS combinations:**
```
npm run test:lt
```

**Local run (optional, opens a visible Chromium window):**
```
npm test
```

**List tests without running them:**
```
npx playwright test --list
```

## Reports and evidence

- HTML report: `npm run report` (or open `playwright-report/index.html`)
- JSON report: `jsonReports/jsonReport.json`
- Screenshots, videos and traces are recorded for every run.
- On the cloud, network logs, video, console logs and screenshots are enabled through the
  desired capabilities in `fixtures/index.ts`.

Each cloud session appears in the TestMu AI dashboard under Automation > Builds. Copy the
Session ID of each of the 6 cloud sessions (3 tests × 2 browser/OS combinations) for your submission.
