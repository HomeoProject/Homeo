import { useState } from 'react'
import { useDictionaryContext } from '../Context/DictionaryContext'
import UserCardDialog from './UserCardDialog'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import PublicIcon from '@mui/icons-material/Public'
import { Link } from 'react-router-dom'
import { useCategoriesContext } from '../Context/CategoriesContext'
import '../style/scss/components/UserCard.scss'

import StarIcon from '@mui/icons-material/Star'
import PhoneIcon from '@mui/icons-material/Phone'
import PaymentsIcon from '@mui/icons-material/Payments'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'

type UserCardProps = {
  isDialog?: boolean
  customConstructor: {
    userId: string
    avatar: string
    firstName: string
    categoryIds: number[]
    phoneNumber: string
    cities: string[]
    email: string
    minRate: number
    averageRating: number
    paymentMethods: string[]
  }
}

const UserCard = ({ isDialog, customConstructor }: UserCardProps) => {
  const [open, setOpen] = useState(false)

  const { dictionary } = useDictionaryContext()
  const { categories } = useCategoriesContext()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div className="UserCard">
      <div className="user-card-avatar">
        <img src={customConstructor.avatar} alt="avatar" />
      </div>
      <Card sx={{ padding: '15px', height: '375px', width: '275px' }}>
        <div className="user-card-container">
          <div className="user-card-container-user-section">
            <span className="user-card-container-user-section-name">
              {customConstructor.firstName}
            </span>
            <span className="user-card-container-user-section-title">
              {customConstructor &&
                categories.map((category) => {
                  if (customConstructor.categoryIds.includes(category.id)) {
                    return category.name + ' '
                  }
                })}
            </span>
          </div>
          <div className="user-card-container-info-section">
            <div className="user-card-container-info-section-row">
              <StarIcon color="primary" />
              <span className="user-card-container-info-section-row-value">
                {customConstructor.averageRating
                  ? customConstructor.averageRating
                  : 'No reviews yet'}
              </span>
            </div>
            <div className="user-card-container-info-section-row">
              <PhoneIcon color="primary" />
              <span className="user-card-container-info-section-row-value">
                {customConstructor.phoneNumber}
              </span>
            </div>
            <div className="user-card-container-info-section-row">
              <PublicIcon color="primary" />
              <span className="user-card-container-info-section-row-value">
                {customConstructor.cities.join(', ')}
              </span>
            </div>
            <div className="user-card-container-info-section-row">
              <MonetizationOnIcon color="primary" />
              <span className="user-card-container-info-section-row-value">
                {customConstructor.minRate} $/h
              </span>
            </div>
            <div className="user-card-container-info-section-row">
              <PaymentsIcon color="primary" />
              <span className="user-card-container-info-section-row-value">
                {customConstructor.paymentMethods
                  .map((el) => el.charAt(0) + el.slice(1).toLowerCase())
                  .join(', ')}
              </span>
            </div>
          </div>
          <div className="user-card-container-footer">
            {isDialog ? (
              <Link to={`/constructor/${encodeURI(customConstructor.userId)}`}>
                <Button
                  variant="contained"
                  sx={{ width: '100%', fontWeight: 700 }}
                  onClick={handleClickOpen}
                >
                  {dictionary.goToProfile}
                </Button>
              </Link>
            ) : (
              <Button
                variant="contained"
                sx={{ width: '100%', fontWeight: 700 }}
                onClick={handleClickOpen}
              >
                {dictionary.moreWord}
              </Button>
            )}
          </div>
        </div>
      </Card>
      {!isDialog && (
        <UserCardDialog
          open={open}
          handleClose={handleClose}
          // eslint-disable-next-line
          customConstructor={customConstructor}
        />
      )}
    </div>
  )
}

export default UserCard
