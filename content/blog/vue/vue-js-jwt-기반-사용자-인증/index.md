---
templateKey: blog-post
title: Vue Js 뷰 JWT 기반 사용자 인증
date: 2021-05-09T15:11:34.709Z
category: vue
description: 라우트에 연결하거나 탐색을 수행 할 때 이름이 있는 라우트를 사용할수 있다. 사용 법은 routes 에 name 옵션을 지정 하면 된다. 라우트 관리가 편리 하다 라는 장점이 있다.
tags:
  - vue
  - javascript
  - framework
  - frontend
  - web
  - router guards
  - jwt
---

![Vue Js 뷰 JWT 기반 사용자 인증](/assets/vue-logo.png "Vue Js 뷰 JWT 기반 사용자 인증")

## JWT ( JSON WEB TOKEN ) 이란?

JWT 는 JSON Web Token의 약자로 전자 서명 된 URL-safe (URL로 이용할 수있는 문자 만 구성된)의 JSON이다. 전자 서명은 JSON 의 변조를 체크 할 수 있게되어 있다. JWT는 속성 정보 (Claim)를 JSON 데이터 구조로 표현한 토큰으로 RFC7519 표준 이다. JWT는 서버와 클라이언트 간 정보를 주고 받을 때 Http 리퀘스트 헤더에 JSON 토큰을 넣은 후 서버는 별도의 인증 과정없이 헤더에 포함되어 있는 JWT 정보를 통해 인증한다. 이때 사용되는 JSON 데이터는 URL-Safe 하도록 URL에 포함할 수 있는 문자만으로 만든다. JWT는 HMAC 알고리즘을 사용하여 비밀키 또는 RSA를 이용한 Public Key/ Private Key 쌍으로 서명할 수 있다.

### 토큰 구성

![JWT 토큰 구성](/assets/vue-jwt-auth-jwt-stacks.png "JWT 토큰 구성")

WT는 세 파트로 나누어지며, 각 파트는 점로 구분하여 xxxxx.yyyyy.zzzzz 이런식으로 표현된다. 순서대로 헤더 (Header), 페이로드 (Payload), 서명 (Sinature)로 구성한다. Base64 인코딩의 경우 “+”, “/”, “=”이 포함되지만 JWT는 URI에서 파라미터로 사용할 수 있도록 URL-Safe 한 Base64url 인코딩을 사용한다. Header는 토큰의 타입과 해시 암호화 알고리즘으로 구성되어 있습니다. 첫째는 토큰의 유형 (JWT)을 나타내고, 두 번째는 HMAC, SHA256 또는 RSA와 같은 해시 알고리즘을 나타내는 부분이다. Payload는 토큰에 담을 클레임(claim) 정보를 포함하고 있다. Payload 에 담는 정보의 한 ‘조각’ 을 클레임이라고 부르고, 이는 name / value 의 한 쌍으로 이뤄져있다. 토큰에는 여러개의 클레임 들을 넣을 수 있다. 클레임의 정보는 등록된 (registered) 클레임, 공개 (public) 클레임, 비공개 (private) 클레임으로 세 종류가 있다. 마지막으로 Signature는 secret key를 포함하여 암호화되어 있다.

### PROCESS

![JWT PROCESS](/assets/vue-jwt-auth-jwt-process.png "JWT PROCESS")

1. 사용자가 username(id)와 password를 입력하여 로그인을 시도한다.
2. 서버는 요청을 확인하고 secret key를 통해 Access token을 발급합니다.
3. JWT 토큰을 클라이언트에 전달 합니다.
4. 클라이언트에서 API 을 요청할때 클라이언트가 Authorization header에 Access token을 담아서 보낸다.
5. 서버는 JWT Signature를 체크하고 Payload로부터 사용자 정보를 확인해 데이터를 반환한다.
6. 클라이언트의 로그인 정보를 서버 메모리에 저장하지 않기 때문에 토큰기반 인증 메커니즘을 제공한다.

인증이 필요한 경로에 접근할 때 서버 측은 Authorization 헤더에 유효한 JWT 또는 존재하는지 확인한다. JWT에는 필요한 모든 정보를 토큰에 포함하기 때문에 데이터베이스과 같은 서버와의 커뮤니케이션 오버 헤드를 최소화 할 수 있다. Cross-Origin Resource Sharing (CORS)는 쿠키를 사용하지 않기 때문에 JWT를 채용 한 인증 메커니즘은 두 도메인에서 API를 제공하더라도 문제가 발생하지 않는다. 일반적으로 JWT 토큰 기반의 인증 시스템은 위와 같은 프로세스로 이루어진다. 처음 사용자를 등록할 때 Access token과 Refresh token이 모두 발급되어야 한다.

### 장점

- URL 파라미터와 헤더로 사용
- 수평 스케일이 용이
- 디버깅 및 관리가 용이
- 트래픽 대한 부담이 낮음
- REST 서비스로 제공 가능
- 내장된 만료
- 독립적인 JWT

