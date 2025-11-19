import React, { useEffect } from 'react'

/**
 * Google AdSense 광고 컴포넌트
 * @param {string} adSlot - AdSense 광고 슬롯 ID (예: "1234567890")
 * @param {string} adFormat - 광고 형식 (예: "auto", "rectangle", "horizontal", "vertical")
 * @param {boolean} fullWidthResponsive - 전체 너비 반응형 여부
 * @param {string} style - 추가 스타일
 */
const AdSense = ({ 
  adSlot, 
  adFormat = "auto", 
  fullWidthResponsive = true,
  style = {}
}) => {
  useEffect(() => {
    try {
      // AdSense 스크립트가 로드되었는지 확인하고 광고를 표시
      if (typeof window !== 'undefined' && window.adsbygoogle && adSlot) {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [adSlot])

  if (!adSlot) {
    return null
  }

  return (
    <div 
      className="adsense-container"
      style={{
        margin: '20px 0',
        textAlign: 'center',
        minHeight: '100px',
        ...style
      }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          ...(fullWidthResponsive ? {} : { width: '100%', height: '250px' })
        }}
        data-ad-client="ca-pub-9183634176096493"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  )
}

export default AdSense

