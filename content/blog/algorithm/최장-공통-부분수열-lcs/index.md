---
templateKey: blog-post
title: 최장 공통 부분수열 (LCS)
date: 2025-11-01T00:00:00.000Z
category: algorithm
description:
  두 문자열의 공통 부분수열 중 가장 긴 것을 찾는 동적 계획법 문제.
  문자열 유사도 측정과 차이점 분석에 활용된다.
tags:
  - 최장 공통 부분수열
  - LCS
  - Longest Common Subsequence
  - 동적 계획법
  - 알고리즘
  - Algorithm
  - JavaScript
---

![최장 공통 부분수열 (LCS)](/assets/algorithm.png "최장 공통 부분수열 (LCS)")

LCS는 두 문자열에서 공통으로 나타나는 부분수열 중 가장 긴 것을 찾는 동적 계획법 문제다.

## 정의

부분수열은 원래 문자열에서 일부 문자를 순서대로 선택한 것이다. 예를 들어 "ABCD"의 부분수열에는 "A", "AC", "ABCD" 등이 있다. LCS는 두 문자열에서 공통으로 나타나는 부분수열 중 길이가 가장 긴 것을 찾는 문제다. 부분수열은 연속할 필요가 없어서 "ABCD"와 "ACDF"의 LCS는 "ACD"다.

중복되는 부분문제가 명확하다. 두 문자열의 앞부분만 비교해 답을 구하는 것으로 전체 문제를 해결할 수 있다. "ABC"와 "AC"를 비교하는 방법을 안다면 "ABCD"와 "ACE"도 비슷하게 해결할 수 있다. 이 특성 덕분에 메모이제이션 또는 2차원 DP 테이블로 효율적으로 해결할 수 있다.

## 구현

2차원 배열 `dp[i][j]`를 "첫 문자열의 i번째까지와 두 번째 문자열의 j번째까지 비교했을 때의 LCS 길이"로 정의한다. 기저 케이스로 한 쪽 문자열이 비어 있으면 `dp[0][j]=0` 또는 `dp[i][0]=0`이다. 각 위치에서 두 문자가 같으면 `dp[i-1][j-1]+1`로 갱신하고, 다르면 `max(dp[i-1][j], dp[i][j-1])` 중 더 큰 값을 사용한다.

같은 문자를 만났을 때 왼쪽 위 대각선 값에 1을 더하는 이유는 "지금까지 공통 부분수열에 이 문자를 추가"한다는 의미다. 다른 문자의 경우 위와 왼쪽 중 더 큰 값을 택하는데, 이는 "이전에 계산한 더 좋은 결과를 이어받는다"는 의미다. 최종적으로 `dp[n][m]`이 LCS 길이가 되고, LCS 문자열 자체를 원하면 이 DP 배열을 역추적하여 경로를 복원하면 된다.

```javascript
function lcs(s1, s2) {
  const n = s1.length, m = s2.length
  const dp = Array(n + 1).fill(null).map(() => Array(m + 1).fill(0))
  
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }
  
  return dp[n][m]
}

// LCS 문자열까지 복원하는 버전
function lcsWithString(s1, s2) {
  const n = s1.length, m = s2.length
  const dp = Array(n + 1).fill(null).map(() => Array(m + 1).fill(0))
  
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }
  
  // 역추적
  let i = n, j = m
  const result = []
  while (i > 0 && j > 0) {
    if (s1[i - 1] === s2[j - 1]) {
      result.push(s1[i - 1])
      i--
      j--
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--
    } else {
      j--
    }
  }
  
  return {
    length: dp[n][m],
    string: result.reverse().join('')
  }
}

// 예시 실행
const s1 = "ABCD"
const s2 = "ACDF"

console.log(lcs(s1, s2)) // 3
console.log(lcsWithString(s1, s2)) 
// { length: 3, string: 'ACD' }

// 다른 예시
const s3 = "AGGTAB"
const s4 = "GXTXAYB"
console.log(lcsWithString(s3, s4))
// { length: 4, string: 'GTAB' }
```

## 데모

[https://codepen.io/pen/?template=yLgbWPj](https://codepen.io/pen/?template=yLgbWPj)



