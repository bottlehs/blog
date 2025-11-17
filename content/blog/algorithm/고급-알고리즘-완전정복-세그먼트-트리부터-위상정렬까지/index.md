---
templateKey: blog-post
title: 고급 알고리즘 완전정복 - 세그먼트 트리부터 위상정렬까지
date: 2025-11-15T00:00:00.000Z
category: algorithm
description:
  코딩 테스트와 실무에서 자주 사용되는 고급 알고리즘을 완벽 정리. 세그먼트 트리, 펜윅 트리, 유니온 파인드, 최소 공통 조상(LCA), 강한 연결 요소(SCC), 위상 정렬, 최소 신장 트리(MST), 최대 유량 등 실전 문제 해결에 필요한 모든 알고리즘을 JavaScript로 구현합니다.
tags:
  - 알고리즘
  - Algorithm
  - 세그먼트 트리
  - Segment Tree
  - 유니온 파인드
  - Union-Find
  - 위상 정렬
  - Topological Sort
  - 최소 신장 트리
  - MST
  - 최대 유량
  - Max Flow
  - 코딩 테스트
  - JavaScript
---

# 고급 알고리즘 완전정복 - 세그먼트 트리부터 위상정렬까지

기본적인 정렬과 탐색 알고리즘을 넘어서, 코딩 테스트와 실무에서 자주 사용되는 고급 알고리즘들을 다룬다. 각 알고리즘의 원리, 구현 방법, 시간 복잡도, 활용 사례를 실전 예제와 함께 설명한다.

## 1. 세그먼트 트리 (Segment Tree)

### 1-1. 개념과 활용

세그먼트 트리는 구간 쿼리와 업데이트를 O(log N) 시간에 처리할 수 있는 자료구조다.

**활용 사례:**
- 구간 합, 최솟값, 최댓값 쿼리
- 구간 업데이트
- 구간에 특정 값 더하기

### 1-2. 기본 구현 (구간 합)

```javascript
class SegmentTree {
  constructor(arr) {
    this.n = arr.length;
    this.size = 1;
    while (this.size < this.n) this.size *= 2;
    this.tree = new Array(this.size * 2).fill(0);
    
    // 리프 노드에 초기값 저장
    for (let i = 0; i < this.n; i++) {
      this.tree[this.size + i] = arr[i];
    }
    
    // 내부 노드 계산
    for (let i = this.size - 1; i > 0; i--) {
      this.tree[i] = this.tree[i * 2] + this.tree[i * 2 + 1];
    }
  }
  
  // 구간 [l, r)의 합 구하기
  query(l, r) {
    l += this.size;
    r += this.size;
    let sum = 0;
    
    while (l < r) {
      if (l % 2 === 1) {
        sum += this.tree[l];
        l++;
      }
      if (r % 2 === 1) {
        r--;
        sum += this.tree[r];
      }
      l = Math.floor(l / 2);
      r = Math.floor(r / 2);
    }
    
    return sum;
  }
  
  // 인덱스 pos의 값을 val로 업데이트
  update(pos, val) {
    pos += this.size;
    this.tree[pos] = val;
    
    while (pos > 1) {
      pos = Math.floor(pos / 2);
      this.tree[pos] = this.tree[pos * 2] + this.tree[pos * 2 + 1];
    }
  }
  
  // 구간 [l, r)에 val 더하기 (Lazy Propagation)
  rangeUpdate(l, r, val) {
    this._lazyUpdate(l, r, val, 0, this.size, 1);
  }
  
  _lazyUpdate(l, r, val, segL, segR, node) {
    // Lazy Propagation 구현
    // 실제 구현은 복잡하므로 생략
  }
}

// 사용 예시
const arr = [1, 3, 5, 7, 9, 11];
const segTree = new SegmentTree(arr);

console.log(segTree.query(1, 4)); // 3 + 5 + 7 = 15
segTree.update(2, 10);
console.log(segTree.query(1, 4)); // 3 + 10 + 7 = 20
```

### 1-3. 구간 최솟값 쿼리

