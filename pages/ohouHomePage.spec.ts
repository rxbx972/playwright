import { expect } from '@playwright/test';
import config from '../config/ohouConfig.json';
import exp from 'constants';

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

  async scrapContents() {
    const title = '이런 사진 찾고 있나요?';
    const area = this.page.locator('div[class="e4cq32f2 css-1wezfk"]', { hasText: title });
    const scrapButton = area.getByLabel('scrap 토글 버튼');
    const scrapText = this.page.getByText('스크랩했습니다.');
    const scrapFolderButton = this.page.locator('button', { hasText: '폴더에 담기' });

    await scrapButton.nth(0).click();
    await expect(scrapText).toBeVisible();
    console.log(`사진 스크랩 완료`);

    const folderName = 'New Folder'
    const newFolderButton = this.page.locator('button', { hasText: '새로운 폴더 추가하기' });
    const folderNameInput = this.page.locator('input[class="css-1qgt0b9 e1tlor0y0"]');
    const saveButton = this.page.locator('button', { hasText: '완료' });
    const saveText = this.page.getByText(`선택한 컨텐츠를 '${folderName}'으로 이동하시겠습니까?`);
    const moveButton = this.page.locator('button', { hasText: '확인' });
    const moveText = this.page.getByText(`'${folderName}'폴더로 이동했습니다.`);
    const scrapbookButton = this.page.locator('button', { hasText: '스크랩북 보기' });

    await scrapFolderButton.click();
    await expect(newFolderButton).toBeVisible();
    await newFolderButton.click();
    await folderNameInput.fill(folderName);
    await saveButton.click();
    console.log(`스크랩북 폴더 생성 확인`);

    await expect(saveText).toBeVisible();
    await moveButton.click();
    await expect(moveText).toBeVisible();
    console.log(`스크랩북 폴더 이동 확인`);

    await scrapbookButton.click();
    await expect(this.page).toHaveURL(/collection_books\/\d{8}/);
    console.log(`스크랩북 폴더 페이지 진입 확인`);

    // await this.page.goBack();
    // await expect(this.page).not.toHaveURL(/collection_books/);
    // console.log(`오늘의집 홈 복귀 완료 확인`);
  }

  async unscrapContents() {
    const contentsItem = await this.page.locator('div[class="css-3q4ecs e1e5aqb12"]');
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

    try {
      await expect(emptyText).toBeVisible();
      console.log(`Empty Text 확인`);
    } catch {
      console.log(`Empty Text가 노출되지 않습니다.`);
    }

    const folderSettingButton = this.page.locator('button', { hasText: '설정' });
    const folderDeleteButton = this.page.locator('button', { hasText: '폴더 삭제하기' });
    const deleteButton = this.page.locator('button', { hasText: '확인' });

    await folderSettingButton.click();
    await expect(folderDeleteButton).toBeVisible();
    await folderDeleteButton.click();
    await deleteButton.click();
    console.log(`스크랩북 폴더 삭제 확인`);

    await expect(this.page).toHaveURL(/users\/\d{8}\/collections/);
    console.log(`스크랩북 페이지 진입 확인`);
  }

  async scrapProject() {
    const title = '오늘은 어떤 집이 올라왔을까요? 🔍';
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

    // await this.page.goBack();
    // await expect(this.page).not.toHaveURL(/collections/);
    // console.log(`오늘의집 홈 복귀 완료 확인`);
  }

  async unscrapProject() {
    const editButton = this.page.getByRole('button', { name: '편집' });
    const moveButton = this.page.getByRole('button', { name: '폴더이동' });
    const deleteButton = this.page.getByRole('button', { name: '삭제' });
    const cancelButton = this.page.getByRole('button', { name: '취소' });
    const unscrapText = this.page.getByText('스크랩북에서 삭제되었습니다.');
    const emptyText = this.page.getByText('아직 스크랩한 콘텐츠가 없습니다.');

    await editButton.click();
    await expect(cancelButton).toBeVisible();
    console.log('스크랩북 편집 모드 전환 확인');

    const scrapItem = this.page.locator('div[class="css-3q4ecs e1e5aqb12"]');
    const scrapItemCheckbox = scrapItem.locator('input[type="checkbox"].css-f3z39x');

    await scrapItemCheckbox.check();
    await expect(scrapItemCheckbox).toBeChecked();
    console.log('스크랩 아이템 선택 확인');

    this.page.on('dialog', async dialog => {
      await this.page.waitForTimeout(1000);
      await dialog.accept(); 
    });

    await deleteButton.click();
    await expect(unscrapText).toBeVisible();

    try {
      await expect(emptyText).toBeVisible();
      console.log(`Empty Text 확인`);
    } catch {
      console.log(`Empty Text가 노출되지 않습니다.`);
    }
  }
}

export { ohouHomePage }