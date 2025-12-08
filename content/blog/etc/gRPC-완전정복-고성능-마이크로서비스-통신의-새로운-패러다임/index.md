---
templateKey: blog-post
title: gRPC 완전정복 - 고성능 마이크로서비스 통신의 새로운 패러다임
date: 2025-12-07T00:00:00.000Z
category: etc
description:
  gRPC 기초부터 고급 활용까지. Protocol Buffers, 스트리밍, 인터셉터, 에러 처리, Spring Boot 통합, 성능 최적화까지 실무에서 바로 사용할 수 있는 완벽한 가이드를 제공합니다.
tags:
  - gRPC
  - Protocol Buffers
  - 마이크로서비스
  - 고성능 통신
  - RPC
  - 스트리밍
  - Spring Boot
  - 분산 시스템
---

# gRPC 완전정복 - 고성능 마이크로서비스 통신의 새로운 패러다임

gRPC는 Google이 개발한 고성능 오픈소스 RPC(Remote Procedure Call) 프레임워크다. HTTP/2 기반의 바이너리 프로토콜을 사용하며, Protocol Buffers를 통해 효율적인 직렬화를 제공한다. 이 글은 gRPC를 활용한 마이크로서비스 통신의 모든 것을 다룬다.

## 1. gRPC 개요와 시작하기

### 1-1. gRPC의 특징

- **고성능**: HTTP/2와 Protocol Buffers를 사용한 효율적인 통신
- **다양한 언어 지원**: Java, Python, Go, C++, JavaScript 등
- **스트리밍 지원**: 단방향, 양방향 스트리밍
- **타입 안전성**: Protocol Buffers를 통한 강력한 타입 시스템
- **자동 코드 생성**: .proto 파일로부터 클라이언트/서버 코드 자동 생성

### 1-2. REST API vs gRPC

| 구분 | REST API | gRPC |
|------|----------|------|
| **프로토콜** | HTTP/1.1 | HTTP/2 |
| **데이터 형식** | JSON (텍스트) | Protocol Buffers (바이너리) |
| **성능** | 상대적으로 느림 | 매우 빠름 |
| **스트리밍** | 제한적 (SSE, WebSocket) | 네이티브 지원 |
| **브라우저 지원** | 완벽 | 제한적 (gRPC-Web 필요) |
| **코드 생성** | 수동 | 자동 |

### 1-3. Protocol Buffers 기본

```protobuf
// user.proto
syntax = "proto3";

package user;

option java_package = "com.example.user";
option java_outer_classname = "UserProto";

// 사용자 메시지 정의
message User {
  int64 id = 1;
  string name = 2;
  string email = 3;
  int32 age = 4;
  repeated string tags = 5; // 배열
  map<string, string> metadata = 6; // 맵
  UserRole role = 7; // 열거형
}

// 열거형
enum UserRole {
  UNKNOWN = 0;
  USER = 1;
  ADMIN = 2;
  GUEST = 3;
}

// 요청/응답 메시지
message GetUserRequest {
  int64 user_id = 1;
}

message GetUserResponse {
  User user = 1;
}

message CreateUserRequest {
  string name = 1;
  string email = 2;
  int32 age = 3;
}

message CreateUserResponse {
  User user = 1;
}

// 서비스 정의
service UserService {
  // 단순 RPC
  rpc GetUser(GetUserRequest) returns (GetUserResponse);
  
  // 서버 스트리밍
  rpc ListUsers(ListUsersRequest) returns (stream User);
  
  // 클라이언트 스트리밍
  rpc CreateUsers(stream CreateUserRequest) returns (CreateUsersResponse);
  
  // 양방향 스트리밍
  rpc ChatUsers(stream ChatMessage) returns (stream ChatMessage);
}
```

## 2. Spring Boot에서 gRPC 구현

### 2-1. 의존성 설정

