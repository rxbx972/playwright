import { expect } from '@playwright/test';

class banksaladAuthPage {

  page: any;

  constructor(page) {
    this.page = page;
  }

  async checkInit() {
    const nameInput = this.page.locator('input[id="name"]');
    const rrnInput = this.page.locator('input[id="rrn"]').nth(0);
    const phoneNumberInput = this.page.locator('input[id="phoneNumber"]');
    const nextButton = this.page.getByRole('button', { name: '다음' });

    await expect(nameInput).toHaveAttribute('value', '');
    await expect(rrnInput).toHaveAttribute('value', '');
    await expect(phoneNumberInput).toHaveAttribute('value', '');
    await expect(nextButton).toHaveAttribute('disabled', '');
    console.log(`본인인증 페이지 - 모든 정보 미입력 상태에서 [다음] 버튼 비활성화 확인`);
  }

  /**
   * @param name
   * @param rrn
   * @param phoneNumber
   */
  async enterInfo(name, rrn, phoneNumber) {
    const birthdate = rrn.slice(0, 6);
    const gender = rrn.slice(6, 7);

    const nameInput = this.page.locator('input[id="name"]');
    const birthdateInput = this.page.locator('input[id="rrn"]').nth(0);
    const genderInput = this.page.locator('input[id="rrn"]').nth(1);
    const phoneNumberInput = this.page.locator('input[id="phoneNumber"]');

    await nameInput.fill(name);
    await birthdateInput.fill(birthdate);
    await genderInput.fill(gender);
    await phoneNumberInput.fill(phoneNumber);
    console.log(`본인인증 페이지 - 정보 입력 완료`);
  }

  /**
   * @param name
   * @param rrn
   * @param phoneNumber
   */
  async checkInvalidGender(name, rrn, phoneNumber) {
    const nextButton = this.page.getByRole('button', { name: '다음' });

    await this.enterInfo(name, rrn, phoneNumber);
    await expect(nextButton).toHaveAttribute('disabled', '');
    console.log(`본인인증 페이지 - 잘못된 성별 입력으로 [다음] 버튼 활성화되지 않아서 본인인증 실패 확인`);
  }

  /**
   * @param name
   * @param rrn
   * @param phoneNumber
   */
  async checkInvalidDate(name, rrn, phoneNumber) {
    const nextButton = this.page.getByRole('button', { name: '다음' });
    const errorMessage = this.page.getByText('오류가 발생했습니다. 다시 시도해주세요.');

    await this.enterInfo(name, rrn, phoneNumber);
    await expect(nextButton).not.toHaveAttribute('disabled');
    console.log(`본인인증 페이지 - [다음] 버튼 활성화 확인`);

    await nextButton.click();
    await expect(errorMessage).toBeVisible();
    console.log(`본인인증 페이지 - 잘못된 생년월일 입력으로 오류 발생하여 본인인증 실패 확인`);
  }

  /**
   * @param name
   * @param rrn
   * @param phoneNumber
   */
  async checkValidInfo(name, rrn, phoneNumber) {
    const nextButton = this.page.getByRole('button', { name: '다음' });
    const termsDialog = this.page.getByRole('dialog').filter({ has: this.page.getByText('필수 약관 전체 동의') });

    await this.enterInfo(name, rrn, phoneNumber);
    await expect(nextButton).not.toHaveAttribute('disabled');
    console.log(`본인인증 페이지 - [다음] 버튼 활성화 확인`);
  }
}

export { banksaladAuthPage }