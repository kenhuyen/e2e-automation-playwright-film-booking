import { BasePage } from '../base.page';

export default class LoginPage extends BasePage {
  readonly txt_email = this.page.locator("//input[@type='email']");
  readonly txt_password = this.page.locator("//input[@type='password']");
  readonly btn_login = this.page.locator("button[type='submit']");
  readonly error_invalidCredentials = this.page.getByText('Invalid credentials');
  // ASSUMPTION: eye icon toggling type=password <-> type=text; adjust selector once confirmed.
  readonly btn_togglePasswordVisibility = this.page.locator("button[aria-label*='password' i], .password-toggle, [data-testid='toggle-password']");
  readonly link_forgotPassword = this.page.getByRole('link', { name: /forgot password/i });
  async login(email: string, password: string) {
    await this.txt_email.fill(email);
    await this.txt_password.fill(password);
    await this.page.waitForTimeout(500);
    await Promise.all([this.btn_login.click()]);
  }
  async loginUser(email: string, password: string) {
    await this.txt_email.fill(email);
    await this.txt_password.fill(password);
    await this.page.waitForTimeout(500);
    await this.btn_login.click();
    await this.page.waitForURL(url => !url.pathname.endsWith('/login'), {
    timeout: 15000,
  });
  }
  async open() {
    await super.open('/login');
  }

  // Convenience helpers so spec files don't repeat env var wiring.
  async loginAsUser() {
    await this.open();
    await this.loginUser(process.env.TB_USER_EMAIL!, process.env.TB_USER_PASSWORD!);
  }

  async loginAsTheatre() {
    await this.open();
    await this.login(process.env.TB_THEATRE_EMAIL!, process.env.TB_THEATRE_PASSWORD!);
  }

  async loginAsAdmin() {
    await this.open();
    await this.login(process.env.TB_ADMIN_EMAIL!, process.env.TB_ADMIN_PASSWORD!);
  }
}
