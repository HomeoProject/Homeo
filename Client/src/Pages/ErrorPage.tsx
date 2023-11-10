import logo from '../Assets/logoSmall.png'
import '../style/scss/ErrorPage.scss'

const ErrorPage = () => {
    return (
        <div className="error-page">
            <img className="error-page-logo" src={logo} alt="logo" />
            <span className="error-page-oops">Oops!</span>
            <span className="error-page-message">We are so sorry!</span>
            <span className="error-page-message">
                An unexpected error occured!
            </span>
            <span className="error-page-not-found">Page not found</span>
        </div>
    )
}

export default ErrorPage
