import { useRef, useState, useEffect } from 'react'
import UserCard from './UserCard'
import '../style/scss/components/UserCardDialog.scss'
import Dialog from '@mui/material/Dialog'
import Card from '@mui/material/Card'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TextField from '@mui/material/TextField'
import SendIcon from '@mui/icons-material/Send'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { Warning } from '@mui/icons-material'
import { useAuth0 } from '@auth0/auth0-react'
import { Constructor, ChatMessageToSend } from '../types/types.ts'
import apiClient from '../AxiosClients/apiClient'
import { useDictionaryContext } from '../Context/DictionaryContext.ts'
import { useNavigate } from "react-router-dom";
import chatClient from '../WebSockets/ChatClient'
import { useUserContext } from '../Context/UserContext'
import { toast } from 'react-toastify'
import {
  Typography,
  Button,
} from '@mui/material'
import {
  errorChatAlreadyExistsStyle,
} from '../style/scss/muiComponents/ChatMessageModal.ts'

export interface SimpleDialogProps {
  open: boolean
  handleClose: () => void
  customConstructor: {
    userId: string
    avatar: string
    firstName: string
    categoryIds: number[]
    phoneNumber: string
    cities: string[]
    email: string
    paymentMethods: string[]
    minRate: number
    averageRating: number
  }
}

const SimpleDialog = ({
  open,
  handleClose,
  customConstructor,
}: SimpleDialogProps) => {
  const accrodionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const [openAccordion, setOpenAccordion] = useState(false)
  const [fullConstructor, setFullConstructor] = useState<Constructor | null>(
    null
  )
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [messageText, setMessageText] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [chatExists, setChatExists] = useState<boolean>(false)
  const [chatRoomId, setChatRoomId] = useState<string | null>(null)

  const { getAccessTokenSilently } = useAuth0()
  const { dictionary } = useDictionaryContext()
  const { customUser } = useUserContext()
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get(
          `/constructors/${encodeURI(customConstructor.userId)}`
        )
        setFullConstructor(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    const checkIfChatExists = async () => {
      try {
        const response = await apiClient.get(`/chat/room/exists`, {
          params: {
            userIds: `${[customUser!.id, customConstructor.userId!]}`,
          }
        })
  
        console.log(response.data)
  
        if(response.data?.id) {
          setChatExists(true)
          setChatRoomId(response.data.id)
          setErrorMessage('You already have a chat with this user!')
        } else {
          setChatExists(false)
        }
      } catch (error) {
        console.error(error)
        return null
      }
    }

    fetchUser()
    if(open) {
      checkIfChatExists()
    }
  }, [customConstructor.userId, getAccessTokenSilently, open])

  const handleOpenAccrordion = () => {
    if (!openAccordion) {
      accrodionRef.current?.scrollIntoView({ behavior: 'smooth' })
    } else {
      cardsRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    setOpenAccordion(!openAccordion)
  }

  const handlePropagation = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const goToChat = () => {
    if(chatRoomId) {
      navigate(`/chat/${chatRoomId}`)
    }
  }

  const sendMessage = async () => {
    if (!messageText || !customConstructor.userId) {
      setErrorMessage(dictionary.messageOrReceieverNotSpecified)
      return
    }

    if (customUser && customUser.id === customConstructor.userId) {
      toast.error(dictionary.cannotSendMessageToSelf)
      return
    }

    setIsLoading(true)
    try {
      if (customUser) {
        const message: ChatMessageToSend = {
          content: messageText,
          chatRoomId: null,
          chatParticipantsIds: [customUser.id, customConstructor.userId],
        }
        chatClient.sendMessage('/app/message', JSON.stringify(message))
        toast.success(dictionary.messageSentSuccessfully)
      }
    } catch (error) {
      console.error(error)
      toast.error(dictionary.failedToSendMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth={'xl'}
      className="dialog"
    >
      <div className="before-simple-dialog" onClick={handleClose}>
        <div className="SimpleDialog" ref={cardsRef}>
          <div onClick={handlePropagation}>
            <UserCard isDialog={true} customConstructor={customConstructor} />
          </div>
          <div className="before-simple-dialog-card">
            <Card onClick={handlePropagation} className="simple-dialog-card">
              {fullConstructor && (
                <div className="simple-dialog-container">
                  <div className="simple-dialog-container-row">
                    <span className="simple-dialog-container-row-key">
                      {dictionary.aboutMe}:
                    </span>
                    <span className="simple-dialog-container-row-value">
                      {fullConstructor.aboutMe}
                    </span>
                  </div>
                  <div className="simple-dialog-container-row">
                    <span className="simple-dialog-container-row-key">
                      {dictionary.experience}:
                    </span>
                    <span
                      className="simple-dialog-container-row-value"
                      ref={accrodionRef}
                    >
                      {fullConstructor.experience}
                    </span>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
        <div className="accordion" onClick={handlePropagation}>
          <Accordion>
            <AccordionSummary>
              <div className="accordion-summary">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenAccrordion}
                  sx={{ fontWeight: 700 }}
                >
                  {dictionary.wantHire}
                  <ExpandMoreIcon
                    sx={{
                      transition: '0.2s ease-in-out',
                      transform: openAccordion ? 'rotate(180deg)' : '',
                    }}
                  />
                </Button>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="accordion-form">
                <div className="accordion-form-description">
                  <div className="accordion-form-description-value">
                    <span>
                      {dictionary.writeHere}{' '}
                      <span className="accordion-form-description-value-bold">
                        {dictionary.descriptionHere}
                      </span>{' '}
                      {dictionary.descriptionExplain}
                    </span>
                  </div>
                </div>
                <div className="accordion-form-details">
                  <TextField
                    label="Description of your problem"
                    variant="outlined"
                    multiline
                    minRows={6}
                    inputProps={{ maxLength: 400 }}
                    disabled={chatExists}
                    onChange={(e) => {
                      setErrorMessage('')
                      setMessageText(e.target.value)
                    }}
                    value={messageText}
                  />
                  <Typography
                    id="modal-modal-error"
                    variant="body1"
                    sx={errorChatAlreadyExistsStyle}
                  >
                    {<Warning></Warning> && errorMessage}
                  </Typography>
                  <div>
                    {!chatExists ? (
                      <Button
                      variant="contained"
                      onClick={sendMessage}
                      disabled={isLoading || !messageText}
                      sx={{
                        fontWeight: 700,
                        width: '100%',
                      }}
                    >
                      <span className="accordion-form-details-button">
                        Send{' '}
                        <SendIcon
                          fontSize="small"
                          sx={{
                            padding: '0 0 0 5px',
                          }}
                        />
                      </span>
                    </Button>
                    ) : (
                      <Button
                      variant="contained"
                      onClick={goToChat}
                      sx={{
                        fontWeight: 700,
                        width: '100%',
                      }}
                      >
                        <span className="accordion-form-details-button">
                          Go to chat{' '}
                          <DirectionsRunIcon
                            fontSize="small"
                            sx={{
                              padding: '0 0 0 5px',
                            }}
                         />
                      </span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </Dialog>
  )
}

export default SimpleDialog
