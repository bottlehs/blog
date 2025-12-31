---
templateKey: blog-post
title: TypeScript 완전정복 - 타입 시스템부터 고급 패턴까지
date: 2025-11-28T00:00:00.000Z
category: javascript
description:
  TypeScript의 타입 시스템부터 고급 패턴까지 실전 예제와 함께 완벽하게 정리합니다. 제네릭, 유틸리티 타입, 조건부 타입, 타입 가드, 모듈 시스템 등 TypeScript의 모든 것을 다룹니다.
tags:
  - TypeScript
  - 타입 시스템
  - 제네릭
  - 유틸리티 타입
  - JavaScript
  - 프론트엔드
  - 웹 개발
---

# TypeScript 완전정복 - 타입 시스템부터 고급 패턴까지

TypeScript는 JavaScript에 정적 타입을 추가한 언어로, 대규모 애플리케이션 개발에서 필수적인 도구가 되었다. 이 글은 TypeScript의 기본 개념부터 고급 패턴까지 실전 예제와 함께 완벽하게 정리한다.

## 1. TypeScript 기본 타입 시스템

### 1-1. 기본 타입

```typescript
// 원시 타입
let name: string = "TypeScript";
let age: number = 10;
let isActive: boolean = true;
let data: null = null;
let value: undefined = undefined;

// 배열
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["Alice", "Bob"];

// 튜플
let tuple: [string, number] = ["hello", 42];

// 열거형
enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE"
}

// any와 unknown
let anyValue: any = "anything";
let unknownValue: unknown = "unknown";

// void와 never
function noReturn(): void {
  console.log("no return");
}

function neverReturns(): never {
  throw new Error("never returns");
}
```

### 1-2. 타입 추론

```typescript
// 타입 추론
let inferredString = "hello"; // string으로 추론
let inferredNumber = 42; // number로 추론

// 명시적 타입 지정
let explicitString: string = "hello";

// 함수 반환 타입 추론
function add(a: number, b: number) {
  return a + b; // 반환 타입: number
}

// 명시적 반환 타입
function multiply(a: number, b: number): number {
  return a * b;
}
```

### 1-3. 유니온과 인터섹션 타입

```typescript
// 유니온 타입 (또는)
type StringOrNumber = string | number;

function processValue(value: StringOrNumber) {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else {
    return value.toFixed(2);
  }
}

// 인터섹션 타입 (그리고)
interface Person {
  name: string;
  age: number;
}

interface Employee {
  employeeId: string;
  department: string;
}

type EmployeePerson = Person & Employee;

const employee: EmployeePerson = {
  name: "Alice",
  age: 30,
  employeeId: "E001",
  department: "Engineering"
};
```

## 2. 인터페이스와 타입 별칭

### 2-1. 인터페이스

```typescript
// 기본 인터페이스
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // 선택적 속성
  readonly createdAt: Date; // 읽기 전용
}

// 인터페이스 확장
interface Admin extends User {
  role: "admin";
  permissions: string[];
}

// 함수 타입 인터페이스
interface Calculator {
  (x: number, y: number): number;
}

const add: Calculator = (x, y) => x + y;

// 인덱스 시그니처
interface Dictionary {
  [key: string]: number;
}

const scores: Dictionary = {
  math: 95,
  science: 88
};
```

### 2-2. 타입 별칭

```typescript
// 타입 별칭
type ID = string | number;
type Status = "pending" | "approved" | "rejected";

// 함수 타입 별칭
type EventHandler = (event: Event) => void;

// 제네릭 타입 별칭
type Container<T> = {
  value: T;
  timestamp: Date;
};

// 유니온과 인터섹션
type StringOrNumber = string | number;
type PersonAndEmployee = Person & Employee;
```

### 2-3. 인터페이스 vs 타입 별칭

```typescript
// 인터페이스는 확장 가능
interface Base {
  id: number;
}

interface Extended extends Base {
  name: string;
}

// 타입 별칭은 유니온/인터섹션에 유리
type Status = "active" | "inactive";
type ID = string | number;

// 인터페이스는 선언 병합 가능
interface Config {
  apiUrl: string;
}

interface Config {
  timeout: number;
}

// 최종 Config는 두 속성 모두 포함
```

## 3. 제네릭 (Generics)

### 3-1. 기본 제네릭

