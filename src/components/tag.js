import React from "react"
import PropTypes from "prop-types"

const Tag = ({ tags }) => {
  return (
    <ul className="blog-post-tag">
        {tags.map(tag => {
          return (
            <li key={tag}>
              {tag}
            </li>
          )
        })}
    </ul>
  )
}

Tag.defaultProps = {
  tags: [],
}

Tag.propTypes = {
  tags: PropTypes.array,
}

export default Tag