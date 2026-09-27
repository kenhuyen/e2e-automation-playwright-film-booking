import { test, expect } from '../../pageObjects/pageFixture';

test.describe('THEATRE - Movies', { tag: '@theatre-movies' }, () => {
  test.beforeEach(async ({ loginPage, theatreOverviewPage }) => {
    await loginPage.loginAsTheatre();
    await theatreOverviewPage.open();
    await theatreOverviewPage.nav.movies.click();
  });

  test('THR-MOVIES-01 - Theatre\'s assigned/showing movies list is displayed', async ({
    theatreMoviesPage,
  }) => {
    await expect(theatreMoviesPage.movieRows.first()).toBeVisible();
  });

  test('THR-MOVIES-02 - Add a movie with a showtime', async ({
    theatreMoviesPage,
  }) => {
    const movieTitle = `E2E Movie ${Date.now()}`;

    await theatreMoviesPage.addMovie({
      title: movieTitle,
      posterUrl: 'https://example.com/movie-poster.jpg',
      genre: 'Action',
      language: 'English',
      duration: '2h 30m',
      rating: '8.5',
      cast: 'E2E Cast',
      description: 'E2E test movie',
      showTimes: '18:00',
      screen: 'Screen 1',
    });

    await expect(
      theatreMoviesPage.movieCards.filter({
        hasText: movieTitle,
      })
    ).toBeVisible();
  });

  test('THR-MOVIES-03 - Overlapping showtimes on the same screen are rejected', async ({
    theatreMoviesPage,
  }) => {
    const firstMovie = `E2E First Movie ${Date.now()}`;
    const secondMovie = `E2E Overlap Movie ${Date.now()}`;

    await theatreMoviesPage.addMovie({
      title: firstMovie,
      posterUrl: 'https://example.com/movie-poster.jpg',
      genre: 'Action',
      language: 'English',
      duration: '2h 30m',
      rating: '8.5',
      cast: 'E2E Cast',
      description: 'First movie',
      showTimes: '18:00',
      screen: 'Screen 1',
    });

    await expect(
      theatreMoviesPage.movieCards.filter({
        hasText: firstMovie,
      })
    ).toBeVisible();

    await theatreMoviesPage.addMovie({
      title: secondMovie,
      posterUrl: 'https://example.com/movie-poster.jpg',
      genre: 'Action',
      language: 'English',
      duration: '2h 30m',
      rating: '8.5',
      cast: 'E2E Cast',
      description: 'Overlap movie',
      showTimes: '18:00',
      screen: 'Screen 1',
    });

    await expect(theatreMoviesPage.error_overlap).toBeVisible();
  });

  test('THR-MOVIES-04 - Add and delete a movie/showtime', async ({
    page,
    theatreMoviesPage,
  }) => {
    const movieTitle = `QA Movie ${Date.now()}`;

    await theatreMoviesPage.addMovie({
      title: movieTitle,
      posterUrl: 'https://example.com/poster.jpg',
      genre: 'Action',
      language: 'English',
      duration: '120',
      rating: '8',
      cast: 'QA Test Cast',
      description: 'Movie created for automation testing',
      showTimes: '20:00',
      screen: 'Screen 2',
    });

    const movieCard = theatreMoviesPage.movieCards.filter({
      hasText: movieTitle,
    });

    await expect(movieCard).toBeVisible();

    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toBe('Delete this movie?');
      await dialog.accept();
    });

    await movieCard
      .getByRole('button', { name: /delete/i })
      .click();

    await expect(
      theatreMoviesPage.movieCards.filter({
        hasText: movieTitle,
      })
    ).toHaveCount(0);
  });
  test('THR-MOVIES-05 - Edit movie', async ({
    theatreMoviesPage,
  }) => {
    const movieTitle = `Edit Movie ${Date.now()}`;
    const updatedTitle = `Updated Movie ${Date.now()}`;

    await theatreMoviesPage.addMovie({
      title: movieTitle,
      posterUrl: 'https://example.com/poster.jpg',
      genre: 'Action',
      language: 'English',
      duration: '120',
      rating: '8',
      cast: 'QA Test Cast',
      description: 'Movie created for edit testing',
      showTimes: '20:00',
      screen: 'Screen 2',
    });

    const movieCard = theatreMoviesPage.movieCards.filter({
      hasText: movieTitle,
    });

    await expect(movieCard).toBeVisible();

    await movieCard
      .getByRole('button', { name: /edit/i })
      .click();

    await theatreMoviesPage.txt_title.fill(updatedTitle);

    await theatreMoviesPage.btn_save.click();

    await expect(
      theatreMoviesPage.movieCards.filter({
        hasText: updatedTitle,
      })
    ).toBeVisible();

    await expect(
      theatreMoviesPage.movieCards.filter({
        hasText: movieTitle,
      })
    ).toHaveCount(0);
    
  });
});