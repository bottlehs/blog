---
templateKey: blog-post
title: 스프링 부트 소개
date: 2021-03-16T20:29:29.537Z
description: 스프링부트는 최소한의 설정으로 스프링 플랫폼과 서드파티 라이브러리들을 사용 할 수 있도록 고안된 프레임워크 이다. 즉 스프링 부트는 환경 설정을 최소화하고 개발자가 비즈니스 로직에 집중할 수 있게하여 생산성을 크게 향상시켜준다.
tags:
  - 스프링
  - 스프링부트
  - Spring
  - SpringBoot
  - Java
  - 프레임워크
---

![스프링 부트 소개](/assets/springboot.png "스프링 부트 소개")

스프링부트는 최소한의 설정으로 스프링 플랫폼과 서드파티 라이브러리들을 사용 할 수 있도록 고안된 프레임워크 이다. 즉 스프링 부트는 환경 설정을 최소화하고 개발자가 비즈니스 로직에 집중할 수 있게하여 생산성을 크게 향상시켜준다.

### 스프링이란?

스프링은 프레임워크이다. 프레임워크와 라이브러리의 차이는 아래와 같다.

**프레임워크**
프레임워크는 라이브러리를 포함하는 개념이고, 개발자가 만든 코드를 사용한다. 코드를 어떻게 실행하는지는 코드를 사용하는 프레임워크에 달려있다.

**라이브러리**
라이브러리는 간단하게 특정 기능을 하는 코드 뭉치이다. 개발자는 자기 코드에 라이브러리를 포함시키고 원하는 기능을 사용해서 개발을 할 수 있다. 더욱 간단하게는 원하는 기능을 하는 함수를 콜해서 사용하는 것으로 라이브러리를 활용한다.

즉 스프링 프레임워크는 여러 라이브러리를 제공하고, 그것을 활용해서 개발한 프로그램을 동작시킨다. 스프링 프레임워크의 위키백과 정의는 아래와 같다.

스프링 프레임워크는 자바 플랫폼을 위한 오픈 소스 애플리케이션 프레임워크로서 간단히 스프링이라고도 한다. 동적인 웹 사이트를 개발하기 위한 여러 가지 서비스를 제공하고 있다.

### 주요 특징

스프링부트의 특징은 아래와 같다.

- 독립 실행이 가능한 스프링 애플리케이션 개발 (Embedded Tomcat, Jetty, Undertow를 사용)
- 통합 Starter를 제공하여 Maven/Gradle 구성을 간소화
- Starter를 통한 자동화된 스프링 설정 제공
- 번거로운 XML 설정을 요구하지 않음
- JAR을 이용하여 자바 옵션만으로도 배포 가능
- Spring Actuator 제공 (애플리케이션의 모니터링과 관리를 위해 사용)

### 스프링과 스프링부트

스프링 부트는 스프링 프레임워크 내에서 설정을 간소화한 도구라고 볼 수 있다.

**장점**

- 각각의 의존성 버전을 수월하게 올리는 것이 가능 스프링 부트의 버전이 올라갈 때마다 각 버전별 호환성에 대해 충분한 테스트를 거친 뒤 release 기존에 각각 수동으로 설정했던 버전 관리에 비해서 안정된 버전 제공을 보장받을 수 있다.
- 간단한 어노테이션/프로퍼티 설정으로 원하는 기능을 빠르게 적용 가능 하다.
- 별도의 외장 톰캣을 설치할 필요가 없고 톰캣 버전도 편리하게 관리 가능 하다.
- 특정 라이브러리에 버그가 있더라도 이후에 스프링팀으로부터 bugfix 된 버전을 받기에 편리하다.

**단점**

- 설정을 커스터마이징하는 경우 기존의 스프링 프레임워크를 사용하는 것과 같은 불편함이 있을 수 있다.
- 설정을 변경하고 싶은 경우 내부 코드를 살펴봐야하는 불편함이 있을 수 있다.

### 스프링부트 시작하기