### 단점

- 토큰은 클라이언트에 저장되어 데이터베이스에서 사용자 정보를 조작하더라도 토큰에 직접 적용할 수 없다.
- 더 많은 필드가 추가되면 토큰이 커질 수 있다.
- 비상태 애플리케이션에서 토큰은 거의 모든 요청에 대해 전송되므로 데이터 트래픽 크기에 영향을 미칠 수 있다.

## Vue Router Guards

vue-router가 제공하는 네비게이션 가드는 주로 리디렉션하거나 취소하여 네비게이션을 보호하는 데 사용된다. 라우트 탐색 프로세스에 연결하는 방법에는 전역, 라우트별 또는 컴포넌트가 있다.

### 네비게이션 가드의 종류

네비게이션 가드의 종류는 아래와 같이 3가지가 있습니다.

- 애플리케이션 전역에서 동작하는 전역 가드
- 특정 URL에서만 동작하는 라우터 가드
- 라우터 컴포넌트 안에 정의하는 컴포넌트 가드

### 전역 가드

`router.beforeEach`를 사용하여 보호하기 이전에 전역 등록을 할 수 있다.

```javascript
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // to : 이동할 url
  // from : 현재 url
  // next : to에서 지정한 url로 이동하기 위해 꼭 호출해야 하는 함수
})
```

네비게이션이 트리거될 때마다 가드가 작성 순서에 따라 호출되기 전의 모든 경우에 발생한다. 가드는 비동기식으로 실행 될 수 있으며 네비게이션은 모든 훅이 해결되기 전까지 보류 중 으로 간주된다.

모든 가드 기능은 세 가지 전달인자를 받는다.

- to : 이동할 url 정보가 담긴 라우터 객체
- from : 현재 url 정보가 담긴 라우터 객체
- next : to에서 지정한 url로 이동하기 위해 꼭 호출해야 하는 함수

router.beforeEach()를 호출하고 나면 모든 라우팅이 대기 상태가 된다. 원래 url이 변경되고 나면 해당 url에 따라 화면이 자연스럽게 전환되어야 하는데 전역 가드를 설정했기 때문에 화면이 전환되지 않는다. 여기서 해당 url로 라우팅 하기 위해서는 next()를 호출해줘야 한다. next()가 호출되기 전까지 화면이 전환되지 않는다.

```javascript
var router = new VueRouter({
  routes: [
    {
      path: "/login",
      component: () => import("컴포넌트"),
    },
    {
      path: "/register",
      component: () => import("컴포넌트"),
    },
  ],
})

router.beforeEach(function (to, from, next) {
  console.log("라우딩 대기")

  // code ..

  next() // 원하는 url로 이동하고 싶으면 next()를 호출하면 된다.
})
```

### 전역 가드로 페이지 인증하기

```javascript
var router = new VueRouter({
  routes: [
    {
      path: "/login",
      component: () => import("컴포넌트"),
    },
    {
      path: "/register",
      component: () => import("컴포넌트"),
    },
    {
      path: "/mypage",
      component: () => import("컴포넌트"),
      meta: { authRequired: true },
    },
  ],
})

router.beforeEach(function (to, from, next) {
  console.log("라우딩 대기")

  if (
    to.matched.some(function (routeInfo) {
      return routeInfo.meta.authRequired
    })
  ) {
    // 인증이 필요한 페이지일 경우 인증 체크
    if (isAuth) {
      next() // 페이지 전환
    } else {
      alert("로그인 필요")
    }
  } else {
    next() // 페이지 전환
  }
})
```

### 라우터 가드

전체 라우팅이 아니라 특정 라우팅에 대해서 가드를 설정하는 방법은 아래와 같다.

```javascript
var router = new VueRouter({
  routes: [
    {
      path: "/mypage",
      component: () => import("컴포넌트"),
      beforeEnter: function (to, from, next) {
        // 인증 값 검증 로직 추가
      },
    },
  ],
})
```

### 컴포넌트 가드

라우터로 지정된 특정 컴포넌트에 가드를 설정하는 방법은 아래와 같다.

```javascript
// view/Mypage.vue ( Mypage Components )
export default {
  name: "Mypage",
  beforeRouteEnter(to, from, next) {
    // Login 컴포넌트가 화면에 표시되기 전에 수행될 로직
    // Login 컴포넌트는 아직 생성되지 않은 시점
  },
  beforeRouteUpdate(to, from, next) {
    // 화면에 표시된 컴포넌트가 변경될 때 수행될 로직
    // `this`로 Login 컴포넌트를 접근할 수 있음
  },
  beforeRouteLeave(to, from, next) {
    // Login 컴포넌트를 화면에 표시한 url 값이 변경되기 직전의 로직
    // `this`로 Login 컴포넌트를 접근할 수 있음
  },
}

// route.js
var router = new VueRouter({
  routes: [
    {
      path: "/mypage",
      component: () => import("컴포넌트"),
    },
  ],
})
```
