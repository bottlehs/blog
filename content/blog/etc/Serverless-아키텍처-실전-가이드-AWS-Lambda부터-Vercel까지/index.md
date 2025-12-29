---
templateKey: blog-post
title: Serverless 아키텍처 실전 가이드 - AWS Lambda부터 Vercel까지
date: 2025-12-29T06:30:00.000Z
category: etc
description: Serverless 아키텍처의 모든 것을 다룬다. 개념부터 AWS Lambda, Vercel, Netlify Functions까지 주요 플랫폼 비교, 실전 배포 전략, 비용 최적화, Cold Start 문제 해결까지 실무 중심으로 정리한다.
tags:
  - Serverless
  - AWS Lambda
  - Vercel
  - Netlify
  - Cloud Functions
  - 서버리스
  - 인프라
  - 배포
  - Edge Computing
---

![Serverless 아키텍처 실전 가이드](/assets/etc.png "Serverless 아키텍처 실전 가이드")

Serverless 아키텍처는 서버 관리 없이 코드만 배포하면 자동으로 실행되는 클라우드 컴퓨팅 모델이다. 인프라 관리 부담을 줄이고, 비용을 최적화하며, 자동 스케일링을 제공한다. 이 글은 Serverless의 개념부터 실전 배포까지 완벽하게 정리한다.

## 1. Serverless 아키텍처란?

### 1-1. 기본 개념

Serverless는 "서버가 없다"는 의미가 아니라, "서버를 관리할 필요가 없다"는 의미다. 개발자는 코드만 작성하고 배포하면, 클라우드 제공자가 서버 관리, 스케일링, 모니터링을 자동으로 처리한다.

**전통적인 서버 아키텍처:**
```
개발자 → 서버 설정 → 애플리케이션 배포 → 모니터링 → 스케일링 관리
```

**Serverless 아키텍처:**
```
개발자 → 코드 작성 → 배포 → 자동 실행
         (서버 관리, 스케일링 자동)
```

### 1-2. Serverless의 특징

**장점:**
- **서버 관리 불필요**: 인프라 관리 부담 제거
- **자동 스케일링**: 트래픽에 따라 자동 확장/축소
- **비용 효율**: 사용한 만큼만 비용 지불
- **빠른 배포**: 코드만 배포하면 즉시 실행
- **고가용성**: 자동으로 여러 리전에 배포

**단점:**
- **Cold Start**: 첫 실행 시 지연 시간 발생
- **실행 시간 제한**: 플랫폼별 제한 시간 존재
- **벤더 종속**: 특정 클라우드 제공자에 종속
- **디버깅 어려움**: 로컬 환경과 차이
- **상태 관리 제한**: 상태 저장 어려움

### 1-3. Serverless 사용 사례

**적합한 경우:**
- API 엔드포인트
- 이벤트 기반 처리 (파일 업로드, 메시지 큐)
- 크론 작업 (정기 실행 작업)
- 마이크로서비스
- 정적 사이트 + 동적 기능

**부적합한 경우:**
- 장시간 실행 작업
- 실시간 스트리밍
- 상태 저장이 중요한 애플리케이션
- 매우 낮은 지연 시간 요구

## 2. 주요 Serverless 플랫폼 비교

### 2-1. 플랫폼 개요

| 플랫폼 | 제공사 | 주요 특징 | 가격 모델 |
|--------|--------|----------|-----------|
| **AWS Lambda** | Amazon | 가장 성숙, 다양한 통합 | 요청 수 + 실행 시간 |
| **Vercel Functions** | Vercel | 프론트엔드 통합 우수 | 무료 플랜 + 사용량 |
| **Netlify Functions** | Netlify | 정적 사이트 통합 | 무료 플랜 + 사용량 |
| **Google Cloud Functions** | Google | GCP 생태계 통합 | 요청 수 + 실행 시간 |
| **Azure Functions** | Microsoft | 엔터프라이즈 기능 | 요청 수 + 실행 시간 |

### 2-2. 상세 비교

**AWS Lambda**
- **언어 지원**: Node.js, Python, Java, Go, Ruby, .NET
- **최대 실행 시간**: 15분
- **메모리**: 128MB ~ 10GB
- **트리거**: API Gateway, S3, DynamoDB, SNS 등
- **장점**: 가장 성숙, 다양한 서비스 통합
- **단점**: 설정 복잡, 학습 곡선 높음

**Vercel Functions**
- **언어 지원**: Node.js, Python, Go
- **최대 실행 시간**: 10초 (Hobby), 60초 (Pro)
- **메모리**: 1GB
- **트리거**: HTTP 요청, Cron
- **장점**: Next.js 통합 우수, 간단한 배포
- **단점**: 실행 시간 제한, 엔터프라이즈 기능 제한

