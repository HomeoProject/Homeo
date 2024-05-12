import { useRef, useState, useEffect } from 'react'
import UserCard from './UserCard'
import '../style/scss/components/UserCardDialog.scss'
import Dialog from '@mui/material/Dialog'
import Card from '@mui/material/Card'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Button from '@mui/material/Button'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import SendIcon from '@mui/icons-material/Send'
import { useAuth0 } from '@auth0/auth0-react'
import { Constructor } from '../types/types.ts'
import apiClient from '../AxiosClients/apiClient'
import { useDictionaryContext } from '../Context/DictionaryContext.ts'

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
  const [valid, setValid] = useState<boolean>(false)

  const { getAccessTokenSilently } = useAuth0()
  const { dictionary } = useDictionaryContext()

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
    fetchUser()
  }, [customConstructor.userId, getAccessTokenSilently])

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
                  />
                  <div>
                    <Checkbox onChange={(e) => setValid(e.target.checked)} />
                    <span>
                      {dictionary.termsAgree}
                      <span>*</span>
                    </span>
                  </div>
                  <div>
                    <Button
                      disabled={!valid}
                      variant="contained"
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
