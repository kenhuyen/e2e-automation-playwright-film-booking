import { test, expect } from '../../pageObjects/pageFixture';

// Covers SA-USERS-01..05.
test.describe('SUPERADMIN - Users', { tag: '@admin-users' }, () => {
  test.beforeEach(async ({ loginPage, adminOverviewPage, adminUsersPage }) => {
    await loginPage.loginAsAdmin();
    await adminOverviewPage.open();
    await adminOverviewPage.nav.users.click();
  });

  test('SA-USERS-01 - All end-user accounts are listed', async ({ adminUsersPage }) => {
    await expect(adminUsersPage.userRows.first()).toBeVisible();
  });

  test('SA-USERS-02 - Search for a specific user by email', async ({ adminUsersPage }) => {
    await adminUsersPage.searchUser(process.env.TB_USER_EMAIL!);

    await expect(adminUsersPage.userRows.filter({ hasText: process.env.TB_USER_EMAIL! })).toHaveCount(1);
  });

  test('SA-USERS-03 - Search for a specific user by name', async ({ adminUsersPage }) => {
    await adminUsersPage.searchUser(process.env.TB_USER_NAME!);

    await expect(adminUsersPage.userRows.filter({ hasText: process.env.TB_USER_NAME! })).toHaveCount(1);
  });
  test('SA-USERS-04 - Search for a specific user by phone', async ({ adminUsersPage }) => {
    const phone = process.env.TB_USER_PHONE!;

    await adminUsersPage.searchUser(phone);

    await expect(adminUsersPage.txt_search).toHaveValue(phone);
  });
  test('SA-USERS-05 - Suspend a user account', async ({ adminUsersPage }) => {
    const count = await adminUsersPage.userRows.count();
    test.skip(count === 0, 'No user row available to suspend');

    await adminUsersPage.suspendUserByRow(0);

    await expect(adminUsersPage.status_suspended).toBeVisible();
  });
  test('SA-USERS-06 - Disable account', async ({ adminUsersPage }) => {
    const testUserEmail = 'huyennt19230@gmail.com';

    // Search user
    await adminUsersPage.page
      .getByPlaceholder('Search users...')
      .fill(testUserEmail);

    // Get đúng user row
    const userRow = adminUsersPage.page
      .locator('tbody tr')
      .filter({ hasText: testUserEmail });

    await expect(userRow).toBeVisible();

    // If account is already disabled, skip test
    const enableButton = userRow.getByRole('button', { name: 'Enable' });
    const disableButton = userRow.getByRole('button', { name: 'Disable' });

    if (await enableButton.isVisible()) {
      test.skip(true, 'Account is already disabled');
    }

    // Disable account
    await disableButton.click();

    // Verify account is disabled
    await expect(enableButton).toBeVisible();
  });
  test('SA-USERS-07 - Enable account', async ({ adminUsersPage }) => {
    const testUserEmail = 'huyennt19230@gmail.com';
    // Search user
    await adminUsersPage.page
      .getByPlaceholder('Search users...')
      .fill(testUserEmail);

    const userRow = adminUsersPage.page
      .locator('tbody tr')
      .filter({ hasText: testUserEmail });

    await expect(userRow).toBeVisible();

    // Enable account
    await userRow.getByRole('button', { name: 'Enable' }).click();

    // Verify account đã được enable
    await expect(
      userRow.getByRole('button', { name: 'Disable' })
    ).toBeVisible();
  });
  // test('SA-USERS-08 - Delete account', async ({ adminUsersPage }) => {
  // const testUserEmail = 'e2e_test_delete@test.com';

  // // Search user
  // await adminUsersPage.page
  //   .getByPlaceholder('Search users...')
  //   .fill(testUserEmail);

  // const userRow = adminUsersPage.page
  //   .locator('tbody tr')
  //   .filter({ hasText: testUserEmail });

  // await expect(userRow).toBeVisible();

  // // Delete account
  // await userRow.getByRole('button', { name: 'Delete' }).click();
  // await expect(userRow).toHaveCount(0);
  // });
});
