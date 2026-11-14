import { Page, Locator, expect } from '@playwright/test';

const TIMEOUT = 15_000;

export default class InputFormPage {
  readonly page: Page;

  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly companyInput: Locator;
  readonly websiteInput: Locator;
  readonly countryDropdown: Locator;
  readonly cityInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly stateInput: Locator;
  readonly zipInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.nameInput = page.getByRole('textbox', { name: 'Name' });
    this.emailInput = page.getByRole('textbox', { name: 'Email*' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password*' });
    this.companyInput = page.getByRole('textbox', { name: 'Company' });
    this.websiteInput = page.getByRole('textbox', { name: 'Website' });
    this.countryDropdown = page.getByRole('combobox');
    this.cityInput = page.getByRole('textbox', { name: 'City', exact: true });
    this.address1Input = page.getByRole('textbox', { name: 'Address 1' });
    this.address2Input = page.getByRole('textbox', { name: 'Address 2' });
    this.stateInput = page.getByRole('textbox', { name: 'State*' });
    this.zipInput = page.getByRole('textbox', { name: 'Zip Code*' });

    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.successMessage = page.locator('.success-msg');
  }

  /** Opens the Selenium Playground home page. */
  async open() {
    await this.page.goto('');
  }

  async navigateToInputFormDemo() {
    await this.page.getByRole('link', { name: 'Input Form Submit' }).click();
  }

  async submitForm() {
    await this.submitButton.click();
  }

  /**
   * Confirms the browser blocked submission because the required Name field is empty.
   * Browsers show their own text for this (e.g. "Please fill out this field."), so we
   * check the field's validity state rather than matching one exact sentence.
   */
  async validateRequiredFieldMessage() {
    const state = await this.nameInput.evaluate((el) => {
      const input = el as HTMLInputElement;
      return { valueMissing: input.validity.valueMissing, message: input.validationMessage };
    });
    expect(state.valueMissing).toBe(true);
    expect(state.message.length).toBeGreaterThan(0);
  }

  async validateSuccessMessage(expectedMessage: string) {
    await expect(this.successMessage).toBeVisible({ timeout: TIMEOUT });
    await expect(this.successMessage).toHaveText(expectedMessage, { timeout: TIMEOUT });
  }

  async fillRequiredFields(data: {
    name: string;
    email: string;
    password: string;
    company: string;
    website: string;
    city: string;
    address1: string;
    address2: string;
    state: string;
    zip: string;
  }) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.companyInput.fill(data.company);
    await this.websiteInput.fill(data.website);
    await this.cityInput.fill(data.city);
    await this.address1Input.fill(data.address1);
    await this.address2Input.fill(data.address2);
    await this.stateInput.fill(data.state);
    await this.zipInput.fill(data.zip);
  }

  async selectCountryByText(countryName: string) {
    await this.countryDropdown.selectOption({ label: countryName });
  }
}
