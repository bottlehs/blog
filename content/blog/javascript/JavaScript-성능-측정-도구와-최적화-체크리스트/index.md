---
templateKey: blog-post
title: JavaScript 성능 측정 도구와 최적화 체크리스트 - 실무에서 바로 쓰는 성능 개선 가이드
date: 2025-12-23T06:15:00.000Z
category: javascript
description: JavaScript 애플리케이션의 성능을 측정하고 최적화하는 완전한 가이드다. Lighthouse, WebPageTest, Chrome DevTools 등 주요 도구 사용법과 실무 체크리스트를 제공한다.
tags:
  - JavaScript
  - 성능 최적화
  - Lighthouse
  - WebPageTest
  - 성능 측정
  - 프론트엔드 최적화
  - 웹 성능
---

![JavaScript 성능 측정 도구와 최적화 체크리스트](/assets/javascript.png "JavaScript 성능 측정 도구와 최적화 체크리스트")

JavaScript 애플리케이션의 성능은 사용자 경험과 비즈니스 성과에 직접적인 영향을 미친다. 느린 로딩 시간은 이탈률을 높이고, 전환율을 낮춘다. 이 글은 JavaScript 성능을 측정하고 최적화하는 실무 가이드를 제공한다.

## 1. 성능 측정 도구

### Lighthouse

**URL**: https://developers.google.com/web/tools/lighthouse

**주요 기능**
- 성능 점수 (0-100)
- 접근성, SEO, 모범 사례 점수
- 상세한 개선 제안

**사용 방법**
1. Chrome DevTools 열기 (F12)
2. Lighthouse 탭 선택
3. 측정할 카테고리 선택
4. "Analyze page load" 클릭

**측정 항목**
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)

### WebPageTest

**URL**: https://www.webpagetest.org/

**주요 기능**
- 실제 브라우저에서 테스트
- 영상 녹화
- 상세한 워터폴 차트

**활용**
- 다양한 위치에서 테스트
- 모바일/데스크톱 비교
- 반복 테스트로 일관성 확인

### Chrome DevTools Performance

**주요 기능**
- CPU 프로파일링
- 메모리 사용량 분석
- 렌더링 성능 측정

**사용 방법**
1. Performance 탭 열기
2. Record 버튼 클릭
3. 페이지 상호작용 수행
4. Stop 클릭 후 분석

## 2. 핵심 성능 지표 (Core Web Vitals)

### Largest Contentful Paint (LCP)

**목표**: 2.5초 이하

**측정 방법**
```javascript
new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries();
  const lastEntry = entries[entries.length - 1];
  console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
}).observe({entryTypes: ['largest-contentful-paint']});
```

**최적화 방법**
- 이미지 최적화 (WebP, lazy loading)
- 서버 응답 시간 개선
- CDN 활용
- 중요 리소스 우선 로딩

### First Input Delay (FID)

**목표**: 100ms 이하

**측정 방법**
```javascript
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    console.log('FID:', entry.processingStart - entry.startTime);
  }
}).observe({entryTypes: ['first-input']});
```

**최적화 방법**
- JavaScript 번들 크기 감소
- 코드 스플리팅
- 긴 작업 분할
- Web Workers 활용

### Cumulative Layout Shift (CLS)

**목표**: 0.1 이하

**측정 방법**
```javascript
let clsValue = 0;
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    if (!entry.hadRecentInput) {
      clsValue += entry.value;
    }
  }
  console.log('CLS:', clsValue);
}).observe({entryTypes: ['layout-shift']});
```

**최적화 방법**
- 이미지/비디오 크기 지정
- 폰트 로딩 최적화
- 동적 콘텐츠에 공간 예약
- 애니메이션 최적화

## 3. JavaScript 최적화 체크리스트

### 번들 크기 최적화

**체크리스트**
- [ ] 불필요한 라이브러리 제거
- [ ] Tree shaking 활성화
- [ ] 코드 스플리팅 적용
- [ ] 동적 import 사용
- [ ] 번들 분석 도구 사용

**번들 분석 도구**
```bash
# webpack-bundle-analyzer
npm install --save-dev webpack-bundle-analyzer

# 사용
npx webpack-bundle-analyzer dist/stats.json
```

### 코드 최적화

**체크리스트**
- [ ] 불필요한 재렌더링 방지 (React.memo, useMemo)
- [ ] 이벤트 리스너 정리
- [ ] 메모리 누수 확인
- [ ] 무거운 연산 최적화
- [ ] 디바운싱/스로틀링 적용

**예시: 디바운싱**
```javascript
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 사용
const handleSearch = debounce((query) => {
  // 검색 로직
}, 300);
```

### 리소스 로딩 최적화

**체크리스트**
- [ ] 중요 리소스 우선 로딩 (preload)
- [ ] 비중요 리소스 지연 로딩 (defer, async)
- [ ] 이미지 lazy loading
- [ ] 폰트 최적화 (font-display: swap)
- [ ] 서비스 워커 활용

**리소스 힌트 예시**
```html
<!-- 중요 리소스 -->
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="main.js" as="script">

<!-- 폰트 최적화 -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
```