```javascript
class MinSegmentTree {
  constructor(arr) {
    this.n = arr.length;
    this.size = 1;
    while (this.size < this.n) this.size *= 2;
    this.tree = new Array(this.size * 2).fill(Infinity);
    
    for (let i = 0; i < this.n; i++) {
      this.tree[this.size + i] = arr[i];
    }
    
    for (let i = this.size - 1; i > 0; i--) {
      this.tree[i] = Math.min(this.tree[i * 2], this.tree[i * 2 + 1]);
    }
  }
  
  query(l, r) {
    l += this.size;
    r += this.size;
    let minVal = Infinity;
    
    while (l < r) {
      if (l % 2 === 1) {
        minVal = Math.min(minVal, this.tree[l]);
        l++;
      }
      if (r % 2 === 1) {
        r--;
        minVal = Math.min(minVal, this.tree[r]);
      }
      l = Math.floor(l / 2);
      r = Math.floor(r / 2);
    }
    
    return minVal;
  }
  
  update(pos, val) {
    pos += this.size;
    this.tree[pos] = val;
    
    while (pos > 1) {
      pos = Math.floor(pos / 2);
      this.tree[pos] = Math.min(this.tree[pos * 2], this.tree[pos * 2 + 1]);
    }
  }
}
```

## 2. 펜윅 트리 (Fenwick Tree / Binary Indexed Tree)

### 2-1. 개념

펜윅 트리는 세그먼트 트리보다 메모리를 적게 사용하며, 구현이 간단하다. 주로 구간 합 쿼리에 사용된다.

### 2-2. 구현

```javascript
class FenwickTree {
  constructor(size) {
    this.n = size;
    this.tree = new Array(this.n + 1).fill(0);
  }
  
  // 인덱스 i에 val 더하기
  update(i, val) {
    i++;
    while (i <= this.n) {
      this.tree[i] += val;
      i += i & -i; // 마지막 비트 더하기
    }
  }
  
  // [0, i] 구간의 합
  query(i) {
    i++;
    let sum = 0;
    while (i > 0) {
      sum += this.tree[i];
      i -= i & -i; // 마지막 비트 제거
    }
    return sum;
  }
  
  // [l, r] 구간의 합
  rangeQuery(l, r) {
    return this.query(r) - this.query(l - 1);
  }
}

// 사용 예시
const arr = [1, 3, 5, 7, 9, 11];
const fenwick = new FenwickTree(arr.length);

// 초기화
for (let i = 0; i < arr.length; i++) {
  fenwick.update(i, arr[i]);
}

console.log(fenwick.rangeQuery(1, 3)); // 3 + 5 + 7 = 15
fenwick.update(2, 5); // 인덱스 2에 5 더하기
console.log(fenwick.rangeQuery(1, 3)); // 3 + 10 + 7 = 20
```

## 3. 유니온 파인드 (Union-Find / Disjoint Set)

### 3-1. 개념

유니온 파인드는 두 원소가 같은 집합에 속하는지 확인하고, 두 집합을 합치는 연산을 효율적으로 수행한다.

### 3-2. 기본 구현

```javascript
class UnionFind {
  constructor(n) {
    this.parent = new Array(n);
    this.rank = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      this.parent[i] = i;
    }
  }
  
  // 경로 압축을 사용한 Find
  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // 경로 압축
    }
    return this.parent[x];
  }
  
  // Union by Rank
  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    
    if (rootX === rootY) return false; // 이미 같은 집합
    
    // Rank가 작은 것을 큰 것에 붙이기
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    
    return true;
  }
  
  // 같은 집합에 속하는지 확인
  connected(x, y) {
    return this.find(x) === this.find(y);
  }
}

// 사용 예시
const uf = new UnionFind(5);

uf.union(0, 1);
uf.union(2, 3);
console.log(uf.connected(0, 1)); // true
console.log(uf.connected(0, 2)); // false
uf.union(1, 2);
console.log(uf.connected(0, 3)); // true
```

### 3-3. 실전 문제: 섬의 개수

