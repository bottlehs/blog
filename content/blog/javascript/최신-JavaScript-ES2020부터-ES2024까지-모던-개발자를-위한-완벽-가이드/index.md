---
templateKey: blog-post
title: 최신 JavaScript - ES2020부터 ES2024까지, 모던 개발자를 위한 완벽 가이드
date: 2025-11-24T00:00:00.000Z
category: javascript
description:
  ES2020부터 ES2024까지 추가된 최신 JavaScript 기능을 실전 예제와 함께 설명합니다. Optional Chaining, Nullish Coalescing, Top-level await, Private fields, Pattern Matching, Records & Tuples 등 모던 JavaScript의 모든 것을 다룹니다.
tags:
  - JavaScript
  - ES2020
  - ES2021
  - ES2022
  - ES2023
  - ES2024
  - ECMAScript
  - 모던 JavaScript
  - Optional Chaining
  - Nullish Coalescing
  - Top-level await
  - Private Fields
---

# 최신 JavaScript - ES2020부터 ES2024까지, 모던 개발자를 위한 완벽 가이드

ES6(ES2015) 이후 JavaScript는 매년 새로운 기능을 추가하며 빠르게 발전하고 있다. ES2020부터 ES2024까지 5년간 추가된 기능들은 개발 경험을 크게 개선했으며, 더 안전하고 표현력 있는 코드를 작성할 수 있게 해주었다. 이 글은 최신 JavaScript 기능들을 실전 예제와 함께 체계적으로 정리한다.

## 1. ES2020 (ES11) - 비동기와 옵셔널의 시대

### 1-1. Optional Chaining (?.)

중첩된 객체 속성에 안전하게 접근할 수 있는 연산자다. `null`이나 `undefined`일 때 에러 대신 `undefined`를 반환한다.

**기존 방식의 문제점**

```javascript
// ❌ 에러 발생 가능
const user = {
  profile: {
    name: 'John',
    address: {
      city: 'Seoul'
    }
  }
};

// address가 없으면 에러 발생
const city = user.profile.address.city; // TypeError: Cannot read property 'city' of undefined

// 기존 해결 방법
const city = user.profile && user.profile.address && user.profile.address.city;
```

**Optional Chaining 사용**

```javascript
// ✅ 안전한 접근
const city = user.profile?.address?.city; // undefined (에러 없음)

// 함수 호출에도 사용 가능
const result = user.profile?.getName?.(); // 함수가 없으면 undefined

// 배열에도 사용 가능
const firstItem = arr?.[0]; // arr이 null/undefined면 undefined

// 옵셔널 체이닝과 기본값 결합
const city = user.profile?.address?.city ?? 'Unknown';
```

**실전 활용**

```javascript
// API 응답 처리
async function fetchUserData(userId) {
  const response = await fetch(`/api/users/${userId}`);
  const data = await response.json();
  
  // 안전하게 중첩 데이터 접근
  return {
    name: data?.user?.profile?.name ?? 'Anonymous',
    email: data?.user?.contact?.email,
    avatar: data?.user?.profile?.images?.[0]?.url
  };
}

// DOM 조작
const title = document.querySelector('.article')?.querySelector('.title')?.textContent;
```

### 1-2. Nullish Coalescing (??)

왼쪽 피연산자가 `null` 또는 `undefined`일 때만 오른쪽 값을 반환한다. `||` 연산자와 달리 falsy 값(`0`, `''`, `false`)을 유지한다.

**기존 방식의 문제점**

```javascript
// ❌ 0이나 빈 문자열도 기본값으로 대체됨
const count = user.count || 10; // count가 0이면 10이 됨 (의도하지 않은 동작)
const name = user.name || 'Anonymous'; // name이 ''이면 'Anonymous'가 됨
```

**Nullish Coalescing 사용**

```javascript
// ✅ null/undefined만 기본값으로 대체
const count = user.count ?? 10; // count가 0이면 0 유지
const name = user.name ?? 'Anonymous'; // name이 ''이면 '' 유지

// 옵셔널 체이닝과 함께 사용
const city = user?.address?.city ?? 'Unknown';
const age = user?.profile?.age ?? 0;
```

**실전 활용**

