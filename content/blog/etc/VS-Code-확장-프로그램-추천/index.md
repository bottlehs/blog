---
templateKey: blog-post
title: VS Code 확장 프로그램 추천 - 개발 생산성을 높이는 필수 확장 20선
date: 2025-12-23T06:45:00.000Z
category: etc
description: VS Code 개발 생산성을 극대화하는 필수 확장 프로그램을 추천한다. 코드 편집, Git, 디버깅, 테마, 프로덕션 등 카테고리별로 실무에서 바로 사용할 수 있는 확장 프로그램을 정리했다.
tags:
  - VS Code
  - 확장 프로그램
  - 개발 도구
  - 생산성
  - 에디터
  - 개발 환경
---

![VS Code 확장 프로그램 추천](/assets/etc.png "VS Code 확장 프로그램 추천")

VS Code는 확장 프로그램으로 기능을 무한히 확장할 수 있다. 적절한 확장 프로그램을 선택하면 개발 생산성을 크게 향상시킬 수 있다. 이 글은 실무에서 가장 유용한 VS Code 확장 프로그램을 카테고리별로 정리한다.

## 1. 필수 확장 프로그램 Top 10

### 1. ESLint

**ID**: dbaeumer.vscode-eslint  
**용도**: JavaScript/TypeScript 린팅  
**설치**: `ext install dbaeumer.vscode-eslint`

**주요 기능**
- 실시간 코드 검사
- 자동 수정
- 설정 파일 지원

### 2. Prettier

**ID**: esbenp.prettier-vscode  
**용도**: 코드 포맷팅  
**설치**: `ext install esbenp.prettier-vscode`

**주요 기능**
- 저장 시 자동 포맷팅
- 다양한 언어 지원
- 커스터마이징 가능

### 3. GitLens

**ID**: eamodio.gitlens  
**용도**: Git 기능 강화  
**설치**: `ext install eamodio.gitlens`

**주요 기능**
- 코드 라인별 작성자/커밋 정보
- 파일 히스토리
- 브랜치 비교

### 4. Live Server

**ID**: ritwickdey.LiveServer  
**용도**: 로컬 개발 서버  
**설치**: `ext install ritwickdey.LiveServer`

**주요 기능**
- 자동 새로고침
- 로컬 서버 실행
- 빠른 프로토타이핑

### 5. Auto Rename Tag

**ID**: formulahendry.auto-rename-tag  
**용도**: HTML/XML 태그 자동 변경  
**설치**: `ext install formulahendry.auto-rename-tag`

**주요 기능**
- 시작/종료 태그 동시 변경
- JSX, Vue 지원

### 6. Path Intellisense

**ID**: christian-kohler.path-intellisense  
**용도**: 파일 경로 자동 완성  
**설치**: `ext install christian-kohler.path-intellisense`

**주요 기능**
- 파일 경로 자동 완성
- 이미지 경로 힌트

### 7. Bracket Pair Colorizer 2

**ID**: CoenraadS.bracket-pair-colorizer-2  
**용도**: 괄호 색상 구분  
**설치**: `ext install CoenraadS.bracket-pair-colorizer-2`

**참고**: VS Code 1.60+ 버전에서는 내장 기능으로 대체됨

### 8. Error Lens

**ID**: usernamehw.errorlens  
**용도**: 에러/경고 인라인 표시  
**설치**: `ext install usernamehw.errorlens`

**주요 기능**
- 코드 라인에 에러 직접 표시
- 실시간 피드백

### 9. Thunder Client

**ID**: rangav.vscode-thunder-client  
**용도**: API 테스트  
**설치**: `ext install rangav.vscode-thunder-client`

**주요 기능**
- VS Code 내에서 API 테스트
- Postman 대안

### 10. Code Spell Checker

**ID**: streetsidesoftware.code-spell-checker  
**용도**: 철자 검사  
**설치**: `ext install streetsidesoftware.code-spell-checker`

**주요 기능**
- 코드 내 철자 검사
- 변수명, 주석 검사

## 2. 언어별 확장 프로그램

### JavaScript/TypeScript

**ES7+ React/Redux/React-Native snippets**
- ID: dsznajder.es7-react-js-snippets
- React 컴포넌트 스니펫

**TypeScript Importer**
- ID: pmneo.tsimporter
- 자동 import 추가

**JavaScript (ES6) code snippets**
- ID: xabikos.JavaScriptSnippets
- ES6 스니펫

### Python

**Python**
- ID: ms-python.python
- 공식 Python 확장

**Pylance**
- ID: ms-python.vscode-pylance
- Python 언어 서버

### Java

**Extension Pack for Java**
- ID: vscjava.vscode-java-pack
- Java 개발 필수 패키지

## 3. 테마 및 UI

### Dark Theme

**One Dark Pro**
- ID: zhuangtongfa.Material-theme
- 인기 다크 테마

**Dracula Official**
- ID: dracula-theme.theme-dracula
- Dracula 테마

### 아이콘

**Material Icon Theme**
- ID: PKief.material-icon-theme
- 파일 아이콘 테마

