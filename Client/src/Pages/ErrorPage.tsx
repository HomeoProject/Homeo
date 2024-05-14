import icon from '../Assets/icon-green.png'
import '../style/scss/ErrorPage.scss'
import { Button } from '@mui/material'
import BackIcon from '@mui/icons-material/KeyboardBackspace'
import { useDictionaryContext } from '../Context/DictionaryContext'

type ErrorPageProps = {
  error?: string
}

const ErrorPage = ({ error }: ErrorPageProps) => {
  const goBack = () => {
    window.history.back()
  }

  const { dictionary } = useDictionaryContext()

  return (
    <div className="ErrorPage">
      <div className="error-page-container">
        <img className="error-page-logo" src={icon} alt="logo" />
        <span className="error-page-oops">{dictionary.oops || 'Oops!'}</span>
        <span className="error-page-message">
          {dictionary.errorSorry || 'We are so sorry,'}
        </span>
        <span className="error-page-message">
          {dictionary.errorOccur || 'An unexpected error occured'}
        </span>
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
          {dictionary.goBackButton || 'Go back'}
        </Button>
      </div>
    </div>
  )
}

export default ErrorPage
