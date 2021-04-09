---
templateKey: blog-post
title: 스프링 부트 MessageSource를 활용한 Exception 처리
date: 2021-04-08T21:59:29.537Z
description: ApplicationContext는 다양한 기능을 상속하고 있다, 그중 MessageSource는 다국어 처리를 할 때 사용되는 객체이다. 스프링 부트를 사용한다면 별다른 설정 필요없이 messages.properties 로 정의하면 된다.
tags:
  - 스프링
  - 스프링부트
  - Spring
  - SpringBoot
  - Java
  - 프레임워크
  - 스프링부트구조
  - 아키텍쳐
  - MessageSource
---

![스프링 부트 MessageSource를 활용한 Exception 처리](/assets/springboot.png "스프링 부트 MessageSource를 활용한 Exception 처리")

## MessageSource란

ApplicationContext는 다양한 기능을 상속하고 있다, 그중 MessageSource는 다국어 처리를 할 때 사용되는 객체이다. 간단한 예제로 MessageSource의 사용 방법을 알아보도록 하자

스프링 부트를 사용한다면 별다른 설정 필요없이 messages.properties 로 정의하면 된다.
resources 폴더에 다음과 같이 messages.properties, messages_ko_KR.properties, messages_en_US.properties 를 생성합니다.
messages.properties 는 기본 properties 이다.

![스프링 부트 MessageSource](/assets/springboot-message-source.png "스프링 부트 MessageSource")

messages_ko_KR.properties

```
hello=안녕
```

messages_en_US.properties

```
hello=hello
```

아래 처럼 넘어온 argument 를 바인딩 할수도 있다.

```
hello=hello {0} // hello human
```

메세지를 출력하기 위해 MessageSource를 AppRunner에 주입하고 messageSource의 getMessage를 호출할 때 서로 다른 Locale을 넣어 준다.

```java
@Component
public class AppRunner implements ApplicationRunner {

    @Autowired
    MessageSource messageSource;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        System.out.println(messageSource.getMessage("greeting", new String[]{"riverandeye"}, Locale.KOREAN));
        System.out.println(messageSource.getMessage("greeting", new String[]{"riverandeye"}, Locale.US));
        System.out.println(Locale.getDefault());
    }
}
```
