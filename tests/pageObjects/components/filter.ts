import { BasePageComponent } from '../base.pageComponents';
const commons = require('../../common/commons');

export default class Filter extends BasePageComponent {
  readonly btn_removeFilter = this.page.locator(
    "//*[contains(@class, 'TagFilterItem___StyledBox')]//*[contains(@class, 'RemoveIcon')]",
  );
  readonly tag_name = this.page.locator("//div[contains(@class, 'SearchingTag')]/p")

  async remove_all_filter() {
    const [index] = await commons.waitForLocator([this.btn_removeFilter]);
    const isVisible = (await index) === 0;
    if (isVisible) {
      await this.page.waitForTimeout(3000);
      await this.btn_removeFilter.click();
    }
  }

  async get_all_tag() {
    const tags = await this.page.locator("//div[contains(@class, 'SearchingTag')]/p")
    var tags_list: string[] = await tags.allTextContents()
    return tags_list
  }

  async choose_tag_and_back_if_no_result(tags_list: string[]) {
    const no_result_xpath = this.page.locator("//p[text()='No Results']")
    for (let i = 0; i < tags_list.length; i++) {
      const tag_name = tags_list[i];
      const tag_locator = this.page.locator(`//div[contains(@class, "SearchingTag")]/p[text()="${tag_name}"]`)
      await tag_locator.click()
      await this.page.waitForLoadState("domcontentloaded")
      let [no_result_display] = await commons.waitForLocator([no_result_xpath], 10000)
      
      if (no_result_display === 0) {
        await tag_locator.click()
      }
      else {
        return tags_list[i]
      }
    }
  }
}