**vscode-icons**
- ID: vscode-icons-team.vscode-icons
- 다양한 아이콘

## 4. 생산성 확장 프로그램

### 코드 편집

**Multi-cursor**
- 내장 기능 사용
- Alt + Click으로 다중 커서

**Auto Close Tag**
- ID: formulahendry.auto-close-tag
- 태그 자동 닫기

**Indent Rainbow**
- ID: oderwat.indent-rainbow
- 들여쓰기 색상 구분

### 검색 및 탐색

**Todo Tree**
- ID: Gruntfuggly.todo-tree
- TODO 주석 모음

**Bookmarks**
- ID: alefragnani.Bookmarks
- 코드 북마크

**Better Comments**
- ID: aaron-bond.better-comments
- 주석 강조 표시

## 5. 디버깅 및 테스트

### 디버깅

**Debugger for Chrome**
- ID: msjsdiag.debugger-for-chrome
- Chrome 디버깅

**REST Client**
- ID: humao.rest-client
- HTTP 요청 테스트

### 테스트

**Jest**
- ID: Orta.vscode-jest
- Jest 테스트 실행

## 6. Git 관련

### Git 확장

**Git Graph**
- ID: mhutchie.git-graph
- Git 그래프 시각화

**Git History**
- ID: donjayamanne.githistory
- 파일/라인 히스토리

**GitHub Pull Requests**
- ID: GitHub.vscode-pull-request-github
- GitHub PR 관리

## 7. 프레임워크별 확장

### React

**ES7+ React/Redux/React-Native snippets**
- React 컴포넌트 스니펫

**vscode-styled-components**
- ID: styled-components.vscode-styled-components
- styled-components 문법 강조

### Vue

**Vetur**
- ID: octref.vetur
- Vue 지원 (Vue 2)

**Volar**
- ID: Vue.volar
- Vue 3 지원

### Angular

**Angular Language Service**
- ID: Angular.ng-template
- Angular 지원

## 8. 데이터베이스

### 데이터베이스 확장

**SQLTools**
- ID: mtxr.sqltools
- 데이터베이스 클라이언트

**MongoDB for VS Code**
- ID: mongodb.mongodb-vscode
- MongoDB 지원

## 9. 설정 및 추천

### 추천 설정

**settings.json 예시**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000
}
```

### 확장 프로그램 관리

**확장 프로그램 정리**
- 사용하지 않는 확장 제거
- 정기적인 업데이트
- 성능 모니터링

## 10. 실무 활용 팁

### 확장 프로그램 조합

**프론트엔드 개발자**
- ESLint + Prettier
- Auto Rename Tag
- Live Server
- GitLens

**백엔드 개발자**
- REST Client
- SQLTools
- GitLens
- Error Lens

**풀스택 개발자**
- 위 모든 확장
- Thunder Client
- Docker 확장

### 성능 최적화

**성능에 영향을 주는 확장**
- 너무 많은 확장 설치 지양
- 사용하지 않는 확장 비활성화
- 정기적인 확장 정리

## FAQ

**Q: 몇 개의 확장 프로그램을 설치해야 하나요?**  
A: 필요한 것만 설치하는 것이 좋다. 일반적으로 10-20개 정도가 적당하며, 프로젝트에 따라 다르다.

**Q: 확장 프로그램이 VS Code를 느리게 하나요?**  
A: 일부 확장은 성능에 영향을 줄 수 있다. 느려진다면 사용하지 않는 확장을 비활성화하자.

**Q: 모든 확장을 설치해야 하나요?**  
A: 아니요. 프로젝트와 작업 스타일에 맞는 확장만 설치한다. 필요한 것부터 하나씩 추가하는 것을 추천한다.

**Q: 확장 프로그램이 충돌하나요?**  
A: 드물지만 충돌이 발생할 수 있다. 문제가 있다면 확장을 하나씩 비활성화하여 원인을 찾는다.

**Q: 무료 확장만 사용할 수 있나요?**  
A: 대부분의 확장은 무료다. 일부 프리미엄 기능이 있는 확장도 있지만, 기본 기능은 무료로 충분하다.

**Q: 확장 프로그램을 팀과 공유할 수 있나요?**  
A: `.vscode/extensions.json` 파일에 추천 확장을 추가하면 팀원들이 쉽게 설치할 수 있다.

## 개발 환경 구축 후 프로젝트 기회

VS Code 확장 프로그램으로 생산성을 높였다면, 다양한 프로젝트에서 그 역량을 발휘해보자. [블루버튼](https://bluebutton.kr/) 같은 프로젝트 매칭 플랫폼에서 프론트엔드 개발, 백엔드 개발, 풀스택 프로젝트 등 다양한 기회를 찾을 수 있다. 특히 이 글에서 소개한 확장 프로그램들을 활용할 수 있는 프로젝트에서 개발 효율성을 크게 향상시킬 수 있다. ESLint, Prettier, GitLens 같은 도구들이 팀 협업 프로젝트에서 특히 유용하다.

