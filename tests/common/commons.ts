import { Locator } from '@playwright/test';

type WaitForRes = [locatorIndex: number, locator: Locator];

export async function waitForLocator(
  locators: Locator[],
  timeOut = 30000,
): Promise<WaitForRes> {
  const res = await Promise.race([
    ...locators.map(async (locator, index): Promise<WaitForRes> => {
      let timeout = false;
      await locator
        .waitFor({ state: 'visible', timeout: timeOut })
        .catch(() => (timeout = true));
      return [timeout ? -1 : index, locator];
    }),
  ]);
  if (res[0] === -1) {
    return res;
  }
  return res;
}
export function getDataFromObjectJsonFile(obj: any, attribute: string) {
  return obj[attribute];
}
export async function getDataFromAnyJsonFile(jsonData: any, attribute: any) {
  const typeSearch = jsonData.filters.find(
    (f: { type: any }) => f.type === attribute,
  );
  return typeSearch;
}
export function parsePrice(text: string): number {
  return Number(text.replace(/[^\d]/g, ''));
}

export function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN');
}
export function formatPriceUS(price: number): string {
  return price.toLocaleString('en-US');
}
