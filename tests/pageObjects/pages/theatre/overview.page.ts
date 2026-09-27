import { BasePage } from '../../base.page';

// Mirrors the real, verified pattern from admin/overview.page.ts (fixed against the live
// app): nav items are BUTTONS, not links, and clicking them switches the visible section
// in-place rather than navigating to a new URL. open() also carries the same defensive
// inline-login fallback, in case the dashboard route is hit without an active session yet.
export default class TheatreOverviewPage extends BasePage {
  readonly metric_todayBookings = this.page.getByText(/today'?s bookings/i);
  readonly metric_revenue = this.page.getByText(/revenue/i);
  readonly metric_upcomingShowtimes = this.page.getByText(/upcoming showtimes/i);
  readonly dateRangeFilter = this.page.getByRole('button', { name: /last 7 days|date range/i });

  readonly nav = {
    overview: this.page.getByRole('button', { name: /overview/i }).or(this.page.getByRole('link', { name: /overview|dashboard/i })),
    movies: this.page.getByRole('button', { name: /movies/i }).or(this.page.getByRole('link', { name: /movies|dashboard/i })),
    bookings: this.page.getByRole('button', { name: /bookings/i }).or(this.page.getByRole('link', { name: /bookings|dashboard/i })),
    foodMenu: this.page.getByRole('button', { name: /food menu/i }).or(this.page.getByRole('link', { name: /food menu|dashboard/i })),
    screens: this.page.getByRole('button', { name: /screens/i }).or(this.page.getByRole('link', { name: /screens|dashboard/i })),
  };

  async open() {
    // BUGFIX: TB_BASE_URL_THEATRE in .env is "https://.../theatre/login" — appending
    // "/dashboard" to that gave a 404 ("Scene not found"), confirmed via a real test run.
    // Strip a trailing "/login" (if present) before appending "/dashboard" so this works
    // whether the env var includes it or not.
    const rawBase = process.env.TB_BASE_URL_THEATRE?.trim() || `${this.baseUrl}/theatre`;
    const theatreUrl = rawBase.replace(/\/login\/?$/, '');
    await this.page.goto(`${theatreUrl}/dashboard`);

    const submitBtn = this.page.getByRole('button', { name: /access dashboard|sign in|login/i });
    if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      const emailInput = this.page.locator("input[type='email'], input").first();
      const passwordInput = this.page.locator("input[type='password']").first();
      await emailInput.fill(process.env.TB_THEATRE_EMAIL!.trim());
      await passwordInput.fill(process.env.TB_THEATRE_PASSWORD!.trim());
      await submitBtn.click();
      await this.page.waitForURL(/theatre\/dashboard/);
    }
  }
}
