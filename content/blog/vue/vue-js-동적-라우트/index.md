---
templateKey: blog-post
title: Vue Js 동적 라우트
date: 2021-04-04T13:11:34.709Z
description: 주어진 패턴을 가진 라우트를 동일한 컴포넌트에 매핑해야하는 경우가 있다. 예를 들어 게시물 상세보기에 대해 동일한 레이아웃을 가지지만 하지만 다른 게시물 ID로 렌더링되어야하는 Post 컴포넌트가 있을 수 있다. vue-router에서 경로에서 동적 세그먼트를 사용하여 아래와 같이 할 수 동적으로 라우트를 매칭하여 세그먼트를 같은 레이아웃에 다른 게시물을 보여줄수 있다.
tags:
  - vue
  - javascript
  - framework
  - frontend
  - web
  - router
  - dynamic-route-matching
---

![Vue Js 동적 라우트](/assets/vue-logo.png "Vue Js 동적 라우트")

## 뷰 동적 라우트(Dynamic Route Matching)

주어진 패턴을 가진 라우트를 동일한 컴포넌트에 매핑해야하는 경우가 있다. 예를 들어 게시물 상세보기에 대해 동일한 레이아웃을 가지지만 하지만 다른 게시물 ID로 렌더링되어야하는 Post 컴포넌트가 있을 수 있다. vue-router에서 경로에서 동적 세그먼트를 사용하여 아래와 같이 할 수 동적으로 라우트를 매칭하여 세그먼트를 같은 레이아웃에 다른 게시물을 보여줄수 있다.

## 구현 예시

```sh
src
├── components // 컴포넌트
├── router // 라우팅
│── views // 화면
│   └── Post.vue // Post 컴포넌트
│── main.js // 메인 (뷰인스턴스 초기화)
└── App.vue // App 컴포넌트
```

**App.vue**

```javascript
<router-link to="/post/10">Post 10</router-link>
<router-link to="/post/11">Post 11</router-link>
<router-link to="/post/12">Post 12</router-link>
```

**router/index.js**

```javascript
const routes = [
  ... code
  {
    path: "{URL 경로}/:id",
    name: "{라우트명}",
    component: () => import("{컴포넌트 경로}"),
  },
  ... code
];
```

**views/Post.vue**

```vue
<template>
  <div class="post">{{ $route.params.id }}</div>
</template>

<script>
export default {
  name: "Post",
  components: {},
}
</script>
```

![Vue Js Vue Dynamic Route Matching Demo](/assets/vue-js-vue-router-dynamic-route-matching.png "Vue Js Vue Dynamic Route Matching Demo")
