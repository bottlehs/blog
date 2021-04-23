---
templateKey: blog-post
title: JAMStack 이란
date: 2021-04-18T22:11:34.709Z
category: etc
description: Jamstack은 Javascript, API 및 Markup의 약자이며 2015 년 Netlify의 CEO 인 Mathias Biilmann이 처음 만들어졌습니다. 서버 없이 배포 운영되는 모던 웹 개발 구조 이며, 장점으로는 높은 안정성, 빠른 성능, 확장성 및 낮은 비용, 쉬운 자동화 등이 있습니다.
tags:
  - JAMStack
  - Gatsby
  - Nuxt.js
  - Next.js
  - Netlify
---

![JAMStack 이란](/assets/jamstack-cover.png "JAMStack 이란")

## JAMStack

Jamstack은 Javascript, API 및 Markup의 약자이며 2015 년 Netlify의 CEO 인 Mathias Biilmann이 처음 만들어졌습니다.

### 웹 개발 구조

#### 전통적인 웹

아래는 전통적인 웹 구조 이다.

![전통적인 웹](/assets/jamstack-conventional-web.png "전통적인 웹")

브라우저에서 데이터를 요청하면 DB 서버에 접근하여 요청한 데이터를 가져와 화면에 보여준다. 웹 개발 시 데이터 저장 및 출력을 어떻게 할지도 전부 설계를 하여 개발을 진행해야 하고, 관리도 필요하다.

#### Serverless 웹

아래는 서버리스 웹 구조 이다.

![Serverless 웹](/assets/jamstack-serverless.png "Serverless 웹")

![Serverless 웹](/assets/jamstack-serverless2.png "Serverless 웹")

브라우저에서 데이터를 요청하면 DB 서버에 접근하여 요청한 데이터를 가져와 화면에 보여준다는 건 동일하다. 하지만 다른 부분은 데이터베이스 서비스 API를 사용한다는 것이다.
즉 웹 개발 시 DB, API 구조에 대해서는 전혀 고려하지 않고 원하는 데이터를 데이터베이스 서비스에 저장하고 필요에 따라 가져다 사용하면 된다. 서버 구성에 대해 신경 쓸 필요가 없고 관리도 필요 없다.

### JAMStack이란

- 동적 요소 처리를 위한 JavaScript
- 재사용 가능한 API
- Prebuilt Pages

서버 없이 배포 운영되는 모던 웹 개발 구조

![JAMStack이란](/assets/jamstack-structure.png "JAMStack이란")

#### J(JavaScript)

- 동적인 요소 처리
- Front-End 라이브러리, 프레임워크
- API 요청

#### A(API)

- 서버 또는 DB에서 담당하던 역할
- 추상화된 재사용 가능 API
- Cloud Function, Third party APIs

#### M(Markup)

- 문서 내용의 시각적 표현
- 빌드 시 페이지 생성
  (Prebuilt Pages)

### JAMStack의 장점

- 높은 안정성
- 빠른 성능
- 확장성 및 낮은 비용
- 쉬운 자동화

#### 높은 안정성

API들은 마이크로 서비스로 추상화되어 외부의 공격영역이 줄어들어 안정성이 높다.

![높은 안정성](/assets/jamstack-advantage-1.png "높은 안정성")

#### 빠른 성능

배포타임에 생성해도 되는 페이지들을 요청시마다 생성할 필요가 없고, CDN 에서 받은 것 만큼 시간을 절약 할수 있다.

![빠른 성능](/assets/jamstack-advantage-2.png "빠른 성능")

#### 확장성 및 낮은 비용

배포해야할 양이 많고 세계 어디서든 서비스를 해야한다고 하면 스케일링 신경을 써야 한다. JSAMStack 은 CDN을 사용하여 데이터를 받아 올수 있기 때문에 요금제에 따라 효율적으로 CDN 서버를 구축하면 비용을 줄일수 있다.

![확장성 및 낮은 비용](/assets/jamstack-advantage-3.png "확장성 및 낮은 비용")

#### 쉬운 자동화

Netlify, AWS Lambda 등을 활용하면 배포를 자동화 할수 있다.

![쉬운 자동화](/assets/jamstack-advantage-4.png "쉬운 자동화")

## 데이터베이스 서비스

### FaunaDB

FaunaDB는 GraphQL을 사용하는 트랜잭션 데이터베이스서비스

### DynamoDB

DynamoDB는 키-값 및 문서 데이터 구조를 지원하는 완전 관리 형 독점 NoSQL 데이터베이스 서비스

## Static Site Generator

JAMStack 웹 개발에 사용되는 정적 사이트 생성기(Static Site Generator) 의 대표적인 프레임워크는 아래와 같다.

### Next

![Next](/assets/jamstack-next-logo.png "Next")