```typescript
// 제네릭 함수
function identity<T>(arg: T): T {
  return arg;
}

const stringValue = identity<string>("hello");
const numberValue = identity<number>(42);

// 제네릭 인터페이스
interface Box<T> {
  value: T;
  getValue(): T;
}

const stringBox: Box<string> = {
  value: "hello",
  getValue() {
    return this.value;
  }
};

// 제네릭 클래스
class Container<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T {
    return this.items[index];
  }
}

const numberContainer = new Container<number>();
numberContainer.add(1);
numberContainer.add(2);
```

### 3-2. 제네릭 제약 조건

```typescript
// extends로 제약
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength("hello"); // OK
logLength([1, 2, 3]); // OK
// logLength(42); // Error: number는 length 속성이 없음

// keyof 제약
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "Alice", age: 30 };
const name = getProperty(person, "name"); // OK
// const invalid = getProperty(person, "invalid"); // Error
```

### 3-3. 제네릭 유틸리티

```typescript
// 제네릭 함수 오버로드
function process<T extends string>(value: T): string;
function process<T extends number>(value: T): number;
function process<T>(value: T): T {
  return value;
}

// 조건부 제네릭
type IsArray<T> = T extends any[] ? true : false;
type Test1 = IsArray<string[]>; // true
type Test2 = IsArray<string>; // false

// 제네릭 기본값
interface ApiResponse<T = any> {
  data: T;
  status: number;
}

const response1: ApiResponse = { data: "hello", status: 200 };
const response2: ApiResponse<User> = { data: user, status: 200 };
```

## 4. 고급 타입

### 4-1. 조건부 타입 (Conditional Types)

```typescript
// 기본 조건부 타입
type IsString<T> = T extends string ? true : false;

type Test1 = IsString<string>; // true
type Test2 = IsString<number>; // false

// 분배 조건부 타입
type ToArray<T> = T extends any ? T[] : never;
type StringArray = ToArray<string | number>; // string[] | number[]

// Exclude와 Extract 구현
type MyExclude<T, U> = T extends U ? never : T;
type MyExtract<T, U> = T extends U ? T : never;

type Result1 = MyExclude<"a" | "b" | "c", "a">; // "b" | "c"
type Result2 = MyExtract<"a" | "b" | "c", "a">; // "a"

// infer 키워드
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

type FuncReturn = ReturnType<() => string>; // string
```

### 4-2. 매핑된 타입 (Mapped Types)

```typescript
// 기본 매핑된 타입
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};

// 사용 예시
interface User {
  id: number;
  name: string;
  email?: string;
}

type ReadonlyUser = Readonly<User>;
type PartialUser = Partial<User>;
type RequiredUser = Required<User>;

// 커스텀 매핑된 타입
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type Stringify<T> = {
  [P in keyof T]: string;
};
```

### 4-3. 템플릿 리터럴 타입

```typescript
// 기본 템플릿 리터럴 타입
type EventName = `on${string}`;
type ClickEvent = `onClick`;
type HoverEvent = `onHover`;

// 고급 템플릿 리터럴 타입
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiEndpoint = `/api/${string}`;
type FullEndpoint = `${HttpMethod} ${ApiEndpoint}`;

type GetUsers = "GET /api/users"; // OK
// type Invalid = "PATCH /api/users"; // Error

// 유니온과 조합
type Color = "red" | "green" | "blue";
type Size = "small" | "medium" | "large";
type ButtonClass = `btn-${Color}-${Size}`;
// "btn-red-small" | "btn-red-medium" | "btn-red-large" | ...
```

## 5. 유틸리티 타입

### 5-1. 기본 유틸리티 타입

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  createdAt: Date;
}

// Pick: 특정 속성만 선택
type UserPreview = Pick<User, "id" | "name" | "email">;

// Omit: 특정 속성 제외
type UserWithoutDates = Omit<User, "createdAt">;

// Partial: 모든 속성을 선택적으로
type PartialUser = Partial<User>;

// Required: 모든 속성을 필수로
type RequiredUser = Required<PartialUser>;

// Readonly: 모든 속성을 읽기 전용으로
type ReadonlyUser = Readonly<User>;

// Record: 키-값 타입 매핑
type UserRoles = Record<string, "admin" | "user" | "guest">;
```

### 5-2. 고급 유틸리티 타입

```typescript
// Exclude: 유니온에서 특정 타입 제외
type NonNullable<T> = T extends null | undefined ? never : T;
type StringOrNumber = string | number | null;
type ValidValue = NonNullable<StringOrNumber>; // string | number

// Extract: 유니온에서 특정 타입만 추출
type StringOnly = Extract<string | number | boolean, string>; // string