```xml
<!-- pom.xml -->
<dependencies>
    <dependency>
        <groupId>net.devh</groupId>
        <artifactId>grpc-server-spring-boot-starter</artifactId>
        <version>2.15.0.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>net.devh</groupId>
        <artifactId>grpc-client-spring-boot-starter</artifactId>
        <version>2.15.0.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>io.grpc</groupId>
        <artifactId>grpc-protobuf</artifactId>
        <version>1.58.0</version>
    </dependency>
    <dependency>
        <groupId>io.grpc</groupId>
        <artifactId>grpc-stub</artifactId>
        <version>1.58.0</version>
    </dependency>
</dependencies>

<build>
    <extensions>
        <extension>
            <groupId>kr.motd.maven</groupId>
            <artifactId>os-maven-plugin</artifactId>
            <version>1.7.1</version>
        </extension>
    </extensions>
    <plugins>
        <plugin>
            <groupId>org.xolstice.maven.plugins</groupId>
            <artifactId>protobuf-maven-plugin</artifactId>
            <version>0.6.1</version>
            <configuration>
                <protocArtifact>com.google.protobuf:protoc:3.24.0:exe:${os.detected.classifier}</protocArtifact>
                <pluginId>grpc-java</pluginId>
                <pluginArtifact>io.grpc:protoc-gen-grpc-java:1.58.0:exe:${os.detected.classifier}</pluginArtifact>
            </configuration>
            <executions>
                <execution>
                    <goals>
                        <goal>compile</goal>
                        <goal>compile-custom</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

```yaml
# application.yml
grpc:
  server:
    port: 9090
  client:
    user-service:
      address: 'static://localhost:9090'
      negotiationType: plaintext
```

### 2-2. gRPC 서버 구현

```java
// UserServiceImpl.java
@GrpcService
public class UserServiceImpl extends UserServiceGrpc.UserServiceImplBase {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public void getUser(GetUserRequest request, 
                       StreamObserver<GetUserResponse> responseObserver) {
        try {
            Long userId = request.getUserId();
            UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> Status.NOT_FOUND
                    .withDescription("User not found")
                    .asRuntimeException());
            
            User user = User.newBuilder()
                .setId(userEntity.getId())
                .setName(userEntity.getName())
                .setEmail(userEntity.getEmail())
                .setAge(userEntity.getAge())
                .setRole(UserRole.valueOf(userEntity.getRole().name()))
                .build();
            
            GetUserResponse response = GetUserResponse.newBuilder()
                .setUser(user)
                .build();
            
            responseObserver.onNext(response);
            responseObserver.onCompleted();
            
        } catch (Exception e) {
            responseObserver.onError(Status.INTERNAL
                .withDescription(e.getMessage())
                .asRuntimeException());
        }
    }
    
    @Override
    public void createUser(CreateUserRequest request,
                          StreamObserver<CreateUserResponse> responseObserver) {
        try {
            UserEntity userEntity = new UserEntity();
            userEntity.setName(request.getName());
            userEntity.setEmail(request.getEmail());
            userEntity.setAge(request.getAge());
            userEntity = userRepository.save(userEntity);
            
            User user = convertToProto(userEntity);
            
            CreateUserResponse response = CreateUserResponse.newBuilder()
                .setUser(user)
                .build();
            
            responseObserver.onNext(response);
            responseObserver.onCompleted();
            
        } catch (Exception e) {
            responseObserver.onError(Status.INTERNAL
                .withDescription(e.getMessage())
                .asRuntimeException());
        }
    }
}
```

### 2-3. gRPC 클라이언트 구현

```java
// UserServiceClient.java
@Service
public class UserServiceClient {
    
    @GrpcClient("user-service")
    private UserServiceGrpc.UserServiceBlockingStub blockingStub;
    
    @GrpcClient("user-service")
    private UserServiceGrpc.UserServiceStub asyncStub;
    
    public User getUser(Long userId) {
        GetUserRequest request = GetUserRequest.newBuilder()
            .setUserId(userId)
            .build();
        
        GetUserResponse response = blockingStub.getUser(request);
        return response.getUser();
    }
    
    public CompletableFuture<User> getUserAsync(Long userId) {
        GetUserRequest request = GetUserRequest.newBuilder()
            .setUserId(userId)
            .build();
        
        CompletableFuture<User> future = new CompletableFuture<>();
        
        asyncStub.getUser(request, new StreamObserver<GetUserResponse>() {
            @Override
            public void onNext(GetUserResponse response) {
                future.complete(response.getUser());
            }
            
            @Override
            public void onError(Throwable t) {
                future.completeExceptionally(t);
            }
            
            @Override
            public void onCompleted() {
                // 이미 onNext에서 완료 처리
            }
        });
        
        return future;
    }
}
```

## 3. 스트리밍

### 3-1. 서버 스트리밍

```protobuf
// .proto
service UserService {
  rpc ListUsers(ListUsersRequest) returns (stream User);
}

