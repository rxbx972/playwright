import { expect } from '@playwright/test';

const authPageUrl = 'https://www.banksalad.com/prequalification/loans/credit/authentication';

class banksaladAuthPage {

  page: any;

  constructor(page) {
    this.page = page;
  }

  async goToPage() {
    await this.page.goto(authPageUrl);
    console.log(`뱅크샐러드 본인인증 페이지 진입 : ${authPageUrl}`);
  }

  async checkInit() {
    const nextButton = this.page.locator('button').filter({ hasText: '다음' });
    
    await expect(nextButton).toHaveAttribute('aria-disabled', 'false');
    console.log(`본인인증 페이지 [다음] 버튼 비활성화 확인`);
  }

  async enterInfo(name, rrn, phoneNumber) {
    const nameInput = this.page.locator('input[id="name"]');
    const rrnInput = this.page.locator('input[id="rrn"]');
    const phoneNumberInput = this.page.locator('input[id="phoneNumber"]');
    const nextButton = this.page.locator('button').filter({ hasText: '다음' });

    await nameInput.fill(name);
    await rrnInput.fill(rrn);
    await phoneNumberInput.fill(phoneNumber);

    await expect(nextButton).toHaveAttribute('aria-disabled', 'true');
    await this.page.locator('button[type="submit"]').click();

  }

  async enterWrongInfo(name, rrn, phoneNumber) {
    const nameInput = this.page.locator('input[id="name"]');
    const rrnInput = this.page.locator('input[id="rrn"]');
    const phoneNumberInput = this.page.locator('input[id="phoneNumber"]');
    const nextButton = this.page.locator('button').filter({ hasText: '다음' });
    const errorMessage = this.page.locator('div').filter({ hasText: '오류가 발생했습니다. 다시 시도해주세요.' });;

    await nameInput.fill(name);
    await rrnInput.fill(rrn);
    await phoneNumberInput.fill(phoneNumber);

    await expect(nextButton).toHaveAttribute('aria-disabled', 'true');
    await this.page.locator('button[type="submit"]').click();

    await expect(errorMessage).toBeVisible();
  }

}

export { banksaladAuthPage }