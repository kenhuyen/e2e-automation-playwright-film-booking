import { BasePage } from '../../base.page';

export default class TheatreRegisterPage extends BasePage {
  readonly txt_theatreName = this.page.locator(
    'input[name="name"]'
  );

  readonly txt_email = this.page.locator(
    'input[name="email"]'
  );

  readonly txt_password = this.page.locator(
    'input[name="password"]'
  );

  readonly txt_city = this.page.locator(
    'input[name="city"]'
  );

  readonly txt_phone = this.page.locator(
    'input[name="phone"]'
  );

  readonly txt_address = this.page.locator(
    'input[name="address"]'
  );

  readonly btn_register = this.page.getByRole('button', {
    name: 'Register Theatre',
  });

  readonly status_pendingApproval =
    this.page.getByText(/pending approval/i);

  readonly error_emailInUse = this.page.getByText(
    /email.*(already|used|exists)|already.*email/i
  );

  async open() {
    await this.page.goto(
      'https://markmyseat.netlify.app/theatre/register'
    );
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    city?: string;
    phone?: string;
    address?: string;
  }) {
    await this.txt_theatreName.fill(data.name);
    await this.txt_email.fill(data.email);
    await this.txt_password.fill(data.password);

    if (data.city) {
      await this.txt_city.fill(data.city);
    }

    if (data.phone) {
      await this.txt_phone.fill(data.phone);
    }

    if (data.address) {
      await this.txt_address.fill(data.address);
    }

    await this.btn_register.click();
  }
}