import { BasePage } from '../../base.page';

export default class TheatreFoodMenuPage extends BasePage {
  readonly foodItems = this.page.locator(
    'div.glass-strong.rounded-xl.p-4.flex.items-center.gap-3'
  );

  readonly btn_addItem = this.page.getByRole('button', {
    name: /add item/i,
  });

  readonly btn_save = this.page.getByRole('button', {
    name: /save/i,
  });

  readonly txt_name = this.page.getByPlaceholder('Name *');

  readonly txt_price = this.page.getByPlaceholder(/Price/i);

  readonly select_category = this.page.locator('select').first();

  readonly txt_imageUrl = this.page.getByPlaceholder('Image URL');

  readonly txt_description = this.page.getByPlaceholder('Description');

  readonly checkbox_vegetarian = this.page.getByRole('checkbox', {
    name: /vegetarian/i,
  });

  async addFoodItem(
    name: string,
    price: string,
    category: string,
    imageUrl: string,
    description: string,
    vegetarian = false
  ) {
    await this.btn_addItem.click();

    await this.txt_name.fill(name);
    await this.txt_price.fill(price);

    await this.select_category.selectOption({
      label: category,
    });

    await this.txt_imageUrl.fill(imageUrl);
    await this.txt_description.fill(description);

    if (vegetarian) {
      await this.checkbox_vegetarian.check();
    }

    await this.btn_save.click();
  }

  async deleteItemByName(name: string) {
    const row = this.foodItems.filter({
      hasText: name,
    });

    await this.page.once('dialog', async dialog => {
      await dialog.accept();
    });

    await row.getByRole('button', {
      name: /delete/i,
    }).click();
  }
}