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
import { Link, useParams } from 'react-router-dom'
import { useUnreadChatsContext } from '../Context/UnreadChatsContext'

type ChatRoomsProps = {
  chatRooms: ChatRoom[]
}

const ChatRooms = ({ chatRooms }: ChatRoomsProps) => {
  const [chattersUserInfo, setChattersUserInfo] = useState<CustomUser[]>([])
  const { customUser } = useUserContext()
  const { dictionary } = useDictionaryContext()
  const { unreadChats } = useUnreadChatsContext()
  const { id } = useParams<{ id: string }>()

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
      const chattersIds = chatRooms.map((chatRoom: ChatRoom) => {
        return chatRoom.chatParticipants.filter(
          (participant) => participant.userId !== customUser?.id
        )[0].userId
      })

      const chattersUserInfo = await Promise.all(
        chattersIds.map(async (chatterId) => {
          const response = await apiClient.get(`/users/${chatterId}`)
          if (response.status === 200) {
            return response.data
          }
        })
      )

      setChattersUserInfo(chattersUserInfo || [])
    }

    getChattersUserInfo()
  }, [chatRooms, customUser])

  const isChatInUnreadChats = (chatRoomId: number) => {
    return unreadChats.map((chatId) => parseInt(chatId)).includes(chatRoomId)
  }

  if (chatRooms.length === 0 || chattersUserInfo.length === 0) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    chatRooms.length &&
    chattersUserInfo.length && (
      <div className="ChatRooms">
        <div className="chat-rooms-wrapper">
          <div className="chat-rooms-header">
            <h1>{dictionary.chats}</h1>
          </div>
          <div className="chat-rooms-body">
            {chatRooms.map((chatRoom: ChatRoom, index: number) => {
              return (
                <Link
                  to={`/chat/${chatRoom.id}`}
                  key={chatRoom.id}
                  className={`chat-room ${parseInt(id!) === chatRoom.id ? 'active' : ''}`}
                >
                  <div className="chat-room-user-info">
                    {chattersUserInfo[index].isOnline ? (
                      <UserAvatar
                        src={chattersUserInfo[index].avatar || defaultAvatar}
                        alt={chattersUserInfo[index].firstName || 'Anonymous'}
                        isApproved={false}
                        variant="chat"
                        maxWidth="50px"
                        maxHeight="50px"
                      />
                    ) : (
                      <UserAvatar
                        src={chattersUserInfo[index].avatar || defaultAvatar}
                        alt={chattersUserInfo[index].firstName || 'Anonymous'}
                        isApproved={false}
                        variant="standard"
                        maxWidth="50px"
                        maxHeight="50px"
                      />
                    )}
                    <div className="chat-room-info-name-date">
                      <p
                        className={`chat-room-info-name ${isChatInUnreadChats(chatRooms[index].id) ? 'unread' : ''}`}
                      >
                        {chattersUserInfo[index].firstName}{' '}
                        {chattersUserInfo[index].lastName}
                      </p>
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
  )
}

export default ChatRooms
