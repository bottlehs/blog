---
templateKey: blog-post
title: 병합 정렬 (Merge Sort)
date: 2025-11-01T00:00:00.000Z
category: algorithm
description:
  분할 정복(Divide and Conquer) 기법을 사용하는 안정 정렬 알고리즘.
  시간복잡도는 O(N log N)이며, 추가 공간이 필요하다.
tags:
  - 병합 정렬
  - Merge Sort
  - 정렬
  - 알고리즘
  - Algorithm
  - JavaScript
---

![병합 정렬 (Merge Sort)](/assets/algorithm.png "병합 정렬 (Merge Sort)")

병합 정렬은 배열을 반으로 나누고 재귀적으로 정렬한 뒤 합치는 분할 정복 방식의 정렬 알고리즘이다.

## 정의

배열을 크기가 1이 될 때까지 반으로 계속 나누고, 잘게 나눈 배열들을 다시 순서대로 합치며 정렬하는 방식이다. 분할(Divide)과 정복(Conquer), 그리고 결합(Combine) 단계로 나뉜다. 이 과정에서 왼쪽과 오른쪽 부분 배열을 병합할 때, 각각의 크기가 1이므로 비교와 병합이 명확하게 이루어진다.

핵심 아이디어는 "이미 정렬된 두 배열을 합치는 것은 O(N) 시간에 가능하다"는 것이다. 따라서 크기 N인 배열을 절반으로 나누는 과정을 log N번 반복하고, 각 단계에서 O(N) 시간을 쓰므로 전체 시간복잡도는 O(N log N)이 된다. 추가로 임시 배열이 필요하므로 공간복잡도는 O(N)이다.

## 구현

기저 사례로 배열의 크기가 1 이하면 그대로 반환하고, 그 외에는 중간 인덱스 `mid`를 기준으로 왼쪽과 오른쪽으로 나눈 뒤 재귀 호출을 한다. 반환된 두 배열을 병합 함수로 합쳐 최종적으로 정렬된 배열을 만든다.

병합 함수에서는 두 배열의 앞 부분을 가리키는 포인터를 두고, 더 작은 값을 결과 배열에 추가한 뒤 해당 포인터를 전진시킨다. 한쪽 배열이 끝나면 남은 값들을 모두 추가한다. 이 과정에서 두 값이 같을 때는 왼쪽 값을 먼저 넣으면 "안정 정렬"을 보장할 수 있다.

```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr
  
  const mid = Math.floor(arr.length / 2)
  const left = mergeSort(arr.slice(0, mid))
  const right = mergeSort(arr.slice(mid))
  
  return merge(left, right)
}

function merge(left, right) {
  const result = []
  let i = 0, j = 0
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++])
    } else {
      result.push(right[j++])
    }
  }
  
  return result.concat(left.slice(i), right.slice(j))
}

// 예시 실행
const arr = [38, 27, 43, 3, 9, 82, 10]
console.log(mergeSort(arr)) // [3, 9, 10, 27, 38, 43, 82]

const arr2 = [5, 2, 8, 5, 1, 3]
console.log(mergeSort(arr2)) // [1, 2, 3, 5, 5, 8]
```

## 데모

[https://codepen.io/pen/?template=yLgbWPj](https://codepen.io/pen/?template=yLgbWPj)



