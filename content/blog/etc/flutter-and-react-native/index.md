---
templateKey: blog-post
title: Flutter, React Native
date: 2022-01-03T21:58:59.354Z
category: etc
description: 플러터(Flutter)는 구글이 개발한 오픈 소스 모바일 애플리케이션 개발 프레임워크이다. 안드로이드, iOS용 애플리케이션 개발을 위해, 또 구글 퓨시아용 애플리케이션 개발의 주된 방식으로 사용된다. 리액트 네이티브(React Native)는 페이스북이 개발한 오픈 소스 모바일 애플리케이션 프레임워크이다.안드로이드, iOS, 웹, UWP용 애플리케이션을 개발하기 위해 사용되며, 개발자들이 네이티브 플랫폼 기능과 더불어 리액트를 사용할 수 있게 한다.
tags:
  - flutter
  - reactnative
  - dart
  - javascript
  - 크로스플랫폼이
---

Flutter 와 React Native 에 대해 아키텍처, 성능,

## 크로스플랫폼이란

크로스 플랫폼 또는 멀티 플랫폼은 컴퓨터 프로그램, 운영 체제, 컴퓨터 언어, 프로그래밍 언어, 컴퓨터 소프트웨어 등이 여러 종류의 컴퓨터 플랫폼에서 동작할 수 있다는 것을 뜻하는 용어이다. 크로스 플랫폼 응용 프로그램은 둘 이상의 플랫폼에서 실행할 수 있다. 이러한 종류의 소프트웨어는 멀티플랫폼 소프트웨어라고도 한다.

이를테면, x86 아키텍처 위의 마이크로소프트 윈도우, 리눅스, OS X에서 동작하는 크로스 플랫폼 응용 프로그램은 다른 아키텍처 위의 운영 체제에서는 동작하지 않지만, x86 기반의 해당 운영 체제에서는 모두 작동한다.

크로스 플랫폼 앱 개발은 일반적으로 아래와 같은 경우에 사용된다.

- 단기간에 앱을 개발하고자 하는 경우
- 네이티브 앱 개발에 약간의 제한이 있는 경우
- 비즈니스 필요 요건이 시장에 다이내믹하게 적응할 경우

## Flutter 란

플러터(Flutter)는 구글이 개발한 오픈 소스 모바일 애플리케이션 개발 프레임워크이다. 안드로이드, iOS용 애플리케이션 개발을 위해, 또 구글 퓨시아용 애플리케이션 개발의 주된 방식으로 사용된다

```dart
import 'package:flutter/material.dart';

void main() => runApp(HelloWorldApp());

class HelloWorldApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Hello World Bottlehs',
      home: Scaffold(
        appBar: AppBar(
          title: Text('Hello World Bottlehs'),
        ),

        body: Center(
          child: Text('Hello World'),
        ),
      ),
    );
  }
}
```

### 아키텍처

주요 구성요소는 아래와 같다.

- Dart
- Flutter engine
- Foundation library
- Design-specific widgets

![Flutter Framework Architecture](/assets/flutter-framework-architecture.png "Flutter Framework Architecture")

**Framework Dart**
개발에 사용하는 위젯, 제스처, 에니메이션등으로 구성 되어 있다.

**Engine C/C++**
Engine은 C++로 구성되며 Skia, Dart 및 Text 등이 포함된다. Skia는 다양한 하드웨어 및 소프트웨어 플랫폼에 공통 API를 제공하는 오픈소스 2D 그래픽 라이브러리이며, 구글 크롬, 크롬 OS, 안드로이드, 모질라 파이어폭스, 파이어폭스 OS 등등 다양한 곳에서 사용된다.

**Embedder Platform Specific**
Embedder는 Flutter 를 다양한 플랫폼에 임베드하는 임베디드 레이어로서, Suface 설정, 스레드 설정 및 플러그인 랜더링을 포함단다.

## React Native 란

리액트 네이티브(React Native)는 페이스북이 개발한 오픈 소스 모바일 애플리케이션 프레임워크이다.안드로이드, iOS, 웹, UWP용 애플리케이션을 개발하기 위해 사용되며, 개발자들이 네이티브 플랫폼 기능과 더불어 리액트를 사용할 수 있게 한다.

