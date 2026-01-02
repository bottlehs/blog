---
templateKey: blog-post
title: 웹 성능 최적화 완전정복 - Core Web Vitals부터 번들 최적화까지
date: 2025-12-29T07:00:00.000Z
category: javascript
description: 웹 성능 최적화의 모든 것을 다룬다. Core Web Vitals 이해와 측정, 번들 크기 최적화, 이미지 최적화, 캐싱 전략, 코드 스플리팅까지 실무에서 바로 적용할 수 있는 최적화 기법을 정리한다.
tags:
  - 웹 성능
  - 성능 최적화
  - Core Web Vitals
  - 번들 최적화
  - 이미지 최적화
  - 캐싱
  - 코드 스플리팅
  - Lighthouse
  - 웹 최적화
---

![웹 성능 최적화 완전정복](/assets/javascript.png "웹 성능 최적화 완전정복")

웹 성능은 사용자 경험과 비즈니스 성과에 직접적인 영향을 미친다. 페이지 로딩 시간이 1초 늦어지면 전환율이 7% 감소한다는 연구 결과도 있다. 이 글은 Core Web Vitals부터 번들 최적화까지 웹 성능 최적화의 모든 것을 실전 예제와 함께 정리한다.

## 1. 웹 성능 최적화 개요

### 1-1. 성능이 중요한 이유

**사용자 경험:**
- 빠른 로딩 = 더 나은 사용자 경험
- 느린 사이트 = 이탈률 증가

**비즈니스 영향:**
- 전환율: 로딩 시간 1초 감소 시 전환율 7% 증가
- 검색 순위: Google이 페이지 속도를 랭킹 요소로 사용
- 사용자 만족도: 빠른 사이트는 사용자 만족도 향상

**핵심 메트릭:**
- **LCP (Largest Contentful Paint)**: 주요 콘텐츠 로딩 시간
- **FID (First Input Delay)**: 첫 상호작용 지연 시간
- **CLS (Cumulative Layout Shift)**: 레이아웃 안정성

### 1-2. 성능 측정 도구

**Chrome DevTools:**
- Performance 탭: 상세한 성능 분석
- Lighthouse: 종합 성능 점수
- Network 탭: 네트워크 요청 분석

**온라인 도구:**
- PageSpeed Insights: Google의 성능 분석
- WebPageTest: 상세한 성능 메트릭
- GTmetrix: 성능 리포트

**실시간 모니터링:**
- Google Analytics: 실제 사용자 메트릭
- Real User Monitoring (RUM): 실제 사용자 성능 데이터

## 2. Core Web Vitals 이해

### 2-1. LCP (Largest Contentful Paint)

LCP는 페이지의 주요 콘텐츠가 로딩되는 시간을 측정한다.

**목표 값:**
- 좋음: 2.5초 이하
- 개선 필요: 2.5초 ~ 4초
- 나쁨: 4초 초과

**최적화 방법:**

**1. 이미지 최적화**
```html
<!-- 나쁜 예: 큰 이미지 -->
<img src="hero.jpg" alt="Hero" />

<!-- 좋은 예: 최적화된 이미지 -->
<img 
  src="hero.webp" 
  srcset="hero-400.webp 400w, hero-800.webp 800w"
  sizes="(max-width: 600px) 400px, 800px"
  alt="Hero"
  loading="lazy"
/>
```

**2. 리소스 우선순위**
```html
<!-- 중요한 리소스는 preload -->
<link rel="preload" href="critical.css" as="style" />
<link rel="preload" href="hero-image.jpg" as="image" />

<!-- 폰트 preload -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin />
```

**3. 서버 응답 시간 최적화**
- CDN 사용
- 서버 최적화
- 캐싱 전략

### 2-2. FID (First Input Delay)

FID는 사용자가 페이지와 처음 상호작용할 때의 지연 시간을 측정한다.

**목표 값:**
- 좋음: 100ms 이하
- 개선 필요: 100ms ~ 300ms
- 나쁨: 300ms 초과

