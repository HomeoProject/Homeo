import icon from '../Assets/icon-green.png'
import '../style/scss/ErrorPage.scss'
import ErrorImg from '../Assets/error.png'

type ErrorPageProps = {
  error?: string
}

const ErrorPage = ({ error }: ErrorPageProps) => {
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
      </div>
      <img src={ErrorImg} alt="error" className="error-page-img" />
    </div>
  )
}

export default ErrorPage
