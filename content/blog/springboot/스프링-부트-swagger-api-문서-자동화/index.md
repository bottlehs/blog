---
templateKey: blog-post
title: 스프링 부트 Swagger API 문서 자동화
date: 2021-04-01T23:39:29.537Z
category: springboot
description: Swagger는 개발자가 REST 웹 서비스를 설계, 빌드, 문서화, 소비하는 일을 도와주는 대형 도구 생태계의 지원을 받는 오픈 소스 소프트웨어 프레임워크이다. 대부분의 사용자들은 스웨거 UI 도구를 통해 스웨거를 식별하며 스웨거 툴셋에는 자동화된 문서화, 코드 생성, 테스트 케이스 생성 지원이 포함되며, 간단한 설정으로 프로젝트에서 지정한 URL들을 HTML화면으로 확인할 수 있게 해준다.
tags:
  - 스프링
  - 스프링부트
  - Spring
  - SpringBoot
  - Java
  - 프레임워크
  - Swagger
---

![스프링 부트 Swagger API 문서 자동화](//assets/springboot.png "스프링 부트 Swagger API 문서 자동화")

Swagger는 개발자가 REST 웹 서비스를 설계, 빌드, 문서화, 소비하는 일을 도와주는 대형 도구 생태계의 지원을 받는 오픈 소스 소프트웨어 프레임워크이다. 대부분의 사용자들은 스웨거 UI 도구를 통해 스웨거를 식별하며 스웨거 툴셋에는 자동화된 문서화, 코드 생성, 테스트 케이스 생성 지원이 포함된다.

Swagger는 간단한 설정으로 프로젝트에서 지정한 URL들을 HTML화면으로 확인할 수 있게 해준다.

## Swagger Dependency Library 추가

설정은 아래와 같이 dependencies 에 swagger 를 추가해 준다.

```groovy
dependencies {
  ...
	compile group: 'io.springfox', name: 'springfox-swagger2', version: '2.9.2'
	compile group: 'io.springfox', name: 'springfox-swagger-ui', version: '2.9.2'
  ...
}
```

## SwaggerConfig.java 파일 생성

```java
package com.coffee.coffee;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig {
  @Bean
  public Docket api() {
    return new Docket(DocumentationType.SWAGGER_2).select()
        .apis(RequestHandlerSelectors.basePackage("com.coffee.coffee")).paths(PathSelectors.any()).build();
  }
}
```

## Swagger UI 실행

SwaggerConfig.java 에서 해당 Controller를 Swagger API 문서로 지정한다.
브라우저를 통해 domain/swagger-ui.html 로 이동하면 Swagger API 문서 페이지를 볼 수 있다.

![스프링 부트 springboot swagger ui](//assets/springboot-swagger-ui.png "스프링 부트 springboot swagger ui")
