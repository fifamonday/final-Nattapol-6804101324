import { BrowserContext, Page, test, expect } from '@playwright/test';

async function driverOpenInventory(context: BrowserContext, page: Page): Promise<void> {
  await context.addCookies([{
    name: 'session-username',
    value: 'standard_user',
    domain: 'www.saucedemo.com',
    path: '/',
    sameSite: 'Lax',
  }]);
  await page.goto('https://www.saucedemo.com/inventory.html');
}

test('IT-02: DRIVER login state -> REAL Inventory and Cart', {
  annotation: {
    type: 'description',
    description: 'ใช้ Driver เตรียมสถานะ Login เพื่อทดสอบ Inventory และ Cart จริง',
  },
}, async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await test.step('สร้าง Driver และเปิด Inventory', async () => {
      await driverOpenInventory(context, page);
      await expect(page).toHaveURL(/inventory\.html/);
      await expect(page.locator('.inventory_item')).toHaveCount(6);
    });

    await test.step('ตรวจสอบ Inventory จริง', async () => {
      await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
      await expect(page.getByText('Sauce Labs Bike Light', { exact: true })).toBeVisible();
    });

    await test.step('เพิ่มสินค้า 2 รายการ', async () => {
      const backpack = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
      const bikeLight = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Bike Light' });
      await backpack.getByRole('button', { name: 'Add to cart' }).click();
      await bikeLight.getByRole('button', { name: 'Add to cart' }).click();
      await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    });

    await test.step('ตรวจสอบสินค้าใน Cart', async () => {
      await page.locator('.shopping_cart_link').click();
      await expect(page).toHaveURL(/cart\.html/);
      await expect(page.locator('.cart_item')).toHaveCount(2);
      await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
      await expect(page.getByText('Sauce Labs Bike Light', { exact: true })).toBeVisible();
    });
  } finally {
    await context.close();
  }
});