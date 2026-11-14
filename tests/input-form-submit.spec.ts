import { test, expect } from '../fixtures/index';

test('Input Form Test Scenario', async ({ inputForm }) => {
  // 1. Open TestMu AI's Selenium Playground
  await inputForm.open();

  // Click "Input Form Submit"
  await inputForm.navigateToInputFormDemo();

  // 2. Click "Submit" without filling in any information
  await inputForm.submitForm();

  // 3. Assert the required-field error (browser validation on the Name field)
  await inputForm.validateRequiredFieldMessage();

  const formData = {
    name: 'Test User',
    email: 'test.user@example.com',
    password: 'password123',
    company: 'Test Company Ltd.',
    website: 'https://example.com',
    city: 'Testville',
    address1: '123 Test Street',
    address2: 'Apt 4B',
    state: 'Testland',
    zip: 'T3S T1N',
  };

  // 4. Fill in Name, Email and other fields
  await inputForm.fillRequiredFields(formData);

  // 5. Select "United States" from the Country drop-down using the text (label)
  await inputForm.selectCountryByText('United States');

  // 6. Click "Submit" once everything is filled in
  await inputForm.submitForm();

  // 7. Validate the success message
  await inputForm.validateSuccessMessage(
    'Thanks for contacting us, we will get back to you shortly.',
  );
});
