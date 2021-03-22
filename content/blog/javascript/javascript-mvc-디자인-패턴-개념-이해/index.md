---
templateKey: blog-post
title: JavaScript MVC 디자인 패턴 개념 이해
date: 2021-03-20T09:01:14.444Z
description: 사용자는 애플리케이션과 상호작용한다. 컨트롤러의 이벤트 헨들러가 작동된다. 컨트롤러는 모델로부터 데이터를 요구하고, 그 결과를 뷰로 전달한다. 뷰는 데이터를 사용자에게 보여준다.
tags:
  - Javascript
  - MVC
  - 디자인 패턴
---

![JavaScript MVC 디자인 패턴 개념 이해](/assets/javascript-img.png "JavaScript MVC 디자인 패턴 개념 이해")

## MVC란

1. 사용자는 애플리케이션과 상호작용한다.
2. 컨트롤러의 이벤트 헨들러가 작동된다.
3. 컨트롤러는 모델로부터 데이터를 요구하고, 그 결과를 뷰로 전달한다.
4. 뷰는 데이터를 사용자에게 보여준다.

### JavaScript MVC Architecture

![JavaScript MVC Architecture](/assets/javaScript-mvc-architecture.png "JavaScript MVC Architecture")

### Model

모델은 도메인 레이어의 또 다른 이름이다. 도메인 로직은 가공되지 않은 데이터에 의미를 부여한다. 컴포넌트의 데이터는 단순히 리스트의 아이템이다. 하나의 특별한 아이템은 선택될 수 있으며 삭제 될 수 있다. 그렇기 때문에 컴포넌트의 모델은 매우 간단하다. 이것은 배열과 선택된 인덱스 아이템으로 이루어져 있다. 모델은 뷰와 컨트롤러에 대해 알고 있으면 안된다. 모델이 가지고 있어야 하는 것은 데이터 값과 데이터와 직접적으로 관련된 로직뿐이다. 어떠한 이벤트 헨들러, 뷰 템플릿과 로직도 혀용되지 않는다. 컨트롤러가 서버로부터 데이터를 불러와서 새로운것을 생성할 때, 이 모든것이 모델 인스턴스에서 마무리 된다. 그렇기 때문에 우리가 가지고 있는 데이터는 객체지향이며 모델 안에 있는 어떠한 함수나 로직도 불러올 수 있어야 한다. 아래 코드로 보자.

```javascript
var user = users["foo"]
destroyUser(user)
var user = User.find("foo")
user.destory()
```

첫번째 예시는, 어떠한 네임스페이와 객체지향이 아니다. 그렇기 때문에 다른 destroyUser() 함수를 호출할 경우 충돌이 일어난다. 하지만, 두번째 예제에서는 destory()함수는 User 인스턴스에 네임스페이스 되었다.

### View

인터렉션을 위해 모델을 적합한 형태로 랜더링 한다. 유저 인터페이스 부분이다. MVC는 주로 웹 어플리케이션에서 나타낸다. 뷰는 HTML 페이지이다. 그리고 페이지에서 다이나믹 데이터를 수집한다. 뷰는 어떠한 로직도 가지고 있으면 안되며 컨트롤러와 모델을 알아선 안된다.

### Controller

이벤트에 반응한다. 일반적으로 사용자의 행동이다. 아마도, 모델에 변화를 가하며 뷰에 영향을 끼친다. 페이지가 로드되었을 때, 컨트롤러는 이벤트 리스너를 뷰에 추가한다. 사용자가 어떠한 행동을 했을 때, 컨트롤러 안에 있는 이벤트 트리거가 실행된다. 이것을 위하여 딱히, 특별한 라이브러리나 프레임워크가 필요하지는 않다. 간단한 예를 아래 코드로 보자.

```javascript
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>JavaScript MVC Controller</title>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>
</head>
<body>
  <div id="view">
    <button type="button" class="americano">americano</button>
  </div>
  <script type="text/javascript">
  var Controller = {};
  (Controller.coffees = function($){
    var americanoClick = function(){
      console.log("show")
    };

    $(function(){
      $("#view .americano").click(americanoClick);
    });

})(jQuery);
</script>

</body>
</html>
```

