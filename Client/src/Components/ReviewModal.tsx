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
import { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import LoadingSpinner from './LoadingSpinner'
import { toast } from 'react-toastify'
import { useAuth0 } from '@auth0/auth0-react'
import theme from '../style/themes/themes'
import { ConstructorProfileReviews, Review } from '../types/types'
import apiClient from '../AxiosClients/apiClient'
import { useDictionaryContext } from '../Context/DictionaryContext'

type ReviewModalProps = {
  reviewModalOpen: boolean
  review?: Review
  receiverId: string
  receiverName?: string
  type: 'add' | 'edit' | 'delete'
  handleClose: () => void
  constructorReviews: ConstructorProfileReviews
  setConstructorReviews: (reviews: ConstructorProfileReviews) => void
}

const ReviewModal = ({
  reviewModalOpen,
  review,
  receiverId,
  receiverName,
  type,
  handleClose,
  constructorReviews,
  setConstructorReviews,
}: ReviewModalProps) => {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [ratingValue, setRatingValue] = useState<number | null>(null)
  const [reviewText, setReviewText] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { isAuthenticated } = useAuth0()

  const { dictionary } = useDictionaryContext()

  const addReview = async (
    text: string,
    rating: number,
    receiverId: string
  ) => {
    apiClient
      .post('/reviews', { text, rating, receiverId })
      .then((response) => {
        return response.data
      })
      .then((content) => {
        apiClient
          .get(`/reviews/stats/${receiverId}`)
          .then((response) => {
            const updatedStats = response.data
            let updatedContent
            // If there are no reviews yet, we need to create an array with the first review
            if (constructorReviews.stats.reviewsNumber === 0) {
              updatedContent = content
              setConstructorReviews({
                stats: updatedStats,
                content: [updatedContent],
              })
              toast.success(dictionary.reviewAddedSuccessfully)
              return
            }
            updatedContent = [...constructorReviews.content, content]
            setConstructorReviews({
              stats: updatedStats,
              content: updatedContent,
            })
            toast.success(dictionary.reviewAddedSuccessfully)
          })
          .catch((err) => {
            console.error(err)
            toast.error(dictionary.failedToGetReviewsStats)
          })
      })
      .catch((err) => {
        if (err.response.status === 409) {
          toast.error(dictionary.userAlreadyReviewed)
          return
        }
        toast.error(dictionary.failedToAddReview)
        console.error(err)
      })
      .finally(() => {
        handleClose()
        setIsLoading(false)
        setRatingValue(0)
        setReviewText('')
      })
  }

  const editReview = (text: string, rating: number, reviewId: number) => {
    apiClient
      .put(`/reviews/${reviewId}`, { text, rating })
      .then((response) => {
        return response.data
      })
      .then((content) => {
        apiClient.get(`/reviews/stats/${receiverId}`).then((response) => {
          const updatedStats = response.data
          const updatedContent = constructorReviews!.content.map((review) =>
            review.id === reviewId ? content : review
          )
          setConstructorReviews({
            stats: updatedStats,
            content: updatedContent,
          })
          toast.success(dictionary.reviewEditedSuccesfully)
        })
      })
      .catch((err) => {
        console.error(err)
        toast.error(dictionary.failedToEditReview)
      })
      .finally(() => {
        handleClose()
        setIsLoading(false)
      })
  }

  const handleSubmit = () => {
    setErrorMessage('')
    if (!ratingValue) {
      setErrorMessage(dictionary.pleaseSelectRating)
    } else if (!reviewText) {
      setErrorMessage(dictionary.reviewTextEmpty)
    } else if (reviewText.length < 10 || reviewText.length > 400) {
      setErrorMessage(dictionary.incorrectReviewLength)
    } else if (isAuthenticated && type === 'edit' && review) {
      setIsLoading(true)
      editReview(reviewText, ratingValue, review.id)
    } else if (isAuthenticated && type === 'add') {
      setIsLoading(true)
      addReview(reviewText, ratingValue, receiverId)
    } else {
      toast.error(dictionary.authErr)
    }
  }

  useEffect(() => {
    if (type === 'edit' && review) {
      setReviewText(review.text)
      setRatingValue(review.rating)
    }
  }, [type, review])

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
            {type == 'edit' ? dictionary.editReview : dictionary.addReview}
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
                placeholder={`${dictionary.writeSomethingAbout} ${receiverName}...`}
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
                {dictionary.whenWritingReview}
              </Typography>
              <List sx={rulesListStyle}>
                <li>{dictionary.keepYourReviewFocused}</li>
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
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {dictionary.saveWord}
          </Button>
          <Button variant="outlined" sx={saveButtonStyle} onClick={handleClose}>
            {dictionary.cancelWord}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default ReviewModal
