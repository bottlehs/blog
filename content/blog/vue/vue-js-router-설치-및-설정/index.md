---
templateKey: blog-post
title: Vue JS Router 설치 및 설정
date: 2021-04-04T10:11:34.709Z
description: 웹에서의 라우팅은 웹 페이지 간의 이동 방법을 뜻 한다. 예를 들면 아래와 같다. Vue.js의 공식 라우트 이고, Vue.js 코어와 긴밀하게 연결되어 SPA를 쉽게 구축 할 수 있다. 그리고 화면 간의 이동 시, 깜빡거림 없이 매끄럽게 전환 할수 있다. (HTML History API)
tags:
  - vue
  - javascript
  - framework
  - frontend
  - web
  - router
---

![Vue JS Router 설치 및 설정](/assets/vue-logo.png "Vue JS Router 설치 및 설정")

## 라우팅(Routing)

네트워크에서 사용되는 용어로, 어떤 네트워크 안에서 통신 데이터를 보낼 최적 의 경로를 선택하는 과정을 뜻함

웹에서의 라우팅은 웹 페이지 간의 이동 방법을 뜻 한다. 예를 들면 아래와 같다.

**예)**

1. 브라우저 URL을 입력하면 해당 페이지로 이동 한다.
2. 링크를 클릭하면 해당 페이지로 이동 한다.
3. 뒤로가기를 누르면 히스토리의 이전 페이지로 이동 한다.

## 뷰 라우트(Vue Router)

- Vue.js의 공식 라우트 이다.
- Vue.js 코어와 긴밀하게 연결되어 SPA를 쉽게 구축 할 수 있다.
- 화면 간의 이동 시, 깜빡거림 없이 매끄럽게 전환 할수 있다. (HTML History API)

### 주요 기능

- Nested route/view mapping
- Modular, component-based router con
- Route params, query, wildcards
- View transition effects powered by Vue.js transition system
- Fine-grained navigation control
- Links with automatic active CSS classes
- HTML5 history mode or hash mode, with auto-fallback in IE9
- Customizable Scroll Behavior

## 설치

Vue Router 는 프로젝트 생성시 기본 dependencies 로 추가 할수도 있고, npm or yarm 을 사용하여 필요에 따라 추가 할수 있다. 프로젝트 생성 이후 Vue Router 를 추가 하는 방법은 아래와 같다.

터미널을 실행 한후 프로젝트 root 로 이동 해서 npm 으로 라이브러리를 추가 한다.

```
npm install vue-router --save // dependencies
npm install vue-router --save-dev // devDependencies
```

![Vue Js NPM Vue Router Install](/assets/vue-js-npm-install-vue-router.png "Vue Js NPM Vue Router Install")

![Vue Js NPM Vue Router Install](/assets/vue-js-npm-install-vue-router2.png "Vue Js NPM Vue Router Install")

### NPM 과 YARN

npm 은 자바스크립트 프로그래밍 언어를 위한 패키지 관리자이다. yarn 또한 npm과 같이 js 패키지 매니저이다.

#### NPM

```
// {패키지 관리자명} install {플러그인명} --save
npm install vue-router
npm install vue-router --save-dev
```

--save, --save-dev 는 플러그인이 dependencies 항목에 저장 되는지 아니면 devDependencies 에 저장 되는지를 선택 하는것이다. devDependencies 는 개발모드에서만 활용 되는 플러그인을 저장 한다.
--save 는 기본값 이기 때문에 생략 가능하다.

### YARN

```
// {패키지 관리자명} add {플러그인명}
yarn add vue-router
yarn add --dev vue-router
```

--dev 는 devDependencies 에 저장 한다.

## 구현

```javascript
import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/Home.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

export default router
```

라우트를 초기화 한다.

```javascript
const routes = [
  ... code
  {
    path: "{URL 경로}",
    name: "{라우트명}",
    component: () => import("{컴포넌트 경로}"),
  },
  ... code
];
```

```javascript
<router-link to="URL">
```

페이지 이동 태그, 화면에서는 <a> 로 렌더링되며, 클릭하면 to에 지정한 URL로 이동 된다.

```javascript
<router-view>
```

페이지 표시 태그, 변경되는 URL에 따라 해당 컴포넌트를 화면에 그려지는 영역 이다.

### 구현 예시

```sh
src
├── components // 컴포넌트
├── router // 라우팅
│── views // 화면
│   ├── About.js // About 컴포넌트
│   └── Home.js // Home 컴포넌트
│── main.js // 메인 (뷰인스턴스 초기화)
└── App.vue // App 컴포넌트
```

**App.vue**

```javascript
<router-view>
```

**main.js**

```javascript
import router
```

**router/index.js**

```javascript
const routes = [
  ... code
  {
    path: "{URL 경로}",
    name: "{라우트명}",
    component: () => import("{컴포넌트 경로}"),
  },
  ... code
];
```

**views/home**

```vue
<template>
  <div class="home"></div>
</template>

<script>
export default {
  name: "Home",
  components: {},
}
</script>
```

**views/about**

```vue
<template>
  <div class="about"></div>
</template>

<script>
export default {
  name: "About",
  components: {},
}
</script>
```

![Vue Js Vue Router Demo](/assets/vue-js-vue-router-index.png "Vue Js Vue Router Demo")