// Parameters: 함수의 매개변수 타입 추출
type FuncParams = Parameters<(a: number, b: string) => void>; // [number, string]

// ReturnType: 함수의 반환 타입 추출
type FuncReturn = ReturnType<() => string>; // string

// ConstructorParameters: 생성자의 매개변수 타입
class User {
  constructor(public id: number, public name: string) {}
}
type UserParams = ConstructorParameters<typeof User>; // [number, string]

// InstanceType: 인스턴스 타입
type UserInstance = InstanceType<typeof User>; // User
```

### 5-3. 커스텀 유틸리티 타입

```typescript
// 깊은 읽기 전용
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// 깊은 Partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 함수 타입에서 특정 매개변수 제거
type OmitFirstArg<F> = F extends (first: any, ...rest: infer R) => infer Return
  ? (...args: R) => Return
  : never;

type Original = (a: number, b: string, c: boolean) => void;
type WithoutFirst = OmitFirstArg<Original>; // (b: string, c: boolean) => void
```

## 6. 타입 가드와 타입 단언

### 6-1. 타입 가드

```typescript
// typeof 타입 가드
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function process(value: unknown) {
  if (isString(value)) {
    // 여기서 value는 string 타입
    console.log(value.toUpperCase());
  }
}

// instanceof 타입 가드
class Dog {
  bark() {
    console.log("Woof!");
  }
}

class Cat {
  meow() {
    console.log("Meow!");
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}

// in 연산자 타입 가드
interface Bird {
  fly(): void;
}

interface Fish {
  swim(): void;
}

function move(animal: Bird | Fish) {
  if ("fly" in animal) {
    animal.fly();
  } else {
    animal.swim();
  }
}
```

### 6-2. 커스텀 타입 가드

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

interface Admin {
  id: number;
  name: string;
  role: "admin";
  permissions: string[];
}

function isAdmin(user: User | Admin): user is Admin {
  return "role" in user && user.role === "admin";
}

function processUser(user: User | Admin) {
  if (isAdmin(user)) {
    // 여기서 user는 Admin 타입
    console.log(user.permissions);
  } else {
    // 여기서 user는 User 타입
    console.log(user.email);
  }
}
```

### 6-3. 타입 단언

```typescript
// as 단언
const value = document.getElementById("myInput") as HTMLInputElement;
value.value = "hello";

// angle bracket 단언 (JSX에서는 사용 불가)
const element = <HTMLInputElement>document.getElementById("myInput");

// non-null 단언
function getElement(id: string) {
  return document.getElementById(id)!; // null이 아님을 단언
}

// 타입 단언 vs 타입 가드
// 타입 단언: 개발자가 보장 (런타임 체크 없음)
const user = data as User;

// 타입 가드: 런타임 체크
if (isUser(data)) {
  // data는 User 타입
}
```

## 7. 모듈 시스템

### 7-1. ES 모듈

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export const PI = 3.14159;

// default export
export default class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
}

// app.ts
import Calculator, { add, subtract, PI } from "./math";
import * as MathUtils from "./math";

const calc = new Calculator();
const sum = add(1, 2);
const diff = subtract(5, 3);
const area = PI * 10 * 10;
```

### 7-2. 네임스페이스

```typescript
// utils.ts
namespace MathUtils {
  export function add(a: number, b: number): number {
    return a + b;
  }

  export function subtract(a: number, b: number): number {
    return a - b;
  }

  export namespace Geometry {
    export function area(radius: number): number {
      return Math.PI * radius * radius;
    }
  }
}

// 사용
MathUtils.add(1, 2);
MathUtils.Geometry.area(10);
```

### 7-3. 타입 선언 파일 (.d.ts)

```typescript
// types.d.ts
declare module "my-module" {
  export function doSomething(): void;
  export const value: number;
}

// 전역 타입 선언
declare global {
  interface Window {
    myCustomProperty: string;
  }
}

// 외부 라이브러리 타입 확장
declare module "express" {
  interface Request {
    user?: User;
  }
}
```

## 8. 데코레이터 (Decorators)

### 8-1. 클래스 데코레이터

```typescript
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return "Hello, " + this.greeting;
  }
}

// 메서드 데코레이터
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with`, args);
    const result = originalMethod.apply(this, args);
    console.log(`${propertyKey} returned`, result);
    return result;
  };

  return descriptor;
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }
}
```

### 8-2. 속성 데코레이터

