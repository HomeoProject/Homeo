import { useEffect, useState } from 'react'
import '../style/scss/components/MyReviewComponent.scss'
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
import { useDictionaryContext } from '../Context/DictionaryContext'
import { Link } from 'react-router-dom'
import MyReviewModal from './MyReviewModal'
import Swal from 'sweetalert2'

type MyReviewComponentProps = {
  review: Review
  myReviews: Review[]
  setMyReviews: (reviews: Review[] | null) => void
}

const MyReviewComponent = ({
  review,
  myReviews,
  setMyReviews,
}: MyReviewComponentProps) => {
  const [openReviewEditModal, setOpenReviewEditModal] = useState(false)
  const [receiver, setReceiver] = useState<CustomUser | null>(null)

  const { dictionary } = useDictionaryContext()

  const handleOpenReviewEditModal = () => {
    setOpenReviewEditModal(true)
  }

  const handleCloseReviewEditModal = () => {
    setOpenReviewEditModal(false)
  }

  const deleteMyReview = (id: number) => {
    Swal.fire({
      title: dictionary.areYouSure,
      text: dictionary.youWillNotBeAbleToRevert,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: dictionary.yesDeleteIt,
      cancelButtonText: dictionary.cancelWord,
    }).then((result) => {
      if (result.isConfirmed) {
        apiClient
          .delete(`/reviews/${id}`)
          .then(() => {
            const updatedReviews = myReviews!.filter(
              (review: Review) => review.id !== id
            )
            if (updatedReviews.length === 0) {
              setMyReviews(null)
              toast.success(dictionary.reviewDeletedSuccessfully)
              return
            }
            setMyReviews(updatedReviews)
            toast.success(dictionary.reviewDeletedSuccessfully)
          })
          .catch((err) => {
            console.error(err)
            toast.error(dictionary.failedToDeleteReview)
          })
      }
    })
  }

  useEffect(() => {
    apiClient
      .get(`/users/${encodeURI(review.receiverId)}`)
      .then((response) => {
        setReceiver(response.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [review.receiverId])

  return (
    <div className="ReviewComponent">
      <div className="review-component-main">
        <MyReviewModal
          reviewModalOpen={openReviewEditModal}
          review={review}
          type="edit"
          handleClose={handleCloseReviewEditModal}
          myReviews={myReviews}
          setMyReviews={setMyReviews}
        />
        {receiver && !receiver.isDeleted ? (
          <div className="review-component-main-top">
            <UserAvatar
              src={receiver.avatar}
              alt={`${receiver.firstName} ${receiver.lastName}`}
              variant="link"
              viewHref={`/constructor/${receiver.id}`}
              isApproved={receiver.isApproved}
            />
            <Link
              to={`/constructor/${receiver.id}`}
              className="reviewer-name-link"
              target="_blank"
            >
              <p className="reviewer-name">
                For: &nbsp;{`${receiver.firstName} ${receiver.lastName}`}
              </p>
            </Link>
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
      <Tooltip
        title={dictionary.editReview}
        placement="left-end"
        disableInteractive
      >
        <button className="tooltip-button-edit">
          <EditNoteIcon
            className="edit-icon"
            onClick={handleOpenReviewEditModal}
          />
        </button>
      </Tooltip>
      <Tooltip
        title={dictionary.deleteReview}
        placement="left-end"
        disableInteractive
      >
        <button className="tooltip-button-delete">
          <DeleteIcon
            className="delete-icon"
            onClick={() => deleteMyReview(review.id)}
          />
        </button>
      </Tooltip>
    </div>
  )
}

export default MyReviewComponent