[**https://spring.io/quickstart**](https://spring.io/quickstart) 링크로 접속하여 순서에 맞게 해보면 쉽게 시작이 가능하다.
스프링스타터를 활용하면 의존 관계를 간단히 설정 할수 있다.

### 스프링부트 스타터 종류

[**https://github.com/spring-projects/spring-boot/tree/master/spring-boot-project/spring-boot-starters/**](https://github.com/spring-projects/spring-boot/tree/master/spring-boot-project/spring-boot-starters) 에서 확인 가능하다.

**주요 스타터**

- spring-boot-starter-web-services : SOAP 웹 서비스
- spring-boot-starter-web : Web, RESTful 응용프로그램
- spring-boot-starter-test : Unit testing, Integration Testing
- spring-boot-starter-jdbc : 기본적인 JDBC
- spring-boot-starter-hateoas : HATEOAS 기능을 서비스에 추가
- spring-boot-starter-security : 스프링 시큐리티를 이용한 인증과 권한
- spring-boot-starter-data-jpa : Spring Data JPA with Hibernate
- spring-boot-starter-cache : 스프링 프레임워크에 캐싱 지원 가능
- spring-boot-starter-data-rest : Spring Data REST를 사용하여 간단한 REST 서비스 노출

**전체 스타터**

- spring-boot-starter-activemq
- spring-boot-starter-actuator
- spring-boot-starter-amqp
- spring-boot-starter-aop
- spring-boot-starter-artemis
- spring-boot-starter-batch
- spring-boot-starter-cache
- spring-boot-starter-data-cassandra-reactive
- spring-boot-starter-data-cassandra
- spring-boot-starter-data-couchbase-reactive
- spring-boot-starter-data-couchbase
- spring-boot-starter-data-elasticsearch
- spring-boot-starter-data-jdbc
- spring-boot-starter-data-jpa
- spring-boot-starter-data-ldap
- spring-boot-starter-data-mongodb-reactive
- spring-boot-starter-data-mongodb
- spring-boot-starter-data-neo4j
- spring-boot-starter-data-r2dbc
- spring-boot-starter-data-redis-reactive
- spring-boot-starter-data-redis
- spring-boot-starter-data-rest
- spring-boot-starter-freemarker
- spring-boot-starter-groovy-templates
- spring-boot-starter-hateoas
- spring-boot-starter-integration
- spring-boot-starter-jdbc
- spring-boot-starter-jersey
- spring-boot-starter-jetty
- spring-boot-starter-jooq
- spring-boot-starter-json
- spring-boot-starter-jta-atomikos
- spring-boot-starter-log4j2
- spring-boot-starter-logging
- spring-boot-starter-mail
- spring-boot-starter-mustache
- spring-boot-starter-oauth2-client
- spring-boot-starter-oauth2-resource-server
- spring-boot-starter-parent
- spring-boot-starter-quartz
- spring-boot-starter-reactor-netty
- spring-boot-starter-rsocket
- spring-boot-starter-security
- spring-boot-starter-test
- spring-boot-starter-thymeleaf
- spring-boot-starter-tomcat
- spring-boot-starter-undertow
- spring-boot-starter-validation
- spring-boot-starter-web-services
- spring-boot-starter-web
- spring-boot-starter-webflux
- spring-boot-starter-websocket
- spring-boot-starter

### Gradle 과 Maven

Maven 예제가 많은 편이지만, Maven의 골, 페이즈만으로는 프로젝트의 필요한 기능을 모두 지원하지 못할 수도 있다. Gradle은 Groovy DSL로 구성되어 있어서 그루비를 익혀야하지만, 지원되는 기능을 익히고 나면 훨씬 강력해진다.
Gradle 과 Maven 의 차이는 따로 포스팅 할 예정이다.

### 배포형태

배포형태에 따라서 war 또는 jar 로 나눠 진다. 기본적으로는 단독실행가능지만, 톰캣 서버를 따로 구축하고 배포 할때는 일반적으로 war 로 배포 한다.
war 와 jar 의 차이점은 따로 포스팅 할 예정이다.

### 스프링 부트 버전

스프링부트 버전확인은 [**https://github.com/spring-projects/spring-boot/wiki**](https://github.com/spring-projects/spring-boot/wiki) 에서 확인이 가능하다.

현재 버전은 아래와 같다.

- v2.5 (preview)
- v2.4
- v2.3
- v2.2
