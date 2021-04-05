---
templateKey: blog-post
title: Vue Js Vuex의 개념 및 구조의 이해
date: 2021-04-04T19:11:34.709Z
description: Vuex는 Vue.js 애플리케이션에 대한 상태 관리 패턴 + 라이브러리 이다. 애플리케이션의 모든 컴포넌트에 대한 중앙 집중식 저장소 역할을 하며 예측 가능한 방식으로 상태를 변경할 수 있다.
tags:
  - vue
  - javascript
  - framework
  - frontend
  - web
  - router
---

![Vue Js Vuex의 개념 및 구조의 이해](/assets/vue-logo.png "Vue Js Vuex의 개념 및 구조의 이해")

## Vuex

Vuex는 Vue.js 애플리케이션에 대한 상태 관리 패턴 + 라이브러리 이다. 애플리케이션의 모든 컴포넌트에 대한 중앙 집중식 저장소 역할을 하며 예측 가능한 방식으로 상태를 변경할 수 있다.

## 상태 관리(State Management)가 필요한 이유

컴포넌트 기반 프레임워크에서는 작은 단위로 쪼개진 여러 개의 컴포넌트로 화면을 구성한다. 예를 들면, header, button, list 등의 화면 요소가 각각 컴포넌트로 구성되어 한 화면에서 많은 컴포넌트를 사용한다. 이에 따라 컴포넌트 간의 통신이나 데이터 전달을 좀 더 유기적으로 관리할 필요성이 생긴다.

## 상태 관리

상태 관리란 여러 컴포넌트 간의 데이터 전달과 이벤트 통신을 한곳에서 관리하는 패턴을 의미한다. 뷰와 성격이 비슷한 프레임워크인 리액트(React)에서는 Redux, Mobx와 같은 상태 관리 라이브러리를 사용하고 있고 뷰에서는 Vuex라는 상태 관리 라이브러리를 사용한다.

## 상태 관리로 해결할 수 있는 문제점

상태 관리는 중대형 규모의 웹 애플리케이션에서 컴포넌트 간에 데이터를 더 효율적으로 전달할 수 있다. 일반적으로 앱의 규모가 커지면서 생기는 문제점들은 아래와 같다.

- 뷰의 컴포넌트 통신 방식인 props, event 때문에 중간에 거쳐할 컴포넌트가 많아지는 경우가 있다.
- props, event 때문에 거쳐야할 컴포넌트가 많아지는 경우 Event Bus를 사용하여 개선을 하는데 Event Bus를 많아 사용하면 컴포넌트 간 데이터 흐름을 파악하기 어려움이 있다.

위 문제점을 해결하기 위해 모든 데이터 통신을 한 곳에서 중앙 집중식으로 관리하는 것이 상태 관리이다.

**Vuex 전체 흐름도**
![Vue Js Vuex Diagram](/assets/vuex-diagram.png "Vue Js Vuex Diagram")

## 상태 관리 패턴

상태 관리 구성요소는 크게 3가지가 있다.

- state : 컴포넌트 간에 공유할 data
- view : 데이터가 표현될 template
- actions : 사용자의 입력에 따라 반응할 methods

```vue
<!-- view -->
<template>
  <div class="vuex">
    <h1>아메리카노 : {{ counter }}</h1>
    <button @click="ameriano">ameriano</button>
  </div>
</template>

<script>
export default {
  // state
  data() {
    return {
      counter: 0,
    }
  },
  // actions
  methods: {
    ameriano() {
      this.counter++
    },
  },
}
</script>
```

![Vue Js Vuex Ex](/assets/vuex-ameriano-ex.png "Vue Js Vuex Ex")

위 구성요소는 아래와 같은 흐름으로 동작한다.

**단방향 흐름 처리를 나타낸 그림**
![Vue Js Vuex Data Flow](/assets/vuex-state-one-way-data-flow.png "Vue Js Vuex Data Flow")

**데모**
[https://codepen.io/byunghun/pen/ZELyXba](https://codepen.io/byunghun/pen/ZELyXba "https://codepen.io/byunghun/pen/ZELyXba")
