---
templateKey: blog-post
title: Deno 완전정복 - Node.js를 넘어서는 차세대 런타임
date: 2025-12-29T06:15:00.000Z
category: javascript
description: Deno의 모든 것을 다룬다. Node.js와의 차이점, 내장 기능, 보안 모델, TypeScript 지원, 실전 프로젝트 구축까지 Deno를 완벽하게 마스터하는 가이드를 제공한다.
tags:
  - Deno
  - Node.js
  - JavaScript
  - TypeScript
  - 런타임
  - 서버 사이드
  - 백엔드
  - 차세대 런타임
---

![Deno 완전정복](/assets/javascript.png "Deno 완전정복")

Deno는 Node.js의 창시자인 Ryan Dahl이 만든 차세대 JavaScript/TypeScript 런타임이다. Node.js의 문제점을 해결하고, 현대적인 개발 경험을 제공하기 위해 설계되었다. 이 글은 Deno의 핵심 개념부터 실전 활용까지 완벽하게 정리한다.

## 1. Deno란 무엇인가?

### 1-1. Deno의 탄생 배경

Deno는 "Node"의 철자를 바꾼 것으로, Node.js의 대안으로 만들어졌다. Ryan Dahl은 2018년 JSConf에서 Node.js의 10가지 후회를 발표하며 Deno 개발을 시작했다.

**Node.js의 주요 문제점:**
- 복잡한 모듈 시스템 (CommonJS, ES Modules 혼재)
- 보안 모델 부재 (모든 권한 기본 허용)
- 빌트인 TypeScript 지원 없음
- 중앙화된 패키지 관리자 (npm)의 문제점

### 1-2. Deno의 핵심 특징

**1. TypeScript 기본 지원**
- 별도 컴파일 없이 TypeScript 직접 실행
- 타입 체크 옵션 제공

**2. 보안 우선 설계**
- 명시적 권한 요청
- 샌드박스 환경
- 네트워크, 파일 시스템 접근 제어

**3. 표준 라이브러리**
- Web 표준 API 준수
- 풍부한 빌트인 모듈

**4. 단일 실행 파일**
- 별도 패키지 매니저 불필요
- URL 기반 모듈 임포트

**5. 최신 JavaScript 기능**
- ES Modules 기본 지원
- Top-level await 지원
- 최신 표준 준수

## 2. Deno vs Node.js 비교

### 2-1. 핵심 차이점

| 항목 | Node.js | Deno |
|------|---------|------|
| **언어** | JavaScript | JavaScript, TypeScript |
| **모듈 시스템** | CommonJS, ES Modules | ES Modules만 |
| **패키지 관리** | npm | URL 기반 (npm 호환) |
| **보안** | 모든 권한 허용 | 명시적 권한 요청 |
| **표준 라이브러리** | 제한적 | 풍부한 빌트인 |
| **설치** | Node.js 설치 필요 | 단일 실행 파일 |
| **설정 파일** | package.json 필요 | 선택적 (deno.json) |

### 2-2. 코드 비교 예시

**Node.js 방식:**
```javascript
// package.json 필요
{
  "dependencies": {
    "express": "^4.18.0"
  }
}

// 코드
const express = require('express');
const app = express();
```

**Deno 방식:**
```typescript
// package.json 불필요
import express from "https://deno.land/x/express@4.18.2/mod.ts";

const app = express();
```

### 2-3. 보안 모델 비교

**Node.js:**
```javascript
// 모든 권한이 기본적으로 허용됨
const fs = require('fs');
fs.readFile('/etc/passwd', (err, data) => {
  // 파일 읽기 가능 (위험)
});
```

**Deno:**
```typescript
// 명시적 권한 요청 필요
// 실행: deno run --allow-read /etc/passwd script.ts

const file = await Deno.readTextFile('/etc/passwd');
// 권한 없이 실행하면 에러 발생
```

## 3. Deno 설치 및 시작하기

### 3-1. 설치 방법

**macOS/Linux:**
```bash
curl -fsSL https://deno.land/install.sh | sh
```

**Windows (PowerShell):**
```powershell
irm https://deno.land/install.ps1 | iex
```

**Homebrew (macOS):**
```bash
brew install deno
```

**설치 확인:**
```bash
deno --version
```

### 3-2. 첫 번째 Deno 프로그램

**hello.ts:**
```typescript
console.log("Hello, Deno!");
```

**실행:**
```bash
deno run hello.ts
```

**TypeScript 예시:**
```typescript
// types.ts
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "Deno",
  age: 5
};

console.log(user);
```

## 4. Deno의 핵심 기능

