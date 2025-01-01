import { expect } from '@playwright/test';
import config from '../weverseConfig.json';

class weverseCommunityPage {

  page: any;

  constructor(page) {
    this.page = page;
  }

  async gotoCommunity(communityName) {
    await this.page.goto(config.serviceUrl + communityName);
    console.log(`${communityName} 커뮤니티 페이지 진입`);
  }

  async closeModal() {
    const modalCloseButton = this.page.locator('button[class^="BaseModalView_bottom_button__"]').nth(0);

    await modalCloseButton.click();
    console.log(`모달 존재 확인 후 닫기`);
  }

  async joinCommunity() {
    const joinCommunityButton = this.page.locator('button[class^="UserJoinInduceLayerView_link__"]');

    await joinCommunityButton.click();

    const nickname = await this.page.locator('input[class^="InputWithValidateMessageView_input__"]').getAttribute('value');
    console.log(`자동 생성된 닉네임: ${nickname}`);

    const nicknameConfirmButton = this.page.locator('button[class*="ModalButtonView_-confirm__"]');

    await nicknameConfirmButton.click();
    await expect(joinCommunityButton).not.toBe;
    console.log(`커뮤니티 가입 완료`);

    const myNickname = await this.page.locator('[class^="CommunityAsideMyProfileView_name_text__"]').textContent();
    await expect(myNickname).toEqual(nickname);

    console.log(`나의 커뮤니티 닉네임: ${myNickname}`);
  }

  async clickFanTab() {
    const fanTab = this.page.locator('a[class^="CommunityHeaderNavigationView_link"]').filter({ hasText: 'Fan' });

    await fanTab.click();
    await expect(this.page).toHaveURL(/feed/);
    await expect(fanTab).toHaveAttribute('aria-current', 'true');
    console.log(`커뮤니티 팬탭 진입`);
  }

  async clickArtistTab() {
    const artistTab = this.page.locator('a[class^="CommunityHeaderNavigationView_link"]').filter({ hasText: 'Artist' });

    await artistTab.click();
    await expect(this.page).toHaveURL(/artist/);
    await expect(artistTab).toHaveAttribute('aria-current', 'true');
    console.log(`커뮤니티 아티스트탭 진입`);
  }

  async clickMediaTab() {
    const mediaTab = this.page.locator('a[class^="CommunityHeaderNavigationView_link"]').filter({ hasText: 'Media' });

    await mediaTab.click();
    await expect(this.page).toHaveURL(/media/);
    await expect(mediaTab).toHaveAttribute('aria-current', 'true');
    console.log(`커뮤니티 미디어탭 진입`);
  }

  async clickLiveTab() {
    const liveTab = this.page.locator('a[class^="CommunityHeaderNavigationView_link"]').filter({ hasText: 'LIVE' });

    await liveTab.click();
    await expect(this.page).toHaveURL(/live/);
    await expect(liveTab).toHaveAttribute('aria-current', 'true');
    console.log(`커뮤니티 라이브탭 진입`);
  }

  async clickArtistpedia() {
    const artistpedia = this.page.locator('a[class^="CommunityAsideWelcomeView_community__"]');

    await this.page.mouse.wheel(0, 1000);
    await artistpedia.click();
    await expect(this.page).toHaveURL(/artistpedia/);
    console.log(`아티스트피디아 페이지 진입 확인`);
  }

  async checkFanTab_fanPost() {
    const fanPost_like = this.page.locator('button[class^="EmotionButtonView_button_emotion__"]').nth(0);

    await fanPost_like.click();
    await expect(fanPost_like).toHaveAttribute('aria-pressed', 'true');
    console.log(`팬탭 - 첫번째 팬포스트 좋아요 클릭 확인`);
  }

  async checkArtistTab_artistPost() {
    const artistPost_nickname = this.page.locator('[class^="ArtistPostListItemView_artist_name__"]').nth(0);
    const artistPost_like = this.page.locator('button[class^="EmotionButtonView_button_emotion__"]').nth(0);

    await artistPost_like.click();
    await expect(artistPost_like).toHaveAttribute('aria-pressed', 'true');
    console.log(`아티스트탭 - '${await artistPost_nickname.textContent()}'의 포스트 좋아요 클릭 확인`);
  }

  async checkMediaTab_newTab() {
    const newTab = this.page.locator('a[class^="MediaNavView_link__"]').filter({ hasText: 'Latest Media' });

    await newTab.click();
    await expect(this.page).toHaveURL(/new/);
    await expect(newTab).toHaveAttribute('aria-selected', 'true');
    console.log(`미디어탭 - 최신 미디어 진입 확인`);
  }

  async checkMediaTab_recommendTab() {
    const recommendTab = this.page.locator('a[class^="MediaNavView_link__"]').filter({ hasText: 'Recommended Media' });
    await recommendTab.click();
    await expect(this.page).toHaveURL(/recommend/);
    await expect(recommendTab).toHaveAttribute('aria-selected', 'true');
    console.log(`미디어탭 - 추천 미디어 진입 확인`);
  }

  async checkMediaTab_membershipTab() {
    const membershipTab = this.page.locator('a[class^="MediaNavView_link__"]').filter({ hasText: 'Membership' });
    await membershipTab.click();
    await expect(this.page).toHaveURL(/membership/);
    await expect(membershipTab).toHaveAttribute('aria-selected', 'true');
    console.log(`미디어탭 - 멤버십 진입 확인`);
  }

  async checkMediaTab_allTab() {
    const allTab = this.page.locator('a[class^="MediaNavView_link__"]').filter({ hasText: 'See All Media' });

    await allTab.click();
    await expect(this.page).toHaveURL(/all/);
    await expect(allTab).toHaveAttribute('aria-selected', 'true');
    console.log(`미디어탭 - 전체 미디어 진입 확인`);
  }

  // RelatedProductItemView_pakage_detail__
  //ㄴ strong RelatedProductItemView_package_name__-Xmh0
  //ㄴ ReactionCountView_count_item__
  async checkLiveTab_last() {
    const artistpedia = this.page.locator('a[class^="CommunityAsideWelcomeView_community__"]');

    await this.page.mouse.wheel(0, 1000);
    await artistpedia.click();
    await expect(this.page).toHaveURL(/artistpedia/);
    console.log(`아티스트피디아 페이지 진입 확인`);
  }
}

export { weverseCommunityPage }