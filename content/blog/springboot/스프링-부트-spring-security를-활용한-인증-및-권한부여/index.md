---
templateKey: blog-post
title: 스프링 부트 Spring Security를 활용한 인증 및 권한부여
date: 2021-04-08T22:19:29.537Z
category: springboot
description: 스프링 시큐리티는 스프링 기반의 애플리케이션의 보안(인증과 권한,인가 등)을 담당하는 스프링 하위 프레임워크이다. 주로 서블릿 필터와 이들로 구성된 필터체인으로의 위임모델을 사용한다. 그리고 보안과 관련해서 체계적으로 많은 옵션을 제공해주기 때문에 개발자 입장에서는 일일이 보안관련 로직을 작성하지 않아도 된다.
tags:
  - 스프링
  - 스프링부트
  - Spring
  - SpringBoot
  - Java
  - 프레임워크
  - 스프링부트구조
  - 아키텍쳐
  - Spring Security
---

![스프링 부트 Spring Security를 활용한 인증 및 권한부여](/assets/springboot.png "스프링 부트 Spring Security를 활용한 인증 및 권한부여")

## Spring Security(스프링 시큐리티)

스프링 시큐리티는 스프링 기반의 애플리케이션의 보안(인증과 권한,인가 등)을 담당하는 스프링 하위 프레임워크이다. 주로 서블릿 필터와 이들로 구성된 필터체인으로의 위임모델을 사용한다. 그리고 보안과 관련해서 체계적으로 많은 옵션을 제공해주기 때문에 개발자 입장에서는 일일이 보안관련 로직을 작성하지 않아도 된다.

## 보안 용어

스프링 시큐리티를 접하기 이전 밑에서 나열할 보안 용어들은 정말 필수로 숙지하면 도움이 된다.

- 접근 주체(Principal) : 보호된 리소스에 접근하는 대상
- 인증(Authentication) : 보호된 리소스에 접근한 대상에 대해 이 유저가 누구인지, 애플리케이션의 작업을 수행해도 되는 주체인지 확인하는 과정(ex. Form 기반 Login)
- 인가(Authorize) : 해당 리소스에 대해 접근 가능한 권한을 가지고 있는지 확인하는 과정(After Authentication, 인증 이후)
- 권한 : 어떠한 리소스에 대한 접근 제한, 모든 리소스는 접근 제어 권한이 걸려있다. 즉, 인가 과정에서 해당 리소스에 대한 제한된 최소한의 권한을 가졌는지 확인.

## 인증 아키텍쳐

아래는 Form 로그인에 대한 플로우 이다.

### Spring Security Authentication Architecture

![Spring Security Authentication Architecture](/assets/spring-security-authentication-architecture.png "Spring Security Authentication Architecture")

1. 사용자가 Form을 통해 로그인 정보를 입력하고 인증 요청을 보낸다.
2. AuthenticationFilter(사용할 구현체 UsernamePasswordAuthenticationFilter)가 HttpServletRequest에서 사용자가 보낸 아이디와 패스워드를 인터셉트한다. 프론트 단에서 유효성검사를 할 수도 있지만, 안전을 위해서 다시 한번 사용자가 보낸 아이디와 패스워드의 유효성 검사를 한다. HttpServletRequest에서 꺼내온 사용자 아이디와 패스워드를 진짜 인증을 담당할 AuthenticationManager 인터페이스(구현체 - ProviderManager)에게 인증용 객체(UsernamePasswordAuthenticationToken)로 만들어줘서 위임한다.
3. AuthenticationFilter에게 인증용 객체(UsernamePasswordAuthenticationToken)을 전달받는다.
4. 실제 인증을 할 AuthenticationProvider에게 Authentication객체(UsernamePasswordAuthenticationToken)을 다시 전달한다.
5. DB에서 사용자 인증 정보를 가져올 UserDetailsService 객체에게 사용자 아이디를 넘겨주고 DB에서 인증에 사용할 사용자 정보(사용자 아이디, 암호화된 패스워드, 권한 등)를 UserDetails(인증용 객체와 도메인 객체를 분리하지 않기 위해서 실제 사용되는 도메인 객체에 UserDetails를 상속하기도 한다.)라는 객체로 전달 받는다.
6. AuthenticationProvider는 UserDetails 객체를 전달 받은 이후 실제 사용자의 입력정보와 UserDetails 객체를 가지고 인증을 시도한다.
7. 8. 9. 10. 인증이 완료되면 사용자 정보를 가진 Authentication 객체를 SecurityContextHolder에 담은 이후 AuthenticationSuccessHandle를 실행한다.(실패시 AuthenticationFailureHandler를 실행한다.)

