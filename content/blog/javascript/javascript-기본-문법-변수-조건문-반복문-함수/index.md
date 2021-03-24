---
templateKey: blog-post
title: JavaScript 기본 문법 변수,조건문,반복문,함수
date: 2021-03-21T09:06:14.444Z
description: 자바스크립트에는 적연 변수와 지역 변수가 있고 연산자는 산술, 증감, 비트, 시프트, 대입, 비교, 논리, 조건 등이 있다. 마지막으로 조건문는 if - else, switch 등이 있다. 자바스크립트 연산자는 산술, 증감, 비트, 시프트, 대입, 비교, 논리, 조건 등이 있다.
tags:
  - Javascript
  - 변수
  - 조건문
  - 반복문
  - 함수
---

![JavaScript 기본 문법 변수,조건문,반복문,함수](/assets/javascript-img.png "JavaScript 기본 문법 변수,조건문,반복문,함수")

## 식별자

변수, 리터럴(상수), 함수 등의 이름이다.
이러한 식별자를 만들때는 규칙이 있는데 다음과 같다.

1. 숫자로 시작할수 없다.
2. 예약어 (if, True , False)등은 사용 불가하다.
3. 대문자 소문자를 구분합니다. ( Coffee는 coffee와 다른 식별자이다)

## 데이터 타입

자바스크립트에는 적연 변수와 지역 변수가 있고 연산자는 산술, 증감, 비트, 시프트, 대입, 비교, 논리, 조건 등이 있다. 마지막으로 조건문는 if - else, switch 등이 있다.

### 타입

- 수 (Number)
- 문자열 (String)
- 부울,불린 (Boolean)
- 객체 (Object) 함수 (Function) 배열 (Array) 날짜 (Date) 정규식 (RegExp)
- 널 (Null)
- 정의되지않음 (Undefined)

### 변수 선언

```javascript
var coffee = "coffee" // var를 이용하여 선언, 문자열 (String)
var americano, espresso // 여러가지를 동시 선언, 정의되지않음 (Undefined)
cart = 10 // var 없이 선언, 수 (Number)

console.log(coffee) // coffee
console.log(cart) // undefined
console.log(americano) // 10
```

coffee = "americano" ; // 데이터타입이 따로 없으므로 문자열 (String)도 저장가능.

var를 이용하여 선언해도 되고, 여러개의 변수를 동시에 선언해도 된다. 단 값을 초기화해주지 않으면 undefined라는 값으로 초기화된다.

### 지역변수와 전역변수

```javascript
var cart // 함수 밖에 선언하면 전역변수.
function coffee() {
  var americano = 0 // 함수 내부 에서 var 키워드를 사용하여 선언하면 지역변수.
  espresso = 1 // 한수 내부 에서 var 키워드를 사용하지 않았으므로 전역변수.
  cart = 3 + 1 //전역변수.
  console.log(americano) // 0
}

console.log(cart) // 4
console.log(espresso) // 1
console.log(americano) // undefined
```

함수 내에서 var 키워드를 사용하여 선언할때만 지역변수

### this

```javascript
var coffee = 100 // 전역변수 score

function coffee_sum() {
  var coffee = 90 //지역변수 score
  console.log(coffee) // 90
  coffee = 80 //  그냥 score를 사용하면 지역변수
  console.log(coffee) // 80
  this.coffee = 70 // this를 붙여주면 전역변수 score
  console.log(this.coffee) // 70
}

coffee_sum()
console.log(coffee) // 70
console.log(coffee) // undefined
```

coffee라는 같은 이름의 전역변수, 지역변수가 있을때는 this라는 키워드로 구분하여 사용 가능하다.
함수 내에서 this.coffee 를 사용하면 전역변수 coffee를, this 없이 coffee라고 하면 지역변수를 나타낸다.

### document.write()

자바스크립트의 print문 같은 느낌입니다. 입력한 내용이 html문서에 출력됩니다.

```javascript
document.write("coffee" + "americano" + "</ br>" + "espresso") // coffeeamericanoespresso
```