```javascript
// 설정값 처리
const config = {
  timeout: options.timeout ?? 5000,
  retries: options.retries ?? 3,
  debug: options.debug ?? false
};

// 함수 매개변수 기본값
function createUser(name, age = null) {
  return {
    name: name ?? 'Anonymous',
    age: age ?? 0,
    active: true
  };
}

// API 응답 처리
const response = await fetch('/api/data');
const data = await response.json() ?? {};
```

### 1-3. BigInt

임의 정밀도 정수를 표현하는 새로운 원시 타입이다. `Number.MAX_SAFE_INTEGER` (2^53 - 1)를 초과하는 정수를 안전하게 다룰 수 있다.

```javascript
// BigInt 생성
const bigNumber = 9007199254740991n; // 리터럴에 n 추가
const bigNumber2 = BigInt(9007199254740991);
const bigNumber3 = BigInt('9007199254740991');

// 연산
const a = 10n;
const b = 20n;
console.log(a + b); // 30n
console.log(a * b); // 200n
console.log(a / b); // 0n (정수 나눗셈)

// Number와 비교 (타입 변환 필요)
console.log(10n === 10); // false (타입이 다름)
console.log(10n == 10); // true (값 비교)
console.log(10n + 10); // TypeError: Cannot mix BigInt and number

// 실전 활용: ID, 타임스탬프 등
const userId = BigInt('9223372036854775807');
const timestamp = BigInt(Date.now());
```

### 1-4. Dynamic Import

런타임에 모듈을 동적으로 불러올 수 있다. 코드 스플리팅과 조건부 로딩에 유용하다.

```javascript
// 정적 import (기존)
import { utils } from './utils.js';

// 동적 import
const loadModule = async () => {
  if (condition) {
    const { utils } = await import('./utils.js');
    utils.doSomething();
  }
};

// 실전 활용: 라우트 기반 코드 스플리팅
async function loadRoute(route) {
  switch (route) {
    case '/dashboard':
      const { Dashboard } = await import('./components/Dashboard.js');
      return Dashboard;
    case '/settings':
      const { Settings } = await import('./components/Settings.js');
      return Settings;
    default:
      const { Home } = await import('./components/Home.js');
      return Home;
  }
}

// 조건부 기능 로딩
if (user.isPremium) {
  const { PremiumFeatures } = await import('./premium.js');
  PremiumFeatures.enable();
}
```

### 1-5. Promise.allSettled()

모든 Promise가 완료될 때까지 기다린다. `Promise.all()`과 달리 일부가 실패해도 모든 결과를 반환한다.

```javascript
// Promise.all() - 하나라도 실패하면 전체 실패
const promises = [
  fetch('/api/user'),
  fetch('/api/posts'),
  fetch('/api/comments')
];

try {
  const results = await Promise.all(promises);
} catch (error) {
  // 하나라도 실패하면 여기로
}

// Promise.allSettled() - 모든 결과 반환
const results = await Promise.allSettled(promises);
results.forEach((result, index) => {
  if (result.status === 'fulfilled') {
    console.log(`Promise ${index} succeeded:`, result.value);
  } else {
    console.log(`Promise ${index} failed:`, result.reason);
  }
});

// 실전 활용: 여러 API 호출
async function loadUserData(userId) {
  const [user, posts, comments, likes] = await Promise.allSettled([
    fetch(`/api/users/${userId}`).then(r => r.json()),
    fetch(`/api/users/${userId}/posts`).then(r => r.json()),
    fetch(`/api/users/${userId}/comments`).then(r => r.json()),
    fetch(`/api/users/${userId}/likes`).then(r => r.json())
  ]);

  return {
    user: user.status === 'fulfilled' ? user.value : null,
    posts: posts.status === 'fulfilled' ? posts.value : [],
    comments: comments.status === 'fulfilled' ? comments.value : [],
    likes: likes.status === 'fulfilled' ? likes.value : []
  };
}
```

### 1-6. globalThis

모든 JavaScript 환경에서 전역 객체를 참조하는 표준 방법이다.