message ListUsersRequest {
  int32 page = 1;
  int32 page_size = 2;
}
```

```java
// 서버 구현
@Override
public void listUsers(ListUsersRequest request,
                     StreamObserver<User> responseObserver) {
    try {
        int page = request.getPage();
        int pageSize = request.getPageSize();
        
        Pageable pageable = PageRequest.of(page, pageSize);
        Page<UserEntity> users = userRepository.findAll(pageable);
        
        for (UserEntity userEntity : users.getContent()) {
            User user = convertToProto(userEntity);
            responseObserver.onNext(user);
        }
        
        responseObserver.onCompleted();
        
    } catch (Exception e) {
        responseObserver.onError(Status.INTERNAL
            .withDescription(e.getMessage())
            .asRuntimeException());
    }
}

// 클라이언트 구현
public List<User> listUsers(int page, int pageSize) {
    ListUsersRequest request = ListUsersRequest.newBuilder()
        .setPage(page)
        .setPageSize(pageSize)
        .build();
    
    List<User> users = new ArrayList<>();
    
    blockingStub.listUsers(request).forEachRemaining(response -> {
        users.add(response);
    });
    
    return users;
}
```

### 3-2. 클라이언트 스트리밍

```protobuf
// .proto
service UserService {
  rpc CreateUsers(stream CreateUserRequest) returns (CreateUsersResponse);
}

message CreateUsersResponse {
  int32 created_count = 1;
  repeated User users = 2;
}
```

```java
// 서버 구현
@Override
public StreamObserver<CreateUserRequest> createUsers(
    StreamObserver<CreateUsersResponse> responseObserver) {
    
    return new StreamObserver<CreateUserRequest>() {
        private List<User> createdUsers = new ArrayList<>();
        
        @Override
        public void onNext(CreateUserRequest request) {
            UserEntity userEntity = new UserEntity();
            userEntity.setName(request.getName());
            userEntity.setEmail(request.getEmail());
            userEntity.setAge(request.getAge());
            userEntity = userRepository.save(userEntity);
            
            User user = convertToProto(userEntity);
            createdUsers.add(user);
        }
        
        @Override
        public void onError(Throwable t) {
            responseObserver.onError(t);
        }
        
        @Override
        public void onCompleted() {
            CreateUsersResponse response = CreateUsersResponse.newBuilder()
                .setCreatedCount(createdUsers.size())
                .addAllUsers(createdUsers)
                .build();
            
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        }
    };
}

// 클라이언트 구현
public CreateUsersResponse createUsers(List<CreateUserRequest> requests) {
    StreamObserver<CreateUserRequest> requestObserver = 
        asyncStub.createUsers(new StreamObserver<CreateUsersResponse>() {
            @Override
            public void onNext(CreateUsersResponse response) {
                // 응답 처리
            }
            
            @Override
            public void onError(Throwable t) {
                // 에러 처리
            }
            
            @Override
            public void onCompleted() {
                // 완료 처리
            }
        });
    
    for (CreateUserRequest request : requests) {
        requestObserver.onNext(request);
    }
    
    requestObserver.onCompleted();
    
    // 실제로는 CompletableFuture 등을 사용하여 응답을 기다림
    return null; // 예시
}
```

### 3-3. 양방향 스트리밍

```protobuf
// .proto
service ChatService {
  rpc Chat(stream ChatMessage) returns (stream ChatMessage);
}

message ChatMessage {
  string user_id = 1;
  string message = 2;
  int64 timestamp = 3;
}
```

```java
// 서버 구현
@Override
public StreamObserver<ChatMessage> chat(
    StreamObserver<ChatMessage> responseObserver) {
    
    return new StreamObserver<ChatMessage>() {
        @Override
        public void onNext(ChatMessage message) {
            // 메시지 수신 처리
            String userId = message.getUserId();
            String text = message.getMessage();
            
            // 응답 메시지 생성
            ChatMessage response = ChatMessage.newBuilder()
                .setUserId("server")
                .setMessage("Echo: " + text)
                .setTimestamp(System.currentTimeMillis())
                .build();
            
            responseObserver.onNext(response);
        }
        
        @Override
        public void onError(Throwable t) {
            responseObserver.onError(t);
        }
        
        @Override
        public void onCompleted() {
            responseObserver.onCompleted();
        }
    };
}
```

## 4. 인터셉터와 미들웨어

### 4-1. 서버 인터셉터

```java
// LoggingServerInterceptor.java
@GrpcGlobalServerInterceptor
public class LoggingServerInterceptor implements ServerInterceptor {
    
    private static final Logger logger = LoggerFactory.getLogger(
        LoggingServerInterceptor.class);
    
