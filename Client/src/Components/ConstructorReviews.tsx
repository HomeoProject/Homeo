import { useEffect, useState } from 'react'
import '../style/scss/components/ConstructorReviews.scss'
import apiClient from '../AxiosClients/apiClient'
import LoadingSpinner from './LoadingSpinner'
import { ConstructorProfileReviews, Review } from '../types/types'
import ReviewComponent from './ReviewComponent'
import { checkIfUserHasPermission } from '../Auth0/auth0Helpers'
import { useDictionaryContext } from '../Context/DictionaryContext'
import { useAuth0 } from '@auth0/auth0-react'

type ConstructorReviewsProps = {
  userId: string | undefined
}

const ConstructorReviews = ({ userId }: ConstructorReviewsProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [reviews, setReviews] = useState<ConstructorProfileReviews | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const { dictionary } = useDictionaryContext()

  const { isAuthenticated, getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    apiClient
      .get(`/reviews/received/${userId}`, {
        params: {
          lastCreatedAt: new Date().toISOString(),
        },
      })
      .then((reviewsResponse) => {
        setReviews(reviewsResponse.data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      })
  }, [userId])

  useEffect(() => {
    const checkIfUserIsAdmin = async () => {
      if (!isAuthenticated) return

      const token = await getAccessTokenSilently()

      const hasPermission = await checkIfUserHasPermission(token, 'admin')

      hasPermission && setIsAdmin(true)
    }

    checkIfUserIsAdmin()
  }, [isAuthenticated, getAccessTokenSilently])

  return (
    <div className="ConstructorReviews">
      <div className="constructor-reviews-main">
        {isLoading ? (
          <LoadingSpinner />
        ) : !reviews ? (
          <p className="no-reviews-text">
            {dictionary.noReviewsYet}
          </p>
        ) : (
          reviews &&
          reviews.content.map((review: Review) => (
            <div key={review.id} className="review-wrapper">
              <ReviewComponent
                review={review}
                isAdmin={isAdmin}
                reviews={reviews}
                setReviews={setReviews}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ConstructorReviews
