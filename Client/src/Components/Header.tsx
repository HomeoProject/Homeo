import '../Style/scss/Header.scss'
import HeaderDrawer from './HeaderDrawer'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AccountMenu from './AccountMenu'
import { useAuth0 } from '@auth0/auth0-react'
import LoginButton from './LoginButton'
import homeIcon from '../Assets/icon-cut.png'

const Header = () => {
  const { isAuthenticated } = useAuth0()

  const [logoClass, setLogoClass] = useState('')
  const [screenSize, setScreenSize] = useState('')
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const breakpoint: number = 800
  const breakpointLogo: number = 500

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    if (screenWidth < breakpoint) {
      setScreenSize('small')
    } else {
      setScreenSize('normal')
    }

    if (screenWidth < breakpointLogo) {
      setLogoClass('small')
    } else {
      setLogoClass('normal')
    }
  }, [screenWidth])

  return (
    <div className="Header">
      <div className="header-main">
        <Link className={`header-logo-${logoClass}`} to="/">
          <img src={homeIcon} alt="logo" />
          Homeo
        </Link>
        {screenSize === 'normal' ? (
          <div className="header-nav-normal">
            <div className="header-nav-normal-right">
              <Link className="header-nav-normal-right-link" to="/adverts">
                {'Adverts'}
              </Link>
              <Link className="header-nav-normal-right-link" to="/about">
                {'About Us'}
              </Link>
              <Link className="header-nav-normal-right-link" to="/contact">
                {'Contact'}
              </Link>
            </div>
            <div className="header-nav-user-wrapper">
              {!isAuthenticated ? <LoginButton /> : <AccountMenu />}
            </div>
          </div>
        ) : (
          <div className="header-nav-small">
            <HeaderDrawer />
            <div className="header-nav-user-wrapper">
              {!isAuthenticated ? <LoginButton /> : <AccountMenu />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Header