**최적화 방법:**

**1. JavaScript 실행 시간 최소화**
```javascript
// 나쁜 예: 동기적 무거운 작업
function processData() {
  const data = heavyComputation(); // 블로킹
  return data;
}

// 좋은 예: 비동기 처리
async function processData() {
  // 메인 스레드 블로킹 방지
  const data = await heavyComputationAsync();
  return data;
}
```

**2. 이벤트 핸들러 최적화**
```javascript
// 나쁜 예: 즉시 실행
button.addEventListener('click', () => {
  heavyOperation(); // 블로킹
});

// 좋은 예: requestIdleCallback 사용
button.addEventListener('click', () => {
  requestIdleCallback(() => {
    heavyOperation(); // 유휴 시간에 실행
  });
});
```

**3. 웹 워커 활용**
```javascript
// 메인 스레드에서 무거운 작업 제거
const worker = new Worker('worker.js');

worker.postMessage({ data: largeData });
worker.onmessage = (e) => {
  console.log('Result:', e.data);
};
```

### 2-3. CLS (Cumulative Layout Shift)

CLS는 페이지 로딩 중 레이아웃이 얼마나 이동하는지 측정한다.

**목표 값:**
- 좋음: 0.1 이하
- 개선 필요: 0.1 ~ 0.25
- 나쁨: 0.25 초과

**최적화 방법:**

**1. 이미지 크기 지정**
```html
<!-- 나쁜 예: 크기 미지정 -->
<img src="image.jpg" alt="Image" />

<!-- 좋은 예: 크기 지정 -->
<img 
  src="image.jpg" 
  alt="Image"
  width="800"
  height="600"
  style="aspect-ratio: 800/600"
/>
```

**2. 동적 콘텐츠 공간 예약**
```css
/* 나쁜 예: 높이 미지정 */
.ad-container {
  /* 높이 없음 */
}

/* 좋은 예: 최소 높이 지정 */
.ad-container {
  min-height: 250px;
}
```

**3. 폰트 로딩 최적화**
```css
/* FOIT (Flash of Invisible Text) 방지 */
@font-face {
  font-family: 'MyFont';
  src: url('font.woff2') format('woff2');
  font-display: swap; /* 즉시 fallback 폰트 표시 */
}
```

## 3. 번들 크기 최적화

### 3-1. 번들 분석

**webpack-bundle-analyzer:**
```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
  ],
};
```

**Vite 번들 분석:**
```bash
npm install --save-dev rollup-plugin-visualizer

# vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
};
```

### 3-2. Tree Shaking

Tree Shaking은 사용하지 않는 코드를 제거한다.

**ES Modules 사용:**
```javascript
// 나쁜 예: CommonJS
const _ = require('lodash');
const result = _.map([1, 2, 3], x => x * 2);

// 좋은 예: ES Modules
import { map } from 'lodash-es';
const result = map([1, 2, 3], x => x * 2);
```

**package.json 설정:**
```json
{
  "sideEffects": false,
  "module": "esm/index.js",
  "main": "cjs/index.js"
}
```

### 3-3. 코드 스플리팅

**동적 임포트:**
```javascript
// 나쁜 예: 모든 코드를 한 번에 로드
import HeavyComponent from './HeavyComponent';

function App() {
  return <HeavyComponent />;
}

// 좋은 예: 필요할 때만 로드
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

**라우트 기반 스플리팅:**
```javascript
// React Router
import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}
```

**Next.js 자동 스플리팅:**
```javascript
// pages/index.js - 자동으로 코드 스플리팅됨
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('../components/Heavy'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // 서버 사이드 렌더링 비활성화
});

export default function Home() {
  return <DynamicComponent />;
}
```

### 3-4. 라이브러리 최적화

**전체 라이브러리 대신 필요한 부분만:**
```javascript
// 나쁜 예: 전체 라이브러리
import _ from 'lodash';
const result = _.debounce(fn, 300);