```javascript
// 환경별 전역 객체
// 브라우저: window
// Node.js: global
// Web Worker: self

// 기존 방식 (환경 체크 필요)
const global = (function() {
  if (typeof window !== 'undefined') return window;
  if (typeof global !== 'undefined') return global;
  if (typeof self !== 'undefined') return self;
  throw new Error('Unable to locate global object');
})();

// ES2020: globalThis 사용
console.log(globalThis); // 모든 환경에서 작동

// 실전 활용
globalThis.myGlobalVar = 'Hello';
console.log(globalThis.myGlobalVar);
```

## 2. ES2021 (ES12) - 편의성 향상

### 2-1. String.prototype.replaceAll()

문자열의 모든 일치 항목을 한 번에 교체한다.

```javascript
// 기존 방식
const text = 'Hello World World';
const replaced = text.replace(/World/g, 'Universe'); // 정규식 필요
// 또는
const replaced2 = text.split('World').join('Universe'); // 복잡함

// ES2021: replaceAll()
const replaced3 = text.replaceAll('World', 'Universe'); // 'Hello Universe Universe'

// 실전 활용
function sanitizeInput(input) {
  return input
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#x27;');
}
```

### 2-2. Promise.any()

여러 Promise 중 하나라도 성공하면 그 결과를 반환한다. 모두 실패하면 AggregateError를 던진다.

```javascript
// 여러 서버에서 데이터 가져오기
const servers = [
  'https://api1.example.com/data',
  'https://api2.example.com/data',
  'https://api3.example.com/data'
];

// 첫 번째로 성공한 응답 사용
try {
  const fastest = await Promise.any(
    servers.map(url => fetch(url).then(r => r.json()))
  );
  console.log('Fastest response:', fastest);
} catch (error) {
  // 모든 요청 실패
  console.error('All requests failed:', error.errors);
}

// 실전 활용: 폴백 전략
async function fetchWithFallback(urls) {
  try {
    const data = await Promise.any(
      urls.map(url => fetch(url).then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }))
    );
    return data;
  } catch (error) {
    throw new Error('All fallback URLs failed');
  }
}
```

### 2-3. 논리 할당 연산자 (Logical Assignment Operators)

논리 연산자와 할당을 결합한 축약 문법이다.

```javascript
// &&= (Logical AND assignment)
let user = { name: 'John' };
user.name &&= user.name.toUpperCase(); // user.name이 truthy면 할당
// 동일: user.name = user.name && user.name.toUpperCase();

// ||= (Logical OR assignment)
let config = {};
config.timeout ||= 5000; // config.timeout이 falsy면 5000 할당
// 동일: config.timeout = config.timeout || 5000;

// ??= (Nullish coalescing assignment)
let options = {};
options.retries ??= 3; // options.retries가 null/undefined면 3 할당
// 동일: options.retries = options.retries ?? 3;

// 실전 활용
function initConfig(userConfig) {
  const config = {};
  config.apiUrl ||= 'https://api.example.com';
  config.timeout ??= 5000;
  config.retries ??= 3;
  config.debug &&= process.env.NODE_ENV === 'development';
  return { ...config, ...userConfig };
}
```

### 2-4. 숫자 구분자 (Numeric Separators)

큰 숫자를 읽기 쉽게 만들기 위한 구분자다.

```javascript
// 기존 방식
const billion = 1000000000; // 읽기 어려움
const hex = 0xDEADBEEF;

// ES2021: 숫자 구분자
const billion = 1_000_000_000; // 읽기 쉬움
const hex = 0xDEAD_BEEF;
const binary = 0b1010_0001_1000_0101;
const pi = 3.14159_26535_89793;

// 실전 활용
const MAX_SAFE_INTEGER = 9_007_199_254_740_991;
const creditCard = 1234_5678_9012_3456;
const fileSize = 1_048_576; // 1MB
```

### 2-5. WeakRef

객체에 대한 약한 참조를 생성한다. 가비지 컬렉션을 방해하지 않으면서 객체를 참조할 수 있다.

```javascript
// WeakRef 생성
let obj = { data: 'important' };
const weakRef = new WeakRef(obj);

// 참조된 객체 접근
let target = weakRef.deref();
if (target) {
  console.log(target.data); // 'important'
}

// 원본 객체 삭제
obj = null;

// 가비지 컬렉션 후
target = weakRef.deref();
console.log(target); // undefined (가비지 컬렉션됨)

// 실전 활용: 캐시 구현
class Cache {
  constructor() {
    this.cache = new Map();
  }

  set(key, value) {
    this.cache.set(key, new WeakRef(value));
  }

  get(key) {
    const ref = this.cache.get(key);
    if (!ref) return undefined;
    
    const value = ref.deref();
    if (!value) {
      // 가비지 컬렉션됨 - 캐시에서 제거
      this.cache.delete(key);
      return undefined;
    }
    return value;
  }
}
```

