import { test, expect } from '../../../pageObjects/pageFixture';

// 1:1 mapping of every "Automated: Yes" row from the "Seat Selection" sheet.
// Left out (Automated = No): SEAT-10 (concurrency/realtime), SEAT-11 (seat-hold countdown),
// SEAT-13 (reload behavior — data-dependent/flaky).
test.describe('Seat Selection', { tag: '@seat-selection-tc' }, () => {
  test.beforeEach(async ({ homePage, bookingPage }) => {
    await homePage.open();
    await homePage.movieCards.first().click();
    await homePage.clickFirstBookNow();
    await bookingPage.showtimeOptions.first().click();
  });

  test('SEAT-01 - Correct seat map for the selected screening room is displayed', async ({ bookingPage }) => {
    await expect(bookingPage.seatMap).toBeVisible();
  });

  test('SEAT-02 - Seat status (available/booked/selected) is displayed correctly', async ({ bookingPage }) => {
    await expect(bookingPage.availableSeats.first()).toBeVisible();
  });

  test('SEAT-03 - Select one available seat', async ({ bookingPage }) => {
    const priceBefore = await bookingPage.getTotalPriceText();
    await bookingPage.availableSeats.first().click();
    const priceAfter = await bookingPage.getTotalPriceText();

    expect(priceAfter).not.toBe(priceBefore);
  });

  test('SEAT-04 - Deselect a previously selected seat', async ({ bookingPage }) => {
    const priceBefore = await bookingPage.getTotalPriceText();
    const seat = bookingPage.availableSeats.first();
    await seat.click();
    await seat.click();
    const priceAfter = await bookingPage.getTotalPriceText();

    expect(priceAfter).toBe(priceBefore);
  });

  test('SEAT-05 - Select multiple seats at once', async ({ bookingPage }) => {
    await bookingPage.selectFirstAvailableSeats(3);
    await expect(bookingPage.selectedSeats).toHaveCount(3);
  });

  test('SEAT-06 - Click a seat already booked by another user (unavailable)', async ({ bookingPage }) => {
    const bookedCount = await bookingPage.bookedSeats.count();
    test.skip(bookedCount === 0, 'No booked seat in current data to test against');

    const priceBefore = await bookingPage.getTotalPriceText();
    await bookingPage.bookedSeats.first().click({ force: true });
    const priceAfter = await bookingPage.getTotalPriceText();

    expect(priceAfter).toBe(priceBefore);
  });

  test('SEAT-07 - Proceed without selecting any seat', async ({ bookingPage }) => {
    await bookingPage.btn_continue.click();
    await expect(bookingPage.warning_selectSeat).toBeVisible();
  });

  test('SEAT-08 - Select more seats than the allowed limit per booking (if a limit exists)', async ({ bookingPage }) => {
    const availableCount = await bookingPage.availableSeats.count();
    test.skip(availableCount < 11, 'Not enough available seats in current data to exceed a typical 10-seat limit');

    await bookingPage.selectFirstAvailableSeats(11);
    await expect(bookingPage.warning_seatLimit).toBeVisible();
  });

  test('SEAT-09 - Verify correct pricing per seat category (standard/VIP/couple)', async ({ bookingPage }) => {
    await bookingPage.availableSeats.first().click();
    const priceOne = await bookingPage.getTotalPriceText();

    await bookingPage.availableSeats.nth(1).click();
    const priceTwo = await bookingPage.getTotalPriceText();

    expect(priceTwo).not.toBe(priceOne);
  });

  test('SEAT-12 - Back button to choose a different showtime', async ({ bookingPage, page }) => {
    const hasBack = await bookingPage.btn_back.isVisible().catch(() => false);
    if (hasBack) {
      await bookingPage.btn_back.click();
    } else {
      await page.goBack();
    }
    await expect(bookingPage.showtimeOptions.first()).toBeVisible();
  });

  test('SEAT-14 - Verify seat map on mobile viewport', async ({ bookingPage, page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(bookingPage.seatMap).toBeVisible();
    await bookingPage.availableSeats.first().tap().catch(async () => {
      await bookingPage.availableSeats.first().click();
    });
    await expect(bookingPage.selectedSeats.first()).toBeVisible();
  });

  test('SEAT-15 - Verify the seat color/icon legend', async ({ bookingPage }) => {
    await expect(bookingPage.seatLegend).toBeVisible();
  });
});
