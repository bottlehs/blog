---
templateKey: blog-post
title: 최소 동전 수 (Coin Change, DP)
date: 2025-10-30T00:00:00.000Z
category: algorithm
description:
  동적 계획법(DP)을 사용하여 특정 금액을 만들기 위한 최소 동전 개수를 구한다.
  그리디가 항상 최적을 보장하지 않는 경우에도 최적해를 보장하는 방법이다.
tags:
  - 동적 계획법
  - Dynamic Programming
  - Coin Change
  - 알고리즘
  - Algorithm
  - JavaScript
---

![최소 동전 수 (Coin Change, DP)](/assets/algorithm.png "최소 동전 수 (Coin Change, DP)")

그리디로는 항상 최적을 보장하지 못하는 거스름돈 문제를, 동적 계획법으로 최적해로 해결한다.

## 정의

여러 종류의 동전으로 딱 맞게 금액 N을 만들 때 필요한 동전 개수의 최소값을 구하는 문제다. 핵심은 “동전의 조합”을 고려한다는 점인데, 같은 금액이라도 어떤 동전을 어떻게 조합하느냐에 따라 필요한 개수가 달라질 수 있다. 예를 들어 정규 화폐 체계(10,000/5,000/1,000/500/100/50/10)에서는 보통 큰 단위부터 쓰는 그리디가 잘 통하지만, 10·7·5·1처럼 구성된 세트에서는 14를 만들 때 10+1+1+1+1(5개)보다 7+7(2개)이 더 낫다.

동적 계획법(DP)은 이런 경우에 최적해를 보장한다. 작은 금액부터 차례로 “해답을 저장”해 가면서, 더 큰 금액의 답을 이전 결과를 이용해 빠르게 계산할 수 있게 한다. 만들 수 있는 경우에는 최소 동전 개수를, 어떤 조합으로도 만들 수 없는 금액이라면 -1을 반환해 “불가능”을 명확히 표현한다.

## 구현

DP 배열 `dp[x]`를 “금액 x를 만드는 최소 동전 개수”로 정의하고, 기저값으로 `dp[0]=0`을 둔다. 이후 1부터 N까지 올라가며 모든 동전에 대해 `x-coin`이 유효하면 `dp[x] = min(dp[x], dp[x-coin] + 1)`로 갱신한다. 이렇게 하면 동전 하나를 추가해 x를 만드는 가장 좋은 방법을, 이미 구해 둔 작은 금액의 해답을 기반으로 빠르게 결정할 수 있다.

초깃값은 큰 수(INF)로 채워 “아직 방법을 모름”을 표현하고, 마지막에 `dp[N]`이 여전히 INF라면 만들 수 없는 금액이므로 -1을 반환한다. 구현 시 입력 유효성(음수나 정수가 아닌 값), 동전 배열이 비었을 때의 처리, 그리고 동전 순서에 의존하지 않도록 모든 동전을 균등히 순회하는 방식을 지키면 견고한 풀이가 된다.

```javascript
function minCoins(amount, coins) {
  if (!Number.isInteger(amount) || amount < 0) return -1
  const INF = amount + 1
  const dp = new Array(amount + 1).fill(INF)
  dp[0] = 0

  for (let x = 1; x <= amount; x++) {
    for (const coin of coins) {
      if (x - coin >= 0) {
        dp[x] = Math.min(dp[x], dp[x - coin] + 1)
      }
    }
  }

  return dp[amount] === INF ? -1 : dp[amount]
}

// 예시 실행
console.log(minCoins(14, [10, 7, 5, 1])) // 2 (7+7)
console.log(minCoins(51860, [10000, 5000, 1000, 500, 100, 50, 10]))
```

## 데모

[https://codepen.io/pen/?template=yLgbWPj](https://codepen.io/pen/?template=yLgbWPj)


