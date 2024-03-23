import { useParams } from 'react-router'
import '../style/scss/ConstructorPage.scss'
import { useContext, useEffect, useState } from 'react'
import apiClient from '../AxiosClients/apiClient'
import { ConstructorProfile } from '../types/types'
import UserContext from '../Context/UserContext'
import { checkIfUserHasPermission } from '../Auth0/auth0Helpers'
import { useAuth0 } from '@auth0/auth0-react'
import LoadingSpinner from '../Components/LoadingSpinner'
import UserAvatar from '../Components/UserAvatar'
import { Button } from '@mui/material'
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

const ConstructorPage = () => {
  const id = useParams().id
  const { customUser } = useContext(UserContext)
  const [constructorData, setConstructorData] =
    useState<ConstructorProfile | null>(null)
  const [isViewingOwnProfile, setIsViewingOwnProfile] = useState(false)

  const { isAuthenticated, getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    apiClient
      .get(`/constructors/${id}`)
      .then(async (constructorResponse) => {
        setConstructorData(constructorResponse.data)

        if (!isAuthenticated) return

        const token = await getAccessTokenSilently()
        const isViewerConstructor = checkIfUserHasPermission(
          token,
          'constructor'
        )

        if (
          isViewerConstructor &&
          customUser &&
          constructorResponse.data.userId === customUser.id
        ) {
          setIsViewingOwnProfile(true)
          setConstructorData({
            ...constructorResponse.data,
            avatar: customUser.avatar,
            firstName: customUser.firstName,
            lastName: customUser.lastName,
            isApproved: customUser.isApproved,
            isOnline: customUser.isOnline,
            isDeleted: customUser.isDeleted,
          })

          return
        }

        return constructorResponse.data
      })
      .then((partialConstructorData) => {
        if (!partialConstructorData) return

        apiClient
          .get(`/users/${partialConstructorData.userId}`)
          .then((userResponse) => {
            setConstructorData({
              ...partialConstructorData,
              avatar: userResponse.data.avatar,
              firstName: userResponse.data.firstName,
              lastName: userResponse.data.lastName,
              isApproved: userResponse.data.isApproved,
              isOnline: userResponse.data.isOnline,
              isDeleted: userResponse.data.isDeleted,
            })
          })
          .catch((err) => {
            console.error(err)
          })
      })
      .catch((err) => {
        console.error(err)
      })
  }, [customUser, getAccessTokenSilently, id, isAuthenticated])

  return (
    <div className="ConstructorPage">
      {!constructorData || !customUser ? (
        <LoadingSpinner />
      ) : (
        <div className="constructor-page-main">
          <section className="constructor-page-main-info-section">
            <div className="constructor-page-main-section-content">
              <div className="constructor-page-main-section-content-avatar-wrapper">
                <UserAvatar
                  src={constructorData.avatar}
                  alt={constructorData.constructorEmail}
                  variant="standard"
                  maxWidth="200px"
                  maxHeight="200px"
                  isApproved={constructorData.isApproved}
                />
                <p className="constructor-page-main-section-content-mobile-name">{`${constructorData.firstName} ${constructorData.lastName}`}</p>
                <p className="constructor-page-main-section-content-mobile-title">
                  Homeo Constructor
                </p>
              </div>
              {!isViewingOwnProfile && (
                <Button
                  variant="contained"
                  color="primary"
                  style={{ display: 'flex', gap: '5px', width: 'min-content' }}
                  className="open-chat-button-mobile"
                >
                  <ChatIcon />
                  Chat
                </Button>
              )}
              <div className="constructor-page-main-section-content-info">
                <p className="constructor-page-main-section-content-info-name">{`${constructorData.firstName} ${constructorData.lastName}`}</p>
                <p className="constructor-page-main-section-content-info-title">
                  Homeo Constructor
                </p>
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
              {!isViewingOwnProfile && (
                <Button
                  variant="contained"
                  color="primary"
                  className="open-chat-button"
                >
                  <ChatIcon />
                  Chat
                </Button>
              )}
            </div>
          </section>
          <section className="constructor-page-main-section">
            <div className="constructor-page-main-section-title-wrapper">
              <PersonIcon color="primary" />
              <h1 className="constructor-page-main-section-title">About me</h1>
            </div>
            <p className="constructor-page-main-section-content">
              {constructorData.aboutMe}
            </p>
            <div className="constructor-page-main-section-title-wrapper">
              <BuildIcon color="primary" />
              <h1 className="constructor-page-main-section-title">
                Experience
              </h1>
            </div>
            <p className="constructor-page-main-section-content">
              {constructorData.experience}
            </p>
            <div className="constructor-page-main-section-title-wrapper">
              <PlumbingIcon color="primary" />
              <h1 className="constructor-page-main-section-title">
                Categories
              </h1>
            </div>
            <p className="constructor-page-main-section-content">
              {constructorData.categories.map((category, index) => {
                if (index === constructorData.categories.length - 1)
                  return category.name
                return `${category.name}, `
              })}
            </p>
            <div className="constructor-page-main-section-title-wrapper">
              <LocationCityIcon color="primary" />
              <h1 className="constructor-page-main-section-title">
                Cities I work in
              </h1>
            </div>
            <p className="constructor-page-main-section-content">
              {constructorData.cities.map((city, index) => {
                if (index === constructorData.cities.length - 1) return city
                return `${city}, `
              })}
            </p>
            <div className="constructor-page-main-section-title-wrapper">
              <PublicIcon color="primary" />
              <h1 className="constructor-page-main-section-title">Languages</h1>
            </div>
            <p className="constructor-page-main-section-content">
              {constructorData.languages.map((language, index) => {
                if (index === constructorData.languages.length - 1)
                  return language
                return `${language}, `
              })}
            </p>
          </section>
        </div>
      )}
    </div>
  )
}

export default ConstructorPage
