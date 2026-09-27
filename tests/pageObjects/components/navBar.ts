import { BasePageComponent } from '../base.pageComponents';

export default class NavBar extends BasePageComponent {
  readonly links = {
    home: this.page.locator("//img[@alt='Logo']"),
    products: this.page.locator("body div nav a:nth-child(1)"),
    collections: this.page.locator("body div nav a:nth-child(2)"),
    orders: this.page.locator("body div nav a:nth-child(3)"),
    cart: this.page.locator("body div nav a:nth-child(4)")
  };

  readonly userAvatar = this.page.locator("//div[contains(@class,'text-right hidden')]/following-sibling::div[1]");
  readonly btn_logout = this.page.locator('button').filter({ hasText: 'Đăng xuất' }).first()

  readonly userAvatar_dropdown = {
    information: this.page.locator('a').filter({ hasText: 'Thông tin cá nhân' }).first(),
    logout: this.page.locator("(//li[text()='Logout'])[2]"),
  };
  readonly searchInput = this.page.locator("//input[@placeholder='Tìm kiếm sản phẩm, thương hiệu...']");
}
