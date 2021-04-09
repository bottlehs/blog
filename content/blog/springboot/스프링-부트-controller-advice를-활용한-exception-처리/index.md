---
templateKey: blog-post
title: 스프링 부트 ControllerAdvice를 활용한 Exception 처리
date: 2021-04-08T21:29:29.537Z
description: 오류 처리는 프로그램을 개발하는데 있어서 매우 큰 부분을 차지한다. 오류를 예측해서 비정상적인 상황이 발생하지 않게 하는 것은 중요하다. 과하다할 만큼 상세하고 다양하게 예외를 잡아 처리해준다면, 클라이언트도 그렇고 서버도 그렇고 더 안정적인 프로그램이 될 수 있게 도와준다. 예외 처리에 집중 하다 보면, 비즈니스 로직에 집중하기 어렵고, 비즈니스 로직과 관련된 코드보다 예외 처리를 위한 코드가 더 많아지는 경우도 생기게 된다. 이런 문제를 조금이라도 개선하기 위해 @ExceptionHandler와 @ControllerAdvice를 사용한다.
tags:
  - 스프링
  - 스프링부트
  - Spring
  - SpringBoot
  - Java
  - 프레임워크
  - 스프링부트구조
  - 아키텍쳐
  - ControllerAdvice
---

![스프링 부트 ControllerAdvice를 활용한 Exception 처리](/assets/springboot.png "스프링 부트 ControllerAdvice를 활용한 Exception 처리")

오류 처리는 프로그램을 개발하는데 있어서 매우 큰 부분을 차지한다. 오류를 예측해서 비정상적인 상황이 발생하지 않게 하는 것은 중요하다. 과하다할 만큼 상세하고 다양하게 예외를 잡아 처리해준다면, 클라이언트도 그렇고 서버도 그렇고 더 안정적인 프로그램이 될 수 있게 도와준다. 예외 처리에 집중 하다 보면, 비즈니스 로직에 집중하기 어렵고, 비즈니스 로직과 관련된 코드보다 예외 처리를 위한 코드가 더 많아지는 경우도 생기게 된다. 이런 문제를 조금이라도 개선하기 위해 @ExceptionHandler와 @ControllerAdvice를 사용한다.

## @ControllerAdvice 란?

@Controller나 @RestController에서 발생한 예외를 한 곳에서 관리하고 처리할 수 있게 도와주는 어노테이션이다. 즉 스프링에서 예외처리를 전역적으로 핸들링하기 위해 @ControllerAdvicde 어노테이션을 사용할 수 있다.

```java
@ControllerAdvice
public class ControllerExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(ControllerExceptionHandler.class);

    @ExceptionHandler(NoLoginException.class)
    public String noLoginException(Exception e, Model model) {
        model.addAttribute("errorMessage", e.getMessage());
        return "user/login_failed";
    }
}
```

위는 NoLoginException이 발생한 경우에 해당 에러메세지를 표시하는 페이지를 리턴해주도록 구현한 코드다. ControllerAdvice를 사용해서 아래의 형태로 응답을 줄수도 있다.

```java
@ExceptionHandler(AlreadyIncludeSharedNoteBookException.class)
public ResponseEntity alreadyIncludeShardNoteBook(AlreadyIncludeSharedNoteBookException exception) {
    log.debug("AlreadyIncludeSharedNoteBookException is happened!");
    ErrorDetails errorDetails = new ErrorDetails(new Date(), exception.getMessage());
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorDetails);
}
```

@RestControllerAdvice는 @ControllerAdvice+@ResponseBody의 역할을 한다.

```java
@RestControllerAdvice
public class RestExceptionHandler {
  @ResponseStatus(value = HttpStatus.UNAUTHORIZED)
  @ExceptionHandler(value = UnAuthorizedException.class)
  public Object handleUnAutorizedException(UnAuthorizedException e) {
    return new Object(e.getMessage());
  }
}
```

404 에러 같은 경우는 DispatcherServlet에서 발생하는 에러라서 핸들링 할 수 없다.