**Netlify Functions**
- **언어 지원**: Node.js, Go, Python, Ruby
- **최대 실행 시간**: 10초 (Free), 26초 (Pro)
- **메모리**: 1.5GB
- **트리거**: HTTP 요청, Scheduled Functions
- **장점**: 정적 사이트 통합, 간단한 설정
- **단점**: 실행 시간 제한, 확장성 제한

## 3. AWS Lambda 실전 가이드

### 3-1. 첫 번째 Lambda 함수 만들기

**index.js:**
```javascript
exports.handler = async (event) => {
  const name = event.queryStringParameters?.name || 'World';
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Hello, ${name}!`,
      timestamp: new Date().toISOString(),
    }),
  };
};
```

**배포 (AWS CLI):**
```bash
# 함수 패키징
zip function.zip index.js

# 함수 생성
aws lambda create-function \
  --function-name hello-world \
  --runtime nodejs20.x \
  --role arn:aws:iam::ACCOUNT:role/lambda-role \
  --handler index.handler \
  --zip-file fileb://function.zip
```

### 3-2. API Gateway와 통합

**Lambda 함수:**
```javascript
exports.handler = async (event) => {
  const method = event.httpMethod;
  const path = event.path;
  const body = event.body ? JSON.parse(event.body) : {};
  
  if (method === 'GET' && path === '/users') {
    // 사용자 목록 조회
    return {
      statusCode: 200,
      body: JSON.stringify([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ]),
    };
  }
  
  if (method === 'POST' && path === '/users') {
    // 사용자 생성
    return {
      statusCode: 201,
      body: JSON.stringify({
        id: Date.now(),
        ...body,
      }),
    };
  }
  
  return {
    statusCode: 404,
    body: JSON.stringify({ error: 'Not Found' }),
  };
};
```

**API Gateway 설정:**
- REST API 생성
- 리소스 및 메서드 설정
- Lambda 함수 연결
- 배포

### 3-3. 환경 변수 사용

**Lambda 함수:**
```javascript
exports.handler = async (event) => {
  const apiKey = process.env.API_KEY;
  const dbUrl = process.env.DATABASE_URL;
  
  // 환경 변수 사용
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Environment variables loaded',
    }),
  };
};
```

**환경 변수 설정:**
```bash
aws lambda update-function-configuration \
  --function-name my-function \
  --environment Variables="{API_KEY=secret123,DATABASE_URL=postgres://...}"
