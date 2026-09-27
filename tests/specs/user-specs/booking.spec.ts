import { test, expect } from '../../pageObjects/pageFixture';

test.describe(
  'USER - Booking (Date / Showtime / Seat)',
  { tag: '@booking' },
  () => {
    test.beforeEach(async ({ loginPage, homePage, bookingPage, page }) => {
      await loginPage.loginAsUser();

      await homePage.open();

      await homePage.clickFirstBookNow2();

      await expect(bookingPage.dateOptions.first()).toBeVisible({
        timeout: 15000,
      });

      await expect(bookingPage.showtimeOptions.first()).toBeVisible({
        timeout: 15000,
      });
    });
    test('USR-BKDATE-02 - Select a different available date updates showtimes', async ({
      bookingPage,
    }) => {
      const dateCount = await bookingPage.dateOptions.count();

      test.skip(
        dateCount < 2,
        'Need at least 2 selectable dates to run this case'
      );

      await bookingPage.dateOptions.nth(1).click();

      await expect(
        bookingPage.showtimeOptions.first()
      ).toBeVisible();
    });

    test('USR-BKSHOW-02 - Select a showtime proceeds to seat selection', async ({
      bookingPage,
    }) => {
      await bookingPage.showtimeOptions.first().click();

      await expect(
        bookingPage.availableSeats.first()
      ).toBeVisible();
    });

    test('USR-BKSEAT-02 - Select an available seat updates total price', async ({
      bookingPage,
    }) => {
      await bookingPage.showtimeOptions.first().click();

      const seat = bookingPage.availableSeats.first();

      await expect(seat).toBeVisible();

      await seat.click();

      const priceAfter = await bookingPage.getTotalPriceText();

      expect(priceAfter).toMatch(/₹\s*\d+/);
    });

    test('USR-BKSEAT-03 - Deselect a chosen seat reverts the price', async ({
      bookingPage,
    }) => {
      await bookingPage.showtimeOptions.first().click();

      const seat = bookingPage.availableSeats.first();

      await expect(seat).toBeVisible();

      await seat.click();

      const priceAfterSelect = await bookingPage.getTotalPriceText();

      expect(priceAfterSelect).toMatch(/₹\s*\d+/);

      await seat.click();

      await expect(bookingPage.selectedSeatPrice).not.toBeVisible();
    });

    test('USR-BKSEAT-04 - Clicking an already-booked seat has no effect', async ({
      bookingPage,
    }) => {
      await bookingPage.showtimeOptions.first().click();

      const bookedCount = await bookingPage.bookedSeats.count();

      test.skip(
        bookedCount === 0,
        'No booked seat available in current data to test against'
      );

      const priceBefore = await bookingPage.getTotalPriceText();

      await bookingPage.bookedSeats.first().click({ force: true });

      const priceAfter = await bookingPage.getTotalPriceText();

      expect(priceAfter).toBe(priceBefore);
    });
    test('USR-BKSEAT-06 - Proceed to Pay is displayed after selecting a seat', async ({
      bookingPage,
    }) => {
      await bookingPage.showtimeOptions.first().click();

      await expect(
        bookingPage.proceedToPayButton
      ).not.toBeVisible();

      await bookingPage.availableSeats.first().click();

      await expect(
        bookingPage.proceedToPayButton
      ).toBeVisible();
    });
  }
);