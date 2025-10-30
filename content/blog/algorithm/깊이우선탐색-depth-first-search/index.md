---
templateKey: blog-post
title: 깊이 우선 탐색 (Depth-First Search, DFS)
date: 2025-10-30T00:00:00.000Z
category: algorithm
description:
  그래프에서 한 경로를 가능한 깊게 따라간 뒤, 더 갈 곳이 없으면 되돌아오는 탐색 방법.
  재귀 또는 스택을 사용하며, 연결 요소 탐색과 위상 정렬 등에 활용된다.
tags:
  - 깊이 우선 탐색
  - Depth-First Search
  - DFS
  - 알고리즘
  - Algorithm
  - JavaScript
---

![깊이 우선 탐색 (DFS)](/assets/algorithm.png "깊이 우선 탐색 (DFS)")

DFS는 분기 깊이를 우선하여 탐색하는 방식으로, 백트래킹과 조합 탐색에 자주 쓰인다.

## 정의

한 갈래를 선택해 끝까지 내려가 본 뒤, 더 갈 곳이 없으면 한 단계씩 되돌아와 다른 갈래를 탐색하는 방식이다. 미로를 손가락으로 짚고 한 길을 끝까지 따라간 뒤 막히면 되돌아와 다른 길을 시도하는 것과 같다. 이 특성 덕분에 모든 조합이나 경로를 체계적으로 나열·검사해야 하는 백트래킹 문제에 매우 잘 맞는다.

## 구현

재귀 함수를 이용하면 간결하게 구현된다. 현재 정점을 방문으로 표시하고, 인접한 정점들 중 아직 방문하지 않은 곳이 있으면 그쪽으로 재귀 호출을 내려 보낸다. 호출이 끝나면 자동으로 한 단계 위로 되돌아오므로, 자연스럽게 “내려가기→되돌아오기” 흐름을 코드로 표현할 수 있다.

스택으로도 동일한 동작을 흉내 낼 수 있는데, 이때는 스택에 다음 방문 후보를 쌓고 하나씩 꺼내며 방문한다. 인접 순서에 따라 방문 결과가 달라질 수 있으므로, 특정 순서를 보장하려면 인접 리스트를 정렬하거나 정해진 순서대로 순회하는 규칙을 두는 것이 좋다.

```javascript
function dfsOrder(graph, start) {
  const n = graph.length
  const visited = new Array(n).fill(false)
  const order = []

  function dfs(u) {
    visited[u] = true
    order.push(u)
    for (const v of graph[u]) {
      if (!visited[v]) dfs(v)
    }
  }

  dfs(start)
  return order
}

// 예시: 0-1-2, 1-3 구조 (인접 순서에 따라 결과가 달라질 수 있음)
const graph = [
  [1],       // 0
  [0, 2, 3], // 1
  [1],       // 2
  [1],       // 3
]

console.log(dfsOrder(graph, 0)) // [0,1,2,3] 또는 [0,1,3,2]
```

## 데모

[https://codepen.io/pen/?template=yLgbWPj](https://codepen.io/pen/?template=yLgbWPj)


