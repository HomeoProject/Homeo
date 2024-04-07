import { useEffect, useState } from 'react'
import '../style/scss/components/ReviewComponent.scss'
import { CustomUser, Review } from '../types/types'
import apiClient from '../AxiosClients/apiClient'
import DefaultAvatar from '../Assets/default-avatar.svg'
import UserAvatar from './UserAvatar'
import DeleteIcon from '@mui/icons-material/Delete'
import EditNoteIcon from '@mui/icons-material/EditNote'
import { toast } from 'react-toastify'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { Rating, Tooltip } from '@mui/material'
import { useUserContext } from '../Context/UserContext'
import { useDictionaryContext } from '../Context/DictionaryContext'
import ReviewModal from './ReviewModal'

type ReviewComponentProps = {
  review: Review
  isAdmin: boolean
  fetchReviews: () => void
}

const ReviewComponent = ({
  review,
  isAdmin,
  fetchReviews,
}: ReviewComponentProps) => {
  const [reviewer, setReviewer] = useState<CustomUser | null>(null)
  const [isUserReviewer, setIsUserReviewer] = useState(false)
  const [openReviewEditModal, setOpenReviewEditModal] = useState(false)

  const { customUser } = useUserContext()
  const { dictionary } = useDictionaryContext()

  const handleOpenReviewEditModal = () => {
    setOpenReviewEditModal(true)
  }

  const handleCloseReviewEditModal = () => {
    setOpenReviewEditModal(false)
  }

  const deleteReview = () => {
    apiClient
      .delete(`/reviews/${review.id}`)
      .then(() => {
        toast.success('Review deleted successfully')
      })
      .then(() => {
        fetchReviews()
      })
      .catch((err) => {
        console.error(err)
        toast.error('Failed to delete the review')
      })
  }

  useEffect(() => {
    if (customUser && customUser.id === review.reviewerId) {
      setReviewer(customUser)
      setIsUserReviewer(true)
      return
    }

    apiClient
      .get(`/users/${review.reviewerId}`)
      .then((response) => {
        setReviewer(response.data)
        setIsUserReviewer(false)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [customUser, review.reviewerId])

  return (
    <div className="ReviewComponent">
      <div className="review-component-main">
        <ReviewModal
          reviewModalOpen={openReviewEditModal}
          review={review}
          receiverId={review.receiverId!}
          type="edit"
          handleClose={handleCloseReviewEditModal}
          fetchReviews={fetchReviews}
        />
        {reviewer && !reviewer.isDeleted ? (
          <div className="review-component-main-top">
            <UserAvatar
              src={reviewer.avatar}
              alt={`${reviewer.firstName} ${reviewer.lastName}`}
              isApproved={reviewer.isApproved}
            />
            <p className="reviewer-name">{`${reviewer.firstName} ${reviewer.lastName}`}</p>
          </div>
        ) : (
          <div className="review-component-main-top">
            <UserAvatar
              src={DefaultAvatar}
              alt="Anonymous"
              isApproved={false}
            />
            <p className="reviewer-name">{dictionary.anonymousWord}</p>
          </div>
        )}
        <div className="review-component-main-middle">
          <span className="rating">
            <p className="rating-value">{review.rating}</p>
            <div className="divider"></div>
            <Rating
              name="simple-controlled"
              value={review.rating}
              precision={0.5}
              icon={<StarIcon color="primary" />}
              emptyIcon={<StarBorderIcon color="primary" />}
              max={5}
              readOnly
            />
          </span>
        </div>
        <div className="review-component-main-bottom">
          <p className="text">{review.text}</p>
        </div>
      </div>
      {isUserReviewer && (
        <Tooltip title="Edit review" placement="left-end" disableInteractive>
          <button className="tooltip-button-edit">
            <EditNoteIcon
              className="edit-icon"
              onClick={handleOpenReviewEditModal}
            />
          </button>
        </Tooltip>
      )}
      {(isAdmin || isUserReviewer) && (
        <Tooltip title="Delete review" placement="left-end" disableInteractive>
          <button className="tooltip-button-delete">
            <DeleteIcon className="delete-icon" onClick={deleteReview} />
          </button>
        </Tooltip>
      )}
    </div>
  )
}

export default ReviewComponent
