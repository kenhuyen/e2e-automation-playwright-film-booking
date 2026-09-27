import { test, expect } from '../../pageObjects/pageFixture';

// Covers SA-OVERVIEW-01..03.
test.describe('SUPERADMIN - Overview', { tag: '@admin-overview' }, () => {
  test.beforeEach(async ({ loginPage, adminOverviewPage }) => {
    await loginPage.loginAsAdmin();
    await adminOverviewPage.open();
  });

  test('SA-OVERVIEW-01 - Platform-wide metrics are displayed correctly', async ({ adminOverviewPage, page }) => {
    await expect(page).toHaveURL(/dashboard/);
    await expect(adminOverviewPage.metric_totalUsers).toBeVisible();
    await expect(adminOverviewPage.metric_totalTheatres).toBeVisible();
    await expect(adminOverviewPage.metric_totalBookings).toBeVisible();
  });

  test('SA-OVERVIEW-02 - Click Bookings navigation', async ({ adminOverviewPage, page }) => {
  await adminOverviewPage.nav.bookings.click();
  await expect(adminOverviewPage.nav.bookings).toBeVisible();
  });
  test('SA-OVERVIEW-03 - Logout', async ({ adminOverviewPage, page }) => {
  await adminOverviewPage.logout.click();
  await expect(page).toHaveURL(/\/admin\/login$/);
  });
});
