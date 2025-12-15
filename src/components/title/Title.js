import React from "react"
import "./style.css"

const TitleDiv = ({ title, desc, subtitle, subtitle_2, subtitle_3, style }) => {
  return (
    <div className="title-component" style={style}>
      {title && <h1>{title}</h1>}
      {desc && <h2>{desc}</h2>}
      {(subtitle || subtitle_2 || subtitle_3) && (
        <div>
          {subtitle && <p>{subtitle}</p>}
          {subtitle_2 && <p>{subtitle_2}</p>}
          {subtitle_3 && <p>{subtitle_3}</p>}
        </div>
      )}
    </div>
  )
}

export default TitleDiv
