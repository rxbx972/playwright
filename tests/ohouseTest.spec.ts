import { test } from '@playwright/test';
import { ohouseHomePage } from '../pages/ohouseHomePage';
import { ohouseMyPage } from '../pages/ohouseMyPage';
import config from '../config/ohouseConfig.json';

const userEmail = config.email;
const userPassword = config.password;

let homePage;
let myPage;

test.setTimeout(120000);
test.beforeEach(async ({ page }) => {
  homePage = new ohouseHomePage(page);
  myPage = new ohouseMyPage(page);
});

test.afterEach(async ({ page }) => {
  await page.close();
  console.log("오늘의집 테스트 종료");
});

test.describe('Ohouse Test', () => {

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
