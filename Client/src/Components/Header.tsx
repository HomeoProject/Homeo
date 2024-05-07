import { useEffect, useState } from 'react'
import '../Style/scss/Header.scss'
import HeaderDrawer from './HeaderDrawer'
import PublicIcon from '@mui/icons-material/Public'
import { Link, useLocation } from 'react-router-dom'
import AccountMenu from './AccountMenu'
import { useAuth0 } from '@auth0/auth0-react'
import { useDictionaryContext } from '../Context/DictionaryContext'
import LoginButton from './LoginButton'
import homeIcon from '../Assets/icon-cut.png'
import AdminPanelLink from './AdminPanelLink'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { english, polish } from '../Data/dictionary'
import { GB, PL } from 'country-flag-icons/react/3x2'
import ChatButton from './ChatButton'
import chatClient from '../WebSockets/ChatClient'
import { IMessage } from '@stomp/stompjs'
import Badge from '@mui/material/Badge'
import { useUnreadChatsContext } from '../Context/UnreadChatsContext'

const Header = () => {
  const { isAuthenticated } = useAuth0()
  const { dictionary, setDictionary } = useDictionaryContext()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { unreadChats, setUnreadChats } = useUnreadChatsContext()
  const location = useLocation()
  const open = Boolean(anchorEl)
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleLanguageSelect = (e: React.MouseEvent<HTMLElement>) => {
    setDictionary(
      e.currentTarget.dataset.myValue === 'polish' ? polish : english
    )
    handleClose()
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    const excludedPaths = ['/chat']

    let isUnsubscribed = false

    const updateNotifications = (message: IMessage) => {
      console.log('Updating notifications', JSON.parse(message.body))
      const chatRoomId = JSON.parse(message.body).chatRoom.id
      setUnreadChats((prev) => {
        if (!prev.includes(chatRoomId)) {
          return [...prev, chatRoomId]
        }
        return prev
      })
    }

    for (const path of excludedPaths) {
      if (location.pathname.includes(path)) {
        console.log('Unsubscribing from global chat notifications')
        chatClient.unsubscribeGlobalChatNotifications()
        isUnsubscribed = true
        break
      }
    }

    if (!isUnsubscribed) {
      console.log('Subscribing to global chat notifications')
      chatClient.subscribeGlobalChatNotifications(updateNotifications)
    }
    // eslint-disable-next-line
  }, [location])

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
              {dictionary.adverts}
            </Link>
            <Link className="header-nav-normal-right-link" to="/about">
              {dictionary.aboutUs}
            </Link>
            <AdminPanelLink />
          </div>
          <Tooltip title="Language">
            <IconButton
              onClick={handleClick}
              size="small"
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <PublicIcon fontSize="large" sx={{ color: '#fafafa' }} />
            </IconButton>
          </Tooltip>
          {unreadChats.length ? (
            <Badge
              badgeContent={unreadChats.length}
              color="primary"
              anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
              <ChatButton />
            </Badge>
          ) : (
            <ChatButton />
          )}
          <div className="header-nav-user-wrapper">
            {!isAuthenticated ? <LoginButton /> : <AccountMenu />}
          </div>
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
                backgroundColor: '#e5e5e5fa',
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
                  bgcolor: '#e5e5e5fa',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleLanguageSelect} data-my-value="polish">
              <div style={{ display: 'flex', gap: '10px' }}>
                Polski
                <PL width={'20px'} />
              </div>
            </MenuItem>
            <MenuItem onClick={handleLanguageSelect} data-my-value="english">
              <div style={{ display: 'flex', gap: '10px' }}>
                English
                <GB width={'20px'} />
              </div>
            </MenuItem>
          </Menu>
        </div>
        <div className="header-nav-small">
          <HeaderDrawer />
          {unreadChats.length ? (
            <Badge
              badgeContent={unreadChats.length}
              color="primary"
              anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
              <ChatButton />
            </Badge>
          ) : (
            <ChatButton />
          )}
          <Tooltip title="Language">
            <IconButton
              onClick={handleClick}
              size="small"
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <PublicIcon fontSize="large" sx={{ color: '#fafafa' }} />
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
                backgroundColor: '#e5e5e5fa',
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
                  bgcolor: '#e5e5e5fa',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleLanguageSelect} data-my-value="polish">
              <div style={{ display: 'flex', gap: '10px' }}>
                Polski
                <PL width={'20px'} />
              </div>
            </MenuItem>
            <MenuItem onClick={handleLanguageSelect} data-my-value="english">
              <div style={{ display: 'flex', gap: '10px' }}>
                English
                <GB width={'20px'} />
              </div>
            </MenuItem>
          </Menu>
          <div className="header-nav-user-wrapper">
            {!isAuthenticated ? <LoginButton /> : <AccountMenu />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
