import { expect } from '@playwright/test';
import { BasePage } from '../../base.page';

export default class TheatreMoviesPage extends BasePage {
  readonly movieRows = this.page.locator('div.glass-strong.rounded-xl');
  readonly movieCards = this.movieRows;

  readonly btn_addMovie = this.page.getByRole('button', {
    name: /Add Movie/i,
  });

  readonly txt_title = this.page.getByPlaceholder('Title *');
  readonly txt_posterUrl = this.page.getByPlaceholder('Poster URL');
  readonly txt_genre = this.page.getByPlaceholder(/Genre/i);
  readonly txt_language = this.page.getByPlaceholder('Language');
  readonly txt_duration = this.page.getByPlaceholder(/Duration/i);
  readonly txt_rating = this.page.getByPlaceholder(/Rating/i);
  readonly txt_cast = this.page.getByPlaceholder('Cast');
  readonly txt_description = this.page.getByPlaceholder('Description');
  readonly txt_showTimes = this.page.getByPlaceholder(/Show Times/i);

  readonly select_screen = this.page.locator('select').last();

  readonly btn_save = this.page.getByRole('button', {
    name: /^Save$/i,
  });

  readonly error_overlap = this.page.getByText(
    /overlap|conflict.*(time|schedule)/i
  );

  readonly toast_success = this.page.getByText(
    /added|saved successfully/i
  );

  readonly warning_hasBookings = this.page.getByText(
    /has (existing )?bookings/i
  );

  async selectScreen(screen: string) {
    const option = this.select_screen.locator('option').filter({
      hasText: screen,
    });

    await expect(option).toHaveCount(1);

    const value = await option.getAttribute('value');

    if (!value) {
      throw new Error(`Screen option not found: ${screen}`);
    }

    await this.select_screen.selectOption({ value });
  }

  async addMovie({
    title,
    posterUrl,
    genre,
    language,
    duration,
    rating,
    cast,
    description,
    showTimes,
    screen,
  }: {
    title: string;
    posterUrl: string;
    genre: string;
    language: string;
    duration: string;
    rating: string;
    cast: string;
    description: string;
    showTimes: string;
    screen: string;
  }) {
    await this.btn_addMovie.click();

    await this.txt_title.fill(title);
    await this.txt_posterUrl.fill(posterUrl);
    await this.txt_genre.fill(genre);
    await this.txt_language.fill(language);
    await this.txt_duration.fill(duration);
    await this.txt_rating.fill(rating);
    await this.txt_cast.fill(cast);
    await this.txt_description.fill(description);
    await this.txt_showTimes.fill(showTimes);

    await this.selectScreen(screen);

    await this.btn_save.click();
  }
}