---
templateKey: blog-post
title: 2021 Front end Road Map
date: 2021-04-25T17:58:59.354Z
category: etc
description: 2021년 Front End Road Map HTTP/S, HTML, CSS, JavaScript, NPM, BEM, Styled Component, CSS Module, Prettier, Jest, Cypress, Electron 등..
tags:
  - roadmap
  - frontend
  - 2021년
---

2021년도에는 아래와 같은 순서로 하나하나 살펴 보고자 한다.

## Internet

- HTTP/S

  HTTP/S 개념과 차이에 대해 학습 한다.

## Basic

- HTML

  하이퍼텍스트 마크업 언어는 웹 페이지를 위한 지배적인 마크업 언어다. 또한, HTML은 제목, 단락, 목록 등과 같은 본문을 위한 구조적 의미를 나타내는 것뿐만 아니라 링크, 인용과 그 밖의 항목으로 구조적 문서를 만들 수 있는 방법을 제공한다

- CSS

  종속형 시트 또는 캐스케이딩 스타일 시트는 마크업 언어가 실제 표시되는 방법을 기술하는 언어로, HTML과 XHTML에 주로 쓰이며, XML에서도 사용할 수 있다. W3C의 표준이며, 레이아웃과 스타일을 정의할 때의 자유도가 높다.

- JavaScript

  자바스크립트는 객체 기반의 스크립트 프로그래밍 언어이다. 이 언어는 웹 브라우저 내에서 주로 사용하며, 다른 응용 프로그램의 내장 객체에도 접근할 수 있는 기능을 가지고 있다. 또한 Node.js와 같은 런타임 환경과 같이 서버 프로그래밍에도 사용되고 있다.

## Package Managers

- npm

  자바스크립트 언어를 위한 패키지 관리자 이다.

## CSS Architecture

- BEM

  Block Element Modifier 의 약자 이며, CSS 스타일 방법론 으로써 BEM 외 SMACSS, OOCSS 등이 있다.

## Modern CSS

- Styled Component

  styled-coponents 는 자바스크립트의 태그가 지정된 템플릿 리터럴과 CSS 의 기능을 사용하여 구성 요소에 반응하는 스타일을 제공하는 CSS-in-JS 스타일링을 위한 프레임워크 이다.

- CSS Module

  css-module은 간결한 클래스명을 이용해서 컴포넌트 단위로 스타일을 적용할 때 사용 되며, css 속성을 모듈화 한 것이다.

## CSS Preprocessors

- Sass

  CSS 전처리기 Sass 외 Less, Stylus 가 있다. 전처리기는 CSS 문법과 굉장히 유사하지만 선택자의 중첩(Nesting)이나 조건문, 반복문, 다양한 단위(Unit)의 연산 등… 표준 CSS 보다 훨씬 많은 기능을 사용해서 편리하게 작성할 수 있다.

## CSS Frameworks

- Bootstrap

  HTML, CSS, JS 프레임워크 이머 부트스트랩은 SASS 스타일시트를 기반으로 한다.

## Build Tools

### Linters and Formetters

- Prettier

  코드 포멧터(Code Formatter)란 개발자가 작성한 코드를 정해진 코딩 스타일을 따르도록 변환해주는 도구 이다

- ESLint

  ESLint는 JavaScript, JSX의 정적 분석 도구로 오픈 소스 프로젝트입니다. 코드를 분석해 문법적인 오류나 안티 패턴을 찾아주고 일관된 코드 스타일로 작성하도록 도와준다

### Task Runners

- npm scripts

  npm script는 해당 프로젝트에서 npm으로 실행시키는 명령어를 선언 함으로써 스크립트명으로 npm 스크립트를 실행 시킬수 있다.

### Module Bundlers

웹 애플리케이션을 동작시키기 위한 서로 연관 관계가 있는 웹 구성 자원(HTML, CSS, Javscript, Images 등)을 모두 각각의 모듈로 보고 이들의 의존성을 묶고 조합해서 합쳐진 하나의 결과물(static한 자원)을 만드는 도구 이다.

- Webpack

  웹팩은 오픈 소스 자바스크립트 모듈 번들러이다

## Pick a Framework

JavaScript 기반 웹 프레임워크 이다

- Vue.js
- React.js (React)

## Web Components

웹 컴포넌트는 그 기능을 나머지 코드로부터 캡슐화하여 재사용 가능한 커스텀 엘리먼트를 생성하고 웹 앱에서 활용할 수 있도록 해주는 다양한 기술들의 모음 이다

- HTML Templates

  <template> 과 <slot> 엘리먼트는 렌더링된 페이지에 나타나지 않는 마크업 템플릿을 작성할 수 있게 해준다. 그 후, 커스텀 엘리먼트의 구조를 기반으로 여러번 재사용할 수 있다

- Custom Elements

  사용자 인터페이스에서 원하는대로 사용할 수있는 사용자 정의 요소 및 해당 동작을 정의 할 수있는 JavaScript API 세트 이다

- Shadow DOM

  캡슐화된 "그림자" DOM 트리를 엘리먼트 — 메인 다큐먼트 DOM 으로부터 독립적으로 렌더링 되는 — 를 추가하고 연관된 기능을 제어하기 위한 JavaScript API 의 집합. 이 방법으로 엘리먼트의 기능을 프라이빗하게 유지할 수 있어, 다큐먼트의 다른 부분과의 충돌에 대한 걱정 없이 스크립트와 스타일을 작성할 수 있다

## Testing your Apps

