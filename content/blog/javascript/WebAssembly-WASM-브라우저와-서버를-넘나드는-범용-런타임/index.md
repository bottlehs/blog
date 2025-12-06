---
templateKey: blog-post
title: WebAssembly (WASM) - 브라우저와 서버를 넘나드는 범용 런타임
date: 2025-12-07T00:00:00.000Z
category: javascript
description:
  WebAssembly 기초부터 고급 활용까지. WASM 모듈 작성, JavaScript와의 상호작용, 성능 최적화, Rust/Go로 WASM 빌드, Node.js 서버 사이드 활용, 실전 프로젝트 예제까지 완벽하게 다룹니다.
tags:
  - WebAssembly
  - WASM
  - JavaScript
  - Rust
  - Go
  - 고성능
  - 브라우저
  - Node.js
  - 컴파일
---

# WebAssembly (WASM) - 브라우저와 서버를 넘나드는 범용 런타임

WebAssembly(WASM)는 웹에서 네이티브에 가까운 성능으로 코드를 실행할 수 있게 해주는 바이너리 명령어 형식이다. JavaScript와 함께 작동하며, C/C++, Rust, Go 등 다양한 언어로 작성된 코드를 웹에서 실행할 수 있게 한다. 이 글은 WebAssembly의 모든 것을 다룬다.

## 1. WebAssembly 개요

### 1-1. WebAssembly란?

WebAssembly는 다음과 같은 특징을 가진다:

- **고성능**: 네이티브에 가까운 실행 속도
- **안전성**: 샌드박스 환경에서 실행
- **다국어 지원**: C/C++, Rust, Go, AssemblyScript 등
- **표준화**: W3C 표준
- **브라우저/서버 지원**: 모든 주요 브라우저와 Node.js 지원

### 1-2. JavaScript vs WebAssembly

| 구분 | JavaScript | WebAssembly |
|------|------------|-------------|
| **타입** | 동적 타입 | 정적 타입 |
| **파싱** | 텍스트 파싱 필요 | 바이너리 직접 실행 |
| **성능** | 인터프리터/JIT | 네이티브에 가까움 |
| **메모리 관리** | 가비지 컬렉션 | 수동 관리 |
| **디버깅** | 쉬움 | 상대적으로 어려움 |
| **용도** | 범용 | 계산 집약적 작업 |

### 1-3. WebAssembly 사용 사례

- **이미지/비디오 처리**: 이미지 필터, 비디오 인코딩
- **게임 엔진**: Unity, Unreal Engine
- **과학 계산**: 수학 연산, 시뮬레이션
- **암호화**: 암호화/복호화 작업
- **데이터 처리**: 대용량 데이터 파싱

## 2. WebAssembly 기본 사용법

### 2-1. 간단한 WASM 모듈 (Wat 형식)

```wat
;; add.wat
(module
  (func $add (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add)
  (export "add" (func $add))
)
```

```bash
# Wat를 WASM으로 컴파일
wat2wasm add.wat -o add.wasm
```

### 2-2. JavaScript에서 WASM 로드

```javascript
// add.js
async function loadWasm() {
  const wasmModule = await WebAssembly.instantiateStreaming(
    fetch('add.wasm')
  );
  
  const { add } = wasmModule.instance.exports;
  
  console.log(add(5, 3)); // 8
  return wasmModule;
}

loadWasm();
```

### 2-3. 메모리 관리

```wat
;; memory.wat
(module
  (memory 1)  ;; 1 페이지 (64KB) 메모리 할당
  (export "memory" (memory 0))
  
  (func $store (param $offset i32) (param $value i32)
    local.get $offset
    local.get $value
    i32.store)
  
  (func $load (param $offset i32) (result i32)
    local.get $offset
    i32.load)
  
  (export "store" (func $store))
  (export "load" (func $load))
)
```

```javascript
// memory.js
async function useMemory() {
  const wasmModule = await WebAssembly.instantiateStreaming(
    fetch('memory.wasm')
  );
  
  const { memory, store, load } = wasmModule.instance.exports;
  
  // 메모리에 값 저장
  store(0, 42);
  store(4, 100);
  
  // 메모리에서 값 읽기
  console.log(load(0)); // 42
  console.log(load(4)); // 100
  
  // JavaScript에서 직접 메모리 접근
  const memoryView = new Int32Array(memory.buffer);
  console.log(memoryView[0]); // 42
  console.log(memoryView[1]); // 100
}
```

## 3. Rust로 WebAssembly 빌드

### 3-1. Rust 프로젝트 설정

```bash
# Rust 설치 확인
rustc --version

# wasm-pack 설치
cargo install wasm-pack

# 새 프로젝트 생성
cargo new --lib wasm-example
cd wasm-example
```

```toml
# Cargo.toml
[package]
name = "wasm-example"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
```