### 2-6. FinalizationRegistry

객체가 가비지 컬렉션될 때 콜백을 실행할 수 있게 해준다.

```javascript
// FinalizationRegistry 생성
const registry = new FinalizationRegistry((heldValue) => {
  console.log(`Object with value ${heldValue} was garbage collected`);
});

// 객체 등록
let obj = { data: 'test' };
registry.register(obj, 'some-value');

// 객체 삭제
obj = null;

// 가비지 컬렉션 후 콜백 실행

// 실전 활용: 리소스 정리
class ResourceManager {
  constructor() {
    this.registry = new FinalizationRegistry((resourceId) => {
      this.cleanup(resourceId);
    });
    this.resources = new Map();
  }

  register(resource) {
    const id = this.generateId();
    this.resources.set(id, resource);
    this.registry.register(resource, id);
    return id;
  }

  cleanup(id) {
    console.log(`Cleaning up resource ${id}`);
    // 리소스 정리 로직
  }
}
```

## 3. ES2022 (ES13) - 클래스와 모듈 강화

### 3-1. Top-level await

모듈의 최상위 레벨에서 `await`를 사용할 수 있다.

```javascript
// 기존 방식: async 함수 필요
(async () => {
  const data = await fetch('/api/data');
  const json = await data.json();
  // ...
})();

// ES2022: Top-level await
const data = await fetch('/api/data');
const json = await data.json();

// 실전 활용: 모듈 초기화
// config.js
const config = await fetch('/api/config').then(r => r.json());
export default config;

// main.js
import config from './config.js';
console.log(config); // 이미 로드된 설정 사용 가능
```

### 3-2. Private Fields (#)

클래스의 private 필드와 메서드를 선언할 수 있다.

```javascript
// 기존 방식: 네이밍 컨벤션 (실제로는 private 아님)
class User {
  constructor(name) {
    this._name = name; // _ 접두사 (컨벤션일 뿐)
  }
  
  getName() {
    return this._name; // 외부에서 접근 가능
  }
}

// ES2022: 진짜 private 필드
class User {
  #name; // private 필드
  #age; // private 필드
  
  constructor(name, age) {
    this.#name = name;
    this.#age = age;
  }
  
  getName() {
    return this.#name; // 클래스 내부에서만 접근 가능
  }
  
  #validateAge(age) { // private 메서드
    return age >= 0 && age <= 150;
  }
  
  setAge(age) {
    if (this.#validateAge(age)) {
      this.#age = age;
    }
  }
}

const user = new User('John', 30);
console.log(user.#name); // SyntaxError: Private field '#name' must be declared in an enclosing class
console.log(user.getName()); // 'John'

// 실전 활용: 캡슐화
class BankAccount {
  #balance = 0;
  #transactionHistory = [];
  
  deposit(amount) {
    if (amount > 0) {
      this.#balance += amount;
      this.#transactionHistory.push({ type: 'deposit', amount });
    }
  }
  
  withdraw(amount) {
    if (amount > 0 && amount <= this.#balance) {
      this.#balance -= amount;
      this.#transactionHistory.push({ type: 'withdraw', amount });
      return amount;
    }
    return 0;
  }
  
  getBalance() {
    return this.#balance;
  }
  
  getHistory() {
    return [...this.#transactionHistory]; // 복사본 반환
  }
}
```

### 3-3. Static Fields and Methods

클래스의 static 필드와 메서드를 더 명확하게 선언할 수 있다.

```javascript
// 기존 방식
class MathUtils {
  static PI = 3.14159; // 일부 환경에서만 지원
  static add(a, b) {
    return a + b;
  }
}

// ES2022: 명시적 static 필드
class MathUtils {
  static PI = 3.14159;
  static E = 2.71828;
  
  static add(a, b) {
    return a + b;
  }
  
  static #privateStaticMethod() { // private static 메서드
    return 'secret';
  }
}

// 실전 활용: 싱글톤 패턴
class DatabaseConnection {
  static #instance = null;
  
  static getInstance() {
    if (!this.#instance) {
      this.#instance = new DatabaseConnection();
    }
    return this.#instance;
  }
  
  constructor() {
    if (DatabaseConnection.#instance) {
      throw new Error('Use getInstance() instead');
    }
  }
}
```

