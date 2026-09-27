import { BasePage } from '../../base.page';

export default class AdminBookingsPage extends BasePage {
  readonly bookingRows = this.page.locator('tbody tr');
  readonly filter_theatre = this.page.getByLabel(/theatre/i);
  readonly filter_status = this.page.getByLabel(/status/i);
  readonly btn_refund = this.page.getByRole('button', { name: /refund/i });
  readonly btn_forceCancel = this.page.getByRole('button', { name: /force cancel|cancel booking/i });
  readonly modal_confirm = this.page.getByRole('button', { name: /yes|confirm/i });

  readonly status_refunded = this.page.getByText(/refunded/i);
  readonly status_cancelled = this.page.getByText(/cancelled/i);

  async openFirstBooking() {
    await this.bookingRows.first().click();
  }

  async refundFirstBooking() {
    await this.bookingRows.first().getByRole('button', { name: /refund/i }).click();
    await this.modal_confirm.click();
  }
}