### 3-2. Rust 코드 작성

```rust
// src/lib.rs
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[wasm_bindgen]
pub struct Calculator {
    value: i32,
}

#[wasm_bindgen]
impl Calculator {
    #[wasm_bindgen(constructor)]
    pub fn new(value: i32) -> Calculator {
        Calculator { value }
    }
    
    #[wasm_bindgen]
    pub fn add(&mut self, n: i32) -> i32 {
        self.value += n;
        self.value
    }
    
    #[wasm_bindgen]
    pub fn get_value(&self) -> i32 {
        self.value
    }
}

#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u64 {
    if n <= 1 {
        return n as u64;
    }
    
    let mut a = 0u64;
    let mut b = 1u64;
    
    for _ in 2..=n {
        let temp = a + b;
        a = b;
        b = temp;
    }
    
    b
}
```

### 3-3. 빌드 및 사용

```bash
# WASM 빌드
wasm-pack build --target web

# 또는 Node.js용
wasm-pack build --target nodejs

# 또는 브라우저 번들용
wasm-pack build --target bundler
```

```javascript
// main.js
import init, { add, Calculator, fibonacci } from './wasm-example.js';

async function run() {
  // WASM 모듈 초기화
  await init();
  
  // 간단한 함수 호출
  console.log(add(5, 3)); // 8
  
  // 클래스 사용
  const calc = new Calculator(10);
  console.log(calc.add(5)); // 15
  console.log(calc.get_value()); // 15
  
  // 성능 비교
  console.time('JavaScript Fibonacci');
  jsFibonacci(40);
  console.timeEnd('JavaScript Fibonacci');
  
  console.time('WASM Fibonacci');
  fibonacci(40);
  console.timeEnd('WASM Fibonacci');
}

function jsFibonacci(n) {
  if (n <= 1) return n;
  return jsFibonacci(n - 1) + jsFibonacci(n - 2);
}

run();
```

### 3-4. JavaScript와 상호작용

```rust
// src/lib.rs
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
    
    #[wasm_bindgen(js_namespace = Math)]
    fn random() -> f64;
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    log(&format!("Hello, {}!", name));
}

#[wasm_bindgen]
pub fn get_random_number() -> f64 {
    random()
}

// JavaScript 객체 사용
#[wasm_bindgen]
pub fn process_array(arr: &[i32]) -> Vec<i32> {
    arr.iter().map(|x| x * 2).collect()
}

// JavaScript 콜백
#[wasm_bindgen]
pub fn process_with_callback(data: &[i32], callback: &js_sys::Function) {
    for item in data {
        let result = callback.call1(&JsValue::NULL, &JsValue::from(*item));
        log(&format!("Callback result: {:?}", result));
    }
}
```

```javascript
// main.js
import init, { greet, get_random_number, process_array, process_with_callback } from './wasm-example.js';

async function run() {
  await init();
  
  greet('WebAssembly');
  
  console.log(get_random_number());
  
  const input = [1, 2, 3, 4, 5];
  const output = process_array(input);
  console.log(output); // [2, 4, 6, 8, 10]
  
  process_with_callback([1, 2, 3], (x) => x * x);
}

run();
```

## 4. Go로 WebAssembly 빌드

### 4-1. Go WebAssembly 설정

```go
// main.go
package main

import (
    "syscall/js"
)

func add(this js.Value, args []js.Value) interface{} {
    a := args[0].Int()
    b := args[1].Int()
    return a + b
}

func fibonacci(this js.Value, args []js.Value) interface{} {
    n := args[0].Int()
    if n <= 1 {
        return n
    }
    
    a, b := 0, 1
    for i := 2; i <= n; i++ {
        a, b = b, a+b
    }
    return b
}

func main() {
    js.Global().Set("wasmAdd", js.FuncOf(add))
    js.Global().Set("wasmFibonacci", js.FuncOf(fibonacci))
    
    // Go 프로그램이 종료되지 않도록 대기
    <-make(chan bool)
}
```

```bash
# WASM 빌드
GOOS=js GOARCH=wasm go build -o main.wasm main.go

# wasm_exec.js 복사 (Go 런타임)
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" .
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <script src="wasm_exec.js"></script>
</head>
<body>
    <script>
        const go = new Go();
        WebAssembly.instantiateStreaming(fetch("main.wasm"), go.importObject)
            .then((result) => {
                go.run(result.instance);
                
                // Go 함수 호출
                console.log(wasmAdd(5, 3)); // 8
                console.log(wasmFibonacci(40));
            });
    </script>
</body>
</html>
```

### 4-2. Go에서 DOM 조작

