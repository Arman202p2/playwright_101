import { Page, Locator, expect } from '@playwright/test';

export default class SimpleFormPage {
  readonly page: Page;
  readonly messageInput: Locator;
  readonly getCheckedValueButton: Locator;
  readonly yourMessageOutput: Locator;

  constructor(page: Page) {
    this.page = page;
    // Locator 1: role + accessible name (link)
    // Locator 2: role + placeholder-based name (textbox)
    // Locator 3: role + name (button)
    // Locator 4: CSS id (output panel)
    this.messageInput = page.getByRole('textbox', { name: 'Please enter your Message' });
    this.getCheckedValueButton = page.getByRole('button', { name: 'Get Checked Value' });
    this.yourMessageOutput = page.locator('#message');
  }

  /** Opens the Selenium Playground home page (baseURL from playwright.config.ts). */
  async open() {
    await this.page.goto('');
  }

  async clickSimpleFormDemo() {
    await this.page.getByRole('link', { name: 'Simple Form Demo' }).click();
  }

  async enterMessage(message: string) {
    await this.messageInput.fill(message);
  }

  /** Confirms the text is actually in the box before clicking, so the click never races the fill. */
  async clickGetCheckedValue() {
    await expect(this.messageInput).toHaveValue(/.+/, { timeout: 15_000 });
    await this.getCheckedValueButton.click();

    // The demo sometimes ignores the first click on a busy page; if the output
    // is still empty after a few seconds, click once more.
    const shown = await this.yourMessageOutput
      .waitFor({ state: 'visible', timeout: 5_000 })
      .then(() => this.yourMessageOutput.textContent())
      .catch(() => '');
    if (!shown) {
      await this.getCheckedValueButton.click();
    }
  }

  get messageLocator(): Locator {
    return this.yourMessageOutput;
  }
}
