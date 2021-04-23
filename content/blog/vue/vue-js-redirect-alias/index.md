---
templateKey: blog-post
title: Vue Js Redirect / Alias
date: 2021-04-04T15:11:34.709Z
category: vue
description: 리디렉션은 routes 에서 설정 할 수 있습니다. 별칭은 /user의 별칭은 /post는 사용자가 /post를 방문했을 때 URL은 /post을 유지하지만 사용자가 /user를 방문한 것처럼 매칭하는것 이다. 아래 처럼 위 라우터를 구현 할수 있다.
tags:
  - vue
  - javascript
  - framework
  - frontend
  - web
  - router
  - redirect
  - alias
---

![Vue Js Redirect / Alias](/assets/vue-logo.png "Vue Js Redirect / Alias")

## Redirect

리디렉션은 routes 에서 설정 할 수 있습니다. /user에서 /post로 리디렉션하려면

```javascript
const routes = [
  ... code
  {
    path: "{URL}",
    name: "{라우터명}",
    component: () => import("{컴포넌트 경로}"),
    redirect: '{Redirect URL}'
  },
  ... code
];
```

리디렉션은 이름이 지정된 라우트를 지정할 수 있다.

또는 아래 처럼 동적 리디렉션을 위한 함수를 사용할 수도 있다.

```javascript
const routes = [
  ... code
  {
    path: "{URL}",
    name: "{라우터명}",
    component: () => import("{컴포넌트 경로}"),
    redirect: to => {
      // 함수는 인수로 대상 라우트를 받는다.
      // 여기서 path/location 반환한다.
    }
  },
  ... code
];
```

### 구현 예시

```javascript
const routes = [
  ... code
  {
    path: "/coffee",
    name: "Coffee",
    redirect: "/about",
  },
  ... code
];
```

coffee url 입력시 about 화면 으로 이동 (웹 브라우저 url 입력창에 domain.com/about 으로 표시됨)

![Vue Js Router Redirect Demo](/assets/vue-js-vue-router-redirect-1.png "Vue Js Router Redirect Demo")

![Vue Js Router Redirect Demo](/assets/vue-js-vue-router-redirect-2.png "Vue Js Router Redirect Demo")

## Alias

리다이렉트는 사용자가 /user를 방문했을 때 URL이 /post로 대체 된 다음 /post로 매칭된다는 것을 의미합니다. 별칭은 /user의 별칭은 /post는 사용자가 /post를 방문했을 때 URL은 /post을 유지하지만 사용자가 /user를 방문한 것처럼 매칭하는것 이다. 아래 처럼 위 라우터를 구현 할수 있다.

```javascript
const routes = [
  ... code
  {
    path: "{URL}",
    name: "{라우터명}",
    component: () => import("{컴포넌트 경로}"),
    alias: "{Alias URL}"
  },
  ... code
];
```

### 구현 예시

```javascript
const routes = [
  ... code
  {
    path: "/coffee",
    name: "Coffee",
    alias: "/profile",
  },
  ... code
];
```

profile url 입력시 coffee 화면이 보임 (웹 브라우저 url 입력창에 domain.com/profile 으로 표시됨)

![Vue Js Router Redirect Alias](/assets/vue-js-vue-router-alias.png "Vue Js Router Redirect Alias")
