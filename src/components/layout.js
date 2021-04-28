import React from "react"
import { Link } from "gatsby"
import { ThemeToggler } from 'gatsby-plugin-dark-mode'
import Switch from "react-switch";
import { IconContext } from "react-icons";
import { RiSunFill, RiMoonClearFill } from 'react-icons/ri';

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
      <div className="theme">
        <ThemeToggler>
          {({ theme, toggleTheme }) => (
            <div>
            <input
              id="toggle"
              type="checkbox"
              onChange={e => toggleTheme(e.target.checked ? 'dark' : 'light')}
              checked={theme === 'dark'}
            />{' '}
            <label for="toggle">
              {theme === 'dark' 
                ? <RiSunFill />                  
                : <RiMoonClearFill />
              }
            </label>
          </div>
          )}
        </ThemeToggler>
      </div>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://bottlehs.com">Bottlehs</a>     
      </footer>
    </div>
  )
}

export default Layout