### 4-1. URL 기반 모듈 임포트

Deno는 npm 대신 URL을 사용해 모듈을 임포트한다.

```typescript
// 표준 라이브러리
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

// 외부 모듈
import { v4 } from "https://deno.land/std@0.208.0/uuid/mod.ts";

// 로컬 파일
import { helper } from "./helper.ts";
```

**장점:**
- package.json 불필요
- 버전 관리 명확
- 중앙화된 저장소 불필요

**단점:**
- 오프라인 환경에서 어려움
- URL 관리 복잡

**해결책: deps.ts 파일 사용:**
```typescript
// deps.ts - 의존성 중앙 관리
export { serve } from "https://deno.land/std@0.208.0/http/server.ts";
export { v4 } from "https://deno.land/std@0.208.0/uuid/mod.ts";

// 다른 파일에서
import { serve, v4 } from "./deps.ts";
```

### 4-2. 보안 모델

Deno는 기본적으로 모든 권한을 차단한다. 필요한 권한을 명시적으로 요청해야 한다.

**권한 플래그:**
- `--allow-read`: 파일 읽기
- `--allow-write`: 파일 쓰기
- `--allow-net`: 네트워크 접근
- `--allow-env`: 환경 변수 접근
- `--allow-run`: 하위 프로세스 실행
- `--allow-all` 또는 `-A`: 모든 권한 허용

**예시:**
```typescript
// 파일 읽기
const data = await Deno.readTextFile("./data.txt");
```

```bash
# 권한 없이 실행
deno run script.ts
# Error: Requires read access to "./data.txt"

# 권한과 함께 실행
deno run --allow-read script.ts
```

**특정 경로만 허용:**
```bash
deno run --allow-read=./data script.ts
```

### 4-3. 표준 라이브러리

Deno는 풍부한 표준 라이브러리를 제공한다.

**HTTP 서버:**
```typescript
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

serve(async (req) => {
  return new Response("Hello, Deno!", {
    headers: { "content-type": "text/plain" },
  });
}, { port: 8000 });
```

**파일 시스템:**
```typescript
import { readAll } from "https://deno.land/std@0.208.0/streams/mod.ts";

const file = await Deno.open("./data.txt");
const data = await readAll(file);
file.close();
```

**날짜/시간:**
```typescript
import { format } from "https://deno.land/std@0.208.0/datetime/mod.ts";

const now = new Date();
console.log(format(now, "yyyy-MM-dd HH:mm:ss"));
```

**UUID 생성:**
```typescript
import { v4 } from "https://deno.land/std@0.208.0/uuid/mod.ts";

const id = v4.generate();
console.log(id);
```

### 4-4. Web 표준 API

Deno는 브라우저 Web API를 지원한다.

**Fetch API:**
```typescript
const response = await fetch("https://api.example.com/data");
const data = await response.json();
console.log(data);
```

**WebSocket:**
```typescript
const ws = new WebSocket("wss://echo.websocket.org");

ws.onopen = () => {
  ws.send("Hello, Deno!");
};

ws.onmessage = (event) => {
  console.log("Received:", event.data);
};
```

**Crypto API:**
```typescript
const data = new TextEncoder().encode("Hello, Deno!");
const hashBuffer = await crypto.subtle.digest("SHA-256", data);
const hashArray = Array.from(new Uint8Array(hashBuffer));
const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
console.log(hashHex);
```

## 5. 실전 프로젝트 구축

### 5-1. REST API 서버 만들기

**server.ts:**
```typescript
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

interface User {
  id: number;
  name: string;
  email: string;
}

let users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  
  // GET /users
  if (req.method === "GET" && url.pathname === "/users") {
    return new Response(JSON.stringify(users), {
      headers: { "content-type": "application/json" },
    });
  }
  
  // GET /users/:id
  if (req.method === "GET" && url.pathname.startsWith("/users/")) {
    const id = parseInt(url.pathname.split("/")[2]);
    const user = users.find(u => u.id === id);
    
    if (!user) {
      return new Response("User not found", { status: 404 });
    }
    
    return new Response(JSON.stringify(user), {
      headers: { "content-type": "application/json" },
    });
  }
  
  // POST /users
  if (req.method === "POST" && url.pathname === "/users") {
    const body = await req.json();
    const newUser: User = {
      id: users.length + 1,
      name: body.name,
      email: body.email,
    };
    users.push(newUser);
    
    return new Response(JSON.stringify(newUser), {
      status: 201,
      headers: { "content-type": "application/json" },
    });
  }
  
  return new Response("Not Found", { status: 404 });
}

serve(handler, { port: 8000 });
console.log("Server running on http://localhost:8000");
```

