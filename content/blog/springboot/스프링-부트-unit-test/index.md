---
templateKey: blog-post
title: 스프링 부트 Unit Test
date: 2021-04-08T23:19:29.537Z
description: 유닛 테스트(unit test)는 컴퓨터 프로그래밍에서 소스 코드의 특정 모듈이 의도된 대로 정확히 작동하는지 검증하는 절차다. JUnit 은 Java에서 독립된 단위테스트(Unit Test)를 지원해주는 프레임워크이다.
tags:
  - 스프링
  - 스프링부트
  - Spring
  - SpringBoot
  - Java
  - 프레임워크
  - 스프링부트구조
  - 아키텍쳐
  - Junit
---

![스프링 부트 Unit Test](/assets/springboot.png "스프링 부트 Unit Test")

## Unit Test

유닛 테스트(unit test)는 컴퓨터 프로그래밍에서 소스 코드의 특정 모듈이 의도된 대로 정확히 작동하는지 검증하는 절차다. 즉, 모든 함수와 메소드에 대한 테스트 케이스(Test case)를 작성하는 절차를 말한다. 이를 통해서 언제라도 코드 변경으로 인해 문제가 발생할 경우, 단시간 내에 이를 파악하고 바로 잡을 수 있도록 해준다. 이상적으로, 각 테스트 케이스는 서로 분리되어야 한다. 이를 위해 가짜 객체(Mock object)를 생성하는 것도 좋은 방법이다. 유닛 테스트는 (일반적인 테스트와 달리) 개발자(developer) 뿐만 아니라 보다 더 심도있는 테스트를 위해 테스터(tester)에 의해 수행되기도 한다.

- 소스코드의 특정 모듈이 의도된 대로 정확히 작동하는지 검증하는 절차이다.
- 모든 함수와 메소드에 대한 테스트 케이스(Test case)를 작성하는 절차를 말한다.

## JUnit

Java에서 독립된 단위테스트(Unit Test)를 지원해주는 프레임워크이다.

- 단정문(assert) 메서드로 테스트 케이스의 수행 결과를 판별한다.(ex: assertEquals(예상값, 실제값))
- jUnit4부터는 테스트를 지원하는 어노테이션을 제공한다.(@Test @Before @After)
- @Test 메서드가 호출할 때 마다 새로운 인스턴스를 생성하여 독립적인 테스트가 이루어지게 한다.
- jUnit은 보이지 않고 숨겨진 단위 테스트를 끌어내어 정형화시켜 단위테스트를 쉽게 해주는 테스트 지원 프레임워크이다.

### jUnit에서 테스트를 지원하는 어노테이션(Annotation)

#### @Test

- @Test가 선언된 메서드는 테스트를 수행하는 메소드가 된다.
- jUnit은 각각의 테스트가 서로 영향을 주지 않고 독립적으로 실행됨을 원칙으로 @Test마다 객체를 생성한다.

#### @Ignore

- @Ignore가 선언된 메서드는 테스트를 실행하지 않게 한다.

#### @Before

- @Before가 선언된 메서드는 @Test 메서드가 실행되기 전에 반드시 실행되어진다.
- @Test메서드에서 공통으로 사용하는 코드를 @Before 메서드에 선언하여 사용하면 된다.

#### @After

- @After가 선언된 메서드는 @Test 메소드가 실행된 후 실행된다.

#### @BeforeClass

- @BeforeClass 어노테이션은 @Test 메소드보다 먼저 한번만 수행되어야 할 경우에 사용하면 된다.

#### @AfterClass

- @AfterClass 어노테이션은 @Test 메소드 보다 나중에 한번만 수행되어야 할 경우에 사용하면 된다.

### 자주 사용하는 jUnit 메서드

#### assertEquals(a,b);

- 객체 a,b의 값이 일치함을 확인한다.

#### assertArrayEquals(a,b);

- 배열 a,b의 값이 일치함을 확인한다.

#### assertSame(a,b);

- 객체 a,b가 같은 객체임을 확인한다.
- 두 객체의 레퍼런스가 동일한가를 확인한다.

