import { test, expect } from '@playwright/test';

test('ST-01: complete purchase of two products', {
  annotation: {
    type: 'description',
    description: 'ทดสอบการซื้อ Backpack และ Bike Light ตั้งแต่ Login จนสั่งซื้อสำเร็จ',
  },
}, async ({ page }) => {
  const productNames = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];

  await test.step('Login และตรวจสอบ Inventory', async () => {
    await page.goto('/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  await test.step('เพิ่มสินค้าสองรายการ', async () => {
    for (const productName of productNames) {
      const product = page.locator('.inventory_item').filter({ hasText: productName });
      await product.getByRole('button', { name: 'Add to cart' }).click();
    }
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  await test.step('ตรวจสอบ Cart', async () => {
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_item')).toHaveCount(2);
    for (const productName of productNames) {
      await expect(page.locator('.cart_item').filter({ hasText: productName })).toBeVisible();
    }
  });

  await test.step('กรอก Checkout Information', async () => {
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByPlaceholder('First Name').fill('ณัฐพล');
    await page.getByPlaceholder('Last Name').fill('วันจันทร์');
    await page.getByPlaceholder('Zip/Postal Code').fill('50000');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });

  await test.step('ตรวจสอบ Overview และสั่งซื้อ', async () => {
    await expect(page.locator('.cart_item')).toHaveCount(2);
    for (const productName of productNames) {
      await expect(page.locator('.cart_item').filter({ hasText: productName })).toBeVisible();
    }
    await page.getByRole('button', { name: 'Finish' }).click();
  });

  await test.step('ตรวจสอบ Order Complete', async () => {
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
  });
});