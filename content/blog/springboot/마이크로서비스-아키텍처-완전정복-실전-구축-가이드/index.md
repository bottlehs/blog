---
templateKey: blog-post
title: 마이크로서비스 아키텍처 완전정복 - 실전 구축 가이드
date: 2025-11-15T00:00:00.000Z
category: springboot
description:
  마이크로서비스 아키텍처의 설계 원칙부터 실전 구현까지. Service Mesh(Istio), API Gateway(Kong), 분산 트레이싱(Jaeger), 서비스 디스커버리, 이벤트 기반 아키텍처, 데이터 일관성, 모니터링까지 엔터프라이즈급 마이크로서비스 시스템 구축의 모든 것을 다룹니다.
tags:
  - 마이크로서비스
  - Microservices
  - Service Mesh
  - API Gateway
  - 분산 시스템
  - Istio
  - Kong
  - Jaeger
  - Kubernetes
  - 이벤트 기반 아키텍처
  - Spring Cloud
---

# 마이크로서비스 아키텍처 완전정복 - 실전 구축 가이드

마이크로서비스 아키텍처는 대규모 애플리케이션을 독립적으로 배포 가능한 작은 서비스들로 분해하는 아키텍처 패턴이다. 각 서비스는 자체 데이터베이스를 가지며, API를 통해 통신한다. 이 글은 마이크로서비스 아키텍처를 설계하고 구축하는 실전 가이드를 제공한다.

## 1. 마이크로서비스 아키텍처 개요

### 1-1. 마이크로서비스란?

마이크로서비스는 다음과 같은 특징을 가진다:

- **독립적 배포**: 각 서비스를 독립적으로 배포하고 스케일링 가능
- **기술 다양성**: 서비스마다 다른 기술 스택 사용 가능
- **장애 격리**: 한 서비스의 장애가 전체 시스템에 영향을 주지 않음
- **팀 독립성**: 각 팀이 서비스를 독립적으로 개발 및 운영

### 1-2. 모놀리식 vs 마이크로서비스

| 구분 | 모놀리식 | 마이크로서비스 |
|------|----------|----------------|
| **배포** | 전체 애플리케이션 배포 | 서비스별 독립 배포 |
| **스케일링** | 전체 스케일링 | 서비스별 스케일링 |
| **기술 스택** | 단일 기술 스택 | 다양한 기술 스택 |
| **복잡도** | 낮음 | 높음 |
| **장애 격리** | 어려움 | 쉬움 |
| **개발 속도** | 초기 빠름 | 장기적으로 빠름 |

### 1-3. 마이크로서비스 도입 시기

마이크로서비스를 도입해야 하는 경우:

- ✅ 팀이 여러 개이고 독립적으로 개발하고 싶을 때
- ✅ 서비스별로 다른 스케일링 요구사항이 있을 때
- ✅ 기술 다양성이 필요할 때
- ✅ 장애 격리가 중요할 때

도입을 피해야 하는 경우:

- ❌ 작은 팀이나 프로젝트
- ❌ 명확한 도메인 경계가 없을 때
- ❌ 운영 인프라가 부족할 때

## 2. 마이크로서비스 설계 원칙

### 2-1. 도메인 주도 설계 (DDD)

서비스를 비즈니스 도메인에 따라 분리한다.

```
전자상거래 시스템 예시:

- User Service (사용자 관리)
- Product Service (상품 관리)
- Order Service (주문 처리)
- Payment Service (결제 처리)
- Inventory Service (재고 관리)
- Notification Service (알림)
```

### 2-2. 데이터베이스 per 서비스

각 서비스는 자체 데이터베이스를 가진다.

```yaml
# 서비스별 데이터베이스
User Service:
  Database: PostgreSQL (사용자 정보)

Product Service:
  Database: MongoDB (상품 카탈로그)

Order Service:
  Database: PostgreSQL (주문 정보)

Analytics Service:
  Database: ClickHouse (분석 데이터)
```

### 2-3. API First 설계

