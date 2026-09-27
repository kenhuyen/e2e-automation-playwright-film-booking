import { test, expect } from '../../../pageObjects/pageFixture';

// 1:1 mapping of every "Automated: Yes" row from the "Login-Register" sheet.
// Left out (Automated = No): AUTH-13 (SQLi/XSS security), AUTH-14 (rate limiting/lockout).
test.describe('Register', { tag: '@login-register-tc' }, () => {
  test.beforeEach(async ({ registerPage }) => {
    await registerPage.open();
  });

  test('AUTH-01 - Register a new account with valid information', async ({ registerPage, page }) => {
    const uniqueEmail = `qa_${Date.now()}@example.com`;
    await registerPage.register('QA Automation', uniqueEmail, 'Abc@1234');

    await expect(page).not.toHaveURL(/register/);
  });

  test('AUTH-02 - Register with an email already in use', async ({ registerPage }) => {
    await registerPage.register('Existing User', process.env.TB_USER_EMAIL!, 'Abc@1234');

    await expect(registerPage.error_emailInUse).toBeVisible();
  });

  test('AUTH-03 - Register with a weak password', async ({ registerPage }) => {
    const uniqueEmail = `qa_${Date.now()}@example.com`;
    await registerPage.register('QA Weak Pwd', uniqueEmail, '123');

    await expect(registerPage.error_weakPassword).toBeVisible();
  });

  test('AUTH-04 - Password and confirm-password fields do not match', async ({ registerPage }) => {
    const uniqueEmail = `qa_${Date.now()}@example.com`;
    await registerPage.register('QA Mismatch', uniqueEmail, 'Abc@1234', 'Abc@4321');

    await expect(registerPage.error_passwordMismatch).toBeVisible();
  });

  test('AUTH-05 - Leave required registration fields empty', async ({ registerPage }) => {
    await registerPage.btn_register.click();

    const validationMessage = await registerPage.txt_email.evaluate(
      (el) => (el as HTMLInputElement).validationMessage,
    );
    expect(validationMessage).not.toBe('');
  });
});

test.describe('Login', { tag: '@login-register-tc' }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('AUTH-06 - Log in with correct credentials', async ({ loginPage, page }) => {
    await loginPage.login(process.env.TB_USER_EMAIL!, process.env.TB_USER_PASSWORD!);

    await expect(page).not.toHaveURL(/login/);
  });

  test('AUTH-07 - Log in with an incorrect password', async ({ loginPage }) => {
    await loginPage.login(process.env.TB_USER_EMAIL!, 'WrongPassword!123');

    await expect(loginPage.error_invalidCredentials).toBeVisible();
  });

  test('AUTH-08 - Log in with a non-existent account', async ({ loginPage }) => {
    await loginPage.login('notexist@example.com', 'SomePassword!123');

    await expect(loginPage.error_invalidCredentials).toBeVisible();
  });

  test('AUTH-09 - Leave username or password field empty when logging in', async ({ loginPage }) => {
    await loginPage.txt_email.fill(process.env.TB_USER_EMAIL!);
    await loginPage.btn_login.click();

    const validationMessage = await loginPage.txt_password.evaluate(
      (el) => (el as HTMLInputElement).validationMessage,
    );
    expect(validationMessage).not.toBe('');
  });

  test('AUTH-10 - Use the Forgot Password feature (if available)', async ({ loginPage, page }) => {
    const hasLink = await loginPage.link_forgotPassword.isVisible().catch(() => false);
    test.skip(!hasLink, 'No Forgot Password link present on this build');

    await loginPage.link_forgotPassword.click();
    await expect(page).toHaveURL(/forgot|reset/i);
  });

  test('AUTH-11 - Verify the show/hide password icon', async ({ loginPage }) => {
    const hasToggle = await loginPage.btn_togglePasswordVisibility.isVisible().catch(() => false);
    test.skip(!hasToggle, 'No show/hide password toggle present on this build');

    await loginPage.txt_password.fill('SomePassword123');
    await expect(loginPage.txt_password).toHaveAttribute('type', 'password');

    await loginPage.btn_togglePasswordVisibility.click();
    await expect(loginPage.txt_password).toHaveAttribute('type', 'text');
  });

  test('AUTH-12 - Log out of the account', async ({ loginPage, homePage, page }) => {
    await loginPage.login(process.env.TB_USER_EMAIL!, process.env.TB_USER_PASSWORD!);
    await homePage.open();

    await homePage.logout();

    await expect(homePage.loginButton.or(page.getByText(/login/i))).toBeVisible();
  });

  test('AUTH-15 - Verify login/register form on mobile viewport', async ({ loginPage, page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await loginPage.open();

    await expect(loginPage.txt_email).toBeVisible();
    await expect(loginPage.btn_login).toBeVisible();
  });
});