```go
// dom.go
package main

import (
    "syscall/js"
)

func updateDOM(this js.Value, args []js.Value) interface{} {
    document := js.Global().Get("document")
    element := document.Call("getElementById", "output")
    element.Set("innerHTML", "Hello from WebAssembly!")
    return nil
}

func main() {
    js.Global().Set("updateDOM", js.FuncOf(updateDOM))
    <-make(chan bool)
}
```

## 5. AssemblyScript

### 5-1. AssemblyScript 프로젝트 설정

```bash
# AssemblyScript 설치
npm install -g assemblyscript

# 프로젝트 초기화
mkdir as-project && cd as-project
npm init -y
npm install --save-dev assemblyscript
npx asinit .
```

```typescript
// assembly/index.ts
export function add(a: i32, b: i32): i32 {
  return a + b;
}

export function fibonacci(n: i32): i32 {
  if (n <= 1) return n;
  
  let a: i32 = 0;
  let b: i32 = 1;
  
  for (let i: i32 = 2; i <= n; i++) {
    let temp = a + b;
    a = b;
    b = temp;
  }
  
  return b;
}

// 메모리 조작
export function processArray(arr: Int32Array): i32 {
  let sum: i32 = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}
```

```bash
# 빌드
npm run asbuild
```

```javascript
// loader.js
const fs = require("fs");
const loader = require("@assemblyscript/loader");

const imports = { /* imports */ };
const wasmModule = loader.instantiateSync(
  fs.readFileSync(__dirname + "/build/optimized.wasm"),
  imports
);

module.exports = wasmModule.exports;
```

## 6. Node.js에서 WebAssembly 사용

### 6-1. Node.js에서 WASM 로드

```javascript
// node-wasm.js
const fs = require('fs');
const { instantiateSync } = require('@assemblyscript/loader');

// 동기 로드
const wasmModule = instantiateSync(
  fs.readFileSync('./add.wasm')
);

console.log(wasmModule.exports.add(5, 3)); // 8
```

### 6-2. 비동기 로드

```javascript
// async-wasm.js
const fs = require('fs').promises;

async function loadWasm() {
  const wasmBuffer = await fs.readFile('./add.wasm');
  const wasmModule = await WebAssembly.instantiate(wasmBuffer);
  
  const { add } = wasmModule.instance.exports;
  console.log(add(5, 3));
}

loadWasm();
```

### 6-3. Rust로 Node.js 모듈 빌드

```rust
// src/lib.rs
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn process_data(input: &[u8]) -> Vec<u8> {
    // 데이터 처리 로직
    input.iter().map(|b| b.wrapping_add(1)).collect()
}
```

```bash
# Node.js 타겟으로 빌드
wasm-pack build --target nodejs
```

```javascript
// node-main.js
const { process_data } = require('./wasm-example');

const input = new Uint8Array([1, 2, 3, 4, 5]);
const output = process_data(input);
console.log(output); // [2, 3, 4, 5, 6]
```

## 7. 성능 최적화

### 7-1. 메모리 최적화

```rust
// src/lib.rs
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct ImageProcessor {
    width: u32,
    height: u32,
    data: Vec<u8>,
}

#[wasm_bindgen]
impl ImageProcessor {
    #[wasm_bindgen(constructor)]
    pub fn new(width: u32, height: u32) -> ImageProcessor {
        let size = (width * height * 4) as usize;
        ImageProcessor {
            width,
            height,
            data: vec![0; size],
        }
    }
    
    #[wasm_bindgen]
    pub fn get_data_ptr(&self) -> *const u8 {
        self.data.as_ptr()
    }
    
    #[wasm_bindgen]
    pub fn process(&mut self) {
        // 이미지 처리 로직
        for pixel in self.data.chunks_exact_mut(4) {
            // RGBA 처리
            pixel[0] = pixel[0].saturating_add(10); // R
            pixel[1] = pixel[1].saturating_add(10); // G
            pixel[2] = pixel[2].saturating_add(10); // B
            // pixel[3]는 Alpha, 변경하지 않음
        }
    }
}
```

### 7-2. 병렬 처리 (Web Workers)

```javascript
// worker.js
self.onmessage = async function(e) {
  const { wasmModule, data } = e.data;
  
  // WASM 모듈에서 처리
  const result = wasmModule.exports.process(data);
  
  self.postMessage({ result });
};

// main.js
const worker = new Worker('worker.js');

async function processInWorker(data) {
  const wasmModule = await WebAssembly.instantiateStreaming(
    fetch('processor.wasm')
  );
  
  return new Promise((resolve) => {
    worker.onmessage = (e) => {
      resolve(e.data.result);
    };
    
    worker.postMessage({ wasmModule, data });
  });
}
```

## 8. 실전 프로젝트 예제

### 8-1. 이미지 필터 애플리케이션

