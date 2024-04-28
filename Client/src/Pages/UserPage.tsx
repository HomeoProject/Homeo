import { useAuth0 } from '@auth0/auth0-react'
import '../style/scss/UserPage.scss'
import { Outlet, useParams, NavLink } from 'react-router-dom'
import ErrorPage from './ErrorPage'
import LoadingSpinner from '../Components/LoadingSpinner'
import { useUserContext } from '../Context/UserContext'
import { useDictionaryContext } from '../Context/DictionaryContext'
import { useEffect, useState } from 'react'
import UserAvatar from '../Components/UserAvatar'
import UploadPictureModal from '../Components/UploadPictureModal'
import 'react-toastify/dist/ReactToastify.css'
import { checkIfUserHasPermission } from '../Auth0/auth0Helpers'
import Banner from '../Components/Banner'
import apiClient from '../AxiosClients/apiClient'
import { toast } from 'react-toastify'

const UserPage = () => {
  const { getAccessTokenSilently } = useAuth0()
  const [isLoading, setIsLoading] = useState(true)
  const [isConstructor, setIsConstructor] = useState<boolean>(false)
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(false)
  const [open, setOpen] = useState(false)

  const { customUser } = useUserContext()
  const { dictionary } = useDictionaryContext()

  const { id } = useParams<{ id: string }>()

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => setOpen(false)

  useEffect(() => {
    customUser &&
      getAccessTokenSilently()
        .then((token) => {
          const isConstructor = checkIfUserHasPermission(token, 'constructor')
          const isProfileComplete = checkIfUserHasPermission(token, 'user')
          setIsConstructor(isConstructor)
          setIsProfileComplete(isProfileComplete)
        })
        .catch((error) => {
          console.error(error)
          toast.error(dictionary.errorLoadingUser)
          setIsConstructor(false)
          setIsProfileComplete(false)
        })
        .finally(() => {
          setIsLoading(false)
        })

    // If the user is not loaded in 10 seconds, stop loading
    setTimeout(() => {
      setIsLoading(false)
    }, 10000)

    // eslint-disable-next-line
  }, [getAccessTokenSilently, customUser])

  if (!isLoading && !customUser) {
    return (
      <div className="UserPage">
        <ErrorPage error={dictionary.timeoutError} />
      </div>
    )
  }

  if (customUser && customUser.id !== id) {
    return (
      <div className="UserPage">
        <ErrorPage error={dictionary.errorPageMessage} />
      </div>
    )
  }

  if (customUser) {
    return (
      <div className="UserPage">
        <div className="user-page-main">
          <div className="user-page-main-left">
            <div className="user-page-main-left-info">
              <div className="user-page-main-left-info-avatar">
                <UserAvatar
                  src={customUser.avatar}
                  alt={customUser.email}
                  variant="page"
                  isApproved={customUser.isApproved}
                  customOnClick={handleOpen}
                />
              </div>
              <div className="user-page-main-left-info-name">
                <b className="user-page-main-left-info-name-email">
                  {!isProfileComplete
                    ? customUser.email
                    : `${customUser.firstName} ${customUser.lastName}`}
                </b>
                {isConstructor && (
                  <p className="user-page-main-left-info-name-title">
                    {dictionary.homeoConstructor}
                  </p>
                )}
              </div>
            </div>
            <div className="user-page-main-left-nav">
              <NavLink
                to={`/user/${encodeURI(customUser?.id)}`}
                className={({ isActive }) =>
                  isActive
                    ? 'user-page-main-left-nav-link active'
                    : 'user-page-main-left-nav-link'
                }
                end
              >
                {dictionary.personalProfile}
              </NavLink>
              <NavLink
                to={`/user/${encodeURI(customUser?.id)}/constructor-info`}
                className={({ isActive }) =>
                  isActive
                    ? 'user-page-main-left-nav-link active'
                    : 'user-page-main-left-nav-link'
                }
                end
              >
                {dictionary.constructorProfile}
              </NavLink>
              <NavLink
                to={`/user/${encodeURI(customUser?.id)}/my-reviews`}
                className={({ isActive }) =>
                  isActive
                    ? 'user-page-main-left-nav-link active'
                    : 'user-page-main-left-nav-link'
                }
                end
              >
                {dictionary.myReviews}
              </NavLink>
            </div>
          </div>
          <div className="user-page-main-right">
            {!isProfileComplete && (
              <Banner
                variant="warning"
                text={dictionary.incompleteProfileWarning}
                headline={dictionary.incompleteProfileWarningHeadline}
              />
            )}
            <Outlet />
          </div>
          <UploadPictureModal
            open={open}
            handleClose={handleClose}
            maxSize={1}
            minHeight={200}
            minWidth={200}
            client={apiClient}
            path={`users/avatar/${encodeURI(customUser.id)}`}
            method={'patch'}
            customInitSource={customUser.avatar}
            customHeadline={dictionary.changeYourAvatar}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="UserPage">
      <LoadingSpinner />
    </div>
  )
}

export default UserPage
