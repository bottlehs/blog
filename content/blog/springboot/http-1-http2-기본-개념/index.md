---
templateKey: blog-post
title: HTTP, HTTP2 기본 개념
date: 2021-03-19T23:29:29.537Z
category: springboot
description: HTTP1.1은 1999년 출시 이후 지금까지 가장 많이 사용되고 있다. HTTP는 웹상에서 클라이언트와 웹서버간 통신을 위한 프로토콜 중 하나다. HTTP1.1은 기본적으로 연결당 하나의 요청과 응답을 처리하기 때문에 동시전송 문제와 다수의 리소스를 처리하기에 속도와 성능 이슈를 가지고 있다. HTTP2는 성능 뿐만 아니라 속도면에서도 월등하다. Multiplexed Streams(한 커넥션에 여러개의 메세지를 동시에 주고 받을 수 있다), Stream Prioritization(요청 리소스간 의존관계를 설정), Server Push(HTML문서상에 필요한 리소스를 클라이언트 요청없이 보내줄 수 있다), Header Compression(Header 정보를 HPACK압충방식을 이용하여 압축전송)을 사용하여 성능을 획기적으로 향상 시켰다.
tags:
  - HTTP
  - HTTP/1
  - HTTP/2
---

![HTTP, HTTP2 기본 개념](/assets/http-basic.png "HTTP, HTTP2 기본 개념")

## HTTP

HTTP1.1은 1999년 출시 이후 지금까지 가장 많이 사용되고 있다. HTTP는 웹상에서 클라이언트와 웹서버간 통신을 위한 프로토콜 중 하나다. HTTP1.1은 기본적으로 연결당 하나의 요청과 응답을 처리하기 때문에 동시전송 문제와 다수의 리소스를 처리하기에 속도와 성능 이슈를 가지고 있다.

![HTTP, HTTP2 비교](/assets/http-1-http-2.png "HTTP, HTTP2 비교")

그렇기 때문에, HOL(Head Of Line) Blocking-특정응답지연, RTT(Round Trip TIme) 증가, 헤비한 Header구조라는 문제점들을 가지고 있다. 이러한 문제점들을 해결하기 위해, UI 개발자/프론트엔드개발자는 이미지 스프라이트, 도메인샤딩, CSS/JavaScript 압축, Data URI 등을 업무에 사용했다. 그리고 2015년 5월 14일 HTTP2가 세상에 소개되었다. HTTP2는 성능 뿐만 아니라 속도면에서도 월등하다. Multiplexed Streams(한 커넥션에 여러개의 메세지를 동시에 주고 받을 수 있다), Stream Prioritization(요청 리소스간 의존관계를 설정), Server Push(HTML문서상에 필요한 리소스를 클라이언트 요청없이 보내줄 수 있다), Header Compression(Header 정보를 HPACK압충방식을 이용하여 압축전송)을 사용하여 성능을 획기적으로 향상 시켰다.

## HTTP/1

HTTP(HyperText Transfer Protocol)은 웹에서 클라이언트(웹 브라우저)가 웹 서버(httpd, nginx, etc…)와 통신하기 위한 프로토콜 중 하나이다. HTTP 1.1은 클라이언트와 서버 간의 통신을 위해 다음과 같은 과정을 거친다.

위 그림에서 알 수 있듯이 HTTP/1.1은 기본적으로 Connection 한 개당 하나의 요청을 처리하도록 설계되어 있다. 이 때문에 동시에 여러개의 리소스를 주고받는 것이 불가능하고 요청과 응답이 위 그림처럼 순차적으로 이루어진다. 이런 설계 방식 때문에 HTTP 문서 내에 포함된 다수의 리소스 (image, css, script)를 처리하려면 요청할 리소스 개수에 비례하여 Latency(대기시간)이 길어진다.

### HTTP/1 단점

- **HOL(Head Of Line) Blocking - 특정 응답의 지연**