```javascript
function numIslands(grid) {
  const m = grid.length;
  const n = grid[0].length;
  const uf = new UnionFind(m * n);
  
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === '1') {
        for (const [dx, dy] of directions) {
          const ni = i + dx;
          const nj = j + dy;
          if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid[ni][nj] === '1') {
            uf.union(i * n + j, ni * n + nj);
          }
        }
      }
    }
  }
  
  const islands = new Set();
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === '1') {
        islands.add(uf.find(i * n + j));
      }
    }
  }
  
  return islands.size;
}
```

## 4. 최소 공통 조상 (LCA - Lowest Common Ancestor)

### 4-1. 개념

트리에서 두 노드의 공통 조상 중 가장 가까운 조상을 찾는 문제다.

### 4-2. 이진 리프팅을 사용한 구현

```javascript
class LCA {
  constructor(n, root, edges) {
    this.n = n;
    this.log = Math.ceil(Math.log2(n)) + 1;
    this.depth = new Array(n).fill(0);
    this.parent = Array(n).fill(null).map(() => new Array(this.log).fill(-1));
    this.adj = Array(n).fill(null).map(() => []);
    
    // 인접 리스트 구성
    for (const [u, v] of edges) {
      this.adj[u].push(v);
      this.adj[v].push(u);
    }
    
    // DFS로 depth와 parent[0] 계산
    this.dfs(root, -1, 0);
    
    // 이진 리프팅 테이블 구성
    for (let j = 1; j < this.log; j++) {
      for (let i = 0; i < n; i++) {
        if (this.parent[i][j - 1] !== -1) {
          this.parent[i][j] = this.parent[this.parent[i][j - 1]][j - 1];
        }
      }
    }
  }
  
  dfs(u, p, d) {
    this.depth[u] = d;
    this.parent[u][0] = p;
    
    for (const v of this.adj[u]) {
      if (v !== p) {
        this.dfs(v, u, d + 1);
      }
    }
  }
  
  lca(u, v) {
    // u가 더 깊게
    if (this.depth[u] < this.depth[v]) {
      [u, v] = [v, u];
    }
    
    // 같은 depth로 맞추기
    for (let i = this.log - 1; i >= 0; i--) {
      if (this.depth[u] - (1 << i) >= this.depth[v]) {
        u = this.parent[u][i];
      }
    }
    
    if (u === v) return u;
    
    // LCA 찾기
    for (let i = this.log - 1; i >= 0; i--) {
      if (this.parent[u][i] !== this.parent[v][i]) {
        u = this.parent[u][i];
        v = this.parent[v][i];
      }
    }
    
    return this.parent[u][0];
  }
}

// 사용 예시
const n = 7;
const edges = [
  [0, 1], [0, 2],
  [1, 3], [1, 4],
  [2, 5], [2, 6]
];
const lca = new LCA(n, 0, edges);

console.log(lca.lca(3, 4)); // 1
console.log(lca.lca(3, 6)); // 0
```

## 5. 강한 연결 요소 (SCC - Strongly Connected Components)

### 5-1. 개념

유향 그래프에서 서로 도달 가능한 노드들의 집합을 강한 연결 요소라고 한다.

### 5-2. Kosaraju 알고리즘