서비스를 설계할 때 먼저 API를 정의한다.

```yaml
# OpenAPI 스펙 예시
openapi: 3.0.0
info:
  title: User Service API
  version: 1.0.0

paths:
  /users:
    get:
      summary: Get all users
      responses:
        '200':
          description: List of users
    post:
      summary: Create user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/User'
      responses:
        '201':
          description: User created
```

## 3. 서비스 간 통신

### 3-1. 동기 통신 (REST/gRPC)

#### REST API

```java
// User Service
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUser(@PathVariable Long userId) {
        User user = userService.getUser(userId);
        return ResponseEntity.ok(user);
    }
}

// Order Service에서 User Service 호출
@Service
public class OrderService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    private static final String USER_SERVICE_URL = "http://user-service/api/users";
    
    public User getUser(Long userId) {
        return restTemplate.getForObject(
            USER_SERVICE_URL + "/" + userId,
            User.class
        );
    }
}
```

#### gRPC

```protobuf
// user.proto
syntax = "proto3";

package user;

service UserService {
  rpc GetUser(GetUserRequest) returns (UserResponse);
  rpc CreateUser(CreateUserRequest) returns (UserResponse);
}

message GetUserRequest {
  int64 user_id = 1;
}

message UserResponse {
  int64 id = 1;
  string name = 2;
  string email = 3;
}
```

```java
// gRPC 클라이언트
@Service
public class OrderService {
    
    @Autowired
    private UserServiceGrpc.UserServiceBlockingStub userServiceStub;
    
    public User getUser(Long userId) {
        GetUserRequest request = GetUserRequest.newBuilder()
            .setUserId(userId)
            .build();
        
        UserResponse response = userServiceStub.getUser(request);
        return convertToUser(response);
    }
}
```

### 3-2. 비동기 통신 (메시징)

#### Kafka를 활용한 이벤트 기반 아키텍처

```java
// Order Service - 이벤트 발행
@Service
public class OrderService {
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    public void createOrder(Order order) {
        // 주문 생성
        orderRepository.save(order);
        
        // 이벤트 발행
        OrderCreatedEvent event = new OrderCreatedEvent(
            order.getId(),
            order.getUserId(),
            order.getTotalAmount()
        );
        
        kafkaTemplate.send("order-created", event);
    }
}

// Payment Service - 이벤트 구독
@Component
public class PaymentEventListener {
    
    @KafkaListener(topics = "order-created")
    public void handleOrderCreated(OrderCreatedEvent event) {
        // 결제 처리
        processPayment(event.getOrderId(), event.getAmount());
    }
}

// Inventory Service - 이벤트 구독
@Component
public class InventoryEventListener {
    
    @KafkaListener(topics = "order-created")
    public void handleOrderCreated(OrderCreatedEvent event) {
        // 재고 차감
        decreaseInventory(event.getOrderId());
    }
}
```

## 4. API Gateway

### 4-1. API Gateway의 역할

- **라우팅**: 요청을 적절한 서비스로 라우팅
- **인증/인가**: 중앙화된 인증 처리
- **로드 밸런싱**: 트래픽 분산
- **레이트 리미팅**: API 호출 제한
- **로깅 및 모니터링**: 요청 추적

### 4-2. Kong API Gateway 설정

```yaml
# kong.yml
_format_version: "3.0"

services:
  - name: user-service
    url: http://user-service:8080
    routes:
      - name: user-route
        paths:
          - /api/users
        methods:
          - GET
          - POST
          - PUT
          - DELETE

  - name: product-service
    url: http://product-service:8080
    routes:
      - name: product-route
        paths:
          - /api/products

plugins:
  - name: rate-limiting
    config:
      minute: 100
      hour: 1000
  
  - name: cors
    config:
      origins:
        - "*"
      methods:
        - GET
        - POST
        - PUT
        - DELETE
```

### 4-3. Spring Cloud Gateway

