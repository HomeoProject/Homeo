import { Avatar, Badge } from '@mui/material'
import ApprovedIcon from '../Assets/approved.svg'
import CameraIcon from '../Assets/camera.svg'

type UserAvatarProps = {
    src: string
    alt: string
    isApproved: boolean
    variant: 'page' | 'standard' | 'link'
    viewHref?: string
    customOnClick?: () => void
    width?: string
    height?: string
    badgeWidth?: string
    badgeHeight?: string
}

const UserAvatar = ({
    src,
    alt,
    isApproved,
    variant,
    viewHref,
    customOnClick,
    width,
    height,
    badgeWidth,
    badgeHeight,
}: UserAvatarProps) => {
    switch (variant) {
        case 'page':
            return isApproved ? (
                <button className="overlay-btn" onClick={customOnClick}>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        badgeContent={
                            <Avatar
                                alt={alt}
                                src={ApprovedIcon}
                                sx={{
                                    width: badgeWidth ? badgeWidth : 40,
                                    height: badgeHeight ? badgeHeight : 40,
                                }}
                            />
                        }
                    >
                        <Avatar
                            alt={alt}
                            src={src}
                            sx={{
                                width: width ? width : '100%',
                                height: height ? height : '100%',
                            }}
                        />
                    </Badge>
                    <img
                        src={CameraIcon}
                        alt="Change picture"
                        className="overlay-pic"
                    />
                </button>
            ) : (
                <button className="overlay-btn" onClick={customOnClick}>
                    <Avatar
                        alt={alt}
                        src={src}
                        sx={{
                            width: width ? width : '100%',
                            height: height ? height : '100%',
                        }}
                    />
                    <img
                        src={CameraIcon}
                        alt="Change picture"
                        className="overlay-pic"
                    />
                </button>
            )
        case 'standard':
            return isApproved ? (
                <Badge
                    overlap="circular"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    badgeContent={
                        <Avatar
                            alt={alt}
                            src={ApprovedIcon}
                            sx={{
                                width: badgeWidth ? badgeWidth : 20,
                                height: badgeHeight ? badgeHeight : 20,
                            }}
                        />
                    }
                >
                    <Avatar
                        alt={alt}
                        src={src}
                        sx={{
                            width: width ? width : 40,
                            height: height ? height : 40,
                        }}
                    />
                </Badge>
            ) : (
                <Avatar
                    alt={alt}
                    src={src}
                    sx={{
                        width: width ? width : 40,
                        height: height ? height : 40,
                    }}
                />
            )
        case 'link':
            return isApproved ? (
                <a href={viewHref} className="user-avatar-link">
                    <Badge
                        overlap="circular"
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        badgeContent={
                            <Avatar
                                alt={alt}
                                src={ApprovedIcon}
                                sx={{
                                    width: badgeWidth ? badgeWidth : 20,
                                    height: badgeHeight ? badgeHeight : 20,
                                }}
                            />
                        }
                    >
                        <Avatar
                            alt={alt}
                            src={src}
                            sx={{
                                width: width ? width : 40,
                                height: height ? height : 40,
                            }}
                        />
                    </Badge>
                </a>
            ) : (
                <Avatar
                    alt={alt}
                    src={src}
                    sx={{
                        width: width ? width : 40,
                        height: height ? height : 40,
                    }}
                />
            )
        default:
            return (
                <Avatar
                    alt={alt}
                    src={src}
                    sx={{
                        width: width ? width : 40,
                        height: height ? height : 40,
                    }}
                />
            )
    }
}

export default UserAvatar
