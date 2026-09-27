import { BasePage } from '../../base.page';

export default class TheatreScreensPage extends BasePage {
  readonly btn_addScreen = this.page.getByRole('button', {
    name: /add screen/i,
  });

  readonly screenForm = this.page
    .locator('div.glass-strong.rounded-2xl')
    .filter({
      has: this.page.getByRole('button', {
        name: /save screen/i,
      }),
    });

  readonly txt_screenName = this.screenForm.locator('input').nth(0);
  readonly txt_number = this.screenForm.locator('input').nth(1);
  readonly txt_rows = this.screenForm.locator('input').nth(2);
  readonly txt_seatsPerRow = this.screenForm.locator('input').nth(3);

  readonly btn_addCategory = this.screenForm.getByText(
    '+ Add Category',
    { exact: true }
  );

  readonly categoryRows = this.screenForm.locator(
    'div.grid.grid-cols-4.gap-2.mb-2'
  );

  readonly btn_saveScreen = this.screenForm.getByRole('button', {
    name: /save screen/i,
  });

  getScreenCard(name: string) {
    return this.page
      .locator('div.glass-strong.rounded-xl.p-4')
      .filter({
        hasText: name,
      });
  }

  async addScreen() {
    await this.btn_addScreen.click();

    const screenName = await this.txt_screenName.inputValue();
    const number = await this.txt_number.inputValue();

    await this.btn_saveScreen.click();

    await this.page.waitForTimeout(1000);

    return {
      screenName,
      number,
    };
  }

  async addCategory(
    name: string,
    rows: string,
    price: string
  ) {
    await this.btn_addCategory.click();

    const categoryRow = this.categoryRows.last();

    await categoryRow
      .getByPlaceholder('Name')
      .fill(name);

    await categoryRow
      .getByPlaceholder('Rows (A,B)')
      .fill(rows);

    await categoryRow
      .getByPlaceholder('Price')
      .fill(price);
  }

  async saveScreen() {
    await this.btn_saveScreen.click();
    await this.page.waitForTimeout(1000);
  }

  async editScreen(
    oldName: string,
    newName: string
  ) {
    const screenCard = this.getScreenCard(oldName);

    await screenCard
      .getByRole('button', { name: /^Edit$/i })
      .click();

    await this.txt_screenName.fill(newName);

    await this.btn_saveScreen.click();

    await this.page.waitForTimeout(1000);
  }

  async deleteScreenByName(name: string) {
    const screenCard = this.getScreenCard(name);

    await screenCard
      .getByRole('button', { name: /^Delete$/i })
      .click();
  }
}