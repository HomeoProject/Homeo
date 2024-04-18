import ChatIcon from '@mui/icons-material/Chat'
import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { checkIfUserHasPermission } from '../Auth0/auth0Helpers'
import { useUserContext } from '../Context/UserContext'
import { Link } from 'react-router-dom'
import '../style/scss/components/ChatButton.scss'
import { Tooltip } from '@mui/material'

const ChatButton = () => {
  const { getAccessTokenSilently } = useAuth0()
  const [isUser, setIsUser] = useState(false)
  const { customUser } = useUserContext()

  useEffect(() => {
    const checkIfUserRole = async () => {
      const token = await getAccessTokenSilently()
      const isUser = checkIfUserHasPermission(token, 'user')
      setIsUser(isUser)
    }

    if (customUser) {
      checkIfUserRole()
    }
  }, [customUser, getAccessTokenSilently])

  if (isUser) {
    return (
      <Tooltip title="Chat">
        <Link to="/chat" className="ChatButton">
          <ChatIcon sx={{ fontSize: '1.9rem' }} />
        </Link>
      </Tooltip>
    )
  }
}

export default ChatButton
