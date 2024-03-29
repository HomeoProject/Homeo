import {useState} from 'react'
import '../Style/scss/Header.scss'
import HeaderDrawer from './HeaderDrawer'
import PublicIcon from '@mui/icons-material/Public';
import { Link } from 'react-router-dom'
import AccountMenu from './AccountMenu'
import { useAuth0 } from '@auth0/auth0-react'
import { useDictionaryContext } from '../Context/DictionaryContext'
import LoginButton from './LoginButton'
import homeIcon from '../Assets/icon-cut.png'
import AdminPanelLink from './AdminPanelLink'
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { english, polish } from '../Data/dictionary';

const Header = () => {
  const { isAuthenticated } = useAuth0()
  const { dictionary, setDictionary } = useDictionaryContext()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e.currentTarget.dataset.myValue)
    setDictionary(e.currentTarget.dataset.myValue === 'polish' ? polish : english);
    setAnchorEl(null);
  };

  return (
    <div className="Header">
      <div className="header-main">
        <Link className="header-logo" to="/">
          <img src={homeIcon} alt="logo" />
          Homeo
        </Link>
        <div className="header-nav-normal">
          <div className="header-nav-normal-right">
            <Link className="header-nav-normal-right-link" to="/adverts">
              {dictionary.advertsWord}
            </Link>
            <Link className="header-nav-normal-right-link" to="/about">
              {dictionary.aboutUs}
            </Link>
            <AdminPanelLink />
          </div>
          <div className="header-nav-user-wrapper">
            {!isAuthenticated ? <LoginButton /> : <AccountMenu />}
          </div>
          <Tooltip title="Language">
            <IconButton 
              onClick={handleClick}
              size="small"
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              >
              <PublicIcon 
                fontSize='large' 
                sx={{color: '#fafafa'}}
              />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            disableScrollLock={true}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
        <MenuItem 
          onClick={handleClose}
          data-my-value="polish"
          >
           Polish
        </MenuItem>
        <MenuItem 
          onClick={handleClose}
          data-my-value="english"
          >
           English
        </MenuItem>
      </Menu>
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