### 3-4. Class Fields

클래스 필드를 생성자 밖에서 선언할 수 있다.

```javascript
// 기존 방식
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.createdAt = new Date();
  }
}

// ES2022: 클래스 필드
class User {
  name;
  email;
  createdAt = new Date(); // 기본값 설정 가능
  
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

// 실전 활용
class Counter {
  count = 0; // 인스턴스 필드
  static total = 0; // static 필드
  
  increment() {
    this.count++;
    Counter.total++;
  }
}
```

### 3-5. Error.cause

에러 체인을 만들 수 있게 해준다.

```javascript
// 기존 방식
try {
  await fetchData();
} catch (error) {
  throw new Error('Failed to fetch data'); // 원본 에러 정보 손실
}

// ES2022: Error.cause
try {
  await fetchData();
} catch (error) {
  throw new Error('Failed to fetch data', { cause: error });
  // 원본 에러 정보 보존
}

// 실전 활용: 에러 체이닝
async function processUserData(userId) {
  try {
    const user = await fetchUser(userId);
    return await processUser(user);
  } catch (error) {
    throw new Error('Failed to process user data', {
      cause: error,
      userId
    });
  }
}

// 에러 처리
try {
  await processUserData(123);
} catch (error) {
  console.error(error.message); // 'Failed to process user data'
  console.error(error.cause); // 원본 에러
}
```

### 3-6. Array.at()

배열의 인덱스로 양수와 음수를 모두 사용할 수 있다.

```javascript
const arr = [1, 2, 3, 4, 5];

// 기존 방식
const last = arr[arr.length - 1]; // 마지막 요소
const secondLast = arr[arr.length - 2]; // 뒤에서 두 번째

// ES2022: Array.at()
const last = arr.at(-1); // 5
const secondLast = arr.at(-2); // 4
const first = arr.at(0); // 1

// 실전 활용
function getLastItem(array) {
  return array.at(-1) ?? null;
}

function getNthFromEnd(array, n) {
  return array.at(-n);
}
```

### 3-7. Object.hasOwn()

`Object.prototype.hasOwnProperty()`의 안전한 대안이다.

```javascript
// 기존 방식의 문제
const obj = Object.create(null);
obj.hasOwnProperty('prop'); // TypeError: obj.hasOwnProperty is not a function

// 해결 방법
Object.prototype.hasOwnProperty.call(obj, 'prop');

// ES2022: Object.hasOwn()
Object.hasOwn(obj, 'prop'); // 안전하게 사용 가능

// 실전 활용
function hasProperty(obj, prop) {
  return Object.hasOwn(obj, prop);
}

// 객체 순회
for (const key in obj) {
  if (Object.hasOwn(obj, key)) {
    console.log(key, obj[key]);
  }
}
```

## 4. ES2023 (ES14) - 배열과 정렬 개선

### 4-1. Array.findLast() / Array.findLastIndex()

배열을 뒤에서부터 검색한다.

```javascript
const numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1];

// 기존 방식
const lastEven = numbers.slice().reverse().find(n => n % 2 === 0);

// ES2023: findLast()
const lastEven = numbers.findLast(n => n % 2 === 0); // 2
const lastIndex = numbers.findLastIndex(n => n % 2 === 0); // 7

// 실전 활용
function findLastError(logs) {
  return logs.findLast(log => log.level === 'error');
}

function findLastValidItem(items) {
  return items.findLast(item => item.isValid);
}
```

### 4-2. Array.toSorted() / Array.toReversed() / Array.toSpliced()

배열을 변경하지 않고 새 배열을 반환한다.