```javascript
class SCC {
  constructor(n, edges) {
    this.n = n;
    this.adj = Array(n).fill(null).map(() => []);
    this.revAdj = Array(n).fill(null).map(() => []);
    
    for (const [u, v] of edges) {
      this.adj[u].push(v);
      this.revAdj[v].push(u);
    }
  }
  
  kosaraju() {
    const visited = new Array(this.n).fill(false);
    const order = [];
    
    // 1. 첫 번째 DFS (순서 결정)
    for (let i = 0; i < this.n; i++) {
      if (!visited[i]) {
        this.dfs1(i, visited, order);
      }
    }
    
    // 2. 역방향 그래프에서 DFS
    visited.fill(false);
    const sccs = [];
    
    for (let i = order.length - 1; i >= 0; i--) {
      const node = order[i];
      if (!visited[node]) {
        const component = [];
        this.dfs2(node, visited, component);
        sccs.push(component);
      }
    }
    
    return sccs;
  }
  
  dfs1(u, visited, order) {
    visited[u] = true;
    for (const v of this.adj[u]) {
      if (!visited[v]) {
        this.dfs1(v, visited, order);
      }
    }
    order.push(u);
  }
  
  dfs2(u, visited, component) {
    visited[u] = true;
    component.push(u);
    for (const v of this.revAdj[u]) {
      if (!visited[v]) {
        this.dfs2(v, visited, component);
      }
    }
  }
}

// 사용 예시
const n = 5;
const edges = [
  [0, 1], [1, 2], [2, 0],
  [1, 3], [3, 4]
];
const scc = new SCC(n, edges);
console.log(scc.kosaraju()); // [[0, 2, 1], [3], [4]]
```

## 6. 위상 정렬 (Topological Sort)

### 6-1. 개념

유향 비순환 그래프(DAG)에서 노드들을 선후 관계에 따라 정렬하는 알고리즘이다.

### 6-2. Kahn 알고리즘 (위상 정렬)

```javascript
function topologicalSort(n, edges) {
  const adj = Array(n).fill(null).map(() => []);
  const inDegree = new Array(n).fill(0);
  
  // 그래프 구성 및 진입 차수 계산
  for (const [u, v] of edges) {
    adj[u].push(v);
    inDegree[v]++;
  }
  
  // 진입 차수가 0인 노드들을 큐에 추가
  const queue = [];
  for (let i = 0; i < n; i++) {
    if (inDegree[i] === 0) {
      queue.push(i);
    }
  }
  
  const result = [];
  
  while (queue.length > 0) {
    const u = queue.shift();
    result.push(u);
    
    // 인접 노드들의 진입 차수 감소
    for (const v of adj[u]) {
      inDegree[v]--;
      if (inDegree[v] === 0) {
        queue.push(v);
      }
    }
  }
  
  // 사이클이 있으면 빈 배열 반환
  if (result.length !== n) {
    return []; // 사이클 존재
  }
  
  return result;
}

// 사용 예시
const n = 6;
const edges = [
  [5, 2], [5, 0],
  [4, 0], [4, 1],
  [2, 3], [3, 1]
];
console.log(topologicalSort(n, edges)); // [4, 5, 0, 2, 3, 1]
```

### 6-3. DFS를 사용한 위상 정렬

```javascript
function topologicalSortDFS(n, edges) {
  const adj = Array(n).fill(null).map(() => []);
  const visited = new Array(n).fill(false);
  const result = [];
  
  for (const [u, v] of edges) {
    adj[u].push(v);
  }
  
  function dfs(u) {
    visited[u] = true;
    for (const v of adj[u]) {
      if (!visited[v]) {
        dfs(v);
      }
    }
    result.push(u); // 역순으로 추가
  }
  
  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      dfs(i);
    }
  }
  
  return result.reverse();
}
```

## 7. 최소 신장 트리 (MST - Minimum Spanning Tree)

### 7-1. Kruskal 알고리즘

```javascript
class KruskalMST {
  constructor(n, edges) {
    this.n = n;
    this.edges = edges.sort((a, b) => a[2] - b[2]); // 가중치 오름차순
    this.uf = new UnionFind(n);
  }
  
  findMST() {
    const mst = [];
    let totalWeight = 0;
    
    for (const [u, v, weight] of this.edges) {
      if (this.uf.union(u, v)) {
        mst.push([u, v, weight]);
        totalWeight += weight;
      }
    }
    
    return { mst, totalWeight };
  }
}

// 사용 예시
const n = 4;
const edges = [
  [0, 1, 10],
  [0, 2, 6],
  [0, 3, 5],
  [1, 3, 15],
  [2, 3, 4]
];

const kruskal = new KruskalMST(n, edges);
const { mst, totalWeight } = kruskal.findMST();
console.log("MST:", mst); // [[2, 3, 4], [0, 3, 5], [0, 1, 10]]
console.log("Total Weight:", totalWeight); // 19
```

