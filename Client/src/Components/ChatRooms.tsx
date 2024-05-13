import { useCallback, useEffect, useRef, useState } from 'react'
import { ChatRoom, CustomUser, FullChatRoomInfo } from '../types/types'
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
  setParentChatRooms: React.Dispatch<React.SetStateAction<ChatRoom[]>>
}

const ChatRooms = ({ chatRooms, setParentChatRooms }: ChatRoomsProps) => {
  const [fullChatRooms, setFullChatRooms] = useState<FullChatRoomInfo[]>([])
  const [lastChatRoomMessageCreatedAt, setLastChatRoomMessageCreatedAt] =
    useState<string>(
      DateTime.fromISO(
        chatRooms[chatRooms.length - 1].lastMessageCreatedAt
      ).toString()
    )
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const { customUser } = useUserContext()
  const { dictionary } = useDictionaryContext()
  const { unreadChats, setUnreadChats } = useUnreadChatsContext()
  const { id } = useParams<{ id: string }>()
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const chatRoomsRef = useRef<HTMLDivElement>(null)
  const observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fetchMoreChatRooms = useCallback(() => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current)
    }

    fetchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await apiClient.get(`/chat/rooms`, {
          params: {
            lastMessageCreatedAt: lastChatRoomMessageCreatedAt,
          },
        })

        const newChatRooms = response.data.filter((newChatRoom: ChatRoom) => {
          return !fullChatRooms
            .map((fullChatRoom) => fullChatRoom.chatRoom.id)
            .includes(newChatRoom.id)
        })

        if (newChatRooms.length) {
          const newFullChatRooms = await Promise.all(
            newChatRooms.map(async (newChatRoom: ChatRoom) => {
              const newChatterId = newChatRoom.chatParticipants.filter(
                (participant) => participant.userId !== customUser?.id
              )[0].userId

              const response = await apiClient.get(
                `/users/${encodeURI(newChatterId)}`
              )
              return {
                chatRoom: newChatRoom,
                chatter: response.data as CustomUser,
              }
            })
          )

          setParentChatRooms((prev) => [...prev, ...newChatRooms])
          setFullChatRooms((prev) => [...prev, ...newFullChatRooms])
          setLastChatRoomMessageCreatedAt(
            DateTime.fromISO(
              newFullChatRooms[newFullChatRooms.length - 1].chatRoom
                .lastMessageCreatedAt
            ).toString()
          )
        }
      } catch (error) {
        console.error(error)
      }
    }, 100) // Debounce interval (300ms)

    // eslint-disable-next-line
  }, [lastChatRoomMessageCreatedAt, fullChatRooms, setParentChatRooms])

  const setupObserver = useCallback(() => {
    if (observer.current) {
      observer.current.disconnect()
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (firstEntry.isIntersecting) {
          fetchMoreChatRooms()
        }
      },
      {
        root: chatRoomsRef.current,
        rootMargin: '50px',
        threshold: 0.1,
      }
    )

    const sentinel = chatRoomsRef.current?.lastElementChild

    if (sentinel) {
      observer.current.observe(sentinel)
    }
  }, [fetchMoreChatRooms])

  useEffect(() => {
    setupObserver()
  }, [fullChatRooms, setupObserver])

  const formatDate = (dateString: string) => {
    const now = DateTime.now().setLocale(dictionary.code)
    const messageDate = DateTime.fromISO(dateString).setLocale(dictionary.code)
    const diff = now.diff(messageDate, ['days']).days

    if (diff < 1) {
      if (now.diff(messageDate, ['minutes']).minutes < 1) {
        return 'Just now'
      }
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
    const getFullChatRooms = async () => {
      const initialChatRooms = chatRooms.map(async (chatRoom: ChatRoom) => {
        const chatterId = chatRoom.chatParticipants.filter(
          (participant) => participant.userId !== customUser?.id
        )[0].userId

        const newChatter = await apiClient.get(`/users/${encodeURI(chatterId)}`)

        return {
          chatRoom: chatRoom,
          chatter: newChatter.data as CustomUser,
        }
      })

      const resolvedInitialChatRooms = await Promise.all(initialChatRooms)
      setFullChatRooms(resolvedInitialChatRooms)
      setLastChatRoomMessageCreatedAt(
        DateTime.fromISO(
          chatRooms[chatRooms.length - 1].lastMessageCreatedAt
        ).toString()
      )
    }

    getFullChatRooms()
    // eslint-disable-next-line
  }, [chatRooms, customUser])

  const isChatInUnreadChats = (chatRoomId: number) => {
    return unreadChats.map((chatId) => parseInt(chatId)).includes(chatRoomId)
  }

  const markChatAsReadLocally = (chatRoomId: number) => {
    setUnreadChats((prev) => {
      return prev.filter((chatId) => parseInt(chatId) !== chatRoomId)
    })
  }

  if (fullChatRooms.length === 0 && isMobile) {
    return (
      <div className="ChatRooms">
        <div className="loader-wrapper">
          <div className="loader"></div>
        </div>
      </div>
    )
  }

  if (fullChatRooms.length === 0) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="ChatRooms">
      <div className="chat-rooms-wrapper">
        <div className="chat-rooms-body" ref={chatRoomsRef}>
          {fullChatRooms.map((fullChatRoom: FullChatRoomInfo) => {
            return (
              <Link
                to={`/chat/${fullChatRoom.chatRoom.id}`}
                key={fullChatRoom.chatRoom.id}
                className={`chat-room ${parseInt(id!) === fullChatRoom.chatRoom.id ? 'active' : ''}`}
                onClick={() => markChatAsReadLocally(fullChatRoom.chatRoom.id)}
              >
                <div className="chat-room-user-info">
                  <UserAvatar
                    src={fullChatRoom.chatter.avatar || defaultAvatar}
                    alt={fullChatRoom.chatter.firstName || 'Anonymous'}
                    isApproved={false}
                    variant={
                      fullChatRoom.chatter.isOnline ? 'chat' : 'standard'
                    }
                    maxWidth={isMobile ? '35px' : '50px'}
                    maxHeight={isMobile ? '35px' : '50px'}
                  />
                  <div className="chat-room-info-name-date">
                    <p
                      className={`chat-room-info-name ${isChatInUnreadChats(fullChatRoom.chatRoom.id) ? 'unread' : ''}`}
                    >
                      {fullChatRoom.chatter.firstName}{' '}
                      {fullChatRoom.chatter.lastName}
                    </p>
                    <p className="chat-room-info-date">
                      {formatDate(fullChatRoom.chatRoom.lastMessageCreatedAt)}
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
