import { useEffect, useState } from 'react'
import '../style/scss/components/Reviews.scss'
import LoadingSpinner from './LoadingSpinner'
import { ConstructorProfileReviews, Review } from '../types/types'
import ReviewComponent from './ReviewComponent'
import { checkIfUserHasPermission } from '../Auth0/auth0Helpers'
import { useDictionaryContext } from '../Context/DictionaryContext'
import { useAuth0 } from '@auth0/auth0-react'
import { Button, CircularProgress } from '@mui/material'

type ReviewsProps = {
  constructorReviews: ConstructorProfileReviews | null
  setConstructorReviews: (reviews: ConstructorProfileReviews | null) => void
  oldestReviewDate: string
  fetchReviews: (lastCreatedAt: string) => void
  areReviewsLoading: boolean
  areNewReviewsLoading: boolean
}

const Reviews = ({
  constructorReviews,
  setConstructorReviews,
  oldestReviewDate,
  fetchReviews,
  areReviewsLoading,
  areNewReviewsLoading,
}: ReviewsProps) => {
  const [isAdmin, setIsAdmin] = useState(false)
  const { dictionary } = useDictionaryContext()
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    const checkIfUserIsAdmin = async () => {
      if (!isAuthenticated) return

      const token = await getAccessTokenSilently()

      const hasPermission = checkIfUserHasPermission(token, 'admin')

      hasPermission && setIsAdmin(true)
    }

    checkIfUserIsAdmin()
  }, [isAuthenticated, getAccessTokenSilently])

  if (constructorReviews === null) {
    return (
      <div className="ConstructorReviews">
        <div className="constructor-reviews-main">
          <p className="no-reviews-text">{dictionary.noReviewsYet}</p>
        </div>
      </div>
    )
  }

  if (areReviewsLoading) {
    return (
      <div className="ConstructorReviews">
        <div className="constructor-reviews-main">
          <LoadingSpinner maxHeight="15rem" />
        </div>
      </div>
    )
  }

  return (
    <div className="ConstructorReviews">
      <div className="constructor-reviews-main">
        {constructorReviews.content.map((review: Review) => (
          <div key={review.id} className="review-wrapper">
            <ReviewComponent
              review={review}
              isAdmin={isAdmin}
              constructorReviews={constructorReviews}
              setConstructorReviews={setConstructorReviews}
            />
          </div>
        ))}
        {constructorReviews.content.length >=
          import.meta.env.VITE_REACT_REVIEWS_FETCH_LIMIT && (
          <span className="submit-button-container">
            <Button
              onClick={() => fetchReviews(oldestReviewDate)}
              variant="contained"
              color="primary"
              className="load-more-button"
              disabled={areNewReviewsLoading}
            >
              {dictionary.loadMore}
            </Button>
            {areNewReviewsLoading && <CircularProgress className="loader" />}
          </span>
        )}
      </div>
    </div>
  )
}

export default Reviews
