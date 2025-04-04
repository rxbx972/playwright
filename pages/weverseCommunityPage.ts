import { expect } from '@playwright/test';
import config from '../config/weverseConfig.json';

class weverseCommunityPage {

  page: any;
  communityName: any;

  constructor(page) {
    this.page = page;
  }

  /**
   * @param communityDomain
   */
  async gotoCommunity(communityDomain) {
    await this.page.goto(config.serviceUrl + communityDomain);

    this.communityName = await this.page.locator('[class^="HeaderCommunityDropdownWrapperView_name__"]').textContent();
    console.log(`${this.communityName} 커뮤니티 페이지 진입`);
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
    console.log(`${this.communityName} 커뮤니티 가입 완료`);

    const myNickname = await this.page.locator('[class^="CommunityAsideMyProfileView_name_text__"]').textContent();
    
    await expect(myNickname).toEqual(nickname);
    console.log(`나의 커뮤니티 닉네임: ${myNickname}`);
  }

  async enterFanTab() {
    const fanTab = this.page.locator('a[class^="CommunityHeaderNavigationView_link"]').filter({ hasText: 'Fan' });

    await fanTab.click();
    await expect(this.page).toHaveURL(/feed/);
    await expect(fanTab).toHaveAttribute('aria-current', 'true');
    console.log(`${this.communityName} 커뮤니티 팬탭 진입`);
  }

  async enterArtistTab() {
    const artistTab = this.page.locator('a[class^="CommunityHeaderNavigationView_link"]').filter({ hasText: 'Artist' });

    await artistTab.click();
    await expect(this.page).toHaveURL(/artist/);
    await expect(artistTab).toHaveAttribute('aria-current', 'true');
    console.log(`${this.communityName} 커뮤니티 아티스트탭 진입`);
  }

  async enterMediaTab() {
    const mediaTab = this.page.locator('a[class^="CommunityHeaderNavigationView_link"]').filter({ hasText: 'Media' });

    await mediaTab.click();
    await expect(this.page).toHaveURL(/media/);
    await expect(mediaTab).toHaveAttribute('aria-current', 'true');
    console.log(`${this.communityName} 커뮤니티 미디어탭 진입`);
  }

  async enterLiveTab() {
    const liveTab = this.page.locator('a[class^="CommunityHeaderNavigationView_link"]').filter({ hasText: 'LIVE' });

    await liveTab.click();
    await expect(this.page).toHaveURL(/live/);
    await expect(liveTab).toHaveAttribute('aria-current', 'true');
    console.log(`${this.communityName} 커뮤니티 라이브탭 진입`);
  }

  async enterShop() {
    const shopTab = this.page.locator('a[class^="CommunityHeaderNavigationView_link"]').filter({ hasText: 'Shop' });

    const [weverseShopPage] = await Promise.all([
      this.page.waitForEvent('popup'),
      shopTab.click()
    ]);

    await weverseShopPage.waitForLoadState();
    await expect(weverseShopPage).toHaveURL(/shop.weverse/);

    const shopName = this.page.locator('button[aria-describedby="shop-artist-navigation"]');

    await expect(shopName).toEqual(this.communityName);
    console.log(`${this.communityName} 위버스샵 페이지 진입`);

    await weverseShopPage.close();
    console.log(`위버스샵 페이지 닫기`);
  }

  async clickArtistpedia() {
    const artistpedia = this.page.locator('a[class^="CommunityAsideWelcomeView_community__"]');

    await this.page.mouse.wheel(0, 1000);
    await artistpedia.click();
    await expect(this.page).toHaveURL(/artistpedia/);
    console.log(`${this.communityName} 아티스트피디아 페이지 진입 확인`);
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
    console.log(`팬탭 - 첫번째 코멘트 클릭하여 포스트 진입 확인`);
  }

  async postModal_closeModal() {
    const closeButton = this.page.locator('button[class^="BaseModalView_close_button__"]');

    await closeButton.click();
    await expect(closeButton).not.toBeVisible();
    console.log(`포스트 - 닫기 확인`);
  }

  /* 작성중 */
  async postModal_writeComment(text) {
    const commentInput = this.page.locator('textarea[class^="CommentInputView_textarea__"]');
    const submitButton = this.page.locator('button[class^="CommentInputView_send_button__"]');
    const myComment = this.page.locator(''); // text

    await commentInput.fill(text);
    await submitButton.click();
    await expect(myComment).toBeVisible();
    console.log(`포스트 - 댓글 작성 확인`);
  }

  async postModal_likePost() {
    const nickname = this.page.locator('div[class^="PostModalView_post_header__"]').locator('[class^="PostHeaderView_nickname__"]');
    const likeButton = this.page.locator('div[class^="PostModalView_post_action__"]').locator('button[class^="EmotionButtonView_button_emotion__"]');
    
    await likeButton.click();
    await expect(likeButton).toHaveAttribute('aria-pressed', 'true');
    console.log(`포스트 - '${await nickname.textContent()}'의 포스트 좋아요 확인`);
  }

