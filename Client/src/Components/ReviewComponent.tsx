import { useEffect, useState } from 'react'
import '../style/scss/components/ReviewComponent.scss'
import { ConstructorProfileReviews, CustomUser, Review } from '../types/types'
import apiClient from '../AxiosClients/apiClient'
import DefaultAvatar from '../Assets/default-avatar.svg'
import UserAvatar from './UserAvatar'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from 'react-toastify'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { Rating, Tooltip } from '@mui/material'
import { useUserContext } from '../Context/UserContext'

type ReviewComponentProps = {
  review: Review
  isAdmin: boolean
  reviews: ConstructorProfileReviews | null
  setReviews: (reviews: ConstructorProfileReviews | null) => void
}

const ReviewComponent = ({
  review,
  isAdmin,
  reviews,
  setReviews,
}: ReviewComponentProps) => {
  const [reviewer, setReviewer] = useState<CustomUser | null>(null)
  const [isUserReviewer, setIsUserReviewer] = useState(false)

  const { customUser } = useUserContext()

  const deleteReview = () => {
    apiClient
      .delete(`/reviews/${review.id}`)
      .then(() => {
        toast.success('Review deleted successfully!')
        const updatedReviews = reviews!.content.filter(
          (r) => r.id !== review.id
        )
        reviews!.content.length > 1
          ? setReviews({ ...reviews!, content: updatedReviews })
          : setReviews(null)
      })
      .catch((err) => {
        toast.error('Failed to delete review')
        console.error(err)
      })
  }

  useEffect(() => {
    if (customUser && customUser.id === review.reviewerId) {
      setReviewer(customUser)
      return
    }

    apiClient
      .get(`/users/${review.reviewerId}`)
      .then((response) => {
        setReviewer(response.data)
        setIsUserReviewer(true)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [customUser, review.reviewerId])

  return (
    <div className="ReviewComponent">
      <div className="review-component-main">
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
            <p className="reviewer-name">Anonymous</p>
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
      {(isAdmin || isUserReviewer) && (
        <Tooltip title="Delete review" placement="left-end">
          <DeleteIcon className="delete-icon" onClick={deleteReview} />
        </Tooltip>
      )}
    </div>
  )
}

export default ReviewComponent
