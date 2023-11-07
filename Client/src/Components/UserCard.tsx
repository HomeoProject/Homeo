import { useState } from 'react'
import Karol from '../assets/Karol.jpg'
import UserCardDialog from './UserCardDialog'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import PublicIcon from '@mui/icons-material/Public'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import SmartphoneIcon from '@mui/icons-material/Smartphone'
import '../style/scss/components/UserCard.scss'

const UserCard = ({ isDialog }) => {
    const [open, setOpen] = useState(false)

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
                <img src={Karol} alt="avatar" />
            </div>
            <Card sx={{ padding: '15px' }}>
                <div className="user-card-container">
                    <div className="user-card-container-user-section">
                        <span className="user-card-container-user-section-name">
                            Darek
                        </span>
                        <span className="user-card-container-user-section-title">
                            Plumber
                        </span>
                    </div>
                    <div className="user-card-container-info-section">
                        <div className="user-card-container-info-section-row">
                            <SmartphoneIcon />
                            <span className="user-card-container-info-section-row-value">
                                501 474 375
                            </span>
                        </div>
                        <div className="user-card-container-info-section-row">
                            <PublicIcon />
                            <span className="user-card-container-info-section-row-value">
                                Pomorskie, Poland
                            </span>
                        </div>
                        <div className="user-card-container-info-section-row">
                            <MailOutlineIcon />
                            <span className="user-card-container-info-section-row-value">
                                darek@gmail.com
                            </span>
                        </div>
                        <div className="user-card-container-info-section-row">
                            <AttachMoneyIcon />
                            <span className="user-card-container-info-section-row-value">
                                40-50 zł/h
                            </span>
                        </div>
                        <div className="user-card-container-info-section-row">
                            <StarOutlineIcon />
                            <span className="user-card-container-info-section-row-value">
                                4.5
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
                                Go to profile
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                sx={{ width: '100%', fontWeight: 700 }}
                                onClick={handleClickOpen}
                            >
                                More
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