### Spring Security Filter

![Spring Security Filter](/assets/spring-security-filter.png "Spring Security Filter")

- SecurityContextPersistenceFilter : SecurityContextRepository에서 SecurityContext를 가져오거나 저장하는 역할을 한다.
- LogoutFilter : 설정된 로그아웃 URL로 오는 요청을 감시하며, 해당 유저를 로그아웃 처리
- (UsernamePassword)AuthenticationFilter : (아이디와 비밀번호를 사용하는 form 기반 인증) 설정된 로그인 URL로 오는 요청을 감시하며, 유저 인증 처리
  - AuthenticationManager를 통한 인증 실행
  - 인증 성공 시, 얻은 Authentication 객체를 SecurityContext에 저장 후 AuthenticationSuccessHandler 실행
  - 인증 실패 시, AuthenticationFailureHandler 실행
- DefaultLoginPageGeneratingFilter : 인증을 위한 로그인폼 URL을 감시한다.
- BasicAuthenticationFilter : HTTP 기본 인증 헤더를 감시하여 처리한다.
- RequestCacheAwareFilter : 로그인 성공 후, 원래 요청 정보를 재구성하기 위해 사용된다.
- SecurityContextHolderAwareRequestFilter : HttpServletRequestWrapper를 상속한 SecurityContextHolderAwareRequestWapper 클래스로 HttpServletRequest 정보를 감싼다. SecurityContextHolderAwareRequestWrapper 클래스는 필터 체인상의 다음 필터들에게 부가정보를 제공한다.
- AnonymousAuthenticationFilter : 이 필터가 호출되는 시점까지 사용자 정보가 인증되지 않았다면 인증토큰에 사용자가 익명 사용자로 나타난다.
- SessionManagementFilter : 이 필터는 인증된 사용자와 관련된 모든 세션을 추적한다.
- ExceptionTranslationFilter : 이 필터는 보호된 요청을 처리하는 중에 발생할 수 있는 예외를 위임하거나 전달하는 역할을 한다.
- FilterSecurityInterceptor : 이 필터는 AccessDecisionManager 로 권한부여 처리를 위임함으로써 접근 제어 결정을 쉽게해준다.

### Authentication

접근 주체는 Authentication 객체를 생성한다. 이 객체는 SecurityContext(내부 메모리)에 보관되고 사용되어진다.

```java
public interface Authentication extends Principal, Serializable {
    Collection<? extends GrantedAuthority> getAuthorities(); // Authentication 저장소에 의해 인증된 사용자의 권한 목록
    Object getCredentials(); // 비밀번호
    Object getDetails(); // 사용자 상세정보
    Object getPrincipal(); // ID
    boolean isAuthenticated(); //인증 여부
    void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException;
}
```

### AuthenticationManager

![Spring Security Authentication Manager](/assets/spring-security-authentication-manager.png "Spring Security Authentication Manager")

유저의 요청을 AuthenticationFilter에서 Authentication 객체로 변환해 AuthenticationManager(ProviderManager)에게 넘겨주고, AuthenticationProvider(DaoAuthenticationProvider)가 실제 인증을 한 이후에 인증이 완료되면 Authentication객체를 반환해준다.

- AbstractAuthenticationProcessingFilter : 웹 기반 인증요청에서 사용되는 컴포넌트로 POST 폼 데이터를 포함하는 요청을 처리한다. 사용자 비밀번호를 다른 필터로 전달하기 위해서 Authentication 객체를 생성하고 일부 프로퍼티를 설정한다.
- AuthenticationManager : 인증요청을 받고 Authentication을 채워준다.
- AuthenticationProvider : 실제 인증이 일어나고 만약 인증 성공시 Authentication 객체의 authenticated = true로 설정해준다.

Spring Security 는 ProviderManager 라는 AuthenticationManager 인터페이스의 유일한 구현체를 제공한다. ProviderManager 는 하나 또는 여러 개의 AuthenticationProvider 구현체를 사용할 수 있다. AuthenticationProvider는 많이 사용되고 ProviderManager(AuthenticationManager 의 구현체) 와도 잘 통합되기 때문에 기본적으로 어떻게 동작하는 지 이해하는 것이 중요하다.

