import { BasePage } from '../../base.page';

export default class AdminOverviewPage extends BasePage {
  readonly metric_totalUsers = this.page.getByText('Total Users', { exact: true });
  readonly metric_totalTheatres =  this.page.locator('p').filter({ hasText: /^Theatres$/i });
  readonly metric_totalBookings = this.page.getByText('Total Bookings', { exact: true });
  readonly metric_revenue = this.page.getByText(/Revenue/i);
  readonly dateRangeFilter = this.page.getByRole('button', { name: /date range|last \d+ days/i });
  readonly logout = this.page.getByRole('button', { name: /Logout/i });

  readonly nav = {
    overview: this.page.getByRole('button', { name: /overview/i }).or(this.page.getByRole('link', { name: /overview|dashboard/i })),
    users: this.page.getByRole('button', { name: /users/i }).or(this.page.getByRole('link', { name: /users/i })),
    theatres: this.page.getByRole('button', { name: /theatres/i }).or(this.page.getByRole('link', { name: /theatres/i })),
    bookings: this.page.getByRole('button', { name: /bookings/i }).or(this.page.getByRole('link', { name: /bookings/i })),
    movies: this.page.getByRole('button', { name: /movies/i }).or(this.page.getByRole('link', { name: /movies/i })),
  };

  async open() {
    const adminUrl = (process.env.TB_BASE_URL_ADMIN?.trim() || `${this.baseUrl}/admin`);
    await this.page.goto(`${adminUrl}/dashboard`);
    const submitBtn = this.page.getByRole('button', { name: /access dashboard|sign in|login/i });
    if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      const emailInput = this.page.locator("input[type='email'], input").first();
      const passwordInput = this.page.locator("input[type='password']").first();
      await emailInput.fill(process.env.TB_ADMIN_EMAIL!.trim());
      await passwordInput.fill(process.env.TB_ADMIN_PASSWORD!.trim());
      await submitBtn.click();
      await this.page.waitForURL(/admin\/dashboard/);
    }
  }
}
