import { BasePage } from '../../base.page';

export default class AdminTheatresPage extends BasePage {
  readonly theatreRows = this.page.locator('tbody tr');
  readonly filter_status = this.page.getByLabel(/status/i);
   readonly txt_search = this.page.getByPlaceholder(/Search theatres.../i);
  readonly btn_approve = this.page.getByRole('button', { name: /approve/i });
  readonly btn_reject = this.page.getByRole('button', { name: /reject/i });
  readonly btn_suspend = this.page.getByRole('button', { name: /suspend/i });
  readonly modal_confirm = this.page.getByRole('button', { name: /OK|Cancel/i });
  readonly txt_rejectReason = this.page.getByPlaceholder(/reason/i);

  readonly status_pending = this.page.getByText(/pending/i);
  readonly status_approved = this.page.getByText(/approved/i);
  readonly status_rejected = this.page.getByText(/rejected/i);
  readonly status_suspended = this.page.getByText(/suspended/i);

  async approveByRow(rowIndex = 0) {
    const row = this.theatreRows.nth(rowIndex);
    await row.getByRole('button', { name: /approve/i }).click();
    await this.modal_confirm.click();
  }

  async rejectByRow(rowIndex = 0, reason?: string) {
    const row = this.theatreRows.nth(rowIndex);
    await row.getByRole('button', { name: /reject/i }).click();
    if (reason && (await this.txt_rejectReason.isVisible().catch(() => false))) {
      await this.txt_rejectReason.fill(reason);
    }
    await this.modal_confirm.click();
  }
}
