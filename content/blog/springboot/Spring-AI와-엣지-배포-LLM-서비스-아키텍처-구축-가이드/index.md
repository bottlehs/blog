---
templateKey: blog-post
title: Spring AI와 엣지 배포 LLM 서비스 아키텍처 구축 가이드
date: 2025-11-07T00:00:00.000Z
category: springboot
description:
  Spring AI 프로젝트와 엣지 추론 인프라를 결합하여 LLM 서비스를 설계하는 방법을 아키텍처, 구현 패턴, 운영 전략 관점에서 정리합니다.
tags:
  - Spring AI
  - Spring Boot
  - LLM 서비스
  - 엣지 컴퓨팅
  - AI 아키텍처
  - Observability
---

Spring 팀이 2024년 공개한 Spring AI는 LLM API 연동과 추론 워크플로우를 Spring Boot 애플리케이션에 자연스럽게 녹여준다. 동시에 기업들은 데이터 주권과 지연 시간 문제를 해결하기 위해 엣지(Edge) 환경에서 모델을 실행하려는 요구가 커지고 있다. 이 글은 Spring AI를 활용해 엣지-클라우드 하이브리드 LLM 서비스를 설계하고 구현하는 방법을 제시한다.

## 1. Spring AI 개요

- **Spring Boot 친화성**: `ChatClient`, `EmbeddingClient`, `ToolClient` 등 빈을 통해 OpenAI, Anthropic, Azure OpenAI, Ollama 등 다양한 백엔드를 추상화한다.
- **구성 기반 프로그래밍**: `application.yml`에 `spring.ai.openai.*` 또는 `spring.ai.ollama.*`를 선언하여 환경을 쉽게 전환한다.
- **유연한 프롬프트 관리**: 템플릿 엔진(`Thymeleaf`, `Mustache`, `Velocity`)을 통해 프롬프트를 코드와 분리하여 관리할 수 있다.
- **RAG 지원**: `VectorStore` 추상화를 활용해 Elasticsearch, Redis, Milvus 등 다양한 벡터 스토어와 연동한다.

## 2. 엣지 LLM 배포 시나리오

### 2-1. 왜 엣지인가?

- 데이터 주권: 고객 정보를 외부 클라우드에 보내지 않고 현장에서 처리한다.
- 지연 시간: 제조 라인, 콜센터, 오프라인 매장에서 즉시 응답이 필요할 때 유리하다.
- 비용 최적화: 대량 호출을 중앙 클라우드 모델로 보내는 비용보다 자체 추론이 유리할 수 있다.

### 2-2. 엣지 환경 특성

- 제한된 GPU/CPU: 양자화 모델, LoRA 어댑터, 온디맨드 로딩 전략이 필요하다.
- 네트워크 제약: 중앙 서버와의 동기화, 모델 업데이트 배포를 고려해야 한다.
- 운영 자동화: OTA(Over-the-Air) 업데이트, 헬스 체크, 리모트 로깅 체계가 필수다.

## 3. 아키텍처 설계

```
사용자 → Spring Boot API Gateway → (프롬프트 필터) → 라우팅 로직
                                     ├─ 엣지 추론 노드 (Ollama/ONNX Runtime)
                                     └─ 클라우드 LLM 백엔드 (Azure OpenAI 등)
```

### 3-1. 구성 요소

- **Spring Boot API Gateway**: 인증, 요청 로깅, 정책 적용의 관문.
- **Spring AI 라우터**: 추론 요청을 엣지 또는 클라우드로 분기. `ChatClient` 멀티 백엔드 구성이 핵심이다.
- **엣지 추론 노드**: Ollama, TensorRT-LLM, vLLM 등을 사용해 경량 모델을 호스팅한다.
- **벡터 스토어**: RAG 컨텍스트 제공을 위해 중앙 혹은 엣지에 Redis/Weaviate를 배치한다.
- **옵저버빌리티 스택**: Prometheus, Grafana, OpenTelemetry를 통해 추론 지표를 수집한다.

### 3-2. 라우팅 전략

- **SLA 기반 라우팅**: 응답 지연이 300ms 이하 필요 시 엣지 노드 우선.
- **정책 기반 라우팅**: 개인정보 포함 여부에 따라 엣지 전용 모델을 사용한다.
- **비용 기반 라우팅**: 월간 사용량이 임계치를 넘으면 대체 모델로 전환한다.

Spring AI에서는 `DelegatingChatClient`를 구현해 조건별로 다른 `ChatClient` 빈을 선택할 수 있다.