**실행:**
```bash
deno run --allow-net server.ts
```

### 5-2. 파일 처리 예시

**file-handler.ts:**
```typescript
// 파일 읽기
const content = await Deno.readTextFile("./data.txt");
console.log(content);

// 파일 쓰기
await Deno.writeTextFile("./output.txt", "Hello, Deno!");

// 파일 정보 확인
const fileInfo = await Deno.stat("./data.txt");
console.log("Size:", fileInfo.size);
console.log("Modified:", fileInfo.mtime);

// 디렉토리 읽기
for await (const dirEntry of Deno.readDir("./")) {
  console.log(dirEntry.name, dirEntry.isFile ? "file" : "dir");
}
```

**실행:**
```bash
deno run --allow-read --allow-write file-handler.ts
```

### 5-3. 환경 변수 사용

**env-example.ts:**
```typescript
// 환경 변수 읽기
const apiKey = Deno.env.get("API_KEY");
const port = Deno.env.get("PORT") || "8000";

console.log("API Key:", apiKey);
console.log("Port:", port);
```

**실행:**
```bash
API_KEY=secret123 PORT=3000 deno run --allow-env env-example.ts
```

### 5-4. 외부 API 호출

**api-client.ts:**
```typescript
async function fetchUserData(userId: number) {
  try {
    const response = await fetch(`https://api.example.com/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

// 사용
const user = await fetchUserData(1);
console.log(user);
```

**실행:**
```bash
deno run --allow-net api-client.ts
```

## 6. Deno 프로젝트 구조

### 6-1. 권장 프로젝트 구조

```
my-deno-project/
├── src/
│   ├── main.ts          # 진입점
│   ├── routes/
│   │   └── users.ts     # 라우트
│   ├── models/
│   │   └── user.ts      # 데이터 모델
│   └── utils/
│       └── helpers.ts   # 유틸리티
├── deps.ts              # 의존성 중앙 관리
├── deno.json             # Deno 설정 (선택적)
└── README.md
```

### 6-2. deno.json 설정

**deno.json:**
```json
{
  "tasks": {
    "dev": "deno run --allow-net --allow-read --allow-write src/main.ts",
    "start": "deno run --allow-net src/main.ts",
    "test": "deno test --allow-net"
  },
  "imports": {
    "std/": "https://deno.land/std@0.208.0/",
    "express": "https://deno.land/x/express@4.18.2/mod.ts"
  },
  "fmt": {
    "useTabs": false,
    "lineWidth": 80,
    "indentWidth": 2
  },
  "lint": {
    "rules": {
      "tags": ["recommended"]
    }
  }
}
```

**작업 실행:**
```bash
deno task dev
deno task start
deno task test
```

## 7. Deno 생태계

### 7-1. 인기 프레임워크

**Fresh (Deno의 Next.js):**
```typescript
import { FreshContext } from "$fresh/server.ts";

export default function Page(ctx: FreshContext) {
  return <h1>Hello, Fresh!</h1>;
}
```

**Oak (Express 스타일):**
```typescript
import { Application } from "https://deno.land/x/oak@v12.6.1/mod.ts";

const app = new Application();

app.use((ctx) => {
  ctx.response.body = "Hello, Oak!";
});

await app.listen({ port: 8000 });
```

### 7-2. 유용한 모듈

**데이터베이스:**
- **DenoDB**: ORM
- **Postgres.js**: PostgreSQL 클라이언트

**인증:**
- **djwt**: JWT 토큰
- **bcrypt**: 비밀번호 해싱

**유틸리티:**
- **std/uuid**: UUID 생성
- **std/datetime**: 날짜/시간 처리
- **std/path**: 경로 처리

## 8. Node.js에서 Deno로 마이그레이션

### 8-1. 마이그레이션 체크리스트

**1. 모듈 시스템 변경**
```javascript
// Node.js
const express = require('express');

// Deno
import express from "https://deno.land/x/express@4.18.2/mod.ts";
```

**2. 파일 시스템 API 변경**
```javascript
// Node.js
const fs = require('fs');
const data = fs.readFileSync('file.txt', 'utf8');

// Deno
const data = await Deno.readTextFile('file.txt');
```

**3. 환경 변수**
```javascript
// Node.js
const port = process.env.PORT;

// Deno
const port = Deno.env.get("PORT");
```

### 8-2. npm 패키지 사용하기

Deno는 npm 패키지를 사용할 수 있다.

**npm: 패키지 사용:**
```typescript
import express from "npm:express@4.18.2";