리액트 네이티브의 동작 원리는 리액트 네이티브가 가상 DOM을 통해 DOM을 조작하지 않는다는 점을 제외하고는 리액트와 실질적으로 동일하다. 직렬화, 비동기, 일괄 처리 브리지를 통해 네이티브 플랫폼과 통신하며 종단 장치에 직접(개발자가 작성한 자바스크립트를 해석하는) 백그라운드 프로세스로 실행된다.

리액트 네이티브는 HTML이나 CSS를 사용하지 않는다. 그 대신 자바스크립트 쓰레드로부터의 메시지를 사용하여 네이티브 뷰를 조작한다. 리액트 네이티브는 개발자들이 안드로이드용 자바/코틀린, iOS용 오브젝티브-C/스위프트와 같은 언어로 작성한 네이티브 코드와 인터페이스가 가능하도록 브릿지(Bridge)를 제공하므로 더 많은 유연성을 제공한다.

```javascript
import React from "react"
import { AppRegistry, Text } from "react-native"

const HelloWorldApp = () => <Text>Hello world!</Text>
export default HelloWorldApp

AppRegistry.registerComponent("Hello World Bottlehs", () => HelloWorldApp)

import HelloWorldApp from "./HelloWorldApp"
```

### 아키텍처

구성요소는 아래와 같다.

![React Native Architecture](/assets/react-native-architecture.png "React Native Architecture")

**JS Thread**
Hermes, V8 등 고성능 JS 사용

**JSI**
브릿지 역할이며 JS Thread 와 Native Module 을 동기화 한다. 이를 통해 C++ 의 호스트 객체를 참조하고 메소드를 호출할 수 있다.

**Fabric**
UI Manager 아키텍처, C++에서 바로 Shdow Tree를 생성하여 프로세스를 신속하기 처리하고 랜더링한다.

## 개발 언어

**Flutter(Dart)**
구글이 멀티 플랫폼 상에서 동작되도록 하는 앱을 위해 디자인된 프로그래밍 언어. 다트는 2011년 10월에 공개되었다. 기본적으로 C언어의 문법과 거의 같으며 Java, C#, Javascript와 같은 기능적 스트럭쳐를 추가한 언어로, 언급된 언어보다 간결하고 강력한 기능을 지원한다. 모바일, 데스크탑, 서버, 웹 앱 용도에 사용된다. Dart는 DVM(Dart VM)상에서 동작하거나 네이티브 컴파일링을 통해 모바일, 데스크탑, 웹브라우져, 서버 플랫폼 상에서 어플리케이션 실행을 지원하고 있다. Dart 프로젝트의 목적은 구조적이지만 유연하고 프로그래머들에게 자연스럽고 다양한 종류의 기기에서 동작되도록 하는 것이다. 구글에서 2017년 발표한 크로스플랫폼 앱 프레임워크인 Flutter가 이 언어를 사용하고 있다. 2021년 4월 기준 최신 안정 버전은 2.12.2이다.

**React Native(Javascript)**
자바스크립트(영어: JavaScript)는 객체 기반의 스크립트 프로그래밍 언어이다. 이 언어는 웹 브라우저 내에서 주로 사용하며, 다른 응용 프로그램의 내장 객체에도 접근할 수 있는 기능을 가지고 있다. 또한 Node.js와 같은 런타임 환경과 같이 서버 프로그래밍에도 사용되고 있다. 자바스크립트는 본래 넷스케이프 커뮤니케이션즈 코퍼레이션의 브렌던 아이크(Brendan Eich)가 처음에는 모카(Mocha)라는 이름으로, 나중에는 라이브스크립트(LiveScript)라는 이름으로 개발하였으며, 최종적으로 자바스크립트가 되었다. 자바스크립트가 썬 마이크로시스템즈의 자바와 구문이 유사한 점도 있지만, 이는 사실 두 언어 모두 C 언어의 기본 구문에 바탕을 뒀기 때문이고, 자바와 자바스크립트는 직접적인 연관성은 약하다. 이름과 구문 외에는 자바보다 셀프나 스킴과 유사성이 많다. 자바스크립트는 ECMA스크립트(ECMAScript)의 표준 사양을 가장 잘 구현한 언어로 인정받고 있으며 ECMAScript 5 (ES5) 까지는 대부분의 브라우저에서 기본적으로 지원되었으나 ECMAScript 6 이후부터는 브라우저 호환성을 위해 트랜스파일러로 컴파일된다.