// 좋은 예: 필요한 함수만
import debounce from 'lodash/debounce';
const result = debounce(fn, 300);

// 더 좋은 예: 작은 라이브러리 사용
import debounce from 'lodash-es/debounce';
```

**대안 라이브러리 사용:**
```javascript
// 나쁜 예: 큰 라이브러리
import moment from 'moment';

// 좋은 예: 작은 대안
import { format } from 'date-fns';
```

## 4. 이미지 최적화

### 4-1. 이미지 포맷 선택

**최신 포맷 사용:**
```html
<!-- WebP 지원 브라우저 -->
<picture>
  <source srcset="image.webp" type="image/webp" />
  <source srcset="image.avif" type="image/avif" />
  <img src="image.jpg" alt="Image" />
</picture>
```

**Next.js Image 컴포넌트:**
```javascript
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={800}
  height={600}
  priority // LCP 이미지인 경우
  placeholder="blur" // 블러 플레이스홀더
/>
```

### 4-2. 반응형 이미지

**srcset 사용:**
```html
<img
  srcset="
    image-400.jpg 400w,
    image-800.jpg 800w,
    image-1200.jpg 1200w
  "
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
  src="image-800.jpg"
  alt="Image"
/>
```

### 4-3. Lazy Loading

**네이티브 Lazy Loading:**
```html
<img 
  src="image.jpg" 
  alt="Image"
  loading="lazy"
  decoding="async"
/>
```

**Intersection Observer:**
```javascript
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      observer.unobserve(img);
    }
  });
});

images.forEach(img => imageObserver.observe(img));
```

### 4-4. 이미지 압축

**도구:**
- **Sharp**: Node.js 이미지 처리
- **ImageOptim**: 이미지 압축 도구
- **Squoosh**: 웹 기반 이미지 압축

**자동화:**
```javascript
// webpack 이미지 최적화
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
        },
      }),
    ],
  },
};
```

## 5. 캐싱 전략

### 5-1. HTTP 캐싱

**Cache-Control 헤더:**
```javascript
// 정적 자산: 긴 캐시
app.use('/static', express.static('public', {
  maxAge: '1y', // 1년
  immutable: true,
}));

// HTML: 짧은 캐시
app.get('*.html', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=3600'); // 1시간
  res.sendFile(path.join(__dirname, 'index.html'));
});
```

**ETag 사용:**
```javascript
app.use(express.static('public', {
  etag: true,
  lastModified: true,
}));
```

### 5-2. Service Worker 캐싱

**Cache First 전략:**
```javascript
// service-worker.js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 캐시에 있으면 캐시 반환
      if (response) {
        return response;
      }
      // 없으면 네트워크 요청
      return fetch(event.request).then((response) => {
        // 캐시에 저장
        const responseToCache = response.clone();
        caches.open('v1').then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
```

**Network First 전략:**
```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 네트워크 성공 시 캐시 업데이트
        const responseToCache = response.clone();
        caches.open('v1').then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        // 네트워크 실패 시 캐시 반환
        return caches.match(event.request);
      })
  );
});
```

### 5-3. 브라우저 캐싱

**localStorage/SessionStorage:**
```javascript
// API 응답 캐싱
const cacheKey = 'api-data';
const cacheTime = 5 * 60 * 1000; // 5분

function getCachedData() {
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < cacheTime) {
      return data;
    }
  }
  return null;
}

