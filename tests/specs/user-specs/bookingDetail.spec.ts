import { test, expect } from '../../pageObjects/pageFixture';

test.describe('USER - Booking Detail', { tag: '@booking-detail' }, () => {
  test.beforeEach(async ({ loginPage, bookingHistoryPage }) => {
    await loginPage.loginAsUser();
    await bookingHistoryPage.open();
  });

  test('USR-DETAIL-01 - Booking detail shows complete information', async ({
    bookingHistoryPage,
    bookingDetailPage,
  }) => {
    await expect(bookingHistoryPage.bookingRows.first()).toBeVisible();

    await bookingHistoryPage.openFirstBooking();

    await expect(bookingDetailPage.movieTitle).toBeVisible();
    await expect(bookingDetailPage.bookingCode).toBeVisible();
    await expect(bookingDetailPage.showTime).toBeVisible();
    await expect(bookingDetailPage.showDate).toBeVisible();
    await expect(bookingDetailPage.screen).toBeVisible();
    await expect(bookingDetailPage.seatsInfo).toBeVisible();
    await expect(bookingDetailPage.totalPaid).toBeVisible();
    await expect(bookingDetailPage.qrCode).toBeVisible();
  });

  test('USR-DETAIL-05 - Direct URL access to another user\'s booking detail is blocked', async ({
    page,
    bookingDetailPage,
  }) => {
    await page.goto(
      `${bookingDetailPage.baseUrl}/booking/00000000-non-existent`
    );

    await expect(bookingDetailPage.error_accessDenied).toBeVisible();
  });
});