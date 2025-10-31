---
templateKey: blog-post
title: 벨만-포드 알고리즘 (Bellman-Ford)
date: 2025-11-01T00:00:00.000Z
category: algorithm
description:
  음수 가중치가 있는 그래프에서 최단 경로를 구할 수 있는 알고리즘.
  음수 사이클 감지도 가능하며, 시간복잡도는 O(VE)이다.
tags:
  - 벨만-포드
  - Bellman-Ford
  - 최단 경로
  - 알고리즘
  - Algorithm
  - JavaScript
---

![벨만-포드 알고리즘 (Bellman-Ford)](/assets/algorithm.png "벨만-포드 알고리즘 (Bellman-Ford)")

벨만-포드는 음수 가중치가 있는 그래프에서도 작동하는 최단 경로 알고리즘으로, 음수 사이클도 감지할 수 있다.

## 정의

다익스트라와 달리 음수 가중치를 허용하는 최단 경로 알고리즘이다. 핵심 아이디어는 "최단 경로는 최대 V-1개의 간선을 사용한다"는 점이다. 시작점에서 어떤 정점까지 가려면 최대 V-1개의 간선만 사용하면 되기 때문이다. 따라서 간선의 수 E만큼 반복해 모든 정점의 거리를 갱신하는 과정을 V-1번 반복하면 최단 거리가 확정된다.

V-1번 반복 후에도 거리가 갱신되면 음수 사이클이 존재한다고 판단할 수 있다. 음수 사이클이 있으면 그 사이클을 계속 돌며 거리를 무한정 줄일 수 있기 때문이다. 다익스트라는 이런 경우 작동하지 않지만, 벨만-포드는 음수 가중치가 있어도 안정적으로 최단 거리를 구할 수 있다.

## 구현

거리 배열을 초기화하고 시작점의 거리를 0으로 설정한다. 이후 V-1번 반복하며 모든 간선을 확인해 더 짧은 경로를 찾으면 거리를 갱신한다. 각 반복에서 "한 정점을 거쳐 가는 더 짧은 경로"를 발견하면 갱신하는데, V-1번 반복하면 최악의 경우에도 모든 정점까지의 최단 거리가 계산된다.

음수 사이클 감지를 위해 V-1번 이후에 한 번 더 모든 간선을 확인해 거리가 줄어드는지 체크한다. 값이 줄어들면 음수 사이클이 존재하므로 null이나 특수 값을 반환한다. 구현 시 그래프가 방향 그래프인지 무방향인지, 그리고 자기 자신으로 가는 간선이 있는지도 고려해야 한다.

```javascript
function bellmanFord(graph, start) {
  const n = graph.length
  const INF = 1e18
  const dist = new Array(n).fill(INF)
  dist[start] = 0
  
  // V-1번 반복
  for (let i = 0; i < n - 1; i++) {
    for (let u = 0; u < n; u++) {
      if (dist[u] === INF) continue
      for (const { to, w } of graph[u]) {
        if (dist[u] + w < dist[to]) {
          dist[to] = dist[u] + w
        }
      }
    }
  }
  
  // 음수 사이클 감지
  for (let u = 0; u < n; u++) {
    if (dist[u] === INF) continue
    for (const { to, w } of graph[u]) {
      if (dist[u] + w < dist[to]) {
        return null // 음수 사이클 존재
      }
    }
  }
  
  return dist
}

// 예시 그래프
const graph = [
  [{ to: 1, w: 4 }, { to: 2, w: 5 }], // 0
  [{ to: 2, w: -3 }],                  // 1
  [{ to: 3, w: 2 }],                   // 2
  []                                    // 3
]

console.log(bellmanFord(graph, 0)) // [0, 4, 1, 3]

// 음수 사이클이 있는 경우
const graphWithCycle = [
  [{ to: 1, w: 1 }], // 0
  [{ to: 2, w: 2 }], // 1
  [{ to: 0, w: -5 }] // 2 (음수 사이클: 0→1→2→0)
]

console.log(bellmanFord(graphWithCycle, 0)) // null (음수 사이클)
```

## 데모

[https://codepen.io/pen/?template=yLgbWPj](https://codepen.io/pen/?template=yLgbWPj)