```javascript
const numbers = [3, 1, 4, 1, 5];

// 기존 방식: 원본 변경
const sorted = [...numbers].sort(); // 복사본 생성 필요
const reversed = [...numbers].reverse(); // 복사본 생성 필요

// ES2023: 불변 메서드
const sorted = numbers.toSorted(); // [1, 1, 3, 4, 5]
const reversed = numbers.toReversed(); // [5, 1, 4, 1, 3]
const spliced = numbers.toSpliced(1, 2, 9, 9); // [3, 9, 9, 1, 5]

// 원본은 변경되지 않음
console.log(numbers); // [3, 1, 4, 1, 5]

// 실전 활용: 함수형 프로그래밍
function processData(data) {
  return data
    .toSorted((a, b) => a.value - b.value)
    .toReversed()
    .filter(item => item.active);
}
```

### 4-3. Array.with()

특정 인덱스의 값을 변경한 새 배열을 반환한다.

```javascript
const arr = [1, 2, 3, 4, 5];

// 기존 방식
const newArr = [...arr];
newArr[2] = 99;

// ES2023: Array.with()
const newArr = arr.with(2, 99); // [1, 2, 99, 4, 5]

// 원본은 변경되지 않음
console.log(arr); // [1, 2, 3, 4, 5]

// 실전 활용: 불변 업데이트
function updateItem(items, index, updates) {
  return items.with(index, { ...items[index], ...updates });
}

// React 상태 업데이트
const [items, setItems] = useState([1, 2, 3]);
setItems(items => items.with(1, 99));
```

## 5. ES2024 (ES15) - 최신 기능

### 5-1. Promise.withResolvers()

Promise의 resolve와 reject를 외부에서 제어할 수 있게 해준다.

```javascript
// 기존 방식
function createPromise() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

// ES2024: Promise.withResolvers()
const { promise, resolve, reject } = Promise.withResolvers();

// 실전 활용: 이벤트 기반 Promise
class EventEmitter {
  constructor() {
    this.pending = new Map();
  }
  
  waitFor(event) {
    const { promise, resolve } = Promise.withResolvers();
    if (!this.pending.has(event)) {
      this.pending.set(event, []);
    }
    this.pending.get(event).push(resolve);
    return promise;
  }
  
  emit(event, data) {
    const resolvers = this.pending.get(event);
    if (resolvers) {
      resolvers.forEach(resolve => resolve(data));
      this.pending.delete(event);
    }
  }
}
```

### 5-2. Array.groupBy() / Array.groupByToMap()

배열을 그룹화한다.

```javascript
const users = [
  { name: 'John', role: 'admin' },
  { name: 'Jane', role: 'user' },
  { name: 'Bob', role: 'admin' },
  { name: 'Alice', role: 'user' }
];

// ES2024: Array.groupBy()
const grouped = users.groupBy(user => user.role);
// {
//   admin: [{ name: 'John', role: 'admin' }, { name: 'Bob', role: 'admin' }],
//   user: [{ name: 'Jane', role: 'user' }, { name: 'Alice', role: 'user' }]
// }

// Array.groupByToMap()
const groupedMap = users.groupByToMap(user => user.role);
// Map {
//   'admin' => [...],
//   'user' => [...]
// }

// 실전 활용
const orders = [
  { id: 1, status: 'pending', amount: 100 },
  { id: 2, status: 'completed', amount: 200 },
  { id: 3, status: 'pending', amount: 150 }
];

const byStatus = orders.groupBy(order => order.status);
const totalByStatus = Object.entries(byStatus).map(([status, orders]) => ({
  status,
  total: orders.reduce((sum, o) => sum + o.amount, 0)
}));
```

## 6. 실전 활용 패턴

### 6-1. 안전한 데이터 접근 패턴

```javascript
// API 응답 처리
async function fetchUserProfile(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    
    return {
      name: data?.user?.profile?.name ?? 'Anonymous',
      email: data?.user?.contact?.email ?? '',
      avatar: data?.user?.profile?.images?.[0]?.url,
      settings: {
        theme: data?.user?.preferences?.theme ?? 'light',
        notifications: data?.user?.preferences?.notifications ?? true
      }
    };
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw new Error('User profile fetch failed', { cause: error });
  }
}
```

### 6-2. 모던 클래스 설계

