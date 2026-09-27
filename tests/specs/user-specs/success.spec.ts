import { test, expect, Page } from '../../pageObjects/pageFixture';

async function completeSuccessfulPayment(
  page: Page,
  confirmBookingPage: any,
  successPage: any
) {
  await expect(
    confirmBookingPage.payButton
  ).toBeVisible({
    timeout: 10000,
  });

  await confirmBookingPage.clickPay();

  await expect(
    confirmBookingPage.mobileInput
  ).toBeVisible({
    timeout: 15000,
  });

  await confirmBookingPage.continuePayment();

  await expect(
    confirmBookingPage.netBankingOption
  ).toBeVisible({
    timeout: 15000,
  });

  await confirmBookingPage.selectNetBanking();

  await expect(
    confirmBookingPage.bankOfBaroda
  ).toBeVisible({
    timeout: 15000,
  });

  const paymentPagePromise =
    page.context().waitForEvent('page', {
      timeout: 15000,
    });

  await confirmBookingPage.bankOfBaroda.click({
    force: true,
  });

  const paymentPage =
    await paymentPagePromise;

  await paymentPage.waitForLoadState(
    'domcontentloaded'
  );

  const successButton =
    paymentPage.locator(
      'button.success[data-val="S"]'
    );

  await expect(
    successButton
  ).toBeVisible({
    timeout: 15000,
  });

  await successButton.click({
    force: true,
  });

  await paymentPage.waitForEvent(
    'close',
    {
      timeout: 10000,
    }
  ).catch(() => { });

  await page.waitForLoadState(
    'domcontentloaded'
  );

  await successPage.waitForPaymentSuccess();

  await expect(
    page
  ).not.toHaveURL(
    /\/confirm-booking$/,
    {
      timeout: 10000,
    }
  );

  await successPage.waitForTicket();

  await expect(
    successPage.bookingStatus
  ).toBeVisible({
    timeout: 15000,
  });

  await expect(
    successPage.paymentMethod
  ).toContainText(
    'Razorpay',
    {
      timeout: 15000,
    }
  );
}

