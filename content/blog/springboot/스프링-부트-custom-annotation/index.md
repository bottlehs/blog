---
templateKey: blog-post
title: 스프링 부트 Custom Annotation(커스텀 어노테이션), GET 요청 ~ JSON 응답
date: 2021-03-16T20:29:29.537Z
description: 프로그램에 관한 데이터를 제공하거나 코드에 정보를 추가할 때 사용하는 것을 어노테이션이라고 한다. 대표적인 어노테이션으로는 @Controller, @SpringBootApplication등이 있다. 하지만 위 예시 어노테이션들은 이미 만들어진 어노테이션들이고, 직접 커스텀해서 어노테이션을 만들 수 있는데, 이것을 커스텀 어노테이션이라고 한다.
tags:
  - 스프링
  - 스프링부트
  - Spring
  - SpringBoot
  - Java
  - 프레임워크
  - Custom Annotation
  - REST API
---

![스프링 부트 Custom Annotation(커스텀 어노테이션), GET 요청 ~ JSON 응답](/assets/springboot.png "스프링 부트 Custom Annotation(커스텀 어노테이션), GET 요청 ~ JSON 응답")

## Custom Annotation

프로그램에 관한 데이터를 제공하거나 코드에 정보를 추가할 때 사용하는 것을 어노테이션이라고 한다. 대표적인 어노테이션으로는 @Controller, @SpringBootApplication등이 있다. 하지만 위 예시 어노테이션들은 이미 만들어진 어노테이션들이고, 직접 커스텀해서 어노테이션을 만들 수 있는데, 이것을 커스텀 어노테이션이라고 한다.

### Custom Annotation 만들기

```java
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface LogExclusion {
  ...
}
```

@interface를 추가하여 어노테이션으로 만들수 있다.

**@Target**

어노테이션이 생성될 수 있는 위치를 지정하는 어노테이션이다.

| 이름            | 설명                                   |
| --------------- | -------------------------------------- |
| PACKAGE         | 패키지 선언 시                         |
| TYPE            | 타입(클래스, 인터페이스, enum) 선언 시 |
| CONSTUCTOR      | 생성자 선언 시                         |
| FIELD           | enum 상수를 포함한 멤버변수 선언 시    |
| METHOD          | 메소드 선언시                          |
| ANNOTATION_TYPE | 어노테이션 타입 선언 시                |
| LOCAL_VARIABLE  | 지역변수 선언 시                       |
| PARAMETER       | 파라미터 선언 시                       |
| TYPE_PARAMETER  | 파라미터 타입 선언 시                  |

**@Retention**

어노테이션이 언제까지 유효할지 정하는 어노테이션입니다.

| 이름    | 설명                             |
| ------- | -------------------------------- |
| RUNTIME | 컴파일 이후에도 참조 가능        |
| CLASS   | 클래스를 참조할 때 까지 유효     |
| SOURCE  | 컴파일 이후 어노테이션 정보 소멸 |

### Custom Annotation REST API Test

```java
// CoffeeController.java

@RestController
public class CoffeeController {
  ...
  @ResponseBody
  @GetMapping("/americano")
  public void americano(){
    Coffee coffee = new Coffee();
    coffee.setTitle("americano");

    return coffee
  }

  @ResponseBody
  @GetMapping("/espresso")
  public void espresso(){
    Coffee coffee = new Coffee();
    coffee.setTitle("espresso");

    return coffee
  }

  @ResponseBody
  @GetMapping("/")
  public void findAll(){
    Coffee coffee = new Coffee();
    coffee.setTitle("americano, espresso");

    return coffee;
  }
}
```

**Request**

```
GET : http://api.domain.com/coffee/americano // {"americano"}
GET : http://api.domain.com/coffee/espresso // {"espresso"}
GET : http://api.domain.com/coffee/espresso // {"americano, espresso"}
```
