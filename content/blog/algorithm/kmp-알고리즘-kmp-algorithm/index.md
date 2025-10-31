---
templateKey: blog-post
title: KMP 알고리즘 (Knuth-Morris-Pratt)
date: 2025-11-01T00:00:00.000Z
category: algorithm
description:
  문자열 검색을 효율적으로 수행하는 알고리즘.
  실패 함수(Failure Function)를 이용해 불필요한 비교를 건너뛰며, 시간복잡도는 O(N+M)이다.
tags:
  - KMP 알고리즘
  - Knuth-Morris-Pratt
  - 문자열 검색
  - 알고리즘
  - Algorithm
  - JavaScript
---

![KMP 알고리즘 (Knuth-Morris-Pratt)](/assets/algorithm.png "KMP 알고리즘 (Knuth-Morris-Pratt)")

KMP는 문자열에서 패턴을 찾을 때, 이전 비교 정보를 활용해 불필요한 재비교를 피하는 알고리즘이다.

## 정의

텍스트에서 패턴을 찾는 문자열 검색 알고리즘이다. 단순 문자열 검색은 불일치 시 시작 위치만 한 칸 이동해 처음부터 다시 비교하지만, KMP는 "이미 비교한 정보를 활용"해 중간까지는 맞다는 것을 알고 있으므로 그 부분만 건너뛰고 비교를 재개한다.

핵심은 실패 함수(Failure Function) 또는 LPS(Longest Proper Prefix which is also Suffix) 배열이다. 각 위치에서 "자기 자신을 제외한 접두사 중 패턴의 접미사와 일치하는 가장 긴 길이"를 미리 계산해 둔다. 예를 들어 "ababa"에서 위치 4(0-based)의 LPS는 3인데, 접두사 "aba"가 접미사 "aba"와 일치하기 때문이다. 불일치 시 LPS 값을 사용해 몇 칸을 건너뛸 수 있는지 결정한다.

## 구현

실패 함수는 패턴 자신을 대상으로 한 문자열 검색이다. 길이 0은 0으로 설정하고, 이후 각 위치에서 이전 LPS 값을 활용해 새 문자와 비교하며 LPS 값을 갱신한다. 일치하면 LPS를 증가시키고, 불일치면 이전 LPS 값을 이용해 다시 비교할 위치를 찾는다.

문자열 검색 단계에서는 텍스트와 패턴을 비교하며, 일치하면 둘 다 다음 문자로 이동한다. 불일치 시 패턴의 LPS 값을 사용해 패턴 포인터만 적절히 이동시키고 텍스트 포인터는 유지한다. 패턴의 전체가 일치하면 매치 위치를 저장하고 패턴 포인터를 LPS 값으로 설정해 계속 검색한다.

```javascript
// 실패 함수(LPS) 구하기
function buildLPS(pattern) {
  const m = pattern.length
  const lps = new Array(m).fill(0)
  let len = 0, i = 1
  
  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++
      lps[i] = len
      i++
    } else {
      if (len !== 0) {
        len = lps[len - 1]
      } else {
        lps[i] = 0
        i++
      }
    }
  }
  
  return lps
}

// KMP 문자열 검색
function kmpSearch(text, pattern) {
  const n = text.length
  const m = pattern.length
  const lps = buildLPS(pattern)
  const result = []
  
  let i = 0, j = 0 // i: text, j: pattern
  
  while (i < n) {
    if (text[i] === pattern[j]) {
      i++
      j++
      
      if (j === m) {
        result.push(i - j) // 매치 위치
        j = lps[j - 1]      // 다음 가능한 위치
      }
    } else {
      if (j !== 0) {
        j = lps[j - 1]
      } else {
        i++
      }
    }
  }
  
  return result
}

// 예시 실행
const text = "ABABABCABABABCABABABC"
const pattern = "ABABAB"

console.log(buildLPS(pattern))            // [0, 0, 1, 2, 3, 4]
console.log(kmpSearch(text, pattern))     // [0, 7, 14]

// 실패 케이스
const text2 = "ABCDEFG"
const pattern2 = "XYZ"
console.log(kmpSearch(text2, pattern2))   // []
```

## 데모

[https://codepen.io/pen/?template=yLgbWPj](https://codepen.io/pen/?template=yLgbWPj)



