import { useEffect, useState } from 'react'
import { ChatRoom, CustomUser } from '../types/types'
import apiClient from '../AxiosClients/apiClient'
import UserAvatar from './UserAvatar'
import defaultAvatar from '../Assets/default-avatar.svg'
import { useUserContext } from '../Context/UserContext'
import LoadingSpinner from './LoadingSpinner'
import '../style/scss/components/ChatRooms.scss'
import { DateTime } from 'luxon'
import { useDictionaryContext } from '../Context/DictionaryContext'
import { Link } from 'react-router-dom'

type ChatRoomsProps = {
  chatRooms: ChatRoom[] | null
}

const ChatRooms = ({ chatRooms }: ChatRoomsProps) => {
  const [chattersUserInfo, setChattersUserInfo] = useState<CustomUser[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [noChatsYet, setNoChatsYet] = useState<boolean>(false)
  const { customUser } = useUserContext()
  const { dictionary } = useDictionaryContext()

  const formatDate = (dateString: string) => {
    const now = DateTime.now().setLocale(dictionary.code)
    const messageDate = DateTime.fromISO(dateString).setLocale(dictionary.code)
    const diff = now.diff(messageDate, ['days']).days

    if (diff < 1) {
      return messageDate.toRelative({ locale: dictionary.code }) // "3 hours ago", "25 minutes ago"
    } else if (diff < 2) {
      return 'Yesterday'
    } else if (diff < 7) {
      return `${Math.floor(diff)} days ago`
    } else if (diff < 14) {
      return '1 week ago'
    } else if (diff < 21) {
      return '2 weeks ago'
    } else if (diff < 28) {
      return '3 weeks ago'
    } else {
      const monthsDiff = now.diff(messageDate, 'months').months
      if (monthsDiff < 12) {
        return `${Math.floor(monthsDiff)} month${Math.floor(monthsDiff) > 1 ? 's' : ''} ago`
      } else {
        const yearsDiff = now.diff(messageDate, 'years').years
        return `${Math.floor(yearsDiff)} year${Math.floor(yearsDiff) > 1 ? 's' : ''} ago`
      }
    }
  }

  useEffect(() => {
    const getChattersUserInfo = async () => {
      setIsLoading(true)
      if (chatRooms === null) {
        setNoChatsYet(true)
        return
      } else {
        setNoChatsYet(false)
      }

      const chattersIds = chatRooms.map((chatRoom: ChatRoom) => {
        return chatRoom.chatParticipants.filter(
          (participant) => participant.userId !== customUser?.id
        )[0].userId
      })

      const chattersUserInfo = await Promise.all(
        chattersIds.map(async (chatterId) => {
          const response = await apiClient.get(`/users/${encodeURI(chatterId)}`)
          if (response.status === 200) {
            return response.data
          }
        })
      )

      setChattersUserInfo(chattersUserInfo || [])
      setIsLoading(false)
    }

    getChattersUserInfo()
  }, [chatRooms, customUser])

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    )
  }

  if (!isLoading && noChatsYet) {
    return (
      <div className="ChatRooms">
        <div className="chat-rooms-wrapper">
          <div className="chat-rooms-left">
            <div className="chat-rooms-left-header">
              <h2>Chats</h2>
            </div>
            <div className="chat-rooms-left-body">
              <p>No chats yet</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!chatRooms) {
    return (
      <div className="ChatRooms">
        <div className="chat-rooms-wrapper">
          <div className="chat-rooms-left">
            <div className="chat-rooms-left-header">
              <h2>Chats</h2>
            </div>
            <div className="chat-rooms-left-body">
              <p>Something went wrong</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="ChatRooms">
      <div className="chat-rooms-wrapper">
        <h1 className="chat-rooms-header">{dictionary.chats}</h1>
        <div className="chat-rooms-body">
          {chatRooms.map((chatRoom: ChatRoom, index: number) => {
            return (
              <Link
                to={encodeURI(chattersUserInfo[index].id)}
                key={chatRoom.id}
                className="chat-room"
              >
                <div className="chat-room-user-info">
                  {chattersUserInfo[index].isOnline ? (
                    <UserAvatar
                      src={chattersUserInfo[index].avatar || defaultAvatar}
                      alt={chattersUserInfo[index].firstName!}
                      isApproved={chattersUserInfo[index].isApproved}
                      variant="chat"
                      viewHref={`/user/${chattersUserInfo[index].id}`}
                      maxWidth="50px"
                      maxHeight="50px"
                    />
                  ) : (
                    <UserAvatar
                      src={chattersUserInfo[index].avatar || defaultAvatar}
                      alt={chattersUserInfo[index].firstName!}
                      isApproved={chattersUserInfo[index].isApproved}
                      variant="standard"
                      viewHref={`/user/${chattersUserInfo[index].id}`}
                      maxWidth="50px"
                      maxHeight="50px"
                    />
                  )}
                  <div className="chat-room-info-name-date">
                    <b className="chat-room-info-name">
                      {chattersUserInfo[index].firstName}{' '}
                      {chattersUserInfo[index].lastName}
                    </b>
                    <p className="chat-room-info-date">
                      {formatDate(chatRoom.lastMessageCreatedAt)}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ChatRooms