test.describe(
  'USER - Payment Success / E-Ticket',
  { tag: '@success' },
  () => {
    test.beforeEach(
      async ({
        loginPage,
        homePage,
        bookingPage,
        confirmBookingPage,
      }) => {
        await loginPage.loginAsUser();

        await homePage.open();

        await homePage.clickFirstBookNow2();

        await expect(
          bookingPage.dateOptions.first()
        ).toBeVisible({
          timeout: 15000,
        });

        await expect(
          bookingPage.showtimeOptions.first()
        ).toBeVisible({
          timeout: 15000,
        });

        await bookingPage.showtimeOptions
          .first()
          .click();

        await expect(
          bookingPage.availableSeats.first()
        ).toBeVisible({
          timeout: 15000,
        });

        await bookingPage.availableSeats
          .first()
          .click();

        await expect(
          bookingPage.proceedToPayButton
        ).toBeVisible({
          timeout: 10000,
        });

        await bookingPage.proceedToPayButton.click();

        await expect(
          confirmBookingPage.pageTitle
        ).toBeVisible({
          timeout: 15000,
        });
      }
    );

    test(
      'SUCCESS-02 - E-Ticket displays complete booking information',
      async ({
        page,
        confirmBookingPage,
        successPage,
      }) => {
        await completeSuccessfulPayment(
          page,
          confirmBookingPage,
          successPage
        );

        await expect(
          successPage.movieTitle
        ).toBeVisible();

        await expect(
          successPage.bookingCode
        ).toBeVisible();

        await expect(
          successPage.showTime
        ).toBeVisible();

        await expect(
          successPage.showDate
        ).toBeVisible();

        await expect(
          successPage.screen
        ).toBeVisible();

        await expect(
          successPage.seatsInfo
        ).toBeVisible();

        await expect(
          successPage.priceBreakdown
        ).toBeVisible();

        await expect(
          successPage.totalPaid
        ).toBeVisible();

        await expect(
          successPage.paymentMethod
        ).toBeVisible();

        await expect(
          successPage.paymentId
        ).toBeVisible();

        await expect(
          successPage.bookingStatus
        ).toBeVisible();
      }
    );
    // test('SUCCESS-01 - Successful payment displays E-Ticket', async ({
    //   confirmBookingPage,
    //   successPage,
    //   page,
    // }) => {
    //   test.setTimeout(90000);

    //   await expect(confirmBookingPage.payButton).toBeVisible({
    //     timeout: 10000,
    //   });

    //   await confirmBookingPage.clickPay();

    //   await expect(confirmBookingPage.mobileInput).toBeVisible({
    //     timeout: 15000,
    //   });

    //   await confirmBookingPage.continuePayment();

    //   await expect(confirmBookingPage.netBankingOption).toBeVisible({
    //     timeout: 15000,
    //   });

    //   await confirmBookingPage.selectNetBanking();

    //   await expect(confirmBookingPage.bankOfBaroda).toBeVisible({
    //     timeout: 15000,
    //   });

    //   const paymentPagePromise = page.context().waitForEvent('page', {
    //     timeout: 15000,
    //   });

    //   await confirmBookingPage.bankOfBaroda.click({
    //     force: true,
    //   });

    //   const paymentPage = await paymentPagePromise;

    //   await paymentPage.waitForLoadState('domcontentloaded');

    //   const successButton = paymentPage.locator(
    //     'button.success[data-val="S"]'
    //   );

    //   await expect(successButton).toBeVisible({
    //     timeout: 15000,
    //   });

    //   await successButton.click({
    //     force: true,
    //   });

    //   await page.waitForLoadState('domcontentloaded');

    //   await expect
    //     .poll(
    //       async () => {
    //         return await page.locator('body').innerText();
    //       },
    //       {
    //         timeout: 30000,
    //         intervals: [1000, 2000, 3000],
    //       }
    //     )
    //     .toMatch(/E-TICKET/i);

    //   await expect(successPage.ticketLabel).toBeVisible({
    //     timeout: 5000,
    //   });
    // });
    test(
      'SUCCESS-03 - E-Ticket displays QR code',
      async ({
        page,
        confirmBookingPage,
        successPage,
      }) => {
        await completeSuccessfulPayment(
          page,
          confirmBookingPage,
          successPage
        );

        await expect(
          successPage.qrCode
        ).toBeVisible({
          timeout: 15000,
        });

        await expect(
          successPage.verifyTicketLink
        ).toBeVisible({
          timeout: 10000,
        });
      }
    );

    test(
      'SUCCESS-04 - Successful payment has Razorpay payment method',
      async ({
        page,
        confirmBookingPage,
        successPage,
      }) => {
        await completeSuccessfulPayment(
          page,
          confirmBookingPage,
          successPage
        );

        await expect(
          successPage.paymentMethod
        ).toContainText(
          'Razorpay'
        );
      }
    );

    test(
      'SUCCESS-05 - Successful payment generates booking code and payment ID',
      async ({
        page,
        confirmBookingPage,
        successPage,
      }) => {
        await completeSuccessfulPayment(
          page,
          confirmBookingPage,
          successPage
        );

        const bookingCode =
          await successPage.getBookingCode();

        const paymentId =
          await successPage.getPaymentId();

        expect(
          bookingCode
        ).not.toBe('');

        expect(
          paymentId
        ).not.toBe('');

        expect(
          bookingCode
        ).toMatch(/^MMS-/i);

        expect(
          paymentId
        ).not.toMatch(
          /^(undefined|null)$/i
        );
      }
    );

    test(
      'SUCCESS-06 - E-Ticket remains available after page reload',
      async ({
        page,
        confirmBookingPage,
        successPage,
      }) => {
        await completeSuccessfulPayment(
          page,
          confirmBookingPage,
          successPage
        );

        const bookingCodeBefore =
          await successPage.getBookingCode();

        const paymentIdBefore =
          await successPage.getPaymentId();

        expect(
          bookingCodeBefore
        ).not.toBe('');

        expect(
          paymentIdBefore
        ).not.toBe('');

        await successPage.reloadAndWait();

        await expect(
          successPage.ticketLabel
        ).toBeVisible();

        await expect(
          successPage.qrCode
        ).toBeVisible();

        await expect(
          successPage.bookingStatus
        ).toBeVisible();

        const bookingCodeAfter =
          await successPage.getBookingCode();

        const paymentIdAfter =
          await successPage.getPaymentId();

        expect(
          bookingCodeAfter
        ).toBe(
          bookingCodeBefore
        );

        expect(
          paymentIdAfter
        ).toBe(
          paymentIdBefore
        );
      }
    );
  }
);