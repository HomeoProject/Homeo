import { useParams } from 'react-router'
import '../style/scss/ConstructorPage.scss'
import { useContext, useEffect, useState } from 'react'
import apiClient from '../AxiosClients/apiClient'
import {
  Constructor,
  ConstructorProfileReviews,
  CustomUser,
} from '../types/types'
import UserContext from '../Context/UserContext'
import { useDictionaryContext } from '../Context/DictionaryContext'
import LoadingSpinner from '../Components/LoadingSpinner'
import UserAvatar from '../Components/UserAvatar'
import { Button, Tooltip } from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import PaymentsIcon from '@mui/icons-material/Payments'
import StarHalfIcon from '@mui/icons-material/StarHalf'
import ErrorPage from './ErrorPage'
import Reviews from '../Components/Reviews'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { Rating } from '@mui/material'
import ReviewModal from '../Components/ReviewModal'
import { useAuth0 } from '@auth0/auth0-react'
import { checkIfUserHasPermission } from '../Auth0/auth0Helpers'
import { toast } from 'react-toastify'
import ConstructorProfileInfo from '../Components/ConstructorProfileInfo'

const ConstructorPage = () => {
  const constructorUserId = useParams<{ id: string }>().id
  const { customUser } = useContext(UserContext)
  const { getAccessTokenSilently } = useAuth0()
  const [constructorData, setConstructorData] = useState<Constructor | null>(
    null
  )
  const [constructorUserData, setConstructorUserData] =
    useState<CustomUser | null>(null)
  const [constructorReviews, setConstructorReviews] =
    useState<ConstructorProfileReviews>({
      stats: {
        averageRating: 0,
        reviewsNumber: 0,
        userId: '',
      },
      content: [],
    })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [areReviewsLoading, setAreReviewsLoading] = useState<boolean>(true)
  const [areNewReviewsLoading, setAreNewReviewsLoading] =
    useState<boolean>(false)
  const [constructorNotFound, setConstructorNotFound] = useState<boolean>(false)
  const [constructorDeleted, setConstructorDeleted] = useState<boolean>(false)
  const [isViewingOwnProfile, setIsViewingOwnProfile] = useState<boolean>(false)
  const [openReviewModal, setOpenReviewModal] = useState<boolean>(false)
  const [canUserInteract, setCanUserInteract] = useState<boolean>(false)
  const [oldestReviewDate, setOldestReviewDate] = useState<string>(
    new Date().toISOString()
  )

  const { dictionary } = useDictionaryContext()

  const handleOpenReviewModal = () => {
    setOpenReviewModal(true)
  }

  const handleCloseReviewModal = () => {
    setOpenReviewModal(false)
  }

  // Fetch reviews - triggered only once on page load
  const fetchReviews = () => {
    setAreReviewsLoading(true)

    apiClient
      .get(`/reviews/received/${encodeURI(constructorUserId!)}`, {
        params: { lastCreatedAt: new Date().toISOString() },
      })
      .then((response) => {
        apiClient
          .get(`/reviews/stats/${encodeURI(constructorUserId!)}`)
          .then((stats) => {
            setConstructorReviews({
              stats: stats.data,
              content: response.data.content,
            })
          })
          .catch((err) => {
            if (err.response.status === 404) {
              return
            }
            console.error(err)
            toast.error(dictionary.failedToGetReviewsStats)
          })
      })
      .catch((err) => {
        if (err.response.status === 404) {
          return
        }
        console.error(err)
        toast.error(dictionary.failedToLoadReviews)
      })
      .finally(() => {
        setAreReviewsLoading(false)
      })
  }

  // Fetch new reviews - triggered only by the "Load more" button
  const fetchNewReviews = (lastCreatedAt: string) => {
    setAreNewReviewsLoading(true)

    apiClient
      .get(`/reviews/received/${encodeURI(constructorUserId!)}`, {
        params: { lastCreatedAt },
      })
      .then((response) => {
        if (
          constructorReviews.stats.reviewsNumber === 0 &&
          response.data.content.length === 0
        ) {
          return
        }
        if (
          constructorReviews.stats.reviewsNumber > 0 &&
          response.data.content.length === 0
        ) {
          toast.error(dictionary.noMoreReviewsToLoad)
          return
        }

        apiClient
          .get(`/reviews/stats/${encodeURI(constructorUserId!)}`)
          .then((stats) => {
            setConstructorReviews({
              stats: stats.data,
              content: [
                ...constructorReviews.content,
                ...response.data.content,
              ],
            })
          })
          .catch((err) => {
            console.error(err)
            toast.error(dictionary.failedToGetReviewsStats)
          })

        setOldestReviewDate(
          response.data.content[response.data.content.length - 1].createdAt
        )
      })
      .catch((err) => {
        console.error(err)
        toast.error(dictionary.failedToLoadReviews)
      })
      .finally(() => {
        setAreReviewsLoading(false)
        setAreNewReviewsLoading(false)
      })
  }

  useEffect(() => {
    const fetchConstructorData = async (constructorUserId: string) => {
      return apiClient.get(`/constructors/${encodeURI(constructorUserId)}`)
    }

    const fetchConstructorUserData = async () => {
      const constructorUserData = await apiClient
        .get(`/users/${constructorUserId}`)
        .then((response) => {
          if (response.data.isDeleted) {
            setConstructorDeleted(true)
          }
          setConstructorUserData(response.data)
        })
        .catch((err) => {
          console.error(err)
          toast.error(dictionary.failedToFetchConstructorData)
        })

      return constructorUserData
    }

    const checkIfUserCanInteract = async () => {
      if (customUser) {
        const token = await getAccessTokenSilently()
        const canInteract = checkIfUserHasPermission(token, 'user')

        canInteract && setCanUserInteract(true)
      }
    }

    if (customUser && customUser.id === constructorUserId) {
      setIsViewingOwnProfile(true)
    }

    constructorUserId &&
      fetchConstructorData(constructorUserId)
        .then((response) => {
          setConstructorData(response.data)
          fetchConstructorUserData()
          fetchReviews()
          checkIfUserCanInteract()
        })
        .catch((err) => {
          setConstructorNotFound(true)
          console.error(err)
        })
        .finally(() => {
          setIsLoading(false)
        })
    // eslint-disable-next-line
  }, [customUser, constructorUserId])

  if (isLoading) {
    return (
      <div className="ConstructorPage">
        <LoadingSpinner />
      </div>
    )
  }

  if (constructorDeleted) {
    return (
      <div className="ConstructorPage">
        <ErrorPage error={dictionary.constructorDeleted} />
      </div>
    )
  }

  if (constructorNotFound) {
    return (
      <div className="ConstructorPage">
        <ErrorPage error={dictionary.constructorNotFound} />
      </div>
    )
  }

  if (constructorData && constructorUserData) {
    return (
      <div className="ConstructorPage">
        <div className="constructor-page-main">
          <ReviewModal
            reviewModalOpen={openReviewModal}
            handleClose={handleCloseReviewModal}
            receiverName={constructorUserData.firstName!}
            type="add"
            receiverId={constructorUserData.id}
            constructorReviews={constructorReviews}
            setConstructorReviews={setConstructorReviews}
          />
          <section className="constructor-page-main-info-section">
            <div className="constructor-page-main-section-content">
              <div className="constructor-page-main-section-content-avatar-wrapper">
                <UserAvatar
                  src={constructorUserData.avatar}
                  alt={constructorData.constructorEmail}
                  variant="standard"
                  maxWidth="220px"
                  maxHeight="220px"
                  isApproved={constructorUserData.isApproved}
                  badgeHeight="40px"
                  badgeWidth="40px"
                />
                <p className="constructor-page-main-section-content-mobile-name">{`${constructorUserData.firstName} ${constructorUserData.lastName}`}</p>
                <p className="constructor-page-main-section-content-mobile-title">
                  {dictionary.homeoConstructor}
                </p>
              </div>
              <div className="constructor-page-main-section-interactive-mobile">
                {customUser && (
                  <div className="constructor-page-main-section-interactive-mobile-main">
                    <Tooltip
                      title="You have to finish your profile in order to do this."
                      disableHoverListener={canUserInteract}
                      className="tooltip"
                    >
                      <div className="button-wrapper">
                        <Button
                          variant="contained"
                          color="primary"
                          className="open-review-modal-button"
                          disabled={!canUserInteract || isViewingOwnProfile}
                          onClick={handleOpenReviewModal}
                        >
                          <StarHalfIcon />
                          {dictionary.addReview}
                        </Button>
                      </div>
                    </Tooltip>

                    <Tooltip
                      title="You have to finish your profile in order to do this."
                      disableHoverListener={canUserInteract}
                      className="tooltip"
                    >
                      <div className="button-wrapper">
                        <Button
                          variant="contained"
                          color="primary"
                          className="open-chat-button"
                          disabled={!canUserInteract || isViewingOwnProfile}
                        >
                          <ChatIcon />
                          {dictionary.chat}
                        </Button>
                      </div>
                    </Tooltip>
                  </div>
                )}
              </div>
              <div className="constructor-page-main-section-content-info">
                <p className="constructor-page-main-section-content-info-name">{`${constructorUserData.firstName} ${constructorUserData.lastName}`}</p>
                <p className="constructor-page-main-section-content-info-title">
                  {dictionary.homeoConstructor}
                </p>
                <div className="constructor-page-main-section-content-info-rating-wrapper">
                  <Rating
                    name="simple-controlled"
                    value={constructorReviews.stats.averageRating || 0}
                    precision={0.5}
                    icon={<StarIcon color="primary" />}
                    emptyIcon={<StarBorderIcon color="primary" />}
                    max={constructorReviews.stats.reviewsNumber > 0 ? 5 : 1}
                    readOnly
                  />
                  <p className="constructor-page-main-section-content-info-rating">{`(${
                    constructorReviews.stats.reviewsNumber > 0
                      ? parseFloat(
                          (
                            Math.round(
                              constructorReviews.stats.averageRating * 100
                            ) / 100
                          ).toFixed(2)
                        )
                      : dictionary.noReviewsYetShort
                  })`}</p>
                </div>
                <div className="constructor-page-main-section-content-info-icon-wrapper">
                  <EmailIcon color="primary" />
                  <p className="constructor-page-main-section-content-info-standard">
                    {constructorData.constructorEmail}
                  </p>
                </div>
                <div className="constructor-page-main-section-content-info-icon-wrapper">
                  <PhoneIcon color="primary" />
                  <p className="constructor-page-main-section-content-info-standard">
                    {constructorData.phoneNumber
                      .split('')
                      .map((char, index) => {
                        if (index === 3 || index === 6) return `-${char}`
                        return char
                      })}
                  </p>
                </div>
                <div className="constructor-page-main-section-content-info-icon-wrapper">
                  <MonetizationOnIcon color="primary" />
                  <p className="constructor-page-main-section-content-info-standard">
                    {constructorData.minRate}$ / hour
                  </p>
                </div>
                <div className="constructor-page-main-section-content-info-icon-wrapper">
                  <PaymentsIcon color="primary" />
                  <p className="constructor-page-main-section-content-info-standard">
                    {constructorData.paymentMethods.map((method, index) => {
                      //only first letter should be uppercase, not the whole word
                      const lowercasedMethod =
                        method.charAt(0) + method.slice(1).toLowerCase()
                      if (index === constructorData.paymentMethods.length - 1)
                        return lowercasedMethod
                      return `${lowercasedMethod}, `
                    })}
                  </p>
                </div>
              </div>
            </div>
            <div className="constructor-page-main-section-interactive">
              {customUser && (
                <div className="constructor-page-main-section-interactive-main">
                  <Tooltip
                    title={
                      !canUserInteract
                        ? 'You have to finish your profile in order to do this.'
                        : ''
                    }
                    disableHoverListener={canUserInteract}
                    className="tooltip"
                  >
                    <div className="button-wrapper">
                      <Button
                        variant="contained"
                        color="primary"
                        className="open-review-modal-button"
                        disabled={!canUserInteract || isViewingOwnProfile}
                        onClick={handleOpenReviewModal}
                      >
                        <StarHalfIcon />
                        {dictionary.addReview}
                      </Button>
                    </div>
                  </Tooltip>
                  <Tooltip
                    title={
                      !canUserInteract
                        ? 'You have to finish your profile in order to do this.'
                        : ''
                    }
                    disableHoverListener={canUserInteract}
                    className="tooltip"
                  >
                    <div className="button-wrapper">
                      <Button
                        variant="contained"
                        color="primary"
                        className="open-chat-button"
                        disabled={!canUserInteract || isViewingOwnProfile}
                      >
                        <ChatIcon />
                        {dictionary.chat}
                      </Button>
                    </div>
                  </Tooltip>
                </div>
              )}
            </div>
          </section>
          <ConstructorProfileInfo constructorData={constructorData} />
          <div className="section-header-wrapper">
            <StarHalfIcon className="section-header-icon" />
            <h1 className="section-header">{dictionary.reviews}</h1>
          </div>
          <section className="constructor-page-main-section">
            <Reviews
              constructorReviews={constructorReviews}
              setConstructorReviews={setConstructorReviews}
              oldestReviewDate={oldestReviewDate}
              fetchNewReviews={fetchNewReviews}
              areReviewsLoading={areReviewsLoading}
              areNewReviewsLoading={areNewReviewsLoading}
            />
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="ConstructorPage">
      <LoadingSpinner />
    </div>
  )
}

export default ConstructorPage