    @Override
    public <ReqT, RespT> ServerCall.Listener<ReqT> interceptCall(
        ServerCall<ReqT, RespT> call,
        Metadata headers,
        ServerCallHandler<ReqT, RespT> next) {
        
        String methodName = call.getMethodDescriptor().getFullMethodName();
        logger.info("gRPC call: {}", methodName);
        
        return next.startCall(new ForwardingServerCall.SimpleForwardingServerCall<ReqT, RespT>(call) {
            @Override
            public void sendMessage(RespT message) {
                logger.info("Response sent for method: {}", methodName);
                super.sendMessage(message);
            }
        }, headers);
    }
}
```

### 4-2. 인증 인터셉터

```java
// AuthenticationServerInterceptor.java
@GrpcGlobalServerInterceptor
public class AuthenticationServerInterceptor implements ServerInterceptor {
    
    @Override
    public <ReqT, RespT> ServerCall.Listener<ReqT> interceptCall(
        ServerCall<ReqT, RespT> call,
        Metadata headers,
        ServerCallHandler<ReqT, RespT> next) {
        
        String token = headers.get(Metadata.Key.of("authorization", 
            Metadata.ASCII_STRING_MARSHALLER));
        
        if (token == null || !isValidToken(token)) {
            call.close(Status.UNAUTHENTICATED
                .withDescription("Invalid or missing token"),
                new Metadata());
            return new ServerCall.Listener<ReqT>() {};
        }
        
        // 토큰에서 사용자 정보 추출
        String userId = extractUserId(token);
        Context context = Context.current()
            .withValue(USER_ID_KEY, userId);
        
        return Contexts.interceptCall(context, call, headers, next);
    }
    
    private boolean isValidToken(String token) {
        // 토큰 검증 로직
        return true;
    }
    
    private String extractUserId(String token) {
        // 토큰에서 사용자 ID 추출
        return "user123";
    }
    
    private static final Context.Key<String> USER_ID_KEY = 
        Context.key("userId");
}
```

### 4-3. 클라이언트 인터셉터

```java
// LoggingClientInterceptor.java
@GrpcGlobalClientInterceptor
public class LoggingClientInterceptor implements ClientInterceptor {
    
    private static final Logger logger = LoggerFactory.getLogger(
        LoggingClientInterceptor.class);
    
    @Override
    public <ReqT, RespT> ClientCall<ReqT, RespT> interceptCall(
        MethodDescriptor<ReqT, RespT> method,
        CallOptions callOptions,
        Channel next) {
        
        return new ForwardingClientCall.SimpleForwardingClientCall<ReqT, RespT>(
            next.newCall(method, callOptions)) {
            
            @Override
            public void sendMessage(ReqT message) {
                logger.info("Request sent to method: {}", 
                    method.getFullMethodName());
                super.sendMessage(message);
            }
            
            @Override
            public void start(Listener<RespT> responseListener, Metadata headers) {
                super.start(new ForwardingClientCallListener.SimpleForwardingClientCallListener<RespT>(
                    responseListener) {
                    @Override
                    public void onMessage(RespT message) {
                        logger.info("Response received from method: {}", 
                            method.getFullMethodName());
                        super.onMessage(message);
                    }
                }, headers);
            }
        };
    }
}
```

## 5. 에러 처리

### 5-1. 상태 코드와 에러 처리

```java
// 에러 처리 예시
@Override
public void getUser(GetUserRequest request,
                   StreamObserver<GetUserResponse> responseObserver) {
    try {
        Long userId = request.getUserId();
        
        if (userId <= 0) {
            responseObserver.onError(Status.INVALID_ARGUMENT
                .withDescription("User ID must be positive")
                .asRuntimeException());
            return;
        }
        
        UserEntity userEntity = userRepository.findById(userId)
            .orElseThrow(() -> Status.NOT_FOUND
                .withDescription("User not found: " + userId)
                .asRuntimeException());
        
        // 성공 처리
        User user = convertToProto(userEntity);
        GetUserResponse response = GetUserResponse.newBuilder()
            .setUser(user)
            .build();
        
        responseObserver.onNext(response);
        responseObserver.onCompleted();
        
    } catch (StatusRuntimeException e) {
        responseObserver.onError(e);
    } catch (Exception e) {
        responseObserver.onError(Status.INTERNAL
            .withDescription("Internal server error: " + e.getMessage())
            .withCause(e)
            .asRuntimeException());
    }
}
```

### 5-2. 커스텀 에러 처리

```protobuf
// error_details.proto
import "google/rpc/error_details.proto";

