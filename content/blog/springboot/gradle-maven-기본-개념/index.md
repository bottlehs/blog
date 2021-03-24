---
templateKey: blog-post
title: Gradle, Maven 기본 개념과 Gradle Multi Project
date: 2021-03-23T20:29:29.537Z
description: Maven, Gradle은 라이브러리 관리, 프로젝트 관리, 단위 테스트 시 의존성 관리를 한다. Maven은 pom.xml을 이용한 정형화된 빌드 시스템, Gradle은 build.gradle을 이용한 정형화된 빌드 시스템 이다. Gradle은 Multi Project 를 구성 하여 공통된 부분을 효율적으로 활용 할수 있다.
tags:
  - XML
  - Groovy
  - 의존성
  - Gradle
  - Maven
  - Gradle Multi Project
  - 빌드시스템
---

![Gradle, Maven 기본 개념과 Gradle Multi Project](/assets/gradle-vs-maven-gradle-multi-project.png "Gradle, Maven 기본 개념과 Gradle Multi Project")

Maven, Gradle은 라이브러리 관리, 프로젝트 관리, 단위 테스트 시 의존성 관리를 한다.

## Maven

- XML 사용
- pom.xml을 이용한 정형화된 빌드 시스템
- 자바용 프로젝트 관리 도구.
- 아파치 앤트의 대안으로 만들어짐.
- 아파치 라이센스로 배포된 오픈 소스 소프트웨어

### Maven 설정파일

pom.xml

- 플러그인, 의존성 추가를 위한 파일.

**pom.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.coffee</groupId>
  <artifactId>coffee-maven</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <packaging>jar</packaging>

  <name>coffee-maven</name>
  <description>Coffee project for Spring Boot</description>

  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>1.5.4.RELEASE</version>
    <relativePath/> <!-- lookup parent from repository -->
  </parent>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    <java.version>1.8</java.version>
  </properties>

  <dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
        <plugin>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
  </build>
</project>
```

## Gradle

- Groovy 사용
- build.gradle을 이용한 정형화된 빌드 시스템.
- 안드로이드 앱 공식 빌드 시스템.
- 빌드 속도가 maven에 비해 10~100배 가량 빠름.
- JAVA, C/C++, Python등을 지원.
- 빌드툴인 Ant Builder와 Groovy 기반으로 구축되어 기존 Ant의 역할과 배포 스크립트의 기능을 모두 사용 가능.

### Gradle 설정파일

build.gradle

- 메이븐의 pom.xml 과 비슷한 플러그인, 의존성 추가를 위한 파일.

**build.gradle**

```groovy
buildscript {
    ext {
        springBootVersion = '1.5.4.RELEASE'
    }
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath("org.springframework.boot:spring-boot-gradle-plugin:${springBootVersion}")
    }
}

apply plugin: 'java'
apply plugin: 'idea'
apply plugin: 'org.springframework.boot'

version = '0.0.1-SNAPSHOT'
sourceCompatibility = 1.8

repositories {
    mavenCentral()
}


