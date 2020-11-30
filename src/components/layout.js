import React from "react"
import { Link } from "gatsby"
import { ThemeToggler } from 'gatsby-plugin-dark-mode'
import Switch from "react-switch";
import { RiSunLine, RiMoonClearLine } from 'react-icons/ri';

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/" title={title}>{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/" title={title}>
        {title}
      </Link>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.bottlehs.com">Bottlehs</a>
        <ThemeToggler>
        {({ theme, toggleTheme }) => (
          <Switch 
            onChange={e => toggleTheme(theme === 'dark' ? 'light' : 'dark')} 
            checked={theme === 'dark'}
            uncheckedIcon={
              <RiSunLine />
            }
            checkedIcon={
              <RiMoonClearLine />
            }
            />
        )}
      </ThemeToggler>        
      </footer>
    </div>
  )
}

export default Layout
