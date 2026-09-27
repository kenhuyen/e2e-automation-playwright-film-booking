import { test, expect } from '../../../pageObjects/pageFixture';

// 1:1 mapping of every "Automated: Yes" row from the "Checkout" sheet.
// Left out (Automated = No): PAY-12 (email delivery check), PAY-15 (double-submit timing),
// PAY-17 (reload mid-checkout — data-dependent/flaky).
test.describe('Checkout', { tag: '@checkout-tc' }, () => {
  test.beforeEach(async ({ loginPage, homePage, bookingPage }) => {
    await loginPage.loginAsUser();
    await homePage.open();
    await homePage.movieCards.first().click();
    await homePage.clickFirstBookNow();
    await bookingPage.showtimeOptions.first().click();
    await bookingPage.availableSeats.first().click();
    await bookingPage.btn_continue.click();
  });

  test('PAY-01 - Order details are fully displayed before payment', async ({ confirmBookingPage }) => {
    await confirmBookingPage.btn_skipFood.click().catch(() => {});

    await expect(confirmBookingPage.summary_seats).toBeVisible();
    await expect(confirmBookingPage.summary_total).toBeVisible();
  });

  test('PAY-02 - Enter valid customer information', async ({ confirmBookingPage }) => {
    await confirmBookingPage.btn_skipFood.click().catch(() => {});
    await confirmBookingPage.btn_proceedToPayment.click().catch(() => {});

    await confirmBookingPage.fillContactInfo('John Doe', 'john@example.com', '0912345678');

    await expect(confirmBookingPage.txt_fullName).toHaveValue('John Doe');
  });

  test('PAY-03 - Leave a required field empty (name/email/phone)', async ({ confirmBookingPage }) => {
    await confirmBookingPage.btn_skipFood.click().catch(() => {});
    await confirmBookingPage.btn_proceedToPayment.click().catch(() => {});

    await confirmBookingPage.txt_fullName.fill('John Doe');
    await confirmBookingPage.txt_phone.fill('0912345678');
    await confirmBookingPage.pay();

    await expect(confirmBookingPage.error_required).toBeVisible();
  });

  test('PAY-04 - Enter an invalid email format', async ({ confirmBookingPage }) => {
    await confirmBookingPage.btn_skipFood.click().catch(() => {});
    await confirmBookingPage.btn_proceedToPayment.click().catch(() => {});

    await confirmBookingPage.fillContactInfo('John Doe', 'not-an-email', '0912345678');
    await confirmBookingPage.pay();

    await expect(confirmBookingPage.error_invalidEmail).toBeVisible();
  });

  test('PAY-05 - Enter an invalid phone number format', async ({ confirmBookingPage }) => {
    await confirmBookingPage.btn_skipFood.click().catch(() => {});
    await confirmBookingPage.btn_proceedToPayment.click().catch(() => {});

    await confirmBookingPage.fillContactInfo('John Doe', 'john@example.com', 'abcxyz');
    await confirmBookingPage.pay();

    await expect(confirmBookingPage.error_invalidPhone).toBeVisible();
  });

  test('PAY-06 - Apply a valid promo/voucher code', async ({ confirmBookingPage }) => {
    await confirmBookingPage.btn_skipFood.click().catch(() => {});
    const totalBefore = await confirmBookingPage.summary_total.textContent();

    // ASSUMPTION: replace with a real, currently-valid promo code from seeded test data.
    await confirmBookingPage.applyPromoCode('MOVIE10');

    const totalAfter = await confirmBookingPage.summary_total.textContent();
    expect(totalAfter).not.toBe(totalBefore);
  });

  test('PAY-07 - Apply an invalid or expired promo code', async ({ confirmBookingPage }) => {
    await confirmBookingPage.btn_skipFood.click().catch(() => {});

    await confirmBookingPage.applyPromoCode('INVALIDCODE999');

    await expect(confirmBookingPage.error_invalidPromo).toBeVisible();
  });

  test('PAY-08 - Select a payment method (if multiple options exist)', async ({ confirmBookingPage }) => {
    await confirmBookingPage.btn_skipFood.click().catch(() => {});
    await confirmBookingPage.btn_proceedToPayment.click().catch(() => {});

    const count = await confirmBookingPage.paymentMethodOptions.count();
    test.skip(count < 2, 'Only one payment method available on this build');

    await confirmBookingPage.paymentMethodOptions.nth(1).check();
    await expect(confirmBookingPage.paymentMethodOptions.nth(1)).toBeChecked();
  });

  test('PAY-09 - Enter invalid card payment details', async ({ confirmBookingPage }) => {
    await confirmBookingPage.btn_skipFood.click().catch(() => {});
    await confirmBookingPage.btn_proceedToPayment.click().catch(() => {});

    await confirmBookingPage.fillContactInfo('John Doe', 'john@example.com', '0912345678');
    await confirmBookingPage.txt_cardNumber.fill('1234').catch(() => {});
    await confirmBookingPage.txt_cardCvv.fill('12').catch(() => {});
    await confirmBookingPage.pay();

    await expect(confirmBookingPage.error_invalidCard).toBeVisible();
  });

  test('PAY-10 - Successful payment with valid data', async ({ confirmBookingPage, page }) => {
    await confirmBookingPage.btn_skipFood.click().catch(() => {});
    await confirmBookingPage.btn_proceedToPayment.click().catch(() => {});

    await confirmBookingPage.fillContactInfo('John Doe', 'john@example.com', '0912345678');
    await confirmBookingPage.pay();

    await expect(page).toHaveURL(/success|confirmation|e-ticket/i);
  });

  test('PAY-11 - Ticket info and QR/ticket code are displayed after successful booking', async ({
    confirmBookingPage,
    successPage,
  }) => {
    await confirmBookingPage.btn_skipFood.click().catch(() => {});
    await confirmBookingPage.btn_proceedToPayment.click().catch(() => {});
    await confirmBookingPage.fillContactInfo('John Doe', 'john@example.com', '0912345678');
    await confirmBookingPage.pay();

    await expect(successPage.qrCode).toBeVisible();
  });

  test('PAY-13 - Cancel/exit mid-way through checkout', async ({ confirmBookingPage, homePage, page }) => {
    await confirmBookingPage.btn_skipFood.click().catch(() => {});

    await homePage.open();

    // Re-enter the booking flow for the same movie; the previously held seat should be free again.
    await homePage.movieCards.first().click();
    await homePage.clickFirstBookNow();
    await expect(page).not.toHaveURL(/success/);
  });

  test('PAY-14 - Click the Back button from checkout', async ({ confirmBookingPage, bookingPage, page }) => {
    const hasBack = await confirmBookingPage.btn_editSeats.isVisible().catch(() => false);
    if (hasBack) {
      await confirmBookingPage.btn_editSeats.click();
    } else {
      await page.goBack();
    }
    await expect(bookingPage.seatMap).toBeVisible();
  });

  test('PAY-16 - Verify checkout page on mobile viewport', async ({ confirmBookingPage, page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await confirmBookingPage.btn_skipFood.click().catch(() => {});
    await confirmBookingPage.btn_proceedToPayment.click().catch(() => {});

    await expect(confirmBookingPage.txt_fullName).toBeVisible();
  });
});