### 7-2. Prim 알고리즘

```javascript
class PrimMST {
  constructor(n, edges) {
    this.n = n;
    this.adj = Array(n).fill(null).map(() => []);
    
    for (const [u, v, weight] of edges) {
      this.adj[u].push([v, weight]);
      this.adj[v].push([u, weight]);
    }
  }
  
  findMST(start = 0) {
    const visited = new Array(this.n).fill(false);
    const minHeap = [[0, start, -1]]; // [weight, node, parent]
    const mst = [];
    let totalWeight = 0;
    
    while (minHeap.length > 0) {
      minHeap.sort((a, b) => a[0] - b[0]);
      const [weight, u, parent] = minHeap.shift();
      
      if (visited[u]) continue;
      visited[u] = true;
      
      if (parent !== -1) {
        mst.push([parent, u, weight]);
        totalWeight += weight;
      }
      
      for (const [v, w] of this.adj[u]) {
        if (!visited[v]) {
          minHeap.push([w, v, u]);
        }
      }
    }
    
    return { mst, totalWeight };
  }
}

// 사용 예시
const prim = new PrimMST(n, edges);
const { mst: primMST, totalWeight: primWeight } = prim.findMST();
console.log("Prim MST:", primMST);
console.log("Total Weight:", primWeight);
```

## 8. 최대 유량 (Max Flow)

### 8-1. Ford-Fulkerson 알고리즘 (DFS)

```javascript
class MaxFlow {
  constructor(n, source, sink) {
    this.n = n;
    this.source = source;
    this.sink = sink;
    this.capacity = Array(n).fill(null).map(() => new Array(n).fill(0));
    this.adj = Array(n).fill(null).map(() => []);
  }
  
  addEdge(u, v, cap) {
    this.capacity[u][v] = cap;
    this.adj[u].push(v);
    this.adj[v].push(u); // 역방향 간선
  }
  
  fordFulkerson() {
    let maxFlow = 0;
    const parent = new Array(this.n).fill(-1);
    
    while (this.bfs(parent)) {
      let pathFlow = Infinity;
      
      // 경로의 최소 용량 찾기
      for (let v = this.sink; v !== this.source; v = parent[v]) {
        const u = parent[v];
        pathFlow = Math.min(pathFlow, this.capacity[u][v]);
      }
      
      // 유량 업데이트
      for (let v = this.sink; v !== this.source; v = parent[v]) {
        const u = parent[v];
        this.capacity[u][v] -= pathFlow;
        this.capacity[v][u] += pathFlow; // 역방향 간선
      }
      
      maxFlow += pathFlow;
    }
    
    return maxFlow;
  }
  
  bfs(parent) {
    const visited = new Array(this.n).fill(false);
    const queue = [this.source];
    visited[this.source] = true;
    
    while (queue.length > 0) {
      const u = queue.shift();
      
      for (const v of this.adj[u]) {
        if (!visited[v] && this.capacity[u][v] > 0) {
          visited[v] = true;
          parent[v] = u;
          queue.push(v);
          
          if (v === this.sink) {
            return true;
          }
        }
      }
    }
    
    return false;
  }
}

// 사용 예시
const n = 6;
const maxFlow = new MaxFlow(n, 0, 5);

maxFlow.addEdge(0, 1, 16);
maxFlow.addEdge(0, 2, 13);
maxFlow.addEdge(1, 2, 10);
maxFlow.addEdge(1, 3, 12);
maxFlow.addEdge(2, 1, 4);
maxFlow.addEdge(2, 4, 14);
maxFlow.addEdge(3, 2, 9);
maxFlow.addEdge(3, 5, 20);
maxFlow.addEdge(4, 3, 7);
maxFlow.addEdge(4, 5, 4);

console.log("Max Flow:", maxFlow.fordFulkerson()); // 23
```

## 9. 실전 문제 풀이

### 9-1. 구간 최솟값 쿼리 (세그먼트 트리)

