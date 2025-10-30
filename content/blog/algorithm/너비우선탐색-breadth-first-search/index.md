---
templateKey: blog-post
title: 너비 우선 탐색 (Breadth-First Search, BFS)
date: 2025-10-30T00:00:00.000Z
category: algorithm
description:
  그래프에서 시작 정점으로부터 가까운 정점부터 차례대로 탐색하는 알고리즘.
  최단 간선 수 경로 탐색에 유용하며 큐(Queue)를 사용한다.
tags:
  - 너비 우선 탐색
  - Breadth-First Search
  - BFS
  - 알고리즘
  - Algorithm
  - JavaScript
---

![너비 우선 탐색 (BFS)](/assets/algorithm.png "너비 우선 탐색 (BFS)")

BFS는 레벨 단위로 정점을 방문하여, 무가중치 그래프에서 최단 간선 수 경로를 구할 때 유리하다.

## 정의

시작점에서 가까운 곳부터 차례대로 둘러보는 탐색이다. 물이 동심원처럼 번지듯이, 한 단계(레벨) 떨어진 정점들을 모두 본 뒤 그 다음 단계로 넘어간다. 간선 가중치가 모두 같거나 없을 때는 이 특성 덕분에 “가장 먼저 도달한 경로가 곧 최단(간선 수 최소) 경로”가 된다는 점이 큰 장점이다.

## 구현

큐(Queue)를 사용해 시작점을 넣고, 앞에서 하나씩 꺼내며 인접한 정점을 방문한다. 아직 방문하지 않은 정점에 대해서는 “현재 거리 + 1”로 거리를 기록하고 큐 뒤에 추가한다. 이 과정을 반복하면 같은 레벨의 정점들이 먼저 처리되고, 자연스럽게 각 정점까지의 최단(간선 수) 거리가 계산된다.

이미 방문한 정점을 다시 큐에 넣지 않도록 `visited` 또는 `dist!=-1` 검사를 꼭 수행한다. 또한 인접 리스트의 순서에 따라 탐색 순서가 달라질 수 있으므로, 재현 가능한 결과가 필요하면 인접 목록을 정렬하거나 일관된 순서를 유지하도록 한다.

```javascript
function bfsShortestEdges(graph, start) {
  const n = graph.length
  const dist = new Array(n).fill(-1)
  const q = []

  dist[start] = 0
  q.push(start)

  while (q.length) {
    const cur = q.shift()
    for (const next of graph[cur]) {
      if (dist[next] !== -1) continue
      dist[next] = dist[cur] + 1
      q.push(next)
    }
  }

  return dist
}

// 예시: 0-1-2, 1-3 구조
const graph = [
  [1],     // 0
  [0, 2, 3], // 1
  [1],     // 2
  [1],     // 3
]

console.log(bfsShortestEdges(graph, 0)) // [0,1,2,2]
```

## 데모

[https://codepen.io/pen/?template=yLgbWPj](https://codepen.io/pen/?template=yLgbWPj)


