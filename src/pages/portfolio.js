import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Bio from "../components/bio"
import "./portfolio.css"

const PortfolioPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`

  const featuredProjects = [
    {
      image: "/images/work-rezn105.png",
      alt: "두산 리즌 이미지",
    },
    {
      image: "/images/work-ceragem.png",
      alt: "세라젬 이미지",
    },
    {
      image: "/images/work착.png",
      alt: "한국조폐공사 착 이미지",
    },
    {
      image: "/images/work키키야.png",
      alt: "키키야샥스 이미지",
    },
    {
      image: "/images/work땡겨요.png",
      alt: "신한은행 땡겨요 이미지",
    },
  ]

  const projectList = [
    "해라몰 쇼핑몰 구축",
    "쁘띠팰리스 쇼핑몰 구축",
    "대성학력개발연구소 D:VOCA 출제마법사 구축",
    "대성학력개발연구소 온라인 모의고사 구축",
    "큐링 S-Ground 구축",
    "코오롱 티슈진 더블유스토어 구축",
    "대성학력개발연구소 쇼핑몰 통합 구축",
    "SPK 온라인 통합 사이트 구축",
    "株式会社ブライタス 라쿠스 쇼핑몰 일원관리 플랫폼개발",
    "SRT 예매 시스템 모바일 웹 구축",
    "삼성화재 상담통 태블릿 서비스 구축",
    "모빈스 보험 플랫폼 구축",
    "KLAP4U Learn EPS-TOPIK with AI 구축",
    "빌리온굿케어 붤큰몰 구축",
    "트래블러너 캐나다 워킹홀리데이 커뮤니티 APP 구축",
    "휴먼인사이드 심리상담 웹 개발",
    "B2B 마케팅 솔루션",
    "한국사 문제풀이 앱 쌤에듀테이먼트",
    "티니와일드 수학놀이 모바일 앱 구축",
    "이러닝 한국어 교육자 학습센터 웹 구축",
    "인플루언서 매칭 & 쇼핑 플랫폼 인플리 구축",
    "남성 의류 쇼핑몰 맵씨 모바일 웹 구축",
    "비대면 스탬프투어 플랫폼 스탬프 팝 서비스",
    "음성 UI 플랫폼 튜브S 모바일 앱 구축",
    "한양대학교 병원 스마트 글래스 관리 앱",
    "반려견 IOS 관리 앱",
    "현대자동차 모터쇼 사이버전시 공식 웹 구축",
    "신도테크노 공식 쇼핑몰 오피스바이 웹 구축",
    "노키아 X6 프로모션 공식 웹 구축",
    "THE-K HOTEL 공식 웹 구축",
    "소셜오디오 플랫폼 TINCAN 웹 구축",
    "아다스원 공식 웹 구축",
    "현대카드 · 캐피탈 커머셜 개발 센터 Offisite 비대면 개발",
    "스포츠 토토 Back-Office 개발",
    "금호타이어 Web Pos 개발",
    "2018 평창 동계 올림픽 증강현실 콘텐츠 전시 개발",
    "로보어드바이저 시스템 구축",
    "물류운송 추척 및 결제 시스템 개발",
    "실시간 증권정보 및 증권강의 시스템 개발",
    "클라우드를 활용한 매입 발주서 취합 프로그램 개발",
    "부동산 매물등록 및 전자결제 시스템 개발",
    "GPS를 활용한 맛집·부동산·관광지 소재 APP 개발",
    "NFC, Android Sensor 기술을 활용한 Health Care System",
  ]

  return (
    <Layout location={location} title={siteTitle}>
      <SEO 
        title="포트폴리오"
        description="쇼핑몰, 홈페이지, 웹사이트제작, 반응형 홈페이지, 앱개발, react, angular로 개발한 프로젝트 등 성공적으로 런칭한 포트폴리오입니다."
        keywords="프로젝트, 포트폴리오, 사업, 쇼핑몰제작, 홈페이지제작업체, 웹사이트제작, 반응형 홈페이지, 앱개발, React, Spring, SI, AI챗봇, 유지보수, 쇼핑몰통합솔루션, NHN 커머스, 프레임워크"
      />
      <Bio />
      <article className="portfolio-article">
        <header>
          <h1>포트폴리오</h1>
          <p>다년간의 경험을 통해 새로운 과감한 기술 도입은 물론, 지속적인 성공을 통해 최고의 만족을 이끌어 냅니다. 다양한 SI 구축 사업은 물론 커머스, 챗봇, AI까지 끊임없는 도전을 하고 있습니다.</p>
        </header>
        
        <section className="portfolio-featured">
          <h2>주요 프로젝트</h2>
          <div className="portfolio-images">
            {featuredProjects.map((project, index) => (
              <div key={index} className="portfolio-image-wrapper">
                <img
                  src={project.image}
                  alt={project.alt}
                  className="portfolio-image"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="portfolio-list">
          <h2>프로젝트 목록</h2>
          <ul className="portfolio-project-list">
            {projectList.map((project, index) => (
              <li key={index}>{project}</li>
            ))}
          </ul>
        </section>
      </article>
    </Layout>
  )
}

export default PortfolioPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
