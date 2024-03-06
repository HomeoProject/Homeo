import { useAuth0 } from '@auth0/auth0-react'
import '../style/scss/UserPage.scss'
import { Outlet, useParams, NavLink } from 'react-router-dom'
import ErrorPage from './ErrorPage'
import LoadingSpinner from '../Components/LoadingSpinner'
import { useUserContext } from '../Context/UserContext'
import { useState } from 'react'
import UserAvatar from '../Components/UserAvatar'
import ChangeAvatarModal from '../Components/ChangeAvatarModal'

const UserPage = () => {
    const { user, isLoading } = useAuth0()

    const { customUser } = useUserContext()

    const { id } = useParams<{ id: string }>()

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

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
                                    alt=""
                                    variant="page"
                                    isApproved={customUser.isConstructor}
                                    customOnClick={handleOpen}
                                />
                            </div>
                            <div className="user-page-main-left-info-name">
                                <b>{user?.name}</b>
                                {customUser?.isConstructor && (
                                    <p>Homeo Constructor</p>
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
                                {customUser?.isConstructor
                                    ? 'Constructor profile'
                                    : 'Become a Constructor'}
                            </NavLink>
                        </div>
                    </div>
                    <div className="user-page-main-right">
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
