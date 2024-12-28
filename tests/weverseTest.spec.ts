import { test, expect } from '@playwright/test';
import config from '../config.json';

const mainUrl = config.serviceUrl;
const userEmail = config.email;
const userPassword = config.password;

test.beforeEach(async ({ page }) => {
  await page.goto(mainUrl);
  console.log(`위버스 페이지 진입 : ${mainUrl}`);
});

test.afterEach(async ({ page }) => {
  await page.close();
  console.log(`위버스 테스트 종료`);
})

test.describe('Weverse Test', () => {

  test('로그인 > WID 조회 > 로그아웃 완료', async ({ page }) => {
    const modalCloseButton = page.locator('button[class^="BaseModalView_bottom_button__"]').nth(0);
    const signInButton = page.locator('button[class^="HeaderView_link_sign__"]');

    await modalCloseButton.click();
    await signInButton.click();
    await expect(page).toHaveURL(/account.weverse/);
    console.log(`로그인 페이지 진입`);

    const userEmailInput = page.locator('input[name="userEmail"]');
    const userPasswordInput = page.locator('input[name="password"]');

    await userEmailInput.fill(userEmail);
    await page.locator('button[type="submit"]').click();

    await userPasswordInput.fill(userPassword);
    await page.locator('button[type="submit"]').click();

    try {
      await page.waitForFunction(
        (url: string) => window.location.href === url,
        mainUrl,
        { polling: 4000, timeout: 20000 }
      );
      console.log(`로그인 후 위버스 페이지 복귀 완료 : ${page.url}`);
    } catch (error) {
      console.error(`로그인 후 위버스 페이지 이동 오류 :`, error);
    }

    const apiUrlPattern = /https:\/\/global\.apis\.naver\.com\/weverse\/wevweb\/users\/v1\.0\/users\/me\?/;
    
    await page.reload();
    const response = await page.waitForResponse(
      (response) => apiUrlPattern.test(response.url()) && response.status() === 200
    );
    const jsonResponse = await response.json();
    console.log(`나의 WID 조회 : ${jsonResponse.wid}`);

    const profileButton = page.locator('button[class^="HeaderView_profile_button__"]');
    const signOutButton = page.locator('button[class^="MoreHeaderView_sign_out__"]');

    await profileButton.click();
    await expect(page).toHaveURL(/weverse.io\/more/);
    console.log(`프로필 페이지 진입`);

    await signOutButton.click();
    await expect(page).not.toHaveURL(/weverse.io\/more/);
    console.log(`로그아웃 후 위버스 페이지 복귀 완료 : ${page.url}`);
  });
});
