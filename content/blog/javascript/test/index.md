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

## 클래스

기존에는 객체지향을 구현하려고 할 때 function을 사용하여 구현 했습니다. ES6에서는 class 키워드를 사용하여 객체지향을 구현 할수 있습니다.

기존에는 아래와 같이 객체지향을 구현 했습니다. new 키워드를 붙여 호출하면, 생성자로 동작하여 객체를 생성한 후, 이를 반환 합니다.

```javascript
function Fruit(name) {
  this.name = name
}

Fruit.prototype.getName = function () {
  return this.name
}

var apple = new Fruit("apple")
console.log(apple.getName()) // apple
```

ES6 클래스는 생성자와 상속을 더욱 간단하고 명확한 구문으로 다룰 수 있게 합니다. 여기서 클래스 자신도 함수이며, 생성자를 가지고 함수를 생성하는 새로운 구문이다. 아래는 클래스를 사용한 예시입니다.

```javascript
class Fruit {
  constructor(name) {
    this.name = name
    this.type = "apple"
  }

  getName() {
    return this.name
  }
}

let fruit = new Fruit("apple")
console.log(fruit.getName()) // apple
console.log(typeof Fruit)
```

class 키워드를 앞에 붙여 선언합니다. 생성자 함수는 constructor로 정의하고, 속성과 멤버 변수를 설정할 수 있습니다.

객체지향의 특징 중의 하나인 상속도 아래와 같이 구현할수 있습니다.

```javascript
class Apple extends Fruit {
  constuctor(name) {
    super(name)
    this.type = "apple"
  }
}

let apple = new Apple("been")
console.log(apple instanceof Fruit) // true
console.log(apple.getName()) // been
```

extends 키워드를 활용해 Fruit 클래스로부터 상속을 받습니다. 또한, 다른 객체지향 언어와 마찬가지와 부모 클래스 생성자를 호출하려면 super 키워드를 이용해 호출합니다. Apple는 Fruit의 서브 클래스이므로 Fruit의 인스턴스로 확인되는 것을 확인할수 있습니다.

또한, static 키워드를 활용하면, 정적 메서드를 구현할 수 있습니다. 클래스의 생성자를 만들 필요 없이 바로 정적 메서드 이름으로 함수를 호출할 수 있습니다.

```javascript
class Fruit {
  static getName() {
    return "Fruit"
  }
}

console.log(Fruit.getName()) // Fruit
```

## 템플릿 문자열

