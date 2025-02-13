import { test } from '@playwright/test';
import { banksaladAuthPage } from '../pages/banksaladAuthPage.spec';

const authPageUrl = 'https://www.banksalad.com/prequalification/loans/credit/authentication';
const name = '김지연';
const rrn = '9912311';
const phoneNumber = '01012345678';

let authPage;

test.beforeEach(async ({ page }) => {
  authPage = new banksaladAuthPage(page);

  await page.goto(authPageUrl);
  console.log(`뱅크샐러드 본인인증 페이지 진입`);
});

test.afterEach(async ({ page }) => {
  await page.close();
  console.log("뱅크샐러드 테스트 종료");
});

test.describe('Auth for Prequalification', () => {
  
  test('Scenario 1: 본인인증 정보 미입력 시 [다음] 버튼 비활성화됨', async () => {
    await authPage.checkInit();
  });

  test('Scenario 2: 본인인증 정보 입력 시 [다음] 버튼 활성화됨', async () => {
    await authPage.checkValidInfo(name, rrn, phoneNumber);
  });

  test('Scenario 3: 주민등록번호 오입력 시 본인인증 실패', async () => {
    await authPage.checkInvalidGender(name, '9912315', phoneNumber);
    await authPage.checkInvalidDate(name, '9912321', phoneNumber);
  });

});
