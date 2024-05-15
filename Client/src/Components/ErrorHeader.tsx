import '../style/scss/Header.scss'
import { Link } from 'react-router-dom'
import homeIcon from '../Assets/icon-cut.png'

const ErrorHeader = () => {
  return (
    <div className="Header">
      <div className="header-main">
        <Link className="header-logo" to="/">
          <img src={homeIcon} alt="logo" />
          Homeo
        </Link>
      </div>
    </div>
  )
}

export default ErrorHeader
