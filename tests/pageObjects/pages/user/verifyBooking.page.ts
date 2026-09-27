import { BasePage } from '../../base.page';

// ASSUMPTION: a public/authenticated form where the user pastes a booking code or QR
// payload to check its validity (valid / used / cancelled / not found).
export default class VerifyBookingPage extends BasePage {
  readonly txt_bookingCode = this.page.getByPlaceholder(/booking code|ticket code|qr/i);
  readonly btn_verify = this.page.getByRole('button', { name: /verify|check/i });

  readonly result_valid = this.page.getByText(/valid.*(not used|entry allowed)/i);
  readonly result_alreadyUsed = this.page.getByText(/already used|checked in/i);
  readonly result_invalid = this.page.getByText(/invalid.*code|not found/i);
  readonly result_cancelled = this.page.getByText(/cancelled/i);

  async open() {
    // ASSUMPTION: reachable at /verify-booking — verify against the real app.
    await super.open('/verify-booking');
  }

  async verify(code: string) {
    await this.txt_bookingCode.fill(code);
    await this.btn_verify.click();
  }
}
