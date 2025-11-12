---
templateKey: blog-post
title: Spring Observability와 AI 서비스 SLO 관리
date: 2025-11-12T00:00:00.000Z
category: springboot
description:
  Spring Observability, Micrometer, OpenTelemetry를 활용해 LLM·AI 마이크로서비스의 SLO를 설계하고 운영 지표를 수집·자동화하는 방법을 다룹니다.
tags:
  - Spring Observability
  - Micrometer
  - OpenTelemetry
  - SLO
  - AI 서비스
  - Error Budget
---

생성형 AI 서비스를 운영하다 보면 모델 응답 시간, 성공률, 비용까지 다양한 지표를 동시에 관리해야 한다. Spring Boot 3+는 Observability 스택을 내장해, Micrometer와 OpenTelemetry로 메트릭·로그·트레이스를 통합 수집할 수 있다. 이 글은 Spring Observability를 활용해 AI 서비스 전용 SLO(Service Level Objective)를 설계하고 운영 자동화를 구축하는 방법을 소개한다.

## 1. Spring Observability 개요

- **자동 계측**: Spring Boot Actuator, Micrometer가 HTTP, R2DBC, gRPC, Kafka 등 주요 컴포넌트를 자동 계측한다.
- **OpenTelemetry 통합**: Micrometer Tracing을 통해 OTel SDK와 연동할 수 있다.
- **컨벤션 기반 설정**: `management.observations.*`, `management.tracing.*` 속성으로 간단히 설정 가능.

## 2. AI 서비스에서 관측해야 할 핵심 지표

| 범주 | 지표 | 설명 |
| --- | --- | --- |
| 품질 | `ai.response.success` | 정상 응답 비율 |
| 지연 | `ai.response.latency` | P50/95/99 응답 시간 |
| 비용 | `ai.inference.tokens`, `ai.inference.cost` | 토큰 사용량·비용 |
| 안정성 | `ai.rag.cache.hit`, `ai.prompt.filter.blocked` | 캐시 히트율, 정책 차단 수 |
| 인프라 | `jvm.memory.used`, `http.server.requests` | 기본 운영 지표 |

Micrometer `MeterRegistry`에 커스텀 지표를 등록하면, 기존 인프라 지표와 함께 대시보드를 구성할 수 있다.

```java
@Component
public class InferenceMetrics {

    private final Counter successCounter;
    private final DistributionSummary latencySummary;

    public InferenceMetrics(MeterRegistry registry) {
        this.successCounter = Counter
            .builder(\"ai.response.success\")
            .description(\"AI inference success count\")
            .register(registry);

        this.latencySummary = DistributionSummary
            .builder(\"ai.response.latency\")
            .baseUnit(\"milliseconds\")
            .publishPercentileHistogram()
            .register(registry);
    }

    public void recordSuccess(double latencyMs) {
        successCounter.increment();
        latencySummary.record(latencyMs);
    }
}
```

## 3. SLO 설계 방법

### 3-1. 목표 정의

- **가용성 SLO**: 성공률 99.5% 이상
- **지연 SLO**: 95% 요청이 1.2초 이내
- **비용 SLO**: 월별 인퍼런스 비용이 예산의 90% 이하

각 SLO마다 Service Level Indicator(SLI) 계산 공식을 명확히 하고, 데이터 소스를 지정해야 한다.

### 3-2. Error Budget

- 성공률 SLO 99.5% → 월간 에러 버짓 0.5%
- 버짓이 소진되면 배포 동결, 롤백, 대체 모델 전환 등 대응 프로세스를 가동한다.
- SLO 상태와 버짓 잔여량을 Grafana, Opsgenie 등으로 공유한다.

## 4. 수집 파이프라인 구성

1. Spring Boot 서비스가 Micrometer를 통해 지표를 수집한다.
2. OpenTelemetry Collector가 지표·로그·트레이스를 수집하여 Prometheus, Tempo, Loki 등으로 전송한다.
3. 대시보드와 알람을 설정해 SLO 위반 조짐을 조기에 감지한다.

```
Spring Boot (Micrometer) → OpenTelemetry Collector → Prometheus / Grafana Cloud
                                             → Alertmanager / PagerDuty
```

## 5. 알림과 자동화

- **Alerting**: SLO 위반 임계치, 에러 버짓 소진율을 기반으로 알림을 설정한다.
- **런북 자동화**: 알림과 함께 실행할 스크립트(모델 리스타트, 캐시 플러시, 트래픽 전환)를 정의한다.
- **혼잡 제어**: 토큰 사용량 급증 시, Spring WebFlux rate limiter나 Adaptive Concurrency를 적용한다.
- **릴리즈 게이트**: CI/CD에서 SLO 추이와 버짓 상태를 체크해 배포 승인 조건으로 활용한다.

## 6. 비용 모니터링

- OpenAI, Azure, Vertex AI 등 외부 API 비용을 별도 지표로 수집한다.
- 사용량이 임계값에 가까워지면 대체 모델, 오프피크 스케줄링, 캐시 강화 등을 자동 제안한다.
- Cost Explorer 대시보드와 연동해 예산 대비 사용률을 추적한다.

## 7. 운영 체크리스트

- [ ] AI SLO가 문서화되고 경영진·운영팀과 합의되었는가?
- [ ] 성공률·지연·비용 지표가 실시간 수집되고 있는가?
- [ ] Error Budget 초과 시 대응 프로세스가 자동화되어 있는가?
- [ ] 관측 데이터가 보안·개인정보 정책을 준수하는가?
- [ ] 주기적 리뷰를 통해 SLO 기준을 갱신하고 있는가?

---

AI 서비스는 모델 품질, 인프라 성능, 비용을 균형 있게 관리해야 한다. Spring Observability는 스프링 개발자에게 익숙한 방식으로 관측성을 구축하도록 도와준다. 명확한 SLO와 자동화된 모니터링 체계를 갖추면, 서비스 품질 저하나 비용 폭증을 미리 감지하고 안정적인 운영을 유지할 수 있다.

