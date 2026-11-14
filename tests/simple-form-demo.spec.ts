import { test, expect } from '../fixtures/index';

test('Simple Form Test Scenario', async ({ page, simpleForm }) => {
  // 1. Open TestMu AI's Selenium Playground
  await simpleForm.open();

  // 2. Click "Simple Form Demo"
  await simpleForm.clickSimpleFormDemo();

  // 3. Validate that the URL contains "simple-form-demo"
  await expect(page).toHaveURL(/simple-form-demo/, { timeout: 15_000 });

  // 4. Create a variable for a string value
  const message = 'Welcome to TestMu AI';

  // 5. Use the variable to enter values in the "Enter Message" text box
  await simpleForm.enterMessage(message);

  // 6. Click "Get Checked Value"
  await simpleForm.clickGetCheckedValue();

  // 7. Validate the same text is shown under "Your Message:"
  await expect(simpleForm.messageLocator).toHaveText(message, { timeout: 15_000 });
});
