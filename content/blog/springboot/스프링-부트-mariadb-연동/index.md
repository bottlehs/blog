---
templateKey: blog-post
title: 스프링 부트 MariaDB 연동
date: 2021-04-01T22:29:29.537Z
category: springboot
description: JDBC는 자바 프로그램이 DBMS에 일관된 방식으로 접근할 수 있도록 API를 제공하는 자바 클래스들의 모임이다. MariaDB 특징은 기존에 MySQL 엔터프라이즈에서 플러그인으로 제공한 쓰레드풀 기능이 내장됐으며, 스토리지 엔진을 활용한 샤딩 기술을 제공한다. 즉, MySQL의 오픈소스 버전을 넘어 모든 버전을 대체할 수 있는 특징들을 갖추고 있다. JPA는 여러 ORM 전문가가 참여한 EJB 3.0 스펙 작업에서 기존 EJB ORM이던 Entity Bean을 JPA라고 바꾸고 JavaSE, JavaEE를 위한 영속성(persistence) 관리와 ORM을 위한 표준 기술이다. JPA는 ORM 표준 기술로 Hibernate, OpenJPA, EclipseLink, TopLink Essentials과 같은 구현체가 있고 이에 표준 인터페이스가 바로 JPA이다.
tags:
  - 스프링
  - 스프링부트
  - Spring
  - SpringBoot
  - Java
  - 프레임워크
  - MariaDB
  - JDBC
---

