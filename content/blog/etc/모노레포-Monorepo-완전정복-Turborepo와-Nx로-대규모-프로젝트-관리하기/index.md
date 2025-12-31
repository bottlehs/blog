---
templateKey: blog-post
title: 모노레포(Monorepo) 완전정복 - Turborepo와 Nx로 대규모 프로젝트 관리하기
date: 2025-12-29T06:45:00.000Z
category: etc
description: 모노레포의 모든 것을 다룬다. 개념부터 Turborepo, Nx, Lerna까지 주요 도구 비교, 실전 구축 가이드, CI/CD 통합, 대규모 프로젝트 관리 전략까지 실무 중심으로 정리한다.
tags:
  - Monorepo
  - 모노레포
  - Turborepo
  - Nx
  - Lerna
  - 프로젝트 관리
  - 빌드 시스템
  - 코드 공유
  - 대규모 프로젝트
---

![모노레포 완전정복](/assets/etc.png "모노레포 완전정복")

모노레포(Monorepo)는 여러 프로젝트를 하나의 저장소에서 관리하는 방식이다. 코드 공유, 일관성 유지, 대규모 프로젝트 관리에 효과적이다. 이 글은 모노레포의 개념부터 Turborepo, Nx 등 주요 도구를 활용한 실전 구축까지 완벽하게 정리한다.

## 1. 모노레포란 무엇인가?

### 1-1. 기본 개념

모노레포(Monorepo)는 "Monolithic Repository"의 줄임말로, 여러 프로젝트나 패키지를 하나의 Git 저장소에서 관리하는 방식이다.

**전통적인 멀티레포 (Multi-repo):**
```
company/
├── frontend/          (별도 저장소)
├── backend/          (별도 저장소)
├── shared-library/   (별도 저장소)
└── mobile/           (별도 저장소)
```

**모노레포 (Monorepo):**
```
company/
├── apps/
│   ├── frontend/
│   ├── backend/
│   └── mobile/
├── packages/
│   ├── shared-ui/
│   ├── shared-utils/
│   └── shared-types/
└── package.json
```

### 1-2. 모노레포의 장단점

**장점:**
- **코드 공유 용이**: 패키지 간 코드 공유가 쉬움
- **일관성 유지**: 공통 설정, 린팅 규칙 통일
- **원자적 변경**: 여러 패키지를 한 커밋으로 변경
- **리팩토링 용이**: 전체 코드베이스에서 안전하게 리팩토링
- **의존성 관리**: 버전 충돌 방지

**단점:**
- **저장소 크기**: 큰 저장소로 인한 클론 시간 증가
- **권한 관리**: 세밀한 권한 제어 어려움
- **빌드 복잡도**: 빌드 시스템 복잡도 증가
- **CI/CD 복잡도**: 변경된 패키지만 빌드하는 로직 필요

### 1-3. 모노레포 사용 사례

**적합한 경우:**
- 여러 관련 프로젝트 관리
- 코드 공유가 많은 프로젝트
- 대규모 팀 협업
- 마이크로서비스 아키텍처

**부적합한 경우:**
- 완전히 독립적인 프로젝트
- 작은 규모의 프로젝트
- 외부 오픈소스 프로젝트

## 2. 주요 모노레포 도구 비교

### 2-1. 도구 개요

| 도구 | 특징 | 장점 | 단점 |
|------|------|------|------|
| **Turborepo** | Vercel 개발, 빌드 시스템 | 빠른 빌드, 캐싱 우수 | 상대적으로 새로움 |
| **Nx** | Nrwl 개발, 엔터프라이즈급 | 강력한 기능, 플러그인 | 학습 곡선 높음 |
| **Lerna** | 전통적인 도구 | 간단함, 널리 사용 | 성능 제한적 |
| **pnpm workspaces** | 패키지 매니저 통합 | 간단한 설정 | 고급 기능 제한적 |
| **Yarn workspaces** | Yarn 통합 | 안정적 | Yarn에 종속 |

### 2-2. 선택 가이드

**Turborepo 추천:**
- 빠른 빌드 속도 중요
- 간단한 설정 선호
- Next.js, React 프로젝트

**Nx 추천:**
- 대규모 엔터프라이즈 프로젝트
- 강력한 도구 필요
- 다양한 프레임워크 지원 필요

**Lerna 추천:**
- 기존 프로젝트 마이그레이션
- 간단한 패키지 관리만 필요

## 3. Turborepo 실전 가이드

### 3-1. 프로젝트 구조

