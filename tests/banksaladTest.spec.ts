import { test } from '@playwright/test';
import { banksaladAuthPage } from '../pages/banksaladAuthPage.spec';

let authPage;
const name = '김지연';
const rrn = '9912311';
const phoneNumber = '01012345678';

test.beforeEach(async ({ page }) => {
  authPage = new banksaladAuthPage(page);
});

test.afterEach(async ({ page }) => {
  await page.close();
  console.log("뱅크샐러드 테스트 종료");
});

test.describe('Banksalad Test - Auth for Prequalification', () => {

  /**
   * ■ Scenario 1: 본인인증 정보 미입력 시 [다음] 버튼 비활성화됨
   * ■ Scenario 2: 본인인증 정보 입력 시 [다음] 버튼 활성화됨
   *   ● 개인정보가 노출되지 않도록 임의 정보를 입력
   * ■ Scenario 3: 주민등록번호 오입력 시 본인인증 실패
   */

  test('테스트', async () => {
    await authPage.goToPage();
    await authPage.checkInit();
    await authPage.checkInvalidGender(name, '9912315', phoneNumber);
    await authPage.goToPage();
    await authPage.checkInvalidDate(name, '9912321', phoneNumber);
    await authPage.goToPage();
    await authPage.checkValidInfo(name, rrn, phoneNumber);
  });
  
  test.skip('Scenario 1: 본인인증 정보 미입력 시 [다음] 버튼 비활성화됨', async () => {
    await authPage.goToPage();
    await authPage.checkInit();
    await authPage.checkInvalidGender(name, '9912315', phoneNumber);
  });

  test.skip('Scenario 2: 본인인증 정보 입력 시 [다음] 버튼 활성화됨', async () => {
    await authPage.goToPage();
    await authPage.checkInit();
    await authPage.checkInvalidDate(name, '9912321', phoneNumber);
  });

  test.skip('Scenario 3: 주민등록번호 오입력 시 본인인증 실패', async () => {
    await authPage.goToPage();
    await authPage.checkInit();
    await authPage.checkValidInfo(name, rrn, phoneNumber);
  });

});
