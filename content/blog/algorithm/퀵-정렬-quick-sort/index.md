---
templateKey: blog-post
title: 퀵 정렬 (Quick Sort)
date: 2025-11-06T08:43:00.000Z
category: algorithm
description:
  퀵 정렬은 분할 정복 알고리즘으로 평균적으로 매우 빠른 정렬 알고리즘이다.
  피벗을 선택해 기준으로 삼고, 작은 값과 큰 값을 분할해 재귀적으로 정렬한다.
tags:
  - 퀵 정렬
  - Quick Sort
  - 정렬
  - 알고리즘
  - Algorithm
  - JavaScript
---

![퀵 정렬 (Quick Sort)](/assets/algorithm.png "퀵 정렬 (Quick Sort)")

퀵 정렬은 분할 정복 방식으로 평균적으로 O(n log n) 시간에 정렬하는 효율적인 알고리즘이다. 피벗을 선택해 기준으로 삼고, 작은 값과 큰 값으로 분할한 뒤 재귀적으로 정렬한다.

## 정의

퀵 정렬은 배열에서 피벗(pivot)을 하나 선택하고, 피벗보다 작은 값은 왼쪽에, 큰 값은 오른쪽에 배치한 뒤 양쪽을 재귀적으로 정렬하는 분할 정복 알고리즘이다. 이름처럼 평균적으로 매우 빠른 정렬 속도를 보인다.

## 아이디어

1. **피벗 선택**: 배열에서 하나의 원소를 피벗으로 선택한다.
2. **분할**: 피벗을 기준으로 작은 값은 왼쪽, 큰 값은 오른쪽으로 분할한다.
3. **재귀**: 왼쪽과 오른쪽 부분 배열을 각각 재귀적으로 정렬한다.
4. **합치기**: 이미 제자리에 있으므로 합치는 과정이 필요 없다.

피벗이 매번 배열을 반으로 나눈다면, 깊이는 log n이 되고 각 레벨에서 n번 비교하므로 평균 시간 복잡도는 O(n log n)이다.

## 구현

### 기본 구현

```javascript
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left >= right) return arr;

  // 분할하고 피벗의 최종 위치 반환
  const pivotIndex = partition(arr, left, right);

  // 왼쪽과 오른쪽 재귀적으로 정렬
  quickSort(arr, left, pivotIndex - 1);
  quickSort(arr, pivotIndex + 1, right);

  return arr;
}

function partition(arr, left, right) {
  // 피벗을 마지막 원소로 선택
  const pivot = arr[right];
  let i = left - 1; // 작은 원소들의 마지막 인덱스

  for (let j = left; j < right; j++) {
    // 현재 원소가 피벗보다 작거나 같으면
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // 피벗을 올바른 위치로 이동
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
}

// 예시
const arr = [64, 34, 25, 12, 22, 11, 90];
console.log(quickSort([...arr])); // [11, 12, 22, 25, 34, 64, 90]
```

### 개선된 구현 (피벗 선택 최적화)

피벗을 항상 마지막 원소로 선택하면 이미 정렬된 배열에서 최악의 경우 O(n²)이 된다. 중앙값을 선택하거나 랜덤하게 선택하면 개선된다.

```javascript
function quickSortOptimized(arr, left = 0, right = arr.length - 1) {
  if (left >= right) return arr;

  // 중앙값을 피벗으로 선택
  const mid = Math.floor((left + right) / 2);
  const pivot = medianOfThree(arr, left, mid, right);
  const pivotIndex = partitionMedian(arr, left, right, pivot);

  quickSortOptimized(arr, left, pivotIndex - 1);
  quickSortOptimized(arr, pivotIndex + 1, right);

  return arr;
}

function medianOfThree(arr, left, mid, right) {
  if (arr[left] > arr[mid]) [arr[left], arr[mid]] = [arr[mid], arr[left]];
  if (arr[left] > arr[right]) [arr[left], arr[right]] = [arr[right], arr[left]];
  if (arr[mid] > arr[right]) [arr[mid], arr[right]] = [arr[right], arr[mid]];
  return arr[mid];
}

function partitionMedian(arr, left, right, pivot) {
  // 피벗을 마지막으로 이동
  const pivotIndex = arr.indexOf(pivot, left);
  [arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]];

  let i = left - 1;
  for (let j = left; j < right; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
}
```