```rust
// src/lib.rs
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn apply_grayscale(input: &[u8], output: &mut [u8]) {
    for i in 0..input.len() / 4 {
        let r = input[i * 4] as f32;
        let g = input[i * 4 + 1] as f32;
        let b = input[i * 4 + 2] as f32;
        
        let gray = (0.299 * r + 0.587 * g + 0.114 * b) as u8;
        
        output[i * 4] = gray;
        output[i * 4 + 1] = gray;
        output[i * 4 + 2] = gray;
        output[i * 4 + 3] = input[i * 4 + 3];
    }
}

#[wasm_bindgen]
pub fn apply_blur(input: &[u8], output: &mut [u8], width: u32, height: u32, radius: u32) {
    // 블러 필터 구현
    // (간단한 박스 블러 예시)
    for y in 0..height {
        for x in 0..width {
            let mut r_sum = 0u32;
            let mut g_sum = 0u32;
            let mut b_sum = 0u32;
            let mut count = 0u32;
            
            for dy in -(radius as i32)..=(radius as i32) {
                for dx in -(radius as i32)..=(radius as i32) {
                    let nx = (x as i32 + dx).max(0).min(width as i32 - 1) as u32;
                    let ny = (y as i32 + dy).max(0).min(height as i32 - 1) as u32;
                    
                    let idx = (ny * width + nx) as usize * 4;
                    r_sum += input[idx] as u32;
                    g_sum += input[idx + 1] as u32;
                    b_sum += input[idx + 2] as u32;
                    count += 1;
                }
            }
            
            let idx = (y * width + x) as usize * 4;
            output[idx] = (r_sum / count) as u8;
            output[idx + 1] = (g_sum / count) as u8;
            output[idx + 2] = (b_sum / count) as u8;
            output[idx + 3] = input[idx + 3];
        }
    }
}
```

```javascript
// image-processor.js
import init, { apply_grayscale, apply_blur } from './image-processor.js';

async function processImage(imageData) {
  await init();
  
  const input = new Uint8Array(imageData.data);
  const output = new Uint8Array(imageData.data.length);
  
  // 그레이스케일 적용
  apply_grayscale(input, output);
  
  // 또는 블러 적용
  // apply_blur(input, output, imageData.width, imageData.height, 5);
  
  return new ImageData(
    new Uint8ClampedArray(output),
    imageData.width,
    imageData.height
  );
}
```

### 8-2. 암호화 라이브러리

```rust
// src/lib.rs
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn encrypt(data: &[u8], key: &[u8]) -> Vec<u8> {
    let mut result = Vec::with_capacity(data.len());
    
    for (i, &byte) in data.iter().enumerate() {
        let key_byte = key[i % key.len()];
        result.push(byte ^ key_byte);
    }
    
    result
}

#[wasm_bindgen]
pub fn decrypt(data: &[u8], key: &[u8]) -> Vec<u8> {
    encrypt(data, key) // XOR은 암호화와 복호화가 동일
}
```

## 9. 디버깅과 프로파일링

### 9-1. 소스 맵 사용

```bash
# Rust 빌드 시 소스 맵 생성
wasm-pack build --target web -- --features wasm-bindgen/debug
```

### 9-2. 성능 측정

```javascript
// performance.js
async function measurePerformance() {
  const wasmModule = await WebAssembly.instantiateStreaming(
    fetch('compute.wasm')
  );
  
  const { compute } = wasmModule.instance.exports;
  
  // 성능 측정
  performance.mark('wasm-start');
  const result = compute(1000000);
  performance.mark('wasm-end');
  
  performance.measure('wasm-compute', 'wasm-start', 'wasm-end');
  
  const measure = performance.getEntriesByName('wasm-compute')[0];
  console.log(`WASM execution time: ${measure.duration}ms`);
  
  return result;
}
```

## 10. 결론

WebAssembly는 웹과 서버에서 고성능 코드 실행을 가능하게 하는 강력한 기술이다. 이 글에서 다룬 내용:

1. **기본 개념**: WASM 아키텍처, Wat 형식
2. **Rust로 빌드**: wasm-pack, wasm-bindgen
3. **Go로 빌드**: GOROOT, wasm_exec.js
4. **AssemblyScript**: TypeScript 기반 WASM
5. **Node.js 통합**: 서버 사이드 활용
6. **성능 최적화**: 메모리 관리, 병렬 처리
7. **실전 예제**: 이미지 처리, 암호화
8. **디버깅**: 소스 맵, 프로파일링

이러한 기능들을 활용하면 웹 애플리케이션의 성능을 크게 향상시킬 수 있다.

## 참고 자료

- [WebAssembly 공식 사이트](https://webassembly.org/)
- [Rust와 WebAssembly](https://rustwasm.github.io/book/)
- [AssemblyScript 문서](https://www.assemblyscript.org/)
- [MDN WebAssembly 가이드](https://developer.mozilla.org/en-US/docs/WebAssembly)

