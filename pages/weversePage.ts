import { expect } from '@playwright/test';
import config from '../config/weverseConfig.json';

class weversePage {

  page: any;

  constructor(page) {
    this.page = page;
  }

  async gotoMain() {
    await this.page.goto(config.serviceUrl);
    console.log(`위버스 페이지 진입 : ${config.serviceUrl}`);
  }

  async closeModal() {
    const modalCloseButton = this.page.locator('button[class^="BaseModalView_bottom_button__"]').nth(0);

    await modalCloseButton.click();
    console.log(`모달 존재 확인 후 닫기`);
  }

  async clickHeaderButton_jellyShop() {
    const jellyShopButton = this.page.locator('button[class^="HeaderView_jelly_shop_link__"]');

    const [jellyShopPage] = await Promise.all([
      this.page.waitForEvent('popup'),
      jellyShopButton.click()
    ]);

    await jellyShopPage.waitForLoadState();
    await expect(jellyShopPage).toHaveURL(/jelly.weverse/);
    console.log(`젤리샵 페이지 진입`);

    await jellyShopPage.close();
    console.log(`젤리샵 페이지 닫기`);
  }

  async clickHeaderButton_weverseShop() {
    const weverseShopButton = this.page.locator('[class^="HeaderView_shop_link__"]');

    const [weverseShopPage] = await Promise.all([
      this.page.waitForEvent('popup'),
      weverseShopButton.click()
    ]);

    await weverseShopPage.waitForLoadState();
    await expect(weverseShopPage).toHaveURL(/shop.weverse/);
    console.log(`위버스샵 페이지 진입`);

    await weverseShopPage.close();
    console.log(`위버스샵 페이지 닫기`);
  }

  async clickHeaderButton_signIn() {
    const signInButton = this.page.locator('button[class^="HeaderView_link_sign__"]');

    await signInButton.click();
    await expect(this.page).toHaveURL(/account.weverse/);
    console.log(`로그인 페이지 진입`);
  }

  async clickHeaderButton_profile() {
    const profileButton = this.page.locator('button[class^="HeaderView_profile_button__"]');

    await profileButton.click();
    await expect(this.page).toHaveURL(/weverse.io\/more/);
    console.log(`프로필 페이지 진입`);
  }

  async clickHeaderButton_setting() {
    const settingButton = this.page.locator('button[class^="HeaderView_setting_button__"]');

    await settingButton.click();
    await expect(this.page).toHaveURL(/weverse.io\/setting/);
    console.log(`설정 페이지 진입`);
  }

  async signIn(email, password) {
    const emailInput = this.page.locator('input[name="userEmail"]');
    const passwordInput = this.page.locator('input[name="password"]');

    await emailInput.fill(email);
    await this.page.locator('button[type="submit"]').click();

    await passwordInput.fill(password);
    await this.page.locator('button[type="submit"]').click();

    try {
      await this.page.waitForFunction(
        (url: string) => window.location.href === url,
        config.serviceUrl,
        { polling: 4000, timeout: 20000 }
      );
      console.log(`로그인 후 위버스 페이지 복귀 완료 : ${this.page.url()}`);
    } catch (error) {
      console.error(`로그인 후 위버스 페이지 이동 오류 :`, error);
    }
  }

  async getResponse_wid() {
    const apiUrlPattern = /https:\/\/global\.apis\.naver\.com\/weverse\/wevweb\/users\/v1\.0\/users\/me\?/;

    await this.page.reload();
    const response = await this.page.waitForResponse(
      (response) => apiUrlPattern.test(response.url()) && response.status() === 200
    );
    const jsonResponse = await response.json();
    console.log(`나의 WID 조회 : ${jsonResponse.wid}`);
  }

  async signOut() {
    const signOutButton = this.page.locator('button[class^="MoreHeaderView_sign_out__"]');

    await signOutButton.click();
    await expect(this.page).not.toHaveURL(/weverse.io\/more/);
    console.log(`로그아웃 후 위버스 페이지 복귀 완료 : ${this.page.url()}`);
  }

  async enterNewArtist() {
    const newArtist_first = this.page.locator('[class^="HomeArtistListSlotView_artist_link__"]').nth(0);
    const gotoCommunityButton = this.page.locator('[class*="ArtistPediaGoToCommunityButtonView_link__"]');

    await this.page.mouse.wheel(0, 2000);
    await newArtist_first.click();
    await expect(this.page).toHaveURL(/artistpedia/);
    console.log(`새로운 아티스트의 아티스트피디아 페이지 진입 확인`);

    await gotoCommunityButton.click();
    await expect(this.page).toHaveURL(/feed/);
    console.log(`새로운 아티스트의 커뮤니티 페이지 진입 확인`);
  }
}

export { weversePage }