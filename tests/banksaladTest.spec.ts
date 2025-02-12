import { test } from '@playwright/test';
import { banksaladAuthPage } from '../pages/banksaladAuthPage.spec';

let authPage;
const name = '김지연';
const rrn = '9901232';
const phoneNumber = '01098765432';

test.beforeEach(async ({ page }) => {
  authPage = new banksaladAuthPage(page);
});

test.afterEach(async ({ page }) => {
  await page.close();
  console.log("뱅크샐러드 테스트 종료");
});

test.describe('Banksalad Test', () => {

  /**
   * ■ Scenario 1: 본인인증 정보 미입력 시 [다음] 버튼 비활성화됨
   * ■ Scenario 2: 본인인증 정보 입력 시 [다음] 버튼 활성화됨
   *   ● 개인정보가 노출되지 않도록 임의 정보를 입력
   * ■ Scenario 3: 주민등록번호 오입력 시 본인인증 실패
   */
  
  test('Auth for Prequalification', async () => {
    await authPage.goToPage();
    await authPage.checkInit();
    await authPage.enterInfo(name, rrn, phoneNumber);
  });

});
