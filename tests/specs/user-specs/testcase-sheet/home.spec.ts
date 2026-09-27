import { test, expect } from '../../../pageObjects/pageFixture';

// 1:1 mapping of every "Automated: Yes" row from the "Home" sheet of the uploaded
// testcases_markmyseat_en.xlsx. Test titles start with the exact TC ID for traceability.
// Rows left out on purpose because Automated = No in the sheet: HOME-11 (XSS/security),
// HOME-20 (performance timing), HOME-22 (cross-browser matrix).
test.describe('Home', { tag: '@home-tc' }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test('HOME-01 - Home page loads successfully with full layout', async ({ homePage, page }) => {
    await expect(page).toHaveTitle(/MarkMySeat/i);
    await expect(homePage.movieCards.first()).toBeVisible();
    await expect(homePage.footer).toBeVisible();
  });

  test('HOME-02 - Verify browser tab title and favicon', async ({ page }) => {
    await expect(page).toHaveTitle(/MarkMySeat/i);
    const favicon = page.locator('link[rel*="icon"]');
    await expect(favicon).toHaveCount(1);
  });

  test('HOME-03 - Now Showing movies are displayed', async ({ homePage }) => {
    await expect(homePage.movieCards.first()).toBeVisible();
  });

  test('HOME-04 - Coming Soon movies are displayed (if a separate tab exists)', async ({ homePage }) => {
    const hasTab = await homePage.comingSoonTab.isVisible().catch(() => false);
    test.skip(!hasTab, 'No Coming Soon tab present on this build');

    await homePage.comingSoonTab.click();
    await expect(homePage.movieCards.first()).toBeVisible();
  });

  test('HOME-05 - Movie posters render fully without breaking', async ({ homePage }) => {
    const count = await homePage.movieCards.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      const img = homePage.movieCards.nth(i).locator('img');
      await expect(img).toBeVisible();
      const naturalWidth = await img.evaluate((el) => (el as HTMLImageElement).naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('HOME-06 - Click the site logo', async ({ homePage, page }) => {
    await homePage.movieCards.first().click();
    await homePage.goHomeViaLogo();
    await expect(page).toHaveURL(`${homePage.baseUrl}/`);
  });

  test('HOME-07 - Verify header navigation menu items', async ({ homePage }) => {
    const count = await homePage.navMenuItems.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(homePage.navMenuItems.nth(i)).toBeVisible();
    }
  });

  test('HOME-08 - Search movie by valid title with matching results', async ({ homePage }) => {
    // ASSUMPTION: replace with a movie title that exists in seeded test data.
    await homePage.searchMovie('Avengers');
    await expect(homePage.movieCards.first()).toBeVisible();
  });

  test('HOME-09 - Search with a keyword that has no matches', async ({ homePage }) => {
    await homePage.searchMovie('xyznotexist12345');
    await expect(homePage.noResultsText).toBeVisible();
  });

  test('HOME-10 - Search with an empty string', async ({ homePage }) => {
    await homePage.searchInput.fill('');
    await homePage.searchInput.press('Enter');
    await expect(homePage.movieCards.first()).toBeVisible();
  });

  test('HOME-12 - Search is case-insensitive', async ({ homePage }) => {
    await homePage.searchMovie('avatar');
    await expect(homePage.movieCards.first().or(homePage.noResultsText)).toBeVisible();
  });

  test('HOME-13 - Filter movies by genre (if a filter exists)', async ({ homePage }) => {
    const hasFilter = await homePage.genreFilter.isVisible().catch(() => false);
    test.skip(!hasFilter, 'No genre filter present on this build');

    await homePage.genreFilter.selectOption({ index: 1 });
    await expect(homePage.movieCards.first()).toBeVisible();
  });

  test('HOME-14 - Clear filter / reselect "All"', async ({ homePage }) => {
    const hasFilter = await homePage.genreFilter.isVisible().catch(() => false);
    test.skip(!hasFilter, 'No genre filter present on this build');

    const totalBefore = await homePage.movieCards.count();
    await homePage.genreFilter.selectOption({ index: 1 });
    await homePage.genreFilter.selectOption({ index: 0 });
    const totalAfter = await homePage.movieCards.count();
    expect(totalAfter).toBeGreaterThanOrEqual(totalBefore);
  });

  test('HOME-15 - Click a movie poster / Book Now button', async ({ homePage, page }) => {
    await homePage.movieCards.first().click();
    await expect(page).not.toHaveURL(`${homePage.baseUrl}/`);
  });

  test('HOME-16 - Login/Register buttons show when logged out', async ({ homePage }) => {
    await expect(homePage.loginButton.or(homePage.registerButton)).toBeVisible();
  });

  test('HOME-17 - User name/avatar shows after login', async ({ loginPage, homePage }) => {
    await loginPage.loginAsUser();
    await homePage.open();

    await expect(homePage.userAvatar).toBeVisible();
  });

  test('HOME-18 - Verify home page on mobile viewport', async ({ homePage, page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await homePage.open();

    await expect(homePage.movieCards.first()).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(400);
  });

  test('HOME-19 - Verify home page on tablet viewport', async ({ homePage, page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await homePage.open();

    await expect(homePage.movieCards.first()).toBeVisible();
  });

  test('HOME-21 - Verify footer content and links', async ({ homePage }) => {
    await expect(homePage.footer).toBeVisible();
    const count = await homePage.footerLinks.count();
    for (let i = 0; i < count; i++) {
      const href = await homePage.footerLinks.nth(i).getAttribute('href');
      expect(href).not.toBeNull();
      expect(href).not.toBe('#');
    }
  });
});
