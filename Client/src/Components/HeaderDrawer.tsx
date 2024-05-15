import { useState, Fragment, useEffect } from 'react'
import { checkIfUserHasPermission } from '../Auth0/auth0Helpers'
import { useAuth0 } from '@auth0/auth0-react'
import { useDictionaryContext } from '../Context/DictionaryContext'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListIcon from '@mui/icons-material/List'
import GroupsIcon from '@mui/icons-material/Groups'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import burgerIcon from '../Assets/burger.svg'
import { Link } from 'react-router-dom'
import '../style/scss/components/HeaderDrawer.scss'

type Anchor = 'top' | 'left' | 'bottom' | 'right'

const TemporaryDrawer = () => {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  })

  const { dictionary } = useDictionaryContext()

  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }

      setState({ ...state, [anchor]: open })
    }

  const list = (anchor: Anchor) => (
    <Box
      sx={{
        width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250,
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <Link
          to="/adverts"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText primary={dictionary.adverts} />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <GroupsIcon />
              </ListItemIcon>
              <ListItemText primary={dictionary.aboutUs} />
            </ListItemButton>
          </ListItem>
        </Link>
        {isAdmin && (
          <>
            <Divider />
            <Link to="/admin-panel" style={{ textDecoration: 'none' }}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <AdminPanelSettingsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={dictionary.adminPanel}
                    primaryTypographyProps={{
                      color: 'primary',
                      fontWeight: 'bold',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Link>
          </>
        )}
      </List>
    </Box>
  )

  useEffect(() => {
    if (!isAuthenticated) return

    const checkIfAdmin = async () => {
      const token = await getAccessTokenSilently()
      const isAdmin = checkIfUserHasPermission(token, 'admin')
      setIsAdmin(isAdmin)
    }

    checkIfAdmin()
  }, [getAccessTokenSilently, isAuthenticated])

  return (
    <div className="drawer">
      <Fragment key={'left'}>
        <Button
          onClick={toggleDrawer('left', true)}
          className="header-nav-small-menu-button"
          style={{
            borderRadius: '32px',
            height: '64px',
          }}
        >
          <img
            src={burgerIcon}
            alt="menu"
            style={{
              width: '30px',
              filter:
                'invert(100%) sepia(3%) saturate(7500%) hue-rotate(283deg) brightness(115%) contrast(104%)',
            }}
          />
        </Button>
        <Drawer
          anchor={'left'}
          open={state['left']}
          onClose={toggleDrawer('left', false)}
        >
          {list('left')}
        </Drawer>
      </Fragment>
    </div>
  )
}

export default TemporaryDrawer
