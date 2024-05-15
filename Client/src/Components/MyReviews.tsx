import { useEffect, useState } from 'react'
import { useDictionaryContext } from '../Context/DictionaryContext'
import '../style/scss/components/MyReviews.scss'
import { Review } from '../types/types'
import apiClient from '../AxiosClients/apiClient'
import LoadingSpinner from './LoadingSpinner'
import MyReviewComponent from './MyReviewComponent'
import { Button, CircularProgress } from '@mui/material'
import { toast } from 'react-toastify'
import { useAuth0 } from '@auth0/auth0-react'
import { checkIfUserHasPermission } from '../Auth0/auth0Helpers'

const MyReviews = () => {
  const { dictionary } = useDictionaryContext()
  const [myReviews, setMyReviews] = useState<Review[] | null>([])
  const [areMyReviewsLoading, setAreMyReviewsLoading] = useState(false)
  const [areMyNewReviewsLoading, setAreMyNewReviewsLoading] = useState(false)
  const [oldestReviewDate, setOldestReviewDate] = useState<string>(
    new Date().toISOString()
  )
  const { getAccessTokenSilently } = useAuth0()

  const fetchMyReviews = async () => {
    setAreMyReviewsLoading(true)
    apiClient
      .get('/reviews/user/reviewed', {
        params: { lastCreatedAt: new Date().toISOString() },
      })
      .then((response) => {
        if (response.data.length === 0) {
          setMyReviews(null)
          return
        }
        setMyReviews(response.data)
        setOldestReviewDate(response.data[response.data.length - 1].createdAt)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        setAreMyReviewsLoading(false)
      })
  }

  const fetchMyNewReviews = async (lastCreatedAt: string) => {
    setAreMyNewReviewsLoading(true)
    apiClient
      .get(`/reviews/user/reviewed`, {
        params: { lastCreatedAt },
      })
      .then((response) => {
        if (myReviews?.length === 0 && response.data.length === 0) {
          setMyReviews(null)
          return
        }
        if (response.data.length === 0) {
          toast.error(dictionary.noMoreReviewsToLoad)
          return
        }
        setMyReviews([...myReviews!, ...response.data])
        setOldestReviewDate(response.data[response.data.length - 1].createdAt)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        setAreMyNewReviewsLoading(false)
      })
  }

  useEffect(() => {
    const fetchData = async () => {
      const token = await getAccessTokenSilently()
      const isProfileComplete = checkIfUserHasPermission(token, 'user')
      if (isProfileComplete) {
        fetchMyReviews()
      } else {
        setMyReviews(null)
      }
    }
    fetchData()
  }, [getAccessTokenSilently])

  if (myReviews === null) {
    return (
      <div className="MyReviews">
        <h1>{dictionary.myReviews}</h1>
        <div className="my-reviews-main-loading">
          <p className="my-reviews-main-no-reviews-message">
            {dictionary.noReviewedYet}
          </p>
        </div>
      </div>
    )
  }

  if (areMyReviewsLoading) {
    return (
      <div className="MyReviews">
        <h1>{dictionary.myReviews}</h1>
        <div className="my-reviews-main-loading">
          <LoadingSpinner maxHeight="10rem" />
        </div>
      </div>
    )
  }

  return (
    <div className="MyReviews">
      <div className="my-reviews-header">
        <h1>{dictionary.myReviews}</h1>
        <h2>{myReviews ? `( ${myReviews.length} )` : ''}</h2>
      </div>
      <div className="my-reviews-main">
        {myReviews.map((review: Review) => (
          <div key={review.id} className="my-review">
            <MyReviewComponent
              review={review}
              myReviews={myReviews}
              setMyReviews={setMyReviews}
            />
          </div>
        ))}
        {myReviews.length >= import.meta.env.VITE_REACT_REVIEWS_FETCH_LIMIT && (
          <span className="submit-button-container">
            <Button
              onClick={() => fetchMyNewReviews(oldestReviewDate)}
              variant="contained"
              color="primary"
              className="load-more-button"
              disabled={areMyNewReviewsLoading}
            >
              {dictionary.loadMore}
            </Button>
            {areMyNewReviewsLoading && <CircularProgress className="loader" />}
          </span>
        )}
      </div>
    </div>
  )
}

export default MyReviews
