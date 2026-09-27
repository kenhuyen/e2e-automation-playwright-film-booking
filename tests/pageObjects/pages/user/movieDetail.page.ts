import { BasePage } from '../../base.page';

// Matches the "Movie Detail" sheet of the uploaded testcase file (DETAIL-xx).
// ASSUMPTION: title/synopsis/trailer/theater-list markup — adjust once real DOM is confirmed.
export default class MovieDetailPage extends BasePage {
  readonly title = this.page.getByRole('heading', { level: 1 });
  readonly synopsis = this.page.getByTestId('movie-synopsis').or(this.page.locator('p').first());
  readonly duration = this.page.getByText(/\d+\s?(min|h)/i);
  readonly genre = this.page.getByTestId('movie-genre');
  readonly rating = this.page.getByTestId('movie-rating');

  readonly trailerThumbnail = this.page.getByRole('button', { name: /play trailer|watch trailer/i });
  readonly trailerPlayer = this.page.locator('iframe[src*="youtube" i], video');
  readonly btn_closeTrailer = this.page.getByRole('button', { name: /close/i });

  readonly theaterList = this.page.locator('[data-testid="theater-item"], .theater-item');
  readonly theaterOptions = this.page.getByRole('button').filter({ hasText: /cinema|theatre|theater/i });

  readonly noShowtimesMessage = this.page.getByText(/no showtimes available/i);
  readonly btn_back = this.page.getByRole('button', { name: /back/i }).or(this.page.getByRole('link', { name: /back/i }));

  async selectTheaterByName(name: string) {
    await this.theaterList.filter({ hasText: name }).click();
  }

  async playTrailer() {
    await this.trailerThumbnail.click();
  }
}
