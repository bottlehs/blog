---
templateKey: blog-post
title: Vue Js 뷰 중첩 라우트
date: 2021-04-04T11:11:34.709Z
description: 라우터 컴포넌트 안에 하위에 라우터 컴포넌트를 중첩하여 구성하는 방식이 중첩 라우트 이다.
tags:
  - vue
  - javascript
  - framework
  - frontend
  - web
  - router
  - nested-routes
---

![Vue Js 뷰 중첩 라우트](/assets/vue-logo.png "Vue Js 뷰 중첩 라우트")

## 뷰 중첩 라우트(Nested Routes)

실제 앱 UI는 일반적으로 여러 단계로 중첩 된 컴포넌트로 이루어져 있다. URL의 세그먼트가 중첩 된 컴포넌트의 특정 구조와 일치한다는 것은 매우 일반적입니다. 예를 들면 다음과 같습니다.

```
/user/foo/profile                     /user/foo/posts
+------------------+                  +-----------------+
| User             |                  | User            |
| +--------------+ |                  | +-------------+ |
| | Profile      | |  +------------>  | | Posts       | |
| |              | |                  | |             | |
| +--------------+ |                  | +-------------+ |
+------------------+                  +-----------------+
```

라우터 컴포넌트 안에 하위에 라우터 컴포넌트를 중첩하여 구성하는 방식 이라 생각 하면 된다.

## 구현 예시

```sh
src
│── components // 컴포넌트
│   ├── Profile.vue // Profile 컴포넌트
│   └── Posts.js // Posts 컴포넌트
├── router // 라우팅
│── views // 화면
│   └── User.vue // User 컴포넌트
│── main.js // 메인 (뷰인스턴스 초기화)
└── App.vue // App 컴포넌트
```

**App.vue**

```javascript
<router-view>
```

**router/index.js**

```javascript
const routes = [
  ... code
  {
    path: "{URL 경로}/:id",
    name: "{라우터명}",
    component: () => import("{컴포넌트 경로}"),
    children: [
      {
        path: '{URL 경로}',
        component: () => import("{컴포넌트 경로}"),
      },
      {
        path: '{URL 경로}',
        component: () => import("{컴포넌트 경로}"),
      }
    ]
  },
  ... code
];
```

![Vue Js Vue Nested Routes Demo](/assets/vue-js-vue-router-nested-routes.png "Vue Js Vue Nested Routes Demo")
