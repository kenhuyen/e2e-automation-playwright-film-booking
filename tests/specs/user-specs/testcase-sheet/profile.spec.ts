import { test, expect } from '../../../pageObjects/pageFixture';

// 1:1 mapping of every "Automated: Yes" row from the "Profile" sheet.
// Left out (Automated = No): PROFILE-10 (access-control, needs a 2nd manual verification pass).
test.describe('Profile', { tag: '@profile-tc' }, () => {
  test.beforeEach(async ({ loginPage, profilePage }) => {
    await loginPage.loginAsUser();
    await profilePage.open();
  });

  test('PROFILE-01 - User\'s personal information is displayed correctly', async ({ profilePage }) => {
    await expect(profilePage.txt_name).toHaveValue(/.+/);
  });

  test('PROFILE-02 - Update profile info with valid data', async ({ profilePage }) => {
    await profilePage.updateName(`QA User ${Date.now()}`);

    await expect(profilePage.toast_success).toBeVisible();
  });

  test('PROFILE-03 - Update profile with invalid data', async ({ profilePage }) => {
    await profilePage.btn_edit.click();
    await profilePage.txt_phone.fill('abc');
    await profilePage.btn_save.click();

    await expect(profilePage.error_invalidPhone).toBeVisible();
  });

  test('PROFILE-04 - Change password with correct current password', async ({ profilePage }) => {
    await profilePage.changePassword(process.env.TB_USER_PASSWORD!, process.env.TB_USER_PASSWORD!);

    await expect(profilePage.toast_success).toBeVisible();
  });

  test('PROFILE-05 - Change password with wrong current password', async ({ profilePage }) => {
    await profilePage.changePassword('WrongCurrentPassword!', 'NewPass@123');

    await expect(profilePage.error_wrongCurrentPassword).toBeVisible();
  });

  test('PROFILE-06 - List of booked tickets is displayed', async ({ bookingHistoryPage }) => {
    await bookingHistoryPage.open();

    await expect(bookingHistoryPage.bookingRows.first().or(bookingHistoryPage.emptyState)).toBeVisible();
  });

  test('PROFILE-07 - View details of a booked ticket', async ({ bookingHistoryPage, bookingDetailPage }) => {
    await bookingHistoryPage.open();
    const count = await bookingHistoryPage.bookingRows.count();
    test.skip(count === 0, 'No booking history to open a detail page from');

    await bookingHistoryPage.openFirstBooking();

    await expect(bookingDetailPage.movieTitle).toBeVisible();
  });

  test('PROFILE-08 - Empty state is shown when there is no booking history', async ({ bookingHistoryPage }) => {
    await bookingHistoryPage.open();
    const count = await bookingHistoryPage.bookingRows.count();
    test.skip(count > 0, 'Current test account already has booking history — use a fresh account to hit the empty state');

    await expect(bookingHistoryPage.emptyState).toBeVisible();
  });

  test('PROFILE-09 - Cancel a booked ticket (if supported)', async ({ bookingHistoryPage, bookingDetailPage }) => {
    await bookingHistoryPage.open();
    const count = await bookingHistoryPage.bookingRows.count();
    test.skip(count === 0, 'No booking available to cancel');

    await bookingHistoryPage.openFirstBooking();
    const canCancel = await bookingDetailPage.btn_cancelBooking.isVisible().catch(() => false);
    test.skip(!canCancel, 'This booking is not eligible for cancellation');

    await bookingDetailPage.cancelBooking();

    await expect(bookingDetailPage.status_cancelled).toBeVisible();
  });

  test('PROFILE-11 - Verify profile page on mobile viewport', async ({ profilePage, page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await profilePage.open();

    await expect(profilePage.txt_name).toBeVisible();
  });
});