function setCachedData(data) {
  localStorage.setItem(cacheKey, JSON.stringify({
    data,
    timestamp: Date.now(),
  }));
}
```

## 6. 리소스 로딩 최적화

### 6-1. 리소스 우선순위

**preload:**
```html
<!-- 중요한 리소스 미리 로드 -->
<link rel="preload" href="critical.css" as="style" />
<link rel="preload" href="hero-font.woff2" as="font" type="font/woff2" crossorigin />
```

**prefetch:**
```html
<!-- 다음에 필요할 리소스 미리 가져오기 -->
<link rel="prefetch" href="next-page.html" />
```

**preconnect:**
```html
<!-- 외부 도메인 연결 미리 설정 -->
<link rel="preconnect" href="https://api.example.com" />
<link rel="dns-prefetch" href="https://api.example.com" />
```

### 6-2. 폰트 최적화

**폰트 디스플레이:**
```css
@font-face {
  font-family: 'MyFont';
  src: url('font.woff2') format('woff2');
  font-display: swap; /* 즉시 fallback 표시 */
}
```

**폰트 서브셋:**
```css
/* 필요한 문자만 포함 */
@font-face {
  font-family: 'MyFont';
  src: url('font-subset.woff2') format('woff2');
  unicode-range: U+0020-007F; /* ASCII만 */
}
```

**인라인 폰트:**
```html
<!-- 작은 폰트는 인라인 -->
<style>
  @font-face {
    font-family: 'IconFont';
    src: url('data:font/woff2;base64,...') format('woff2');
  }
</style>
```

### 6-3. CSS 최적화

**Critical CSS 인라인:**
```html
<!-- 중요한 CSS는 인라인 -->
<style>
  /* Critical CSS */
  body { margin: 0; }
  .header { height: 60px; }
</style>

<!-- 나머지는 비동기 로드 -->
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
```

**CSS 최소화:**
```javascript
// webpack
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
};
```

## 7. JavaScript 최적화

### 7-1. 코드 최소화

**Terser 사용:**
```javascript
// webpack.config.js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // console.log 제거
          },
        },
      }),
    ],
  },
};
```

### 7-2. 불필요한 코드 제거

**조건부 코드:**
```javascript
// 개발 코드 제거
if (process.env.NODE_ENV === 'production') {
  // 프로덕션 코드만
}

// 또는 webpack DefinePlugin
new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production'),
}),
```

### 7-3. 비동기 로딩

**동적 임포트:**
```javascript
// 필요할 때만 로드
const loadModule = async () => {
  const module = await import('./heavy-module.js');
  return module;
};
```

## 8. 네트워크 최적화

### 8-1. HTTP/2 활용

**HTTP/2 장점:**
- 멀티플렉싱: 여러 요청 동시 처리
- 서버 푸시: 서버가 리소스 미리 전송
- 헤더 압축: 헤더 크기 감소

**설정:**
```javascript
// Node.js
const http2 = require('http2');
const server = http2.createServer((req, res) => {
  // HTTP/2 서버
});
```

### 8-2. CDN 사용

**CDN 장점:**
- 지리적 분산: 사용자와 가까운 서버에서 제공
- 캐싱: 정적 자산 캐싱
- DDoS 보호: 트래픽 분산

**설정:**
- Cloudflare
- AWS CloudFront
- Vercel Edge Network

### 8-3. 압축

**Gzip/Brotli:**
```javascript
// Express
const compression = require('compression');
app.use(compression({
  level: 6,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
}));
```

## 9. 성능 모니터링

### 9-1. Web Vitals 측정

**web-vitals 라이브러리:**
```javascript
import { getCLS, getFID, getLCP } from 'web-vitals';

