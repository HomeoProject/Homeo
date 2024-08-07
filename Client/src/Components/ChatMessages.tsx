import { useEffect, useState, FormEvent, useRef, ChangeEvent } from 'react'
import { ChatMessage, ChatRoom, FullChatRoomInfo } from '../types/types'
import apiClient from '../AxiosClients/apiClient'
import '../style/scss/components/ChatMessages.scss'
import { useUserContext } from '../Context/UserContext'
import chatClient from '../WebSockets/ChatClient'
import SendIcon from '@mui/icons-material/Send'
import { useLocation } from 'react-router'
import { IMessage } from '@stomp/stompjs'
import { useUnreadChatsContext } from '../Context/UnreadChatsContext'
import { DateTime } from 'luxon'
import UploadIcon from '@mui/icons-material/Upload'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useDictionaryContext } from '../Context/DictionaryContext'
import { Button, Typography, styled } from '@mui/material'
import { toast } from 'react-toastify'
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto'
import UserAvatar from './UserAvatar'
import defaultAvatar from '../Assets/default-avatar.svg'
import ClearIcon from '@mui/icons-material/Clear'

type ChatMessagesProps = {
  chatRoomId: number
}

const ChatMessages = ({ chatRoomId }: ChatMessagesProps) => {
  const [newestChatMessages, setNewestChatMessages] = useState<ChatMessage[]>(
    []
  )
  const [isStateUpdating, setIsStateUpdating] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [olderChatMessages, setOlderChatMessages] = useState<ChatMessage[]>([])
  const [messageInput, setMessageInput] = useState<string>('')
  const [noMoreMessages, setNoMoreMessages] = useState<boolean>(false)
  const [activateObserver, setActivateObserver] = useState(false)
  const [lastSeenMessageId, setLastSeenMessageId] = useState<number | null>(
    null
  )
  const [lastMessageCreatedAt, setLastMessageCreatedAt] = useState<string>(
    new Date().toISOString()
  )
  const [lastViewedAtDate, setLastViewedAtDate] = useState<string | null>(null)
  const { unreadChats, setUnreadChats } = useUnreadChatsContext()
  const [currentChatRoom, setCurrentChatRoom] =
    useState<FullChatRoomInfo | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [fileToSend, setFileToSend] = useState<string | null>(null)
  const { customUser } = useUserContext()
  const { dictionary } = useDictionaryContext()
  const inputRef = useRef<HTMLInputElement>(null)
  const location = useLocation()
  const chatMessagesContentRef = useRef<HTMLDivElement>(null)

  const Input = styled('input')({
    display: 'none',
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setActivateObserver(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [location])

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
    // eslint-disable-next-line
  }, [location, newestChatMessages, chatMessagesContentRef.current])

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

    if (!activateObserver) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (firstEntry.isIntersecting) {
          fetchMoreMessages()
        }
      },
      {
        root: chatMessagesContentRef.current,
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
  }, [lastMessageCreatedAt, chatMessagesContentRef.current, activateObserver])

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
    if (messageInput === '' && !fileToSend) {
      return
    }

    try {
      chatClient.sendMessage(
        '/app/message',
        JSON.stringify({
          content: messageInput,
          chatRoomId: chatRoomId,
          image: fileToSend ? fileToSend : null,
        })
      )

      markChatAsRead()

      setMessageInput('')
      setFileToSend(null)
      setFileName('')
      inputRef.current?.focus()
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const getChatRoom = async () => {
      setIsStateUpdating(true)
      apiClient
        .get<ChatRoom>(`/chat/room/${chatRoomId}`)
        .then((response) => {
          const newChatRoom = response.data
          const otherChatterId = newChatRoom.chatParticipants.find(
            (participant) => participant.userId !== customUser?.id
          )?.userId

          if (otherChatterId) {
            apiClient
              .get(`/users/${encodeURI(otherChatterId)}`)
              .then((response) => {
                setCurrentChatRoom({
                  chatRoom: newChatRoom,
                  chatter: response.data,
                })
              })
              .catch((error) => {
                console.error(error)
              })
              .finally(() => {
                setIsStateUpdating(false)
              })
          }

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
        setIsStateUpdating(true)
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
          .finally(() => {
            setIsStateUpdating(false)
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
        setCurrentChatRoom((prev) => {
          if (!prev) {
            return prev
          }

          const chatRoom = JSON.parse(message.body)
          if (prev.chatRoom.id === chatRoom.id) {
            return {
              ...prev,
              chatRoom: chatRoom,
            }
          }

          return prev
        })
      })
    }

    const unsubscribeFromChatStatus = () => {
      chatClient.unsubscribe(`/user/topic/${chatRoomId}`)
    }

    getChatRoom().then(() => {
      fetchNewestChatMessages()
      markChatAsRead()
      subcribeToChatStatus()
      subcribeToGlobalChatNotifications()
      markChatAsReadLocally(chatRoomId)
    })

    return () => {
      setNewestChatMessages([])
      setOlderChatMessages([])
      setNoMoreMessages(false)
      setActivateObserver(false)
      setFileToSend(null)
      setFileName('')
      setCurrentChatRoom(null)
      setLastSeenMessageId(null)
      unsubscribeFromChatStatus()
      unsubscribeFromGlobalChatNotifications()
    }

    // eslint-disable-next-line
  }, [chatRoomId])

  useEffect(() => {
    const findLastSeenMessageId = () => {
      const lastViewedAt = currentChatRoom?.chatRoom.chatParticipants.find(
        (participant) => participant.userId !== customUser?.id
      )?.lastViewedAt

      // use luxon to parse the date with correct timezone
      let convertedLastViewedAt: string
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

  function getFileExtension(filename: string) {
    const parts = filename.split('.')
    return parts[parts.length - 1]
  }

  function isImage(filename: string) {
    const ext = getFileExtension(filename)
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'svg':
      case 'png':
      case 'jpeg':
        return true
    }

    return false
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true)
    const file = e.target.files?.[0]

    if (file && isImage(file.name)) {
      const reader = new FileReader()

      reader.onload = (readEvent) => {
        const image = new Image()
        image.src = readEvent.target?.result as string

        image.onload = () => {
          if (image.width < 30 || image.height < 30) {
            toast.error(
              `${dictionary.imageMustBeAtLeast} 30x30 ${dictionary.pixels}`
            )
            setIsLoading(false)
            return
          }

          const base64String = readEvent.target?.result as string
          const base64Content = base64String.split(',')[1]

          if (!base64Content) {
            toast.error(dictionary.errorProccesingFile)
            setIsLoading(false)
            return
          }

          const maxSizeInBytes = 2 * 1024 * 1024 // 2MB limit
          if (file.size > maxSizeInBytes) {
            toast.error(`${dictionary.imageSizeExceeds} (2MB)`)
            setIsLoading(false)
            return
          }

          setFileName(file.name)
          setFileToSend(base64Content)
          setIsLoading(false)
        }

        image.onerror = () => {
          toast.error(dictionary.errorProccesingFile)
          setIsLoading(false)
        }
      }

      reader.onerror = () => {
        toast.error(dictionary.errorProccesingFile)
        setIsLoading(false)
      }

      reader.readAsDataURL(file)
    } else {
      toast.error(dictionary.unsupportedFileType)
      setIsLoading(false)
    }
  }

  if (
    newestChatMessages.length === 0 ||
    !currentChatRoom ||
    !lastViewedAtDate ||
    chatRoomId !== currentChatRoom.chatRoom.id ||
    isStateUpdating
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
      <div className="other-chatter-info">
        <UserAvatar
          src={currentChatRoom.chatter.avatar || defaultAvatar}
          alt={currentChatRoom.chatter.firstName || 'Anonymous'}
          isApproved={false}
          variant={currentChatRoom.chatter.isOnline ? 'chat' : 'standard'}
          maxWidth="30px"
          maxHeight="30px"
        />
        <h2 className="other-chatter-info-name">
          {currentChatRoom.chatter.firstName} {currentChatRoom.chatter.lastName}
        </h2>
      </div>
      <div className="chat-messages-content-wrapper">
        <div className="chat-messages-content" ref={chatMessagesContentRef}>
          {[...newestChatMessages, ...olderChatMessages]
            .reverse()
            .map((message: ChatMessage) =>
              isMessageMine(message) ? (
                <div key={message.id} className="message-mine">
                  {lastSeenMessageId && lastSeenMessageId === message.id && (
                    <div className="message-seen">
                      <VisibilityIcon
                        className="message-seen-icon"
                        color="primary"
                      />
                    </div>
                  )}
                  {message.content && message.imageUrl && (
                    <div className="message-mine-content-both">
                      {message.imageUrl && (
                        <img
                          src={message.imageUrl}
                          alt="message-image"
                          className="message-image"
                        />
                      )}
                      {message.content && (
                        <p className="message-text">{message.content}</p>
                      )}
                    </div>
                  )}
                  <div className="message-mine-content">
                    {message.imageUrl && !message.content && (
                      <img
                        src={message.imageUrl}
                        alt="message-image"
                        className="message-image"
                      />
                    )}
                    {message.content && !message.imageUrl && (
                      <p className="message-text">{message.content}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div key={message.id} className="message">
                  {message.imageUrl && message.content && (
                    <>
                      <img
                        src={message.imageUrl}
                        alt="message-image"
                        className="message-image-not-rounded"
                      />
                      <p className="message-text">{message.content}</p>
                    </>
                  )}
                  {message.imageUrl && !message.content && (
                    <img
                      src={message.imageUrl}
                      alt="message-image"
                      className="message-image"
                    />
                  )}
                  {message.content && !message.imageUrl && (
                    <p className="message-text">{message.content}</p>
                  )}
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
          <label htmlFor="contained-button-file" className="modal-form-left">
            <Input
              accept="image/*"
              id="contained-button-file"
              multiple
              type="file"
              onChange={handleChange}
            />
            <Button
              variant="outlined"
              component="span"
              sx={{ marginLeft: '10px' }}
              disabled={isLoading}
            >
              <UploadIcon />
            </Button>
          </label>
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            sx={{
              marginLeft: '10px',
            }}
            disabled={isLoading}
          >
            <SendIcon color="primary" className="send-icon" />
          </Button>
        </form>
      </div>
      <div className="details-wrapper">
        {fileName && (
          <div className="details">
            <InsertPhotoIcon
              sx={{
                color: '#b6b6b6',
                fontSize: '1.2rem',
              }}
            />
            <Typography
              variant="body1"
              sx={{
                color: '#b6b6b6',
                overflow: 'hidden',
                textWrap: 'nowrap',
                textOverflow: 'ellipsis',
                maxWidth: '150px',
                fontFamily: 'Gabarito',
                fontSize: '0.8rem',
              }}
            >
              {fileName}
            </Typography>
            <ClearIcon
              onClick={() => {
                setFileName('')
                setFileToSend(null)
              }}
              sx={{
                color: '#b6b6b6',
                fontSize: '1.2rem',
                cursor: 'pointer',
                marginTop: '3px',
                ':hover': {
                  color: '#000',
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessages
