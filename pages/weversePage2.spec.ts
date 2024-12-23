import { expect } from '@playwright/test';

class weversePage2 {

  page: any;

  constructor(page) {
    this.page = page;
  }

  async gotoMain() {
    await this.page.goto('https://weverse.io/');
    console.log("위버스 페이지 진입");
  }

  async closeModal() {
    const modalCloseButton = this.page.locator('button[class^="BaseModalView_bottom_button__"]').nth(0);

    await modalCloseButton.click();
    console.log("모달 존재 확인 후 닫기");
  }

  async clickHeaderButton_signIn() {
    const signInButton = this.page.locator('button[class^="HeaderView_link_sign__"]');

    await signInButton.click();
    await expect(this.page).toHaveURL(/account.weverse/);
    console.log("로그인 페이지 진입");
  }

  async clickHeaderButton_profile() {
    const profileButton = this.page.locator('button[class^="HeaderView_profile_button__"]');

    await profileButton.click();
    await expect(this.page).toHaveURL(/weverse.io\/more/);
    console.log("프로필 페이지 진입");
  }

  async clickHeaderButton_setting() {
    const settingButton = this.page.locator('button[class^="HeaderView_setting_button__"]');

    await settingButton.click();
    await expect(this.page).toHaveURL(/weverse.io\/setting/);
    console.log("설정 페이지 진입");
  }

  async signIn(email, password) {
    const emailInput = this.page.locator('input[name="userEmail"]');
    const passwordInput = this.page.locator('input[name="password"]');

    await emailInput.fill(email);
    await this.page.locator('button[type="submit"]').nth(1).click();

    await passwordInput.fill(password);
    await this.page.locator('button[type="submit"]').click();

    await expect(this.page).not.toHaveURL(/account.weverse/);
    console.log("로그인 후 위버스 메인 복귀 완료");
  }

  async getResponse_wid() {
    const apiUrlPattern = /https:\/\/global\.apis\.naver\.com\/weverse\/wevweb\/users\/v1\.0\/users\/me\?/;
    const responsePromise = this.page.waitForResponse((response) =>
      apiUrlPattern.test(response.url()) && response.status() === 200
    );

    this.clickHeaderButton_profile();

    const response = await responsePromise;
    const jsonResponse = await response.json();

    console.log("나의 WID = " + jsonResponse.wid);
  }

  async signOut() {
    const signOutButton = this.page.locator('button[class^="MoreHeaderView_sign_out__"]');

    await signOutButton.click();
    await expect(this.page).not.toHaveURL(/weverse.io\/more/);
    console.log("로그아웃 후 위버스 메인 복귀 완료");
  }

  async enterNewArtist() {
    const newArtist_first = this.page.locator('[class^="HomeArtistListSlotView_artist_link__"]').nth(0);
    const gotoCommunityButton = this.page.locator('[class^="MobileArtistPediaGoToCommunityButtonView_link__"]');

    await newArtist_first.click();
    await expect(this.page).toHaveURL(/artistpedia/);
    console.log("새로운 아티스트의 아티스트피디아 페이지 진입");

    await gotoCommunityButton.click();
    await expect(this.page).toHaveURL(/feed/);
    console.log("새로운 아티스트의 커뮤니티 페이지 진입");
  }
}

export { weversePage2 }