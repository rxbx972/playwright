import { expect } from '@playwright/test';
import { ohouseMyPage } from './ohouseMyPage';
import config from '../config/ohouseConfig.json';

class ohouseHomePage {

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

  async scrapContents() {
    const myPage = new ohouseMyPage(this.page);
    const title = '이런 사진 찾고 있나요?';
    const area = this.page.locator('div[class="e4cq32f2 css-1wezfk"]', { hasText: title });
    const scrapButton = area.getByLabel('scrap 토글 버튼');
    const scrapText = this.page.getByText('스크랩했습니다.');

    await scrapButton.nth(0).click();
    await expect(scrapText).toBeVisible();
    console.log(`사진 스크랩 완료`);

    await myPage.scrap_newFolder();
  }

  async unscrapContents() {
    const myPage = new ohouseMyPage(this.page);
    const contentsItem = this.page.locator('div[class="css-3q4ecs e1e5aqb12"]');
    const scrapButton = this.page.locator('button[data-testid="CardCollection-scrap-button"]');
    const unscrapText = this.page.getByText('스크랩북에서 삭제했습니다.');
    const emptyText = this.page.getByText('아직 스크랩한 콘텐츠가 없습니다.');

    await contentsItem.click();
    await expect(this.page).toHaveURL(/contents\/card_collections/);
    console.log(`사진 페이지 진입 확인`);

    await scrapButton.click();
    await expect(scrapButton).toHaveAttribute('aria-pressed', 'false');
    await expect(unscrapText).toBeVisible();
    console.log(`사진 스크랩 해제 완료`);

    await this.page.goBack();
    await expect(this.page).not.toHaveURL(/contents/);
    console.log(`스크랩북 복귀 완료 확인`);

    await myPage.scrapbook_checkEmpty();
    await myPage.scrapbook_deleteFolder();
  }

  async scrapProject() {
    const title = '집 꾸미고 계시다면 참고해보세요🪑';
    const area = this.page.locator('div[class="e4cq32f2 css-1wezfk"]', { hasText: title });
    const projectItem = area.locator('a[class="css-11ab5xd e1fm144d0"]');
    const scrapButton = this.page.locator('button[data-testid="Project-scrap-button"]');
    const scrapText = this.page.getByText('스크랩했습니다.');
    const scrapbookButton = this.page.locator('button', { hasText: '스크랩북 보기' });

    await projectItem.nth(0).click();
    await expect(this.page).toHaveURL(/projects/);
    console.log(`집들이 페이지 진입 확인`);

    await scrapButton.click();
    await expect(scrapButton).toHaveAttribute('aria-pressed', 'true');
    await expect(scrapText).toBeVisible();
    console.log(`집들이 스크랩 완료`);

    await scrapbookButton.click();
    await expect(this.page).toHaveURL(/users\/\d{8}\/collections/);
    console.log(`스크랩북 페이지 진입 확인`);
  }

  async unscrapProject() {
    const myPage = new ohouseMyPage(this.page);

    await myPage.scrapbook_allTab_edit();
    await myPage.scrapbook_allTab_select();
    await myPage.scrapbook_allTab_delete();
    await myPage.scrapbook_checkEmpty();
  }

  async scrapProductions() {
    const title = '오늘의딜';
    const area = this.page.locator('div[class="e4cq32f2 css-1wezfk"]', { hasText: title });
    const scrapButton = area.locator('button[class^="production-item-scrap-badge"]');
    const scrapText = this.page.getByText('스크랩했습니다.');

    await scrapButton.nth(0).click();
    await expect(scrapText).toBeVisible();
    console.log(`상품 스크랩 완료`);
  }

  async unscrapProductions() {
    const myPage = new ohouseMyPage(this.page);
    const scrapItem = this.page.locator('div[class="css-3q4ecs e1e5aqb12"]');
    const productionScrapButton = this.page.locator('button[class*="production-selling-header__action__button-scrap"]');
    const brandScrapButton = this.page.locator('button[class="css-ikqseu e3xbt9p0"]');
    const scrapText = this.page.getByText('스크랩했습니다.');
    const unscrapText = this.page.getByText('스크랩북에서 삭제했습니다.');

    await this.clickHeader_scrapbook();
    await scrapItem.click();
    await expect(this.page).toHaveURL(/productions\/\d{7}\/selling/);
    console.log(`상품 페이지 진입 확인`);

    await productionScrapButton.click();
    await expect(unscrapText).toBeVisible();
    console.log(`상품 스크랩 해제 완료`);

    await this.page.goBack();
    await expect(this.page).not.toHaveURL(/productions/);
    console.log(`스크랩북 복귀 완료 확인`);
    await this.page.waitForTimeout(1000);
    
    await myPage.scrapbook_checkEmpty();
  }

  async scrapExhibition() {
    const title = '오늘의 기획전';
    const area = this.page.locator('div[class="e4cq32f2 css-1wezfk"]', { hasText: title });
    const item = area.locator('a[class="css-11ab5xd e1fm144d0"]');
    const scrapButton = this.page.locator('button[class*="e1ibyt6j0 e5j3oup1"]');
    const scrapText = this.page.getByText('스크랩했습니다.');
    const scrapbookButton = this.page.locator('button', { hasText: '스크랩북 보기' });

    await item.nth(0).click();
    await expect(this.page).toHaveURL(/exhibitions/);
    console.log(`기획전 페이지 진입 확인`);

    await scrapButton.click();
    await expect(scrapText).toBeVisible();
    console.log(`기획전 스크랩 완료`);

    await scrapbookButton.click();
    await expect(this.page).toHaveURL(/users\/\d{8}\/collections/);
    console.log(`스크랩북 페이지 진입 확인`);
  }

  async unscrapExhibition() {
    const myPage = new ohouseMyPage(this.page);
    const scrapItem = this.page.locator('div[class="css-3q4ecs e1e5aqb12"]');
    const scrapButton = this.page.locator('button[class*="e1ibyt6j0 e5j3oup1"]');
    const unscrapText = this.page.getByText('스크랩북에서 삭제했습니다.');

    await this.clickHeader_scrapbook();
    await myPage.scrapbook_exhibitionTab();

    await scrapItem.click();
    await expect(this.page).toHaveURL(/exhibitions/);
    console.log(`기획전 페이지 진입 확인`);

    await scrapButton.click();
    await expect(unscrapText).toBeVisible();
    console.log(`기획전 스크랩 해제 완료`);

    await this.page.goBack();
    await expect(this.page).not.toHaveURL(/exhibitions/);
    console.log(`스크랩북 복귀 완료 확인`);

    await myPage.scrapbook_checkEmpty();
  }
}

export { ohouseHomePage }