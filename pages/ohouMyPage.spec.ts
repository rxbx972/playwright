import { expect } from '@playwright/test';

class ohouMyPage {

  page: any;

  constructor(page) {
    this.page = page;
  }

  async scrapbook_allTab_edit() {
    const editButton = this.page.getByRole('button', { name: '편집' });
    const moveButton = this.page.getByRole('button', { name: '폴더이동' });
    const deleteButton = this.page.getByRole('button', { name: '삭제' });
    const cancelButton = this.page.getByRole('button', { name: '취소' });

    // 한번에 50개씩만 편집이 가능합니다

    await editButton.click();
    await expect(cancelButton).toBeVisible();
    console.log('스크랩북 편집 모드 전환 확인');

    await this.checkAllVirtualizedCheckboxes();
  }

  /* 내가 방금 체크한 요소의 다음형제를 찾는 방식 */
  async checkAllVirtualizedCheckboxes() {
    let k = 0;
    const processedContents = new Set<string>();
    const nextElement = '//following-sibling::div[@class="css-3q4ecs e1e5aqb12"]';
    // 'xpath=following-sibling::div[@class="css-3q4ecs e1e5aqb12"]'
    
    // 첫 번째 체크박스를 찾기
    const firstElement = await this.page.locator('div[class="css-3q4ecs e1e5aqb12"]').first();
    let currentElement = firstElement;
  
    while (currentElement) {
      if (!currentElement) {
        console.log("currentElement가 null 또는 undefined입니다.");
        break;
      }
      // 현재 요소에서 href 값을 가져옵니다.
      const href = await currentElement.locator('a').evaluate(el => el.getAttribute('href'));
      console.log(':: href: ' + href);
  
      // 이미 체크한 요소는 건너뛰기
      if (processedContents.has(href)) {
        console.log(':: 이미 체크한 항목 ::');
        
        // 다음 항목으로 이동
        currentElement = await currentElement.locator(nextElement).first();
        await currentElement.waitFor({ timeout: 3000 }); // 3초 대기
        console.log(':: 다음 항목으로 이동 ::');
        continue;
      }

      // 새로 체크할 요소인 경우
      if (!processedContents.has(href)) {
        const checkbox = currentElement.locator('input[type="checkbox"].css-f3z39x');
        
        // 체크박스가 화면에 보이지 않으면 스크롤
        await currentElement.scrollIntoViewIfNeeded();
        console.log(':: ㄴ 스크롤 이동 ::');
        
        // 체크하고, 체크가 되었는지 확인
        await checkbox.check();
        await expect(checkbox).toBeChecked();
        console.log(':: ' + (++k) + ' 번째 체크 완료 :: ');
  
        // 체크한 후 processedContents에 추가
        processedContents.add(href);
      }

      try {
        // 다음 항목으로 이동
      currentElement = await currentElement.locator(nextElement).first();

        // 다음 요소가 보일 때까지 기다리기
        // await currentElement.waitFor({ timeout: 3000 }); // 3초 대기
        console.log(':: 다음 항목으로 이동 ::');

      } catch (error) {
        console.error("에러 발생:", error);
        break;  // 예외가 발생하면 종료하거나 다른 처리를 할 수 있습니다.
      }

      // 더 이상 체크할 항목이 없으면 종료
      if (!currentElement) {
        console.log(':: 더 이상 체크할 항목이 없음 ::');
        break;
      }
  
      // 자동 스크롤 후, 새로 로드된 요소가 체크되어야 하므로 잠시 대기
      await this.page.waitForTimeout(500);
  
      // // 새로 로드된 요소가 화면에 나타났는지 확인
      // const newElementsLoaded = await this.page.locator('div[class="css-3q4ecs e1e5aqb12"]').count();
      // console.log(':: 새로 로드된 요소 개수: ' + newElementsLoaded);
    }
  }
  


  /* 마지막 체크된 요소에 자동 스크롤 & 화면에 표기되기까지 대기 */
  async checkAllVirtualizedCheckboxes4() {
    let k = 0;
    const processedContents = new Set<string>();
    const renderedElements = new Set<string>();

    while (true) {
      const visibleContents = this.page.locator('div[class="css-3q4ecs e1e5aqb12"]');
      const count = await visibleContents.count();
      console.log(':: count 개수 = ' + count + ' ::');

      let foundNewItem = false;

      for (let i = 0; i < count; i++) {
        const contents = visibleContents.nth(i);
        const href = await contents.locator('a').evaluate(el => el.getAttribute('href'));
        console.log(':: href = ' + href);

        if (processedContents.has(href)) {
          continue;
        }

        if (!processedContents.has(href)) {
          await processedContents.add(href);
          const checkbox = contents.locator('input[type="checkbox"].css-f3z39x');

          // 체크박스가 화면에 보일 때까지 대기
          await checkbox.waitFor('visible', 3000);
          await checkbox.check();
          // await expect(checkbox).toBeChecked();
          console.log(':: ' + (++k) + ' 번째 체크 완료 :: ');

          foundNewItem = true;
        }
      }

      const currentElementIds = await this.page.locator('div[class="css-3q4ecs e1e5aqb12"] a').evaluateAll(els =>
        els.map(el => el.getAttribute('href'))
      );

      const newElements = currentElementIds.filter(id => !renderedElements.has(id));

      if (newElements.length === 0) {
        console.log(':: 더 이상 새로 로드된 요소가 없음 ::');
        break;
      }

      newElements.forEach(id => renderedElements.add(id));

      if (!foundNewItem) {
        console.log(':: 더 이상 체크할 요소가 없음 ::');
        break;
      }

      await this.page.waitForTimeout(500);  
    }

    console.log(`:: 전체 체크된 개수: ${k} ::`);
  }

