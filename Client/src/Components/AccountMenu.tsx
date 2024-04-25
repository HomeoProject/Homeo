import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import EngineeringIcon from '@mui/icons-material/Engineering'
import Logout from '@mui/icons-material/Logout'
import { useAuth0 } from '@auth0/auth0-react'
import Skeleton from '@mui/material/Skeleton'
import { useUserContext } from '../Context/UserContext'
import defaultAvatar from '../Assets/default-avatar.jpg'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useConstructorContext } from '../Context/ConstructorContext'
import { useDictionaryContext } from '../Context/DictionaryContext'
import { Link } from 'react-router-dom'
import chatClient from '../WebSockets/ChatClient'

const AccountMenu = () => {
  const { logout, isLoading } = useAuth0()

  const { customUser } = useUserContext()

  const { constructor } = useConstructorContext()

  const { dictionary } = useDictionaryContext()

  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    setAnchorEl(null)
    chatClient.disconnect()
    logout()
  }

  const handleUserRedirect = () => {
    setAnchorEl(null)
    navigate(`/user/${customUser?.id}`)
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2, margin: '0' }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            {isLoading ? (
              <Skeleton variant="circular">
                <Avatar
                  src={customUser ? customUser.avatar : defaultAvatar}
                  sx={{ width: 40, height: 40 }}
                />
              </Skeleton>
            ) : (
              <Avatar
                sx={{ width: 40, height: 40 }}
                src={customUser ? customUser.avatar : defaultAvatar}
                alt={customUser?.email}
              />
            )}
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
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
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 25,
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
        <MenuItem onClick={handleUserRedirect}>
          <Avatar
            alt={customUser?.email}
            src={customUser ? customUser.avatar : defaultAvatar}
          />{' '}
          {dictionary.profileSettings}
        </MenuItem>
        <Divider />
        {constructor && (
          <Link
            to={`/constructor/${constructor.userId}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <EngineeringIcon fontSize="small" />
              </ListItemIcon>
              {dictionary.constructorProfile}
            </MenuItem>
          </Link>
        )}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {dictionary.logoutWord}
        </MenuItem>
      </Menu>
    </>
  )
}

export default AccountMenu