HTTP/1.1의 경우 HOL Blocking이 발생할 수 있다. HOL (Head-Of-Line) 블로킹이란 네트워크에서 같은 큐에 있는 패킷이 첫 번째 패킷에 의해 지연될 때 발생하는 성능 저하 현상을 말한다. 웹 환경에서의 HOL 블로킹은 패킷 처리 속도 지연 뿐만 아니라 최악의 경우 패킷 드랍까지 발생할 수 있다.

- **RTT(Round Trip Time) 증가**

HTTP/1.1의 경우 일반적으로 Connection 하나에 요청 한 개를 처리한다. 이렇다보니 매번 요청 별로 Connection을 만들게 되고 TCP 상에서 동작하는 HTTP의 특성상 3-way Handshake가 반복적으로 일어나며, 불필요한 RTT증가와 네트워크 지연을 초래하여 성능을 지연시킨다.

- **무거운 Header 구조**

HTTP/1.1의 헤더에는 많은 메타 정보들이 저장되어 있다. 클라이언트가 서버로 보내는 HTTP 요청은 매 요청 때마다 중복된 헤더 값을 전송하게 되며 서버 도메인에 관련된 쿠키 정보도 헤더에 함께 포함되어 전송된다. 이러한 반복적인 헤더 전송, 쿠키 정보로 인한 헤더 크기 증가가 HTTP/1.1의 단점이다.

## HTTP/2

HTTP/2는 HTTP/1.1을 완전하게 재작성한 것이 아니라 프로토콜의 성능에 초점을 맞추어 수정한 버전이라 생각하면 된다. 특히 End-user가 느끼는 latency나 네트워크, 서버 리소스 사용량 등과 같은 성능 위주로 개선했다. 아래는 HTTP/2의 주요 특징들이다.

## HTTP/2 주요 특징

- **Multiplexed Streams**

HTTP/2는 Multiplexed Streams를 이용하여 Connection 한 개로 동시에 여러 개의 메시지를 주고 받을 수 있으며 응답은 순서에 상관없이 Stream으로 주고 받는다. HTTP/1.1의 Connection Keep-Alive, Pipelining의 개선 버전이라 보면 된다.

![HTTP/2 Multiplexed Streams](/assets/http2-multiplexed-streams.png "HTTP/2 Multiplexed Streams")

- **Stream Prioritization**

문서 내에 CSS 파일 1개와 이미지 파일 2개가 존재하고 이를 클라이언트가 요청하는 상황에서, 이미지 파일보다 CSS 파일의 수신이 늦어진다면 브라우저 렌더링에 문제가 생기게 된다. HTTP/2에서는 이러한 상황을 고려하여 리소스 간의 의존관계에 따른 우선순위를 설정하여 리소스 로드 문제를 해결한다.

- **Server Push**

서버는 클라이언트가 요청하지 않은 리소스를 사전에 푸쉬를 통해 전송할 수 있다. 이렇게 리소스 푸쉬가 가능해지면 클라이언트가 추후에 HTML 문서를 요청할 때 해당 문서 내의 리소스를 사전에 클라이언트에서 다운로드할 수 있도록 하여 클라이언트의 요청을 최소화할 수 있다.

![HTTP/2 Server Push](/assets/http2-server-push.png "HTTP/2 Server Push")

- **Header Compression**

HTTP/2는 헤더 정보를 압축하기 위해 Header Table과 Huffman Encoding 기법을 사용하여 처리하는데 이를 HPACK 압축방식이라 부르며 별도의 명세서(RFC 7531)로 관리하고 있다.

![HTTP/2 Header Compression](/assets/http2-header-compression.png "HTTP/2 Header Compression")

위 그림처럼 클라이언트가 요청을 두 번 보낸다고 가정할 때 HTTP/1.x의 경우 헤더 중복이 발생해도 중복 전송한다. 하지만 HTTP/2에서는 헤더에 중복이 있는 경우 Static/Dynamic Header Table 개념을 이용하여 중복을 검출해내고 해당 테이블에서의 index값 + 중복되지 않은 Header 정보를 Huffman Encoding 방식으로 인코딩한 데이터를 전송한다.
