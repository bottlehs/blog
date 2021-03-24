---
templateKey: blog-post
title: 스프링 부트 구조
date: 2021-03-23T22:29:29.537Z
description: 스프링부트는 최소한의 설정으로 스프링 플랫폼과 서드파티 라이브러리들을 사용 할 수 있도록 고안된 프레임워크 이다. 즉 스프링 부트는 환경 설정을 최소화하고 개발자가 비즈니스 로직에 집중할 수 있게하여 생산성을 크게 향상시켜준다.
tags:
  - 스프링
  - 스프링부트
  - Spring
  - SpringBoot
  - Java
  - 프레임워크
  - 스프링부트구조
  - 아키텍쳐
---

![스프링 부트 구조](/assets/springboot.png "스프링 부트 구조")

## Spring Boot Architecture

스프링 부트 아키텍쳐는 아래와 같다.

![Spring Boot Architecture](/assets/spring-boot-architecture.png "Spring Boot Architecture")

- **Controller Layer :** UI 에서 요청을 받고 응답을 전달 한다.
- **Service Layer :** 비즈니스 로직을 구현 한다.
- **Repository Layer :** 데이터베이스에서 가져올 쿼리를 구현. JPA를 이용하는 경우 정해진 규칙에 따라서 메소드를 사용하거나, 만들어놓으면 적절한 쿼리를 수행할 수 있다.
- **Domain Layer :** 실제로 데이터베이스 물리 테이블과 1:1 매핑이 되어 바인딩 되어 있다.

Controller 에서는 Service 를 호출해서 받은 결과를 UI 에 전달한다. `[Service -> Repository -> Domain]` 처럼 각각 관련 있는 클래스를 호출하도록 설계한다. Service 가 또 다른 Service 를 호출하지 않도록 주의하고, Service 에서 필요한 Repository 에 접근하여, 데이터를 가져올 수 있도록 해야 한다.

## Spring Boot Project Structure

| 디렉토리           | 설명                                              |
| ------------------ | ------------------------------------------------- |
| src/main/java      | 어플리케이션, 라이브러리 소스                     |
| src/main/resources | 어플리케이션, 라이브러리 리소스                   |
| src/main/filters   | 리소스 필터 파일                                  |
| src/main/assembly  | 어셈블리 디스크립터                               |
| src/main/config    | 설정 파일                                         |
| src/main/scripts   | 어플리케이션, 라이브러리 스크립트                 |
| src/main/webapp    | 웹 어플리케이션 소스                              |
| src/test/java      | 테스트 소스                                       |
| src/test/resources | 테스트 리소스                                     |
| src/test/filters   | 테스트 리소스 필터 파일                           |
| src/site           | 사이트                                            |
| LICENSE.txt        | 프로젝트의 라이센스                               |
| NOTICE.txt         | 프로젝트 라이브러리에서 필요로 하는 주의사항 특징 |
| README.txt         | 프로젝트의 리드미                                 |

```groovy
buildscript {
    repositories {
        maven { url "http://repo.spring.io/libs-snapshot" }
        mavenLocal()
    }
    dependencies {
        classpath("org.springframework.boot:spring-boot-gradle-plugin:1.0.0.RC1")
    }
}

apply plugin: 'java'
apply plugin: 'idea'
apply plugin: 'spring-boot'

sourceCompatibility = 1.7
version = '1.0'

repositories {
    mavenCentral()
    maven { url "http://repo.spring.io/libs-snapshot" }
}

dependencies {
    compile("org.springframework.boot:spring-boot-starter-web:1.0.0.RC1")
    testCompile group: 'junit', name: 'junit', version: '4.11'
}
```
