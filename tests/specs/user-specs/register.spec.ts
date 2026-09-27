import { test, expect } from '../../pageObjects/pageFixture';

test.describe('USER - Register', { tag: '@register' }, () => {
  test.beforeEach(async ({ registerPage }) => {
    await registerPage.open();
  });

  test('USR-REG-01 - Register with fully valid information', async ({ registerPage, page }) => {
    const uniqueEmail = `qa_${Date.now()}@example.com`;

    await registerPage.register('QA Automation', uniqueEmail, 'Abc@1234');

    await expect(page).not.toHaveURL(/register/);
  });

  test('USR-REG-02 - Register with an email already registered', async ({ registerPage }) => {
    await registerPage.register('Existing User', process.env.TB_USER_EMAIL!, 'Abc@1234');

    await expect(registerPage.error_emailInUse).toBeVisible();
  });

  test('USR-REG-03 - Register with a weak password', async ({ registerPage }) => {
    const uniqueEmail = `qa_${Date.now()}@example.com`;

    await registerPage.register('QA Weak Pwd', uniqueEmail, '123');

    await expect(registerPage.error_weakPassword).toBeVisible();
  });

  test('USR-REG-04 - Password and confirm-password mismatch', async () => {
    test.skip(true, 'Register form does not contain Confirm Password field');
  });

  test('USR-REG-05 - Submit with required fields left empty', async ({ registerPage }) => {
    await registerPage.btn_register.click();

    const validationMessage = await registerPage.txt_email.evaluate(
      (el) => (el as HTMLInputElement).validationMessage,
    );

    expect(validationMessage).not.toBe('');
  });
});