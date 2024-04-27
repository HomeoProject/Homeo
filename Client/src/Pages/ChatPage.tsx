import '../style/scss/ChatPage.scss'
import { useEffect } from 'react'
import chatClient from '../WebSockets/ChatClient'
import apiClient from '../AxiosClients/apiClient'
// import { IMessage } from '@stomp/stompjs'

const ChatPage = () => {
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
      })
      .catch((error) => {
        console.error(error)
      })

    return () => {
      chatClient.unsubscribe('/user/topic/test')
    }
  }, [])

  return (
    <div className="ChatPage">
      <div className="char-page-wrapper">
        <div className="chat-page-left"></div>
        <div className="chat-page-right"></div>
      </div>
    </div>
  )
}

export default ChatPage
