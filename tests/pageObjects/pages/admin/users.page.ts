import { BasePage } from '../../base.page';

export default class AdminUsersPage extends BasePage {
  readonly userRows = this.page.locator('tbody tr');
  readonly txt_search = this.page.getByPlaceholder(/Search users.../i);
  readonly btn_disable = this.page.getByRole('button', { name: /Disable/i });
  readonly btn_delete = this.page.getByRole('button', { name: /Delete/i });
  readonly btn_enable = this.page.getByRole('button', { name: /Enable|Disable/i });
  readonly modal_confirm = this.page.getByRole('button', { name: /OK|Cancel/i });

  readonly status_suspended = this.page.getByText(/suspended|banned/i);
  readonly status_active = this.page.getByText(/active/i);

  async searchUser(term: string) {
    await this.txt_search.fill(term);
    await this.txt_search.press('Enter');
  }

  async suspendUserByRow(rowIndex = 0) {
    const row = this.userRows.nth(rowIndex);
    await row.getByRole('button', { name: /suspend|ban/i }).click();
    await this.modal_confirm.click();
  }
}
