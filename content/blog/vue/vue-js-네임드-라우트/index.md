---
templateKey: blog-post
title: Vue Js 뷰 네임드 라우트
date: 2021-04-04T15:11:34.709Z
category: vue
description: 라우트에 연결하거나 탐색을 수행 할 때 이름이 있는 라우트를 사용할수 있다. 사용 법은 routes 에 name 옵션을 지정 하면 된다. 라우트 관리가 편리 하다 라는 장점이 있다.
tags:
  - vue
  - javascript
  - framework
  - frontend
  - web
  - router
  - named-routes
---

![Vue Js 뷰 네임드 라우트](/assets/vue-logo.png "Vue Js 뷰 네임드 라우트")

## 뷰 네임드 라우트(Named Routes)

라우트에 연결하거나 탐색을 수행 할 때 이름이 있는 라우트를 사용할수 있다. 사용 법은 routes 에 name 옵션을 지정 하면 된다. 라우트 관리가 편리 하다 라는 장점이 있다. 예를 들어 아래와 같이 생각해 보도록 하자.

아래와 같은 라우터가 있고, 뷰 여러 컴포넌트에 `<router-link to="/user/1">User 1</router-link>` 와 같이 라우터 이름을 사용하지 않고 url 을 입력하여 관리 한다고 가정 했을때 만약 user/1 에서 user/profile/1 로 라우터가 변경 되어야 한다면 모든 컴포넌트 url 을 일일이 변경해 줘야할것 이다. 그런데 이러한 부분을 네임드 라우트 를 활용 하면 쉽게 변경이 가능하다.

`user/1 user/2 user/3`

## 네임드 라우트 사용에 따른 예시

**user/1**

```javascript
const routes = [
  ... code
  {
    path: "user/:id",
    name: "User",
    component: () => import("User.vue"),
  },
  ... code
];

```

```html
<router-link to="/user/1">User 1</router-link>
```

```html
<router-link :to="{ name: 'user', params: { id: '1' } }">User 1</router-link>
```

**user/profile/1**

```javascript
const routes = [
  ... code
  {
    path: "user/profile/:id",
    name: "User",
    component: () => import("User.vue"),
  },
  ... code
];

```

```html
<router-link to="/user/profile/1">User 1</router-link>
```

```html
<router-link :to="{name:"user", params : { id : 1 }}">User 1</router-link>
```

차이를 보면 url 이 변경 되었을때 네임드 라우트를 사용 했을 경우 route 인스턴스만 수정해 주면 되는걸 확인할수 있다.\

![Vue Js Vue Named Routes Demo](/assets/vue-js-vue-router-named-routes.png "Vue Js Vue Named Routes Demo")

구현 예시는 중첩 라우터와 동일 하기 때문에 생략 하도록 하겠다.

추가로 "네임드 뷰 (Named View)" 라는 개념이 있는데 이부분은 각자 REST API 를 활용한 CRUD 개발 과정에서 다루도록 하겠다.