```typescript
function readonly(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    writable: false
  });
}

class User {
  @readonly
  id: number = 1;
  name: string = "Alice";
}

// 매개변수 데코레이터
function validate(target: any, propertyKey: string, parameterIndex: number) {
  // 검증 로직
}

class ApiService {
  getUser(@validate id: number) {
    // ...
  }
}
```

## 9. 실전 패턴

### 9-1. 빌더 패턴

```typescript
class QueryBuilder<T> {
  private conditions: string[] = [];
  private limitValue?: number;
  private offsetValue?: number;

  where(condition: string): this {
    this.conditions.push(condition);
    return this;
  }

  limit(count: number): this {
    this.limitValue = count;
    return this;
  }

  offset(count: number): this {
    this.offsetValue = count;
    return this;
  }

  build(): string {
    let query = "SELECT * FROM table";
    if (this.conditions.length > 0) {
      query += " WHERE " + this.conditions.join(" AND ");
    }
    if (this.limitValue) {
      query += ` LIMIT ${this.limitValue}`;
    }
    if (this.offsetValue) {
      query += ` OFFSET ${this.offsetValue}`;
    }
    return query;
  }
}

const query = new QueryBuilder()
  .where("age > 18")
  .where("status = 'active'")
  .limit(10)
  .offset(0)
  .build();
```

### 9-2. 팩토리 패턴

```typescript
interface Animal {
  makeSound(): void;
}

class Dog implements Animal {
  makeSound() {
    console.log("Woof!");
  }
}

class Cat implements Animal {
  makeSound() {
    console.log("Meow!");
  }
}

type AnimalType = "dog" | "cat";

class AnimalFactory {
  static create(type: AnimalType): Animal {
    switch (type) {
      case "dog":
        return new Dog();
      case "cat":
        return new Cat();
      default:
        throw new Error(`Unknown animal type: ${type}`);
    }
  }
}

const dog = AnimalFactory.create("dog");
dog.makeSound();
```

### 9-3. 싱글톤 패턴

```typescript
class Database {
  private static instance: Database;

  private constructor() {
    // private 생성자로 외부 인스턴스화 방지
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  query(sql: string): any {
    // 데이터베이스 쿼리 로직
    return {};
  }
}

const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2); // true
```

## 10. 타입 안전성 모범 사례

### 10-1. 엄격한 타입 사용

```typescript
// ❌ 나쁜 예: any 사용
function processData(data: any) {
  return data.value;
}

// ✅ 좋은 예: 구체적인 타입 사용
interface Data {
  value: string;
  timestamp: Date;
}

function processData(data: Data): string {
  return data.value;
}
```

### 10-2. 타입 가드 활용

```typescript
// ❌ 나쁜 예: 타입 단언 남용
function getValue(data: unknown): string {
  return (data as { value: string }).value;
}

// ✅ 좋은 예: 타입 가드 사용
function isDataWithValue(data: unknown): data is { value: string } {
  return (
    typeof data === "object" &&
    data !== null &&
    "value" in data &&
    typeof (data as any).value === "string"
  );
}

function getValue(data: unknown): string {
  if (isDataWithValue(data)) {
    return data.value;
  }
  throw new Error("Invalid data");
}
```

### 10-3. 제네릭 활용

```typescript
// ❌ 나쁜 예: 타입이 구체적이지 않음
function getFirst(arr: any[]): any {
  return arr[0];
}

// ✅ 좋은 예: 제네릭 사용
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}

const firstNumber = getFirst([1, 2, 3]); // number | undefined
const firstString = getFirst(["a", "b", "c"]); // string | undefined
```

## 11. 결론

TypeScript는 JavaScript 개발을 더 안전하고 유지보수하기 쉽게 만들어주는 강력한 도구다. 이 글에서 다룬 내용:

1. **기본 타입 시스템**: 원시 타입, 배열, 튜플, 열거형
2. **인터페이스와 타입 별칭**: 객체 구조 정의
3. **제네릭**: 재사용 가능한 타입 코드
4. **고급 타입**: 조건부 타입, 매핑된 타입, 템플릿 리터럴 타입
5. **유틸리티 타입**: Pick, Omit, Partial 등
6. **타입 가드**: 런타임 타입 검증
7. **모듈 시스템**: ES 모듈, 네임스페이스
8. **데코레이터**: 메타프로그래밍
9. **실전 패턴**: 빌더, 팩토리, 싱글톤

이러한 기능들을 적절히 활용하면 타입 안전하고 확장 가능한 애플리케이션을 구축할 수 있다.

## 참고 자료

- [TypeScript 공식 문서](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)









