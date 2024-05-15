import { Avatar, Badge } from '@mui/material'
import { Link } from 'react-router-dom'
import ApprovedIcon from '../Assets/approved.svg'
import CameraIcon from '../Assets/camera.svg'
import { styled } from '@mui/material/styles'

type UserAvatarProps = {
  src: string
  alt: string
  isApproved: boolean
  variant?: 'page' | 'standard' | 'link' | 'category' | 'category-view' | 'chat'
  viewHref?: string
  customOnClick?: () => void
  maxWidth?: string
  maxHeight?: string
  badgeWidth?: string
  badgeHeight?: string
}

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      content: '""',
    },
  },
}))

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
  if (variant === 'link' && !viewHref) {
    console.error('viewHref is required when variant is "link"!')
    variant = 'standard'
  }

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
    case 'category':
      return (
        <button className="overlay-btn" onClick={customOnClick}>
          <Avatar
            alt={alt}
            src={src}
            sx={{
              width: '100%',
              height: '100%',
              maxWidth: maxWidth || '100%',
              maxHeight: maxHeight || '100%',
              borderRadius: '10px',
            }}
          />
          <img src={CameraIcon} alt="Change picture" className="overlay-pic" />
        </button>
      )
    case 'category-view':
      return (
        <Avatar
          alt={alt}
          src={src}
          sx={{
            width: '100%',
            height: '100%',
            maxWidth: maxWidth || '100%',
            maxHeight: maxHeight || '100%',
            borderRadius: '10px',
          }}
        />
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
        <Link
          to={encodeURI(viewHref!)}
          className="user-avatar-link"
          target="_blank"
        >
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
        </Link>
      ) : (
        <Link
          to={encodeURI(viewHref!)}
          className="user-avatar-link"
          target="_blank"
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
        </Link>
      )
    case 'chat':
      return (
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
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
        </StyledBadge>
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