```java
@Component
public class PolicyAwareChatClient implements ChatClient {

    private final ChatClient edgeClient;
    private final ChatClient cloudClient;
    private final DataClassifier classifier;

    public PolicyAwareChatClient(@Qualifier("edgeChatClient") ChatClient edgeClient,
                                 @Qualifier("cloudChatClient") ChatClient cloudClient,
                                 DataClassifier classifier) {
        this.edgeClient = edgeClient;
        this.cloudClient = cloudClient;
        this.classifier = classifier;
    }

    @Override
    public ChatResponse call(ChatRequest request) {
        if (classifier.containsSensitiveData(request.getMessages())) {
            return edgeClient.call(request);
        }
        return cloudClient.call(request);
    }
}
```

## 4. 모델 배포 패턴

### 4-1. 엣지 추론 노드 구성

- **컨테이너화**: Docker + NVIDIA Container Toolkit으로 GPU를 관리한다.
- **모델 관리**: OCI 레지스트리에 모델 파일(gguf, safetensors)을 저장하고 버전 태깅한다.
- **스타트업 스크립트**: `docker compose`를 이용해 Ollama, 텔레메트리, 헬스체크 에이전트를 동시에 기동한다.

### 4-2. 중앙 제어와 동기화

- **모델 배포 파이프라인**: GitOps(ArgoCD) 또는 MLOps 도구(KServe, Seldon)로 엣지 노드에 배포한다.
- **피드백 루프**: Spring Boot가 수집한 사용자 피드백을 중앙 데이터 레이크로 전송하여 재학습에 활용한다.
- **버전 롤백**: 실패한 모델 롤아웃을 즉시 되돌릴 수 있도록 Canary 릴리스 전략을 사용한다.

## 5. 보안과 거버넌스

- **네트워크 분리**: 엣지 노드는 전용 VPN 혹은 Zero Trust 네트워크로 보호한다.
- **프롬프트 방어**: Spring AI의 `PromptTemplate`에 정책을 삽입하고, 응답 필터로 민감어를 차단한다.
- **비용 통제**: 각 백엔드 호출량을 `MeterRegistry`에 기록해 월간 비용 리포트를 자동 생성한다.
- **감사 로그**: 요청·응답 페이로드는 비식별화한 뒤 `AuditEventRepository`에 보관한다.

## 6. 성능 최적화 팁

- **캐시된 컨텍스트**: RAG 질의에 자주 사용되는 문서를 엣지 노드에 캐싱해 네트워크 왕복을 줄인다.
- **동시성 제어**: Spring WebFlux와 `Project Reactor`를 활용해 비동기 추론 호출을 처리한다.
- **모델 압축**: GPTQ, AWQ, LoRA 등 양자화 기법을 적용해 7B 모델도 경량 GPU에서 운영한다.
- **배치 추론**: 대량 요청은 클라우드 백엔드에서 배치 처리 후 응답을 스트리밍한다.

## 7. 운영 모니터링 대시보드 예시

- 추론 성공률
- 평균 지연 및 퍼센타일(50/95/99)
- 엣지 vs 클라우드 라우팅 비율
- 모델 버전별 호출량
- 사용자 피드백 점수(Thumbs Up/Down)

OpenTelemetry를 통해 `spring.ai.client.response.latency` 같은 커스텀 메트릭을 노출하고, Grafana에 대시보드를 구성한다.

## 8. 단계별 실행 로드맵

1. **준비 단계**: Spring AI 의존성을 프로젝트에 추가하고, 기본 `ChatClient`를 구성한다.
2. **PoC 단계**: 엣지 노드(예: Jetson, NUC)에 Ollama/ggml 모델을 설치하고 Spring Boot에서 호출한다.
3. **하이브리드 정착**: 정책 기반 라우팅, 캐시, 벡터 스토어를 연결한다.
4. **운영화**: 모니터링·알림·자동 롤백 체계를 구축한다.
5. **지속 개선**: 사용자 피드백 데이터를 기반으로 프롬프트와 모델을 지속적으로 최적화한다.

---

Spring AI는 스프링 생태계에 자리 잡은 개발자 경험을 그대로 유지하면서 LLM 기능을 애플리케이션에 주입할 수 있게 한다. 여기에 엣지 추론 인프라를 결합하면 민감 데이터를 보호하고 지연 시간을 줄이는 동시에, 중앙 클라우드의 대규모 모델을 필요에 따라 호출하는 유연성을 확보할 수 있다. 하이브리드 아키텍처를 체계적으로 설계하고 운영 자동화를 갖춘다면, 엔터프라이즈 환경에서도 신뢰성 높은 LLM 서비스를 빠르게 론칭할 수 있다.


