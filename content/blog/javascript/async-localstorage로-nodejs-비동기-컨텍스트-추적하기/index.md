---
templateKey: blog-post
title: AsyncLocalStorage로 Node.js 비동기 컨텍스트 추적하기
date: 2025-11-09T00:00:00.000Z
category: javascript
description:
  Node.js 20 이후의 AsyncLocalStorage로 비동기 컨텍스트를 안정적으로 추적하는 방법과 Express, Fastify 실무 적용 전략을 정리한다.
tags:
  - Node.js
  - AsyncLocalStorage
  - 비동기
  - 컨텍스트
  - 로깅
  - 트랜잭션
  - Observability
---

Node.js 애플리케이션은 비동기 호출이 얽히면서 요청별 로깅, 트랜잭션 ID 전달, 분산 추적이 끊어지기 쉽다. `AsyncLocalStorage`는 비동기 호출 체인 전체에서 상태를 공유할 수 있도록 `async_hooks` 기반 스코프를 제공한다. 이 글에서는 `AsyncLocalStorage`의 동작 원리, 설치·설정 방법, 프레임워크별 통합 패턴, 운영 중 주의사항을 살펴본다.

## 개념 정리: AsyncLocalStorage 스코프 모델

`AsyncLocalStorage`는 Node.js가 제공하는 비동기 컨텍스트 저장소이다. 이벤트 루프에서 태스크가 생성될 때 내부적으로 컨텍스트 맵을 복제해 전달하므로, 콜백·Promise·`async/await` 체인 전반에 동일한 값을 참조할 수 있다.

- **컨텍스트 격리**: 요청마다 독립적인 스토어 인스턴스를 생성해 데이터 경쟁을 방지한다.  
- **비동기 호환성**: `await`, 타이머, I/O, Worker Threads에서도 동일한 컨텍스트를 유지한다.  
- **추적 가능성**: 요청 ID, 사용자 정보, 트랜잭션 메타데이터를 로거·DB 드라이버·외부 API 호출에 연계할 수 있다.

## 설치와 기본 설정

### 1. Node.js 버전 확인

`AsyncLocalStorage`는 Node.js 14에서 실험적으로 도입되었으며 16 LTS 이후 안정화되었다. 최소 Node.js 18 이상을 권장한다.

```bash
node -v
```

### 2. 공통 로거 패키지 추가

컨텍스트 연동을 위해 구조화 로깅 라이브러리를 함께 사용하는 것이 좋다. 예시는 `pino`를 사용한다.

```bash
npm install pino
```

### 3. 모듈 구성

컨텍스트 저장소와 로거를 초기화하는 유틸리티 파일을 만든다.

```javascript
// context.js
import { AsyncLocalStorage } from "node:async_hooks"
import pino from "pino"

export const asyncLocalStorage = new AsyncLocalStorage()
export const logger = pino()

export function withRequestContext(req, res, next) {
  const trace = {
    requestId: req.headers["x-request-id"] ?? crypto.randomUUID(),
    userAgent: req.headers["user-agent"],
    startedAt: Date.now(),
  }

  asyncLocalStorage.run(trace, () => next())
}

export function getContext() {
  return asyncLocalStorage.getStore()
}
```

## 코드 예시: 나쁜 구현 vs 좋은 구현

```javascript
// 나쁜 예시: 응답 로거에서 req 객체를 직접 참조해 비동기 체인 밖에서 undefined가 된다.
app.use((req, res, next) => {
  req.context = { requestId: crypto.randomUUID() }
  next()
})

setImmediate(() => {
  console.log(req.context.requestId) // TypeError 발생
})

// 좋은 예시: AsyncLocalStorage로 컨텍스트를 전파해 비동기 스케줄링 이후에도 안전하다.
import { asyncLocalStorage } from "./context.js"

app.use((req, res, next) => {
  asyncLocalStorage.run({ requestId: crypto.randomUUID() }, () => next())
})

setImmediate(() => {
  const store = asyncLocalStorage.getStore()
  console.log(store.requestId) // 정상 출력
})
```

나쁜 예시는 `req` 객체를 비동기 경계 밖으로 전달하면서 컨텍스트가 끊어져 `TypeError`가 발생한다. 좋은 예시에서는 `AsyncLocalStorage`가 태스크별 스토어를 복제해 `setImmediate` 이후에도 동일한 `requestId`를 조회할 수 있다.

## 실무 적용: Express와 Fastify 통합

### Express 미들웨어

```javascript
// app.js
import express from "express"
import { withRequestContext, getContext, logger } from "./context.js"

const app = express()
app.use(withRequestContext)

app.get("/payments/:id", async (req, res) => {
  const { requestId } = getContext()
  logger.info({ requestId }, "fetching payment")

  const payment = await fetchPayment(req.params.id)
  res.json({ requestId, payment })
})
```

### Fastify 플러그인

```javascript
// plugins/request-context.js
import fp from "fastify-plugin"
import { asyncLocalStorage } from "../context.js"

export default fp(async (fastify) => {
  fastify.addHook("onRequest", (request, reply, done) => {
    asyncLocalStorage.run(
      { requestId: request.id, route: request.routerPath },
      done,
    )
  })

  fastify.decorateRequest("requestContext", null)
  fastify.addHook("preHandler", (request, reply, done) => {
    request.requestContext = asyncLocalStorage.getStore()
    done()
  })
})
```

