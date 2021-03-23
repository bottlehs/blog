---
templateKey: blog-post
title: JavaScript 기본 문법 DOM, BOM
date: 2021-03-20T09:05:14.444Z
description: JavaScript는 웹 브라우저 기반의 객체 위에서 동작합니다. 그래서 DOM 과 BOM에 대해 자세히 알 필요가 있다. DOM 은 Document Object Model 이다. BOM 은 Browser Object Model 이다.
tags:
  - Javascript
  - DOM
  - BOM
  - node
---

![JavaScript 기본 문법 DOM, BOM](/assets/javascript-img.png "JavaScript 기본 문법 DOM, BOM")

JavaScript는 웹 브라우저 기반의 객체 위에서 동작합니다. 그래서 DOM 과 BOM에 대해 자세히 알 필요가 있다.

## BOM

웹 서비스 개발은 브라우저와 밀접한 관련이 있다. 모든 서비스는 사실 웹 브라우저를 바탕으로 실행이 되기 때문이다. 이 브라우저와 관련된 객체들의 집합을 브라우저 객체 모델(BOM: Browser Object Model)이라고 부른다. 이 브라우저 객체 모델(BOM)을 이용해서 Browser와 관련된 기능들을 구성하게된다. DOM은 이 BOM 의 한부분 이다. 브라우저 객체 모델(BOM)의 최상위 객체는 window라는 객체이다. DOM은 이 window 객체의 하위 객체이다

## DOM

DOM은 도큐먼트 객체 모달(DOM: Document Object Model) 이다. Document는 문서이고 Object는 객체로 번역이 된다. 그리고 Model은 말 그데로 모델 이다. 문서 객체 모델로 번역을 할 수 있다.
문서 객체란 <html>이나 <body> 같은 html문서의 태그들을 JavaScript가 이용할 수 있는 객체(object)로 만들면 그것을 문서 객체라고 한다. 여기에 Model을 붙였는데 Model이라는 영어 단어에는 모형, 주형이라는 의미도 있고 모듈이라는 의미도 있다. 비슷하게 여기서는 문서 객체를 '인식하는 방식'이라고 해석할 수 있다. 조금 더 명확하게 DOM을 정의해보면, DOM은 넓은 의미로 웹 브라우저가 HTML 페이지를 인식하는 방식을 의미한다. 조금 좁은 의미로 보면 document 객체와 관련된 객체의 집합을 의미할 수도 있다. 이제 DOM을 보게 되면 웹 브라우저가 html 페이지를 인식하는 방식을 이야기 하거나 문서 객체(document object)와 관련된 객체의 집합에 관한 이야기라는 것을 쉽게 추측할 수 있을것디.

### DOM의 구조

![Document Object Model](/assets/document-object-model-structure.png "Document Object Model")

DOM을 제대로 이해하기 위해서는 tree라는 자료구조를 이해할 필요가 있다. DOM이 tree 형식의 자료구조를 가지고 있기 때문이다. tree의 자료구조를 간단히 설명하면, 이름에서 알 수 있는 것처럼 하나의 root node에서 시작된다. 그런데 나무는 땅에서 솟아서 점점 위로 뻗어나가지만 tree형 자료구조는 흔히 위의 root node에서 아래로 퍼져나가는 형태로 그려진다. tree에서는 위쪽의 node를 부모(parent) 노드 아랫쪽 노드를 자식(child)라고 한다. root node는 가장 위에서 시작되는 node이니까 parent가 없는 node가 된다. 그리고 children(자식)이 없는 node를 leaf node라고 합니다. 뿌리(root)에서 시작해서 잎(leaf)에서 끝난 다고 생각 하면 된다.

![HTML Document Object Model](/assets/document-object-model-html.png "HTML Document Object Model")

위 그림의 왼쪽은 인터넷 브라우저에 표시되는 HTML 페이지 이다. 이는 구문 분석 단계를 거쳐서, 자바스크립트가 다룰 수 있는 HTML DOM으로 변환 시킨다 (위 그림 오른쪽). 이렇게 HTML 페이지와 DOM은 상호작용을 하며 같은 구조를 가지고 있기 때문에, 자바스크립트가 DOM 구조를 변동을 시킴으로써 HTML 페이지를 변동시킬 수 있는 것이다.

