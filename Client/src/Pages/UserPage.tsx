import { useAuth0 } from '@auth0/auth0-react'
import '../style/scss/UserPage.scss'
import { useParams } from 'react-router-dom'
import ErrorPage from './ErrorPage'
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import ApprovedIcon from '../Assets/approved.svg'
import PersonalDataForm from '../Components/PersonalDataForm'
import { useEffect, useState } from 'react'
import { CustomUser } from '../types/types'
import LoadingSpinner from '../Components/LoadingSpinner'
import axios from 'axios'

// either make a user page with instant form or make a user page with a button that redirects to a form page that is prefilled with user data

const UserPage = () => {
  const { user, isLoading } = useAuth0()

  const [customUser, setCustomUser] = useState<CustomUser | null>(null)

  const { id } = useParams<{ id: string }>()

  const SmallAvatar = styled(Avatar)(() => ({
    width: 40,
    height: 40,
  }))

  const UserAvatar = styled(Avatar)(() => ({
    width: '100%',
    height: '100%',
  }))

  const isUserApproved: boolean = true

  useEffect(() => {
    const getCustomUser = async (): Promise<CustomUser> => {
      const response = await axios
        .get(`http://localhost:8080/api/users/${id}`)
        .then((response) => {
          return response.data
        })

      return response
    }

    if (user && user.sub === id) {
      getCustomUser().then((data) => {
        setCustomUser(data)
      })
    }
  }, [user, id, setCustomUser])

  return (
    <div className="UserPage">
      {isLoading ? (
        <LoadingSpinner />
      ) : user && user.sub === id ? (
        <div className="user-page-main">
          <div className="user-page-main-left">
            <div className="user-page-main-left-info">
              <div className="user-page-main-left-info-avatar">
                {isUserApproved ? (
                  <button className="overlay-btn">
                    <Badge
                      overlap="circular"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      badgeContent={
                        <SmallAvatar alt={user?.name} src={ApprovedIcon} />
                      }
                    >
                      <UserAvatar
                        alt={customUser?.email}
                        src={customUser?.avatar}
                      />
                    </Badge>
                    <img
                      src="https://img.icons8.com/ios-glyphs/30/000000/camera.png"
                      alt="Change picture"
                      className="overlay-pic"
                    />
                  </button>
                ) : (
                  <button className="overlay-btn">
                    <UserAvatar
                      alt={customUser?.email}
                      src={customUser?.avatar}
                    />
                    <img
                      src="https://img.icons8.com/ios-glyphs/30/000000/camera.png"
                      alt="Change picture"
                      className="overlay-pic"
                    />
                  </button>
                )}
              </div>
              <div className="user-page-main-left-info-name">
                <b>{user?.name}</b>
                {isUserApproved && <p>Homeo Contractor</p>}
              </div>
            </div>
            <div className="user-page-main-left-nav"></div>
          </div>
          <div className="user-page-main-right">
            <PersonalDataForm
              customUser={customUser}
              setCustomUser={setCustomUser}
            />
          </div>
        </div>
      ) : (
        !isLoading && (
          <ErrorPage error={'You are not authorized to view this page'} />
        )
      )}
    </div>
  )
}

export default UserPage
