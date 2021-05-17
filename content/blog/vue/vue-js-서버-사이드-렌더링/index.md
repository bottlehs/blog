---
templateKey: blog-post
title: Vue Js 서버 사이드 렌더링
date: 2021-05-16T16:11:34.709Z
category: vue
description:
tags:
  - vue
  - javascript
  - framework
  - frontend
  - web
  - ssr
---

![Vue Js 서버 사이드 렌더링](/assets/vue-logo.png "Vue Js 서버 사이드 렌더링")

서버 사이드 렌더링이란 서버에서 페이지를 렌더링후 클라이언트(브라우저)로 보내 화면에 표시하는 기법을 의미한다. 뷰 싱글 페이지 애플리케이션을 서버 사이드 렌더링의 반대인 클라이언트 사이드 렌더링 방식이다.

## CSR, SSR 차이점

### CSR

HTML, JS, CSS 만 서버에서 받고 사용자에게 보여줄 데이터를 포함한 UI는 클라이언트에서 랜더링후 화면에 표시 한다.

### SSR

HTML, JS, CSS 및 화면에 표시해줄 데이터를 포함한 UI를 서버에서 랜더링하여 클라이언트 화면에 표시 한다.

![Vue Js CSR, SSR](/assets/vue-ssr-vs-csr2.png "Vue Js CSR, SSR")

위 예시를 보면 SSR 의 경우 Main 이 소스코드 보기에서 보이고, CSR 의 경우 Main 이 소스코드 보기에서 보이지 않는다.
이유는 SSR는 서버에서 렌더링 되었기 때문에 Main 이 보이는것이고 CSR 은 브라우저에서 아직 랜더링이 되지 않았기 때문에 Main 이 보이지 않는 것이다.

![Vue Js CSR, SSR](/assets/vue-ssr-vs-csr.png "Vue Js CSR, SSR")

## 서버 사이드 렌더링 사용 목적

서버 사이드 렌더링을 쓰는 목적은 크게 "검색 엔진 최적화"와 "빠른 페이지 렌더링"이다. 검색 엔진 최적화란 구글, 네이버, 다음과 같은 검색 사이트에서 검색했을 때 결과가 사용자에게 많이 노출될 수 있도록 최적화 하는 기법이다. 특히, SNS에서 링크를 공유했을 때 해당 웹 사이트의 정보를 이미지와 설명으로 표시해주는 OG(Open Graph) Tag를 페이지 별로 적용하기 위해서는 서버 사이드 렌더링이 효율적이다.

![Vue Js Facebook OG Tags 1](/assets/og-tags-1.png "Vue Js Facebook OG Tags 1")

![Vue Js Facebook OG Tags 2](/assets/og-tags-2.png "Vue Js Facebook OG Tags 2")

## 서버 사이드 렌더링 단점

서비사이드 렌더링 사용 목적을 보면 서버 사이드 렌더링이 좋다고 생각 될것이다. 하지만 서버 사이드 렌더링을 하기전에 주의해야 할 점이 있다. 서버 사이드 렌더링은 Node.js 웹 애플리케이션 실행 방법을 알아야하고 서버쪽 환경 구성과 함께 클라이언트, 서버 빌드에 대한 이해가 필요하다. 따라서, 프론트엔드 개발 입문자 입장에서는 진입이 어렵다 그리고 Node.js 환경에서 실행되기 때문에 브라우저 관련 API를 다룰 때 주의해야 한다. 뷰 싱글 페이지 애플리케이션의 라이프 사이클 훅과는 다른 환경(브라우저가 아닌 Node.js)에서 동작하기 때문에 beforeCreate와 created에서 window나 document와 같은 브라우저 객체에 접근할 수 없다. ( beforeMount나 mounted에서 window와 document를 접근할 수 있다 )

## Nuxt.js 특징 및 활용

### Nuxt 란

Nuxt.js는 Vue.js 응용 프로그램을 만들기 위한 Framework이며, Vue.js Application을 좀 더 손쉽게 만들 수 있으며 Server-Side-Rendering을 지원한다.

### Nuxt 특징

- 서버 사이드 렌더링
- 규격화된 폴더 구조(layout, store, middleware, plugins 등)
- pages 폴더 기반의 자동 라우팅 설정
- 코드 스플리팅
- 비동기 데이터 요청 속성
- ES6/ES6+ 변환
- 웹팩을 비롯한 기타 설정

### 활용

npm 을 통한 프로젝틑 셋팅

```
npm init nuxt-app@latest <my-project>
```

```
cd my-project
npm run dev
```

![Nuxt Run dev](/assets/nuxt-run-dev-1.png "Nuxt Run dev")

