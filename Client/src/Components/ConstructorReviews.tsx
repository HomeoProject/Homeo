import { useEffect, useState } from 'react'
import '../style/scss/components/ConstructorReviews.scss'
import LoadingSpinner from './LoadingSpinner'
import { ConstructorProfileReviews, Review } from '../types/types'
import ReviewComponent from './ReviewComponent'
import { checkIfUserHasPermission } from '../Auth0/auth0Helpers'
import { useDictionaryContext } from '../Context/DictionaryContext'
import { useAuth0 } from '@auth0/auth0-react'

type ConstructorReviewsProps = {
  reviews: ConstructorProfileReviews
  fetchReviews: () => void
}

const ConstructorReviews = ({
  reviews,
  fetchReviews,
}: ConstructorReviewsProps) => {
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

  return (
    <div className="ConstructorReviews">
      <div className="constructor-reviews-main">
        {!reviews ? (
          <LoadingSpinner />
        ) : !reviews?.content.length ? (
          <p className="no-reviews-text">{dictionary.noReviewsYet}</p>
        ) : (
          reviews &&
          reviews.content.map((review: Review) => (
            <div key={review.id} className="review-wrapper">
              <ReviewComponent
                review={review}
                isAdmin={isAdmin}
                fetchReviews={fetchReviews}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ConstructorReviews
