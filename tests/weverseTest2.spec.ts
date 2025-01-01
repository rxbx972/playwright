import { test } from '@playwright/test';
import { weversePage2 } from '../pages/weversePage2.spec';
import { weverseCommunityPage } from '../pages/weverseCommunityPage.spec';
import config from '../weverseConfig.json';

const userEmail = config.email;
const userPassword = config.password;

let weverse;
let community;

test.beforeEach(async ({ page }) => {
  weverse = new weversePage2(page);
  community = new weverseCommunityPage(page);
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

  test('join community', async ({ }) => {
    await weverse.gotoMain();
    await weverse.closeModal();
    await weverse.clickHeaderButton_signIn();
    await weverse.signIn(userEmail, userPassword);
    await community.gotoCommunity('cnblue');
    await community.joinCommunity();
  });

  test('check community fan/artist tab', async ({ }) => {
    await weverse.gotoMain();
    await weverse.closeModal();
    await weverse.clickHeaderButton_signIn();
    await weverse.signIn(userEmail, userPassword);
    await community.gotoCommunity('enhypen');
    await community.clickFanTab();
    await community.checkFanTab_likePost();
    await community.clickArtistTab();
    await community.checkArtistTab_likePost();
  });

  test('check community media tab', async ({ }) => {
    await weverse.gotoMain();
    await weverse.closeModal();
    await weverse.clickHeaderButton_signIn();
    await weverse.signIn(userEmail, userPassword);
    await community.gotoCommunity('plave');
    await community.clickMediaTab();
    await community.checkMediaTab_newTab();
    await community.checkMediaTab_membershipTab();
    await community.checkMediaTab_allTab();
    await community.gotoCommunity('weversezone');
    await community.clickMediaTab();
    await community.checkMediaTab_newTab();
    await community.checkMediaTab_recommendTab();
    await community.checkMediaTab_allTab();
    await community.gotoCommunity('conangray');
    await community.clickMediaTab();
    await community.checkMediaTab_newTab();
    await community.checkMediaTab_allTab();
  });

  test('check community live tab', async ({ }) => {
    await weverse.gotoMain();
    await weverse.closeModal();
    await weverse.clickHeaderButton_signIn();
    await weverse.signIn(userEmail, userPassword);
    await community.gotoCommunity('nct127');
    await community.clickLiveTab();
    await community.checkLiveTab_lastLiveBy('도영');
  });
});