```

### 3-4. 데이터베이스 연결

**DynamoDB 연결 예시:**
```javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const userId = event.pathParameters.id;
  
  // DynamoDB에서 데이터 조회
  const result = await dynamodb.get({
    TableName: 'Users',
    Key: { id: userId },
  }).promise();
  
  return {
    statusCode: 200,
    body: JSON.stringify(result.Item),
  };
};
```

## 4. Vercel Functions 실전 가이드

### 4-1. Next.js API Routes

**pages/api/hello.js:**
```javascript
export default function handler(req, res) {
  const { name } = req.query;
  
  res.status(200).json({
    message: `Hello, ${name || 'World'}!`,
    timestamp: new Date().toISOString(),
  });
}
```

**App Router (app/api/hello/route.ts):**
```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || 'World';
  
  return Response.json({
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  
  return Response.json({
    message: 'Data received',
    data: body,
  });
}
```

### 4-2. Serverless Functions (api 폴더)

**api/users.ts:**
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method === 'GET') {
    const users = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];
    
    res.status(200).json(users);
  } else if (req.method === 'POST') {
    const { name, email } = req.body;
    
    res.status(201).json({
      id: Date.now(),
      name,
      email,
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
```

### 4-3. 환경 변수 설정

**vercel.json:**
```json
{
  "env": {
    "DATABASE_URL": "@database-url",
    "API_KEY": "@api-key"
  }
}
```

**Vercel 대시보드에서 설정:**
- Settings → Environment Variables
- 환경 변수 추가
- 프로덕션, 프리뷰, 개발 환경별 설정

### 4-4. Cron Jobs (Scheduled Functions)

**api/cron.ts:**
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Cron 작업 실행
  console.log('Cron job executed at:', new Date().toISOString());
  
  // 정기 작업 수행
  // 예: 데이터 백업, 리포트 생성 등
  
  res.status(200).json({ message: 'Cron job completed' });
}
```

**vercel.json:**
```json
{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "0 0 * * *"
    }
  ]
}
```

## 5. Netlify Functions 실전 가이드

### 5-1. 함수 생성

**netlify/functions/hello.js:**
```javascript
exports.handler = async (event, context) => {
  const { name } = event.queryStringParameters || {};
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Hello, ${name || 'World'}!`,
    }),
  };
};
```

### 5-2. TypeScript 함수

**netlify/functions/users.ts:**
```typescript
import { Handler } from '@netlify/functions';

const handler: Handler = async (event, context) => {
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      body: JSON.stringify([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ]),
    };
  }
  
  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
};

export { handler };
```

### 5-3. 환경 변수

**netlify.toml:**
```toml
[build]
  functions = "netlify/functions"

[context.production.environment]
  DATABASE_URL = "postgres://..."
  API_KEY = "secret123"
```

## 6. Cold Start 문제 해결

### 6-1. Cold Start란?

Cold Start는 함수가 오랫동안 사용되지 않아 "차가워진" 상태에서 첫 실행 시 발생하는 지연 시간이다.

**Cold Start 발생 시나리오:**
1. 함수가 일정 시간 비활성 상태
2. 첫 요청 시 컨테이너 초기화
3. 코드 로드 및 실행 환경 준비
4. 실제 함수 실행

**지연 시간:**
- Node.js: 100-500ms
- Python: 200-1000ms
- Java: 1-3초
- .NET: 500ms-2초

### 6-2. Cold Start 최적화 방법

**1. 패키지 크기 최소화**
```javascript
// 나쁜 예: 전체 라이브러리 임포트
const AWS = require('aws-sdk');

// 좋은 예: 필요한 부분만 임포트
const DynamoDB = require('aws-sdk/clients/dynamodb');
```

**2. Provisioned Concurrency (AWS Lambda)**
```bash
aws lambda put-provisioned-concurrency-config \
  --function-name my-function \
  --qualifier $LATEST \
  --provisioned-concurrent-executions 10
```

**3. 함수 최적화**
```javascript
// 전역 변수 활용 (재사용)
const dbConnection = initializeDatabase();

exports.handler = async (event) => {
  // dbConnection 재사용 (매번 초기화하지 않음)
  const result = await dbConnection.query('SELECT * FROM users');
  return result;
};
```

**4. Keep Warm 패턴**
```javascript
// 주기적으로 함수 호출하여 Warm 상태 유지
exports.handler = async (event) => {
  // CloudWatch Events로 주기적 호출
  if (event.source === 'aws.events') {
    return { statusCode: 200, body: 'Warmed up' };
  }
  
  // 실제 로직
  return { statusCode: 200, body: 'Hello' };
};
```

## 7. 비용 최적화

### 7-1. 비용 구조 이해

**AWS Lambda:**
- 요청 수: $0.20 per 1M requests
- 실행 시간: GB-second당 $0.0000166667
- 예: 100만 요청, 평균 200ms 실행, 512MB 메모리
  - 요청 비용: $0.20
  - 실행 비용: $0.33
  - 총: $0.53

**Vercel:**
- Hobby: 무료 (제한적)
- Pro: $20/월 + 사용량
- Enterprise: 맞춤 가격

**Netlify:**
- Free: 무료 (제한적)
- Pro: $19/월 + 사용량
- Business: $99/월 + 사용량

### 7-2. 비용 절감 전략

**1. 함수 실행 시간 최적화**
```javascript
// 나쁜 예: 불필요한 대기
exports.handler = async (event) => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // 불필요
  return { statusCode: 200 };
};

// 좋은 예: 필요한 작업만 수행
exports.handler = async (event) => {
  // 즉시 처리
  return { statusCode: 200 };
};
```

**2. 메모리 최적화**
- 필요한 만큼만 메모리 할당
- 메모리가 많을수록 비용 증가

**3. 캐싱 활용**
```javascript
const cache = new Map();

exports.handler = async (event) => {
  const key = event.queryStringParameters?.key;
  
  if (cache.has(key)) {
    return {
      statusCode: 200,
      body: JSON.stringify(cache.get(key)),
    };
  }
  
  // 데이터 조회 및 캐싱
  const data = await fetchData(key);
  cache.set(key, data);
  
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
```

**4. 배치 처리**
- 여러 요청을 하나의 함수로 처리
- API 호출 최소화

## 8. 모니터링 및 로깅

### 8-1. AWS CloudWatch

**로깅:**
```javascript
exports.handler = async (event) => {
  console.log('Event received:', JSON.stringify(event));
  console.error('Error occurred:', error);
  
  // 구조화된 로깅
  console.log(JSON.stringify({
    level: 'info',
    message: 'Function executed',
    timestamp: new Date().toISOString(),
    requestId: context.requestId,
  }));
  
  return { statusCode: 200 };
};
```

**메트릭:**
- 실행 횟수
- 실행 시간
- 에러율
- 동시 실행 수

### 8-2. Vercel Analytics

**설정:**
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 8-3. 에러 처리

**에러 핸들링:**
```javascript
exports.handler = async (event) => {
  try {
    // 로직 실행
    const result = await processData(event);
    
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
    };
  }
};
```

## 9. 실전 배포 전략

### 9-1. CI/CD 파이프라인

**GitHub Actions (AWS Lambda):**
```yaml
name: Deploy Lambda

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install
      
      - name: Package function
        run: zip -r function.zip index.js node_modules
      
      - name: Deploy to Lambda
        run: |
          aws lambda update-function-code \
            --function-name my-function \
            --zip-file fileb://function.zip
```

**Vercel 자동 배포:**
- GitHub 연동 시 자동 배포
- 브랜치별 프리뷰 배포
- 프로덕션 자동 배포

### 9-2. 환경별 배포

**개발/스테이징/프로덕션 분리:**
```javascript
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    apiUrl: 'http://localhost:3000',
    databaseUrl: process.env.DEV_DATABASE_URL,
  },
  production: {
    apiUrl: 'https://api.example.com',
    databaseUrl: process.env.PROD_DATABASE_URL,
  },
};

exports.handler = async (event) => {
  const currentConfig = config[env];
  // 설정 사용
};
```

## 10. Best Practices

### 10-1. 함수 설계 원칙

**1. 단일 책임 원칙**
- 하나의 함수는 하나의 작업만 수행
- 작고 집중된 함수 작성

**2. Stateless 설계**
- 상태 저장 지양
- 외부 저장소 활용 (DB, Cache)

**3. 에러 처리**
- 모든 에러 처리
- 적절한 HTTP 상태 코드 반환

**4. 타임아웃 설정**
- 적절한 타임아웃 설정
- 장시간 실행 작업 분리

### 10-2. 보안

**환경 변수 사용:**
- 민감한 정보는 환경 변수로 관리
- 코드에 하드코딩 금지

**권한 최소화:**
- 필요한 권한만 부여
- IAM 역할 최소 권한 원칙

**입력 검증:**
```javascript
exports.handler = async (event) => {
  const { email } = JSON.parse(event.body);
  
  // 입력 검증
  if (!email || !isValidEmail(email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid email' }),
    };
  }
  
  // 처리
};
```

## FAQ

**Q: Serverless가 항상 비용 효율적인가요?**  
A: 트래픽이 불규칙하거나 낮은 경우 비용 효율적이다. 하지만 높은 트래픽이 지속되면 전통적인 서버가 더 경제적일 수 있다.

**Q: Cold Start를 완전히 제거할 수 있나요?**  
A: 완전히 제거는 어렵지만, Provisioned Concurrency나 Keep Warm 패턴으로 최소화할 수 있다.

**Q: Serverless로 모든 애플리케이션을 만들 수 있나요?**  
A: 아니요. 장시간 실행 작업이나 실시간 스트리밍에는 부적합하다. 적절한 사용 사례를 선택하는 것이 중요하다.

**Q: 로컬에서 Serverless 함수를 테스트할 수 있나요?**  
A: 네, AWS SAM, Serverless Framework, Vercel CLI 등으로 로컬 테스트가 가능하다.

**Q: 데이터베이스 연결을 어떻게 관리하나요?**  
A: 연결 풀링을 사용하거나, Serverless에 최적화된 데이터베이스(Aurora Serverless, DynamoDB)를 사용한다.

**Q: Serverless 함수의 최대 실행 시간은?**  
A: 플랫폼마다 다르다. AWS Lambda는 15분, Vercel은 10-60초, Netlify는 10-26초다.

## 결론: Serverless의 미래

Serverless 아키텍처는 현대 웹 개발의 중요한 패러다임이다. 인프라 관리 부담을 줄이고, 개발자 생산성을 높이며, 비용을 최적화한다.

하지만 모든 문제의 해결책은 아니다. 프로젝트의 요구사항을 정확히 파악하고, Serverless의 장단점을 이해한 후 선택하는 것이 중요하다. 적절히 활용하면 개발 속도를 높이고 운영 부담을 줄일 수 있다.

Serverless는 계속 발전하고 있다. Edge Computing, 더 긴 실행 시간, 더 나은 디버깅 도구 등이 추가되면서 점점 더 실용적인 선택이 되고 있다.

## Serverless 학습 후 프로젝트 기회

Serverless 아키텍처를 마스터한 후, 실제 프로젝트에 적용하고 싶다면 [블루버튼](https://bluebutton.kr/) 같은 프로젝트 매칭 플랫폼을 활용할 수 있다. Serverless를 활용한 API 개발, 마이크로서비스 구축, 정적 사이트 + 동적 기능 구현 등 다양한 프로젝트에서 실전 경험을 쌓을 수 있다. 특히 빠른 프로토타이핑이나 비용 최적화가 중요한 프로젝트에서 Serverless의 강점을 발휘할 수 있다.

