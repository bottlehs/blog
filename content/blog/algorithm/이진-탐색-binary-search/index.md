---
templateKey: blog-post
title: 이진 탐색 (Binary Search)
date: 2025-10-30T00:00:00.000Z
category: algorithm
description:
  정렬된 배열에서 중간값을 기준으로 탐색 범위를 절반으로 줄여가며 값을 찾는 알고리즘.
  시간복잡도는 O(log N)이다.
tags:
  - 이진 탐색
  - Binary Search
  - 알고리즘
  - Algorithm
  - JavaScript
---

![이진 탐색 (Binary Search)](/assets/algorithm.png "이진 탐색 (Binary Search)")

이진 탐색은 정렬이 전제되어야 하며, 중간값과의 비교를 반복하여 빠르게 목표를 찾는다.

## 정의

정렬된 배열에서 중간값을 기준으로, 찾는 값이 왼쪽에 있을지 오른쪽에 있을지를 판단해 탐색 구간을 절반으로 줄여 나간다. 한 번 비교할 때마다 가능한 후보의 수가 반으로 준다는 점이 핵심이다. 이 덕분에 선형 탐색보다 훨씬 빠른 O(log N) 시간 안에 값을 찾거나, 없다는 사실을 확실히 알 수 있다.

## 구현

두 포인터 `lo`와 `hi`로 현재 탐색 구간의 양 끝을 가리키고, 중간 인덱스 `mid=(lo+hi)>>1`에서 값을 확인한다. 목표가 더 크면 왼쪽 절반을 버리고 `lo=mid+1`, 더 작으면 오른쪽 절반을 버리고 `hi=mid-1`로 좁힌다. 값이 일치하면 인덱스를, 구간이 엇갈리면 존재하지 않으므로 -1을 반환한다.

부동소수점 오차를 피하기 위해 중간 계산은 정수 덧셈·시프트로 처리하고, 중복 값이 있는 배열에서 “첫/마지막 인덱스”를 찾고 싶다면 등호(=)의 위치를 조정해 하한/상한 탐색(lower/upper bound) 형태로 바꾸면 된다.

```javascript
function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (arr[mid] === target) return mid
    if (arr[mid] < target) lo = mid + 1
    else hi = mid - 1
  }
  return -1
}

// 예시 실행
const a = [1, 3, 4, 7, 9, 12]
console.log(binarySearch(a, 7))  // 3
console.log(binarySearch(a, 8))  // -1
```

## 데모

[https://codepen.io/pen/?template=yLgbWPj](https://codepen.io/pen/?template=yLgbWPj)


