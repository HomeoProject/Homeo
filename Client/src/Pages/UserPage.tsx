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

const UserPage = () => {
  const { isLoading, getAccessTokenSilently } = useAuth0()
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
    getAccessTokenSilently().then((token) => {
      const isConstructor = checkIfUserHasPermission(token, 'constructor')
      const isProfileComplete = checkIfUserHasPermission(token, 'user')
      setIsConstructor(isConstructor)
      setIsProfileComplete(isProfileComplete)
    })
  }, [getAccessTokenSilently])

  return (
    <div className="UserPage">
      {isLoading || !customUser ? (
        <LoadingSpinner />
      ) : customUser && customUser.id === id ? (
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
                to={`/user/${customUser?.id}`}
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
                to={`/user/${customUser?.id}/constructor-info`}
                className={({ isActive }) =>
                  isActive
                    ? 'user-page-main-left-nav-link active'
                    : 'user-page-main-left-nav-link'
                }
                end
              >
                {dictionary.contructorProfile}
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
            {!isConstructor && isProfileComplete && (
              <Banner
                variant="info"
                text={dictionary.incompleteProfileInfo}
                headline={dictionary.incompleteProfileInfoHeadline}
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
            path={`users/avatar/${customUser.id}`}
            method={'patch'}
          />
        </div>
      ) : (
        <ErrorPage error={dictionary.errorPageMessage} />
      )}
    </div>
  )
}

export default UserPage