위의 예시는, Controller 변수에 coffees Controller를 네임스페이스 해놓았다. 그다음 익명함수를 사용해 스코프를 인켑슐화 했다. 페이지를 로드했을때 뷰 엘리먼트에 클릭 이벤트 리스너를 추가한다.

### 함수를 클래스에 추가하기

클래스에 함수를 추가하는 방법으로는 아래와 같은 방법이 있다. 두번째줄은 똑같은 방식이지만 좀더 간략하게 치환해서 표현한 방법이다.

```javascript
Person.prototype.breath = function () {}
var person = new Person()
person.breath()
Person.fn = Person.prototype
Person.fn.run = function () {}
```

### Observer

객체 사이에 일대 다수의 의존성을 정의해 준다. 하나의 객체의 상태값이 변했을때, 모든 devepndents는 이것을 인지하고 자동으로 업데이트 한다. 자바스크립트와 같이 이벤트 위주의 프로그래밍에서는 매우 중요하다. 이벤트 핸들러는 어떤한 이벤트가 발생할 경우 감지를 하는 함수다. 선택적으로 이벤트 인자를 받는다. 이벤트와 이벤트 핸들러는 옵저버 디자인 패턴에서 중요한 개념이다. 옵저버 패턴의 다른 이름으로는 Pub/Sub(Publication/Subscription) 이다. 어떠한 대상 (subject)이 있을경우 옵저버는 이를 감지하여 subscribe를 동작한다. 여기서 subject는 옵저버를 관리하는 리스트이다. 다양한 수의 옵저버 객체들이 subject를 관찰한다. 옵저버 객체가 subscribe,or unsubscribe할 수 있도록 인터페이스를 심어준다. 상태가 변하였을 때 notification을 전달한다.

**Constructors with prototypes pattern (생성자 패턴)**

MVC모델에 접근하기 전에 자바스크립트 패턴에 대해 알아보자. 생성자 패턴은 자바스크립트의 함수를 이용해서 클래스를 만드는 것을 뜻한다. 이렇게 만들어진 클래스는 나중에 재사용이 가능하며 프로토타입을 사용하면 사용할때마다 여러 함수를 만들지 않고 하나의 함수를 공유할 수 있게 한다.

**The module pattern (모듈 패턴)**

기본적으로 모듈패턴은 객체 리터럴 방법으로 생성한다. 이때는 생성자 처럼 new가 필요하지 않다. 예로, coffeeModule에 값을 추가하고 싶은경우 coffeeModule.property = "americano";를 사용하면 된다. 이렇게 생성된 리터럴 함수 내부에는 프로퍼티, 메소드, 또는 다른 객체를 추가할 수 있다.

**Singleton pattern(싱글톤 패턴)**

싱글톤 패턴은 클래스의 인스턴스를 오직 하나만 유지한다. 동일 클래스로 여러개의 객체를 생성해도 최초 생성된 객체 하나만을 얻게 된다. 쉽게 말해, 한 회사에서 열명의 회사원들이 하나의 복사기를 사용하는 거와 같다. 특징으로는, 객체 자체에는 접근이 불가능하며, 객체에 대한 접근자를 사용해서 실제 객체를 제어할 수 있다. 객체는 단 하나만 만들어지며, 해당 객체를 공유한다. 최초 인스턴스의 참조 this를 생성자가 캐시한 후 다음번 생성자 호출때 캐시된 인스턴스를 반환한다. 최초 인스턴스 저장을 위해 전역 변수를 사용하거나 생성자의 static 프로퍼티에 인스턴스를 저장 할 수 있다. 클로저를 이용해 인스턴스를 감싸 외부에서 수정할 수 없게도 가능하다.

![Singleton pattern(싱글톤 패턴)](/assets/singleton-prototypes.png "Singleton pattern(싱글톤 패턴)")

싱글톤 패턴을 코드로 실습해 보는건 다음에 하도록 한다.
