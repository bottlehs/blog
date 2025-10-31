---
templateKey: blog-post
title: 트리 순회 (Tree Traversal)
date: 2025-11-01T00:00:00.000Z
category: algorithm
description:
  이진 트리에서 노드를 방문하는 순서를 다르게 하는 세 가지 순회 방법.
  전위, 중위, 후위 순회로 나뉘며 재귀 또는 스택으로 구현 가능하다.
tags:
  - 트리 순회
  - Tree Traversal
  - 전위 순회
  - 중위 순회
  - 후위 순회
  - 알고리즘
  - Algorithm
  - JavaScript
---

![트리 순회 (Tree Traversal)](/assets/algorithm.png "트리 순회 (Tree Traversal)")

트리 순회는 이진 트리의 모든 노드를 체계적으로 방문하는 방법으로, 방문 순서에 따라 전위·중위·후위 순회로 나뉜다.

## 정의

이진 트리의 각 노드를 정확히 한 번씩 방문하는 방법이다. 방문 순서에 따라 세 가지로 구분한다. 전위 순회(Pre-order)는 " root → 왼쪽 서브트리 → 오른쪽 서브트리" 순서로, 중위 순회(In-order)는 "왼쪽 서브트리 → 루트 → 오른쪽 서브트리" 순서로, 후위 순회(Post-order)는 "왼쪽 서브트리 → 오른쪽 서브트리 → 루트" 순서로 방문한다.

중위 순회는 이진 탐색 트리에서 오름차순으로 값을 얻을 때 유용하다. 전위 순회는 트리를 복사하거나 전위 표기식을 구할 때, 후위 순회는 트리를 삭제하거나 후위 표기식을 구할 때 자주 쓰인다. 레벨 순서 탐색은 BFS와 동일하며, 큐를 사용해 같은 레벨의 노드를 차례로 방문한다.

## 구현

재귀를 사용하면 각 순회가 매우 간결하게 구현된다. 전위는 루트를 먼저 방문 처리(배열에 추가)한 뒤 왼쪽과 오른쪽 자식에 재귀 호출을 한다. 중위는 왼쪽 자식을 먼저 방문하고 루트를 방문한 뒤 오른쪽을 방문한다. 후위는 양쪽 자식을 모두 방문한 뒤 마지막에 루트를 방문한다.

스택을 사용한 반복적 구현도 가능하다. 전위의 경우 루트를 스택에 넣고, 스택이 빌 때까지 노드를 꺼내 방문한 뒤 오른쪽과 왼쪽 자식을 순서대로 스택에 넣는다. 중위 순회의 경우 노드와 왼쪽 자식들을 모두 스택에 넣은 뒤 꺼내며 방문하고, 오른쪽 자식이 있으면 다시 스택에 넣는다. 레벨 순서는 BFS와 동일하게 큐를 사용한다.

```javascript
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val
    this.left = left
    this.right = right
  }
}

// 전위 순회: Root → Left → Right
function preorder(root) {
  if (!root) return []
  return [root.val, ...preorder(root.left), ...preorder(root.right)]
}

// 중위 순회: Left → Root → Right
function inorder(root) {
  if (!root) return []
  return [...inorder(root.left), root.val, ...inorder(root.right)]
}

// 후위 순회: Left → Right → Root
function postorder(root) {
  if (!root) return []
  return [...postorder(root.left), ...postorder(root.right), root.val]
}

// 레벨 순서 탐색 (BFS)
function levelOrder(root) {
  if (!root) return []
  const result = []
  const q = [root]
  
  while (q.length) {
    const node = q.shift()
    result.push(node.val)
    if (node.left) q.push(node.left)
    if (node.right) q.push(node.right)
  }
  
  return result
}

// 예시 트리
//       1
//      / \
//     2   3
//    / \
//   4   5
const root = new TreeNode(1,
  new TreeNode(2,
    new TreeNode(4),
    new TreeNode(5)
  ),
  new TreeNode(3)
)

console.log(preorder(root))   // [1, 2, 4, 5, 3]
console.log(inorder(root))    // [4, 2, 5, 1, 3]
console.log(postorder(root))  // [4, 5, 2, 3, 1]
console.log(levelOrder(root)) // [1, 2, 3, 4, 5]
```

## 데모

[https://codepen.io/pen/?template=yLgbWPj](https://codepen.io/pen/?template=yLgbWPj)



