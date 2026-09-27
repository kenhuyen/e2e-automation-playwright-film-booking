import { BasePage } from '../../base.page';

export default class BookingHistoryPage extends BasePage {
  readonly bookingRows = this.page.locator('a[href^="/booking/"]');

  readonly emptyState = this.page.getByText(/no (bookings|tickets) yet/i);

  readonly tab_upcoming = this.page
    .getByRole('tab', { name: /upcoming/i })
    .or(this.page.getByRole('button', { name: /upcoming/i }));

  readonly tab_past = this.page
    .getByRole('tab', { name: /past/i })
    .or(this.page.getByRole('button', { name: /past/i }));

  async open() {
    await super.open('/my-bookings');
  }

  async openFirstBooking() {
    await this.bookingRows.first().click();
  }
}