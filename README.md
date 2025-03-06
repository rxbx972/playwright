# 🎭 Playwright

- official doc : https://playwright.dev/docs/intro

![image](https://github.com/user-attachments/assets/2cdc04f8-4309-4917-a693-c52f0efab231)


## 실행 환경 및 설정

1. 실행 환경  
    - MacOS 13.7.2
    - Chrome 132.0.6834.160
2. 필수 소프트웨어 설치
    - Homebrew
        ```
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        ```
    - Node.js & npm
        ```
        brew install node
        ```
3. Playwright 설치 
    - 설치 중 선택사항으로 `TypeScript` 선택
    ```
    npm init playwright
    ```
4. 테스트 자동화 솔루션 다운로드 
5. package.json 에 정의된 의존성 파일들을 설치
    ```
    npm install
    ```
6. 솔루션 실행에 필요한 브라우저 설치
    - Chromium (Chrome), Firefox, WebKit (Safari)
    ```
    npx playwright install
    ```

## 테스트 실행 방법 (2가지)

1. `npx playwright test tests/{test}.spec.ts`
    - 브라우저 지정하여 실행 : `--project=chromium` 추가
    - 실제 브라우저 창을 띄우고 실행 (Headed Mode) : `--headed` 추가
2. 또는 `npm run test tests/{test}.spec.ts`
    - package.json 파일 내 아래와 같이 정의 해두었음
        ```json
        "scripts": {
            "test": "playwright test --project=chromium --headed --workers=1"
         }
        ```
        
