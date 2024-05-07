import {
  Client,
  Frame,
  IMessage,
  StompConfig,
  StompSubscription,
} from '@stomp/stompjs'

class ChatClient {
  private client: Client
  private isConnected: boolean = false
  private connectHeaders: { [key: string]: string } = {}
  private subscriptions: Map<
    string,
    { subscription: StompSubscription; callback: (message: IMessage) => void }
  > = new Map()
  private pendingSubscriptions: Map<string, (message: IMessage) => void> =
    new Map()

  constructor(url: string, connectHeaders: { [key: string]: string }) {
    this.connectHeaders = connectHeaders
    const config: StompConfig = {
      brokerURL: url,
      // reconnectDelay: 3000,
      // heartbeatIncoming: 2000,
      // heartbeatOutgoing: 2000,
      connectHeaders: this.connectHeaders,
      onConnect: (frame: Frame) => this.onConnect(frame),
      onStompError: (frame: Frame) => this.onError(frame),
      onWebSocketClose: (event: CloseEvent) => this.onClose(event),
      beforeConnect: () => this.beforeConnect(),
    }

    this.client = new Client(config)
  }

  public connect(): void {
    this.client.activate()
  }

  public getIsConnected(): boolean {
    return this.isConnected
  }

  public disconnect(): void {
    this.subscriptions.forEach((subscription) =>
      subscription.subscription.unsubscribe()
    )
    this.isConnected = false
    this.deleteToken()
    this.client.deactivate()
  }

  public updateToken(newToken: string): void {
    this.connectHeaders['Authorization'] = `Bearer ${newToken}`
    // Reconnect with new token
    if (this.client.active) {
      this.disconnect()
      this.connect()
    }
  }

  public deleteToken(): void {
    delete this.connectHeaders['Authorization']
  }

  public subscribe(topic: string, callback: (message: IMessage) => void): void {
    if (this.isConnected) {
      if (!this.subscriptions.has(topic)) {
        const subscription = this.client.subscribe(topic, callback)
        this.subscriptions.set(topic, { subscription, callback })
      }
    } else {
      this.pendingSubscriptions.set(topic, callback)
    }
  }

  public unsubscribe(topic: string): void {
    const subscriptionInfo = this.subscriptions.get(topic)
    if (subscriptionInfo) {
      subscriptionInfo.subscription.unsubscribe()
      this.subscriptions.delete(topic)
    }
  }

  public sendMessage(destination: string, body: string): void {
    console.log('Is Connected:', this.isConnected)
    this.client.publish({ destination, body })
    console.log(
      'Message sent: \n',
      'Destination: ',
      destination,
      '\nBody: ',
      body
    )
  }

  public subscribeGlobalChatNotifications(
    callback: (message: IMessage) => void
  ): void {
    chatClient.subscribe('/user/topic/chat-notification', callback)
  }

  public unsubscribeGlobalChatNotifications(): void {
    chatClient.unsubscribe('/user/topic/chat-notification')
  }

  private onConnect(frame: Frame): void {
    this.isConnected = true
    console.log('Connected: ', frame)

    this.pendingSubscriptions.forEach((callback, topic) => {
      const subscription = this.client.subscribe(topic, callback)
      this.subscriptions.set(topic, { subscription, callback })
    })
    this.pendingSubscriptions.clear()
  }

  private onClose(event: CloseEvent): void {
    this.isConnected = false
    console.log('Connection closed: ', event)
  }

  private onError(frame: Frame): void {
    console.log('Broker Error: ', frame)
  }

  private beforeConnect(): void {
    if (this.client.active) {
      this.client.configure({ connectHeaders: this.connectHeaders })
    }
  }
}

const chatUrl = `${import.meta.env.VITE_REACT_APIGATEWAY_WS_URL}/chat/websocket`
const chatClient = new ChatClient(chatUrl, {})

export const setChatAuthToken = (token: string): void => {
  if (token) {
    chatClient.updateToken(token)
  } else {
    chatClient.deleteToken()
  }
}

export default chatClient
