import { test } from '@playwright/test';
import { weversePage2 } from '../pages/weversePage2.spec';
import { weverseCommunityPage } from '../pages/weverseCommunityPage.spec';
import config from '../config/weverseConfig.json';

const userEmail = config.email;
const userPassword = config.password;

let weverse;
let community;

test.beforeEach(async ({ page }) => {
  weverse = new weversePage2(page);
  community = new weverseCommunityPage(page);
});

test.afterEach(async ({ page }) => {
  await page.close();
  console.log("위버스 테스트 종료");
});

test.describe('Weverse Test', () => {

  test.skip('login and logout', async ({ }) => {
    await weverse.gotoMain();
    await weverse.closeModal();
    await weverse.clickHeaderButton_signIn();
    await weverse.signIn(userEmail, userPassword);
    await weverse.getResponse_wid();
    await weverse.clickHeaderButton_profile();
    await weverse.signOut();
  });

  test.skip('enter jellyshop and shop', async ({ }) => {
    await weverse.gotoMain();
    await weverse.closeModal();
    await weverse.clickHeaderButton_jellyShop();
    await weverse.clickHeaderButton_weverseShop();
  });

  test.skip('enter new artist', async ({ }) => {
    await weverse.gotoMain();
    await weverse.closeModal();
    await weverse.enterNewArtist();
  });

  test.skip('join community', async ({ }) => {
    await weverse.gotoMain();
    await weverse.closeModal();
    await weverse.clickHeaderButton_signIn();
    await weverse.signIn(userEmail, userPassword);
    await community.gotoCommunity('cnblue');
    await community.joinCommunity();
  });

  test.skip('enter community', async ({ }) => {
    await weverse.gotoMain();
    await weverse.closeModal();
    await weverse.clickHeaderButton_signIn();
    await weverse.signIn(userEmail, userPassword);

    await community.gotoCommunity('enhypen');
    await community.closeModal();
    await community.enterFanTab();
    await community.fanTab_likePost();
    await community.enterArtistTab();
    await community.artistTab_likePost();

    await community.gotoCommunity('plave');
    await community.enterMediaTab();
    await community.mediaTab_enterNewTab();
    await community.mediaTab_enterMembershipTab();
    await community.mediaTab_enterAllTab();
    await community.gotoCommunity('weversezone');
    await community.enterMediaTab();
    await community.mediaTab_enterNewTab();
    await community.mediaTab_enterRecommendTab();
    await community.mediaTab_enterAllTab();

    await community.gotoCommunity('nct127');
    await community.enterLiveTab();
    await community.liveTab_clickLastLiveBy('도영');
  });

  test('write community', async ({ }) => {
    await weverse.gotoMain();
    await weverse.closeModal();
    await weverse.clickHeaderButton_signIn();
    await weverse.signIn(userEmail, userPassword);

    await community.gotoCommunity('illit');
    await community.closeModal();
    await community.clickFanTab();
    await community.fanTab_clickArtistComment();
  });
});
