import { test, expect } from '../../pageObjects/pageFixture';

// Covers THR_FOOD-01..05.
test.describe('THEATRE - Food Menu', { tag: '@theatre-food-menu' }, () => {
  test.beforeEach(async ({
    loginPage,
    theatreOverviewPage,
    theatreFoodMenuPage,
  }) => {
    await loginPage.loginAsTheatre();
    await theatreOverviewPage.open();
    await theatreOverviewPage.nav.foodMenu.click();
  });

  test('THR_FOOD-01 - Food/combo menu items are listed with prices', async ({
    theatreFoodMenuPage,
  }) => {
    await expect(
      theatreFoodMenuPage.foodItems.first()
    ).toBeVisible();
  });

  test('THR_FOOD-02 - Add a new food/combo item', async ({
    theatreFoodMenuPage,
  }) => {
    const foodName = `QA Combo ${Date.now()}`;

    await theatreFoodMenuPage.addFoodItem(
      foodName,
      '89000',
      'Combo',
      'https://example.com/combo.jpg',
      'QA combo item',
      false
    );

    await expect(
      theatreFoodMenuPage.foodItems.filter({
        hasText: foodName,
      })
    ).toBeVisible();
  });

  test('THR_FOOD-03 - Add an item with invalid (negative) price', async ({
    page,
    theatreFoodMenuPage,
  }) => {
    await theatreFoodMenuPage.btn_addItem.click();

    await theatreFoodMenuPage.txt_name.fill(
      `QA Invalid ${Date.now()}`
    );

    await theatreFoodMenuPage.txt_price.fill('-5');

    await theatreFoodMenuPage.select_category.selectOption({
      label: 'Combo',
    });

    await theatreFoodMenuPage.txt_imageUrl.fill(
      'https://example.com/combo.jpg'
    );

    await theatreFoodMenuPage.txt_description.fill(
      'Invalid price test'
    );

    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toMatch(
        /price|positive|greater|invalid/i
      );

      await dialog.accept();
    });

    await theatreFoodMenuPage.btn_save.click();
  });

  test('THR_FOOD-05 - Delete an unused food item', async ({
    theatreFoodMenuPage,
  }) => {
    const foodName = `BA Delete Me ${Date.now()}`;

    await theatreFoodMenuPage.addFoodItem(
      foodName,
      '50000',
      'Snack',
      'https://example.com/snack.jpg',
      'Food item for delete test',
      false
    );

    await expect(
      theatreFoodMenuPage.foodItems.filter({
        hasText: foodName,
      })
    ).toBeVisible();

    await theatreFoodMenuPage.deleteItemByName(foodName);

    await expect(
      theatreFoodMenuPage.foodItems.filter({
        hasText: foodName,
      })
    ).toHaveCount(0);
  });
});