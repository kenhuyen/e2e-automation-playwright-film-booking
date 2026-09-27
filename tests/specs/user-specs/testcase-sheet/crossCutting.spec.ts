import { test, expect } from '../../../pageObjects/pageFixture';

// 1:1 mapping of every "Automated: Yes" row from the "Cross-cutting" sheet.
// These don't need dedicated page objects; they operate at the page/response level.
test.describe('Cross-cutting', { tag: '@cross-cutting-tc' }, () => {
  test('GEN-02 - Verify display across common screen resolutions', async ({ homePage, page }) => {
    const resolutions = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1366, height: 768 },
      { width: 1920, height: 1080 },
    ];

    for (const size of resolutions) {
      await page.setViewportSize(size);
      await homePage.open();
      await expect(homePage.movieCards.first()).toBeVisible();
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(size.width + 20); // small tolerance for scrollbars
    }
  });

  test('GEN-04 - Navigate to a URL that does not exist on the site', async ({ page, homePage }) => {
    const response = await page.goto(`${homePage.baseUrl}/this-route-does-not-exist-qa`);

    // ASSUMPTION: SPA client-side routing may return 200 with a "Not Found" UI instead
    // of an HTTP 404. Accept either signal as a pass.
    const status = response?.status();
    const notFoundText = page.getByText(/not found|404/i);
    const hasNotFoundText = await notFoundText.isVisible().catch(() => false);

    expect(status === 404 || hasNotFoundText).toBeTruthy();
  });

  test('GEN-06 - Verify HTTPS connection', async ({ homePage, page }) => {
    await homePage.open();

    expect(page.url()).toMatch(/^https:\/\//);
  });

  test('GEN-09 - Verify basic meta tags on the site', async ({ homePage, page }) => {
    await homePage.open();

    await expect(page).toHaveTitle(/MarkMySeat/i);
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /.+/);
  });
});
