---
templateKey: blog-post
title: 그리디 알고리즘 (Greedy Algorithm)
date: 2021-04-04T13:02:48.519Z
category: algorithm
description:
  그리디 알고리즘, 탐욕 알고리즘 이라고도 부른다. 그리드 알고리즘은 최적해를 구하는 데에 사용되는 근사적인 방법으로,
  여러 경우 중 하나를 결정해야 할 때마다 그 순간에 최적이라고 생각 되는것을 선택해 나가는 방식이다.
tags:
  - 그리디 알고리즘
  - Greedy
  - Algorithm
  - 알고리즘
  - JavaScript
---

![그리디 알고리즘 (Greedy Algorithm)](/assets/algorithm.png "그리디 알고리즘 (Greedy Algorithm)")

그리디 알고리즘, 탐욕 알고리즘 이라고도 부른다. 그리드 알고리즘 정의는 아래와 같다.

## 정의

최적해를 구하는 데에 사용되는 근사적인 방법으로, 여러 경우 중 하나를 결정해야 할 때마다 그 순간에 최적이라고 생각 되는것을 선택해 나가는 방식이다.

## 구현

만약 10, 7, 5, 1 로 구성되어 있는 동전들로 14를 교환해준다고 했을 때 그리디 알로리즘을 사용하면 10-1개 1-4개로 구성될 것이다. 왜냐하면 그리디 알고리즘은 해당순간에 가장 최선의 해를 내는 알고리즘이기 때문이다. 하지만 전체적으로 봤을 때 최선의 해라고 볼 수 없다. 왜냐하면 7-2개로 구성하는 것이 가장 최선의 해답이기 때문이다. 아래 코드를 보면 알겠지만 매 순간 최선의 선택을 했다고해서 종합적으로 봤을 때에 최선의 선택이라고는 볼 수 없다.

N 거스름돈을 "10000, 5000, 1000, 500, 100, 50, 10 동전" 들로 줄수 있는 solution 을 그리드 알고리즘을 활용 하여 구현하라.

```javascript
function solution(value) {
  let moneys = [10000, 5000, 1000, 500, 100, 50, 10]
  let won = Math.floor(value / 10) * 10
  let i = 0
  let counts = []

  while (true) {
    if (won >= moneys[i]) {
      let count = Math.floor(won / moneys[i])
      won = won - moneys[i] * count
      counts[i] = count
    } else {
      counts[i] = 0
    }

    i++
    if (won === 0) {
      for (let j = 0; j < moneys.length - i; j++) {
        counts.push(0)
      }
      break
    }
  }

  moneys.map((money, index) => {
    console.log(`${money.toLocaleString()}원 ${counts[index]}개`)
  })
}

solution(51865)

// 10,000원 5개
// 5,000원 0개
// 1,000원 1개
// 500원 1개
// 100원 3개
// 50원 1개
// 10원 1개
```

## 데모

[https://codepen.io/pen/?template=yLgbWPj](https://codepen.io/pen/?template=yLgbWPj)