function sendToAnalytics(metric) {
  // Google Analytics로 전송
  gtag('event', metric.name, {
    value: Math.round(metric.value),
    event_label: metric.id,
    non_interaction: true,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

### 9-2. Performance API

**성능 측정:**
```javascript
// 페이지 로딩 시간
window.addEventListener('load', () => {
  const perfData = performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  console.log('Page Load Time:', pageLoadTime);
});

// 리소스 로딩 시간
const resources = performance.getEntriesByType('resource');
resources.forEach(resource => {
  console.log(resource.name, resource.duration);
});
```

### 9-3. 실시간 모니터링

**Google Analytics:**
```javascript
// Web Vitals 리포트
import { onCLS, onFID, onLCP } from 'web-vitals';

onCLS(console.log);
onFID(console.log);
onLCP(console.log);
```

## 10. 실전 체크리스트

### 성능 최적화 체크리스트

**이미지:**
- [ ] WebP/AVIF 포맷 사용
- [ ] 적절한 크기로 리사이즈
- [ ] Lazy loading 적용
- [ ] srcset으로 반응형 이미지

**JavaScript:**
- [ ] 코드 스플리팅 적용
- [ ] Tree shaking 활성화
- [ ] 불필요한 코드 제거
- [ ] 동적 임포트 사용

**CSS:**
- [ ] Critical CSS 인라인
- [ ] 사용하지 않는 CSS 제거
- [ ] CSS 최소화

**캐싱:**
- [ ] HTTP 캐싱 설정
- [ ] Service Worker 구현
- [ ] CDN 사용

**네트워크:**
- [ ] HTTP/2 사용
- [ ] Gzip/Brotli 압축
- [ ] 리소스 우선순위 설정

## FAQ

**Q: 성능 최적화를 어디서부터 시작해야 하나요?**  
A: Lighthouse로 측정하여 가장 점수가 낮은 항목부터 개선하는 것이 좋다. 일반적으로 이미지 최적화와 번들 크기 감소가 큰 효과를 낸다.

**Q: 모든 최적화를 한 번에 적용해야 하나요?**  
A: 아니요, 점진적으로 적용하고 각 변경사항의 효과를 측정하는 것이 좋다. 한 번에 너무 많이 변경하면 문제 원인 파악이 어렵다.

**Q: 성능과 기능 사이의 균형은 어떻게 맞추나요?**  
A: 사용자 경험에 가장 중요한 기능에 우선순위를 두고, 나머지는 점진적으로 최적화한다. 완벽보다는 실용적인 개선이 중요하다.

**Q: 모바일과 데스크톱 성능을 다르게 최적화해야 하나요?**  
A: 네, 모바일은 네트워크와 처리 능력이 제한적이므로 더 공격적인 최적화가 필요하다. 반응형 이미지와 조건부 로딩을 활용한다.

**Q: 성능 최적화 후 어떻게 검증하나요?**  
A: Lighthouse, PageSpeed Insights, WebPageTest 등으로 측정하고, 실제 사용자 메트릭(RUM)도 모니터링한다.

**Q: 성능 최적화가 SEO에 영향을 주나요?**  
A: 네, Google은 페이지 속도를 랭킹 요소로 사용하므로 성능 최적화는 SEO에도 긍정적인 영향을 준다.

## 결론: 지속적인 성능 최적화

웹 성능 최적화는 한 번의 작업이 아니라 지속적인 프로세스다. 새로운 기능 추가, 라이브러리 업데이트, 콘텐츠 변경 등이 성능에 영향을 줄 수 있으므로 정기적으로 측정하고 개선해야 한다.

Core Web Vitals를 목표로 하되, 사용자 경험을 최우선으로 고려한다. 기술적 최적화도 중요하지만, 실제 사용자가 느끼는 성능이 가장 중요하다.

성능 최적화는 투자 대비 효과가 큰 작업이다. 작은 개선이라도 사용자 경험과 비즈니스 성과에 큰 영향을 미칠 수 있다. 지속적으로 측정하고 개선하는 문화를 만들어가자.

## 성능 최적화 후 프로젝트 기회

웹 성능 최적화를 마스터한 후, 실제 프로젝트에 적용하고 싶다면 [블루버튼](https://bluebutton.kr/) 같은 프로젝트 매칭 플랫폼을 활용할 수 있다. 성능 최적화가 중요한 프로젝트, Core Web Vitals 개선이 필요한 프로젝트, 빠른 로딩 속도가 필수인 프로젝트 등에서 실전 경험을 쌓을 수 있다. 특히 사용자 경험 개선이나 SEO 최적화가 중요한 프로젝트에서 성능 최적화의 강점을 발휘할 수 있다.



