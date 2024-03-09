import '../Style/scss/Header.scss'
import HeaderDrawer from './HeaderDrawer'
import { Link } from 'react-router-dom'
import AccountMenu from './AccountMenu'
import { useAuth0 } from '@auth0/auth0-react'
import LoginButton from './LoginButton'
import homeIcon from '../Assets/icon-cut.png'
import AdminPanelLink from './AdminPanelLink'

const Header = () => {
    const { isAuthenticated } = useAuth0()

    return (
        <div className="Header">
            <div className="header-main">
                <Link className="header-logo" to="/">
                    <img src={homeIcon} alt="logo" />
                    Homeo
                </Link>
                <div className="header-nav-normal">
                    <div className="header-nav-normal-right">
                        <Link
                            className="header-nav-normal-right-link"
                            to="/adverts"
                        >
                            {'Adverts'}
                        </Link>
                        <Link
                            className="header-nav-normal-right-link"
                            to="/about"
                        >
                            {'About Us'}
                        </Link>
                        <AdminPanelLink />
                    </div>
                    <div className="header-nav-user-wrapper">
                        {!isAuthenticated ? <LoginButton /> : <AccountMenu />}
                    </div>
                </div>
                <div className="header-nav-small">
                    <HeaderDrawer />
                    <div className="header-nav-user-wrapper">
                        {!isAuthenticated ? <LoginButton /> : <AccountMenu />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
