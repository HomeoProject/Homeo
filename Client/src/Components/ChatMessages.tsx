import { useEffect, useState, FormEvent, useRef } from 'react'
import { ChatMessage, ChatRoom } from '../types/types'
import apiClient from '../AxiosClients/apiClient'
import '../style/scss/components/ChatMessages.scss'
import { useUserContext } from '../Context/UserContext'
import chatClient from '../WebSockets/ChatClient'
import SendIcon from '@mui/icons-material/Send'
import { useLocation } from 'react-router'
import { IMessage } from '@stomp/stompjs'
import { useUnreadChatsContext } from '../Context/UnreadChatsContext'
import { DateTime } from 'luxon'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useDictionaryContext } from '../Context/DictionaryContext'

type ChatMessagesProps = {
  chatRoomId: number
}

const ChatMessages = ({ chatRoomId }: ChatMessagesProps) => {
  const [newestChatMessages, setNewestChatMessages] = useState<ChatMessage[]>(
    []
  )
  const [olderChatMessages, setOlderChatMessages] = useState<ChatMessage[]>([])
  const [messageInput, setMessageInput] = useState<string>('')
  const [noMoreMessages, setNoMoreMessages] = useState<boolean>(false)
  const [lastSeenMessageId, setLastSeenMessageId] = useState<number | null>(
    null
  )
  const [lastMessageCreatedAt, setLastMessageCreatedAt] = useState<string>(
    new Date().toISOString()
  )
  const [lastViewedAtDate, setLastViewedAtDate] = useState<string | null>(null)
  const { unreadChats, setUnreadChats } = useUnreadChatsContext()
  const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoom | null>(null)
  const { customUser } = useUserContext()
  const { dictionary } = useDictionaryContext()
  const inputRef = useRef<HTMLInputElement>(null)
  const location = useLocation()
  const chatMessagesContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollToBottom = () => {
      setTimeout(() => {
        if (chatMessagesContentRef.current) {
          chatMessagesContentRef.current.scrollTop =
            chatMessagesContentRef.current.scrollHeight
        }
      }, 0)
    }

    scrollToBottom()
  }, [newestChatMessages])

  useEffect(() => {
    const fetchMoreMessages = async () => {
      if (chatMessagesContentRef.current && !noMoreMessages) {
        const currentScrollPosition = chatMessagesContentRef.current.scrollTop
        const currentScrollHeight = chatMessagesContentRef.current.scrollHeight

        const response = await apiClient.get<ChatMessage[]>(
          `/chat/${chatRoomId}/messages`,
          {
            params: {
              lastCreatedAt: lastMessageCreatedAt,
            },
          }
        )

        if (response.data.length > 0) {
          setLastMessageCreatedAt(
            response.data[response.data.length - 1].createdAt
          )
          setOlderChatMessages((prevMessages) => [
            ...prevMessages,
            ...response.data,
          ])

          setTimeout(() => {
            if (chatMessagesContentRef.current) {
              const newScrollHeight =
                chatMessagesContentRef.current.scrollHeight
              const heightDifference = newScrollHeight - currentScrollHeight
              chatMessagesContentRef.current.scrollTop =
                currentScrollPosition + heightDifference
            }
          }, 0)
        } else {
          setNoMoreMessages(true)
        }
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (firstEntry.isIntersecting) {
          fetchMoreMessages()
        }
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.1,
      }
    )

    const sentinel = chatMessagesContentRef.current?.firstElementChild

    if (sentinel) {
      observer.observe(sentinel)
    }

    return () => observer.disconnect()
    // eslint-disable-next-line
  }, [lastMessageCreatedAt])

  const isMessageMine = (message: ChatMessage) => {
    return message.senderId === customUser?.id
  }

  const markChatAsRead = () => {
    chatClient.sendMessage(
      `/app/mark-as-read/${chatRoomId}`,
      chatRoomId.toString()
    )
  }

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault()
    if (messageInput === '') {
      return
    }

    try {
      chatClient.sendMessage(
        '/app/message',
        JSON.stringify({ content: messageInput, chatRoomId: chatRoomId })
      )

      markChatAsRead()

      setMessageInput('')
      inputRef.current?.focus()
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const getChatRoom = async () => {
      apiClient
        .get<ChatRoom>(`/chat/room/${chatRoomId}`)
        .then((response) => {
          setCurrentChatRoom(response.data)
          return response.data
        })
        .catch((error) => {
          console.error(error)
        })
    }

    const markChatAsReadLocally = (chatRoomId: number) => {
      setUnreadChats((prev) => {
        return prev.filter((chatId) => parseInt(chatId) !== chatRoomId)
      })
    }

    const fetchNewestChatMessages = async () => {
      try {
        apiClient
          .get<ChatMessage[]>(`/chat/${chatRoomId}/messages`, {
            params: {
              lastCreatedAt: new Date().toISOString(),
            },
          })
          .then((response) => {
            setNewestChatMessages(response.data)
            setLastMessageCreatedAt(
              response.data[response.data.length - 1].createdAt
            )
          })
          .catch((error) => {
            console.error(error)
          })
      } catch (error) {
        console.error(error)
      }
    }

    const updateNotifications = (message: IMessage) => {
      const chatRoomId = JSON.parse(message.body).chatRoom.id
      if (!unreadChats.includes(chatRoomId)) {
        setUnreadChats((prev) => [...prev, chatRoomId])
      }
    }

    const subcribeToGlobalChatNotifications = () => {
      chatClient.subscribeGlobalChatNotifications((message: IMessage) => {
        const chatMessage = JSON.parse(message.body)
        if (JSON.parse(message.body).chatRoom.id === chatRoomId) {
          const newMessage = {
            id: chatMessage.id,
            content: chatMessage.content,
            senderId: chatMessage.senderId,
            createdAt: chatMessage.createdAt,
            chatRoomId: chatMessage.chatRoom.id,
            imageUrl: chatMessage.imageUrl,
          }
          setNewestChatMessages((prev) => [newMessage, ...prev])
          markChatAsRead()
        } else {
          updateNotifications(message)
        }
      })
    }

    const unsubscribeFromGlobalChatNotifications = () => {
      chatClient.unsubscribeGlobalChatNotifications()
    }

    const subcribeToChatStatus = () => {
      chatClient.subscribe(`/user/topic/${chatRoomId}`, (message: IMessage) => {
        setCurrentChatRoom(JSON.parse(message.body) as ChatRoom)
      })
    }

    const unsubscribeFromChatStatus = () => {
      chatClient.unsubscribe(`/user/topic/${chatRoomId}`)
    }

    setNewestChatMessages([])
    setOlderChatMessages([])
    setNoMoreMessages(false)
    getChatRoom().then(() => {
      fetchNewestChatMessages()
      markChatAsRead()
      subcribeToChatStatus()
      subcribeToGlobalChatNotifications()
      markChatAsReadLocally(chatRoomId)
    })

    return () => {
      unsubscribeFromChatStatus()
      unsubscribeFromGlobalChatNotifications()
    }

    // eslint-disable-next-line
  }, [chatRoomId, location])

  useEffect(() => {
    const findLastSeenMessageId = () => {
      const lastViewedAt = currentChatRoom?.chatParticipants.find(
        (participant) => participant.userId !== customUser?.id
      )?.lastViewedAt

      // use luxon to parse the date with correct timezone
      let convertedLastViewedAt
      if (!lastViewedAt) {
        convertedLastViewedAt = DateTime.fromISO('2021-01-01').toString()
        setLastViewedAtDate(convertedLastViewedAt)
      } else {
        convertedLastViewedAt = DateTime.fromISO(lastViewedAt!).toString()
        setLastViewedAtDate(convertedLastViewedAt)
      }

      const lastSeenMessageId = [...newestChatMessages, ...olderChatMessages]
        .filter((message) => message.senderId === customUser?.id)
        .find(
          (message) =>
            DateTime.fromISO(message.createdAt).toString() <=
            convertedLastViewedAt
        )?.id

      setLastSeenMessageId(lastSeenMessageId!)
      return lastSeenMessageId
    }

    findLastSeenMessageId()
    // eslint-disable-next-line
  }, [
    newestChatMessages,
    olderChatMessages,
    currentChatRoom,
    customUser,
    location,
  ])

  if (
    newestChatMessages.length === 0 ||
    !currentChatRoom ||
    !lastViewedAtDate
  ) {
    return (
      <div className="ChatMessages">
        <div className="loader-wrapper">
          <div className="loader"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="ChatMessages">
      <div className="chat-messages-content-wrapper">
        <div className="chat-messages-content" ref={chatMessagesContentRef}>
          {[...newestChatMessages, ...olderChatMessages]
            .reverse()
            .map((message: ChatMessage) =>
              isMessageMine(message) ? (
                <div key={message.id} className="message message-mine">
                  {lastSeenMessageId && lastSeenMessageId === message.id && (
                    <div className="message-seen">
                      <VisibilityIcon
                        className="message-seen-icon"
                        color="primary"
                      />
                    </div>
                  )}
                  <p className="message-text">
                    {message.id} {message.content}
                  </p>
                </div>
              ) : (
                <div key={message.id} className="message">
                  <p className="message-text">{message.content}</p>
                </div>
              )
            )}
        </div>
      </div>
      <div className="chat-messages-form-wrapper">
        <form onSubmit={sendMessage} className="chat-messages-form">
          <input
            type="text"
            placeholder={dictionary.typeMessage}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="chat-messages-input"
          />
          <button type="submit" className="send-message-button">
            <SendIcon color="primary" className="send-icon" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatMessages
