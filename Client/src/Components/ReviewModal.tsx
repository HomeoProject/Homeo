import { Warning } from '@mui/icons-material'
import {
  Modal,
  Box,
  Typography,
  Button,
  Rating,
  TextareaAutosize,
  List,
} from '@mui/material'
import {
  reviewModalStyle,
  closeModalContainerStyle,
  titleTypographyStyle,
  saveButtonStyle,
  errorMessageTypographyStyle,
  bottomButtonContainer,
  reviewBoxStyle,
  textareaBoxStyle,
  middleContainerStyle,
  rulesListStyle,
  listTitleStyle,
  listContainerStyle,
  textareaStyle,
} from '../style/scss/muiComponents/ReviewModal'
import { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import apiClient from '../AxiosClients/apiClient'
import LoadingSpinner from './LoadingSpinner'
import { toast } from 'react-toastify'
import { useAuth0 } from '@auth0/auth0-react'
import theme from '../style/themes/themes'

type ReviewModalProps = {
  reviewModalOpen: boolean
  receiverId: string
  receiverName: string
  handleClose: () => void
}

const ReviewModal = ({
  reviewModalOpen,
  receiverId,
  receiverName,
  handleClose,
}: ReviewModalProps) => {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [ratingValue, setRatingValue] = useState<number | null>(null)
  const [reviewText, setReviewText] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { isAuthenticated } = useAuth0()

  const handleSubmit = () => {
    setErrorMessage('')
    if (!ratingValue) {
      setErrorMessage('Please select a rating')
    } else if (!reviewText) {
      setErrorMessage('Review text cannot be empty')
    } else if (reviewText.length < 10 || reviewText.length > 400) {
      setErrorMessage(
        'Review text has to be between 10 and 400 characters long'
      )
    } else if (isAuthenticated) {
      setIsLoading(true)
      const finalData = {
        text: reviewText,
        rating: ratingValue,
        receiverId: receiverId,
      }

      apiClient
        .post('/reviews', finalData)
        .then(() => {
          toast.success('Review added successfully!')
          setIsLoading(false)
          handleClose()
        })
        .catch((error) => {
          setIsLoading(false)
          console.error(error)
          toast.error('Failed to add review')
        })
    } else {
      toast.error(
        'There was a problem with your authentication. Please try again in a moment.'
      )
    }
  }

  return (
    <Modal open={reviewModalOpen} onClose={handleClose}>
      <Box sx={reviewModalStyle}>
        <Box sx={closeModalContainerStyle}>
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            sx={titleTypographyStyle}
          >
            Add your review
          </Typography>
          <button onClick={handleClose} className="close-modal-button">
            <CloseIcon className="close-icon"></CloseIcon>
          </button>
        </Box>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Box sx={middleContainerStyle}>
            <Box sx={reviewBoxStyle}>
              <Rating
                name="rating"
                value={ratingValue}
                onChange={(_event, newValue) => {
                  setErrorMessage('')
                  setRatingValue(newValue)
                }}
                precision={0.5}
                icon={<StarIcon color="primary" sx={{ fontSize: '2rem' }} />}
                emptyIcon={
                  <StarBorderIcon color="primary" sx={{ fontSize: '2rem' }} />
                }
                max={5}
                size="large"
              />
            </Box>
            <Box sx={textareaBoxStyle}>
              <TextareaAutosize
                aria-label="minimum height"
                key="review-textarea"
                minRows={4}
                placeholder={`Write something about ${receiverName}...`}
                maxLength={400}
                value={reviewText}
                style={textareaStyle(theme) as React.CSSProperties}
                onChange={(e) => {
                  setErrorMessage('')
                  setReviewText(e.target.value)
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
                When writing a review, remember these rules:
              </Typography>
              <List sx={rulesListStyle}>
                <li>Keep your review focused on the service</li>
                <li>Do not include any personal information</li>
                <li>Always be respectful</li>
              </List>
            </Box>
          </Box>
        )}
        <Box sx={bottomButtonContainer}>
          <Button
            variant="contained"
            sx={saveButtonStyle}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            Save
          </Button>
          <Button variant="outlined" sx={saveButtonStyle} onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default ReviewModal