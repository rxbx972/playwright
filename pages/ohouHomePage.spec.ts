import { expect } from '@playwright/test';
import config from '../ohouConfig.json';

class ohouHomePage {

  page: any;

  constructor(page) {
    this.page = page;
  }

  async gotoMain() {
    await this.page.goto(config.serviceUrl);
    console.log(`오늘의집 홈 진입 : ${config.serviceUrl}`);
  }

  async signIn(email, password) {
    const emailInput = this.page.locator('input[name="email"]');
    const passwordInput = this.page.locator('input[name="password"]');
    const submitButton = this.page.locator('button[type="submit"]');

    await emailInput.fill(email);
    await passwordInput.fill(password);
    await submitButton.click();

    try {
      await this.page.waitForFunction(
        (url: string) => window.location.href === url,
        config.serviceUrl,
        { polling: 4000, timeout: 20000 }
      );
      console.log(`로그인 후 오늘의집 홈 복귀 완료 : ${this.page.url()}`);
    } catch (error) {
      console.error(`로그인 후 오늘의집 홈 이동 오류 :`, error);
    }
  }

  async clickHeader_signIn() {
    const signInButton = this.page.getByRole('link', { name: '로그인' });

    await signInButton.click();
    await expect(this.page).toHaveURL(/users\/sign_in/);
    console.log(`로그인 페이지 진입 확인`);
  }

  async clickHeader_signUp() {
    const signUpButton = this.page.getByRole('link', { name: '회원가입' });

    await signUpButton.click();
    await expect(this.page).toHaveURL(/normal_users\/new/);
    console.log(`회원가입 페이지 진입 확인`);

    await this.page.goBack();
    await expect(this.page).not.toHaveURL(/normal_users\/new/);
    console.log(`오늘의집 홈 복귀 완료 확인`);
  }

  async clickHeader_scrapbook() {
    const scrapbookButton = this.page.getByRole('link', { name: '스크랩북 페이지 링크 버튼' });

    await scrapbookButton.click();
    await expect(this.page).toHaveURL(/users\/\d{8}\/collections/);
    console.log(`스크랩북 페이지 진입 확인`);
  }

  async clickHeader_profile_myPage() {
    const profileMenu = this.page.getByLabel('프로필 메뉴');
    const myPageButton = this.page.getByRole('link', { name: '마이페이지' });

    await profileMenu.click();
    await myPageButton.click();
    await expect(this.page).toHaveURL(/users\/\d{8}/);
    console.log(`마이페이지 진입 확인`);
  }

  async clickHeader_profile_signOut() {
    const profileMenu = this.page.getByLabel('프로필 메뉴');
    const logoutButton = this.page.getByRole('button', { name: '로그아웃' });
    const loginButton = this.page.getByRole('link', { name: '로그인' });

    await profileMenu.click();
    await logoutButton.click();
    await expect(loginButton).toBeVisible();
    console.log(`로그아웃 완료 확인`);
  }
}

export { ohouHomePage }