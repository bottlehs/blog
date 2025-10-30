---
templateKey: blog-post
title: 다익스트라 알고리즘 (Dijkstra)
date: 2025-10-30T00:00:00.000Z
category: algorithm
description:
  가중치가 모두 비음수인 그래프에서 한 시작 정점으로부터의 최단 경로를 구하는 알고리즘.
  우선순위 큐(최소 힙)를 사용하면 효율적이다.
tags:
  - 다익스트라
  - Dijkstra
  - 최단 경로
  - 알고리즘
  - Algorithm
  - JavaScript
---

![다익스트라 (Dijkstra)](/assets/algorithm.png "다익스트라 (Dijkstra)")

다익스트라는 비음수 가중치 그래프에서 시작 정점으로부터 각 정점까지의 최단 거리를 구한다.

## 정의

가중치가 모두 0 이상인 그래프에서 한 시작점으로부터 모든 정점까지의 최단 거리를 구하는 알고리즘이다. 아이디어는 “일단 가장 가까운 곳부터 확정”하는 데 있다. 이미 알고 있는 범위에서 가장 짧은 거리로 도달가능한 정점을 먼저 고르고, 그 정점을 거쳐 가는 경로로 이웃들의 거리를 더 줄일 수 있다면 갱신한다.

## 구현

우선순위 큐(최소 힙)에 `[거리, 정점]` 형태로 넣어 “현재 가장 가까운 후보”를 빠르게 꺼낸다. 시작점의 거리를 0으로 두고 큐에 넣은 뒤, 큐에서 하나 꺼낼 때마다 그 정점이 지금까지 알고 있는 거리와 일치하는지(느려진 후보는 무시) 확인한다. 일치하면 그 이웃들을 보며 `더 짧은 거리 = 현재 거리 + 간선 가중치`를 발견할 때 갱신하고, 갱신된 이웃을 큐에 다시 넣는다.

이 과정을 큐가 빌 때까지 반복하면 모든 정점의 최단 거리가 확정된다. 음수 가중치가 있으면 “먼저 확정” 원리가 깨지므로 벨만-포드 같은 다른 알고리즘을 써야 한다는 점도 함께 기억해 두면 좋다.

```javascript
class MinHeap {
  constructor() { this.arr = [] }
  push(x) {
    this.arr.push(x)
    this._up(this.arr.length - 1)
  }
  pop() {
    if (this.arr.length === 0) return null
    const top = this.arr[0]
    const last = this.arr.pop()
    if (this.arr.length) { this.arr[0] = last; this._down(0) }
    return top
  }
  _up(i) {
    while (i) {
      const p = (i - 1) >> 1
      if (this.arr[p][0] <= this.arr[i][0]) break
      ;[this.arr[p], this.arr[i]] = [this.arr[i], this.arr[p]]
      i = p
    }
  }
  _down(i) {
    const n = this.arr.length
    while (true) {
      let l = i * 2 + 1, r = i * 2 + 2, m = i
      if (l < n && this.arr[l][0] < this.arr[m][0]) m = l
      if (r < n && this.arr[r][0] < this.arr[m][0]) m = r
      if (m === i) break
      ;[this.arr[m], this.arr[i]] = [this.arr[i], this.arr[m]]
      i = m
    }
  }
}

function dijkstra(graph, start) {
  const n = graph.length
  const INF = 1e18
  const dist = new Array(n).fill(INF)
  const heap = new MinHeap()
  dist[start] = 0
  heap.push([0, start]) // [distance, node]

  while (true) {
    const node = heap.pop()
    if (!node) break
    const [d, u] = node
    if (d !== dist[u]) continue
    for (const { to, w } of graph[u]) {
      if (dist[to] > dist[u] + w) {
        dist[to] = dist[u] + w
        heap.push([dist[to], to])
      }
    }
  }
  return dist
}

// 예시 그래프
const graph = [
  [{ to: 1, w: 2 }, { to: 2, w: 5 }], // 0
  [{ to: 2, w: 1 }, { to: 3, w: 3 }], // 1
  [{ to: 3, w: 1 }],                   // 2
  []                                   // 3
]

console.log(dijkstra(graph, 0)) // [0,2,3,4]
```

## 데모

[https://codepen.io/pen/?template=yLgbWPj](https://codepen.io/pen/?template=yLgbWPj)


