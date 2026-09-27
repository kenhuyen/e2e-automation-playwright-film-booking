import { BasePage } from '../../base.page';

export default class ProfilePage extends BasePage {
  readonly userMenuButton = this.page.getByRole('button', {
    name: /Rahul/i,
  });

  readonly profileMenuItem = this.page.getByRole('link', {
    name: 'Profile',
    exact: true,
  });

  readonly profileTitle = this.page.getByRole('heading', {
    name: 'My Profile',
    exact: true,
  });

  readonly profileForm = this.page.locator('form').first();

  readonly txt_name = this.page
    .getByText('Full Name', { exact: true })
    .locator('..')
    .locator('input');

  readonly txt_phone = this.page.getByPlaceholder('Your phone number');

  readonly txt_email = this.profileForm.locator('input[disabled]');

  readonly btn_save = this.page.getByRole('button', {
    name: 'Save Changes',
    exact: true,
  });

  readonly txt_currentPassword = this.page.getByPlaceholder(
    'Enter current password'
  );

  readonly txt_newPassword = this.page.getByPlaceholder(
    'Enter new password'
  );

  readonly txt_confirmNewPassword = this.page.getByPlaceholder(
    'Confirm new password'
  );

  readonly btn_changePassword = this.page.getByRole('button', {
    name: 'Change Password',
    exact: true,
  });

  readonly toast_success = this.page.getByText(
    /updated|saved successfully|profile updated/i
  );

  readonly error_wrongCurrentPassword = this.page.getByText(
    /current password.*(incorrect|wrong)|incorrect.*current password/i
  );

  async open() {
    await this.userMenuButton.waitFor({
      state: 'visible',
      timeout: 10000,
    });

    await this.userMenuButton.click();

    await this.profileMenuItem.waitFor({
      state: 'visible',
      timeout: 5000,
    });

    await this.profileMenuItem.click();

    await this.page.waitForURL(/\/profile$/);

    await this.profileTitle.waitFor({
      state: 'visible',
      timeout: 10000,
    });
  }

  async updateName(name: string) {
    await this.txt_name.fill(name);
    await this.btn_save.click();
  }

  async changePassword(current: string, next: string) {
    await this.txt_currentPassword.fill(current);
    await this.txt_newPassword.fill(next);
    await this.txt_confirmNewPassword.fill(next);
    await this.btn_changePassword.click();
  }
}