### Password Authentication

![Spring Security Password Authentication](/assets/spring-security-password-authentication.png "Spring Security Password Authentication")

DaoAuthenticationProvider 는 UserDetailsService 타입 오브젝트로 위임한다. UserDetailsService 는 UserDetails 구현체를 리턴하는 역할을 한다. UserDetails 인터페이스는 이전에 설명한 Authentication 인터페이스와 상당히 유사하지만 서로 다른 목적을 가진 인터페이스이므로 헷갈리면 안된다.

- Authentication : 사용자 ID, 패스워드와 인증 요청 컨텍스트에 대한 정보를 가지고 있다. 인증 이후의 사용자 상세정보와 같은 UserDetails 타입 오브젝트를 포함할 수도 있다.
- UserDetails : 이름, 이메일, 전화번호와 같은 사용자 프로파일 정보를 저장하기 위한 용도로 사용한다.

### Authentication Exception

인증과 관련된 모든 예외는 AuthenticationException 을 상속한다. AuthenticationException 은 개발자에게 상세한 디버깅 정보를 제공하기위한 두개의 멤버 필드를 가지고 있다.

- authentication : 인증 요청관련 Authentication 객체를 저장하고 있다.
- extraInformation : 인증 예외 관련 부가 정보를 저장한다. 예를 들어 UsernameNotFoundException 예외는 인증에 실패한 유저의 id 정보를 저장하고 있다.

## 구현

Spring Security 를 활용한 예제를 구현할 것이다.

### 사전 세팅

프로젝트에서 사용할 Dependency들을 build.gradle에 추가한다.

```groovy
dependencies {
    implementation 'org.mariadb.jdbc:mariadb-java-client'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'

    implementation 'org.springframework.boot:spring-boot-starter-security'

    implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
    implementation 'org.springframework.boot:spring-boot-starter-web'

    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'

    testImplementation('org.springframework.boot:spring-boot-starter-test') {
        exclude group: 'org.junit.vintage', module: 'junit-vintage-engine'
    }
    testImplementation 'org.springframework.security:spring-security-test'
}
```

정적 자원을 제공하는 클래스를 생성하여 아래와 같이 설정한다.

```java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private static final String[] CLASSPATH_RESOURCE_LOCATIONS = { "classpath:/static/", "classpath:/public/", "classpath:/",
            "classpath:/resources/", "classpath:/META-INF/resources/", "classpath:/META-INF/resources/webjars/" };

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // /에 해당하는 url mapping을 /common/test로 forward한다.
        registry.addViewController( "/" ).setViewName( "forward:/index" );
        // 우선순위를 가장 높게 잡는다.
        registry.setOrder(Ordered.HIGHEST_PRECEDENCE);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**").addResourceLocations(CLASSPATH_RESOURCE_LOCATIONS);
    }

}
```

SpringSecurity에 대한 기본적인 설정들을 추가한다. SpringSecurity에 대한 설정 클래스에서는 아래와 같이 설정 한다.

- configure 메소드를 통해 정적 자원들에 대해서는 Security를 적용하지 않음을 추가한다.
- configure 메소드를 통해 어떤 요청에 대해서는 로그인을 요구하고, 어떤 요청에 대해서 로그인을 요구하지 않을지 설정한다.
- form 기반의 로그인을 활용하는 경우 로그인 URL, 로그인 성공시 전달할 URL, 로그인 실패 URL 등에 대해서 설정한다.

```java
package com.mang.example.security.config.security;

import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    // 정적 자원에 대해서는 Security 설정을 적용하지 않음.
    @Override
    public void configure(WebSecurity web) {
        web.ignoring().requestMatchers(PathRequest.toStaticResources().atCommonLocations());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable().authorizeRequests()
                // /about 요청에 대해서는 로그인을 요구함
                .antMatchers("/about").authenticated()
                // /admin 요청에 대해서는 ROLE_ADMIN 역할을 가지고 있어야 함
                .antMatchers("/admin").hasRole("ADMIN")
                // 나머지 요청에 대해서는 로그인을 요구하지 않음
                .anyRequest().permitAll()
                .and()
                // 로그인하는 경우에 대해 설정함
            .formLogin()
                // 로그인 페이지를 제공하는 URL을 설정함
                .loginPage("/user/loginView")
                // 로그인 성공 URL을 설정함
                .successForwardUrl("/index")
                // 로그인 실패 URL을 설정함
                .failureForwardUrl("/index")
                .permitAll()
                .and()
                .addFilterBefore(customAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
```

