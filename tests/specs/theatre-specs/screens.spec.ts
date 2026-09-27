import { test, expect } from '../../pageObjects/pageFixture';

test.describe(
  'THEATRE - Screens',
  { tag: '@theatre-screens' },
  () => {
    test.beforeEach(async ({
      loginPage,
      theatreOverviewPage,
    }) => {
      await loginPage.loginAsTheatre();
      await theatreOverviewPage.open();
      await theatreOverviewPage.nav.screens.click();
    });

    test('THR_SCREEN-01 - Add a new screen', async ({
      theatreScreensPage,
    }) => {
      const { screenName } =
        await theatreScreensPage.addScreen();

      await expect(
        theatreScreensPage.getScreenCard(screenName)
      ).toBeVisible();
    });

    test('THR_SCREEN-02 - Add screen with empty required fields', async ({
      theatreScreensPage,
    }) => {
      await theatreScreensPage.btn_addScreen.click();

      await theatreScreensPage.txt_screenName.fill('');
      await theatreScreensPage.txt_number.fill('');
      await theatreScreensPage.txt_rows.fill('');
      await theatreScreensPage.txt_seatsPerRow.fill('');

      await theatreScreensPage.btn_saveScreen.click();

      await expect(
        theatreScreensPage.screenForm
      ).toBeVisible();
    });

    test('THR_SCREEN-03 - Edit a screen', async ({
      theatreScreensPage,
    }) => {
      const { screenName } =
        await theatreScreensPage.addScreen();

      await expect(
        theatreScreensPage.getScreenCard(screenName)
      ).toBeVisible();

      const editedName = `Edited Screen ${Date.now()}`;

      await theatreScreensPage.editScreen(
        screenName,
        editedName
      );

      await expect(
        theatreScreensPage.getScreenCard(editedName)
      ).toBeVisible();

      await expect(
        theatreScreensPage.getScreenCard(screenName)
      ).toHaveCount(0);
    });

    test('THR_SCREEN-04 - Delete a screen', async ({
      theatreScreensPage,
    }) => {
      const { screenName } =
        await theatreScreensPage.addScreen();

      await expect(
        theatreScreensPage.getScreenCard(screenName)
      ).toBeVisible();

      theatreScreensPage.page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm');
        expect(dialog.message()).toBe(
          'Delete this screen? (Blocked if movies still assigned)'
        );

        await dialog.accept();
      });

      await theatreScreensPage.deleteScreenByName(screenName);

      await expect(
        theatreScreensPage.getScreenCard(screenName)
      ).toHaveCount(0);
    });
    test('THR_SCREEN-05 - Cancel delete screen', async ({
      theatreScreensPage,
    }) => {
      const { screenName } =
        await theatreScreensPage.addScreen();

      await expect(
        theatreScreensPage.getScreenCard(screenName)
      ).toBeVisible();

      theatreScreensPage.page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm');
        expect(dialog.message()).toBe(
          'Delete this screen? (Blocked if movies still assigned)'
        );

        await dialog.dismiss();
      });

      await theatreScreensPage.deleteScreenByName(screenName);

      await expect(
        theatreScreensPage.getScreenCard(screenName)
      ).toBeVisible();
    });
  }
);