여러개를 출력할때는 콤마(,)가 아닌+ 연산자를 사용한다.

줄바꿈은 html태그 <br>을 삽입하여 하면 된다.

## 연산자

자바스크립트 연산자는 산술, 증감, 비트, 시프트, 대입, 비교, 논리, 조건 등이 있다.

| 연산   | 연산자         |
| ------ | -------------- |
| 산술   | + - \_ / %     |
| 증감   | ++ --          |
| 비트   | &              | ^ ~ |
| 시프트 | >> << >>>      |
| 대입   | = \_= /= += -= |
| 비교   | > >= <= == !=  |
| 논리   | &&             |  | ! |
| 조건   | ? :            |

```
* 나누기의 결과는 실수값으로 반환된다.
* 증감연사는 변수의 앞에 붙을때와 뒤에 붙을때가 다르다. ex) x++    , ++x
* 조건연산은 다음과 같은 구조를 가진다. ex) 조건문 ? (True일때의 반환값) : (False일때의 반환값)
```

### 조건연산

```javascript
var americano = 8
coffee = americano == 8 ? true : false // 조건문 ? (True일때의 반환값) : (False일때의 반환값)

console.log(coffee) // true
```

### 비교연산

```javascript
var americano = 10
var espresso = 11

console.log(americano < espresso) // true

espresso = 9

console.log(americano < espresso) // false
```

## 조건문

자바스크립트 조건문는 if - else, switch 등이 있다.

### if - else

```javascript
if (조건식) {
  실행문
} else if (조건식) {
  실행문
} else {
  실행문
}
```

### switch

```javascript
switch (식) {
  case 값: // 값에는 변수, 또는 연산자가 들어갈 수 없다. 리터럴(상수)만 가능
    실행문
    break
  case 값2:
    실행문
    break
  default:
    실행문
}
```

default는 else와 같이 case에 일치하는 항목이 없을때 실행된다. (default는 생략 가능하다)

## 반복문

자바스크립트 조건문는 for, while, do - while 등이 있다. 조건식이 참인 동안 반복하여 실행된다.

### for 문

```javascript
for (초기화문; 조건식; 증감식) {
  작업문
}
```

점점 커지는 '⭐'출력하기

```javascript
<!DOCTYPE html>
<body>
<script>
    for (var size = 10; size < 30;size +=5){
        document.write("<div style='font-size:"+size+"px'>"+"⭐"+"</div>")
    }

    // <div style='font-size:10px'>⭐</div>
    // <div style='font-size:15px'>⭐</div>
    // <div style='font-size:20px'>⭐</div>
    // <div style='font-size:25px'>⭐</div>
    // <div style='font-size:30px'>⭐</div>
</script>
</body>
</html>
```

### while 문

조건식이 참인 동안 반복하여 while 문을 실행합니다.

```javascript
while (조건식) {
  작업문
}
```

while 예제 : 0부터 사용자가 입력한 n까지의 합 구하기.

```javascript
<!DOCTYPE html>
<body>
<script>
    var n  = prompt("0부터 n까지의 합을 구합니다. n을 입력해주세요","")
    n = parseInt(n);
    var i =0, sum=0;
    while(i<n){
        ++i
        sum += i
    }
    document.write("n까지의 합은 : ",sum)
</script>
</body>
</html>
```

### do - while문

while은 조건이 성립하지 않으면 작업문이 실행되지 않는다. 그러나 do-while문은 최소 1번 작업문이 실행된다. while 과 다르게 실행후 조건을 체크 하기 때문.

```javascript
do {
  작업문
} while (조건식)
```

## 함수 (function)

데이터를 전달받아, 일정한 작업을 수행 후 결과를 되돌려준다. 되돌려주는 결과는 리턴이라고 하며, 리턴이 없는 함수도 있다.

```javascript
function 함수이름(매개변수){
  함수 식
  리턴
}

ex)
function coffee(americano, espresso) {
  var sum = (americano * 2000) + (espresso * 2500)
  return sum;
}

var sum = coffee(1, 2);
console.log(sum) // 7000
```
