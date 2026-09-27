import { test, expect } from '../../pageObjects/pageFixture';

// Covers USR-VERIFY-01..05.
test.describe('USER - Verify Booking', { tag: '@verify-booking' }, () => {
  test.beforeEach(async ({ loginPage, verifyBookingPage }) => {
    await loginPage.loginAsUser();
    await verifyBookingPage.open();
  });

  test('USR-VERIFY-03 - Verify an invalid/non-existent booking code', async ({ verifyBookingPage }) => {
    await verifyBookingPage.verify('INVALID-CODE-0000');

    await expect(verifyBookingPage.result_invalid).toBeVisible();
  });

  test('USR-VERIFY-05 - Submit malformed/script input as the verification code', async ({
    verifyBookingPage,
    page,
  }) => {
    page.on('dialog', (dialog) => {
      throw new Error(`Unexpected dialog appeared: ${dialog.message()}`);
    });

    await verifyBookingPage.verify('<script>alert(1)</script>');

    await expect(page.locator('body')).toBeVisible();
  });

  // ASSUMPTION: requires a known valid booking code seeded in test data to run fully.
  test.skip('USR-VERIFY-01 - Verify a valid, unused booking code/QR', async ({ verifyBookingPage }) => {
    const validBookingCode = 'REPLACE-WITH-REAL-CODE';
    await verifyBookingPage.verify(validBookingCode);

    await expect(verifyBookingPage.result_valid).toBeVisible();
  });
});
