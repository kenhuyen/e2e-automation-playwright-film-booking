import { BasePage } from '../../base.page';

export default class TheatreBookingsPage extends BasePage {
  readonly bookingRows = this.page.locator('div.glass-strong.rounded-xl');
  readonly filter_status = this.page.getByLabel(/status/i);
  readonly txt_scanCode = this.page.getByPlaceholder(/scan|booking code/i);
  readonly btn_checkIn = this.page.getByRole('button', { name: /check.?in/i });

  readonly status_checkedIn = this.page.getByText(/checked.?in/i);
  readonly error_alreadyUsed = this.page.getByText(/already used|already checked.?in/i);
  readonly error_accessDenied = this.page.getByText(/not (found|authorized)|403/i);

  async checkInByCode(code: string) {
    await this.txt_scanCode.fill(code);
    await this.btn_checkIn.click();
  }

  async openFirstBooking() {
    await this.bookingRows.first().click();
  }
}