const app = express();
app.get("/", (req, res) => {
  res.send("Hello from npm package!");
});
```

**실행:**
```bash
deno run --allow-net --allow-read npm:express script.ts
```

## 9. Deno의 장단점

### 9-1. 장점

**보안**
- 명시적 권한 요청
- 샌드박스 환경
- 기본적으로 안전한 실행

**개발 경험**
- TypeScript 기본 지원
- 최신 JavaScript 기능
- Web 표준 API 지원

**단순성**
- 단일 실행 파일
- package.json 불필요
- 표준 라이브러리 풍부

### 9-2. 단점

**생태계**
- Node.js보다 작은 생태계
- 일부 npm 패키지 호환성 문제
- 커뮤니티 규모 작음

**성능**
- 일부 시나리오에서 Node.js보다 느림
- 초기 시작 시간이 다소 느림

**학습 곡선**
- 새로운 개념 학습 필요
- URL 기반 모듈 시스템 적응 필요

## 10. 언제 Deno를 사용해야 할까?

### 적합한 경우

**1. 새로운 프로젝트**
- TypeScript 기본 지원 필요
- 보안이 중요한 프로젝트
- 최신 표준 사용 원함

**2. 스크립트 및 도구**
- 간단한 유틸리티 스크립트
- CLI 도구 개발
- 자동화 스크립트

**3. 학습 목적**
- 최신 JavaScript/TypeScript 학습
- Web 표준 이해
- 보안 모델 학습

### 부적합한 경우

**1. 기존 Node.js 프로젝트**
- 레거시 코드 마이그레이션 비용 높음
- npm 패키지 의존성 많음

**2. 엔터프라이즈 환경**
- 안정성 검증 필요
- 대규모 팀 협업
- 기존 인프라와 통합 필요

## FAQ

**Q: Deno가 Node.js를 대체할까요?**  
A: 단기적으로는 아니지만, 장기적으로는 가능성이 있다. 특히 새로운 프로젝트와 보안이 중요한 프로젝트에서 Deno의 장점이 두드러진다.

**Q: npm 패키지를 사용할 수 있나요?**  
A: 네, `npm:` 프리픽스를 사용하면 npm 패키지를 사용할 수 있다. 하지만 모든 패키지가 호환되는 것은 아니다.

**Q: Deno의 성능은 Node.js보다 좋나요?**  
A: 상황에 따라 다르다. 일부 작업에서는 Deno가 빠르지만, 전체적으로는 Node.js가 더 성숙하고 최적화되어 있다.

**Q: 프로덕션에서 사용해도 되나요?**  
A: 가능하지만 신중하게 결정해야 한다. Deno는 아직 상대적으로 새로운 기술이며, 엔터프라이즈 환경에서는 충분한 검증이 필요하다.

**Q: TypeScript를 모르면 Deno를 사용할 수 있나요?**  
A: 네, JavaScript로도 작성할 수 있다. 하지만 Deno의 강점 중 하나가 TypeScript 기본 지원이므로, TypeScript를 배우는 것을 추천한다.

**Q: Deno로 웹 프레임워크를 만들 수 있나요?**  
A: 네, Fresh, Oak 등 여러 프레임워크가 있다. Next.js나 Express와 유사한 개발 경험을 제공한다.

## 결론: 차세대 런타임의 가능성

Deno는 Node.js의 문제점을 해결하고 현대적인 개발 경험을 제공하는 차세대 런타임이다. 보안, TypeScript 지원, Web 표준 준수 등에서 강점을 보인다.

아직 생태계가 작고 성능 최적화가 필요한 부분이 있지만, 새로운 프로젝트나 학습 목적으로는 충분히 고려할 만한 가치가 있다. 특히 보안이 중요한 프로젝트나 최신 표준을 활용하고 싶은 개발자에게 Deno는 좋은 선택이 될 수 있다.

Node.js와 Deno는 경쟁 관계라기보다는 서로 다른 목적을 가진 도구다. 프로젝트의 요구사항에 맞는 도구를 선택하는 것이 중요하다.

## Deno 학습 후 프로젝트 기회

Deno를 마스터한 후, 실제 프로젝트에 적용하고 싶다면 [블루버튼](https://bluebutton.kr/) 같은 프로젝트 매칭 플랫폼을 활용할 수 있다. Deno를 활용한 백엔드 개발, API 서버 구축, CLI 도구 개발 등 다양한 프로젝트에서 실전 경험을 쌓을 수 있다. 특히 보안이 중요한 프로젝트나 최신 기술 스택을 원하는 프로젝트에서 Deno의 강점을 발휘할 수 있다.



