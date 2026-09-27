import { BasePage } from '../../base.page';

export default class SuccessPage extends BasePage {
  readonly ticketCard = this.page
    .locator('div.glass-card')
    .filter({ hasText: 'E-Ticket' })
    .first();

  readonly ticketLabel = this.page.getByText('E-Ticket', {
    exact: true,
  });

  readonly movieTitle = this.page.getByRole('heading', {
    level: 1,
  });

  readonly bookingCode = this.page.locator(
    'p.text-xs.text-primary.font-mono'
  );

  readonly showTime = this.page
    .getByText('Show Time', {
      exact: true,
    })
    .locator('..')
    .locator('p')
    .last();

  readonly showDate = this.page
    .getByText('Show Date', {
      exact: true,
    })
    .locator('..')
    .locator('p')
    .last();

  readonly screen = this.page
    .getByText('Screen', {
      exact: true,
    })
    .locator('..')
    .locator('p')
    .last();

  readonly seatsInfo = this.page.getByText(
    /Seats \(\d+\)/
  );

  readonly seatList = this.page
    .getByText(/Seats \(\d+\)/)
    .locator('..')
    .locator('span');

  readonly priceBreakdown = this.page.getByText(
    'Price Breakdown',
    {
      exact: true,
    }
  );

  readonly totalPaid = this.page
    .getByText('Total Paid', {
      exact: true,
    })
    .locator('..')
    .getByText(/₹/);

  readonly paymentMethod = this.page
    .getByText('Payment', {
      exact: true,
    })
    .locator('..')
    .locator('p')
    .last();

  readonly paymentId = this.page
    .getByText('Payment ID', {
      exact: true,
    })
    .locator('..')
    .locator('p')
    .last();

  readonly bookingStatus = this.page.getByText(
    'Confirmed',
    {
      exact: true,
    }
  );

  readonly qrCode = this.page.getByAltText(
    'Ticket QR Code'
  );

  readonly verifyTicketLink = this.page.locator(
    'a[href*="/verify/"]'
  );

  readonly processing = this.page.getByText(
    'Processing...',
    {
      exact: true,
    }
  );

  async waitForTicket() {
    await this.ticketLabel.waitFor({
      state: 'visible',
      timeout: 20000,
    });

    await this.movieTitle.waitFor({
      state: 'visible',
      timeout: 10000,
    });
  }

  async waitForPaymentSuccess() {
    const startTime = Date.now();
    const timeout = 60000;

    while (Date.now() - startTime < timeout) {
      if (
        await this.ticketLabel
          .isVisible()
          .catch(() => false)
      ) {
        return;
      }

      await this.page.waitForTimeout(2000);
    }

    throw new Error(
      `Payment did not complete within 60 seconds. Current URL: ${this.page.url()}. Processing visible: ${await this.processing
        .isVisible()
        .catch(() => false)}. E-Ticket visible: ${await this.ticketLabel
        .isVisible()
        .catch(() => false)}.`
    );
  }

  async reloadAndWait() {
    await this.page.reload({
      waitUntil: 'domcontentloaded',
    });

    await this.waitForTicket();
  }

  async getBookingCode() {
    return (
      (
        await this.bookingCode.textContent()
      )?.trim() ?? ''
    );
  }

  async getMovieTitle() {
    return (
      (
        await this.movieTitle.textContent()
      )?.trim() ?? ''
    );
  }

  async getPaymentId() {
    return (
      (
        await this.paymentId.textContent()
      )?.trim() ?? ''
    );
  }

  async getTotalPaid() {
    return (
      (
        await this.totalPaid.textContent()
      )?.trim() ?? ''
    );
  }
}