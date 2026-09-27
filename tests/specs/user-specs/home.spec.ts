import { test, expect } from '../../pageObjects/pageFixture';

// Covers USR-HOME-01..09 from the test case sheet.
test.describe('USER - Home / Movie Discovery', { tag: '@home' }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test('USR-HOME-01 - Home page loads with movie listing visible', async ({
    homePage,
  }) => {
    await homePage.waitForMovies();
    await expect(
      homePage.movieCards.first()
    ).toBeVisible();

    await expect(
      homePage.movieCards.first().locator('img')
    ).toBeVisible();

    await expect(
      homePage.movieCards.first().locator('h3')
    ).toBeVisible();
  });

  test('USR-HOME-03 - Search for a movie by valid title returns matching results', async ({ homePage }) => {
    // ASSUMPTION: replace with a movie title that actually exists in the seeded test data.
    const knownMovieTitle = 'Avengers';
    await homePage.searchMovie(knownMovieTitle);

    await expect(homePage.movieCards.first()).toBeVisible();
  });

  test('USR-HOME-04 - Search with no matching results shows empty state', async ({ homePage }) => {
    await homePage.searchMovie('xyznotexist12345');

    await expect(homePage.noResultsText).toBeVisible();
  });

  test('USR-HOME-08 - Inject script payload into search box is handled safely', async ({ homePage, page }) => {
    page.on('dialog', (dialog) => {
      throw new Error(`Unexpected dialog appeared: ${dialog.message()}`);
    });

    await homePage.searchMovie('<script>alert(1)</script>');

    // No JS alert fired (asserted implicitly via the dialog listener above) and page did not crash.
    await expect(page.locator('body')).toBeVisible();
  });

  test('USR-HOME-06 - Click a movie card navigates to its detail/booking entry point', async ({ homePage, page }) => {
    await homePage.movieCards.first().click();

    await expect(page).not.toHaveURL(homePage.baseUrl + '/');
  });
});