#### assertTrue(a);

- 조건 a가 참인가 확인한다.

#### assertNotNull(a);

- 객체 a가 null이 아님을 확인한다.

## 구현

### 의존성 추가

```groovy
dependencies {
    testImplementation('org.springframework.boot:spring-boot-starter-test') {
        exclude module: 'junit'
    }
    testImplementation('org.junit.jupiter:junit-jupiter-api:5.2.0')
    testCompile('org.junit.jupiter:junit-jupiter-params:5.2.0')
    testRuntime('org.junit.jupiter:junit-jupiter-engine:5.2.0')
}
```

### RestController

```java
@RestController
public class SampleController {

    @Autowired
    private SampleService sampleService;

    @GetMapping("/hello")
    public String hello() {
        return "hello " + sampleService.getName();
    }
}
```

### Service

```java
@Service
public class SampleService {

    public String getName(){
        return "hs";
    }
}
```

### Application

```java
@SpringBootApplication
public class Application {

    public static void main(String[] args)  {
        SpringApplication application = new SpringApplication(Application.class);
        application.run(args);
    }
}
```

### Test Code

다음 위에서 작성한 코드들을 테스트할 테스트 코드를 작성합니다.

```java
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
public class SampleSpringBootTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    public void hello() throws Exception {
        mockMvc.perform(get("/hello"))
                .andExpect(status().isOk())
                .andExpect(content().string("hello hs"))
                .andDo(print());
    }
}
```

**@RunWith 어노테이션**
JUnit 프레임워크가 테스트를 실행할 시(JUnit은 내장된 Runner를 테스트 시 실행하고 됨) 테스트 실행방법을 확장할 때 쓰는 어노테이션 입니다. 쉽게 말해 JUnit 프레임워크가 내장된 Runner를 실행할 때 @Runwith 어노테이션을 통해 SpringRunner.class라는 확장된 클래스를 실행하라고 지시한 것입니다.

**@SpringBootTest**
스프링 부트 어플리케이션 테스트 시 테스트에 필요한 거의 모든 의존성을 제공 어노테이션입니다. @SpringBootApplication을 기준으로 스프링 빈을 등록함과 동시에 Maven 같은 빌드 툴에 의해 추가된 스프링부트 의존성도 제공해 줍니다. @SpringBootTest 어노테이션에는 webEnvironment라는 값을 통해 웹 어플리케이션 테스트시 Mock으로 테스트할 것인지 실제 톰캣 같은 서블릿 컨테이너를 구동해서 테스트할 것인지를 정할 수 있습니다.

**@AutoConfigureMockMvc**
Mock 테스트시 필요한 의존성을 제공해줍니다.

**MockMvc**
객체를 통해 실제 컨테이너가 실행되는 것은 아니지만 로직상으로 테스트를 진행할 수 있습니다. (DispatcherServlet은 로딩되어 Mockup으로서 기능합니다)

**print()**
함수를 통해 좀 더 디테일한 테스트 결과를 볼 수 있습니다.

## 결과

```
MockHttpServletRequest:
HTTP Method = GET
Request URI = /hello
Parameters = {}
Headers = {}
Body = null
Session Attrs = {}

Handler:
Type = com.tutorial.springboot.controller.SampleController
Method = public java.lang.String com.tutorial.springboot.controller.SampleController.hello()

Async:
Async started = false
Async result = null

Resolved Exception:
Type = null

ModelAndView:
View name = null
View = null
Model = null

FlashMap:
Attributes = null

MockHttpServletResponse:
Status = 200
Error message = null
Headers = {Content-Type=[text/plain;charset=UTF-8], Content-Length=[13]}
Content type = text/plain;charset=UTF-8
Body = hello hs
Forwarded URL = null
Redirected URL = null
Cookies = []
2021-04-08 23:56:16.853 INFO 6284 --- [ Thread-2] o.s.s.c.ThreadPoolTaskExecutor : Shutting down ExecutorService 'applicationTaskExecutor'
```
