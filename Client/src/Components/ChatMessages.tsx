import { useEffect, useState, FormEvent, useRef } from 'react'
import { ChatMessage, ChatRoom } from '../types/types'
import apiClient from '../AxiosClients/apiClient'
import LoadingSpinner from './LoadingSpinner'
import '../style/scss/components/ChatMessages.scss'
import { useUserContext } from '../Context/UserContext'
import chatClient from '../WebSockets/ChatClient'
import SendIcon from '@mui/icons-material/Send'
import { IMessage } from '@stomp/stompjs'
import { useUnreadChatsContext } from '../Context/UnreadChatsContext'

type ChatMessagesProps = {
  chatRoomId: number
  setChatRooms: (rooms: ChatRoom[]) => void
  chatRooms: ChatRoom[]
}

const ChatMessages = ({
  chatRoomId,
  setChatRooms,
  chatRooms,
}: ChatMessagesProps) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [messageInput, setMessageInput] = useState<string>('')
  const { setUnreadChats } = useUnreadChatsContext()
  const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoom>(
    chatRooms.find((room) => room.id === chatRoomId)!
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)
  // const [displayedChatRooms, setDisplayedChatRooms] =
  //   useState<ChatRoom[]>(chatRooms)
  const { customUser } = useUserContext()
  const inputRef = useRef<HTMLInputElement>(null)

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
        JSON.stringify({ content: messageInput, chatRoomId })
      )

      markChatAsRead()

      setMessageInput('')
      inputRef.current?.focus()

      setChatMessages([
        ...chatMessages,
        {
          id: Math.random(),
          content: messageInput,
          senderId: customUser!.id,
          createdAt: new Date().toISOString(),
        },
      ])
      // const modifiedChatRoom = chatRooms.find((room) => room.id === chatRoomId)
      // setChatRooms([
      //   modifiedChatRoom!,
      //   ...chatRooms.filter((room) => room.id !== modifiedChatRoom!.id),
      // ])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const fetchNewestChatMessages = async () => {
      setIsLoading(true)
      try {
        apiClient
          .get<ChatMessage[]>(`/chat/${chatRoomId}/messages`, {
            params: {
              lastCreatedAt: new Date().toISOString(),
            },
          })
          .then((response) => {
            setChatMessages(response.data.reverse())
          })
          .catch((error) => {
            console.error(error)
          })
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

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

    const subcribeToGlobalChatNotifications = () => {
      chatClient.subscribeGlobalChatNotifications((message: IMessage) => {
        const chatMessage = JSON.parse(message.body)
        console.log('New chat notification: ', chatMessage)
        if (JSON.parse(message.body).chatRoom.id === chatRoomId) {
          const newMessage = {
            id: chatMessage.id,
            content: chatMessage.content,
            senderId: chatMessage.senderId,
            createdAt: chatMessage.createdAt,
            chatRoomId: chatMessage.chatRoom.id,
            imageUrl: chatMessage.imageUrl,
          }
          setChatMessages((prev) => [...prev, newMessage])
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
      console.log('Subscribing to chat status: ', `/user/topic/${chatRoomId}`)
      chatClient.subscribe(`/user/topic/${chatRoomId}`, (message: IMessage) => {
        console.log('New chat room: ', JSON.parse(message.body))
        setCurrentChatRoom(JSON.parse(message.body) as ChatRoom)
      })
    }

    const unsubscribeFromChatStatus = () => {
      console.log('Unsubscribing from chat status')
      chatClient.unsubscribe(`/user/topic/${chatRoomId}`)
    }

    subcribeToChatStatus()
    fetchNewestChatMessages()
    subcribeToGlobalChatNotifications()
    markChatAsRead()

    return () => {
      unsubscribeFromChatStatus()
      unsubscribeFromGlobalChatNotifications()
    }

    // eslint-disable-next-line
  }, [chatRoomId])

  useEffect(() => {
    const chatMessagesContent = document.querySelector('.chat-messages-content')
    chatMessagesContent?.scrollTo(0, chatMessagesContent.scrollHeight)
  }, [chatMessages])

  // useMemo(() => {
  //   const callback = (message: ChatMessage) => {
  //     setChatMessages((prev) => [...prev, message])
  //   }

  //   chatClient.subscribe(`/topic/chat.${chatRoomId}`, callback)

  //   return () => {
  //     chatClient.unsubscribe(`/topic/chat.${chatRoomId}`)
  //   }
  // }, [chatRoomId])

  return (
    <div className="ChatMessages">
      <div className="chat-messages-content-wrapper">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="chat-messages-content">
            {chatMessages.map((message: ChatMessage) =>
              isMessageMine(message) ? (
                <div key={message.id} className="message message-mine">
                  <p className="message-text">{message.content}</p>
                </div>
              ) : (
                <div key={message.id} className="message">
                  <p className="message-text">{message.content}</p>
                </div>
              )
            )}
          </div>
        )}
      </div>
      <div className="chat-messages-form-wrapper">
        <form onSubmit={sendMessage} className="chat-messages-form">
          <input
            type="text"
            placeholder="Type a message..."
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
