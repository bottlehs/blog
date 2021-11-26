---
templateKey: blog-post
title: Vue Js 한글 입력 과 IME
date: 2021-11-27T15:11:34.709Z
category: vue
description: IME란 한국어, 중국어, 일본어, 한자처럼 컴퓨너 자판에 있는 글자보다 더 많은 수의 문자를 계산서나 조합하여 입력해 주는 시스템 소프트웨어이다. 이러한 조합이 필요한 언어들은 v-model 디렉티브를 활용할 때 제대로 동작 안되는 문제가 있어, @input 이벤트를 활용하여 v-model 디렉티브 기능을 대신 구현해야 정확한 데이터 바인딩을 할 수 있다.
tags:
  - vue
  - javascript
  - framework
  - frontend
  - web
  - ime
---

![Vue Js 한글 입력 과 IME](/assets/vue-logo.png "Vue Js 한글 입력 과 IME")

## IME

입력기 또는 입력 방식 편집기는 한국어, 중국어, 일본어, 한자처럼 컴퓨터 자판에 있는 글자보다 수가 더 많은 문자를 계산하거나 조합하여 입력해 주는 시스템 소프트웨어이다. 원래 윈도우에서 사용하던 인터페이스에서 유래했고, 한국어, 중국어, 일본어 윈도우에서만 지원했으나, 현재는 일반화되어서 임의의 환경에서 임의의 문자를 입력하는 것을 도와 주는 소프트웨어를 가리키기도 한다.

### IME 발생 메시지

| 메시지                  | 발생되는 경우                                                                                                                                                                                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| WM_IME_SETCONTEXT       | 윈도우가 활성화 될때 기본 IME의 초기화를 위해서 발생된다. 내 프로그램에서 미완성된 글자를 표시한다면 lParam에서 ISC_SHOWUICOMPOSITIONWINDOW 와 ISC_SHOWUIALLCANDIDATEWINDOW 을 제거해야 한다. 그러면 미완성된 문자가 Default IME옆에 나타나지 않는다. |
| WM_IME_STARTCOMPOSITION | 한글입력이 시작되었을때 발생                                                                                                                                                                                                                          |
| WM_IME_ENDCOMPOSITION   | 한글입력도중 한글이외의 문자가 입력되었을때 발생                                                                                                                                                                                                      |
| WM_IME_COMPOSITION      | 한글입력을 알리는 메세지                                                                                                                                                                                                                              |

### IME 관련된 함수

| 함수                    | 설명                                                                                                                                                                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ImmAssociateContext     | 특정윈도우와 IME를 매핑시킨다. Default IME를 사용할 수 있지만 새로운 IME를 생성해서 내 윈도우 특성에 맞게 사용할수 있다.                                                                                                                              |
| ImmCreateContext        | 새로운 IME를 생성한다. 나중에 반드시 ImmDestroyContext를 호출해야 한다.                                                                                                                                                                               |
| ImmDestroyContext       | IME를 반환한다.                                                                                                                                                                                                                                       |
| ImmGetDefaultIMEWnd     | Default IME 핸들의 얻는다. 나중에 반드시 ImmReleaseContext 를 호출해야 한다.                                                                                                                                                                          |
| ImmReleaseContext       | Default IME 핸들을 OS에 반환한다.                                                                                                                                                                                                                     |
| ImmGetConversionStatus  | IME의 상태를 취득한다.                                                                                                                                                                                                                                |
| ImmSimulateHotKey       | 한/영, 전각/반각, 한자등의 키를 Simulation 해 준다.                                                                                                                                                                                                   |
| ImmGetCompositionString | 현재 IME에 입력되어 있는 한글코드의 크기 및 내용을 취득한다.                                                                                                                                                                                          |
| IsDBCSLeadByte          | 한글 두 Byte중에서 첫번째 Byte인지 검사해 주는 함수이지만 조합형 한글은 첫번째 Byte에 올수 있는 코드와 두번째 Byte에 올 수 있는 코드의 범위가 같아서 이 함수로 검사할 수 없다. 따라서 이 함수를 사용하지 말고 직접 만들어서 사용하는 것이 바람직하다. |

## Vue v-model 디렉티브 한글 입력

아래와 같이 v-model 과 watch 를 활용하여 실시간 검색 기능을 제공 한다고 가정해 보자.

```vue
<template>
  <div id="app">
    <input v-model="keyword" />
    <p>keyword : {{ keyword }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: "",
    }
  },
  watch: {
    keyword: function (value) {
      console.log(`검색어 : ${value}`)
    },
  },
}
</script>
```

```
// 동작 예시
"검색어 : "
"검색어 : 한"
"검색어 : 한글"
```

![Vue Js 한글 입력 과 IME 결과코드 1](/assets/Vue_Js_한글_입력_과_IME_1.gif "Vue Js 한글 입력 과 IME 결과코드 1")

위와 같이 `한글` 을 입력 하면 처음에는 빈값 두번째 `글` 을 입력 했을때 `한` 이라고 출력 되는것을 확인 할수 있을것이다. 이렇게 입력 되는 이유는 컴퓨터 자판에 있는 글자수 보다 많은 글자를 입력 했기 때문이다. 그래서 Vue 공식문서에서 공개한 내용을 보면 아래와 같이 설명 되어 있다.

> IME가 필요한 언어 (한국어,중국어,일본어,한자 등)의 경우에는 IME 구성 중에 v-model이 업데이트 되지 않을 수 있습니다. 약만 IME가 필요한 언어를 사용하고자 한다면 v-model 디렉티브 대신 @input 이벤트를 사용하세요.

[Vue Form Input Bindings](https://vuejs.org/v2/guide/forms.html#Basic-Usage "Vue Form Input Bindings")

해결 방안은 공식문서 가이드대로 @input 을 활용하여 코드를 작성해 주면 바로 해결이 된다.

```vue
<template>
  <div id="app">
    <input :value="keyword" @input="keywordInput" />
    <p>keyword : {{ keyword }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: "",
    }
  },
  watch: {
    keyword: function (value) {
      console.log(`검색어 : ${value}`)
    },
  },
  methods: {
    keywordInput(event) {
      this.keyword = event.target.value
    },
  },
}
</script>
```

```
// 실행 예시
"검색어 : ㅎ"
"검색어 : 하"
"검색어 : 한"
"검색어 : 한ㄱ"
"검색어 : 한그"
"검색어 : 한글"
```

![Vue Js 한글 입력 과 IME 결과코드 2](/assets/Vue_Js_한글_입력_과_IME_2.gif "Vue Js 한글 입력 과 IME 결과코드 2")

[https://codepen.io/bottlehs/pen/abyeQNw](https://codepen.io/bottlehs/pen/abyeQNw "https://codepen.io/bottlehs/pen/abyeQNw")
