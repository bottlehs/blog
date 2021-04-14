---
templateKey: blog-post
title: Mac 에서 Node.js, NPM 업데이트 하기 (2021)
date: 2021-04-14T00:37:23.601Z
category: etc
description:
  NPM의 신규 or 업데이트된 JavaScript 라이브러는 최신 안정화 Node.js 버전이 필요하다. 따라서
  Node.js 를 주기적으로 업데이트를 해줘야 한다. Mac 기준 Node.js 를 가장 쉽게 업데이트 할수 있는 방법을 소개 하고자 한다.
tags:
  - javascript
  - nodejs
  - npm
  - update
  - mac
---

NPM의 신규 or 업데이트된 JavaScript 라이브러는 최신 안정화 Node.js 버전이 필요하다. 따라서 Node.js 를 주기적으로 업데이트를 해줘야 한다. Mac 기준 Node.js 를 가장 쉽게 업데이트 할수 있는 방법을 소개 하고자 한다.

![node.js](/assets/1200px-node.js_logo.svg.png "node.js")

## Node

### 콘솔을 열고 Node.js 버전을 확인한다.

```
$ node -v
v x.x.x
```

### n 모듈이 설치 안되어 있을경우 n 모듈을 설치 한다.

```
$ sudo npm install -g n
```

### Node.js를 원하는 버전으로 업데이트 한다.

```
Stable 버전 설치
$ sudo n stable

최신 버전 설치
$ sudo n latest

LTS 버전 설치
$ sudo n lts
```

### 정상적으로 설치&업데이트 되었는지 확인 한다.

```
$ node -v
v x.x.x
```

## NPM

### 현재 버전 확인

```
$ npm -v
```

### npm 재설치

```
$ sudo npm install -g npm
```
