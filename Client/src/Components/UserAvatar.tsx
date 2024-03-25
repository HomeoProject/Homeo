import { Avatar, Badge } from '@mui/material'
import ApprovedIcon from '../Assets/approved.svg'
import CameraIcon from '../Assets/camera.svg'

type UserAvatarProps = {
  src: string
  alt: string
  isApproved: boolean
  variant?: 'page' | 'standard' | 'link'
  viewHref?: string
  customOnClick?: () => void
  maxWidth?: string
  maxHeight?: string
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
  maxWidth,
  maxHeight,
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
                width: '100%',
                height: '100%',
                maxWidth: maxWidth || '100%',
                maxHeight: maxHeight || '100%',
              }}
            />
          </Badge>
          <img src={CameraIcon} alt="Change picture" className="overlay-pic" />
        </button>
      ) : (
        <button className="overlay-btn" onClick={customOnClick}>
          <Avatar
            alt={alt}
            src={src}
            sx={{
              width: '100%',
              height: '100%',
              maxWidth: maxWidth || '100%',
              maxHeight: maxHeight || '100%',
            }}
          />
          <img src={CameraIcon} alt="Change picture" className="overlay-pic" />
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
              width: '100%',
              height: '100%',
              maxWidth: maxWidth || 40,
              maxHeight: maxHeight || 40,
            }}
          />
        </Badge>
      ) : (
        <Avatar
          alt={alt}
          src={src}
          sx={{
            width: '100%',
            height: '100%',
            maxWidth: maxWidth || 40,
            maxHeight: maxHeight || 40,
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
                width: '100%',
                height: '100%',
                maxWidth: maxWidth || 40,
                maxHeight: maxHeight || 40,
              }}
            />
          </Badge>
        </a>
      ) : (
        <Avatar
          alt={alt}
          src={src}
          sx={{
            width: '100%',
            height: '100%',
            maxWidth: maxWidth || 40,
            maxHeight: maxHeight || 40,
          }}
        />
      )
    default:
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
              maxWidth: maxWidth || 40,
              maxHeight: maxHeight || 40,
            }}
          />
        </Badge>
      ) : (
        <Avatar
          alt={alt}
          src={src}
          sx={{
            maxWidth: maxWidth || 40,
            maxHeight: maxHeight || 40,
          }}
        />
      )
  }
}

export default UserAvatar
