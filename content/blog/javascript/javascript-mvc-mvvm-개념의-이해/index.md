---
templateKey: blog-post
title: JavaScript MVC vs MVVM 개념의 이해
date: 2021-03-20T09:03:14.444Z
category: javascript
description: MVC 모델이 가지고 있는 정보를 따로 저장해서는 안된다. 모델이나 컨트롤러와 같이 다른 구성 요소를 몰라야한다. 변경이 일어나면 변경 통지에 대한 처리 방법을 구현해야한다. 뷰는 사용자에게 데이타를 출력하고 표현하는 영역이다. 즉, 사용자가 눈으로 확인할 수 있는 UI 화면이다. 컨트롤러는 컨트롤러는 모델과 뷰의 중개자로써 사용자의 입력을 받고 처리하는 부분이다.
tags:
  - Javascript
  - MVC
  - MVVM
  - 디자인 패턴
---

![JavaScript MVC vs MVVM 개념의 이해](/assets/javascript-img.png "JavaScript MVC vs MVVM 개념의 이해")

## MVC

Mode View Contorller의 약자로 어플리케이션을 모델, 뷰, 컨트롤러 세 부분으로 나누어 역할을 구분한 것이다.

![JavaScript MVC](/assets/javascript-mvc.png "JavaScript MVC")

사용자가 웹에 어떠한 요청을 보냈을 때, 발생하는 동작을 기준으로 설명 하면 아래와 같다.

1. 사용자가 www.naver.com을 주소창에 입력한다. (uses)
2. Contorller는 사용자가 요청한 웹페이지를 서비스 하기 위해 Model에게 요청을 전달한다. (Manipulates)
3. Model은 데이터베이스나 파일 등과 같은 데이터 소스를 제어한 후에 사용자 요청에 대한 결과를 Contorller에게 전달한다.
4. Contorller는 Model로 부터 전달받은 결과를 View에 반영한다. (Updates)
5. 사용자는 View를 통하여 요청한 내용에 대한 응답값을 확인할 수 있다. (sees)

MVC를 지원하는 자바스크립트 프레임워크로는 Backbone.js, AngularJS, Ember 등이 있다.

### 모델(Model)

애플리케이션에서 사용되는 실제 데이터 및 데이터 조작 로직을 처리하는 부분이다. 예를 들어 데이타를 가져오거나 업데이트하는 행위 및 유효성 검사 등을 하는 로직이 포함된다.

**모델의 규칙**

1. 사용자가 편집하기를 원하는 모든 데이터를 가지고 있어야한다.
2. 뷰나 컨트롤러에 대한 어떠한 정보를 알고 있지 않아야한다.
3. 변경이 일어나면 변경 통지에 대한 처리 방법을 구현해야한다.

### 뷰(View)

사용자에게 데이타를 출력하고 표현하는 영역이다. 즉, 사용자가 눈으로 확인할 수 있는 UI 화면이다.

**뷰의 규칙**

1. 모델이 가지고 있는 정보를 따로 저장해서는 안된다.
2. 모델이나 컨트롤러와 같이 다른 구성 요소를 몰라야한다.
3. 변경이 일어나면 변경 통지에 대한 처리 방법을 구현해야한다.

### 컨트롤러(Contorller)

컨트롤러는 모델과 뷰의 중개자로써 사용자의 입력을 받고 처리하는 부분이다.

**컨트롤러의 규칙**

1. 모델과 뷰에 대하여 알고 있어야한다.
2. 모델이나 뷰의 변경을 모니터링해야한다.

## MVVM

**M**ode **V**iew **V**iew**M**odel의 약자로 WPF 또는 SilverLight에서 많이 사용되고 있는 프레임워크 패턴이다.

![JavaScript MVC](/assets/javascript-mvvm.png "JavaScript MVC")

Model과 View는 기존의 MVC 패턴과 같지만, ViewModel이 존재한다.

**ViewModel**
View를 표현하기 위해 만들어진 View를 위한 Model로써, View의 추상화 기능이다. ViewModel은 모델의 데이터와 뷰의 데이터 변화를 관리한다.
