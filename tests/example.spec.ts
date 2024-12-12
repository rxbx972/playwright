import { test, expect } from '@playwright/test';

const userEmail = ''; 
const userPassword = '';

test('has title', async ({ page }) => {
  await page.goto('https://weverse.io/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Weverse/);
});

test('weverse test', async ({ page }) => {
  await page.goto('https://weverse.io/');
  console.log("위버스 페이지 진입");

  const modalCloseButton = page.locator('button[class^="BaseModalView_bottom_button__"]').nth(0);

  const signInButton = page.locator('button[class^="HeaderView_link_sign__"]');
  const signInButton2 = page.locator('button', { hasText: 'Sign in' });
  const signInButton3 = page.getByRole('button', { name: 'Sign in'}); 
  
  await modalCloseButton.click();
  await signInButton.click();

  await expect(page).toHaveURL(/account.weverse/);
  console.log("로그인 페이지 진입");

  const userEmailInput = page.locator('input[name="userEmail"]');
  const userPasswordInput = page.locator('input[name="password"]');

  await userEmailInput.fill(userEmail);
  await page.locator('button[type="submit"]').nth(1).click();

  await userPasswordInput.fill(userPassword);
  await page.locator('button[type="submit"]').click();
  console.log("로그인 완료");

  await expect(page).not.toHaveURL(/account.weverse/);
});
