import { test } from '@playwright/test';
import { ohouHomePage } from '../pages/ohouHomePage.spec';
import { ohouMyPage } from '../pages/ohouMyPage.spec';
import config from '../config/ohouConfig.json';

const userEmail = config.email;
const userPassword = config.password;

let homePage;
let myPage;

test.setTimeout(120000);
test.beforeEach(async ({ page }) => {
  homePage = new ohouHomePage(page);
  myPage = new ohouMyPage(page);
});

test.afterEach(async ({ page }) => {
  await page.close();
  console.log("오늘의집 테스트 종료");
});

test.describe('Ohou Test', () => {

  test('Login and Logout Test', async () => {
    await homePage.gotoMain();
    await homePage.clickHeader_signIn();
    await homePage.signIn(userEmail, userPassword);
    await homePage.clickHeader_profile_signOut();
    await homePage.clickHeader_signUp();
  });

  test('Scrapbook Test', async () => {
    await homePage.gotoMain();
    await homePage.clickHeader_signIn();
    await homePage.signIn(userEmail, userPassword);
    await homePage.scrapContents();
    await homePage.unscrapContents();
    await homePage.gotoMain();
    await homePage.scrapProject();
    await homePage.unscrapProject();
    await homePage.gotoMain();
    await homePage.scrapProductions();
    await homePage.unscrapProductions();
    await homePage.gotoMain();
    await homePage.scrapExhibition();
    await homePage.unscrapExhibition();
  });
});
