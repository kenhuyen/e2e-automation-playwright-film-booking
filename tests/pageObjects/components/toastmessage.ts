import { BasePageComponent } from '../base.pageComponents';

export default class ToastMessage extends BasePageComponent {
  readonly success_message = this.page.locator(
    "//div[contains(@class,'Toastify__toast--success')]",
  );
  readonly fail_message = this.page.locator(
    "//div[contains(@class,'Toastify__toast--error')]",
  );
}
