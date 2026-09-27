import { test, expect } from '../../pageObjects/pageFixture';

async function reachConfirmBookingStep(
  homePage: any,
  bookingPage: any
) {
  await homePage.open();

  await homePage.clickFirstBookNow2();

  await expect(
    bookingPage.dateOptions.first()
  ).toBeVisible({
    timeout: 15000,
  });

  await bookingPage.showtimeOptions.first().click();

  await expect(
    bookingPage.availableSeats.first()
  ).toBeVisible({
    timeout: 15000,
  });

  const seat = bookingPage.availableSeats.first();

  await seat.scrollIntoViewIfNeeded();

  await expect(seat).toBeVisible();

  await seat.click();

  await expect(
    bookingPage.proceedToPayButton
  ).toBeVisible({
    timeout: 10000,
  });

  await bookingPage.proceedToPayButton.click();

  await expect(
    homePage.page.getByRole('heading', {
      name: 'Booking Summary',
      exact: true,
    })
  ).toBeVisible({
    timeout: 15000,
  });
}

test.describe(
  'USER - Confirm Booking (Food / Summary / Payment)',
  { tag: '@confirm-booking' },
  () => {
    test.beforeEach(
      async ({
        loginPage,
        homePage,
        bookingPage,
        confirmBookingPage,
      }) => {
        await loginPage.loginAsUser();

        await reachConfirmBookingStep(
          homePage,
          bookingPage
        );

        await expect(
          confirmBookingPage.pageTitle
        ).toBeVisible({
          timeout: 15000,
        });
      }
    );

    test(
      'USR-CFFOOD-02 - Add food item and update total price',
      async ({
        confirmBookingPage,
      }) => {
        await confirmBookingPage.openSnacks();

        const priceBefore =
          await confirmBookingPage.getTotalPriceText();

        await confirmBookingPage.addFirstFoodItem();

        const priceAfter =
          await confirmBookingPage.getTotalPriceText();

        expect(priceAfter).not.toBe(priceBefore);
      }
    );

    test(
      'USR-CFFOOD-05 - Proceed without selecting any food item',
      async ({
        confirmBookingPage,
      }) => {
        await expect(
          confirmBookingPage.payButton
        ).toBeVisible();

        await expect(
          confirmBookingPage.totalPrice
        ).toBeVisible();

        const totalBefore =
          await confirmBookingPage.getTotalPriceText();

        expect(totalBefore).toMatch(/₹/);

        await confirmBookingPage.payButton.click();
      }
    );

    test(
      'USR-CFSUM-01 - Booking summary displays movie and booking information',
      async ({
        confirmBookingPage,
      }) => {
        await expect(
          confirmBookingPage.pageTitle
        ).toBeVisible();

        await expect(
          confirmBookingPage.movieTitle
        ).toBeVisible();

        await expect(
          confirmBookingPage.priceBreakdown
        ).toBeVisible();

        await expect(
          confirmBookingPage.totalLabel
        ).toBeVisible();

        await expect(
          confirmBookingPage.totalPrice
        ).toBeVisible();

        await expect(
          confirmBookingPage.payButton
        ).toBeVisible();
      }
    );

    test(
      'USR-CFSUM-03 - Add snacks and update booking total',
      async ({
        confirmBookingPage,
      }) => {
        const priceBefore =
          await confirmBookingPage.getTotalPriceText();

        await confirmBookingPage.openSnacks();

        await expect(
          confirmBookingPage.foodAddButtons.first()
        ).toBeVisible();

        await confirmBookingPage.addFirstFoodItem();

        const priceAfter =
          await confirmBookingPage.getTotalPriceText();

        expect(priceAfter).not.toBe(priceBefore);
      }
    );

    test(
      'USR-CFPAY-02 - Payment button is available with the correct total',
      async ({
        confirmBookingPage,
      }) => {
        const total =
          await confirmBookingPage.getTotalPriceText();

        await expect(
          confirmBookingPage.payButton
        ).toBeVisible();

        await expect(
          confirmBookingPage.payButton
        ).toContainText(total.trim());
      }
    );


    test(
      'USR-CFPAY-04 - Payment failure keeps the payment flow on the failure screen',
      async ({ confirmBookingPage }) => {
        await expect(confirmBookingPage.payButton).toBeVisible({
          timeout: 10000,
        });

        await confirmBookingPage.clickPay();

        await expect(confirmBookingPage.mobileInput).toBeVisible({
          timeout: 15000,
        });

        await confirmBookingPage.continuePayment();

        await expect(confirmBookingPage.netBankingOption).toBeVisible({
          timeout: 15000,
        });

        await confirmBookingPage.selectNetBanking();

        await expect(confirmBookingPage.bankOfBaroda).toBeVisible({
          timeout: 10000,
        });

        const paymentPage =
          await confirmBookingPage.selectBankOfBaroda();

        await expect(
          paymentPage.getByRole('button', {
            name: 'Failure',
            exact: true,
          })
        ).toBeVisible({
          timeout: 15000,
        });

        await paymentPage.getByRole('button', {
          name: 'Failure',
          exact: true,
        }).click();
      }
    );
    test(
      'USR-CFPAY-05 - Successful payment reaches the success page',
      async ({ confirmBookingPage }) => {
        await expect(confirmBookingPage.payButton).toBeVisible({
          timeout: 10000,
        });

        await confirmBookingPage.clickPay();

        await expect(confirmBookingPage.mobileInput).toBeVisible({
          timeout: 15000,
        });

        await confirmBookingPage.continuePayment();

        await expect(confirmBookingPage.netBankingOption).toBeVisible({
          timeout: 15000,
        });

        await confirmBookingPage.selectNetBanking();

        await expect(confirmBookingPage.bankOfBaroda).toBeVisible({
          timeout: 10000,
        });

        const paymentPage =
          await confirmBookingPage.selectBankOfBaroda();

        await expect(
          paymentPage.getByRole('button', {
            name: 'Success',
            exact: true,
          })
        ).toBeVisible({
          timeout: 15000,
        });

        await paymentPage.getByRole('button', {
          name: 'Success',
          exact: true,
        }).click();
      }
    );
  }
);