message ErrorDetail {
  string field = 1;
  string message = 2;
}
```

```java
// 커스텀 에러 처리
public void handleValidationError(StreamObserver<?> responseObserver,
                                 List<ValidationError> errors) {
    Status status = Status.INVALID_ARGUMENT
        .withDescription("Validation failed");
    
    com.google.rpc.Status.Builder statusBuilder = com.google.rpc.Status.newBuilder()
        .setCode(Code.INVALID_ARGUMENT.getNumber())
        .setMessage("Validation failed");
    
    for (ValidationError error : errors) {
        BadRequest.FieldViolation fieldViolation = 
            BadRequest.FieldViolation.newBuilder()
                .setField(error.getField())
                .setDescription(error.getMessage())
                .build();
        
        BadRequest badRequest = BadRequest.newBuilder()
            .addFieldViolations(fieldViolation)
            .build();
        
        statusBuilder.addDetails(Any.pack(badRequest));
    }
    
    Metadata metadata = new Metadata();
    metadata.put(StatusProto.CODE_KEY, statusBuilder.build());
    
    responseObserver.onError(status.asRuntimeException(metadata));
}
```

## 6. 성능 최적화

### 6-1. 연결 풀링

```yaml
# application.yml
grpc:
  client:
    user-service:
      address: 'static://localhost:9090'
      negotiationType: plaintext
      enableKeepAlive: true
      keepAliveWithoutCalls: true
      keepAliveTime: 30s
      keepAliveTimeout: 5s
      maxInboundMessageSize: 4194304  # 4MB
      maxInboundMetadataSize: 8192     # 8KB
```

### 6-2. 압축

```java
// 서버에서 압축 활성화
@GrpcService
public class UserServiceImpl extends UserServiceGrpc.UserServiceImplBase {
    
    @Override
    public void getUser(GetUserRequest request,
                       StreamObserver<GetUserResponse> responseObserver) {
        // gzip 압축 사용
        call.setCompression("gzip");
        
        // 응답 처리
    }
}

// 클라이언트에서 압축 요청
CallOptions callOptions = CallOptions.DEFAULT
    .withCompression("gzip");

UserServiceGrpc.UserServiceBlockingStub stub = 
    UserServiceGrpc.newBlockingStub(channel)
        .withCallOptions(callOptions);
```

### 6-3. 타임아웃 설정

```java
// 타임아웃 설정
CallOptions callOptions = CallOptions.DEFAULT
    .withDeadlineAfter(5, TimeUnit.SECONDS);

UserServiceGrpc.UserServiceBlockingStub stub = 
    UserServiceGrpc.newBlockingStub(channel)
        .withCallOptions(callOptions);

try {
    GetUserResponse response = stub.getUser(request);
} catch (StatusRuntimeException e) {
    if (e.getStatus().getCode() == Status.Code.DEADLINE_EXCEEDED) {
        // 타임아웃 처리
    }
}
```

## 7. gRPC-Web (브라우저 지원)

### 7-1. gRPC-Web 설정

```xml
<!-- pom.xml -->
<dependency>
    <groupId>io.grpc</groupId>
    <artifactId>grpc-web</artifactId>
    <version>1.4.2</version>
</dependency>
```

```java
// gRPC-Web 서버 설정
@Configuration
public class GrpcWebConfig {
    
    @Bean
    public ServletRegistrationBean<GrpcWebServlet> grpcWebServlet() {
        GrpcWebServlet servlet = new GrpcWebServlet(
            Arrays.asList(new UserServiceImpl()));
        
        ServletRegistrationBean<GrpcWebServlet> registration = 
            new ServletRegistrationBean<>(servlet, "/grpc/*");
        registration.setName("GrpcWebServlet");
        return registration;
    }
}
```

### 7-2. JavaScript 클라이언트

```javascript
// gRPC-Web 클라이언트
const { UserServiceClient } = require('./user_grpc_web_pb');
const { GetUserRequest } = require('./user_pb');

const client = new UserServiceClient('http://localhost:8080', null, null);

const request = new GetUserRequest();
request.setUserId(123);

client.getUser(request, {}, (err, response) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('User:', response.getUser().toObject());
});
```

## 8. 모니터링과 로깅

### 8-1. 메트릭 수집

```java
// Prometheus 메트릭 수집
@GrpcGlobalServerInterceptor
public class MetricsServerInterceptor implements ServerInterceptor {
    
    private final Counter requestCounter;
    private final Timer requestTimer;
    
