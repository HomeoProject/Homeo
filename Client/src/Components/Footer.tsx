import '../style/scss/Footer.scss'
import Logo from '../Assets/icon-cut.png'
import { useDictionaryContext } from '../Context/DictionaryContext'

const Footer = () => {
  const { dictionary } = useDictionaryContext()

  const year = new Date().getFullYear()

  return (
    <div className="Footer">
      <div className="footer-main">
        <div className="footer-logo-wrapper">
          <img src={Logo} alt="Logo" className="footer-logo-img" />
          <b className="footer-logo-text">Homeo</b>
        </div>
        <div className="footer-text-wrapper">
          <p className="footer-text">
            ©{year} Homeo &nbsp;&nbsp;|&nbsp;&nbsp; {dictionary.rightsReserved}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Footer
