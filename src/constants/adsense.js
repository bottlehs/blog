/**
 * Google AdSense 광고 슬롯 ID 설정
 * 환경변수가 설정되어 있으면 환경변수를 우선 사용하고, 없으면 기본값을 사용합니다.
 */

export const ADSENSE_SLOTS = {
  // 블로그 포스트 상단 광고 (제목 아래)
  TOP: process.env.GATSBY_ADSENSE_SLOT_TOP || "9667595311",
  
  // 블로그 포스트 본문 하단 광고 (공유 버튼 위)
  BOTTOM: process.env.GATSBY_ADSENSE_SLOT_BOTTOM || "1608431450",
  
  // 블로그 포스트 댓글 위 광고
  COMMENT: process.env.GATSBY_ADSENSE_SLOT_COMMENT || "5999102605",
  
  // 메인 페이지 상단 광고
  HOME: process.env.GATSBY_ADSENSE_SLOT_HOME || "9663015447",
  
  // 메인 페이지 하단 광고
  HOME_BOTTOM: process.env.GATSBY_ADSENSE_SLOT_HOME_BOTTOM || "3372939267",
}

