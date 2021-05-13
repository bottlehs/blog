---
templateKey: blog-post
title: ECMAScript6 는 무었일까?
date: 2021-05-09T21:06:14.444Z
category: javascript
description: ES6 (ECMA6) 에 대해 소개 합니다.
tags:
  - ES6
  - ECMAScript 2016
  - Javascript
  - ES5
  - ECMAScript 5
---

ECMA스크립트란, Ecma International이 ECMA-262 기술 규격에 따라 정의하고 있는 **표준화된 스크립트 프로그래밍 언어**를 말합니다.

2009년에 발표된 ES(ECMAScript 5)는 웹 어플리케이션 부터 소셜게임 까지 다양한 곳에서 활용이 되었습니다. 그 이후, 기존에 자바스크립트의 여러 문제점을 해결하고 개선한 ES6(ECMAScript 2015)이 2015년 여름에 발표 되었습니다. ES6은 ECMAScript 2015라도고 불리고, 기존 여러 기능을 개선한 버전입니다.

ES6의 핵심 기능 중 하나는 ES5(ECMAScript 5) 버전을 기반으로 개발된 웹 페이지가 동작가능 하도록 **하위 호환성**을 지원하는 것입니다.

ES6에 추가된 주요 기능은 아래와 같습니다.

- let & cont : 변수 선언용 **let**, 상수 선언용 **const** 키워드 추가
- 화살표 함수 : 함수 정의를 위한 화살표 함수 추가
- 클래스 : **클래스** 키워드 추가
- 템플릿 문자열 : 역따옴표를 이용한 문자열 기능 추가
- 디스럭처링 : 변수를 매핑하여 할당 가능
- 함수 인자 기능 : 인자 기본값 설정, 가변 인자 기능 추가
- Iterator & for-of : 배결의 **Iterator** 속성 정의 및 **for-of** 키워드 추가
- Map & Set : Map, Set 키워드 추가
- 모듈 기능 : **import, export** 키워드 추가
- Promise : **Promise** 모듈 추가
- Proxy : Proxy 패턴의 기능을 기본 표준으로 추가
- Symbol : 새로운 Symbole 추가

## let & cont

기존에는 var 키워드로 변수와 상수를 모두 정의 하였지만 ES6에서는 변수와 상수를 구분할수 있는 let 과 const 가 추가 되었습니다.

### let

let 은 변수를 정의할 때 사용합니다.
변수는 변하는 값을 의미합니다.

```javascript
let fruit = "apple"
```

기존 var 키워드로 선언한 변수를 함수 스코프(scope) 변수라고 하며, 함수 안에서 변수를 선언하면 함수 외부를 제외하고 함수 내부 어디서든지 접근할수 있다. 이와 달리 let 은 블록 스코프 변수이며, 블록 스코프 안에서 변수를 선언하면 블록 내부에서만 접근을 할수 있고 외부에서는 접근 할 수 없습니다.

```javascript
function fruit() {
  if (true) {
    var pear = 1
    let apple = 2
  }

  console.log(pear) // 출력 1
  console.log(apple) // if 문 안에서만 접근 가능하므로 reference 에러 발생
}
```

또한, 같은 스코프에서는 같은 이름의 let 변수를 선언할 수 없습니다.

```javascript
function fruit() {
  if (true) {
    let pear = 1
    let pear = 2 // SyntaxError 발생
  }
}
```

여러 개의 변수를 선언하기 위해 콤마(,)로 구분하여 연속해서 선언할 수 있습니다.

```javascript
let pear = 1,
  apple = 2,
  chestnut

console.log(pear) // 출력 1
console.log(apple) // 출력 2
console.log(chestnut) // 출력 undefined
```

여기서 값을 할당하지 않을경우 undefined 가 할당 됩니다.
let 과 var 의 주된 차이점 중 하나는 this 키워드가 참조하는 오브젝트의 차이입니다.

```javascript
let pear = 1
var apple = 2

console.log(this.pear) // 출력 1
console.log(this.apple) // 출력 undefined
```

var 키워드로 선언한 변수는 this 가 window 오브젝트를 참조하므로 접근할 수 있지만 let 은 접근 할수 없습니다.

