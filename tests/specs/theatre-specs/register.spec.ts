import { test, expect } from '../../pageObjects/pageFixture';

test.describe(
  'THEATRE - Register',
  { tag: '@theatre-register' },
  () => {
    test.beforeEach(async ({ theatreRegisterPage }) => {
      await theatreRegisterPage.open();
    });

    test('THR-REG-01 - Register a new theatre partner account with valid info', async ({
      theatreRegisterPage,
    }) => {
      const timestamp = Date.now();

      const theatreName = `QA Cinema ${timestamp}`;
      const email = `qa_theatre_${timestamp}@example.com`;

      await theatreRegisterPage.register({
        name: theatreName,
        email,
        password: 'Abc@1234',
        city: 'Mumbai',
        phone: '0912345678',
        address: '123 QA Street',
      });

      await theatreRegisterPage.page.waitForTimeout(2000);

      console.log('URL:', theatreRegisterPage.page.url());
      console.log(
        'BODY:',
        await theatreRegisterPage.page.locator('body').innerText()
      );
    });
    test('THR-REG-02 - Register with an email already used by another theatre', async ({
      theatreRegisterPage,
    }) => {
      await theatreRegisterPage.register({
        name: `Duplicate Cinema ${Date.now()}`,
        email: process.env.TB_THEATRE_EMAIL!,
        password: 'Abc@1234',
        city: 'Mumbai',
        phone: '0912345678',
        address: '123 QA Street',
      });

      await expect(
        theatreRegisterPage.error_emailInUse
      ).toBeVisible();
    });

    test('THR-REG-03 - Submit registration with required fields missing', async ({
      theatreRegisterPage,
    }) => {
      await expect(
        theatreRegisterPage.txt_theatreName
      ).toHaveAttribute('required', '');

      await expect(
        theatreRegisterPage.txt_email
      ).toHaveAttribute('required', '');

      await expect(
        theatreRegisterPage.txt_password
      ).toHaveAttribute('required', '');

      await theatreRegisterPage.btn_register.click();

      await expect(
        theatreRegisterPage.txt_theatreName
      ).toBeFocused();
    });

    test.skip('THR-REG-04 - Newly registered theatre cannot access admin features until approved', async ({
      loginPage,
      theatreOverviewPage,
    }) => {
      await loginPage.login(
        'REPLACE-WITH-PENDING-THEATRE-EMAIL',
        'REPLACE-WITH-PASSWORD'
      );

      await theatreOverviewPage.open();

      await expect(
        theatreOverviewPage.page.getByText(
          /pending approval/i
        )
      ).toBeVisible();
    });
  }
);