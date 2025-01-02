import { test, expect } from '@playwright/test';
import config from '../oliveyoungConfig.json';

const mainUrl = config.serviceUrl;
const userEmail = config.email;
const userPassword = config.password;

test.beforeEach(async ({ page }) => {
  await page.goto(mainUrl);
  console.log(`올리브영 페이지 진입 : ${mainUrl}`);
}); 

test.afterEach(async ({ page }) => {
  await page.close();
  console.log(`올리브영 테스트 종료`);
})

test.describe('Olive Young Test', () => {

  test('로그인 완료', async ({ page }) => {
    const login = page.locator('li[class="login"]').filter({ hasText: '로그인'});
    const logout = page.locator('li[class="logout"]').locator('a').filter({ hasText: '로그아웃'});
    const userName = page.locator('li[class="logout"]').locator('strong');

    await login.click();
    await expect(page).toHaveURL(/login/);
    console.log(`로그인 페이지 진입 완료`);

    const userEmailInput = page.locator('input[name="loginId"]');
    const userPasswordInput = page.locator('input[name="password"]');
    const loginButton = page.locator('button[class="btn-login"]');

    await userEmailInput.fill(userEmail);
    await userPasswordInput.fill(userPassword);
    await loginButton.click();

    await expect(page).toHaveURL(/main/);
    console.log(`로그인 후 메인 페이지 복귀 완료`);

    await expect(userName).toContainText('김지연');
    console.log(`사용자 명 확인 완료`);
  });
});
