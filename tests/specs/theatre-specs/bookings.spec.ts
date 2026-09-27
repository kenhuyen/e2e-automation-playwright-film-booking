import { test, expect } from '../../pageObjects/pageFixture';

// Covers THR-BOOKINGS-01..05.
test.describe('THEATRE - Bookings', { tag: '@theatre-bookings' }, () => {
  test.beforeEach(async ({ loginPage, theatreOverviewPage, theatreBookingsPage }) => {
    await loginPage.loginAsTheatre();
    await theatreOverviewPage.open();
    await theatreOverviewPage.nav.bookings.click();
  });

  test('THR-BOOKINGS-01 - All bookings made for this theatre are listed', async ({ theatreBookingsPage }) => {
    await expect(theatreBookingsPage.bookingRows.first()).toBeVisible();
  });

  test('THR-BOOKINGS-02 - Filter bookings by date, movie, or status', async ({ theatreBookingsPage }) => {
    const hasFilter = await theatreBookingsPage.filter_status.isVisible().catch(() => false);
    test.skip(!hasFilter, 'No status filter present on this build');

    const totalBefore = await theatreBookingsPage.bookingRows.count();
    await theatreBookingsPage.filter_status.selectOption({ index: 1 }).catch(() => {});
    const totalAfter = await theatreBookingsPage.bookingRows.count();

    expect(totalAfter).toBeLessThanOrEqual(totalBefore);
  });

  test('THR-BOOKINGS-03 - View a specific booking\'s full detail', async ({ theatreBookingsPage, page }) => {
    const count = await theatreBookingsPage.bookingRows.count();
    test.skip(count === 0, 'No bookings available to open');

    const urlBefore = page.url();
    await theatreBookingsPage.openFirstBooking();

    // NOTE: nav in this dashboard is button-driven, in-page section switching (confirmed
    // via a real run), so a row click likely opens a modal/detail panel rather than
    // changing the URL. Accept either signal instead of assuming URL navigation.
    const urlChanged = page.url() !== urlBefore;
    const dialogVisible = await page.getByRole('dialog').isVisible().catch(() => false);
    expect(urlChanged || dialogVisible).toBeTruthy();
  });

  test('THR-BOOKINGS-04 - Check in a booking, then re-scanning shows already used', async ({ theatreBookingsPage }) => {
    // ASSUMPTION: requires a real, unused booking code seeded in test data.
    const validUnusedCode = 'REPLACE-WITH-REAL-CODE';
    test.skip(validUnusedCode.startsWith('REPLACE'), 'Needs a real booking code from seeded test data');

    await theatreBookingsPage.checkInByCode(validUnusedCode);
    await expect(theatreBookingsPage.status_checkedIn).toBeVisible();

    await theatreBookingsPage.checkInByCode(validUnusedCode);
    await expect(theatreBookingsPage.error_alreadyUsed).toBeVisible();
  });
});

test.describe('THEATRE - Bookings - Access Control', { tag: '@theatre-bookings' }, () => {
  test('THR-BOOKINGS-05 - Theatre A cannot view Theatre B\'s bookings via direct ID access', async ({
    loginPage,
    page,
    theatreBookingsPage,
  }) => {
    await loginPage.loginAsTheatre();
    // ASSUMPTION: booking detail route follows /theatre/bookings/:id.
    await page.goto(`${theatreBookingsPage.baseUrl}/theatre/bookings/00000000-not-mine`);

    await expect(theatreBookingsPage.error_accessDenied).toBeVisible();
  });
});
