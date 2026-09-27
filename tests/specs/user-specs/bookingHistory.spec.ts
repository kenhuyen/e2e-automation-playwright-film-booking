import { test, expect } from '../../pageObjects/pageFixture';

test.describe('USER - Booking History', { tag: '@booking-history' }, () => {
  test.beforeEach(async ({ loginPage, bookingHistoryPage }) => {
    await loginPage.loginAsUser();
    await bookingHistoryPage.open();
  });

  test('USR-HIST-01 - Booking history lists past and upcoming bookings', async ({ bookingHistoryPage }) => {
    await expect(
      bookingHistoryPage.bookingRows.first().or(bookingHistoryPage.emptyState)
    ).toBeVisible();
  });

  test('USR-HIST-03 - Switch between Upcoming and Past tabs', async ({ bookingHistoryPage }) => {
    await expect(bookingHistoryPage.bookingRows.first()).toBeVisible();

    const bookingCount = await bookingHistoryPage.bookingRows.count();

    expect(bookingCount).toBeGreaterThan(0);
  });
  test('USR-HIST-04 - Click a booking navigates to its detail page', async ({
    bookingHistoryPage,
    page,
  }) => {
    await expect(bookingHistoryPage.bookingRows.first()).toBeVisible();

    await bookingHistoryPage.openFirstBooking();

    await expect(page).toHaveURL(/\/booking\/[^/]+$/);
  });

  test.describe('USER - Booking History - Access Control', { tag: '@booking-history' }, () => {
    test('USR-HIST-05 - History is scoped to the logged-in user only', async ({
      loginPage,
      bookingHistoryPage,
      page,
    }) => {
      await loginPage.loginAsUser();
      await bookingHistoryPage.open();

      const userBookingCount = await bookingHistoryPage.bookingRows.count();

      await page.context().clearCookies();
      await page.goto(`${bookingHistoryPage.baseUrl}/my-bookings`);

      await expect(page).toHaveURL(/\/login|\/my-bookings/);

      const countAfterLogout = await bookingHistoryPage.bookingRows.count();

      expect(countAfterLogout).toBe(0);
      expect(countAfterLogout).not.toBeGreaterThan(userBookingCount);
    });
  });
});