템플릿 문자열(Template String)은 문자열을 생성하는 새롭게 도입된 리터럴이다. 문자열을 설정하기 위해 따옴표(`)를 사용한다. 기존에는 변수를 문자열 안에 삽입하기 위해 따옴표 사이에 그 변수를 넣어 합치는 작업이 필요했는데, 템플릿 문자열을 이용하면 이를 간단하게 만들 수 있다.

**기존**

```javascript
var a = 10
var b = 20
var str = a + " 더하기" + b + "은" + (a + b) + "이다"
console.log(str) // 10 더하기 20은 30이다
```

변수를 `$[표현식]` 형태로 역따옴표 안에 넣을 수 있고, 이는 함수로 전달되어 일반 문자열로 치환된다.

**템플릿 문자열**

```javascript
let a = 10
let b = 20
let str = `${a} 더하기 ${b}은 ${a + b} 이다`
console.log(str) // 10 더하기 20은 30이다
```

그리고 여러 줄에 걸친 텍스트를 표현하는데도 템플릿 문자열을 활용합니다. ES5에서는 개행문자인 `\n`으로 줄바꿈을 했었다면, 템플릿 문자열은 이를 직관적으로 바꿔줍니다.

```javascript
console.log(`a
b
c`)

// 출력
a
b
c
```

## 디스럭처링

디스트럭처링(Destructuring)은 Object 객체를 개별 변수에 할당하는 것을 말한다. 이를 이용하면, JSON 형태의 객체를 쉽게 매핑하여 변수에 할당할 수 있고, 반환값도 여러 개를 설정할 수 있습니다.

```javascript
let arr = [10, 20, 30, 40, 50]
let [a, b, c, d, e] = arr
```

위와 같은 형태로 변수를 차례로 할당됩니다. 만약, 할달한 값이 없으면, undefined가 설정됩니다

```javascript
let arr = [10, 20, 30]
let [a, b, c, d, e] = arr // 10,20,30 undefined
```

아래와 같이 값을 건너 뛸 수도 있습니다.

```javascript
let [a, , c] = [10, 20, 30]
console.log(a, c) // 1 3
```

object의 경우, 아래와 같은 형태로 대입할 수 있습니다. 오른쪽이 오브젝트이면, 왼쪽도 오브젝트여야 합니다. name, job 은 각각의 값을 할당하게 됩니다. 해당하는 키가 없으면, 초기값인 undefined가 유지됩니다.

```javascript
const obj = {
   name: "name"
   job: "Software Engineer"
}
let {name, job} = obj;
console.log(name, job); // "name","Software Engineer"
```

또한, 다음과 같이 기본값을 설정할 수 있습니다.

```javascript
let arr = [10, 20, 30]
let [a = 40, c = 50, b] = arr // a = 40, c = 50, b = 30
```

## 함수 인자 기능

ES6부터 가변 인자를 표현할 `...` 키워드가 추가 되었습니다. 기존에는 배열 값을 함수 임자로 넘기려면 `fruit()` 내장 메서드나 `argments` 를 통해 변수를 받아서, 이를 Array.prorotype.slice() 함수로 잘라내야 했지만 `...` 키워드를 이용하면 여러 개의 인자를 넘길 수 있습니다. 이는 Spread 연산자라고 합니다.

```javascript
function fruit(apple, pear) {
  return apple + pear
}
const data = [10, 20]
const result = fruit(...data)
console.log(result) // 30
```

위와 같이 배열에 있는 요소를 자동으로 인자로 치환하여 fruit 함수를 호출합니다. 또한, 아래와 같이 Spread 연산자를 활용하여 배열을 작성할 수 있습니다.

```javascript
const fruit1 = [10, 20]
const fruit2 = [30, 40]
const result = [0, ...fruit1, ...fruit2, 50]

console.log(result) // [0,10,20,30,40,50]
console.log(result.length) // 6
```

문자열을 각 문자로 배열을 만들기 위하여 Spread 연산자를 활용할 수 있습니다.

```javascript
const result = [..."abcde"]
console.log(result) // ["a","b","c","d","e"]
```

나머지(Rest) 연산자는 함수의 마지막 파라미터에 "..." 를 붙이는데, 아래와 같이 사용할 수 있습니다.

```javascript
function fruit(apple, pear, ...arr) {
  console.log(arr) // 30,40,50;
}
fruit(10, 20, 30, 40, 50)
```

## Iterator & for-of

기존 자바스크립트에서는 for, for..in 루프만 사용할 수 있었는데, for..of는 iterator 형태로 순환할 수 있는 기능을 제공합니다.

iterator는 어떤 데이터 집합을 순서대로 접근할 때 사용됩니다. for..of 는 Symbol.iterator를 호출 하는데 배열과 문자열은 이 속성을 제공하고 있습니다. 즉, 배열을 순서대로 순회하며, 문자열은 문자를 하나씩 접근하게 됩니다. 또한, 사용자 정의 iterator을 커스텀 객체에 만들 수도 있습니다.

```javascript
let fruit = [10, 20, 30, 40, 50]

for (let value of fruit) {
  console.log(value)
}

// 출력 결과
10
20
30
40
50
```

```javascript
for (let char of "fruit") {
  console.log(char)
}

// 출력 결과
"c"("o")("f")("f")("e")("e")
```

DOM에 접근하여 반복된 리스트를 가져오는데 유용합니다.

```html
<ul>
  <li>apple</li>
  <li>pear</li>
</ul>
```

```javascript
let nodes = document.querySelectorAll("li")
for (let node of codes) {
  console.log(node.textContent)
}

// 출력 결과
apple
pear
```

`document.querySelectorAll("li")`는 `li` 엘리먼트를 모두 찾아 노드에 설정하는 것이고, 이러한 노드 리스트는 iterator 형태로 순환이 가능하기에 for..of 루프를 활용할 수 있습니다.

한편, 오브젝트의 경우, iterator 형태로 순환할 수 없지만, Object keys 메서드를 활용해 이를 구현합니다.

```javascript
const fruit = {
   apple: "사과",
   pear: "배"
}

const keys = Object.keys(fruit)
for (let key of keys) {
   console.log(key, fruit[key])
}

// 출력 결과
apple 사과
pear 배
```

Object.keys를 활용하면 오브젝트에서 프로퍼티 키를 배열로 반환하게 됩니다. 이 배열은 iterator 형태로 순환이 가능하기 for..of 루프를 통해 해당 프로퍼티 값을 구합니다.

## Map & Set

Map과 Set은 Java와 같은 다른 프로그래밍 언어에서도 자주 사용하는 데이터 구조입니다. Map은 키와 값으로 이루어진 데이터 구조이고, Set은 중복 없는 키-값으로 이루어집니다. 기존 자바스크립트에서는 배열과 객체로 해당 기능을 구현할 수 있었지만, 입력값의 목록이나 특정값 찾기를 수행하기 위해서는 별도의 과정이 필요합니다.

Map과 Set을 이용하면, 이 과정을 단순화할 수 있습니다.

```javascript
let map = new Map()

for (let [key, val] of map.entries()) {
  console.log(key + " : " + val)
}

let set = new Set()
set.add("a").add("b").add("c")

if (set.has("a")) {
  for (let key of set.values()) {
    console.log(key)
  }
}
```

이 밖에도 WeakMap 과 WeakSet이 있는데, 이는 Map과 Set이 비슷하게 작동하지만, 다른곳에서 해당 변수에 대한 참조가 없어진다면, 자동으로 Map과 Set에 있는 데이터를 삭제하는 것에 차이점이 있습니다.

메모리에 있는 객체 참조 퍼런스가 없어지면, 자바스크립트의 가비지 컬렉터가 해당 객체를 해제하게 됩니다. WeakMap과 WeakSet은 이러한 레퍼런스에 추가하지 않아 메모리가 해제되는 경우, 데이터 구조에서도 같이 삭제하게 됩니다. 즉, 메모리 누수에 영향을 받지 않고 이용할 수 있습니다.
