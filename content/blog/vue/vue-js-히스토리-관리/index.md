---
templateKey: blog-post
title: Vue Js 히스토리 관리
date: 2021-04-04T15:11:34.709Z
category: vue
description: vue-router의 기본 모드는 hash mode 입니다. URL 해시를 사용하여 전체 URL을 시뮬레이트하므로 URL이 변경될 때 페이지가 다시 로드 되지 않는다. 해시를 제거하기 위해 라우터의 history 모드 를 사용할 수 있다. history.pushState API를 활용하여 페이지를 다시 로드하지 않고도 URL 탐색을 할 수 있다.
tags:
  - vue
  - javascript
  - framework
  - frontend
  - web
  - router
---

![Vue Js 히스토리 관리](/assets/vue-logo.png "Vue Js 히스토리 관리")

## History API

리엑트, 뷰, 앵귤러를 사용하면 기본적으로 싱글 페이지 애플리케이션(SPA) 형태로 개발 하게 된다. SPA의 단점은 주소가 바뀌지 않는다는 것이다. 초창기에는 주소 뒤에 #(해쉬) #!(해쉬뱅)을 붙이고 뒤에 하위 주소를 넣었다. https://www.doamin.com/#coffee 하지만 이 방식은 의미 없는 #(해쉬뱅) 를 넣었기 때문에 서버에서는 제대로된 주소라고 생각 하지 않는다.

따라서 해쉬뱅 대신 브라우저에서 제공하는 주소 API를 사용해 주소를 바꾸게 되었는데, 그게 바로 History API이다. 요즘 웬만한 SPA의 라우터들은 이 History API를 사용하고 있다. IE도 10부터 가능하다.

이 History API는 기존 history 객체(window.history)를 그대로 활용한다. 따라서 자바스크립트로 뒤로가기(history.back())와 앞으로 가기(history.forward()), 지정한 위치로 가기(history.go(인덱스))를 모두 사용할 수 있다.

History API 는 브라우저의 세션 기록, 즉 현재 페이지를 불러온 탭 또는 프레임의 방문 기록을 조작할 수 있는 방법을 제공한다.

### 속성

History 인터페이스는 어떤 속성도 상속하지 않는다.

**History.length (Read only)**
현재 페이지를 포함해, 세션 기록의 길이를 나타내는 정수를 반환한다.

**History.scrollRestoration**
기록 탐색 시 스크롤 위치 복원 여부를 명시할 수 있다. 가능한 값은 auto와 manual이다.

**History.state (Read only)**
기록 스택 최상단의 스테이트를 나타내는 값을 반환한다. popstate 이벤트를 기다리지 않고 현재 기록의 스테이트를 볼 수 있는 방법이다.

### 메서드

**History.back()**
세션 기록의 바로 뒤 페이지로 이동하는 비동기 메서드이다. 브라우저의 뒤로 가기 버튼을 눌렀을 때, 그리고 history.go(-1)을 사용했을 때와 같다.

**History.forward()**
세션 기록의 바로 앞 페이지로 이동하는 비동기 메서드이다. 브라우저의 앞으로 가기 버튼을 눌렀을 때, 그리고 history.go(1)을 사용했을 때와 같다.

**History.go()**
현재 페이지를 기준으로, 상대적인 위치에 존재하는 세션 기록 내 페이지로 이동하는 비동기 메서드이다. 예를 들어, 매개변수로 -1을 제공하면 바로 뒤로, 1을 제공하면 바로 앞으로 이동한다. 세션 기록의 범위를 벗어나는 값을 제공하면 아무 일도 일어나지 않는다. 매개변수를 제공하지 않거나, 0을 제공하면 현재 페이지를 다시 불러온다.

**History.pushState()**
주어진 데이터를 지정한 제목(제공한 경우 URL도)으로 세션 기록 스택에 넣는다. 데이터는 DOM이 불투명(opaque)하게 취급하므로, 직렬화 가능한 모든 JavaScript 객체를 사용할 수 있다. 참고로, Safari를 제외한 모든 브라우저는 title 매개변수를 무시한다.

**History.replaceState()**
세션 기록 스택의 제일 최근 항목을 주어진 데이터, 지정한 제목 및 URL로 대체한다. 데이터는 DOM이 불투명(opaque)하게 취급하므로, 직렬화 가능한 모든 JavaScript 객체를 사용할 수 있다. 참고로, Safari를 제외한 모든 브라우저는 title 매개변수를 무시한다.

## Vue History Mode

vue-router의 기본 모드는 hash mode 입니다. URL 해시를 사용하여 전체 URL을 시뮬레이트하므로 URL이 변경될 때 페이지가 다시 로드 되지 않는다. 해시를 제거하기 위해 라우터의 history 모드 를 사용할 수 있다. history.pushState API를 활용하여 페이지를 다시 로드하지 않고도 URL 탐색을 할 수 있다.

```javascript
import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

const routes = [
  ..code
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

export default router
```
