---
templateKey: blog-post
title: Vue JS 인스턴스 & 컴포넌트 소개
date: 2021-03-28T10:11:34.709Z
description: Vue 인스턴스는 생성될 때 일련의 초기화 단계를 거친다. 데이터가 변경되어 DOM을 업데이트하는 경우가 있다고 가정 하면, 그 과정에서 사용자 정의 로직을 실행할 수있는 라이프사이클의 훅 도 호출 된다. 컴포넌트는 하나의 블록을 의미한다. 레고처럼 여러 블럭을 쌓아서 하나의 집을 모양을 만들 듯이, 컴포넌트를 활용하여 화면을 만들면 보다 빠르게 구조화하여 일괄적인 패턴으로 개발할 수 있다. 이렇게 화면의 영역을 컴포넌트로 쪼개서 재활용할 수 있는 형태로 관리하면 나중에 코드를 재사용 할수 있다. 또한 모든 사람들이 레고의 사용설명서처럼 정해진 방식대로 컴포넌트를 등록하거나 사용하게 되므로 남이 작성한 코드를 직관적으로 이해할 수 있다.
tags:
  - vue
  - javascript
  - framework
  - frontend
  - web
---

![Vue JS 인스턴스 & 컴포넌트 소개](/assets/vue-logo.png "Vue JS 인스턴스 & 컴포넌트 소개")

## 인스턴스

- Vue 인스턴스는 생성된 Vue 오브젝트 하나의 오브젝트 이다.
- Vue 를 시작하기 위해 필수적이며, 앱의 진입점이 된다.
- 간단한 템플릿 렌더링부터 데이터 바인딩, 컴포넌트 등 많은 동작 수행 된다.

각 Vue 인스턴스는 생성될 때 일련의 초기화 단계를 거친다. 데이터가 변경되어 DOM을 업데이트하는 경우가 있다고 가정 하면, 그 과정에서 사용자 정의 로직을 실행할 수있는 라이프사이클의 훅 도 호출 된다.

예를 들어, 인스턴스가 생성된 이후 created 가 호출 된다.

### Vue Instance 라이프싸이클 초기화

인스턴스가 생성될 때 아래의 초기화 작업을 수행한다.

- 데이터 관찰
- 템플릿 컴파일
- DOM 에 객체 연결
- 데이터 변경시 DOM 업데이트

이 초기화 작업 외에도 개발자가 의도하는 커스텀 로직을 아래와 같이 추가할 수 있다.

```javascript
new Vue({
  data: {
    coffee: 1,
  },
  created: function () {
    // `this` 는 vm 인스턴스를 가리킵니다.
    console.log("coffee : " + this.coffee) // coffee : 1
  },
})
```

인스턴스 라이프사이클 단계에서 호출될 다른 훅은 "mounted, updated, destroyed 등.."이 있다.

### 인스턴스 옵션