Dart는 AOT (Ahead-of-Time) 및 JIT (Just-In-Time) 컴파일러를 사용하여 JavaScript보다 최대 2 배 빠르다. flutter의 경우 Java 또는 C ++에 익숙한 앱 개발자 채택하여 개발하는게 좋다. 그러나 반대로 JavaScript는 React Native Mobile 앱 개발을 위해 개발자 커뮤니티에서 가장 인기있는 언어 중 하나다. 그 많큼 인력풀이 많다는 이점이 있다.

## 성능

Flutter 는, Skia 그래픽 라이브러리와 C/C++ 엔진을 사용한다. C/C++ 엔진을 보면 결과를 유추해 볼 수 있다, 이는 네이티브 플랫폼과 프레임워크 자체와의 커뮤니케이션 그리고 변환경로가 요구되지 않기 때문에 프레임워크가 더욱 좋은 성능을 낼 수 있도록 한다.

반면, React-Native 는 JS Bridge로 알려진 Javascript 엔진 기반으로 실행되며 Facebook에서 개발한 FLUX 아키텍처를 사용한다. JS Bridge는 JavaScript 모듈과 네이티브 플랫폼 간의 커뮤니케이션을 만들고 런타임 동안 코드를 네이티브 코드로 컴파일한다. 이 프로세스는 CPU 와 메모리를 더 많이 필요로 한다.

따라서 성능은 Flutter 가 더 앞선다.

## 러닝커브

React Native는 JSX, 즉 Javascript를 기반으로 개발되며, 개발자 대부분이 Javascript에 익숙하여 React Native에 매우 쉽게 활용할 수 있다. 이를 통해 대다수의 Javascript 를 사용하는 프론트앤드 개발자는 리엑트네이티브를 무리 없이 개발을 시작할 수 있다.

반면 Flutter의 경우 시장에서는 낯선 Dart언어를 활용하여 개발해야하고 대부분의 개발자들은 이 언어를 잘 모르기 때문에 먼저 이 언어를 학습한 후 Flutter를 학습해야 하므로 러닝커브가 긴편이다.

따라서 러능커브는 React Native 가 더 앞선다. (기존 iOS, 안드로이드 개발자는 예외)

## 대중성

크로스 플랫폼의 인기는 높아지고 있으며, 이 분야에서는 React-Native와 Flutter가 절대적으로 우세하다.
React-Native는 2015년 출시됐고, Flutter는 2018년도에 출시되었기 때문에 React Native의 커뮤니티는 Flutter 보다 크다, 최근 Flutter 2.0의 출시로 Flutter의 인기가 대폭 상승 되었다. (구글 트렌드 참고)

## 활용 서비스

### React Native

- 페이스북 : 간편한 네비게이션 기능을 갖춘 모바일 UI를 개발
- 월마트 : 네이티브 기능과 동일한 앱 내에 자연스러운 애니메이션을 제작하여 사용자 경험 개선
- 블룸버그 : 액세스를 간소화 시키고, 코드 자동 새로 고침 기능을 통해 사용자 콘텐츠 개인화
- 인스타그램 : 네비게이션 인프라 구축없이 웹 뷰 형태로 푸시 알림 구현
- 사운드클라우드 : iOS, Android의 업데이트와 패치 버전 간의 시간차 제거
- 윅스 : 구성 가능한 네비게이션과 스크린 옵션 개발하여 속도 개선

### Flutter

- 구글 광고 : iOS 및 Android에서 동일한 사용자 경험을 제공
- Tencent : 사용자와 디바이스 경험 사이의 연결 및 공유되는 디바이스 경험 구축
- 알리바바 : 높은 FPS와 싱글 코드베이스를 가진 모든 애플리케이션을 위해 싱글 탭 네비게이션 경험 구축
- eBay : Flutter와 Firebase를 통합하여 이베이 모터스의 autoML을 개발함으로써 레버리지 콤플렉스와 커스터마이즈 엣지 파워드 AI 기능 활용
- BMW : 운영을 위해 Flutter bloc을 사용하여 높은 퍼포먼스 사용자 인터페이스 개발
- Reflectly : React Native에서 Flutter로 마이그레이션 하고 StreamBuilder 위젯 데이터 동기화 개선
