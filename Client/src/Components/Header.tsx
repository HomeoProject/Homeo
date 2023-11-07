import '../Style/scss/Header.scss'
import HeaderDrawer from './HeaderDrawer'
import { useState, useEffect } from 'react'
import Link from '@mui/material/Link'
import logo from '../Assets/logo.png'
import logoSmall from '../Assets/logoSmall.png'
import AccountMenu from './AccountMenu'
import { useAuth0 } from '@auth0/auth0-react'
import LoginButton from './LoginButton'

const Header = () => {
    const { isAuthenticated } = useAuth0()

    console.log(isAuthenticated)

    const [logoIcon, setLogoIcon] = useState(logo)
    const [logoClass, setLogoClass] = useState('')
    const [screenSize, setScreenSize] = useState('')
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)
    const breakpoint = 800
    const breakpointLogo = 500
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
        if (screenWidth < breakpoint) {
            setScreenSize('small')
        } else {
            setScreenSize('normal')
        }

        if (screenWidth < breakpointLogo) {
            setLogoIcon(logoSmall)
            setLogoClass('small')
        } else {
            setLogoIcon(logo)
            setLogoClass('normal')
        }
    }, [screenWidth])

    return (
        <div className="Header">
            <a className={`header-logo-${logoClass}`} href="/">
                <img src={logoIcon} alt="logo" />
            </a>
            {screenSize === 'normal' ? (
                <div className="header-nav-normal">
                    <div className="header-nav-normal-right">
                        <Link href="#" underline="hover" fontSize={'22px'}>
                            {'Adverts'}
                        </Link>
                        <Link href="#" underline="hover" fontSize={'22px'}>
                            {'About Us'}
                        </Link>
                        <Link href="#" underline="hover" fontSize={'22px'}>
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
    )
}

export default Header