| 옵션     | 설명                                                                                                                                                                   | 예제                                           | 비고                                                                                                         |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| el       | Vue가 실행될 HTML의 DOM 요소를 지정                                                                                                                                    | el : '#test'                                   | CSS의 선택자를 선택하듯이 선택 (#--> id 지정, . --> 클레스 지정)                                             |
| data     | Vue가 바라보는 data 객체를 지정                                                                                                                                        | data : { name : '홍길동'}                      | 직접 객체를 작성해도 되고 미리 선언된 객체변수를 작성해도 됨                                                 |
| computed | 함수로 정의하고 data객체 등을 사용하여 계산된 값을 리턴해 줌. methods와 차이점은 캐싱을 시켜놓고 동일한 요청이 또 올 경우는 함수를 실행하지 않고 캐싱된 값만 리턴해 줌 | computed : { sum1 : function() {retuen 3 + 4}} | 화살표함수는 사용 불가                                                                                       |
| methods  | 함수로 정의하고 data객체 등을 사용하여 계산된 값을 리턴해 줌. computed와 차이점은 캐싱이 되지 않고 호출될때마다 계속 함수를 실행함                                     | methods : { sum2 : function() {retuen 3 + 4}}  | 화살표함수는 사용 불가                                                                                       |
| watch    | 지정된 변수를 계속 지켜보고 있다가 값이 변경되었을때 정의된 함수를 실행시킴                                                                                            | watch : { x : function(v) {retuen v++ }}       | x는 관찰하고자 하는 지정된 변수, 긴 시간이 필요한 비동기 처리가 필요할 경우 주로 사용됨(axios, fetch 등등..) |

## 라이프사이클 다이어그램

아래는 인스턴스 라이프사이클에 대한 다이어그램이다.

![Vue JS 라이프사이클 다이어그램](/assets/vue-lifecycle.png "Vue JS 라이프사이클 다이어그램")

- **beforeCreate:** Vue 인스턴스가 생성되기 전
- **created:** vue 인스턴스가 생성된 후
- **beforeMount:** Vue 인스턴스가 마운트되기 전
- **Mounted:** Vue 인스턴스가 마운트된 후
- **beforeDestory:** Vue 인스턴스가 파괴된기 전
- **Destory:** Vue 인스턴스가 파괴된 후
- **beforeUpdate:** Vue 인스턴스의 데이터가 변경되어 다시 렌더링하기 전
- **upDated:** Vue 인스턴스의 데이터가 변경되어 다시 렌더링한 후

### computed & watch

**computed**

- 종속성이 있는 데이터의 경우 methods보다 computed 를 사용
- 계산이 필요한 데이터에 사용

```javascript
new Vue({
   el: '#app',
      data: {
         search: ''
      },
      computed: {
         searchAmericano: function (val) {
            return `${val} americano`; // search 데이터 + 'americano' 출력
         }
      }
   }
});
```

**watch**

- Vue 인스턴스의 데이터가 변경되는 시점을 감시해 메서드를 호출하는 기능

```javascript
new Vue({
   el: '#app',
      data: {
         search: ''
      },
      watch: {
         search: function (val) {
            console.log(val); // search 데이터 출력
         }
      }
   }
});
```

## 컴포넌트

- Vue.js가 제공하는 가장 강력한 기능 중 하나
- 컴포넌트는 HTML 마크업, 자바스크립트 로직을 포함한 하나의 덩어리
- 캡슐화가 자연스럽게 가능해지고 따라서 재사용이 가능해짐

> 캡슐화(영어: encapsulation)는 객체 지향 프로그래밍에서 다음 2가지 측면이 있다: 객체의 속성(data fields)과 행위(메서드, methods)를 하나로 묶고, 실제 구현 내용 일부를 외부에 감추어 은닉한다.

컴포넌트는 하나의 블록을 의미한다. 레고처럼 여러 블럭을 쌓아서 하나의 집을 모양을 만들 듯이, 컴포넌트를 활용하여 화면을 만들면 보다 빠르게 구조화하여 일괄적인 패턴으로 개발할 수 있다. 이렇게 화면의 영역을 컴포넌트로 쪼개서 재활용할 수 있는 형태로 관리하면 나중에 코드를 재사용 할수 있다. 또한 모든 사람들이 레고의 사용설명서처럼 정해진 방식대로 컴포넌트를 등록하거나 사용하게 되므로 남이 작성한 코드를 직관적으로 이해할 수 있다.

![Vue JS 컴포넌트](/assets/vue-컴포넌트.png "Vue JS 컴포넌트")

위 그림에서 보듯이 하나의 페이지를 여러 블록으로 나누었고, 여러 블록으로 조합하여 하나의 화면으로 만들었다. 그리고 하나의 특징이라면 하나의 블록 안에 또 다른 블록들이 들어가 있는 상-하위 구조를 가진다. 이러한 컴포넌트들은 커다란 최상위 컴포넌트 위에 작성되어 있기 때문에 오른쪽 그림과 같이 Root 컴포넌트를 시작으로 트리 구조를 형성한다.

### 컴포넌트 등록하기

컴포넌트를 등록하는 방법은 전역과 지역 두 가지가 있다. 지역 컴포넌트는 특정 인스턴스내에서만 유효한 범위를 갖고, 전역 컴포넌트는 여러 인스턴스에서 공통으로 사용할 수 있다. 즉, 지역은 특정 범위 내에서만 사용할 수 있고, 전역은 뷰로 접근 가능한 모든 범위에서 사용할 수 있다.

**전역 컴포넌트**

전역 컴포넌트는 뷰 라이브러리를 로딩하고 나면 접근 가능한 Vue 변수를 이용하여 등록한다. 전역 컴포넌트를 모든 인스턴스에 등록하려면 Vue 생성자에서 .component()를 호출하여 수행한다.

```javascript
Vue.component("컴포넌트 이름", {
  //컴포넌트 내용
})
```

전역 컴포넌트 등록 형식에는 컴포넌트 이름과 컴포넌트 내용이 있다. 컴포넌트 이름은 template 속성에서 사용할 HTML 사용자 정의 태그 이름을 의미한다. 그리고 컴포넌트 태그가 실제 화면의 HTML 요소로 변환될 때 표시될 속성들을 컴포넌트 내용에 작성한다. 컴포넌트 내용에는 template, data, methods 등 인스턴스 옵션 속성을 정의할 수 있다.

```html
<html>
  <head>
    <title>Vue Component Sample</title>
  </head>
  <body>
    <div id="app">
      <button>컴포넌트 등록</button>
      <coffee></coffee>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.5.2/dist/vue.js"></script>
    <script>
      Vue.component("coffee", {
        template: "<div>전역 coffee 컴포넌트가 등록되었습니다 !</div>",
      })
      new Vue({
        el: "#app",
      })
    </script>
  </body>
</html>
```

![Vue JS 전역 컴포넌트](/assets/vue-global-component.png "Vue JS 전역 컴포넌트")

**지역 컴포넌트 등록**

지역 컴포넌트 등록은 전역 컴포넌트 등록과는 다르게 인스턴스에 components 속성을 추가하고 등록할 컴포넌트 이름과 내용을 정의한다.

```javascript
new Vue({
    ...
    components:{
        'coffee':coffeeComponent
    }
})
```

```html
<html>
  <head>
    <title>Vue Sample</title>
  </head>
  <body>
    <div id="app">
      <button>app 컴포넌트 등록</button>
      <coffee></coffee>
      <coffee-americano></coffee-americano>
    </div>
    <hr />
    <div id="app2">
      <button>app2 컴포넌트2 등록</button>
      <coffee></coffee>
      <coffee-americano></coffee-americano>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.5.2/dist/vue.js"></script>
    <script>
      Vue.component("coffee", {
        template: "<div>전역 coffee 컴포넌트가 등록되었습니다 !</div>",
      })

      var coffeeAmericano = {
        template:
          "<div>지역 coffee americano 컴포넌트가 등록되었습니다 !</div>",
      }

      new Vue({
        el: "#app",
        components: {
          "coffee-americano": coffeeAmericano,
        },
      })

      new Vue({
        el: "#app2",
      })
    </script>
  </body>
</html>
```

![Vue JS 지역 컴포넌트](/assets/vue-local-component.png "Vue JS 지역 컴포넌트")

여기서 전역과 지역의 유효 범위까지 살펴볼 것이다. 예제코드에서는 전역 컴포넌트와 지역 컴포넌트를 모두 작성하였다. 그리고 특정 태그 내에 컴포넌트들을 등록하였는데, 결과는 두 영역이 다르게 나타난다. app이라는 id를 가진 돔 요소는 전역,지역 컴포넌트를 모두 가지지만 app2라는 id를 가진 돔 요소는 전역 컴포넌트만 가지게 된다.

전역 컴포넌트는 어느 인스턴스에나 사용가능한 컴포넌트이지만 지역 컴포넌트는 특정 인스턴스 내에서만 사용가능한 컴포넌트이기 때문에 app이라는 유효범위 내에서 설정된 'coffee-americano' 같은 경우는 app이라는 id를 가진 돔 요소에서만 사용가능하고, 전역 컴포넌트로 등록된 'coffee-americano'는 어느 뷰 인스턴스에나 사용가능하다.

### 부모와 자식 컴포넌트 관계

컴포넌트 관계도에서 상-하 관계에 있는 컴포넌트의 통신은

- 위에서 아래로는 데이터(props)를 내리고
- 아래에서 위로는 이벤트를 올린다(event emit)

![Vue JS 부모와 자식 컴포넌트 관계](/assets/vue-parent-child-relationship.png "Vue JS 부모와 자식 컴포넌트 관계")

**Props**
프롭스는 상위 컴포넌트에서 하위 컴포넌트로 내리는 데이터 속성을 의미한다. 이렇게 하는 이유는 모든 컴포넌트가 각 컴포넌트 자체의 스코프를 갖고 있어 다른 컴포넌트의 값을 바로 참조할 수 없기 때문이다.

```html
<!-- 상위 컴포넌트 -->
<div id="app">
  <!-- 하위 컴포넌트에 상위 컴포넌트가 갖고 있는 message를 전달함 -->
  <child-component v-bind:propsdata="message"></child-component>
</div>
```

```javascript
// 하위 컴포넌트
Vue.component("child-component", {
  // 상위 컴포넌트의 data 속성인 message를 propsdata라는 속성으로 넘겨받음
  props: ["propsdata"],
  template: "<p>{{ propsdata }}</p>",
})

// 상위 컴포넌트
var app = new Vue({
  el: "#app",
  data: {
    message: "Hello Vue! from Parent Component",
  },
})
```

**같은 레벨의 컴포넌트 간 통신**

동일한 상위 컴포넌트를 가진 하위 컴포넌트들 간의 통신은 아래와 같이 해야 한다.

- Child(하위) -> Parent(상위) -> Children(하위 2개)

참고 : 컴포넌트 간의 직접적인 통신은 불가능하도록 되어 있는게 Vue 의 기본 구조

**Event Bus**

상위 - 하위 관계가 아닌 컴포넌트 간의 통신을 위해 Event Bus를 활용할 수 있다.

Event Bus를 사용하기 위해 새로운 뷰 인스턴스를 아래와 같이 생성한다.

```javascript
// 화면 개발을 위한 인스턴스와 다른 별도의 인스턴스를 생성하여 활용
var eventBus = new Vue()

new Vue({
  // ...
})
```

이벤트를 발생시킬 컴포넌트에서 `$emit()` 호출

```javascript
eventBus.$emit("coffee", 50)
```

이벤트를 받을 컴포넌트에서 `$on()` 이벤트 수신

```javascript
// 이벤트 버스 이벤트는 일반적으로 라이프 사이클 함수에서 수신
new Vue({
  created: function () {
    eventBus.$on("coffee", function (data) {
      console.log(data) // 50
    })
  },
})
```

만약, eventBus의 콜백 함수 안에서 해당 컴포넌트의 메서드를 참고하려면 vm 사용

```javascript
new Vue({
  methods: {
    americano() {
      // ...
    },
  },
  created() {
    var vm = this
    eventBus.$on("coffee", function (data) {
      console.log(this) // 여기서의 this는 이벤트 버스용 인스턴스를 가리킴
      vm.americano() // vm은 현재 인스턴스를 가리킴
    })
  },
})
```
