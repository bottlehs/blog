---
templateKey: blog-post
title: Android ROOM
date: 2021-05-02T18:11:34.709Z
category: android
description:
tags:
  - android
  - kotlin
  - framework
  - room
---

![Android ROOM](/assets/android-logo.png "Android ROOM")

## 개요

> Room은 SQLite에 대한 추상화 레이어를 제공하여 원활한 데이터베이스 액세스를 지원하는 동시에 SQLite를 완벽히 활용합니다. 상당한 양의 구조화된 데이터를 처리하는 앱은 데이터를 로컬로 유지하여 대단한 이점을 얻을 수 있습니다. 가장 일반적인 사용 사례는 관련 데이터를 캐싱하는 것입니다. 이런 방식으로 기기가 네트워크에 액세스할 수 없을 때 오프라인 상태인 동안에도 사용자가 여전히 콘텐츠를 탐색할 수 있습니다. 나중에 기기가 다시 온라인 상태가 되면 사용자가 시작한 콘텐츠 변경사항이 서버에 동기화됩니다. Room은 이러한 문제를 자동으로 처리하므로 SQLite 대신 Room을 사용할 것을 적극적으로 권장합니다.

## ROOM 특징

### Database (데이터베이스)

저장하는 데이터의 집합 단위를 말합니다

### Entity (항목)

데이터베이스 내의 테이블을 의미합니다

### DAO (다오)

데이터베이스에 접근하는 함수(insert,update,delete,...)를 제공합니다

## 사용해 보기

### Gradle에 ROOM 추가

room dependencies를 추가해준다

app/build.gradle

```groovy
dependencies {
  def room_version = "2.2.6"

  implementation "androidx.room:room-runtime:$room_version"
  // For Kotlin use kapt instead of annotationProcessor
  annotationProcessor "androidx.room:room-compiler:$room_version"

  // optional - Kotlin Extensions and Coroutines support for Room
  implementation "androidx.room:room-ktx:$room_version"

  // optional - RxJava support for Room
  implementation "androidx.room:room-rxjava2:$room_version"

  // optional - Guava support for Room, including Optional and ListenableFuture
  implementation "androidx.room:room-guava:$room_version"

  // Test helpers
  testImplementation "androidx.room:room-testing:$room_version"
}
```

### Entity 만들기