ES6 하위 호환성을 위해 var 키워드를 여전히 사용 가능하지만, ES6 에서는 let 사용을 권장합니다.

### const

const 은 상수를 정의할 때 사용됩니다.
상수는 변하지 않는 값을 의미합니다.

```javascript
const fruit = "apple"
```

기존에는 상수를 선언 할수있는 키워드가 없었다. 그래서 변수,상수 모두 var 로 정의하여 사용 하였습니다.
ES6 에서는 상수를 정의할수 있는 키워드가 추가 되었고 상수 선언은 const 로 할수있습니다.
const 는 블록 스코프 상수 이며, 블록 스코프 안에서 상수를 선언하면 블록 내부에서만 접근 할수 있고 외부에서는 접근 할 수 없습니다.

```javascript
function fruit() {
  if (true) {
    var pear = 1
    const apple = 2
  }

  console.log(pear) // 출력 1
  console.log(apple) // if 문 안에서만 접근 가능하므로 reference 에러 발생
}
```

또한, 같은 스코프에서는 같은 이름의 const 상수를 선언할 수 없습니다.

```javascript
function fruit() {
  if (true) {
    const pear = 1
    const pear = 2 // SyntaxError 발생
  }
}
```

한번 정의된 상수는 재정의 할수 없습니다.

```javascript
const pear = 1
const pear = 2 // SyntaxError 발생
```

여러 개의 상수를 선언하기 위해 콤마(,)로 구분하여 연속해서 선언할 수 있습니다.

```javascript
const pear = 1, apple = 2, chestnut;

console.log(pear); // 출력 1
console.log(apple); // 출력 2
console.log(chestnut); // 출력 undefined
```

여기서 값을 할당하지 않을경우 undefined 가 할당 됩니다.
const 와 var 의 주된 차이점 중 하나는 this 키워드가 참조하는 오브젝트의 차이입니다.

```javascript
const pear = 1
var apple = 2

console.log(this.pear) // 출력 1
console.log(this.apple) // 출력 undefined
```

var 키워드로 선언한 변수는 this 가 window 오브젝트를 참조하므로 접근할 수 있지만 const 은 접근 할수 없습니다.

ES6 하위 호환성을 위해 var 키워드를 여전히 사용 가능하지만, ES6 에서 상수선언은 const 사용을 권장합니다.

## 화살표 함수

ES6에서는 **익명함수**를 표현하기 위해 화살표 함수(Arrow function) 표현식을 지원합니다.
기존에는 아래와 같이 함수를 선언 하였습니다.

```javascript
var fruit = function (apple, pear) {
  var cart = apple * pear
  return cart
}

var result = fruit(10, 20)
console.log(result) // 200
```

위와 같은 함수를 ES6 화살표 함수(Arrow function) 을 사용하면 아래와 같이 간결하게 선언할 수 있습니다.

```javascript
let fruit = (apple, pear) => {
  return apple * pear
}

var result = fruit(10, 20)
console.log(result) // 200
```

즉 function 이 생략되고 `=>` 기호가 그 자리에 추가 됩니다. 또한 아래와 같이 구문이 하나밖에 없으면 `{}` 기호를 생략할 수 있습니다.

```javascript
let fruit = (apple, pear) => apple * pear
var result = fruit(10, 20)
console.log(result) // 200
```

`return` 을 생략한 것으로서, `return apple * pear` 와 같습니다. 만약, 화살표 앞에 줄을 분리하면 SyntaxError 가 발생 합니다.

```javascript
let fruit = (apple,pear) = > apple * pear; // SyntaxError
```

파라미터가 하나이면 소괄호 `()`를 제외하고 해당 파라미터만 작성이 가능합니다.

```javascript
let fruit = apple => apple * 20
var result = fruit(10)
console.log(result) // 200
```

파라미터가 없는 경우, 소괄호 `()` 만 작성합니다.

```javascript
let fruit = () => 10 * 20
var result = fruit()
console.log(result) // 200
```

Arrow function은 IE환경에서 아직 제공하지 않습니다.
