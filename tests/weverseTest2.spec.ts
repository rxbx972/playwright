import { test } from '@playwright/test';
import { weversePage2 } from '../pages/weversePage2.spec';

const userEmail = ''; 
const userPassword = '';

let weverse;

test.beforeAll(async ({page}) => {
  weverse = new weversePage2(page);
})

test.afterAll(async ({page}) => {
  await page.close();
  console.log("위버스 테스트 종료");
});

test('weverse test', async ({}) => {
  await weverse.gotoMain();
  await weverse.closeModal();
  await weverse.clickHeaderButton_signIn();
  await weverse.signIn(userEmail, userPassword);
  await weverse.getResponse_wid();
  await weverse.clickHeaderButton_profile();
  await weverse.signOut();
});