### node

tree 구조에서 root 노드를 포함한 모든 개개의 개체를 node라고 표현한다. head, body, title, script, h1, select, button, checkbox 등의 태그뿐 아니라 태그 안의 텍스트나 속성 등도 모두 node에 한다. 이중 HTML 태그를 요소노드(Element Node)라고 부르고 요소 노드 안에 있는 글자를 Text 노드(Text Node)라고 부르기도 한다.

**노드의 종류**

W3C HTML DOM 표준에 따르면, HTML 문서의 모든 것은 노드이다. HTML 문서를 구성하는 대표적인 노드의 종류는 다음과 같다.

| 노드                      | 설명                                                                                                                                    |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 문서 노드(document node)  | HTML 문서 전체를 나타내는 노드                                                                                                          |
| 요소 노드(element node)   | 모든 HTML 요소는 요소 노드이며, 속성 노드를 가질 수 있는 유일한 노드                                                                    |
| 속성 노드(attribute node) | 모든 HTML 요소의 속성은 속성 노드이며, 요소 노드에 관한 정보를 가지고 있으나 해당 요소 노드의 자식 노드(child node)에는 포함되지 않는다 |
| 텍스트 노드(text node)    | HTML 문서의 모든 텍스트는 텍스트 노드                                                                                                   |
| 주석 노드(comment node)   | HTML 문서의 모든 주석은 주석 노드                                                                                                       |

### JavaScript로 문서객체 생성

문서 객체가 생성되는 방식은 두 가지로 나누어 볼 수 있다. 하나는 웹 브라우저가 HTML 페이지에 적혀 있는 태그를 읽으면 생성하는 것이다. 이런 과정을 정적으로 문서 객체를 생성한다고 말한다. 단순히 적혀져 있는 그대로 문서객체가 생성되는 것을 표현한 것이다.

반대로 원래 HTML 페이지에 없던 문서객체를 JavaScript를 이용해서 생성할 수 있다. 이런 과정을 동적으로 문서객체를 생성한다고 한다. 따라서 JavaScript로 문서객체를 생성한다는 것은 처음에는 HTML 페이지에 없던 문서객체를 동적으로 생성하는 것이 된다.

```javascript
let element = document.createElement(tagName[, options]);
```

### DOM 사용법

아래의 코드는 JavaScript를 사용해서 동적으로 문서객체를 생성하는 예이다.

```javascript
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title> Document Object Model (DOM)</title >
</head>
<body>
   <h1 id ="h1_tag_1" name= "" >h1 coffee 1</h1 >
   <div >
      <h1 id = "h1_tag_2">h1 coffee 2</h1 >
   </div >
   <hr >
   <h1 id = "h1_tag_3">h1 coffee 3</h1>
</body>
</html>
```

JavaScirpt를 통해서 동적으로 문서객체를 생성해보자.

```javascript
var h1 = document.createElement("h1")
```

우선 document 객체에 접근해서 `<h1>` 태그를 생성한다.

```javascript
var textNode = document.createTextNode("Hello World - DOM")
```

document 객체에 접근해서 TextNode를 생성하고 'Hello World - DOM'이라는 문자열을 넣어준다.

```javascript
h1.appendChild(textNode)
```

위에서 생성한 `<h1>` 태그에 자식노드를 추가한다.

```javascript
document.body.appendChild(h1)
```

이제 document객체를 통해서 body 객체에 접근하여 body객체에 자식 노드를 추가 한다.

**완성 코드**

```javascript
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title> Document Object Model (DOM)</title >
<script type= "text/javascript">
var h1 = document.createElement("h1")
var textNode = document.createTextNode("Hello World - DOM")
h1.appendChild(textNode)
document.body.appendChild(h1)
</script>
</head>
<body>
</body>
</html>
```

**실행 결과**

```javascript
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title> Document Object Model (DOM)</title >
</head>
<body>
  <h1>Hello World - DOM</h1>
</body>
</html>
```
