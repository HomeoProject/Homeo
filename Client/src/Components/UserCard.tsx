import { useState } from 'react'
import { useDictionaryContext } from '../Context/DictionaryContext'
import Karol from '../assets/Karol.jpg'
import UserCardDialog from './UserCardDialog'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import PublicIcon from '@mui/icons-material/Public'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import SmartphoneIcon from '@mui/icons-material/Smartphone'
import { useCategoriesContext } from '../Context/CategoriesContext'
import '../style/scss/components/UserCard.scss'

type UserCardProps = {
  isDialog?: boolean,
  constructor?: {
    avatar: string,
    firstName: string,
    categoryIds: string[],
    phoneNumber: string,
    cities: string[],
    email: string,
    minRate: number,
    avarageRate: number
  }
}

const UserCard = ({ isDialog, constructor }: UserCardProps) => {
  const [open, setOpen] = useState(false)

  const { dictionary } = useDictionaryContext()
  const { categories, setCategories } = useCategoriesContext()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  // some

  return (
    <div className="UserCard">
      <div className="user-card-avatar">
        <img src={constructor?.avatar} alt="avatar" />
      </div>
      <Card sx={{ padding: '15px' }}>
        <div className="user-card-container">
          <div className="user-card-container-user-section">
            <span className="user-card-container-user-section-name">
              {constructor?.firstName}
            </span>
            <span className="user-card-container-user-section-title">
              {categories.map((category) => {
                if (constructor?.categoryIds.includes(category.id)) {
                  return category.name + ' '
                }
              })}
            </span>
          </div>
          <div className="user-card-container-info-section">
            <div className="user-card-container-info-section-row">
              <SmartphoneIcon />
              <span className="user-card-container-info-section-row-value">
                {constructor?.phoneNumber}
              </span>
            </div>
            <div className="user-card-container-info-section-row">
              <PublicIcon />
              <span className="user-card-container-info-section-row-value">
                {constructor?.cities.join(', ')}
              </span>
            </div>
            <div className="user-card-container-info-section-row">
              <MailOutlineIcon />
              <span className="user-card-container-info-section-row-value">
                {constructor?.email}
              </span>
            </div>
            <div className="user-card-container-info-section-row">
              <AttachMoneyIcon />
              <span className="user-card-container-info-section-row-value">
                {constructor?.minRate} zł/h
              </span>
            </div>
            <div className="user-card-container-info-section-row">
              <StarOutlineIcon />
              <span className="user-card-container-info-section-row-value">
                {constructor?.avarageRate}
              </span>
            </div>
          </div>
          <div className="user-card-container-footer">
            {isDialog ? (
              <Button
                variant="contained"
                sx={{ width: '100%', fontWeight: 700 }}
                onClick={handleClickOpen}
              >
                {dictionary.goToProfile}
              </Button>
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
      <UserCardDialog open={open} handleClose={handleClose} />
    </div>
  )
}

export default UserCard
