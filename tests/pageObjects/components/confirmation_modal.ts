import { BasePageComponent } from '../base.pageComponents';

export default class ModalComponent extends BasePageComponent {
  readonly title = this.page.locator("//div[contains(@class,'w-16 h-16')]/following-sibling::h2[1]");
  readonly content = this.page.locator("//p[@class='text-gray-500 mb-6']");
  readonly cancel_button = this.page.locator("(//button[contains(@class,'flex-1 py-3')])[1]");
  readonly yes_button = this.page.locator("(//button[contains(@class,'flex-1 py-3')])[2]");
}
