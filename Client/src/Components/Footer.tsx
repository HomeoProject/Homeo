import '../Style/scss/Footer.scss'
import Logo from '../Assets/icon-cut.png'

const Footer = () => {
  return (
    <div className="Footer">
      <div className="footer-main">
        <div className="footer-logo-wrapper">
          <img src={Logo} alt="Logo" className="footer-logo-img" />
          <b className="footer-logo-text">Homeo</b>
        </div>
        <div className="footer-text-wrapper">
          <p className="footer-text">
            ©2024 Homeo &nbsp;&nbsp;|&nbsp;&nbsp; All rights reserved
          </p>
        </div>
      </div>
    </div>
  )
}

export default Footer
