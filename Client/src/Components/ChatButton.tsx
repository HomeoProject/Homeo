import ChatIcon from '@mui/icons-material/Chat'
import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { checkIfUserHasPermission } from '../Auth0/auth0Helpers'
import { useUserContext } from '../Context/UserContext'
import { Link } from 'react-router-dom'
import '../style/scss/components/ChatButton.scss'
import { Tooltip } from '@mui/material'
import apiClient from '../AxiosClients/apiClient'

const ChatButton = () => {
  const { getAccessTokenSilently } = useAuth0()
  const [isUser, setIsUser] = useState(false)
  const [chatLink, setChatLink] = useState<string>('/chat')
  const { customUser } = useUserContext()

  useEffect(() => {
    const checkIfUserRole = async () => {
      const token = await getAccessTokenSilently()
      const isUser = checkIfUserHasPermission(token, 'user')
      setIsUser(isUser)
      return isUser
    }

    const generateChatLink = () => {
      apiClient
        .get('/chat/rooms', {
          params: {
            lastMessageCreatedAt: new Date().toISOString(),
          },
        })
        .then((response) => {
          const chatRoomId = response.data[0].id

          if (chatRoomId) {
            setChatLink(`/chat/${chatRoomId}`)
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }

    if (customUser) {
      checkIfUserRole().then((isUser) => {
        if (isUser) {
          generateChatLink()
        }
      })
    }
  }, [customUser, getAccessTokenSilently])

  if (isUser) {
    return (
      <Tooltip title="Chat">
        <Link to={chatLink} className="ChatButton">
          <ChatIcon sx={{ fontSize: '1.9rem' }} />
        </Link>
      </Tooltip>
    )
  }
}

export default ChatButton
