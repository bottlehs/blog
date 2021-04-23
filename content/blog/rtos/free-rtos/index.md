---
templateKey: blog-post
title: RTPS 와 RebbleOS(Pebble)
date: 2020-10-13T07:11:12.292Z
category: rtos
description: RTOS(←Real Time Operating System)는 실시간 응용 프로그램을 위해 개발된 운영 체제이다. Pebble OS 는 RTOS 에 기반하여 개발되었다.
tags:
  - RTOS
  - Pebble
  - eCos
  - FreeRTOS
---

## RTOS의 특징

- Multi Process, Multi Thread, Preemptible 기능
- 스레드 우선순위 (대부분의 실시간 운영체제는 256단계 지원)
- 예측 가능한 스레드 동기화
- 우선순위에 근거한 선점형(preemptive) 작업 스케쥴링
- 외부 이벤트에 예측 가능한 반응(Hard real-time systems에서는 1 마이크로세컨드, soft real-time system에서는 10밀리세컨드 정도의 반응 시간 요구)
- 빠른 입출력
- 최소한의 인터럽트 중지(disabled interrupts) 기간
- 최소 메모리 요구 사항을 충족하는 소형 커널
- 개발자가 독자적인 운영체제 기능을 제작할 수 있는 개발 환경

## FreeRTOS

### RebbleOS (Pebble)

RebbleOS는 이전에 페블 테크놀로지사가 제조했던 장치의 펌웨어를 오픈 소스 재구성한 것이다. 펌웨어는 FreeRTOS를 기반으로 하며, 기존의 페블 OS용으로 작성된 어플리케이션과의 바이너리 호환은 물론, 페블과 작동하도록 설계된 스마트폰 어플리케이션과의 무선 호환성을 목표로 하고 있다.

https://github.com/ginge/FreeRTOS-Pebble
