---
templateKey: blog-post
title: 파이어베이스(Firebase) Authentication
date: 2020-12-18T09:59:14.435Z
category: etc
description: 파이어베이스 인증의 목표는 인증 시스템을 손쉽게 구축하도록 지원한다. 이메일/비밀번호 계정, 전화 인증, Google, Twitter, Facebook, Github 로그인 등을 지원하는 종합적인 ID 솔루션을 제공한다.
tags:
  - 파이어베이스
  - Firebase
  - Cloud Firestore
  - Realtime Database
  - Hosting
  - Functions
  - Authentication
---

![파이어베이스(Firebase) Authentication](/assets/logo-standard.png "파이어베이스(Firebase) Authentication")

파이어베이스 인증의 목표는 인증 시스템을 손쉽게 구축하도록 지원한다. 이메일/비밀번호 계정, 전화 인증, Google, Twitter, Facebook, Github 로그인 등을 지원하는 종합적인 ID 솔루션을 제공한다.

아래는 파이어베이스(Firebase) Authentication 부분으로서, 어려 개의 탭이 있는데 하나씩 살펴 보도록 하겠다.

![파이어베이스 Authentication ](/assets/chatbot_–_authentication_–_firebase_console.jpg "파이어베이스 Authentication ")

### 사용자(Users)

파이어베이스 인증을 통해 들어온 사용자의 목록을 확인할 수 있다. 페이스북, 트위터 등의 제공업체와 개별 사용자의 고유 Id를 확인할 수 있다.

### 로그인 방법(Sign-in method)

이메일 로그인, Google, Facebook, Twitter 등의 파이어베이스가 제공하는 로그인 인증 방법들이 나열되어 있다. 개발 시에 해당 로그인 인증방법을 사용하기 위해서는 이 탭에서 해당 방법을 활성화 시켜야 한다. 로그인 제공업체 아래에는 승인된 도메인으로서, OAuth 리다이렉션을 승인받은 도메인들이 나열되어 있다.

### 템플릿(Templates)

이메일 인증, 비밀번호 재설정, 이메일 주소 변경, SMS인증 등의 유용한 기능들을 이곳에서 설정할 수 있다.
