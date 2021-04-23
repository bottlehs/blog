---
templateKey: blog-post
title: Vue Js Axios 및 Rest Api 를 활용한 CRUD 구현
date: 2021-04-11T23:11:34.709Z
category: vue
description: Axios는 브라우저, Node.js를 위한 Promise API를 활용하는 HTTP 비동기 통신 라이브러리이다. 비동기 방식은 웹페이지를 리로드하지 않고 데이터를 불러오는 방식이며,Ajax를 통해서 서버에 요청을 한 후 멈추어 있는 것이 아니라 그 프로그램은 계속 돌아간다는 의미를 내포하고 있다.
tags:
  - vue
  - javascript
  - framework
  - frontend
  - web
  - axios
  - ajax
  - crud
---

![Vue Js Axios 및 Rest Api 를 활용한 CRUD 구현](/assets/vue-logo.png "Vue Js Axios 및 Rest Api 를 활용한 CRUD 구현")

## Aajx

AJAX (Asynchronous Javascript And XML)
AJAX란, Javascript의 라이브러리중 하나이며 Asynchronous Javascript And Xml(비동기식 자바스크립트와 xml)의 약자이다. 브라우저가 가지고있는 XMLHttpRequest 객체를 이용해서 전체 페이지를 새로 고치지 않고도 페이지의 일부만을 위한 데이터를 로드하는 기법 이며, avaScript를 사용한 비동기 통신, 클라이언트와 서버간에 XML 데이터를 주고받는 기술이다. 정리하자면, 자바스크립트를 통해서 서버에 데이터를 요청하는 것이다.

### 비동기 방식이란?

비동기 방식은 웹페이지를 리로드하지 않고 데이터를 불러오는 방식이며,Ajax를 통해서 서버에 요청을 한 후 멈추어 있는 것이 아니라 그 프로그램은 계속 돌아간다는 의미를 내포하고 있다.

### 비동기 방식의 장점

페이지 리로드의 경우 전체 리소스를 다시 불러와야하는데 이미지, 스크립트 , 기타 코드등을 모두 재요청할 경우 불필요한 리소스 낭비가 발생하게 되지만 비동기식 방식을 이용할 경우 필요한 부분만 불러와 사용할 수 있으므로 매우 큰 장점이 있다.

## Axios

Axios는 브라우저, Node.js를 위한 Promise API를 활용하는 HTTP 비동기 통신 라이브러리이다.

### Axios 특징

- 운영 환경에 따라 브라우저의 XMLHttpRequest 객체 또는 Node.js의 HTTP API 사용
- Promise(ES6) API 사용
- 요청과 응답 데이터의 변형
- HTTP 요청 취소 및 요청과 응답을 JSON 형태로 자동 변경

![Synchronous Asynchronous](/assets/synchronous-asynchronous.png "Synchronous Asynchronous")

### Axios 설치 및 등록

```npm
npm install axios
```

![Vue Js Axios Install](/assets/vue-axios-install.png "Vue Axios Install")

Axios 를 등록할 자바스크립트 파일을 하나 새로 생성합니다. 이름은 http/index.js 로 합니다.

![Vue Js Axios Dir](/assets/vue-vuex-install-dir.png "Vue Js Axios Dir")

axios 를 등록 하여 사용할 컴포넌트 `views/Sample.vue` 를 생성후 Axios (http) Instance 를 import 합니다.

![Vue Js Axios Dir](/assets/vue-axios-sample-instance.png "Vue Js Axios Dir")

## REST API

제공되는 sample api 를 활용하여 crud 를 개발 해보도록 하겠습니다. crud 란 create, read, update, delete 의 약어 이다.
REST API 를 활용한 CRUD 개발에 앞서 HTTP 와 REST API 에 대해 알아 보도록 하낟.

### HTTP

HTTP는 Hyper Text Transfer Protocol의 두문자어로, 인터넷에서 데이터를 주고받을 수 있는 프로토콜입니다.

### REST API

#### REST의 정의

“Representational State Transfer” 의 약자 자원을 이름(자원의 표현)으로 구분하여 해당 자원의 상태(정보)를 주고 받는 모든 것을 의미한다. 즉, 자원(resource)의 표현(representation) 에 의한 상태 전달

- 자원(resource)의 표현(representation)
  - 자원: 해당 소프트웨어가 관리하는 모든 것
  - 자원의 표현: 그 자원을 표현하기 위한 이름
- 상태(정보) 전달
  - 데이터가 요청되어지는 시점에서 자원의 상태(정보)를 전달한다.
  - JSON 혹은 XML를 통해 데이터를 주고 받는 것이 일반적이다.

REST는 네트워크 상에서 Client와 Server 사이의 통신 방식 중 하나이다.

#### REST의 구체적인 개념

HTTP URI(Uniform Resource Identifier)를 통해 자원(Resource)을 명시하고, HTTP Method(POST, GET, PUT, DELETE)를 통해 해당 자원에 대한 CRUD Operation을 적용하는 것을 의미한다.
즉, REST는 자원 기반의 구조(ROA, Resource Oriented Architecture) 설계의 중심에 Resource가 있고 HTTP Method를 통해 Resource를 처리하도록 설계된 아키텍쳐를 의미한다.
웹 사이트의 이미지, 텍스트, DB 내용 등의 모든 자원에 고유한 ID인 HTTP URI를 부여한다.

##### CRUD Operation

- Create : 생성(POST)
- Read : 조회(GET)
- Update : 수정(PUT)
- Delete : 삭제(DELETE)
- HEAD: header 정보 조회(HEAD)

## REST API 요청 및 응답 예시 와 HTTP 상태 설명