## 4. 실무 최적화 가이드

### 단계별 최적화 프로세스

**1단계: 측정**
- Lighthouse로 현재 성능 점수 확인
- WebPageTest로 상세 분석
- Chrome DevTools로 병목 지점 파악

**2단계: 우선순위 설정**
- Core Web Vitals 개선 우선
- 사용자 경험에 큰 영향 주는 항목부터
- ROI가 높은 최적화부터

**3단계: 최적화 적용**
- 번들 크기 감소
- 코드 최적화
- 리소스 로딩 개선

**4단계: 재측정 및 검증**
- 개선 효과 확인
- 회귀 테스트
- 지속적 모니터링

### 성능 예산 설정

**권장 성능 예산**

| 지표 | 목표 | 경고 | 위험 |
|------|------|------|------|
| **LCP** | < 2.5s | 2.5-4s | > 4s |
| **FID** | < 100ms | 100-300ms | > 300ms |
| **CLS** | < 0.1 | 0.1-0.25 | > 0.25 |
| **번들 크기** | < 200KB | 200-500KB | > 500KB |

**성능 예산 적용**
```javascript
// package.json
{
  "bundlesize": [
    {
      "path": "./dist/main.js",
      "maxSize": "200 KB"
    }
  ]
}
```

## 5. 도구별 활용 팁

### Lighthouse 활용

**CI/CD 통합**
```yaml
# GitHub Actions 예시
- name: Run Lighthouse CI
  run: |
    npm install -g @lhci/cli
    lhci autorun
```

**정기 모니터링**
- 주간 성능 리포트 생성
- 성능 회귀 감지
- 팀 공유

### Chrome DevTools 활용

**메모리 프로파일링**
1. Memory 탭 열기
2. Heap snapshot 생성
3. 메모리 누수 확인
4. 비교 분석

**네트워크 분석**
- 느린 요청 식별
- 중복 요청 확인
- 캐싱 전략 검증

## 6. 프레임워크별 최적화

### React 최적화

**체크리스트**
- [ ] React.memo로 불필요한 리렌더링 방지
- [ ] useMemo, useCallback 활용
- [ ] 코드 스플리팅 (React.lazy)
- [ ] 가상화 (react-window) 적용
- [ ] 프로덕션 빌드 사용

**예시: React.lazy**
```javascript
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

### Vue 최적화

**체크리스트**
- [ ] v-once, v-memo 사용
- [ ] computed 속성 활용
- [ ] 비동기 컴포넌트
- [ ] 가상 스크롤

### Vanilla JavaScript 최적화

**체크리스트**
- [ ] 이벤트 위임 사용
- [ ] DOM 조작 최소화
- [ ] requestAnimationFrame 활용
- [ ] Web Workers 활용

## 7. 모니터링 및 지속적 개선

### 실시간 모니터링

**도구**
- Google Analytics (Core Web Vitals)
- New Relic
- Datadog
- Sentry

**설정**
```javascript
// Core Web Vitals 추적
import {getCLS, getFID, getLCP} from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

### 성능 대시보드

**구성 요소**
- Core Web Vitals 추이
- 페이지별 성능 비교
- 사용자 기기별 성능
- 에러율 및 성능 상관관계

## FAQ

**Q: 성능 최적화를 어디서부터 시작해야 하나요?**  
A: Lighthouse로 현재 상태를 측정하고, Core Web Vitals 점수가 낮은 항목부터 개선하는 것을 추천한다.

**Q: 번들 크기를 얼마나 줄여야 하나요?**  
A: 초기 로딩 번들은 200KB 이하를 목표로 하되, 프로젝트 특성에 따라 조정한다.

**Q: 모든 최적화를 한 번에 적용해야 하나요?**  
A: 단계적으로 적용하고 각 단계마다 측정하여 효과를 확인하는 것이 좋다.

**Q: 모바일 성능은 어떻게 측정하나요?**  
A: Chrome DevTools의 Device Toolbar를 사용하거나 WebPageTest에서 모바일 기기를 선택한다.

**Q: 성능 최적화 후에도 점수가 낮은 이유는?**  
A: 서버 응답 시간, 네트워크 속도, 서드파티 스크립트 등 다양한 요인이 영향을 준다. 전체적인 분석이 필요하다.

**Q: 성능 예산을 어떻게 설정하나요?**  
A: 현재 성능을 기준으로 10-20% 개선을 목표로 설정하고, 점진적으로 목표를 높여간다.

## 성능 최적화 후 프로젝트 기회

JavaScript 성능 최적화 기술을 습득했다면, 실제 프로젝트에서 이를 적용해볼 수 있다. [블루버튼](https://bluebutton.kr/) 같은 플랫폼에서 성능 최적화가 필요한 웹 애플리케이션 프로젝트를 찾아 실전 경험을 쌓을 수 있다. 특히 느린 로딩 속도로 고민하는 프로젝트, Core Web Vitals 개선이 필요한 프로젝트, 대규모 프론트엔드 애플리케이션 최적화 프로젝트에서 이 글에서 배운 지식을 바로 활용할 수 있다.