Fastify에서 위 플러그인을 등록하면 서비스 레이어나 외부 연동 모듈에서 `asyncLocalStorage.getStore()`를 호출해 동일한 트레이스를 참고할 수 있다.

## 실무 적용 시나리오

1. **분산 추적 연계**: `requestId`를 OpenTelemetry `traceId`와 연결해 백엔드·프론트엔드 로그를 엮는다.  
2. **데이터베이스 트랜잭션 묶기**: Prisma, TypeORM 등의 커넥션 풀에서 컨텍스트 기반 트랜잭션을 유지한다.  
3. **감사 로그 보강**: 사용자 ID, 권한 정보를 컨텍스트에 저장하고 감사 로그를 자동으로 태깅한다.  
4. **Feature Flag 평가**: 런타임 플래그 엔진에 컨텍스트를 전달해 사용자별 실험 집단을 정확히 분류한다.

## 활용 가이드: 단계별 체크리스트

1. **목표 정의**: 로깅, 트랜잭션 제어, 실시간 모니터링 등 컨텍스트 유지 목적을 명확히 한다.  
2. **컨텍스트 스키마 설계**: 저장할 필드를 최소화하고 개인정보는 토큰화한다.  
3. **미들웨어 일원화**: 모든 요청 진입 지점에서 `asyncLocalStorage.run`을 호출해 누락을 방지한다.  
4. **도구 통합**: 로거, ORM, 메시지 큐 클라이언트에 컨텍스트 추출 헬퍼를 주입한다.  
5. **부하 테스트**: 높은 동시성에서 메모리 사용량과 이벤트 루프 지연을 모니터링한다.  
6. **운영 모니터링**: 컨텍스트 누수, 저장소 변형 여부를 정기적으로 검증한다.

### 선택 기준과 고려사항

- **Node.js 버전**: 18 LTS 이상에서 안정적인 동작과 성능 개선을 누릴 수 있다.  
- **워크로드 특성**: CPU 집약적 작업보다 I/O 중심 서비스에서 효과가 크다.  
- **보안 요건**: 컨텍스트에 저장되는 민감정보는 암호화하거나 토큰화해야 한다.  
- **분산 아키텍처**: 서버리스(Function-as-a-Service) 환경에서는 실행 컨텍스트 수명이 짧으므로 호출마다 초기화 전략을 수립한다.

### 주의사항과 한계

- **컨텍스트 변조 위험**: 개발자가 `getStore()` 반환 객체를 직접 수정하면 다른 모듈에 영향을 준다. → 깊은 복사를 사용하거나 전용 setter를 제공한다.  
- **퍼포먼스 오버헤드**: 대량의 키-값을 저장하면 퍼포먼스가 저하될 수 있다. → 4~6개의 핵심 필드만 유지한다.  
- **Worker Threads**: 워커 사이에 컨텍스트가 자동 공유되지 않는다. → 메시지 전송으로 수동 동기화하거나 `AsyncResource`를 활용한다.  
- **테스트 코드**: Jest, Vitest 실행 시 전역 컨텍스트가 캐시될 수 있다. → 테스트 훅에서 `asyncLocalStorage.disable()`을 호출해 초기화한다.

## FAQ

**Q1. 기존 CLS/continuation-local-storage 라이브러리와 무엇이 다른가?**  
A: `AsyncLocalStorage`는 Node.js 코어가 지원해 외부 패키지보다 안정성과 성능이 높다. 기존 라이브러리는 `domain` API에 의존하고 이벤트 루프 개선 이후 호환성 문제가 발생한다.

**Q2. 비동기 컨텍스트 내에서 비밀번호 같은 민감정보를 저장해도 안전한가?**  
A: 메모리 내에서만 유지되지만, 프로세스 덤프나 로그에 노출될 수 있으므로 민감정보는 암호화 토큰이나 참조 ID 형태로 저장하는 것이 원칙이다.

**Q3. 요청 한 건이 여러 서비스로 분기되면 컨텍스트가 유지되는가?**  
A: 프로세스 내부 비동기 호출은 유지되지만, 외부 서비스 호출 후에는 컨텍스트가 전파되지 않는다. HTTP 헤더나 메시지 메타데이터로 트레이스를 전달해야 한다.

**Q4. 고성능 환경에서 어떤 로거를 쓰는 것이 좋은가?**  
A: `pino`, `winston@3`, `bunyan`이 대표적이며, `AsyncLocalStorage`와 함께 쓸 때는 비동기 쓰기 구조와 구조화 JSON 출력이 가능한 로거를 선택한다.

**Q5. TypeScript 프로젝트에서는 어떻게 타입을 정의해야 하는가?**  
A: 컨텍스트 스키마에 대한 인터페이스를 선언하고 `ReturnType<typeof asyncLocalStorage.getStore>`에 제네릭을 적용한다. 모듈 보강을 사용하면 `express.Request`에 `context` 필드를 안전하게 추가할 수 있다.


