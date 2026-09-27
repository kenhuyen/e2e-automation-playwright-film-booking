import { BasePage } from '../../base.page';

export default class BookingPage extends BasePage {
  readonly dateOptions = this.page.locator(
    'h3:has-text("Select Date") + div button'
  );

  readonly disabledDates = this.page.getByRole('button', {
    disabled: true,
  });

  readonly showtimeOptions = this.page.locator(
    'h3:has-text("Select Showtime") + div button'
  );

  readonly soldOutBadge = this.page.getByText(/sold out/i);

  readonly availableSeats = this.page.locator(
    'button[title*="— ₹"].cursor-pointer'
  );

  readonly bookedSeats = this.page.locator(
    'button[title*="— ₹"][class*="bg-gray-800"]'
  );

  readonly proceedToPayButton = this.page.getByRole('button', {
    name: /proceed to pay/i,
  });
  readonly selectedSeatPrice = this.page.locator(
    'p.text-2xl.font-bold.text-white.mt-0\\.5'
  );
  readonly btnBack = this.page
    .getByRole('button', { name: /back/i })
    .or(this.page.getByRole('link', { name: /back/i }));

  async selectDateByLabel(label: string) {
    await this.dateOptions
      .filter({ hasText: new RegExp(label, 'i') })
      .click();
  }

  async selectShowtimeByLabel(label: string) {
    await this.showtimeOptions
      .filter({ hasText: new RegExp(label, 'i') })
      .click();
  }

  async selectSeatByLabel(seatLabel: string) {
    await this.page
      .locator('button[title*="— ₹"].cursor-pointer')
      .filter({ hasText: new RegExp(`^${seatLabel}$`, 'i') })
      .click();
  }

  async selectFirstAvailableSeat() {
    await this.availableSeats.first().click();
  }

  async selectFirstAvailableSeats(count: number) {
    for (let i = 0; i < count; i++) {
      await this.availableSeats.nth(i).click();
    }
  }

  async getTotalPriceText(): Promise<string> {
    return (await this.selectedSeatPrice.textContent()) ?? '';
  }

}