[https://nextjs.org/](https://nextjs.org/ "https://nextjs.org/")

Next.js는 서버 측 렌더링 및 React 기반 웹 애플리케이션을위한 정적 웹 사이트 생성과 같은 기능을 지원하는 오픈 소스 React 프런트 엔드 개발 웹 프레임워크

- React.js 기반의 정적 사이트 생성기
- 더욱 빠른 페이지 로드를 위한 코드 스플리팅 자동화
- HMR을 지원하는 웹팩 기반 환경
- Express나 Node.js와 같은 http 서버와 함께 구현 가능
- Babel, Webpack 설정 커스터마이징 가능

### Gatsby

![Gatsby](/assets/jamstack-gatsby-logo.png "Gatsby")

[https://www.gatsbyjs.com/](https://www.gatsbyjs.com/ "https://www.gatsbyjs.com/")

Gatsby.js란? Gatsbyjs는 React 기반의 정적 페이지 생성 프레임워크

- React.js 기반의 정적 사이트 생성기
- 다양한 데이터 타입 지원
- 거대한 플러그인 시스템
- GraphQL을 통한 데이터 조회

### Nuxt

![Nuxt](/assets/jamstack-nuxt-logo.png "Nuxt")

[https://nuxtjs.org/](https://nuxtjs.org/ "https://nuxtjs.org/")

Nuxt.js는 Vue.js, Node.js, Webpack 및 Babel.js를 기반으로하는 무료 오픈 소스 웹 애플리케이션 프레임워크

- Vue.js 기반의 정적 사이트 생성기
- pages 폴더 기반의 자동 라우팅 설정
- 코드 스플리팅
- 서버 사이드 렌더링
- 비동기 데이터 요청 속성
- ES6/ES6+ 변환
- 웹팩을 비롯한 기타 설정

## JAMStack 생태계

### CMS, Function, Hosting

#### CMS

정적 콘텐츠 관리

- Forestry.io
- Netlify CMS
- Sanity.io
- Contentful

#### Function

자동 빌드 및 배포

- AWS Lambda
- Azure Functions
- Netlify
- Cloud Functions

#### Hosting

웹 사이트 호스팅

- Github Pages
- Firebase
- Netlify
- Azure

### 동적 콘텐츠

JAMStack 은 정정페이지를 생성하여 호스팅 하는 구조이기 때문에 동적인 콘텐츠 노출,생성에 문제점이 있다. 이러한 부분을 보완 할수 있는 다양한 서드파티 API 들이 존재하며, 필요에 따라 활용이 가능 하다.

- 동적 검색 결과
- 쇼핑몰 장바구니
- 사용자 프로필
- 폼 빌더
- 실시간 댓글

### Third party APIs

검색, 쇼핑, 결제 등 다양한 Third party APIs

#### Algolia

[https://www.algolia.com/](https://www.algolia.com/ "https://www.algolia.com/")

- 검색 API 서비스
- 다양한 언어 및 플랫폼 지원(Android, iOS, JavaScript, Go..)
- 빠르고 강력한 검색 기능
- 무료 버전 제공(제한적인 검색 횟수)

#### DISQUS

[https://disqus.com/](https://disqus.com/ "https://disqus.com/")

- 댓글 서비스
- 다양한 언어 지원
- 무료 버전 제공(광고포함)

#### Stripe

[https://stripe.com/](https://stripe.com/ "https://stripe.com/")

- 결제 서비스
- 다양한 언어 지원
- 쉬운 설치

## JAMStack 현재와 한계점 및 Gatsby Cloud

### 현재

- 빠른 성능과 높은 안정성
- 다양한 정적 사이트 생성기
- 훌륭한 생태계
  - Cloud Function
  - Third party APIs
  - Hosting
  - CMS

### JAMStack의 한계점

- 빌드 속도

  ![빌드 속도](/assets/jamstack-grenze-1.png "빌드 속도")

- 실시간 변경 콘텐츠

  ![실시간 변경 콘텐츠](/assets/jamstack-grenze-2.png "실시간 변경 콘텐츠")

### Gatsby Cloud

JAMStack 구조상 정적인 페이지가 많아질수록 빌드속도가 오래 걸린다는 단점이 있다. 이러한 부분을 해결하기 위해 "점진적 Build" 시스템을 도입 중이며 성과는 아래와 같다.

![점진적 Build](/assets/jamstack-grenze-3.png "점진적 Build")

JAMStack 기반으로 만들어진 웹 사이트는 대표적으로 아래와 같다.

- 뱅크샐러드 기술 블로그
  [https://blog.banksalad.com/](https://blog.banksalad.com/ "https://blog.banksalad.com/")

- NHN 토스트 UI
  [https://ui.toast.com/](https://ui.toast.com/ "https://ui.toast.com/")

- Bottlehs 기술 블로그
  [https://www.bottlehs.com/](https://www.bottlehs.com/ "https://www.bottlehs.com/")

## JAMStack 기반 블로그 개설

bottlehs 기술 블로그는 Gatsby + Netlify 로 개발 되었으며 Netlify CMS 를 활용하여 콘텐츠 관리를 쉽게 할수 있도록 되어 있다.
아래 Github 페이지에 방문하여 `Deploy to Netlify` 버튼을 클릭하거나 아래에 있는 `Deploy to Netlify` 를 클릭 하면 Netlify 로 호스팅된 JAMStack 기반 블로그를 개설 할수 있으니 관심 있으신 분들한 한번 해보기 바란다.

[Demo](https://gatsby-starter-flat-blog.netlify.app)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/bottlehs/gatsby-starter-flat-blog)

:bulb: if you want to deploy github pages, add following script to package.json

```json
"scripts": {
    "deploy": "gatsby build && gh-pages -d public -b master -r 'git@github.com:${your github id}/${github page name}.github.io.git'"
}
```

Github : [https://github.com/bottlehs/gatsby-starter-flat-blog/](https://github.com/bottlehs/gatsby-starter-flat-blog/ "https://github.com/bottlehs/gatsby-starter-flat-blog/")

**참고**

- NHN FORWARD
- JAMStack ( JAMStack.org )
- 웹 문서
