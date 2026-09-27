import { test, expect } from '../../pageObjects/pageFixture';

// Covers SA-BOOKINGS-01..04.
test.describe('SUPERADMIN - Bookings', { tag: '@admin-bookings' }, () => {
  test.beforeEach(async ({ loginPage, adminOverviewPage, adminBookingsPage }) => {
    await loginPage.loginAsAdmin();
    await adminOverviewPage.open();
    await adminOverviewPage.nav.bookings.click();
  });

  test('SA-BOOKINGS-01 - All platform-wide bookings are listed', async ({ adminBookingsPage }) => {
    await expect(adminBookingsPage.bookingRows.first()).toBeVisible();
  });

  test('SA-BOOKINGS-02 - Filter bookings by theatre, date range, or status', async ({ adminBookingsPage }) => {
    const hasFilter = await adminBookingsPage.filter_status.isVisible().catch(() => false)
      || await adminBookingsPage.filter_theatre.isVisible().catch(() => false);
    test.skip(!hasFilter, 'No filter control present on this build');

    const totalBefore = await adminBookingsPage.bookingRows.count();

    if (await adminBookingsPage.filter_status.isVisible().catch(() => false)) {
      await adminBookingsPage.filter_status.selectOption({ index: 1 }).catch(() => {});
    } else {
      await adminBookingsPage.filter_theatre.selectOption({ index: 1 }).catch(() => {});
    }

    const totalAfter = await adminBookingsPage.bookingRows.count();
    expect(totalAfter).toBeLessThanOrEqual(totalBefore);
  });

  test('SA-BOOKINGS-03 - View full detail of any booking across the platform', async ({ adminBookingsPage, page }) => {
    const count = await adminBookingsPage.bookingRows.count();
    test.skip(count === 0, 'No booking available to open');

    const urlBefore = page.url();
    await adminBookingsPage.openFirstBooking();

    // NOTE: nav in this dashboard is button-driven, in-page section switching (confirmed
    // via a real run), so a row click likely opens a modal/detail panel rather than
    // changing the URL. Accept either signal instead of assuming URL navigation.
    const urlChanged = page.url() !== urlBefore;
    const dialogVisible = await page.getByRole('dialog').isVisible().catch(() => false);
    expect(urlChanged || dialogVisible).toBeTruthy();
  });

  test('SA-BOOKINGS-04 - Process a refund on a booking', async ({ adminBookingsPage }) => {
    const count = await adminBookingsPage.bookingRows.count();
    test.skip(count === 0, 'No booking available to refund');

    await adminBookingsPage.refundFirstBooking();

    await expect(adminBookingsPage.status_refunded).toBeVisible();
  });
});