### 비재귀 구현 (스택 사용)

```javascript
function quickSortIterative(arr) {
  const stack = [];
  stack.push({ left: 0, right: arr.length - 1 });

  while (stack.length > 0) {
    const { left, right } = stack.pop();

    if (left >= right) continue;

    const pivotIndex = partition(arr, left, right);

    // 왼쪽과 오른쪽 부분을 스택에 추가
    stack.push({ left, right: pivotIndex - 1 });
    stack.push({ left: pivotIndex + 1, right });
  }

  return arr;
}
```

## 동작 예시

배열 `[64, 34, 25, 12, 22, 11, 90]`을 정렬하는 과정:

**1단계: 전체 배열 분할**
- 피벗: 90 (마지막 원소)
- 분할: [64, 34, 25, 12, 22, 11] | [90]
- 결과: [64, 34, 25, 12, 22, 11, 90]

**2단계: 왼쪽 부분 [64, 34, 25, 12, 22, 11] 정렬**
- 피벗: 11
- 분할: [] | [11] | [64, 34, 25, 12, 22]
- 결과: [11, 64, 34, 25, 12, 22]

**3단계: 오른쪽 부분 [64, 34, 25, 12, 22] 정렬**
- 피벗: 22
- 분할: [12] | [22] | [64, 34, 25]
- 결과: [12, 22, 64, 34, 25]

**최종 결과**: [11, 12, 22, 25, 34, 64, 90]

## 시간 복잡도

- **평균**: O(n log n)
- **최선**: O(n log n) - 피벗이 항상 중앙값일 때
- **최악**: O(n²) - 피벗이 항상 최솟값 또는 최댓값일 때 (이미 정렬된 배열)

## 공간 복잡도

- **평균**: O(log n) - 재귀 호출 스택
- **최악**: O(n) - 불균형한 분할

## 장단점

### 장점
- 평균적으로 매우 빠름 (O(n log n))
- 제자리 정렬 (in-place)로 추가 메모리 적음
- 구현이 비교적 간단함
- 실무에서 널리 사용됨

### 단점
- 최악의 경우 O(n²) 시간
- 불안정 정렬 (stable sort 아님)
- 재귀 호출로 인한 스택 오버플로우 가능

## 다른 정렬 알고리즘과 비교

| 알고리즘 | 평균 시간 | 최악 시간 | 안정성 | 제자리 |
|----------|-----------|-----------|--------|--------|
| 퀵 정렬 | O(n log n) | O(n²) | ❌ | ✅ |
| 병합 정렬 | O(n log n) | O(n log n) | ✅ | ❌ |
| 힙 정렬 | O(n log n) | O(n log n) | ❌ | ✅ |
| 삽입 정렬 | O(n²) | O(n²) | ✅ | ✅ |

## 실무 활용

퀵 정렬은 다음과 같은 경우에 유용하다:

1. **일반적인 정렬**: 대부분의 경우 빠른 성능
2. **메모리 제약**: 제자리 정렬로 추가 메모리 적음
3. **대용량 데이터**: 평균적으로 효율적

**주의사항**
- 이미 정렬된 데이터는 최악의 경우가 될 수 있음
- 안정성이 필요한 경우 병합 정렬 사용
- 최악의 경우를 피하려면 피벗 선택 최적화 필요

## 데모

[https://codepen.io/pen/?template=yLgbWPj](https://codepen.io/pen/?template=yLgbWPj)

