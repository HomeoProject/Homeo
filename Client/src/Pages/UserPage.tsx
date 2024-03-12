import { useAuth0 } from '@auth0/auth0-react'
import '../style/scss/UserPage.scss'
import { Outlet, useParams, NavLink } from 'react-router-dom'
import ErrorPage from './ErrorPage'
import LoadingSpinner from '../Components/LoadingSpinner'
import { useUserContext } from '../Context/UserContext'
import { useEffect, useState } from 'react'
import UserAvatar from '../Components/UserAvatar'
import ChangeAvatarModal from '../Components/ChangeAvatarModal'
import 'react-toastify/dist/ReactToastify.css'
import { checkIfUserHasPermission } from '../Auth0/auth0Helpers'
import Banner from '../Components/Banner'

const UserPage = () => {
    const { user, isLoading, getAccessTokenSilently } = useAuth0()
    const [isConstructor, setIsConstructor] = useState<boolean>(false)
    const [isProfileComplete, setIsProfileComplete] = useState<boolean>(false)
    const [open, setOpen] = useState(false)

    const { customUser } = useUserContext()

    const { id } = useParams<{ id: string }>()

    const handleOpen = () => {
        console.log('open')
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
            ) : customUser && user && user.sub === id ? (
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
                                    {user?.name}
                                </b>
                                {isConstructor && (
                                    <p className="user-page-main-left-info-name-title">
                                        Homeo Constructor
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
                                Personal profile
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
                                Constructor profile
                            </NavLink>
                        </div>
                    </div>
                    <div className="user-page-main-right">
                        {isProfileComplete && (
                            <Banner
                                variant="warning"
                                text="In order to comment, leave reviews and communicate with or become a constructor please fill the missing personal information."
                                headline="Your profile is incomplete"
                            />
                        )}
                        <Outlet />
                    </div>
                    <ChangeAvatarModal open={open} handleClose={handleClose} />
                </div>
            ) : (
                <ErrorPage error={'You are not authorized to view this page'} />
            )}
        </div>
    )
}

export default UserPage