    public MetricsServerInterceptor(MeterRegistry meterRegistry) {
        this.requestCounter = Counter.builder("grpc.server.requests")
            .description("gRPC server requests")
            .register(meterRegistry);
        
        this.requestTimer = Timer.builder("grpc.server.duration")
            .description("gRPC server request duration")
            .register(meterRegistry);
    }
    
    @Override
    public <ReqT, RespT> ServerCall.Listener<ReqT> interceptCall(
        ServerCall<ReqT, RespT> call,
        Metadata headers,
        ServerCallHandler<ReqT, RespT> next) {
        
        String methodName = call.getMethodDescriptor().getFullMethodName();
        Timer.Sample sample = Timer.start();
        
        return next.startCall(new ForwardingServerCall.SimpleForwardingServerCall<ReqT, RespT>(call) {
            @Override
            public void close(Status status, Metadata trailers) {
                requestCounter.increment(
                    Tags.of("method", methodName, "status", status.getCode().name()));
                sample.stop(requestTimer);
                super.close(status, trailers);
            }
        }, headers);
    }
}
```

## 9. 보안

### 9-1. TLS/SSL 설정

```yaml
# application.yml
grpc:
  server:
    port: 9090
    security:
      enabled: true
      certificateChain: classpath:server.crt
      privateKey: classpath:server.key
  client:
    user-service:
      address: 'static://localhost:9090'
      negotiationType: tls
      trustCertCollection: classpath:ca.crt
```

### 9-2. mTLS (Mutual TLS)

```yaml
# application.yml
grpc:
  server:
    security:
      enabled: true
      certificateChain: classpath:server.crt
      privateKey: classpath:server.key
      trustCertCollection: classpath:ca.crt
      clientAuth: REQUIRE
```

## 10. 실전 패턴

### 10-1. 재시도 패턴

```java
// 재시도 로직
public User getUserWithRetry(Long userId, int maxRetries) {
    int attempts = 0;
    
    while (attempts < maxRetries) {
        try {
            GetUserRequest request = GetUserRequest.newBuilder()
                .setUserId(userId)
                .build();
            
            return blockingStub.getUser(request).getUser();
            
        } catch (StatusRuntimeException e) {
            attempts++;
            
            if (e.getStatus().getCode() == Status.Code.UNAVAILABLE && 
                attempts < maxRetries) {
                // 지수 백오프
                long delay = (long) Math.pow(2, attempts) * 1000;
                try {
                    Thread.sleep(delay);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException(ie);
                }
            } else {
                throw e;
            }
        }
    }
    
    throw new RuntimeException("Max retries exceeded");
}
```

### 10-2. 서킷 브레이커 패턴

```java
// Resilience4j와 통합
@Service
public class UserServiceClient {
    
    @GrpcClient("user-service")
    private UserServiceGrpc.UserServiceBlockingStub blockingStub;
    
    @CircuitBreaker(name = "userService", fallbackMethod = "getUserFallback")
    public User getUser(Long userId) {
        GetUserRequest request = GetUserRequest.newBuilder()
            .setUserId(userId)
            .build();
        
        return blockingStub.getUser(request).getUser();
    }
    
    private User getUserFallback(Long userId, Exception e) {
        // 폴백 로직
        return User.newBuilder()
            .setId(userId)
            .setName("Unknown")
            .setEmail("unknown@example.com")
            .build();
    }
}
```

## 11. 결론

gRPC는 마이크로서비스 간 고성능 통신을 위한 강력한 도구다. 이 글에서 다룬 내용:

1. **기본 개념**: Protocol Buffers, gRPC 아키텍처
2. **Spring Boot 통합**: 서버/클라이언트 구현
3. **스트리밍**: 단방향, 양방향 스트리밍
4. **인터셉터**: 로깅, 인증, 모니터링
5. **에러 처리**: 상태 코드, 커스텀 에러
6. **성능 최적화**: 연결 풀링, 압축, 타임아웃
7. **gRPC-Web**: 브라우저 지원
8. **보안**: TLS/SSL, mTLS
9. **실전 패턴**: 재시도, 서킷 브레이커

이러한 기능들을 조합하면 확장 가능하고 견고한 마이크로서비스 통신 시스템을 구축할 수 있다.

## 참고 자료

- [gRPC 공식 문서](https://grpc.io/docs/)
- [Protocol Buffers 가이드](https://protobuf.dev/)
- [Spring Boot gRPC 스타터](https://github.com/yidongnan/grpc-spring-boot-starter)
- [gRPC Java 예제](https://github.com/grpc/grpc-java)