`views/Sample.vue` 에서 입력,수정,삭제,조회 기능을 구할 것이다. 각 CRUD 예시는 아래와 같으며 HTTP 응답은 아래와 같이 구성 했다.

### HTTP 응답

| Status Code             | Description                                                                                                                                                                                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 200 (성공)              | 서버가 요청을 제대로 처리했다는 뜻이다. 이는 주로 서버가 요청한 페이지를 제공했다는 의미로 쓰인다.                                                                                                                                                                   |
| 204 (콘텐츠 없음)       | 서버가 요청을 성공적으로 처리했지만 콘텐츠를 제공하지 않는다.                                                                                                                                                                                                        |
| 400 (잘못된 요청)       | 서버가 요청의 구문을 인식하지 못했다.                                                                                                                                                                                                                                |
| 401 (권한 없음)         | 이 요청은 인증이 필요하다. 서버는 로그인이 필요한 페이지에 대해 이 요청을 제공할 수 있다. 상태 코드 이름이 권한 없음(Unauthorized)으로 되어 있지만 실제 뜻은 인증 안됨(Unauthenticated)에 더 가깝다.                                                                 |
| 403 (Forbidden, 금지됨) | 서버가 요청을 거부하고 있다. 예를 들자면, 사용자가 리소스에 대한 필요 권한을 갖고 있지 않다. (401은 인증 실패, 403은 인가 실패라고 볼 수 있음)                                                                                                                       |
| 410 (사라짐)            | 서버는 요청한 리소스가 영구적으로 삭제되었을 때 이 응답을 표시한다. 404(찾을 수 없음) 코드와 비슷하며 이전에 있었지만 더 이상 존재하지 않는 리소스에 대해 404 대신 사용하기도 한다. 리소스가 영구적으로 이동된 경우 301을 사용하여 리소스의 새 위치를 지정해야 한다. |
| 412 (사전조건 실패)     | 서버가 요청자가 요청 시 부과한 사전조건을 만족하지 않는다.                                                                                                                                                                                                           |

### 입력

![Vue Js Axios REST API 입력](/assets/vue-axios-rest-api-create.png "Vue Js Axios REST API 입력")

```
URL: https://testrestapi.cafe24.com/api/sample/sample
Method: POST

body
{
  "name": "name edit",
  "description": "description edit"
}
```

### 조회

![Vue Js Axios REST API 조회](/assets/vue-axios-rest-api-read.png "Vue Js Axios REST API 조회")

```
URL: https://testrestapi.cafe24.com/api/sample/sample
Method: GET
```

### 단건 조회

![Vue Js Axios REST API 단건 조회](/assets/vue-axios-rest-api-read-single.png "Vue Js Axios REST API 단건 조회")

```
URL: https://testrestapi.cafe24.com/api/sample/sample/{id}
Method: GET
```

### 단건 수정

![Vue Js Axios REST API 단건 수정](/assets/vue-axios-rest-api-update.png "Vue Js Axios REST API 단건 수정")

```
URL: https://testrestapi.cafe24.com/api/sample/sample/{id}
Method: PUT

body
{
  "name": "name edit",
  "description": "description edit"
}
```

### 단건 삭제

![Vue Js Axios REST API 단건 삭제](/assets/vue-axios-rest-api-delete.png "Vue Js Axios REST API 단건 삭제")

```
URL: https://testrestapi.cafe24.com/api/sample/sample/{id}
Method: DELETE
```

## Axios 를 활용한 REST API 연동

### 적용 화면

![Vue Js Axios REST API 조회 적용 화면](/assets/vue-axios-rest-sample.png "Vue Js Axios REST API 조회 적용 화면")

### 코드

아래 코드 로직은 아래와 같다.

1. http 를 import 한다.
2. data 에 items, totalItems, totalPages 를 초기화 한다.
3. `created` 에서 `read()` 함수를 호출 한다.
4. `read()` 함수에서 axios 를 활용하여 sample api 를 GET 으로 호출 한다.
5. 응답값 `response` 에서 items, totalItems, totalPages 를 각각 Vue data 변수에 대입해 준다.

```vue
<template>
  <div class="vuex">
    <h1>Sample 화면 입니다.</h1>
    totalItems : {{ totalItems }} <br />
    totalPages : {{ totalPages }} <br />
    <ul>
      <li v-for="(row, i) in items" :key="'result_table_' + i">{{ row }}</li>
    </ul>
  </div>
</template>

<script>
import http from "../http"

export default {
  name: "Vuex",
  components: {},
  data() {
    return {
      items: [],
      totalItems: 0,
      totalPages: 0,
    }
  },
  methods: {
    delete(id) {
      http
        .delete("/api/sample/sample/" + id)
        .then(response => {
          const { data } = response
          console.log(data)
        })
        .catch(error => {
          alert(error)
        })
    },
    create(id, params) {
      http
        .post("/api/sample/sample/", params)
        .then(response => {
          const { data } = response
          console.log(data)
        })
        .catch(error => {
          alert(error)
        })
    },
    update(id, params) {
      http
        .put("/api/sample/sample/" + id, {
          params: params,
        })
        .then(response => {
          const { data } = response
          console.log(data)
        })
        .catch(error => {
          alert(error)
        })
    },
    read() {
      let params = {}
      http
        .get("/api/sample/sample", {
          params: params,
        })
        .then(response => {
          const { data } = response
          console.log(data)
          this.items = data.items
          this.totalItems = data.totalItems
          this.totalPages = data.totalPages
        })
        .catch(error => {
          alert(error)
        })
    },
  },
  created() {
    console.log(http)
    this.read()
  },
}
</script>

<style scoped>
.main {
  border: solid 5px #000;
  padding: 100px;
}
</style>
```
