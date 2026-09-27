import { BasePageComponent } from '../base.pageComponents';
const commons = require('../../common/commons');

export default class AllowCookiesPopup extends BasePageComponent {
  readonly btn_allowAll = this.page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
  readonly btn_allowSelection = this.page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowallSelection');
  readonly btn_deny = this.page.locator('#CybotCookiebotDialogBodyButtonDecline');

  async allow_cookie() {
    const [index] = await commons.waitForLocator([this.btn_allowAll]);
    const isVisible = (await index) === 0;
    if (isVisible) {
      await this.page.waitForTimeout(3000);
      await this.btn_allowAll.click();
    }
  }
}