- Jest

  JS 테스트 프레임워크, 작성한 코드가 제대로 동작하는지 확인할 때 사용한다.

- Cypress

  Cypress 는 e2e 테스트 프레임워크이다. 화면 표시 테스트, UI 조작 테스트 등을 지원 한다.

## Type Checkers

- TypeScript

  타입스크립트는 자바스크립트의 슈퍼셋인 오픈소스 프로그래밍 언어 (타입을 가진 자바스크립트, 컴파일을 하면 타입스트립트 > 자바스트립트로 변환) 이다

## Progressive Web Apps

오프라인 작업, 푸시 알림, 장치 하드웨어 접근, 데스크톱과 모바일 장치의 네이티브 애플리케이션과 유사한 사용자 경험을 제공 할수 있다

### API

- Storage

  Web Storage API는 브라우저에서 쿠키를 사용하는 것보다 훨씬 직관적으로 key/value 데이터를 안전하게 저장할 수 있는 메커니즘을 제공, Storage 객체는 단순한 key-value 저장소 이다

- Web Sockets

  웹 소켓은 사용자의 브라우저와 서버 사이의 인터액티브 통신 세션을 설정할 수 있게 하는 기술, 개발자는 웹 소켓 API를 통해 서버로 메시지를 보내고 서버의 응답을 위해 서버를 폴링하지 않고도 이벤트 중심 응답을 받는 것이 가능 하다.

- Service Workers

  서비스 워커는 웹 응용 프로그램, 브라우저, 그리고 (사용 가능한 경우) 네트워크 사이의 프록시 서버 역할을 한다. 서비스 워커의 개발 의도는 여러가지가 있지만, 그 중에서도 효과적인 오프라인 경험을 생성하고, 네트워크 요청을 가로채서 네트워크 사용 가능 여부에 따라 적절한 행동을 취하고, 서버의 자산을 업데이트할 수 있다. 또한 푸시 알림과 백그라운드 동기화 API로의 접근도 제공한다.

- Location

  Geolocation API는 사용자가 원할 경우 웹 애플리케이션에 위치 정보를 제공할 수 있는 API이다. 개인정보 보호를 위해, 브라우저는 위치 정보를 제공하기 전에 사용자에게 위치 정보 권한에 대한 확인을 받는다

- Notification

  Notifications API 는 웹 페이지가 일반 사용자에게 시스템 알림 표시를 제어할 수 있게 해준다. 이러한 알람은 최상단 브라우징 컨텍스트 뷰포트의 바깥에 위치하므로 사용자가 탭을 변경하거나 다른 앱으로 이동했을때에도 표시할 수 있다. 이 API 는 다양한 플랫폼에 존재하는 알림 시스템과 호환되도록 디자인되었다

### Performance

- PRPL Pattern

  PRPL은 기술이나 기법보단 모바일 웹의 성능을 개선하려는 비전에 가깝습니다. Polymer 팀이 그 틀을 짜고 이름을 정한 후 Google I/O 2016에 공개했다.

- RAIL Model

  사용자 중심 성능 모델로 요약할 수 있는데 RAIL 은 다음을 축약한 단어이다.

  **응답** : 100ms 이내에 응답

  **애니메이션** : 10ms 이내에 프레임 생성

  **유휴** : 유휴시간 극대화

  **로드** : 콘텐츠를 1000ms 이내에 전달

- Performance Metrics

  웹사이트의 성능을 나타내는 6개의 주요 메트릭을 측정하는 방법 ( Page Weight, TTFB, Number of Requests, Load Time ) 이다

- Using Lighthouse

  사이트 성능 측정 도구 이다

- Using DevTools

  브라우저 개발자 도구 이다

## Server Side Rendering

- Nuxt.js

  Nuxt.js는 Vue.js 기반으로 만들어진 SSR(Server Side Rendering) 오픈소스 프로젝트

- Next.js (React)

  Next.js는 React의 SSR(Server Side Rendering)을 쉽게 구현할 수 있게 도와주는 간단한 프레임워크

## GraphQL

Graph QL(이하 gql)은 Structed Query Language(이하 sql)와 마찬가지로 쿼리 언어

- Apollo

  Apollo란 GraphQL의 클라이언트 라이브러리 중 하나로 GraphQL을 사용한다면 거의 필수적으로 사용하는 상태 관리 플랫폼이다

- Relay Mordern

  Relay는 GraphQL 기반의 데이터 중심 React 애플리케이션을 구축하기위한 JavaScript 프레임워크

## Static Site Generators

- Nuxt.js

  Nuxt.js는 범용, SPA 및 정적 생성 애플리케이션을 만들 수 있는 프레임워크

- GatsbyJS (React)

  Gatsbyjs는 React 기반의 정적 페이지 생성 프레임워크

- Next.js (React)

  Next.js는 next export라는 명령어로 routing 경로로 하여금 정적 웹사이트를 만들 수 있는 기능도 제공 한다

## Mobile Application

Vue, React, Angular 기반의 네이티브 앱 개발

- NativeScript

  NativeScript는 Vue.js, Angular 를 이용해 모바일 어플리케이션을 만들도록 도와주는 네이티브-스크립트 플러그인

- React Native (React)

  리액트 네이티브(React Native)는 페이스북이 개발한 오픈 소스 모바일 애플리케이션 프레임워크

## Desktop Applications

- Electron

  Electron 은 Native 애플리케이션이며 Chromium 과 Node.js를 1개의 런타임으로 통합하여 JavaScript, HTML, CSS 만 가지고도 데스크톱 애플리케이션을 만들 수 있도록 해주는 프레임워크
