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
});

test.describe('Olive Young Test', () => {

  test('로그인 테스트', async ({ page }) => {
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

  test('검색 테스트', async ({ page }) => {
    const searchKeyword = "핸드크림"
    const searchBrand = "카밀"

    const searchInput = page.locator('input[class="header_search_input"]');
    const searchButton = page.locator('button[id="searchSubmit"]');
    const searchResult = page.locator('p[class="resultTxt"]').filter({ hasText: '검색결과'});

    await searchInput.fill(searchKeyword);
    await searchButton.click();
    await expect(searchResult).toContainText(searchKeyword);
    console.log(`검색결과 페이지 이동 확인 완료`);

    const filter_brand = page.locator('#search').locator('label').filter({ hasText: searchBrand});
    const chip_today = page.locator('#search').locator('label').filter({ hasText: "오늘드림"});
    const chip_smell = page.locator('#search').locator('label').filter({ hasText: "향"});
    const filterOption = page.locator('[class="selected_option"]').locator('button');

    await filter_brand.click();
    await expect(await filterOption.filter({ hasText: searchBrand})).toBeVisible();
    await chip_today.click();
    await expect(await filterOption.filter({ hasText: "오늘드림"})).toBeVisible();
    console.log(`필터 적용 확인 완료`);
  });
});
