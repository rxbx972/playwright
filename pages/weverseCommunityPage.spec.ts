import { expect } from '@playwright/test';
import config from '../config/weverseConfig.json';

class weverseCommunityPage {

  page: any;

  constructor(page) {
    this.page = page;
  }

  /**
   * @param communityName
   */
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

  async enterFanTab() {
    const fanTab = this.page.locator('a[class^="CommunityHeaderNavigationView_link"]').filter({ hasText: 'Fan' });

    await fanTab.click();
    await expect(this.page).toHaveURL(/feed/);
    await expect(fanTab).toHaveAttribute('aria-current', 'true');
    console.log(`커뮤니티 팬탭 진입`);
  }

  async enterArtistTab() {
    const artistTab = this.page.locator('a[class^="CommunityHeaderNavigationView_link"]').filter({ hasText: 'Artist' });

    await artistTab.click();
    await expect(this.page).toHaveURL(/artist/);
    await expect(artistTab).toHaveAttribute('aria-current', 'true');
    console.log(`커뮤니티 아티스트탭 진입`);
  }

  async enterMediaTab() {
    const mediaTab = this.page.locator('a[class^="CommunityHeaderNavigationView_link"]').filter({ hasText: 'Media' });

    await mediaTab.click();
    await expect(this.page).toHaveURL(/media/);
    await expect(mediaTab).toHaveAttribute('aria-current', 'true');
    console.log(`커뮤니티 미디어탭 진입`);
  }

  async enterLiveTab() {
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

  async fanTab_likePost() {
    const fanPost_like = this.page.locator('button[class^="EmotionButtonView_button_emotion__"]').nth(0);

    await fanPost_like.click();
    await expect(fanPost_like).toHaveAttribute('aria-pressed', 'true');
    console.log(`팬탭 - 첫번째 포스트 좋아요 클릭 확인`);
  }

  async fanTab_clickArtistComment() {
    const fanPost_artistComment = this.page.locator('div[class^="FeedArtistCommentFlickerItemView_thumbnail_wrap__"]').nth(0);
    const postModal = this.page.locator('div[id="modal"]');

    await fanPost_artistComment.click();
    await expect(postModal).toHaveAttribute('aria-label', 'Reading feed post');
    console.log(`팬탭 - 첫번째 코멘트 클릭 확인`);

    const postModal_commentInput = this.page.locator('textarea[class^="CommentInputView_textarea__"]');
    const postModal_commentSubmit = this.page.locator('button[class^="CommentInputView_send_button__"]');
    const text = '사랑해~!';

    await postModal_commentInput.fill(text);
    await postModal_commentSubmit.click();
    // ing
  }

  async artistTab_likePost() {
    const artistPost_post = this.page.locator('[class^="ArtistPostListItemView_post_text_wrap__"]').nth(0);
    const artistPost_nickname = this.page.locator('[class^="ArtistPostListItemView_artist_name__"]').nth(0);
    const artistPost_like = this.page.locator('button[class^="EmotionButtonView_button_emotion__"]').nth(0);
    const artistPostModal_like = this.page.locator('[class^="PostModalView_post_action__"]').locator('button[class^="EmotionButtonView_button_emotion__"]');
    const artistPostModal_close = this.page.locator('button[class^="BaseModalView_close_button__"]');
    
    await artistPost_like.click();
    await expect(artistPost_like).toHaveAttribute('aria-pressed', 'true');
    console.log(`아티스트탭 - '${await artistPost_nickname.textContent()}'의 포스트 좋아요 클릭 확인`);

    await artistPost_post.click();
    await expect(artistPostModal_like).toHaveAttribute('aria-pressed', 'true');
    await artistPostModal_like.click();
    await expect(artistPostModal_like).toHaveAttribute('aria-pressed', 'false');
    await artistPostModal_close.click();
    await expect(artistPost_like).toHaveAttribute('aria-pressed', 'false');
    console.log(`아티스트탭 - '${await artistPost_nickname.textContent()}'의 포스트 좋아요 취소 확인`);
  }

  async mediaTab_enterNewTab() {
    const newTab = this.page.locator('a[class^="MediaNavView_link__"]').filter({ hasText: 'Latest Media' });

    await newTab.click();
    await expect(this.page).toHaveURL(/new/);
    await expect(newTab).toHaveAttribute('aria-selected', 'true');
    console.log(`미디어탭 - 최신 미디어 진입 확인`);
  }

  async mediaTab_enterRecommendTab() {
    const recommendTab = this.page.locator('a[class^="MediaNavView_link__"]').filter({ hasText: 'Recommended Media' });
    
    await recommendTab.click();
    await expect(this.page).toHaveURL(/recommend/);
    await expect(recommendTab).toHaveAttribute('aria-selected', 'true');
    console.log(`미디어탭 - 추천 미디어 진입 확인`);
  }

  async mediaTab_enterMembershipTab() {
    const membershipTab = this.page.locator('a[class^="MediaNavView_link__"]').filter({ hasText: 'Membership' });
    
    await membershipTab.click();
    await expect(this.page).toHaveURL(/membership/);
    await expect(membershipTab).toHaveAttribute('aria-selected', 'true');
    console.log(`미디어탭 - 멤버십 진입 확인`);
  }

  async mediaTab_enterAllTab() {
    const allTab = this.page.locator('a[class^="MediaNavView_link__"]').filter({ hasText: 'See All Media' });

    await allTab.click();
    await expect(this.page).toHaveURL(/all/);
    await expect(allTab).toHaveAttribute('aria-selected', 'true');
    console.log(`미디어탭 - 전체 미디어 진입 확인`);
  }

  /**
   * @param artistName
   */
  async liveTab_clickLastLiveBy(artistName) {
    const lastLive = this.page.locator('a[class^="LiveListView_live_item__"]').filter({ hasText: artistName }).nth(0);
    const lastLiveBadge = this.page.locator('em[class*="LiveBadgeView_-replay__"]');
    const lastLiveChat = this.page.locator('button[class^="PreviousLiveChatButtonView_show_chat_button__"]');

    await lastLive.click();
    await expect(lastLiveBadge).toBeVisible();
    await expect(lastLiveChat).toBeVisible();
    console.log(`라이브탭 - '${artistName}'의 지난 라이브 진입 확인`);
  }
}

export { weverseCommunityPage }