**기본 구조:**
```
my-monorepo/
├── apps/
│   ├── web/              # Next.js 앱
│   ├── admin/            # React 앱
│   └── api/              # Node.js API
├── packages/
│   ├── ui/               # 공유 UI 컴포넌트
│   ├── utils/            # 유틸리티 함수
│   └── config/           # 공유 설정
├── package.json
├── turbo.json            # Turborepo 설정
└── pnpm-workspace.yaml   # pnpm workspaces 설정
```

### 3-2. 초기 설정

**루트 package.json:**
```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^1.10.0"
  }
}
```

**turbo.json:**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    }
  }
}
```

### 3-3. 앱 생성

**apps/web/package.json:**
```json
{
  "name": "web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@my-monorepo/ui": "workspace:*",
    "@my-monorepo/utils": "workspace:*"
  }
}
```

**apps/web/next.config.js:**
```javascript
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@my-monorepo/ui'],
};

module.exports = withVanillaExtract(nextConfig);
```

### 3-4. 패키지 생성

**packages/ui/package.json:**
```json
{
  "name": "@my-monorepo/ui",
  "version": "1.0.0",
  "main": "./index.tsx",
  "types": "./index.tsx",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "react": "^18.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

**packages/ui/Button.tsx:**
```typescript
import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      {children}
    </button>
  );
};
```

**packages/ui/index.tsx:**
```typescript
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

### 3-5. 패키지 사용

**apps/web/app/page.tsx:**
```typescript
import { Button } from '@my-monorepo/ui';
import { formatDate } from '@my-monorepo/utils';

export default function Home() {
  return (
    <div>
      <h1>Welcome</h1>
      <p>Today is {formatDate(new Date())}</p>
      <Button onClick={() => alert('Clicked!')}>
        Click Me
      </Button>
    </div>
  );
}
```

### 3-6. 빌드 및 실행

**개발 모드:**
```bash
# 모든 앱 실행
pnpm dev

# 특정 앱만 실행
pnpm --filter web dev
```

**빌드:**
```bash
# 모든 패키지 빌드
pnpm build

# 특정 패키지만 빌드
pnpm --filter web build
```

**캐싱:**
- Turborepo는 자동으로 빌드 결과를 캐싱
- 변경되지 않은 패키지는 재빌드하지 않음
- CI/CD에서도 캐싱 활용 가능

## 4. Nx 실전 가이드

### 4-1. 프로젝트 초기화

**Nx 설치:**
```bash
npx create-nx-workspace@latest my-monorepo
```

**기본 구조:**
```
my-monorepo/
├── apps/
│   ├── web/
│   └── api/
├── libs/
│   ├── ui/
│   └── utils/
├── nx.json
├── workspace.json
└── package.json
```

### 4-2. 앱 생성

**Next.js 앱 생성:**
```bash
nx generate @nx/next:application web
```

**React 라이브러리 생성:**
```bash
nx generate @nx/react:library ui --directory=libs/ui
```

### 4-3. 태스크 실행

**개발 서버:**
```bash
nx serve web
```

**빌드:**
```bash
nx build web
```

**테스트:**
```bash
nx test web
```

**의존성 그래프:**
```bash
nx graph
```

### 4-4. 영향을 받는 프로젝트만 빌드

**영향 분석:**
```bash
# 변경된 프로젝트 확인
nx affected:graph

# 영향받는 프로젝트만 빌드
nx affected:build

# 영향받는 프로젝트만 테스트
nx affected:test
```

## 5. 패키지 간 의존성 관리

### 5-1. 내부 패키지 참조

**package.json에서:**
```json
{
  "dependencies": {
    "@my-monorepo/ui": "workspace:*",
    "@my-monorepo/utils": "workspace:*"
  }
}
```

**TypeScript 경로 매핑:**
```json
{
  "compilerOptions": {
    "paths": {
      "@my-monorepo/ui": ["./packages/ui"],
      "@my-monorepo/utils": ["./packages/utils"]
    }
  }
}
```

### 5-2. 버전 관리

**버전 동기화:**
- 모든 패키지 버전을 동일하게 유지
- 또는 독립적으로 버전 관리

**Lerna를 사용한 버전 관리:**
```json
{
  "version": "independent",
  "packages": ["packages/*", "apps/*"]
}
```

## 6. CI/CD 통합

### 6-1. GitHub Actions (Turborepo)

**.github/workflows/ci.yml:**
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build
      
      - name: Test
        run: pnpm test
```

### 6-2. 변경된 패키지만 빌드

**Turborepo:**
```yaml
- name: Build changed packages
  run: |
    pnpm turbo build --filter='...[origin/main]'
```

**Nx:**
```yaml
- name: Build affected
  run: |
    nx affected:build --base=origin/main
```

## 7. 공유 설정 관리

### 7-1. ESLint 설정

**packages/eslint-config/package.json:**
```json
{
  "name": "@my-monorepo/eslint-config",
  "version": "1.0.0",
  "main": "index.js"
}
```

**packages/eslint-config/index.js:**
```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  rules: {
    // 공통 규칙
  },
};
```

**앱에서 사용:**
```json
{
  "extends": "@my-monorepo/eslint-config"
}
```

### 7-2. TypeScript 설정

**packages/tsconfig/base.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**앱에서 확장:**
```json
{
  "extends": "@my-monorepo/tsconfig/base.json",
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

## 8. Best Practices

### 8-1. 프로젝트 구조

**명확한 구조:**
- `apps/`: 실행 가능한 애플리케이션
- `packages/`: 재사용 가능한 패키지
- `tools/`: 개발 도구 및 스크립트

### 8-2. 의존성 관리

**의존성 최소화:**
- 필요한 패키지만 설치
- 공통 의존성은 루트에 설치

**버전 통일:**
- 동일한 라이브러리는 동일한 버전 사용
- 버전 충돌 방지

### 8-3. 빌드 최적화

**병렬 빌드:**
- Turborepo, Nx는 자동으로 병렬 빌드
- 의존성 그래프 기반 최적화

**캐싱 활용:**
- 빌드 결과 캐싱
- CI/CD에서도 캐싱 활용

### 8-4. 코드 공유

**공유 패키지 설계:**
- 명확한 인터페이스 정의
- 독립적으로 테스트 가능하도록 설계
- 문서화

## 9. 마이그레이션 가이드

### 9-1. 기존 프로젝트 통합

**단계별 마이그레이션:**
1. 모노레포 구조 생성
2. 기존 프로젝트 이동
3. 의존성 정리
4. 빌드 시스템 설정
5. CI/CD 업데이트

**주의사항:**
- Git 히스토리 보존
- 점진적 마이그레이션
- 팀과 충분한 소통

## FAQ

**Q: 모노레포가 항상 좋은가요?**  
A: 상황에 따라 다릅니다. 코드 공유가 많고 관련된 프로젝트를 관리할 때 유리하지만, 완전히 독립적인 프로젝트는 멀티레포가 나을 수 있습니다.

**Q: Turborepo와 Nx 중 어떤 것을 선택해야 하나요?**  
A: 간단한 프로젝트와 빠른 빌드가 중요하면 Turborepo, 대규모 엔터프라이즈 프로젝트와 강력한 도구가 필요하면 Nx를 선택하세요.

**Q: 모노레포에서 Git 히스토리는 어떻게 관리하나요?**  
A: 기존 프로젝트를 통합할 때는 `git subtree`나 `git filter-branch`를 사용하여 히스토리를 보존할 수 있습니다.

**Q: 패키지 버전을 독립적으로 관리할 수 있나요?**  
A: 네, Lerna의 `independent` 모드나 각 패키지의 독립적인 버전 관리가 가능합니다.

**Q: CI/CD에서 모든 패키지를 빌드하나요?**  
A: 아니요, 변경된 패키지만 빌드하는 것이 효율적입니다. Turborepo와 Nx는 이를 자동으로 처리합니다.

**Q: 모노레포 저장소 크기가 커지면 어떻게 하나요?**  
A: Git LFS 사용, 부분 클론, 또는 저장소 분할을 고려할 수 있습니다. 하지만 대부분의 경우 모던 Git은 큰 저장소도 잘 처리합니다.

## 결론: 모노레포로 대규모 프로젝트 관리

모노레포는 대규모 프로젝트와 팀 협업에서 강력한 도구다. 코드 공유, 일관성 유지, 효율적인 빌드 등 많은 장점을 제공한다.

하지만 모든 프로젝트에 적합한 것은 아니다. 프로젝트의 규모, 팀 구조, 코드 공유 정도를 고려하여 선택해야 한다. 적절히 활용하면 개발 생산성을 크게 향상시킬 수 있다.

Turborepo와 Nx 같은 도구들이 모노레포의 복잡성을 크게 줄여주고 있다. 이제는 더 많은 프로젝트가 모노레포를 채택하고 있으며, 이는 앞으로의 트렌드가 될 것이다.

## 모노레포 학습 후 프로젝트 기회

모노레포를 마스터한 후, 실제 프로젝트에 적용하고 싶다면 [블루버튼](https://bluebutton.kr/) 같은 프로젝트 매칭 플랫폼을 활용할 수 있다. 모노레포를 활용한 대규모 프로젝트 관리, 마이크로서비스 아키텍처, 코드 공유가 중요한 프로젝트 등에서 실전 경험을 쌓을 수 있다. 특히 프론트엔드와 백엔드를 함께 관리하거나, 여러 앱을 하나의 저장소에서 관리하는 프로젝트에서 모노레포의 강점을 발휘할 수 있다.