```java
@Configuration
public class GatewayConfig {
    
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("user-service", r -> r
                .path("/api/users/**")
                .uri("lb://user-service"))
            .route("product-service", r -> r
                .path("/api/products/**")
                .uri("lb://product-service"))
            .route("order-service", r -> r
                .path("/api/orders/**")
                .filters(f -> f
                    .addRequestHeader("X-Request-Id", UUID.randomUUID().toString())
                    .circuitBreaker(c -> c
                        .setName("orderCircuitBreaker")
                        .setFallbackUri("forward:/fallback")))
                .uri("lb://order-service"))
            .build();
    }
    
    @Bean
    public GlobalFilter customGlobalFilter() {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            // 로깅, 인증 등 전역 처리
            return chain.filter(exchange);
        };
    }
}
```

## 5. Service Mesh (Istio)

### 5-1. Istio 개요

Service Mesh는 서비스 간 통신을 관리하는 인프라 레이어다.

**주요 기능:**
- 트래픽 관리 (로드 밸런싱, 라우팅)
- 보안 (mTLS, 인증)
- 관찰 가능성 (메트릭, 로깅, 트레이싱)
- 정책 적용

### 5-2. VirtualService와 DestinationRule

```yaml
# VirtualService - 트래픽 라우팅
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: user-service
spec:
  hosts:
    - user-service
  http:
    - match:
        - headers:
            version:
              exact: v2
      route:
        - destination:
            host: user-service
            subset: v2
          weight: 100
    - route:
        - destination:
            host: user-service
            subset: v1
          weight: 90
        - destination:
            host: user-service
            subset: v2
          weight: 10

---
# DestinationRule - 서비스 버전 정의
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: user-service
spec:
  host: user-service
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
  trafficPolicy:
    loadBalancer:
      simple: ROUND_ROBIN
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http1MaxPendingRequests: 10
        http2MaxRequests: 10
        maxRequestsPerConnection: 2
```

### 5-3. Circuit Breaker

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: order-service
spec:
  host: order-service
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http1MaxPendingRequests: 10
        maxRequestsPerConnection: 2
    outlierDetection:
      consecutiveErrors: 3
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
```

## 6. 서비스 디스커버리

### 6-1. Eureka (Netflix OSS)

```java
// Eureka Server
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}

// application.yml
server:
  port: 8761

eureka:
  instance:
    hostname: localhost
  client:
    registerWithEureka: false
    fetchRegistry: false
```

```java
// Eureka Client (서비스)
@SpringBootApplication
@EnableEurekaClient
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}

// application.yml
spring:
  application:
    name: user-service

eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
  instance:
    preferIpAddress: true
```

### 6-2. Consul

```yaml
# consul-config.yml
services:
  - name: user-service
    id: user-service-1
    address: user-service
    port: 8080
    check:
      http: http://user-service:8080/health
      interval: 10s
      timeout: 1s
```

## 7. 분산 트레이싱

### 7-1. Jaeger를 활용한 분산 트레이싱

```java
// Spring Cloud Sleuth + Zipkin/Jaeger
@Configuration
public class TracingConfig {
    
    @Bean
    public Sampler sampler() {
        return Sampler.create(0.1f); // 10% 샘플링
    }
}

// application.yml
spring:
  sleuth:
    sampler:
      probability: 0.1
    zipkin:
      base-url: http://jaeger:9411
```

```java
// 수동 트레이싱
@Service
public class OrderService {
    
    @Autowired
    private Tracer tracer;
    
    public void createOrder(Order order) {
        Span span = tracer.nextSpan()
            .name("create-order")
            .tag("order.id", order.getId().toString())
            .start();
        
        try (Tracer.SpanInScope ws = tracer.withSpanInScope(span)) {
            // 주문 생성 로직
            processOrder(order);
        } finally {
            span.end();
        }
    }
}
```

### 7-2. OpenTelemetry

```java
@Configuration
public class OpenTelemetryConfig {
    
