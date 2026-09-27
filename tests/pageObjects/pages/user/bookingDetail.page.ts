import { BasePage } from '../../base.page';

export default class BookingDetailPage extends BasePage {
  readonly movieTitle = this.page.getByRole('heading', { level: 1 });

  readonly bookingCode = this.page.locator(
    'p.text-xs.text-primary.font-mono'
  );

  readonly showTime = this.page
    .getByText('Show Time', { exact: true })
    .locator('..')
    .locator('p')
    .last();

  readonly showDate = this.page
    .getByText('Show Date', { exact: true })
    .locator('..')
    .locator('p')
    .last();

  readonly screen = this.page
    .getByText('Screen', { exact: true })
    .locator('..')
    .locator('p')
    .last();

  readonly seatsInfo = this.page.getByText(/Seats \(\d+\)/);

  readonly qrCode = this.page.getByAltText('Ticket QR Code');

  readonly totalPaid = this.page
    .getByText('Total Paid', { exact: true })
    .locator('..')
    .getByText(/₹/);

  readonly paymentMethod = this.page
    .getByText('Payment', { exact: true })
    .locator('..')
    .locator('p')
    .last();

  readonly paymentId = this.page
    .getByText('Payment ID', { exact: true })
    .locator('..')
    .locator('p')
    .last();

  readonly bookingStatus = this.page.getByText(
    /Confirmed|Cancelled|Pending/i
  );

  readonly btn_cancelBooking = this.page.getByRole('button', {
    name: 'Cancel Booking',
    exact: true,
  });

  readonly modal_confirmCancel = this.page.getByRole('button', {
    name: /yes|confirm/i,
  });

  readonly status_cancelled = this.page.getByText('Cancelled', {
    exact: true,
  });

  readonly error_accessDenied = this.page.getByText(
    /not found|not authorized|forbidden|access denied|403/i
  );

  async cancelBooking() {
    await this.btn_cancelBooking.click();
    await this.modal_confirmCancel.click();
  }
}