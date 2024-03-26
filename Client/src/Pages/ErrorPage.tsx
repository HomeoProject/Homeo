import icon from '../Assets/icon-green.png'
import '../style/scss/ErrorPage.scss'
import ErrorImg from '../Assets/error.png'
import { Button } from '@mui/material'
import BackIcon from '@mui/icons-material/KeyboardBackspace'

type ErrorPageProps = {
  error?: string
}

const ErrorPage = ({ error }: ErrorPageProps) => {
  const goBack = () => {
    window.history.back()
  }

  return (
    <div className="ErrorPage">
      <div className="error-page-container">
        <img className="error-page-logo" src={icon} alt="logo" />
        <span className="error-page-oops">Oops!</span>
        <span className="error-page-message">We are so sorry,</span>
        <span className="error-page-message">An unexpected error occured</span>
        <span className="error-page-message-details">
          {error || 'Page not found'}
        </span>
        <Button
          onClick={goBack}
          variant="contained"
          color="primary"
          sx={{
            marginTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            zIndex: 1,
          }}
        >
          <BackIcon />
          Go back
        </Button>
      </div>
      <img src={ErrorImg} alt="error" className="error-page-img" />
    </div>
  )
}

export default ErrorPage
