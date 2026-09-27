import { test, expect } from '../../pageObjects/pageFixture';

test.describe('USER - Profile', { tag: '@profile' }, () => {
  test.beforeEach(async ({ loginPage, profilePage }) => {
    await loginPage.loginAsUser();
    await profilePage.open();
  });

  test('USR-PROFILE-01 - Profile shows current user information correctly', async ({ profilePage }) => {
    await expect(profilePage.profileTitle).toBeVisible();
    await expect(profilePage.txt_name).toHaveValue(/.+/);
    await expect(profilePage.txt_phone).toBeVisible();
    await expect(profilePage.txt_email).toHaveValue(/.+/);
  });

  test('USR-PROFILE-02 - Update profile info with valid data', async ({ profilePage }) => {
    const newName = `QA User ${Date.now()}`;

    await profilePage.updateName(newName);

    await expect(profilePage.txt_name).toHaveValue(newName);
  });

  test('USR-PROFILE-04 - Change password with correct current password', async ({ profilePage }) => {
    await profilePage.changePassword(
      process.env.TB_USER_PASSWORD!,
      process.env.TB_USER_PASSWORD!
    );

    await expect(profilePage.txt_currentPassword).toHaveValue('');
    await expect(profilePage.txt_newPassword).toHaveValue('');
    await expect(profilePage.txt_confirmNewPassword).toHaveValue('');
  });

  test('USR-PROFILE-05 - Change password with wrong current password', async ({ profilePage }) => {
    await profilePage.changePassword(
      'WrongCurrentPassword!',
      'NewPass@123'
    );

    await expect(profilePage.error_wrongCurrentPassword).toBeVisible();
  });

  test('USR-PROFILE-06 - Log out from Profile page', async ({ homePage, page }) => {
    await homePage.logout();

    await expect(page).toHaveURL(/\/login|\/$/);
  });
});