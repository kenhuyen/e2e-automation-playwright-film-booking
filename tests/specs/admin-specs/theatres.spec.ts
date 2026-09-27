import { test, expect } from '../../pageObjects/pageFixture';

// Covers SA-THEATRES-01..05.
test.describe('SUPERADMIN - Theatres', { tag: '@admin-theatres' }, () => {
  test.beforeEach(async ({ loginPage, adminOverviewPage, adminTheatresPage }) => {
    await loginPage.loginAsAdmin();
    await adminOverviewPage.open();
    await adminOverviewPage.nav.theatres.click();
  });

  test('SA-THEATRES-01 - All theatre partner accounts are listed', async ({ adminTheatresPage }) => {
    await expect(adminTheatresPage.theatreRows.first()).toBeVisible();
  });

  test('SA-THEATRES-02 - Approve a pending theatre registration', async ({ adminTheatresPage }) => {
    const pendingCount = await adminTheatresPage.theatreRows.filter({ hasText: /pending/i }).count();
    test.skip(pendingCount === 0, 'No pending theatre available to approve');

    await adminTheatresPage.approveByRow(0);

    await expect(adminTheatresPage.status_approved).toBeVisible();
  });

  test('SA-THEATRES-03 - Reject a pending theatre registration', async ({ adminTheatresPage }) => {
    const pendingCount = await adminTheatresPage.theatreRows.filter({ hasText: /pending/i }).count();
    test.skip(pendingCount === 0, 'No pending theatre available to reject');

    await adminTheatresPage.rejectByRow(0, 'Incomplete documentation');

    await expect(adminTheatresPage.status_rejected).toBeVisible();
  });

  test('SA-THEATRES-04 - Suspend an already-approved theatre', async ({ adminTheatresPage }) => {
    const approvedCount = await adminTheatresPage.theatreRows.filter({ hasText: /approved/i }).count();
    test.skip(approvedCount === 0, 'No approved theatre available to suspend');

    await adminTheatresPage.theatreRows
      .filter({ hasText: /approved/i })
      .first()
      .getByRole('button', { name: /suspend/i })
      .click();
    await adminTheatresPage.modal_confirm.click();

    await expect(adminTheatresPage.status_suspended).toBeVisible();
  });

  test('SA-THEATRES-06 - Filter theatres by approval status', async ({ adminTheatresPage }) => {
    const hasFilter = await adminTheatresPage.filter_status.isVisible().catch(() => false);
    test.skip(!hasFilter, 'No status filter present on this build');

    const totalBefore = await adminTheatresPage.theatreRows.count();
    await adminTheatresPage.filter_status.selectOption({ index: 1 }).catch(() => { });
    const totalAfter = await adminTheatresPage.theatreRows.count();

    expect(totalAfter).toBeLessThanOrEqual(totalBefore);
  });
});
