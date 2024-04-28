import '../style/scss/ChatPage.scss'
import { useEffect, useState } from 'react'
import chatClient from '../WebSockets/ChatClient'
import apiClient from '../AxiosClients/apiClient'
import { ChatRoom } from '../types/types'
import ChatRooms from '../Components/ChatRooms'
// import { IMessage } from '@stomp/stompjs'

const ChatPage = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[] | null>(null)

  useEffect(() => {
    // const callback = (x: IMessage) => {
    //   console.log('New message: ', x.body)
    // }

    // chatClient.subscribe('/user/topic/test', callback)

    apiClient
      .get('/chat/rooms', {
        params: {
          lastMessageCreatedAt: new Date().toISOString(),
        },
      })
      .then((response) => {
        console.log('Chat rooms: ', response.data)
        setChatRooms(response.data)
      })
      .catch((error) => {
        console.error(error)
      })

    // return () => {
    //   chatClient.unsubscribe('/user/topic/test')
    // }
  }, [])

  return (
    <div className="ChatPage">
      <div className="chat-page-wrapper">
        <div className="chat-page-left">
          <ChatRooms chatRooms={chatRooms} />
        </div>
        <div className="chat-page-right"></div>
      </div>
    </div>
  )
}

export default ChatPage
