---
templateKey: blog-post
title: Vue JS 이해 및 환경설정
date: 2021-03-28T09:11:34.709Z
description: 뷰(Vue.js)는 점진적으로 채택 가능한 구조를 갖추고 있다. 코어 라이브러리는 선언형 렌더링과 컴포넌트 구성에 초점을 두며 기존 페이지에 임베드가 가능하다. 라우팅, 상태 관리, 빌드 도구화와 같이 복잡한 애플리케이션에 필요한 고급 기능들은 공식적으로 유지 보수되는 지원 라이브러리와 패키지를 통해 제공된다.
tags:
  - vue
  - javascript
  - framework
  - frontend
  - web
---

![Vue JS 이해 및 환경설정](/assets/vue-logo.png "Vue JS 이해 및 환경설정")

Vue.js는 웹 애플리케이션의 사용자 인터페이스를 만들기 위해 사용하는 오픈 소스 프로그레시브 자바스크립트 프레임워크이다.

아래와 같은 특징을 가진다.

**특징**

- SPA (Single Page Application)
- 재사용 가능한 Components 기반 웹 페이지 개발
- 데이터 바인딩과 화면 단위를 컴포넌트 형태로 제공하며, 관련 API 를 지원하는데에 궁극적인 목적이 있음
- Angular에서 지원하는 양방향 데이터 바인딩 을 동일하게 제공 하지만 컴포넌트 간 통신의 기본 골격은 React의 단방향 데이터 흐름(부모 -> 자식)을 사용
- 다른 프런트엔드 프레임워크(Angular, React)와 비교했을 때 상대적으로 가볍고 빠름.
- 문법이 단순하고 간결하여 초기 학습 비용이 낮고 누구나 쉽게 접근 가능

## 확장도구

### chrome

- Vue.js devtools

### VS Code - Extensions

- vetur : Vue.js 작업시 편리한 기능들을 제공 한다.
- Material Icon Theme
- Live Server

### Node.js

구글 V8엔진을 기반으로 만들어진 서버측 자바스크립트 언어이자 플랫폼
Node 설치시 "npm" 이 자동 설치된다.

- LTS 버전으로 설치 (Long Term Support : 장기간 지원)

### Vue CLI 설치

VS Code 터미널 실행후 아래 명령어 입력 한다.

```
npm install -g @vue/cli
```

Vue CLI (Vue command line interface) 는 기본 vue 개발 환경을 설정해주는 도구이다. vue-cli 가 기본적인 프로젝트 세팅을 해주기 때문에 폴더 구조에 대한 고민, lint, build, 어떤 라이브러리로 구성을 해야되는지 webpack 설정은 어떻게 해야되는지에 대한 고민을 덜을 수 있다.

> **CLI 란 ?**
>
> 명령 줄 인터페이스(CLI, Command line interface) 또는 명령어 인터페이스는 텍스트 터미널을 통해 사용자와 컴퓨터가 상호 작용하는 방식을 뜻한다. 즉, 작업 명령은 사용자가 컴퓨터 키보드 등을 통해 문자열의 형태로 입력하며, 컴퓨터로부터의 출력 역시 문자열의 형태로 주어진다. (위키백과)

### 프로젝트 생성

- babel : 최신 문법의 코드를 호환 가능한 현재 하위 문법으로 자동 변환 (ES2015 모듈 포함) 한다.
- eslint : 자바스크립트 문법이나 코딩 스타일을 체크해서 알려준다

```
vue create {프로젝트명} // 프로젝트명이 폴더로 생성된다.
```

1. Manually select features

   ![Manually select features](/assets/vue-cli-1.png "Manually select features")

2. Babel, Progressive Web App (PWA) Support, Router, Vuex, Linter/Formatter, Unit Testing, E2E Testing 추가

   ![abel, Progressive Web App (PWA) Support, Router, Vuex, Linter/Formatter, Unit Testing, E2E Testing 추가](/assets/vue-cli-2.png "abel, Progressive Web App (PWA) Support, Router, Vuex, Linter/Formatter, Unit Testing, E2E Testing 추가")

3. Use history mode for router? (Y 선택)

   ![Use history mode for router](/assets/vue-cli-3.png "Use history mode for router")

4. Pick a linter / formatter config (ESLint + Prettier 선택)

   ![Pick a linter / formatter config](/assets/vue-cli-4.png "Pick a linter / formatter config")

5. Pick additional lint features (Lint on save 선택)

   ![Pick additional lint features](/assets/vue-cli-5.png "Pick additional lint features")

6. Pick a unit testing solution (Jest 선택)

   ![Pick a unit testing solution](/assets/vue-cli-6.png "Pick a unit testing solution")

7. Pick an E2E testing solution (Cypress 선택)

   ![Pick an E2E testing solution](/assets/vue-cli-7.png "Pick an E2E testing solution")

8. Where do you prefer placing config for Babel, ESLint, etc.? (In dedicated config files 선택)

   ![Where do you prefer placing config for Babel, ESLint, etc](/assets/vue-cli-8.png "Where do you prefer placing config for Babel, ESLint, etc")

9. Save this as a preset for future projects? (Y 선택 ~ 저장될 preset {이름})

   ![Save this as a preset for future projects?](/assets/vue-cli-9.png "Save this as a preset for future projects?")

10. 프로젝트 생성 완료

    ![프로젝트 생성 완료](/assets/vue-cli-10.png "프로젝트 생성 완료")

### 프로젝트 구조

![vue-프로젝트구조](/assets/vue-프로젝트구조.png "vue-프로젝트구조")

- package.json : 지정된 의존성이 node_modules에 설치 된다.
- node_modules : 앱 개발과 배포에 필요한 npm 패키지들이 저장 된다.
- src : 개발자가 작성한 코드가 저장 된다.
- public
  - 공용으로 접근 가능한 정적 파일이 저장 된다.
  - 배포버전을 빌드할 때 필요한 파일이 저장 된다.
- dist
  - 빌드한 결과물이 저장 된다. (운영 서버에 배포할 파일 이다.)

### 프로젝트 실행 or 빌드

**serve**
개발용 버전으로 웹 실행

```
npm run serve
// vue-cli-service serve
```

![vue npm run serve](/assets/vue-프로젝트구조-serve.png "vue npm run serve")

실행 화면

![vue npm run serve view](/assets/vue-프로젝트구조-serve-view.png "vue npm run serve view")

**build**
배포용 버전으로 dist 생성

```
npm run build
vue-cli-service build
```

![vue npm run build](/assets/vue-프로젝트구조-build-dist.png "vue npm run build")
