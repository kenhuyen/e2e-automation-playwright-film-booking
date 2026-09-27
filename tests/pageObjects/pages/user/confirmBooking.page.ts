import { Page } from '@playwright/test';
import { BasePage } from '../../base.page';

export default class ConfirmBookingPage extends BasePage {
  readonly pageTitle = this.page.getByRole('heading', {
    name: 'Booking Summary',
    exact: true,
  });

  readonly modifySelectionButton = this.page.getByRole('button', {
    name: 'Modify selection',
    exact: true,
  });

  readonly priceBreakdown = this.page.getByText('Price Breakdown', {
    exact: true,
  });

  readonly movieTitle = this.page.getByRole('heading', {
    level: 2,
  });

  readonly snacksButton = this.page.getByRole('button', {
    name: /Add Snacks & Beverages/i,
  });

  readonly foodItems = this.page.locator(
    'div.flex.items-center.gap-3.py-3.px-3.rounded-xl'
  );

  readonly foodAddButtons = this.page.getByRole('button', {
    name: 'ADD',
    exact: true,
  });

  readonly totalLabel = this.page.getByText('Total', {
    exact: true,
  });

  readonly totalPrice = this.page.locator(
    'p.text-2xl.font-bold.gradient-text-gold'
  );

  readonly payButton = this.page.getByRole('button', {
    name: /Pay ₹/i,
  });

  readonly paymentFrame = this.page.frameLocator(
    'iframe[src*="razorpay"]'
  );

  readonly contactOverlay = this.paymentFrame.locator(
    '[data-testid="contact-overlay-container"]'
  );

  readonly mobileInput = this.paymentFrame.getByPlaceholder(
    'Mobile number'
  );

  readonly continuePaymentButton =
    this.paymentFrame.getByRole('button', {
      name: 'Continue',
      exact: true,
    });

  readonly netBankingOption =
    this.paymentFrame.locator(
      '[data-testid="Netbanking"]'
    );

  readonly bankOfBaroda = this.paymentFrame
    .getByRole('button', { name: /Bank of Baroda - Retail/ })
    .first();

  readonly successButton = this.page.getByRole('button', {
    name: 'Success',
    exact: true,
  });

  readonly failureButton = this.page.getByRole('button', {
    name: 'Failure',
    exact: true,
  });

  readonly paymentFailedTitle =
    this.paymentFrame.getByText(
      'Payment could not be completed',
      {
        exact: true,
      }
    );

  readonly retryDescription =
    this.paymentFrame.getByText(
      'Your payment has been cancelled. Try again or complete the payment later.',
      {
        exact: true,
      }
    );

  readonly paymentSuccessMessage =
    this.paymentFrame.getByText(
      /payment successful|payment success|booking confirmed/i
    );

  async clickPay() {
    await this.payButton.click();

    await this.mobileInput.waitFor({
      state: 'visible',
      timeout: 15000,
    });
  }

  async continuePayment() {
    await this.mobileInput.fill('9977665544');

    await this.continuePaymentButton.click();

    await this.contactOverlay.waitFor({
      state: 'hidden',
      timeout: 15000,
    });

    await this.netBankingOption.waitFor({
      state: 'visible',
      timeout: 15000,
    });
  }

  async selectNetBanking() {
    await this.netBankingOption.click();

    await this.bankOfBaroda.waitFor({
      state: 'visible',
      timeout: 10000,
    });
  }

  // async selectBankOfBaroda() {
  //   await this.bankOfBaroda.click();
  // }
  async selectBankOfBaroda(): Promise<Page> {
    const paymentPagePromise =
      this.page.context().waitForEvent('page');

    await this.bankOfBaroda.click();

    const paymentPage = await paymentPagePromise;

    await paymentPage.waitForLoadState('domcontentloaded');

    return paymentPage;
  }
  async selectFailure() {
    await this.failureButton.waitFor({
      state: 'visible',
      timeout: 10000,
    });

    await this.failureButton.click();
  }

  async selectSuccess() {
    await this.successButton.waitFor({
      state: 'visible',
      timeout: 10000,
    });

    await this.successButton.click();
  }

  async openSnacks() {
    await this.snacksButton.click();
  }

  async addFoodItemByName(name: string) {
    const foodItem = this.foodItems.filter({
      hasText: name,
    });

    await foodItem
      .getByRole('button', {
        name: 'ADD',
        exact: true,
      })
      .click();
  }

  async addFirstFoodItem() {
    await this.foodAddButtons.first().click();
  }

  async getTotalPriceText() {
    return (await this.totalPrice.textContent()) ?? '';
  }
}