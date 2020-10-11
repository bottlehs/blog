---
templateKey: blog-post
title: Polymer
date: 2020-10-11T09:11:34.709Z
description: 폴리머는 웹 컴포넌트 기반 애플리케이션을 쉽고 빠르게 만들어주는 라이브러리이다. 폴리머 3.0은 ES6을 이용하여 개발이
  가능하며, 프로그레시브 웹앱을 적극 지원한다.
tags:
  - polymer
  - javascript
  - framework
  - frontend
  - web
---
현재 다양한 웹 프론트엔드(Front-End) 프레임워크가 있다. 그중 인기 있는 프레임워크는 React, AngularJS, Vue.js 등이 있다.
폴리머(https://www.polymer-project.org)는 구글이 서포트 하고 있다. 다른 프레임워크에 비해 국내 이용자율이 높지는 않지만, 이미 해외에서는 다양한 프로젝트에 사용되고 있으며, 우리가 익히 알고 많이 사용하고 있는 유튜브(Youtube) 도 최근에 폴리머 프레임워크로 구현하였다. 그리고 Vue.js 의 초기 아키텍처를 구성하는데 큰 영감을 주었다.

이 프레임워크에 보다 익숙해지면, 빠른 생산성과 구현하고자 하는 비즈니스 로직에 집중 할 수 있다. 물론, 어떤 서비스를 구현하냐에 따라서, 타 프레임워크와의 장단점을 비교해봐야 할것이다.



## 특징

폴리머는 웹 컴포넌트 기반 애플리케이션을 쉽고 빠르게 만들어주는 라이브러리이삳. 폴리머 3.0은 ES6을 이용하여 개발이 가능하며, 이전 버전보다 성능이 크게 향상 되었으며, 프로그레시브 웹앱을 적극 지원한다.

웹 컴포넌트는 크게 4가지 구성요소를 가지는데, 커스텀 엘리먼트(Custom Elements), 템플릿(Template), 쉐도우 돔(Shadow DOM), HTML/JS 입포트이다. 즉, 컴포넌트를 캡슐화하고 새롭게 정의할 수 있고 이를 쉽게 임포트하여 사용할 수 있는 것을 골자로 한다.

* **커스텀 엘리먼트(Custom Elements)**
  폴리머는 커스텀 엘리먼트를 클래스로 활용하여 손쉽게 만들 수 있다. 각 엘리먼트는 라이프사이클을 가지고 작동하며, 프로퍼티 및 자체 데이터를 바인딩하는 시스템을 가지고 있다.
* **쉐도우 돔(Shadow DOM)**
  쉐도우 돔은 로컬 상에서 캡슐화된 DOM 트리를 제공하는데, 폴리머는 이를 자동으로 생성 하고 DOM 트리 상에서 관리하게 된다.
* **이벤트(Events)**
  프로퍼티(property) 및 어트리뷰트(attribute), 각 프로퍼티의 옵저버(observer), 컴퓨트(computed) 된 프로퍼티를 만들고 관리할 수 있는 시스템을 제공한다.
* **Browser Compatibility**
  폴리머 라이브러리와 앱 툴박스는 대부분의 웹 브라우저에서 동작한다. Chrome, Firefox, IE, Edge, Safari, Opera 를 공식적으로 지원단다.



### 작업환경

폴리머는 CLI 를 이옹하여 설치 하는 방법을 권장 한다. npm 이 설치 되어 있지 않다면 npm 설치후 진행하면 된다.

```
$ npm install npm&latest -g
$ npm install -g polymer-cli
```

폴더를 생성하고 폴리머 프로젝트를 셋팅 해보자

```
$ mkdir hello-polymer
$ cd hello-polymer
$ polymer init // polymer-3-application 선택
```

위와 같은 순서로 입력하면 이미 셋팅된 폴리머 라이브러리 및 프리셋을 한번에 설치 할수 있다.

![polymer init](/assets/package_json_—_chatbot.png "polymer init")

아래와 같이 폴리머를 실행할수 있다.

```
$ polymer serve
```

![hello polymer](/assets/hello-polymer.png "hello polymer")

폴리머를 활용하여 웹 애플리케이션을 개발할수 있는 환경이 만들어졌다.

폴리머 웹앱을 만들 때 자주 사용하게 될 도구인 bower 가 있는데, bower(https://bower.io)는 프론트앤드 패키지 매니징 서비스로서, 여러 파일과 라이브러리에 대한 의존성을 자동화 시켜주는 도구이다. bower 는 다음에 자세히 다뤄보도록 하겠다.