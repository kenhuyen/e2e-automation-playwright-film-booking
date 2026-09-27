import { BasePage } from '../../base.page';

export default class AdminMoviesPage extends BasePage {
  readonly movieRows = this.page.locator('div.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3 > div');
  readonly btn_addMovie = this.page.getByRole('button', { name: /add movie/i });

  readonly txt_title = this.page.getByLabel(/title/i);
  readonly txt_genre = this.page.getByLabel(/genre/i);
  readonly txt_duration = this.page.getByLabel(/duration/i);
  readonly txt_posterUrl = this.page.getByLabel(/poster/i);
  readonly btn_disable = this.page.getByRole('button', { name: /disable/i });
  readonly btn_enable = this.page.getByRole('button', { name: /enable/i });
  readonly btn_delete = this.page.getByRole('button', { name: /delete/i });
  readonly modal_confirm = this.page.getByRole('button', { name: /OK|Cancel/i });

  readonly error_required = this.page.getByText(/required|please fill/i);
  readonly warning_hasShowtimes = this.page.getByText(/has (active |scheduled )?showtimes/i);
  readonly toast_success = this.page.getByText(/saved|added successfully/i);

  // async addMovie(title: string, genre: string, duration: string) {
  //   await this.btn_addMovie.click();
  //   await this.txt_title.fill(title);
  //   await this.txt_genre.fill(genre);
  //   await this.txt_duration.fill(duration);
  //   await this.btn_save.click();
  // }

  async deleteMovieByTitle(title: string) {
    const row = this.movieRows.filter({ hasText: title });
    await row.getByRole('button', { name: /delete/i }).click();
    await this.modal_confirm.click();
  }
}