  async postModal_unlikePost() {
    const nickname = this.page.locator('div[class^="PostModalView_post_header__"]').locator('[class^="PostHeaderView_nickname__"]');
    const likeButton = this.page.locator('div[class^="PostModalView_post_action__"]').locator('button[class^="EmotionButtonView_button_emotion__"]');
    
    await likeButton.click();
    await expect(likeButton).toHaveAttribute('aria-pressed', 'false');
    console.log(`포스트 - '${await nickname.textContent()}'의 포스트 좋아요 취소 확인`);
  }

  async fanTab_clickPostEditor() {
    const fanPost_editorInput = this.page.locator('div[class^="EditorInputView_thumbnail_area__"]');
    const editorModal = this.page.locator('div[id="editorWriteModal"]');

    await fanPost_editorInput.click();
    await expect(editorModal).toHaveAttribute('aria-label', '포스트 쓰기');
    console.log(`팬탭 - 포스트 작성 클릭하여 에디터 진입 확인`);
  }

  async editorModal_closeModal() {
    const closeButton = this.page.locator('button[class^="BaseModalView_close_button__"]');

    await closeButton.click();
    await expect(closeButton).not.toBeVisible();
    console.log(`에디터 - 닫기 확인`);
  }

  async editorModal_cancelModal() { 
    const closeButton = this.page.locator('button[class^="BaseModalView_close_button__"]');
    const cancelButton = this.page.locator('button[class^="ModalButtonView_button__"]').filter({ hasText: '삭제하기' });

    await closeButton.click();
    await cancelButton.click();
    await expect(closeButton).not.toBeVisible();
    console.log(`에디터 - 작성 취소 후 닫기 확인`);
  }

  async editorModal_saveModal() { 
    const closeButton = this.page.locator('button[class^="BaseModalView_close_button__"]');
    const saveButton = this.page.locator('button[class^="ModalButtonView_button__"]').filter({ hasText: '저장' });

    await closeButton.click();
    await saveButton.click();
    await expect(closeButton).not.toBeVisible();
    console.log(`포스트 - 작성 저장 후 닫기 확인`);
  }

  /* 작성중 */
  async editorModal_writeText(text) {
    const editorArea = this.page.locator('div[id="wevEditor"]');
    const submitButton = this.page.locator('button[class^="EditorWriteModalFooterView_button_submit__"]');
    const myText = this.page.locator(''); // text

    await editorArea.fill(text);
    await submitButton.click();
    await expect(myText).toBeVisible();
    console.log(`포스트 - 텍스트 작성 확인`);
  }

  async artistTab_likePost() {
    const artistPost_text = this.page.locator('[class^="ArtistPostListItemView_post_text_wrap__"]').nth(0);
    const artistPost_nickname = this.page.locator('[class^="ArtistPostListItemView_artist_name__"]').nth(0);
    const artistPost_like = this.page.locator('button[class^="EmotionButtonView_button_emotion__"]').nth(0);
    const artistPostModal_like = this.page.locator('[class^="PostModalView_post_action__"]').locator('button[class^="EmotionButtonView_button_emotion__"]');
    const artistPostModal_close = this.page.locator('button[class^="BaseModalView_close_button__"]');
    
    await artistPost_like.click();
    await expect(artistPost_like).toHaveAttribute('aria-pressed', 'true');
    console.log(`아티스트탭 - '${await artistPost_nickname.textContent()}'의 포스트 좋아요 클릭 확인`);

    await artistPost_text.click();
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

  async media_likeMedia() {
    const title = this.page.locator('div[class^="HeaderView_container__"]').locator('[class^="TitleView_title__"]');
    const likeButton = this.page.locator('div[class^="HeaderView_option_wrap__"]').locator('button[class^="EmotionButtonView_button_emotion__"]');
    
    await likeButton.click();
    await expect(likeButton).toHaveAttribute('aria-pressed', 'true');
    console.log(`미디어 - '${await title.textContent()}' 미디어 좋아요 확인`);
  }

  async media_unlikeMedia() {
    const title = this.page.locator('div[class^="HeaderView_container__"]').locator('[class^="TitleView_title__"]');
    const likeButton = this.page.locator('div[class^="HeaderView_option_wrap__"]').locator('button[class^="EmotionButtonView_button_emotion__"]');
    
    await likeButton.click();
    await expect(likeButton).toHaveAttribute('aria-pressed', 'false');
    console.log(`미디어 - '${await title.textContent()}' 미디어 좋아요 취소 확인`);
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

  async live_likeLive() {
    const title = this.page.locator('div[class^="HeaderView_container__"]').locator('[class^="TitleView_title__"]');
    const likeButton = this.page.locator('div[class^="HeaderView_option_wrap__"]').locator('button[class^="EmotionButtonView_button_emotion__"]');
    
    await likeButton.click();
    await expect(likeButton).toHaveAttribute('aria-pressed', 'true');
    console.log(`라이브 - '${await title.textContent()}' 라이브 좋아요 확인`);
  }

  async live_unlikeLive() {
    const title = this.page.locator('div[class^="HeaderView_container__"]').locator('[class^="TitleView_title__"]');
    const likeButton = this.page.locator('div[class^="HeaderView_option_wrap__"]').locator('button[class^="EmotionButtonView_button_emotion__"]');
    
    await likeButton.click();
    await expect(likeButton).toHaveAttribute('aria-pressed', 'false');
    console.log(`라이브 - '${await title.textContent()}' 라이브 좋아요 취소 확인`);
  }
}

export { weverseCommunityPage }