```javascript
// 문제: 배열에서 구간 [l, r]의 최솟값을 여러 번 구하기
function solveRangeMinQuery(arr, queries) {
  const segTree = new MinSegmentTree(arr);
  const results = [];
  
  for (const [l, r] of queries) {
    results.push(segTree.query(l, r + 1));
  }
  
  return results;
}

const arr = [1, 3, 2, 7, 9, 11, 5, 8];
const queries = [[0, 3], [2, 5], [1, 4]];
console.log(solveRangeMinQuery(arr, queries)); // [1, 2, 2]
```

### 9-2. 친구 네트워크 (유니온 파인드)

```javascript
// 문제: 친구 관계를 입력받아 네트워크 크기 구하기
function friendNetwork(n, friendships) {
  const uf = new UnionFind(n);
  const size = new Array(n).fill(1);
  
  for (const [a, b] of friendships) {
    const rootA = uf.find(a);
    const rootB = uf.find(b);
    
    if (rootA !== rootB) {
      uf.union(a, b);
      const newRoot = uf.find(a);
      size[newRoot] = size[rootA] + size[rootB];
    }
    
    console.log(`Network size: ${size[uf.find(a)]}`);
  }
}
```

### 9-3. 코스 스케줄 (위상 정렬)

```javascript
// 문제: 선수 과목 관계가 주어질 때, 모든 과목을 수강할 수 있는지 확인
function canFinish(numCourses, prerequisites) {
  const adj = Array(numCourses).fill(null).map(() => []);
  const inDegree = new Array(numCourses).fill(0);
  
  for (const [course, prereq] of prerequisites) {
    adj[prereq].push(course);
    inDegree[course]++;
  }
  
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) {
      queue.push(i);
    }
  }
  
  let count = 0;
  while (queue.length > 0) {
    const u = queue.shift();
    count++;
    
    for (const v of adj[u]) {
      inDegree[v]--;
      if (inDegree[v] === 0) {
        queue.push(v);
      }
    }
  }
  
  return count === numCourses;
}

console.log(canFinish(2, [[1, 0]])); // true
console.log(canFinish(2, [[1, 0], [0, 1]])); // false (사이클)
```

## 10. 시간 복잡도 비교

| 알고리즘 | 시간 복잡도 | 공간 복잡도 |
|----------|-------------|-------------|
| 세그먼트 트리 (구간 쿼리) | O(log N) | O(N) |
| 펜윅 트리 (구간 합) | O(log N) | O(N) |
| 유니온 파인드 | O(α(N)) (거의 상수) | O(N) |
| LCA (이진 리프팅) | O(log N) | O(N log N) |
| SCC (Kosaraju) | O(V + E) | O(V + E) |
| 위상 정렬 | O(V + E) | O(V + E) |
| MST (Kruskal) | O(E log E) | O(V) |
| MST (Prim) | O(E log V) | O(V + E) |
| 최대 유량 (Ford-Fulkerson) | O(E × max_flow) | O(V + E) |

## 11. 결론

고급 알고리즘은 복잡한 문제를 효율적으로 해결하는 핵심 도구다. 이 글에서 다룬 내용:

1. **세그먼트 트리**: 구간 쿼리와 업데이트를 빠르게 처리
2. **펜윅 트리**: 메모리 효율적인 구간 합 쿼리
3. **유니온 파인드**: 집합 연산을 효율적으로 처리
4. **LCA**: 트리에서 공통 조상 찾기
5. **SCC**: 유향 그래프의 강한 연결 요소
6. **위상 정렬**: DAG의 선후 관계 정렬
7. **MST**: 최소 신장 트리 구하기
8. **최대 유량**: 네트워크 유량 최대화

이러한 알고리즘들을 숙지하면 코딩 테스트와 실무 문제를 더 효율적으로 해결할 수 있다.

## 참고 자료

- [알고리즘 문제 해결 전략 (책)](https://book.algospot.com/)
- [LeetCode](https://leetcode.com/)
- [백준 온라인 저지](https://www.acmicpc.net/)

