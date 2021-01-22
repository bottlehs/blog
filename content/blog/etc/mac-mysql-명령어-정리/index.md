---
templateKey: blog-post
title: Mac MySQL 명령어 정리
date: 2021-01-22T15:15:22.980Z
description: MySQL 상태확인, 시작, 중지 및 데이터베이스 조회, 생성, 삭제
tags:
  - MySQL
  - Mac
---
## MySQL 상태확인, 시작, 중지

```
mysql.server status // 상태확인
mysql.server start // 시작
mysql.server stop // 정지
```
## DataBase
### DataBase 조회
```
show databases;
```

### DataBase 생성
```
create database blog
```

### DataBase 사용설정
```
use blog
```

### DataBase 삭제
```
drop database blog
```