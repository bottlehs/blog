---
templateKey: blog-post
title: Vue Js 소프트웨어국제화(i18n)
date: 2021-05-02T16:11:34.709Z
category: vue
description: 라우트에 연결하거나 탐색을 수행 할 때 이름이 있는 라우트를 사용할수 있다. 사용 법은 routes 에 name 옵션을 지정 하면 된다. 라우트 관리가 편리 하다 라는 장점이 있다.
tags:
  - vue
  - javascript
  - framework
  - frontend
  - web
  - file
  - FormData
  - FileReader
---

![Vue Js 소프트웨어국제화(i18n)](/assets/vue-logo.png "Vue Js 소프트웨어국제화(i18n)")

단순히 번역 원고를 받아 글자 바꾸는 것보다 신경 써야 할 부분이 많다. 그 부분들을 통틀어 국제화(Internationalization; i18n) 라고 한다.

> i18n은 어떤 프레임워크가 아니고 i와 n 사이에 18개의 알파벳이라는 뜻이다.

## 글자 번역 외에 국제화에 필요한 작업

- 언어, 지역 별 번역
- OS/플랫폼 인코딩
- 문자열 치환 방법
- 국제화 UI (문자열 크기 변화, 폰트, 아이콘 등)
- 쓰기 방향의 차이 (LTR, RTL)
- 숫자, 공백, 화폐, 날짜, 주소, 측정 단위 등 표기
- 타임존, 썸머타임 등 시각
- 문자열 정렬 방법

vue-i18n 을 활용하여 날짜, 화폐, 문자열만 우선 다뤄 보도록 하겠다.

## Vue i18n

vue-i18n 라이브러리를 활용하여 3개국어를 지원하는 예시를 만들어 vue-i18n 이 어떻게 동작되는지 살펴 보도록 한다.

### Install

```npm
npm install vue-i18n
```

### Demo

**i18n.js**

```javascript
import Vue from "vue"
import VueI18n from "vue-i18n"

Vue.use(VueI18n)

function loadLocaleMessages() {
  const locales = require.context(
    "./locales/message",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  )
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  loadLocalDateTimeFormats()

  return messages
}

function loadLocalDateTimeFormats() {
  const locales = require.context(
    "./locales/date",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  )
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })

  return messages
}

function loadLocalNumberFormats() {
  const locales = require.context(
    "./locales/number",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  )
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })

  return messages
}

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || "ko",
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "ko",
  messages: loadLocaleMessages(),
  dateTimeFormats: loadLocalDateTimeFormats(),
  numberFormats: loadLocalNumberFormats(),
})
```

**main.js**

```javascript
import i18n from "./i18n";
.. code

new Vue({
  i18n
  .. code
}).$mount("#app");

```

**View/I18n.vue**

```html
<template>
  <div class="i18n">
    <select v-model="$i18n.locale" @change="onLocaleChange($event)">
      <option v-for="lang in langs" :value="lang.code" :key="lang.code">
        {{ lang.label }}
      </option>
    </select>
    <h2>Message localization</h2>
    <p>title : {{ $t("title") }}</p>
    <p>title : {{ $t("hello", { name: "Your name" }) }}</p>
    <h2>DateTime localization</h2>
    <p>origin : {{ sample.date }}</p>
    <p>short : {{ $d(sample.date, "short") }}</p>
    <p>long : {{ $d(sample.date, "long") }}</p>
    <h2>Number localization</h2>
    <p>origin : {{ sample.number }}</p>
    <p>currency : {{ $n(sample.number, "currency") }}</p>
  </div>
</template>

<script>
  export default {
    name: "I18n",
    components: {},
    data() {
      return {
        sample: {
          date: new Date(),
          number: 10000,
        },
        langs: [
          {
            code: "en",
            label: "English",
          },
          {
            code: "ko",
            label: "한국어",
          },
        ],
      }
    },
    methods: {
      onLocaleChange(event) {
        this.$i18n.locale = event.target.value
      },
    },
  }
</script>

<style scoped></style>
```

#### DateTime localization

```json
// locales/date/en.json
{
  "short": {
    "year": "numeric",
    "month": "short",
    "day": "numeric"
  },
  "long": {
    "year": "numeric",
    "month": "long",
    "day": "numeric",
    "weekday": "long",
    "hour": "numeric",
    "minute": "numeric"
  }
}

// locales/date/ko.json
{
  "short": {
    "year": "numeric",
    "month": "short",
    "day": "numeric"
  },
  "long": {
    "year": "numeric",
    "month": "long",
    "day": "numeric",
    "weekday": "long",
    "hour": "numeric",
    "minute": "numeric",
    "hour12": true
  }
}
```

#### Number localization

```json
// locales/number/en.json
{
  "currency": {
    "style": "currency",
    "currency": "USD"
  }
}

// locales/number/ko.json
{
  "currency": {
    "style": "currency",
    "currency": "KRW"
  }
}
```

#### Message localization

```json
// locales/message/en.json
{
  "title": "title",
  "hello": "hello {name}"
}

// locales/message/ko.json
{
  "title": "제목",
  "hello": "안녕 {name}"
}
```
