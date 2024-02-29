import { useAuth0 } from '@auth0/auth0-react'
import '../style/scss/UserPage.scss'
import { Outlet, useParams, NavLink } from 'react-router-dom'
import ErrorPage from './ErrorPage'
import { styled } from '@mui/material/styles'
import { Badge, Avatar } from '@mui/material'
import ApprovedIcon from '../Assets/approved.svg'
import LoadingSpinner from '../Components/LoadingSpinner'
import { useUserContext } from '../Context/UserContext'
import defaultAvatar from '../Assets/default-avatar.svg'

const UserPage = () => {
    const { user, isLoading } = useAuth0()

    const { customUser } = useUserContext()

    const { id } = useParams<{ id: string }>()

    const SmallAvatar = styled(Avatar)(() => ({
        width: 40,
        height: 40,
    }))

    const UserAvatar = styled(Avatar)(() => ({
        width: '100%',
        height: '100%',
    }))

    return (
        <div className="UserPage">
            {isLoading ? (
                <LoadingSpinner />
            ) : user && user.sub === id ? (
                <div className="user-page-main">
                    <div className="user-page-main-left">
                        <div className="user-page-main-left-info">
                            <div className="user-page-main-left-info-avatar">
                                {customUser?.isConstructor ? (
                                    <>
                                        <button className="overlay-btn">
                                            <Badge
                                                overlap="circular"
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'right',
                                                }}
                                                badgeContent={
                                                    <SmallAvatar
                                                        alt={user?.name}
                                                        src={ApprovedIcon}
                                                    />
                                                }
                                            >
                                                <UserAvatar
                                                    alt={customUser?.email}
                                                    src={
                                                        customUser
                                                            ? customUser.avatar
                                                            : defaultAvatar
                                                    }
                                                    sx={{
                                                        width: 120,
                                                        height: 120,
                                                    }}
                                                />
                                            </Badge>
                                            <img
                                                src="https://img.icons8.com/ios-glyphs/30/000000/camera.png"
                                                alt="Change picture"
                                                className="overlay-pic"
                                            />
                                        </button>
                                    </>
                                ) : (
                                    <button className="overlay-btn">
                                        <UserAvatar
                                            alt={customUser?.email}
                                            src={
                                                customUser
                                                    ? customUser.avatar
                                                    : defaultAvatar
                                            }
                                            sx={{ width: 120, height: 120 }}
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
                                {customUser?.isConstructor && (
                                    <p>Homeo Contractor</p>
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
                                Profile
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
                                    ? 'Company'
                                    : 'Become a Contractor'}
                            </NavLink>
                        </div>
                    </div>
                    <div className="user-page-main-right">
                        <Outlet />
                    </div>
                </div>
            ) : (
                <ErrorPage error={'You are not authorized to view this page'} />
            )}
        </div>
    )
}

export default UserPage
