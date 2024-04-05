import { useEffect, useState } from 'react'
import { useDictionaryContext } from '../Context/DictionaryContext'
import '../style/scss/components/MyReviews.scss'
import { Review } from '../types/types'
import apiClient from '../AxiosClients/apiClient'
import LoadingSpinner from './LoadingSpinner'
import MyReviewComponent from './MyReviewComponent'
import { Button, CircularProgress } from '@mui/material'
import { toast } from 'react-toastify'

const MyReviews = () => {
  const { dictionary } = useDictionaryContext()
  const [myReviews, setMyReviews] = useState<Review[] | null>([])
  const [isLoading, setIsLoading] = useState(false)
  const [oldestReviewDate, setOldestReviewDate] = useState<string>(
    new Date().toISOString()
  )

  const fetchMyReviews = async (lastCreatedAt: string) => {
    setIsLoading(true)
    apiClient
      .get(`/reviews/user/reviewed?lastCreatedAt=${lastCreatedAt}`)
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
        setTimeout(() => {
          setIsLoading(false)
        }, 2000)
      })
  }

  useEffect(() => {
    fetchMyReviews(oldestReviewDate)
    // eslint-disable-next-line
  }, [])

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

  if (myReviews?.length === 0) {
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
      <h1>{dictionary.myReviews}</h1>
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
              onClick={() => fetchMyReviews(oldestReviewDate)}
              variant="contained"
              color="primary"
              className="load-more-button"
              disabled={isLoading}
            >
              {dictionary.loadMore}
            </Button>
            {isLoading && <CircularProgress className="loader" />}
          </span>
        )}
      </div>
    </div>
  )
}

export default MyReviews
