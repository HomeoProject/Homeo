import '../style/scss/ChatPage.scss'
import { useEffect, useState } from 'react'
import apiClient from '../AxiosClients/apiClient'
import { ChatRoom } from '../types/types'
import ChatRooms from '../Components/ChatRooms'
import { useParams } from 'react-router'
import ChatMessages from '../Components/ChatMessages'
import LoadingSpinner from '../Components/LoadingSpinner'

const ChatPage = () => {
  const currentChatRoomId = useParams<{ id: string }>().id
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoom | null>(null)

  useEffect(() => {
    apiClient
      .get('/chat/rooms', {
        params: {
          lastMessageCreatedAt: new Date().toISOString(),
        },
      })
      .then((response) => {
        // console.log('Chat rooms: ', response.data)
        setChatRooms(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  useEffect(() => {
    if (chatRooms.length > 0) {
      const chatRoom = chatRooms.find(
        (chatRoom) => chatRoom.id.toString() === currentChatRoomId
      )
      setCurrentChatRoom(chatRoom!)
    }
  }, [currentChatRoomId, chatRooms])

  if (!currentChatRoom || chatRooms.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div className="ChatPage">
      <div className="chat-page-wrapper">
        <div className="chat-page-left">
          <ChatRooms chatRooms={chatRooms} />
        </div>
        <div className="chat-page-right">
          <ChatMessages chatRoomId={currentChatRoom.id} />
        </div>
      </div>
    </div>
  )
}

export default ChatPage