![스프링 부트 MariaDB 연동](//assets/springboot.png "스프링 부트 MariaDB 연동")

스프링 부트 MariaDB 연동 순서는 아래와 같다.

- DB설치 및 테스트 데이터베이스 생성
- Spring Boot에 새로운 프로젝트 생성
- Spring JDBC 연결
- Spring Boot와 JPA

들어가기에 앞서 JDBC 와 MairaDB 에 대해 간략하게 알아 보도록 한다.

## JDBC

JDBC(Java DataBase Connectivity)

JDBC는 자바 프로그램이 DBMS에 일관된 방식으로 접근할 수 있도록 API를 제공하는 자바 클래스들의 모임이다. 즉 데이터베이스에 연결 및 작업을 하기 위한 JAVA의 표준 인터페이스이다.

JDBC는 아래와 같은 특징을 가진다.

- JDBC는 함수 호출용 SQL 인터페이스이다.
- JDBC는 ANI SQL-92 표준을 지원한다.
- JDBC는 공통된 SQL 인터페이스를 바탕으로 한다.
- JDBC는 익히고 사용하기 쉽다.

### JDBC 구성 요소

- **응용 프로그램**

  - 데이터베이스에 연결을 요청
  - 데이터베이스에 SQL문을 전송
  - SQL 문의 처리 결과 요청
  - 오류가 발생하는 경우에 오류 처리
  - 트랜잭션을 제어
  - 연결 종료

- **드라이버 매니저**

  - 데이터베이스에 맞는 드라이버 검색
  - JDBC 초기화를 위한 작업 수행

- **드라이버**

  - 데이터베이스에 연결
  - 데이터베이스에 SQL문을 전달
  - 응용 프로그램에 검색 결과 전달
  - 필요한 경우 커서를 조작
  - 필요한 경우 트랜잭션을 시작

- **DBMS**
  - 데이터가 저장되어 있는 장소

### JDBC 시스템 아키텍처

JDBC API는 2-tier(2 계층)와 3-tier(3 계층)를 모두 지원한다.

> tier란 일련의 유사한 객체가 나열된 상태에서 계층 또는 열을 나타낸다.
> 프로그램의 일부가 여러 객체에 나뉘어 존재할 수 있으며
> 그 계층 또한 네트워크 상에서 다른 컴퓨터에 위치할 수 있다.

**2-tier**

- 자바 애플릿이나 애플리케이션이 JDBC를 이용하여 DBMS에 직접 접근하는 방식이다.
- 가장 대표적인 C/S (Client/Server) 구조이다.
- 프로그래밍이 간단하다는 장점이 있다.
- 하지만 보안, 로드밸런싱(서버 부하 분담), 확장성(오브젝트 재사용) 등의 문제점이 있다.

2-tier가 적합한 경우는 다음과 같다.

- 애플리케이션의 하나의 데이터베이스만을 사용하는 경우
- 데이터베이스 엔진이 하나의 CPU에서 동작하는 경우
- 데이터베이스가 계속 거의 같은 크기로 유지되는 경우
- 사용자 기반이 같은 크기로 유지되는 겨우
- 요구가 확정되어, 변환 가능성이 극히 적거나 없는 경우
- 애플리케이션을 종료한 후에도 최소한의 지속성을 요구하는 경우

**3-tier**

- 자바 애플릿이나 어플리케이션이 DBMS에 직접 접근하지 않고 중간에 미들웨어(미들티어)를 거쳐서 데이터베이스에 접근하는 방식이다.
- 데이터베이스와 연동 부분을 분리시킴으로써 Presentation Layer가 데이터 저장 방법에 신경을 쓰지 않아도 된다.
- 클라이언트는 단지 미들티어만을 참조한다.
- 미들티어 서버는 DBMS와 같이 특정한 작업만 수행하는 최종 서버와 통신을 하여 결과를 얻은 후 이 결과를 클라이언트에 전달한다.
- 2-tier 모델과 비교했을때 훨씬 안정적이고 유연하며 보안이 강화된다.

3-tier가 적합한 경우는 2-tier 가 적합한 반대 경우로 보면 된다.

다음 그림은 2-tier와 3-tier를 표현한 것이다. 왼쪽부터 1-tier로 시작하여 오른쪽으로 갈수록 한 계층씩 증가한다.

![JDBC 시스템 아키텍처 2-tier 와 3-tier 표현](//assets/springboot-jdbc-2-tier-3-tier.png "JDBC 시스템 아키텍처 2-tier 와 3-tier 표현")

3-tier 아키텍처 같은 경우에는 중간 2-tier에 http, 코바(CORBA) 등을 지원하기 위한 응용 처리 서버(Application Server)가 온다.

## MairaDB

MariaDB는 MariaDB사가 제작한 오픈소스 RDMBS 소프트웨어이다. MySQL코드 기반으로한 오픈소스 RDBMS 이다.

### MariaDB 특징

기존에 MySQL 엔터프라이즈에서 플러그인으로 제공한 쓰레드풀 기능이 내장됐으며, 스토리지 엔진을 활용한 샤딩 기술을 제공한다. 즉, MySQL의 오픈소스 버전을 넘어 모든 버전을 대체할 수 있는 특징들을 갖추고 있다.

- 멀티 소스/병렬 복제
- Global Transaction ID로 안정성 강화
- ROLE 기반 권한 관리 지원
- 서브 쿼리 개선 : EXISTS-to-IN
- Slow Query Log 로깅과 동시에 실행계획을 같이 출력
- 세션별 메모리 사용량 추적 기능
- Insert/Update/Delete 문 EXPLAIN 지원

### MariaDB 아키텍처

![MariaDB 아키텍처](//assets/springboot-mariadb-architecture.png "MariaDB 아키텍처")

> MariaDB는 근본적인 태생이 MySQL과 같기 때문에 pluggable Storage Engine의 종류만 조금 다를뿐 MySQL의 기본아케텍쳐와 동일하다.

### MariaDB 갈레아 클러스터

![MariaDB Galera Cluster](//assets/springboot-mariadb-galera-cluster.png "MariaDB Galera Cluster")

MariaDB/Galera는 MariaDB의 Synchronous 방식 으로 동작하는 multi-master Cluster이다. MariaDB/Galera Cluster은 Galera 라이브러리를 사용하여 노드 간 데이터 복제를 수행한다.

## 스프링 부트 MariaDB 연동

### DB설치 및 테스트 데이터베이스 생성

https://mariadb.org/ 에 접속하여 환경에 맞는 제품군으로 설치해 준다.

설치 되면 MariaDB 터미널을 열고 접속후 아래와 같은 명령어를 입력해 본다.

```sql
show databases;
```

![show databases](//assets/springboot-show-databases.png "show databases")

`show databases;` 는 현재 생성된 데이터베이스 목록을 출력 한다.

이제 새로운 데이터베이스를 생성해 보자.

```sql
create database coffee;
```

생성후 'show databases;' 를 입력하면 아래와 같이 `coffee` 데이터베이스를 확인할수 있다.

![create databases](//assets/springboot-create-database.png "create databases")

### 테이블 생성 밑 데이터 입력

이제 테이블을 생성해 보자.

테이블은 특정 데이터베이스내에 생성을 할수 있다.

방금 만든 `coffee` 데이터베이스에 `user` 테이블을 생성 해보도록 하겠다.

`use database` 는 어떤 데이터베이스를 사용하겠다 지정하는 명력어 이다.

```sql
use database coffee
```

위와 같이 입력하면 `coffee` 데이터베이스를 사용되도록 지정이 된다.

![use databases](//assets/springboot-use-database.png "use databases")

이제 아래와 같이 테이블을 추가해 보자

```sql
create table user (
  seq int not null,
  name varchar(30)
);
```

테이블 이름은 user 이고 컬럼은 seq, name 을 추가 했다.

- user : 테이블 이름
- seq : 정수형 컬럼
- name : 문자형 컬럼

테이블 추가후 `show tables;` 를 입력 하면 아래와 같이 생성된 `user` 테이블을 확인할수 있다.

![create table](//assets/springboot-create-table.png "create table")

이제 생성된 `user` 테이블에 데이터(행)을 추가해 보자.

```sql
insert into user (seq, name)
values (1, 'bottlehs');
```

```sql
select * from user;
```

![insert table row](//assets/springboot-insert-row.png "insert table row")

위와 같이 `user` 테이블에 데이터(행)을 추가 하고 `select` 명령어를 사용하여 추가된 데이터(행)를 확인 할수 있다.

### SQL(Structured Query Language) - 구조적 질의 언어 이란

데이터베이스를 생성하고 원하는 데이터를 입력,수정,삭제,출력 할때 SQL 이라고 하는 질의어를 사용한다. SQL에 대해 간단히 설명 하면 아래와 같다.

SQL는 관계형 데이터베이스 관리 시스템의 데이터를 관리하기 위해 설계된 특수 목적의 프로그래밍 언어이다. 관계형 데이터베이스 관리 시스템에서 자료의 검색과 관리, 데이터베이스 스키마 생성과 수정, 데이터베이스 객체 접근 조정 관리를 위해 고안되었다.

SQL 언어는 크게 DDL, DML, DCL 로 나눠진다.

- 데이터 정의어 - DDL(Data Definition Language) : 데이터베이스를 정의하는 언어이며, 데이터리를 생성, 수정, 삭제하는 등의 데이터의 전체의 골격을 결정하는 역할을 하는 언어 이다.
- 데이터 조작어 - DML(Data Manipulation Language) : 정의된 데이터베이스에 입력된 레코드를 조회하거나 수정하거나 삭제하는 등의 역할을 하는 언어를 말한다.
- 데이터 제어어 - DCL(Data Control Language) : 데이터베이스에 접근하거나 객체에 권한을 주는등의 역할을 하는 언어 이다.

SQL 은 따로 학습이 필요하니 따로 학습하기를 권장 한다.

## Spring Boot에 새로운 프로젝트 생성

Spring Boot 프로젝트는 `https://start.spring.io/` 에서 쉽게 생성이 가능하다.

아래와 같이 설정하여 프로젝트를 생성 하도록 한다.

![springboot initializr](//assets/springboot-initializr.png "springboot initializr")

프로젝트를 생성후 VS Code 로 실행 시키면 아래와 같이 Spring Boot 을 개발 & 테스트 할수 있는 환경이 셋팅 된다.

![springboot initializr project](//assets/springboot-initializr-project.png "springboot initializr project")

아래 run 버튼을 누르면 Spring Boot 가 내장 톰캣으로 실행 된다.

![springboot initializr project run](//assets/springboot-initializr-project-run2.png "springboot initializr project run")

실행되면 기본적으로 8080 포트에서 확인이 가능 하다.

```
http://localhost:8080/
```

![springboot initializr project run localhost](//assets/springboot-initializr-project-run.png "springboot initializr project run localhost")

## Spring JDBC 연결

Spring Boot 프로젝트내 아래 경로에 DB 설정 코드를 추가해 준다.

`resources/application.properties`

```
spring.datasource.driverClassName=org.mariadb.jdbc.Driver // DB 드라이브
spring.datasource.url=jdbc:mariadb://127.0.0.1:3306/coffee // DB 주소 및 데이터베이스명
spring.datasource.username=root // MariaDB 접속 계정
spring.datasource.password=root123 // MariaDB 접속 비밀번호
```

**실패**
![springboot maria db failure](//assets/springboot-maria-db-failure.png "springboot maria db failure")

**성공**
![springboot maria db succeed](//assets/springboot-maria-db-succeed.png "springboot maria db succeed")

## Spring Boot와 JPA

### JPA(Java Persistence API)

JPA는 여러 ORM 전문가가 참여한 EJB 3.0 스펙 작업에서 기존 EJB ORM이던 Entity Bean을 JPA라고 바꾸고 JavaSE, JavaEE를 위한 영속성(persistence) 관리와 ORM을 위한 표준 기술이다. JPA는 ORM 표준 기술로 Hibernate, OpenJPA, EclipseLink, TopLink Essentials과 같은 구현체가 있고 이에 표준 인터페이스가 바로 JPA이다.

> ORM(Object Relational Mapping)이란 RDB 테이블을 객체지향적으로 사용하기 위한 기술이다. RDB 테이블은 객체지향적 특징(상속, 다형성, 레퍼런스, 오브젝트 등)이 없고 자바와 같은 언어로 접근하기 쉽지 않다. 때문에 ORM을 사용해 오브젝트와 RDB 사이에 존재하는 개념과 접근을 객체지향적으로 다루기 위한 기술이다.

**장점**

- 객체지향적으로 데이터를 관리할 수 있기 때문에 비즈니스 로직에 집중 할 수 있으며, 객체지향 개발이 가능하다.
- 테이블 생성, 변경, 관리가 쉽다. (JPA를 잘 이해하고 있는 경우)
- 로직을 쿼리에 집중하기 보다는 객체자체에 집중 할 수 있다.
- 빠른 개발이 가능하다.

**단점**

- 어렵다. 장점을 더 극대화 하기 위해서 알아야 할게 많다.
- 잘 이해하고 사용하지 않으면 데이터 손실이 있을 수 있다. (persistence context)
- 성능상 문제가 있을 수 있다.(이 문제 또한 잘 이해해야 해결이 가능하다.)

### ORM(Object-relational mapping)

- Object-relational mapping (객체 관계 매핑)
  - 객체는 객체대로 설계하고, 관계형 데이터베이스는 관계형 데이터베이스대로 설계한다.
  - ORM 프레임워크가 중간에서 매핑해준다.
- 대중적인 언어에는 대부분 ORM 기술이 존재한다.
- ORM은 객체와 RDB 두 기둥 위에 있는 기술 이다.

```
- MyBatis, iBatis는 ORM이 아니다. SQL Mapper입니다.
- ORM은 객체를 매핑하는 것이고, SQL Mapper는 쿼리를 매핑하는 것이다.
```

### Spring Boot JPA 적용 하기

프로젝트 생성시 JPA 관련 dependencies 를 추가 했다면 아래와 같이 dependencies 가 추가되어 있을 것이다.

![springboot jpa dependencies](//assets/springboot-jap-dependencies.png "springboot jpa dependencies")

**spring-boot-stater-data-jpa**

- 스프링 부트용 Spring Data Jpa 추상화 라이브러리 이다.
- 스프링 부트 버전에 맞춰 자동으로 JPA관련 라이브러리들의 버전을 관리해준다.

**H2**

- 인메모리 관계형 데이터베이스 이다.
- 별도의 설치가 필요 없이 프로젝트 의존성만으로 관리할 수 있다.
- 메모리에서 실행되기 때문에 애플리케이션 재시작할 때마다 초기화된다.

JPA 를 활용한 MariaDB 연계 및 REST API 개발은 JPA + REST API 개발 과정에서 진행 하도록 하겠다.
