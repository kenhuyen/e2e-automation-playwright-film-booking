import { test, expect } from '../../pageObjects/pageFixture';

// Covers SA-MOVIES-01..05.
test.describe('SUPERADMIN - Movies', { tag: '@admin-movies' }, () => {
  test.beforeEach(async ({ loginPage, adminOverviewPage, adminMoviesPage }) => {
    await loginPage.loginAsAdmin();
    await adminOverviewPage.open();
    await adminOverviewPage.nav.movies.click();
  });

  test('SA-MOVIES-01 - Master movie catalog is listed', async ({ adminMoviesPage }) => {
    await expect(adminMoviesPage.movieRows.first()).toBeVisible();
  });

  // test('SA-MOVIES-02 - Active movie', async ({ adminUsersPage }) => {
     
  // });
  
  // test('SA-MOVIES-03 - Diactive movie', async ({ adminUsersPage }) => {
     
  // });
});
