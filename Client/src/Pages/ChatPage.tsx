import '../style/scss/ChatPage.scss'
import { useEffect } from 'react'
import chatClient from '../WebSockets/ChatClient'
import { IMessage } from '@stomp/stompjs'

const ChatPage = () => {
  useEffect(() => {
    const callback = (x: IMessage) => {
      console.log('New message: ', x.body)
    }

    chatClient.subscribe('/user/topic/test', callback)

    return () => {
      chatClient.unsubscribe('/user/topic/test')
    }
  }, [])

  const handleClick = () => {
    chatClient.sendMessage('/app/test', 'Hello server!!!')
  }

  return (
    <div className="ChatPage">
      <div className="char-page-wrapper">
        <div className="chat-page-left"></div>
        <div className="chat-page-right"></div>
        <button onClick={handleClick}>Click me</button>
      </div>
    </div>
  )
}

export default ChatPage
