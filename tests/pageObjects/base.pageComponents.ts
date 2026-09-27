import { type Page } from '@playwright/test';

export abstract class BasePageComponent {
  constructor(readonly page: Page) {}
}
