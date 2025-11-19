# Google AdSense 설정 가이드

이 블로그에 구글 AdSense 광고가 배치되어 있습니다. 광고를 활성화하려면 다음 단계를 따라주세요.

## 1. Google AdSense 계정 설정

1. [Google AdSense](https://www.google.com/adsense)에 접속하여 계정을 생성하세요.
2. 사이트를 등록하고 승인을 받으세요.
3. 광고 단위를 생성하세요.

## 2. 광고 슬롯 ID 설정

광고 슬롯 ID는 `src/constants/adsense.js` 파일에 기본값으로 설정되어 있습니다:

- **블로그 포스트 상단**: `9667595311`
- **블로그 포스트 본문 하단**: `1608431450`
- **블로그 포스트 댓글 위**: `5999102605`
- **메인 페이지 상단**: `9663015447`
- **메인 페이지 하단**: `3372939267`

### 환경변수로 오버라이드 (선택사항)

다른 슬롯 ID를 사용하고 싶다면, 프로젝트 루트에 `.env` 파일을 생성하고 환경변수를 설정할 수 있습니다:

```bash
# 블로그 포스트 상단 광고 (제목 아래)
GATSBY_ADSENSE_SLOT_TOP=9667595311

# 블로그 포스트 본문 하단 광고 (공유 버튼 위)
GATSBY_ADSENSE_SLOT_BOTTOM=1608431450

# 블로그 포스트 댓글 위 광고
GATSBY_ADSENSE_SLOT_COMMENT=5999102605

# 메인 페이지 상단 광고
GATSBY_ADSENSE_SLOT_HOME=9663015447

# 메인 페이지 하단 광고
GATSBY_ADSENSE_SLOT_HOME_BOTTOM=3372939267
```

**참고:** 
- 환경변수가 설정되어 있으면 환경변수 값을 우선 사용합니다.
- 환경변수가 없으면 `src/constants/adsense.js`의 기본값을 사용합니다.
- 각 위치마다 다른 광고 단위를 생성하는 것을 권장합니다.

## 3. 광고 배치 위치

### 블로그 포스트 페이지
- **상단 광고**: 포스트 제목과 날짜 아래
- **본문 하단 광고**: 본문 내용과 공유 버튼 사이
- **댓글 위 광고**: 댓글 섹션 바로 위

### 메인 페이지
- **상단 광고**: Bio 컴포넌트 아래, 카테고리 필터 위
- **하단 광고**: 포스트 리스트 아래

## 4. 빌드 및 배포

환경변수를 설정한 후:

```bash
# 개발 서버 실행
npm run develop

# 프로덕션 빌드
npm run build
```

## 5. 확인 사항

- `gatsby-config.js`에 `gatsby-plugin-google-adsense` 플러그인이 설정되어 있는지 확인하세요.
- Publisher ID (`ca-pub-9183634176096493`)가 올바른지 확인하세요.
- `static/ads.txt` 파일이 올바르게 설정되어 있는지 확인하세요.

## 문제 해결

- 광고가 표시되지 않으면:
  1. AdSense 계정이 승인되었는지 확인
  2. 환경변수가 올바르게 설정되었는지 확인
  3. 브라우저 콘솔에서 오류 메시지 확인
  4. AdSense 정책을 준수하는지 확인

## 참고 자료

- [Google AdSense 도움말](https://support.google.com/adsense)
- [Gatsby AdSense 플러그인](https://www.gatsbyjs.com/plugins/gatsby-plugin-google-adsense/)

