import { Warning } from '@mui/icons-material'
import {
  Modal,
  Box,
  Typography,
  TextareaAutosize,
  Button,
  List,
} from '@mui/material'
import {
  closeModalContainerStyle,
  titleTypographyStyle,
  errorMessageTypographyStyle,
  saveButtonStyle,
} from '../style/scss/muiComponents/ChangeAvatarModal'
import {
  chatMessageModalStyle,
  middleContainerStyle,
  textareaBoxStyle,
  textareaStyle,
  bottomButtonContainer,
  listContainerStyle,
  listTitleStyle,
  rulesListStyle,
} from '../style/scss/muiComponents/ChatMessageModal'
import theme from '../style/themes/themes'
import LoadingSpinner from './LoadingSpinner'
import { useDictionaryContext } from '../Context/DictionaryContext'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import { toast } from 'react-toastify'
import chatClient from '../WebSockets/ChatClient'
import { ChatMessage } from '../types/types'
import { useUserContext } from '../Context/UserContext'

type ChatMessageModalProps = {
  messageModalOpen: boolean
  receiverName?: string
  receiverId: string
  handleClose: () => void
}

const ChatMessageModal = ({
  messageModalOpen,
  receiverName,
  receiverId,
  handleClose,
}: ChatMessageModalProps) => {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [messageText, setMessageText] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { dictionary } = useDictionaryContext()
  const { customUser } = useUserContext()

  const sendMessage = async () => {
    if (!messageText || !receiverId) {
      setErrorMessage('Message text or receiver not specified.')
      return
    }

    if (customUser && customUser.id === receiverId) {
      toast.error('Cannot send message to self.')
      return
    }

    setIsLoading(true)
    try {
      if (customUser) {
        const message: ChatMessage = {
          content: messageText,
          chatRoomId: 1,
          chatParticipantsIds: Array.from(new Set([customUser.id, receiverId])),
        }
        chatClient.sendMessage('/app/message', JSON.stringify(message))
        toast.success(dictionary.messageSentSuccessfully)
      }
    } catch (error) {
      console.error(error)
      toast.error(dictionary.failedToSendMessage)
    } finally {
      setIsLoading(false)
      handleClose()
    }
  }

  return (
    <Modal open={messageModalOpen} onClose={handleClose}>
      <Box sx={chatMessageModalStyle}>
        <Box sx={closeModalContainerStyle}>
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            sx={titleTypographyStyle}
          >
            {dictionary.sendMessage}
          </Typography>
          <button onClick={handleClose} className="close-modal-button">
            <CloseIcon className="close-icon"></CloseIcon>
          </button>
        </Box>
        {isLoading ? (
          <LoadingSpinner></LoadingSpinner>
        ) : (
          <Box sx={middleContainerStyle}>
            <Box sx={textareaBoxStyle}>
              <TextareaAutosize
                aria-label="minimum height"
                key="review-textarea"
                minRows={5}
                placeholder={
                  receiverName
                    ? `${dictionary.writeTo} ${receiverName}...`
                    : 'Write something...'
                }
                maxLength={400}
                value={messageText}
                style={textareaStyle(theme) as React.CSSProperties}
                onChange={(e) => {
                  setErrorMessage('')
                  setMessageText(e.target.value)
                }}
              />
            </Box>
            <Typography
              id="modal-modal-error"
              variant="body1"
              sx={errorMessageTypographyStyle}
            >
              {<Warning></Warning> && errorMessage}
            </Typography>
            <Box sx={listContainerStyle}>
              <Typography sx={listTitleStyle}>
                {dictionary.whenWritingMessage}
              </Typography>
              <List sx={rulesListStyle}>
                <li>{dictionary.beforeFullyDescribing}</li>
                <li>{dictionary.youWillBeAbleToAttachPictures}</li>
                <li>{dictionary.doNotIncludePersonal}</li>
                <li>{dictionary.alwaysBeRespectful}</li>
              </List>
            </Box>
          </Box>
        )}
        <Box sx={bottomButtonContainer}>
          <Button
            variant="contained"
            sx={saveButtonStyle}
            onClick={sendMessage}
            disabled={isLoading}
          >
            {dictionary.sendWord}
          </Button>
          <Button variant="outlined" sx={saveButtonStyle} onClick={handleClose}>
            {dictionary.cancelWord}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default ChatMessageModal
