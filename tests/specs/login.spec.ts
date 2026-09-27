import { test, expect } from "../pageObjects/pageFixture";
import dotenv from "dotenv";

dotenv.config();

test.describe("Authentication - Login", { tag: "@login" }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test("TC01 - Login with empty Email and Password", async ({ loginPage }) => {
    await loginPage.btn_login.click();

    const validationMessage = await loginPage.txt_email.evaluate(
      (element) => (element as HTMLInputElement).validationMessage,
    );

    expect(validationMessage).toBe("Please fill out this field.");
  });

  test("TC02 - Login with empty Email", async ({ loginPage }) => {
    await loginPage.txt_password.fill("12345678");

    await loginPage.btn_login.click();

    const validationMessage = await loginPage.txt_email.evaluate(
      (element) => (element as HTMLInputElement).validationMessage,
    );

    expect(validationMessage).toBe("Please fill out this field.");
  });

  test("TC03 - Login with empty Password", async ({ loginPage }) => {
    await loginPage.txt_email.fill("test@gmail.com");

    await loginPage.btn_login.click();

    const validationMessage = await loginPage.txt_password.evaluate(
      (element) => (element as HTMLInputElement).validationMessage,
    );

    expect(validationMessage).toBe("Please fill out this field.");
  });

  test("TC04 - Login with wrong password", async ({ loginPage }) => {
    await loginPage.login(process.env.TB_USER_EMAIL!, "wrongPassword123");

    await expect(loginPage.error_invalidCredentials).toBeVisible();
  });
  test("TC05 - Login with wrong email", async ({ loginPage }) => {
    await loginPage.login(
      "wrongUser123@gmail.com",
      process.env.TB_USER_PASSWORD!,
    );

    await expect(loginPage.error_invalidCredentials).toBeVisible();
  });
  test("TC06 - Login with non-existent account", async ({ loginPage }) => {
    await loginPage.login("notexist@gmail.com", "random123");

    await expect(loginPage.error_invalidCredentials).toBeVisible();
  });
  test("TC07 - Login success", async ({ loginPage }) => {
    await loginPage.login(
      process.env.TB_USER_EMAIL!,
      process.env.TB_USER_PASSWORD!,
    );

    await expect(loginPage.page).not.toHaveURL(/login/);
  });
});

test.describe("Authorization - Role Permission", { tag: "@login" }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test("TC08 - Admin can access admin dashboard", async ({
    loginPage,
    page,
  }) => {
    await loginPage.login(
      process.env.TB_ADMIN_EMAIL!,
      process.env.TB_ADMIN_PASSWORD!,
    );

    await expect(page).not.toHaveURL(/login/);

    await page.goto(`${process.env.TB_BASE_URL_ADMIN}/dashboard`);

    await expect(page).toHaveURL(`${process.env.TB_BASE_URL_ADMIN}/dashboard`);
  });

  test("TC09 - Theater can access admin dashboard", async ({
    loginPage,
    page,
  }) => {
    await loginPage.login(
      process.env.TB_THEATRE_EMAIL!,
      process.env.TB_THEATRE_PASSWORD!,
    );

    await page.goto(`${process.env.TB_BASE_URL_THEATRE}/dashboard`);

    await expect(page).toHaveURL(
      `${process.env.TB_BASE_URL_THEATRE}/dashboard`,
    );
  });

  test("TC10 - User cannot access admin page", async ({ loginPage, page }) => {
    await loginPage.login(
      process.env.TB_USER_EMAIL!,
      process.env.TB_USER_PASSWORD!,
    );

    await page.goto(`${process.env.TB_BASE_URL_ADMIN}/dashboard`);

    await expect(page).not.toHaveURL(
      `${process.env.TB_BASE_URL_ADMIN}/dashboard`,
    );
  });
});