`/about` 에 대해서는 로그인이 성공한 경우에만 접근가능하고, `/admin`에 대해서는 로그인 후에 ROLE_ADMIN 역할을 갖고 있는 경우에만 접근가능하도록 설정해준다.

### 로그인 요청

사용자는 로그인 하기 위해 아이디와 비밀번호를 입력해서 로그인 요청을 하게 된다.

### UserPasswordAuthenticationToken 발급

전송이 오면 AuthenticationFilter로 요청이 먼저 오게 되고, 아이디와 비밀번호를 기반으로 UserPasswordAuthenticationToken을 발급해준다.

```java
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Log4j2
public class CustomAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    public CustomAuthenticationFilter(AuthenticationManager authenticationManager) {
        super.setAuthenticationManager(authenticationManager);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(request.getParameter("userEmail"), request.getParameter("userPw"));
        setDetails(request, authRequest);
        return this.getAuthenticationManager().authenticate(authRequest);
    }

}
```

제작한 Filter를 이제 적용시켜야 하므로 UsernamePasswordAuthenticationFilter 필터 이전에 적용시켜야 한다. 그리고 해당 CustomAuthenticationFilter가 수행된 후에 처리될 Handler 역시 Bean으로 등록하고 CustomAuthenticationFilter의 핸들러로 추가해주어야 하는데, 해당 코드들은 WebSecurityConfig에 아래와 같이 추가해줄 수 있다.

```java
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class CustomLoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        SecurityContextHolder.getContext().setAuthentication(authentication);
        response.sendRedirect("/about");
    }

}
```

CustomLoginSuccessHandler는 AuthenticationProvider를 통해 인증이 성공될 경우 처리되는데, 이번 예제에서는 /about 요청으로 redirect되도록 해준다. 그리고 토큰을 사용하지 않고 세션을 활용하는 지금 예제같은 경우에는 성공하여 반환된 Authentication 객체를 SecurityContextHolder의 Contetx에 저장해준다. 나중에 사용자의 정보를 꺼낼 경우에도 SecurityContextHolder의 context에서 조회하면 된다.

```java
package com.mang.example.security.config.security;

import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    // 정적 자원에 대해서는 Security 설정을 적용하지 않음.
    @Override
    public void configure(WebSecurity web) {
        web.ignoring().requestMatchers(PathRequest.toStaticResources().atCommonLocations());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable().authorizeRequests()
                // /about 요청에 대해서는 로그인을 요구함
                .antMatchers("/about").authenticated()
                // /admin 요청에 대해서는 ROLE_ADMIN 역할을 가지고 있어야 함
                .antMatchers("/admin").hasRole("ADMIN")
                // 나머지 요청에 대해서는 로그인을 요구하지 않음
                .anyRequest().permitAll()
                .and()
                // 로그인하는 경우에 대해 설정함
            .formLogin()
                // 로그인 페이지를 제공하는 URL을 설정함
                .loginPage("/user/loginView")
                // 로그인 성공 URL을 설정함
                .successForwardUrl("/index")
                // 로그인 실패 URL을 설정함
                .failureForwardUrl("/index")
                .permitAll()
                .and()
                .addFilterBefore(customAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CustomAuthenticationFilter customAuthenticationFilter() throws Exception {
        CustomAuthenticationFilter customAuthenticationFilter = new CustomAuthenticationFilter(authenticationManager());
        customAuthenticationFilter.setFilterProcessesUrl("/user/login");
        customAuthenticationFilter.setAuthenticationSuccessHandler(customLoginSuccessHandler());
        customAuthenticationFilter.afterPropertiesSet();
        return customAuthenticationFilter;
    }

    @Bean
    public CustomLoginSuccessHandler customLoginSuccessHandler() {
        return new CustomLoginSuccessHandler();
    }

}
```

CustomAuthenticationFilter를 빈으로 등록하는 과정에서 UserName파라미터와 UserPassword파라미터를 설정할 수 있다. 이러한 과정을 거치면 UsernamePasswordToken이 발급되게 된다.

자세한 소스 코드는 "https://github.com/bottlehs/springboot-vue-starter-kit" 참고 하길 바란다.
