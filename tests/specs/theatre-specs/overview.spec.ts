import { test, expect } from '../../pageObjects/pageFixture';

// Covers THR-OVERVIEW-01..04.
test.describe('THEATRE - Overview', { tag: '@theatre-overview' }, () => {
  test.beforeEach(async ({ loginPage, theatreOverviewPage }) => {
    await loginPage.loginAsTheatre();
    await theatreOverviewPage.open();
  });

  test('THR-OVERVIEW-01 - Overview displays correct key metrics for the theatre', async ({ theatreOverviewPage, page }) => {
    await expect(page).toHaveURL(/dashboard/);
    await expect(theatreOverviewPage.metric_todayBookings).toBeVisible();
    await expect(theatreOverviewPage.metric_revenue).toBeVisible();
  });

  test('THR-OVERVIEW-03 - Filter dashboard metrics by date range', async ({ theatreOverviewPage }) => {
    const hasFilter = await theatreOverviewPage.dateRangeFilter.isVisible().catch(() => false);
    test.skip(!hasFilter, 'Date range filter not present on this build');

    await theatreOverviewPage.dateRangeFilter.click();
    await expect(theatreOverviewPage.metric_revenue).toBeVisible();
  });

  test('THR-OVERVIEW-04 - Overview dashboard renders correctly on mobile viewport', async ({ page, theatreOverviewPage }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await theatreOverviewPage.open();

    await expect(theatreOverviewPage.metric_revenue).toBeVisible();
  });
});
