import { BasePage } from '../../base.page';

export default class RegisterPage extends BasePage {
  readonly txt_name = this.page.getByPlaceholder('John Doe');
  readonly txt_email = this.page.getByPlaceholder('you@example.com');
  readonly txt_password = this.page.getByPlaceholder('Create a strong password');
  readonly btn_register = this.page.getByRole('button', { name: 'Create Account', exact: true });

  readonly error_emailInUse = this.page.getByText(/email.*(already|exist)/i);
  readonly error_passwordMismatch = this.page.getByText(/passwords?.*(match|not match)/i);
  readonly error_weakPassword = this.page.getByText('Password must be at least 6 characters.', { exact: true });

  async open() {
    await super.open('/register');
  }

  async register(name: string, email: string, password: string) {
    await this.txt_name.fill(name);
    await this.txt_email.fill(email);
    await this.txt_password.fill(password);
    await this.btn_register.click();
  }
}