  /* 마지막 체크된 요소에 자동 스크롤 하는 방식 */
  async checkAllVirtualizedCheckboxes3() {
    let k = 0;
    const processedContents = new Set<string>();

    while (true) {
      const visibleContents = this.page.locator('div[class="css-3q4ecs e1e5aqb12"]');
      const count = await visibleContents.count();
      console.log(':: count 개수 = ' + count + ' ::');

      let foundNewItem = false;

      for (let i = 0; i < count; i++) {
        const contents = visibleContents.nth(i);
        const href = await contents.locator('a').evaluate(el => el.getAttribute('href'));
        console.log(':: href = ' + href);

        // 이미 체크한 요소는 건너뛰기
        if (processedContents.has(href)) {
          continue;
        }

        // 새로 체크할 요소인 경우
        if (!processedContents.has(href)) {
          await processedContents.add(href);

          const checkbox = contents.locator('input[type="checkbox"].css-f3z39x');
          await checkbox.check();
          await expect(checkbox).toBeChecked();
          console.log(':: ' + (++k) + ' 번째 체크 완료 :: ');
          foundNewItem = true;
        }

        // 마지막 체크된 요소에 자동 스크롤 
        await contents.scrollIntoViewIfNeeded(); 
        console.log(':: ㄴ 스크롤 이동 ::');
      }

      // 만약 새로 체크할 요소가 없다면 더 이상 스크롤할 필요가 없음
      if (!foundNewItem) {
        console.log(':: 더 이상 체크할 요소가 없음 ::');
        break;
      }

      await this.page.waitForTimeout(500);  

      // 자동 포커스로 스크롤된 후, 새로운 요소가 로드되기를 기다림
      const newElementsLoaded = await this.page.locator('div[class="css-3q4ecs e1e5aqb12"]').count();
      if (newElementsLoaded === count) {
        console.log(':: 새로운 요소가 없음 ::');
        break;
      }
    }
  }

  /* 스크롤 컨테이너 기반으로 스크롤 하는 방식 */
  async checkAllVirtualizedCheckboxes2() {
    let k = 0;
    const scrollContainer = this.page.locator('div[class="css-8mhhua e84dpj02"]');
    const processedContents = new Set<string>();

    let lastCheckedHref: string | null = null;

    while (true) {
      const visibleContents = this.page.locator('div[class="css-3q4ecs e1e5aqb12"]');
      const count = await visibleContents.count();
      console.log(':: count 개수 = ' + count + ' ::');

      for (let i = 0; i < count; i++) {
        const contents = visibleContents.nth(i);
        const href = await contents.locator('a').evaluate(el => el.getAttribute('href'));
        console.log(':: href = ' + href)

        // 이미 체크한 요소는 건너뛰기
        if (processedContents.has(href)) {
          continue;
        }

        // 새로 체크할 요소인 경우
        if (href !== lastCheckedHref) {
          await processedContents.add(href);

          const checkbox = contents.locator('input[type="checkbox"].css-f3z39x');
          await checkbox.check();
          await expect(checkbox).toBeChecked();
          console.log(':: ' + (++k) + ' 번째 체크 완료 :: ');
          lastCheckedHref = href;
        }
      }

      try {
        console.log(':: 스크롤 아래로 이동 ::');

        await scrollContainer.evaluate(async (container: HTMLElement) => {
          const scrollHeight = container.offsetHeight;
          let scrollAmount = 0;
          console.log('scrollHeight = ' + scrollHeight);
          console.log('scrollAmount = ' + scrollAmount);

          while (scrollAmount < scrollHeight) {
            container.scrollBy(0, 1000);  // 한 번에 1000px씩 스크롤
            scrollAmount += 1000;
            await new Promise(resolve => setTimeout(resolve, 1000));  // 1000ms 대기
          }
        });
        //   // await scrollContainer.evaluate((container: HTMLElement) => {
        //   //   container.scrollBy(0, container.offsetHeight);
        //   // });
      } catch (error) {
        console.error(':: 스크롤 중 오류 발생 ::', error);
        break;
      }
      await this.page.waitForTimeout(500);
    }
  }

}

export { ohouMyPage }