import { test } from '@playwright/test';
import { weversePage2 } from '../pages/weversePage2.spec';

const userEmail = '';
const userPassword = '';

let weverse;

test.beforeEach(async ({ page }) => {
  weverse = new weversePage2(page);
})

test.afterEach(async ({ page }) => {
  await page.close();
  console.log("위버스 테스트 종료");
});

test.describe('Weverse Test', () => {

  test('login and logout', async ({ }) => {
    await weverse.gotoMain();
    await weverse.closeModal();
    await weverse.clickHeaderButton_signIn();
    await weverse.signIn(userEmail, userPassword);
    await weverse.getResponse_wid();
    await weverse.clickHeaderButton_profile();
    await weverse.signOut();
  });

  test('enter jellyshop and shop', async ({ }) => {
    await weverse.gotoMain();
    await weverse.closeModal();
    await weverse.clickHeaderButton_jellyShop();
    await weverse.clickHeaderButton_weverseShop();
  });

  test('enter new artist', async ({ }) => {
    await weverse.gotoMain();
    await weverse.closeModal();
    await weverse.enterNewArtist();
  });
});