```javascript
class ApiClient {
  static #defaultConfig = {
    timeout: 5000,
    retries: 3
  };
  
  #baseUrl;
  #config;
  
  constructor(baseUrl, config = {}) {
    this.#baseUrl = baseUrl;
    this.#config = { ...ApiClient.#defaultConfig, ...config };
  }
  
  async #request(endpoint, options = {}) {
    const url = `${this.#baseUrl}${endpoint}`;
    const config = {
      ...options,
      signal: AbortSignal.timeout(this.#config.timeout)
    };
    
    for (let i = 0; i < this.#config.retries; i++) {
      try {
        const response = await fetch(url, config);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`, { cause: response });
        }
        return await response.json();
      } catch (error) {
        if (i === this.#config.retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
  
  async get(endpoint) {
    return this.#request(endpoint, { method: 'GET' });
  }
  
  async post(endpoint, data) {
    return this.#request(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
}
```

### 6-3. 함수형 프로그래밍 패턴

```javascript
// 불변 데이터 처리
function processUsers(users) {
  return users
    .toSorted((a, b) => a.name.localeCompare(b.name))
    .filter(user => user.active)
    .map(user => ({
      ...user,
      displayName: user.name.toUpperCase(),
      initials: user.name
        .split(' ')
        .map(n => n.at(0))
        .join('')
    }))
    .groupBy(user => user.role);
}

// 에러 처리 체이닝
async function processData(data) {
  try {
    const validated = await validateData(data);
    const processed = await processValidated(validated);
    return await saveProcessed(processed);
  } catch (error) {
    throw new Error('Data processing failed', { cause: error });
  }
}
```

## 7. 브라우저 호환성 및 폴리필

### 7-1. 주요 기능 호환성

- **ES2020**: 대부분의 모던 브라우저 지원
- **ES2021**: 대부분의 모던 브라우저 지원
- **ES2022**: 최신 브라우저 지원 (Chrome 94+, Firefox 93+, Safari 15.4+)
- **ES2023**: 최신 브라우저 지원
- **ES2024**: 일부 기능은 아직 실험적

### 7-2. 폴리필 사용

```javascript
// core-js 사용 예시
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// 또는 특정 기능만
import 'core-js/features/promise/all-settled';
import 'core-js/features/array/at';
```

### 7-3. Babel 설정

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "browsers": ["> 1%", "last 2 versions"]
      }
    }]
  ]
}
```

## 8. 결론

ES2020부터 ES2024까지 추가된 기능들은 JavaScript 개발을 더 안전하고 표현력 있게 만들어주었다. Optional Chaining과 Nullish Coalescing은 null/undefined 처리를 간소화했고, Top-level await는 모듈 시스템을 강화했으며, Private fields는 진정한 캡슐화를 가능하게 했다.

이러한 기능들을 적절히 활용하면:
- **더 안전한 코드**: Optional Chaining, Nullish Coalescing
- **더 명확한 코드**: Private fields, Class fields
- **더 효율적인 코드**: Array.at(), findLast()
- **더 모던한 코드**: Top-level await, Promise.withResolvers()

모던 JavaScript 개발자라면 이러한 기능들을 숙지하고 적절히 활용하여 더 나은 코드를 작성해야 한다. 하지만 브라우저 호환성을 고려하여 필요한 경우 폴리필이나 트랜스파일러를 사용하는 것도 잊지 말자.

JavaScript는 계속 발전하고 있다. 최신 기능을 따라가며 더 나은 개발 경험을 만들어가자.

---

## 참고 자료 및 면책 조항

이 글은 공개된 ECMAScript 표준 사양, 공식 문서, 그리고 공개된 기술 자료를 바탕으로 작성되었습니다.

**면책 조항**: 이 글에 포함된 내용은 교육 및 정보 제공 목적으로 작성되었습니다. 코드 예제는 표준적인 패턴과 공개된 문서를 기반으로 작성되었으며, 교육 목적으로 제공됩니다. 실제 프로덕션 환경에서 사용 시에는 적절한 테스트와 검증이 필요합니다.

**참고 자료**:
- ECMAScript 표준 사양: ECMA International 공식 문서 (https://tc39.es/ecma262/)
- MDN Web Docs: JavaScript 기능 문서 (https://developer.mozilla.org/)
- TC39 프로세스: JavaScript 기능 제안 및 표준화 과정
- 브라우저 호환성: Can I Use (https://caniuse.com/)
- 예제 코드: 표준 사양 및 공개된 문서를 기반으로 작성

