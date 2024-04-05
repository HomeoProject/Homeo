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
import PersonIcon from '@mui/icons-material/Person'
import BuildIcon from '@mui/icons-material/Build'
import PlumbingIcon from '@mui/icons-material/Plumbing'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import PublicIcon from '@mui/icons-material/Public'
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

const ConstructorPage = () => {
  const constructorId = useParams<{ id: string }>().id
  const { customUser } = useContext(UserContext)
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [constructorData, setConstructorData] = useState<Constructor | null>(
    null
  )
  const [constructorUserData, setConstructorUserData] =
    useState<CustomUser | null>(null)
  const [constructorReviews, setConstructorReviews] =
    useState<ConstructorProfileReviews | null>({
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

  const fetchReviews = (lastCreatedAt: string) => {
    if (constructorReviews?.content.length === 0) {
      setAreReviewsLoading(true)
    } else {
      setAreNewReviewsLoading(true)
    }

    apiClient
      .get(`/reviews/received/${constructorId}`, {
        params: { lastCreatedAt },
      })
      .then((response) => {
        if (
          constructorReviews?.content.length === 0 &&
          response.data.content.length === 0
        ) {
          setConstructorReviews(null)
          return
        }
        if (
          response.data.content.length === 0 &&
          constructorReviews &&
          constructorReviews.content.length > 0
        ) {
          toast.error(dictionary.noMoreReviewsToLoad)
          return
        }
        setConstructorReviews({
          ...constructorReviews!,
          content: [...response.data.content],
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
    const fetchConstructorData = () => {
      apiClient
        .get(`/constructors/${constructorId}`)
        .then((response) => {
          setConstructorData(response.data)
        })
        .catch((err) => {
          console.error(err)
          toast.error('An error occurred while fetching constructor data')
        })
    }

    const fetchConstructorUserData = async () => {
      const constructorUserData = await apiClient
        .get(`/users/${constructorId}`)
        .then((response) => {
          setConstructorUserData(response.data)
          return response.data
        })
        .catch((err) => {
          console.error(err)
          toast.error('An error occurred while fetching constructor user data')
        })

      return constructorUserData
    }

    const fetchData = async () => {
      try {
        fetchConstructorData()
        fetchConstructorUserData()
        fetchReviews(new Date().toISOString())
      } catch (err) {
        console.error(err)
        setConstructorNotFound(true)
      } finally {
        setIsLoading(false)
      }
    }

    const checkIfUserCanInteract = async () => {
      if (isAuthenticated && customUser) {
        const token = await getAccessTokenSilently()
        const canInteract = checkIfUserHasPermission(token, 'user')

        canInteract && setCanUserInteract(true)
      }
    }

    if (customUser && customUser.id === constructorId) {
      setIsViewingOwnProfile(true)
    }

    fetchData()
    checkIfUserCanInteract()
    // eslint-disable-next-line
  }, [customUser, constructorId, isAuthenticated, getAccessTokenSilently])

  return (
    <div className="ConstructorPage">
      {isLoading ? (
        <LoadingSpinner />
      ) : !constructorNotFound &&
        constructorData &&
        constructorUserData &&
        constructorReviews ? (
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
                {isAuthenticated && (
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
                    value={constructorReviews?.stats?.averageRating || 0}
                    precision={0.5}
                    icon={<StarIcon color="primary" />}
                    emptyIcon={<StarBorderIcon color="primary" />}
                    max={5}
                    readOnly
                  />
                  <p className="constructor-page-main-section-content-info-rating">{`(${
                    parseFloat(
                      (
                        Math.round(
                          constructorReviews?.stats?.averageRating * 100
                        ) / 100
                      ).toFixed(2)
                    ) || 0
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
              {isAuthenticated && (
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
          <section className="constructor-page-main-section">
            <div className="constructor-page-main-section-title-wrapper">
              <PersonIcon
                className="constructor-page-main-section-icon"
                color="primary"
              />
              <h1 className="constructor-page-main-section-title">
                {dictionary.aboutMe}
              </h1>
            </div>
            <p className="constructor-page-main-section-content">
              {constructorData.aboutMe}
            </p>
            <div className="constructor-page-main-section-title-wrapper">
              <BuildIcon
                className="constructor-page-main-section-icon"
                color="primary"
              />
              <h1 className="constructor-page-main-section-title">
                {dictionary.experience}
              </h1>
            </div>
            <p className="constructor-page-main-section-content">
              {constructorData.experience}
            </p>
            <div className="constructor-page-main-section-title-wrapper">
              <PlumbingIcon
                className="constructor-page-main-section-icon"
                color="primary"
              />
              <h1 className="constructor-page-main-section-title">
                {dictionary.categories}
              </h1>
            </div>
            <p className="constructor-page-main-section-content">
              {constructorData.categories.map((category, index) => {
                if (index === constructorData!.categories.length - 1)
                  return category.name
                return `${category.name}, `
              })}
            </p>
            <div className="constructor-page-main-section-title-wrapper">
              <LocationCityIcon
                className="constructor-page-main-section-icon"
                color="primary"
              />
              <h1 className="constructor-page-main-section-title">
                {dictionary.workingCities}
              </h1>
            </div>
            <p className="constructor-page-main-section-content">
              {constructorData.cities.map((city, index) => {
                if (index === constructorData!.cities.length - 1) return city
                return `${city}, `
              })}
            </p>
            <div className="constructor-page-main-section-title-wrapper">
              <PublicIcon
                className="constructor-page-main-section-icon"
                color="primary"
              />
              <h1 className="constructor-page-main-section-title">
                {dictionary.languages}
              </h1>
            </div>
            <p className="constructor-page-main-section-content">
              {constructorData.languages.map((language, index) => {
                if (index === constructorData.languages.length - 1)
                  return language
                return `${language}, `
              })}
            </p>
          </section>
          <div className="section-header-wrapper">
            <StarHalfIcon className="section-header-icon" />
            <h1 className="section-header">{dictionary.reviews}</h1>
          </div>
          <section className="constructor-page-main-section">
            <Reviews
              constructorReviews={constructorReviews}
              setConstructorReviews={setConstructorReviews}
              oldestReviewDate={oldestReviewDate}
              fetchReviews={fetchReviews}
              areReviewsLoading={areReviewsLoading}
              areNewReviewsLoading={areNewReviewsLoading}
            />
          </section>
        </div>
      ) : (
        <ErrorPage error={dictionary.contructorDownloadError} />
      )}
    </div>
  )
}

export default ConstructorPage
