---
templateKey: blog-post
title: Vue Js Vuex 저장소(store) 속성 및 모듈화
date: 2021-04-11T21:11:34.709Z
description: 중간 크기 이상의 복잡한 앱을 제작할 때 getters & mutations & actions 의 이름을 유일하게 정하지 않으면 namespace 충돌이 난다. 따라서, 네임스페이스를 구분하기 위해 types.js 로 각 속성의 이름들을 빼고 store.js 와 각 컴포넌트에 import 하여 사용하는 방법이 있다. 혹은 modules 라는 폴더로 만들어 각 단위별로 파일을 분리해서 관리하는 방법도 있다.

tags:
  - vue
  - javascript
  - framework
  - frontend
  - web
  - vuex
  - modules
---

![Vue Js Vuex 저장소(store) 속성 및 모듈화](/assets/vue-logo.png "Vue Js Vuex State, Mutations, Actions, Getters 이해 및 활용")

## 폴더 모듈화 & Namespacing

![Vue Js Vuex Modules](/assets/vue-vuex-modules.png "Vue Js Vuex Modules")

```javascript
import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

import coffee from "./modules/coffee"
import shop from "./modules/shop"

export default new Vuex.Store({
  // count state 속성 추가
  state: {
    count: 0, // count 를 0 으로 초기화
  },
  getters: {
    getCount: function (state) {
      return state.count
    },
  },
  mutations: {
    addCount: function (state, payload = 1) {
      console.log("addCount")
      return (state.count = state.count + payload)
    },
  },
  actions: {
    addCount: function (context, payload) {
      // commit 의 대상인 addCount 는 mutations 의 메서드를 의미한다.
      // 비동기 로직 수행후
      return setTimeout(function () {
        context.commit("addCount", payload.count)
      }, 1000)
    },
  },
  modules: { coffee, shop },
})
```

중간 크기 이상의 복잡한 앱을 제작할 때 getters & mutations & actions 의 이름을 유일하게 정하지 않으면 namespace 충돌이 난다. 따라서, 네임스페이스를 구분하기 위해 types.js 로 각 속성의 이름들을 빼고 store.js 와 각 컴포넌트에 import 하여 사용하는 방법이 있다. 혹은 modules 라는 폴더로 만들어 각 단위별로 파일을 분리해서 관리하는 방법도 있다.

Vuex 가 생각보다 복잡하므로 앱이 커서 중형 이상의 앱에서만 사용하는게 좋다. 간단한 화면 개발에는 오히려 Vuex 를 사용하지 않고 개발 하는것을 추천 한다.
