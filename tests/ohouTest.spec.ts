import { test } from '@playwright/test';
import { ohouPage } from '../pages/ohouPage.spec';
import config from '../ohouConfig.json';

const userEmail = config.email;
const userPassword = config.password;

let ohou;

test.beforeEach(async ({ page }) => {
  ohou = new ohouPage(page);
});

test.afterEach(async ({ page }) => {
  await page.close();
  console.log("오늘의집 테스트 종료");
});

test.describe('Ohou Test', () => {

  test('login and logout', async ({ }) => {
    await ohou.gotoMain();
    await ohou.clickHeader_signUp();
    await ohou.clickHeader_signIn();
    await ohou.signIn(userEmail, userPassword);
    await ohou.clickHeader_profile_signOut();
  });

});