dependencies {
    compile('org.springframework.boot:spring-boot-starter')
    testCompile('org.springframework.boot:spring-boot-starter-test')
}
```

## Maven 과 Gradle

- maven은 프로젝트가 커질수록 빌드 스크립트의 내용이 길어지고 가독성이 떨어진다.
- gradle은 훨씬 적은 양의 스크립트로 짧고 간결하게 작성할 수 있다.
- maven의 경우 멀티 프로젝트에서 특정 설정을 다른 모듈에서 사용하려면 상속을 받아야 한다.
- gradle은 설정 주입 방식을 사용 한다. (멀티 프로젝트에 매우 적합 하다.)

아래는 Maven 과 Gradle 의 성능 테스트표 이다.

![Gradle Maven Perfoemance](/assets/gradle-maven-perfoemance.png "Gradle Maven Perfoemance")

### Gradle의 Multi Module 이란

Gradle의 Multi Module 이란 프로젝트 구성시 web, app, api 등 용도가 서로 다른 프로젝트를 생성하는 경우를 말한다. 프로젝트가 다르더라도 바라보는 DataBase 가 같다면 기본적인 기능은 상당수가 공통적으로 겹치게 된다. 유지 보수 차원에서 공통적인 부분이 존재 한다면 같은 작업을 여러번 해야한다는 의미 이다. 이러한 문제를 해결하고 빌드를 효율 적으로 하기 위해 Gradle의 Multi Module 을 활용할수 있다.

아래는 멀티 모듈의 **settings.gradle** 예시 이다.

**settings.gradle**

settings.gradle 파일에 아래와 같이 최상위 프로젝트 이름(coffee)을 지정한다. 이는 해당 프로젝트 디렉토리 이름과 무관하게 설정할수 있다.

```groovy
rootProject.name = 'coffee'
```

하위 프로젝트를 include해준다.

```groovy
include "shared", "api", "services:webservice", "services:shared"
```

최상위 프로젝트의 `build.gradle`에 모든 서브 프로젝트에 공통된 설정을 넣는다.

```groovy
subprojects {
    apply plugin: 'java'
    apply plugin: 'eclipse-wtp'

    repositories {
       mavenCentral()
    }

    dependencies {
        testCompile 'junit:junit:4.8.2'
    }

    version = '1.0'

    jar {
        manifest.attributes provider: 'gradle'
    }
}
```

모든 서브 프로젝트에 java, eclipse-wtp 플러그인이 적용되고, 지정된 리포지토리와 의존성이 무조건 추가된다.

### Gradle Multi Module Structure

프로젝트가 크게 web, app, api 부분으로 나눠진다고 가정하면 공통되는 부분을 모듈로 빼서 관리하고 각각 프로젝트가 공통 모듈을 참조 하면 된다. 공통 부분을 core 라고 가정 하하면 아래 처럼 구조를 나눌수가 있을 것이다. 국제와 및 MSA 아키텍쳐와 관련이 깊다.

| 프로젝트명        | 용도                          |
| ----------------- | ----------------------------- |
| coffee-multi      | Root 용 프로젝트              |
| coffee-multi-core | 공통클래스관리                |
| coffee-multi-web  | Web Application (Sprint boot) |
| coffee-multi-app  | APP                           |
| coffee-multi-api  | API                           |

![Gradle Multi Module Structure](/assets/gradle-multi.png "Gradle Multi Module Structure")

**settings.gradle**

```groovy
rootProject.name = 'coffee-multi'
include 'coffee-multi-core'
include 'coffee-multi-app'
include 'coffee-multi-web'
include 'coffee-multi-api'
```

위와 같이 루트프로제트명(coffee-multi)을 지정하고 서브프로젝트를 include에 추가하면 된다. build.gradle을 아래와 같이 구성해야 한다.

**build.gradle**

```groovy
// coffee-multi

buildscript {
  ext {
    springBootVersion = '1.5.6.RELEASE'
  }
  repositories {
    mavenCentral()
  }
  dependencies {
    classpath("org.springframework.boot:spring-boot-gradle-plugin:${springBootVersion}") classpath('io.spring.gradle:dependency-management-plugin:1.0.0.RELEASE')
  }
}
subprojects {
  apply plugin: 'java'
  apply plugin: 'eclipse'
  apply plugin: 'idea'
  apply plugin: 'org.springframework.boot'
  sourceCompatibility = 1.8 repositories {
    mavenLocal() mavenCentral()
  }
  task initSourceFolders {
    sourceSets * .java.srcDirs * .each {
      if (!it.exists()) {
        it.mkdirs()
      }
    }
    sourceSets * .resources.srcDirs * .each {
      if (!it.exists()) {
        it.mkdirs()
      }
    }
  }
  dependencies {
    compileOnly('org.projectlombok:lombok') testCompile("org.springframework.boot:spring-boot-starter-test")
  }
}
```

```groovy
// coffee-core
 bootRepackage {
   enabled = false
 }
 dependencies {
   compile('org.mybatis.spring.boot:mybatis-spring-boot-starter:1.3.1')
   runtime('mysql:mysql-connector-java')
   compile 'com.zaxxer:HikariCP:2.6.2'
 }
```

```groovy
// coffee-multi-web
apply plugin: 'war'
dependencies {
  compile project(':coffee-multi-core')
  providedCompile 'javax.servlet:javax.servlet-api:3.1.0'
  compile 'javax.servlet:jstl:1.2'
  compile('org.springframework.boot:spring-boot-starter-web')
  compile('org.springframework.boot:spring-boot-starter-security')
  testCompile('org.springframework.security:spring-security-test')
}
```

위와 같이 하면 coffee-multi-web 에서 coffee-multi-core 의 공통 부분을 상속 받아 사용할수 있다.