    @Bean
    public OpenTelemetry openTelemetry() {
        return OpenTelemetrySdk.builder()
            .setTracerProvider(
                SdkTracerProvider.builder()
                    .addSpanProcessor(
                        BatchSpanProcessor.builder(
                            OtlpGrpcSpanExporter.builder()
                                .setEndpoint("http://jaeger:4317")
                                .build()
                        ).build()
                    )
                    .setResource(
                        Resource.getDefault()
                            .merge(Resource.builder()
                                .put(ResourceAttributes.SERVICE_NAME, "order-service")
                                .build())
                    )
                    .build()
            )
            .build();
    }
}
```

## 8. 데이터 일관성

### 8-1. Saga 패턴

```java
// Saga 오케스트레이터
@Component
public class OrderSagaOrchestrator {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private InventoryService inventoryService;
    
    @SagaOrchestrationStart
    public void createOrderSaga(CreateOrderCommand command) {
        Order order = orderService.createOrder(command);
        
        try {
            // 1. 재고 확인 및 차감
            inventoryService.reserveInventory(order);
            
            // 2. 결제 처리
            paymentService.processPayment(order);
            
            // 3. 주문 확정
            orderService.confirmOrder(order.getId());
            
        } catch (Exception e) {
            // 보상 트랜잭션
            compensate(order);
        }
    }
    
    private void compensate(Order order) {
        try {
            if (order.getStatus() == OrderStatus.PAYMENT_PROCESSED) {
                paymentService.refund(order);
            }
            if (order.getStatus() == OrderStatus.INVENTORY_RESERVED) {
                inventoryService.releaseInventory(order);
            }
            orderService.cancelOrder(order.getId());
        } catch (Exception e) {
            // 보상 실패 로깅 및 알림
            log.error("Compensation failed for order: {}", order.getId(), e);
        }
    }
}
```

### 8-2. 이벤트 소싱과 CQRS

```java
// 이벤트 저장소
@Entity
public class EventStore {
    @Id
    private String id;
    private String aggregateId;
    private String eventType;
    private String eventData;
    private LocalDateTime timestamp;
}

// 이벤트 발행
@Service
public class OrderService {
    
    @Autowired
    private EventStoreRepository eventStoreRepository;
    
    public void createOrder(Order order) {
        // 이벤트 저장
        OrderCreatedEvent event = new OrderCreatedEvent(
            order.getId(),
            order.getUserId(),
            order.getItems()
        );
        
        eventStoreRepository.save(EventStore.builder()
            .id(UUID.randomUUID().toString())
            .aggregateId(order.getId().toString())
            .eventType("OrderCreated")
            .eventData(serialize(event))
            .timestamp(LocalDateTime.now())
            .build());
        
        // 이벤트 발행
        eventPublisher.publish(event);
    }
}

// CQRS - 읽기 모델 업데이트
@Component
public class OrderReadModelUpdater {
    
    @EventListener
    public void handle(OrderCreatedEvent event) {
        // 읽기 모델 업데이트
        orderReadRepository.save(OrderReadModel.builder()
            .id(event.getOrderId())
            .userId(event.getUserId())
            .status("CREATED")
            .build());
    }
}
```

## 9. 모니터링과 관찰 가능성

### 9-1. Prometheus와 Grafana

```java
// 메트릭 수집
@Service
public class OrderService {
    
    private final Counter orderCounter;
    private final Timer orderProcessingTime;
    
    public OrderService(MeterRegistry meterRegistry) {
        this.orderCounter = Counter.builder("orders.total")
            .description("Total number of orders")
            .register(meterRegistry);
        
        this.orderProcessingTime = Timer.builder("orders.processing.time")
            .description("Order processing time")
            .register(meterRegistry);
    }
    
    public void createOrder(Order order) {
        Timer.Sample sample = Timer.start();
        try {
            // 주문 처리
            processOrder(order);
            orderCounter.increment();
        } finally {
            sample.stop(orderProcessingTime);
        }
    }
}
```

### 9-2. 분산 로깅 (ELK Stack)

```java
// 로깅 설정
@Configuration
public class LoggingConfig {
    
