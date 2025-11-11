---
templateKey: blog-post
title: Spring Cloud Function과 Serverless LLM 이벤트 기반 AI 마이크로서비스 구축
date: 2025-11-11T00:00:00.000Z
category: springboot
description:
  Spring Cloud Function과 Serverless 플랫폼을 결합하여 LLM 기반 이벤트 마이크로서비스를 설계하는 방법을 아키텍처, 구현, 운영 관점에서 정리합니다.
tags:
  - Spring Cloud Function
  - Serverless
  - LLM
  - 마이크로서비스
  - 이벤트 기반 아키텍처
  - AWS Lambda
---

LLM 서비스를 배포할 때 항상 고정형 서버 혹은 컨테이너를 사용할 필요는 없다. 이벤트가 발생했을 때만 함수를 실행하는 **서버리스(Serverless)** 모델은 비용 최적화와 운영 단순화 측면에서 매력적이다. Spring Cloud Function은 스프링 개발자가 익숙한 프로그래밍 모델을 유지하면서도 AWS Lambda, Azure Functions, Google Cloud Functions 등 다양한 서버리스 런타임에 배포할 수 있게 한다. 이 글에서는 Spring Cloud Function을 활용해 LLM 기반 이벤트 마이크로서비스를 구성하는 방법을 살펴본다.

## 1. Spring Cloud Function의 핵심 개념

- **비침투성**: `Function`, `Consumer`, `Supplier` 빈을 정의하면 런타임에 맞춰 어댑터가 자동 연결된다.
- **환경 추상화**: AWS, Azure, GCP, Kafka Streams 등 다양한 타겟으로 동일한 함수를 재사용할 수 있다.
- **Spring AI 통합**: Spring AI의 `ChatClient`, `EmbeddingClient` 빈을 함수 내부에서 호출하면 LLM 추론을 곧바로 연동할 수 있다.

```java
@Bean
public Function<Request, Response> summarizeFunction(ChatClient chatClient) {
    return request -> {
        ChatRequest prompt = ChatRequest.builder()
            .message("다음 텍스트를 요약해줘: " + request.getText())
            .build();
        ChatResponse result = chatClient.call(prompt);
        return new Response(result.getResult().getOutput());
    };
}
```

## 2. 서버리스 LLM 아키텍처 설계

### 2-1. 이벤트 플로우 예시

1. 고객 지원 시스템에서 티켓이 생성되면 AWS EventBridge 이벤트가 발생한다.
2. 이벤트가 Lambda 함수를 트리거하고, Spring Cloud Function이 실행된다.
3. 함수는 Spring AI를 통해 사내 호스팅 LLM 혹은 OpenAI API를 호출한다.
4. 요약 결과를 S3, DynamoDB, Slack 등으로 전송한다.

### 2-2. 구성 요소

- **Event Source**: EventBridge, SQS, Kafka 등
- **Function Runtime**: AWS Lambda + Spring Cloud Function
- **LLM 백엔드**: 사내 Ollama, vLLM, OpenAI, Azure OpenAI 등
- **저장/후속 처리**: S3, RDS, Notification Service
- **옵저버빌리티**: CloudWatch Logs, X-Ray, OpenTelemetry Collector

## 3. 구현 단계

### 3-1. 프로젝트 설정

1. `spring-cloud-function-adapter-aws` 의존성과 Spring AI 의존성을 `build.gradle` 또는 `pom.xml`에 추가한다.
2. `Function<Request, Response>` 형태의 빈을 정의한다.
3. `spring.ai.openai.api-key` 등 환경 변수 기반 설정을 구성한다.
4. `FunctionInvoker`를 엔트리포인트로 사용하는 AWS Lambda 핸들러 클래스를 생성한다.

### 3-2. 배포

- **AWS SAM/Serverless Framework**를 사용해 함수를 패키징하고 배포한다.
- 네트워크 지연을 낮추기 위해 VPC 내에 배치하고, 필요 시 모델 엔드포인트도 동일 리전에 배치한다.
- 프로비저닝된 동시성(Provisioned Concurrency)로 콜드 스타트 지연을 최소화한다.

## 4. 비용 및 성능 최적화

- **콜드 스타트 완화**: JVM 기반 함수는 첫 실행에 시간이 걸릴 수 있다. 최소 동시 실행 수를 확보하고, SnapStart(AWS) 같은 최적화 옵션을 검토한다.
- **요청 배치**: EventBridge나 SQS에서 배치 크기를 조정해 호출 횟수를 줄인다.
- **모델 선택**: 요청당 비용을 고려해 경량 모델과 캐시 전략을 병행한다.
- **결과 캐싱**: 동일 질의가 반복되는 경우 DynamoDB, Redis를 활용해 재실행을 피한다.

## 5. 관측성과 운영

- **트레이싱**: OpenTelemetry로 함수 실행, 외부 API 호출, 모델 응답 시간을 추적한다.
- **알림**: CloudWatch Alarms 또는 PagerDuty로 실패율 증가, 지연 상승을 감지한다.
- **데드 레터 큐**: 실패 요청을 DLQ에 저장하고 재처리 프로세스를 구축한다.
- **버전 관리**: Lambda 버전과 별칭을 활용해 롤백 전략을 마련한다.

## 6. 보안 고려사항

- **비밀 관리**: API 키, 토큰은 AWS Secrets Manager나 Parameter Store에 저장한다.
- **VPC 엔드포인트**: 외부 LLM API를 호출할 때 프라이빗 링크 또는 NAT 구성을 통해 트래픽을 제한한다.
- **프롬프트 검증**: 입력 필터링과 응답 검사를 적용해 정책 위반을 방지한다.
- **감사 로그**: Lambda 실행 로그와 프롬프트/응답을 비식별화하여 장기 보관한다.

## 7. 확장 시나리오

- **다중 함수 파이프라인**: 요약 → 분류 → 보고서 생성 등 여러 함수를 Step Functions로 오케스트레이션한다.
- **Edge 배포**: Lambda@Edge, Cloudflare Workers와 연동해 지역별로 응답 시간을 단축한다.
- **하이브리드 라우팅**: Spring AI로 엣지 모델과 클라우드 모델을 선택적으로 호출해 비용과 성능을 최적화한다.

--- 

Spring Cloud Function은 스프링 개발자가 서버리스 환경으로 전환할 때의 진입 장벽을 크게 낮춰 준다. 이벤트 기반으로 LLM 기능을 제공하면 비용 효율과 확장성이라는 두 마리 토끼를 잡을 수 있다. 적절한 옵저버빌리티, 보안, 배포 전략을 갖춘다면, 기업은 빠르게 변화하는 생성형 AI 요구에 민첩하게 대응할 수 있다.

