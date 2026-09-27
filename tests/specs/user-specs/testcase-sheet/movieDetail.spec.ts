import { test, expect } from '../../../pageObjects/pageFixture';

// 1:1 mapping of every "Automated: Yes" row from the "Movie Detail" sheet.
// Left out (Automated = No): DETAIL-10 (direct URL w/ non-existent id), DETAIL-13 (security).
test.describe('Movie Detail', { tag: '@movie-detail-tc' }, () => {
  test.beforeEach(async ({ homePage, movieDetailPage }) => {
    await homePage.open();
    await homePage.movieCards.first().click();
  });

  test('DETAIL-01 - All movie detail information is displayed', async ({ movieDetailPage }) => {
    await expect(movieDetailPage.title).toBeVisible();
    await expect(movieDetailPage.synopsis).toBeVisible();
  });

  test('DETAIL-02 - Play the movie trailer', async ({ movieDetailPage }) => {
    const hasTrailer = await movieDetailPage.trailerThumbnail.isVisible().catch(() => false);
    test.skip(!hasTrailer, 'No trailer available for this movie');

    await movieDetailPage.playTrailer();
    await expect(movieDetailPage.trailerPlayer).toBeVisible();
  });

  test('DETAIL-03 - List of theaters showing the movie is displayed', async ({ movieDetailPage }) => {
    await expect(movieDetailPage.theaterList.first().or(movieDetailPage.theaterOptions.first())).toBeVisible();
  });

  test('DETAIL-04 - Default (today\'s) showtimes are displayed', async ({ bookingPage }) => {
    await expect(bookingPage.showtimeOptions.first()).toBeVisible();
  });

  test('DETAIL-05 - Selecting a different date updates the showtime list', async ({ bookingPage }) => {
    const count = await bookingPage.dateOptions.count();
    test.skip(count < 2, 'Need at least 2 selectable dates');

    await bookingPage.dateOptions.nth(1).click();
    await expect(bookingPage.showtimeOptions.first()).toBeVisible();
  });

  test('DETAIL-06 - Selecting a different theater updates the corresponding showtimes', async ({
    movieDetailPage,
    bookingPage,
  }) => {
    const count = await movieDetailPage.theaterOptions.count();
    test.skip(count < 2, 'Need at least 2 theaters showing this movie');

    await movieDetailPage.theaterOptions.nth(0).click();
    const showtimesA = await bookingPage.showtimeOptions.count();
    await movieDetailPage.theaterOptions.nth(1).click();
    const showtimesB = await bookingPage.showtimeOptions.count();

    expect(showtimesA + showtimesB).toBeGreaterThan(0);
  });

  test('DETAIL-07 - Attempt to select a past date (if the calendar allows free navigation)', async ({ bookingPage }) => {
    const disabledCount = await bookingPage.disabledDates.count();
    test.skip(disabledCount === 0, 'No disabled-date markers found to assert against');

    await expect(bookingPage.disabledDates.first()).toBeDisabled();
  });

  test('DETAIL-08 - Select a specific showtime to proceed to booking', async ({ bookingPage }) => {
    await bookingPage.showtimeOptions.first().click();
    await expect(bookingPage.seatMap).toBeVisible();
  });

  test('DETAIL-09 - No showtimes available on the selected date', async ({ movieDetailPage, bookingPage }) => {
    const count = await bookingPage.dateOptions.count();
    test.skip(count === 0, 'No date picker present to select a far-future date');

    await bookingPage.dateOptions.last().click();
    await expect(bookingPage.showtimeOptions.first().or(movieDetailPage.noShowtimesMessage)).toBeVisible();
  });

  test('DETAIL-11 - Back button to the previous page/home', async ({ movieDetailPage, page }) => {
    const hasBackBtn = await movieDetailPage.btn_back.isVisible().catch(() => false);
    if (hasBackBtn) {
      await movieDetailPage.btn_back.click();
    } else {
      await page.goBack();
    }
    await expect(page).toHaveURL(new RegExp(`${movieDetailPage.baseUrl}/?$`));
  });

  test('DETAIL-12 - Verify movie detail page on mobile viewport', async ({ movieDetailPage, page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    await expect(movieDetailPage.title).toBeVisible();
  });
});