![Nuxt Run dev](/assets/nuxt-run-dev-2.png "Nuxt Run dev")

`npm run dev` 실행 하면 서버에서 렌더링 과정을 거치게 되고, 렌더링후 서버가 실행 되면 브라우저에서 확인할수 있다.

![Nuxt Run dev](/assets/nuxt-index.png "Nuxt Run dev")

외부 API 를 활용하여 서버에서 API 를 요청하고 요청한 결과를 렌더링된 HTML 에 포함시키는 간단한 코드를 작성해 보자

nuxt/axios 를 설치 한다.

```
npm install @nuxtjs/axios
```

nuxt.config.js 에 axios module 설정을 해준다.

```
export default {
  modules: [
    '@nuxtjs/axios',
  ],
  axios: {
    baseURL: 'https://testrestapi.cafe24.com',
  },
}
```

pages/index.vue 에 axios 를 활용하여 sample api 를 요청 하는 코드를 작성 한다.

```html
<template>
  <div>{{ sample }}</div>
</template>
```

```javascript
export default {
  async asyncData({ $axios }) {
    const sample = await $axios.$get(`/api/sample/sample`)
    return { sample }
  },
}
```

실행 결과 화면은 아래와 같다.

![Nuxt Axios](/assets/nuxt-index-2.png "Nuxt Axios")

## Vue Server Renderer 활용

npm 을 통한 초기화

```
npm init
```

name 은 `vue-ssr` 로 입력 하자. 아래는 npm 으로 초기화한 package.json 이다.

```
{
  "name": "vue-ssr",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}

```

`vue`,`vue-server-renderer` 를 설치 한다.

```
npm install vue vue-server-renderer --save
```

package.js 에서 설치된 vue, vue-server-renderer 를 확인 한다.

```
"dependencies": {
  "vue": "^2.6.12",
  "vue-server-renderer": "^2.6.12"
}
```

server.js 파일 생성후 vue 를 서버에서 랜더링 해보도록 하겠다.

```javascript
// server.js

// Vue 인스턴스 생성
const Vue = require("vue")
const app = new Vue({
  template: `<div>Hello World</div>`,
})

// 렌더링
const renderer = require("vue-server-renderer").createRenderer()

// Vue 인스턴스를 HTML로 렌더링
renderer.renderToString(app, (err, html) => {
  if (err) throw err
  console.log(html)
  // => <div data-server-rendered="true">Hello World</div>
})

renderer
  .renderToString(app)
  .then(html => {
    console.log(html)
  })
  .catch(err => {
    console.error(err)
  })
```

위와 같이 server.js 파일 생성후 코드를 작성한뒤 아래와 같이 터미널에 입력 해보도록 하자

```
node server.js
```

![server.js 실행 화면](/assets/vue-ssr-server-1.png "server.js 실행 화면")

Vue 인스턴스 생성후 HTML 랜더링된 HTML 코드가 콘솔로 찍히는걸 확인 할수 있다.
여기서 node 는 node 로 server.js 파일을 실행해라 하는 의미 이다.

이제 서버사이드에서 Vue가 랜더링되는걸 확인 했으니 Express.js 를 설치하여 Express.js 프레임워크에서 Vue 가 랜더링 되도록 해볼것 이다.

Express.js 는 웹 애플리케이션, API 개발을 위해 설계되었고. Node.js의 표준 서버 프레임워크 라고 할수 있다.

아래와 같이 npm 을 사용해서 Express.js 를 설치 한다.

```
npm install express --save
```

```
{
  "name": "vue-ssr",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.17.1",
    "vue": "^2.6.12",
    "vue-server-renderer": "^2.6.12"
  }
}
```

설치가 완료 되었으면 Express.js 를 실행해 보도록 하자

아래와 같이 server.js 에 아래와 같은 코드를 입력 한다.

```javascript
const Vue = require("vue")
const server = require("express")()
const renderer = require("vue-server-renderer").createRenderer()

server.get("*", (req, res) => {
  const app = new Vue({
    data: {
      url: req.url,
    },
    template: `<div>The visited URL is: {{ url }}</div>`,
  })

  renderer.renderToString(app, (err, html) => {
    if (err) {
      res.status(500).end("Internal Server Error")
      return
    }
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Hello</title></head>
        <body>${html}</body>
      </html>
    `)
  })
})

server.listen(8080)
```

Express.js 를 실행해 보자 `server.listen(8080)` 은 8080 포트로 node 서버를 실행하겠다는 의미 이다.

```
node server.js
```

![server.js 실행 화면 - Express](/assets/vue-ssr-express-1.png "server.js 실행 화면 - Express")