    @Bean
    public CorrelationIdFilter correlationIdFilter() {
        return new CorrelationIdFilter();
    }
}

@Component
public class CorrelationIdFilter implements Filter {
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                        FilterChain chain) throws IOException, ServletException {
        String correlationId = UUID.randomUUID().toString();
        MDC.put("correlationId", correlationId);
        
        try {
            chain.doFilter(request, response);
        } finally {
            MDC.clear();
        }
    }
}

// 로깅
@Slf4j
@Service
public class OrderService {
    
    public void createOrder(Order order) {
        log.info("Creating order: {}", order.getId(), 
                 kv("userId", order.getUserId()),
                 kv("amount", order.getTotalAmount()));
        
        try {
            processOrder(order);
            log.info("Order created successfully: {}", order.getId());
        } catch (Exception e) {
            log.error("Failed to create order: {}", order.getId(), e);
            throw e;
        }
    }
}
```

## 10. 보안

### 10-1. mTLS (Mutual TLS)

```yaml
# Istio PeerAuthentication
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
spec:
  mtls:
    mode: STRICT

---
# Istio AuthorizationPolicy
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: user-service-policy
spec:
  selector:
    matchLabels:
      app: user-service
  rules:
    - from:
        - source:
            principals: ["cluster.local/ns/default/sa/order-service"]
      to:
        - operation:
            methods: ["GET", "POST"]
```

### 10-2. JWT 인증

```java
// API Gateway에서 JWT 검증
@Component
public class JwtAuthenticationFilter implements GatewayFilter {
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String token = extractToken(request);
        
        if (token != null && validateToken(token)) {
            return chain.filter(exchange);
        }
        
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        return response.setComplete();
    }
    
    private boolean validateToken(String token) {
        try {
            Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}
```

## 11. 실전 배포 전략

### 11-1. Blue-Green 배포

```yaml
# Kubernetes Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service-blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
      version: blue
  template:
    metadata:
      labels:
        app: user-service
        version: blue
    spec:
      containers:
      - name: user-service
        image: user-service:v1.0.0
        ports:
        - containerPort: 8080

---
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
    version: blue  # blue에서 green으로 전환
  ports:
  - port: 80
    targetPort: 8080
```

### 11-2. 카나리 배포

```yaml
# Istio VirtualService - 카나리 배포
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: user-service
spec:
  hosts:
    - user-service
  http:
    - match:
        - headers:
            canary:
              exact: "true"
      route:
        - destination:
            host: user-service
            subset: v2
          weight: 100
    - route:
        - destination:
            host: user-service
            subset: v1
          weight: 90
        - destination:
            host: user-service
            subset: v2
          weight: 10
```

## 12. 결론

마이크로서비스 아키텍처는 복잡하지만 강력한 아키텍처 패턴이다. 이 글에서 다룬 내용:

1. **설계 원칙**: DDD, 데이터베이스 per 서비스, API First
2. **서비스 통신**: REST, gRPC, 메시징 (Kafka)
3. **API Gateway**: Kong, Spring Cloud Gateway
4. **Service Mesh**: Istio를 활용한 트래픽 관리
5. **서비스 디스커버리**: Eureka, Consul
6. **분산 트레이싱**: Jaeger, OpenTelemetry
7. **데이터 일관성**: Saga 패턴, 이벤트 소싱
8. **모니터링**: Prometheus, Grafana, ELK
9. **보안**: mTLS, JWT
10. **배포 전략**: Blue-Green, 카나리

이러한 기술들을 조합하면 확장 가능하고 견고한 마이크로서비스 시스템을 구축할 수 있다.

## 참고 자료

- [마이크로서비스 패턴 (책)](https://microservices.io/patterns/)
- [Istio 공식 문서](https://istio.io/)
- [Kong 문서](https://docs.konghq.com/)
- [Spring Cloud 문서](https://spring.io/projects/spring-cloud)

