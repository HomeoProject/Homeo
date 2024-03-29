import '../Style/scss/HomePage.scss'
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded'
import GrassRoundedIcon from '@mui/icons-material/GrassRounded'
import HomePageTimeline from '../Components/HomePageTimeline'
import SearchIcon from '@mui/icons-material/Search'
import CategoriesCarousel from '../Components/CategoriesCarousel'
import { useDictionaryContext } from '../Context/DictionaryContext'

const HomePage = () => {
  const verifiedContractorsCount: number = 8836

  const { dictionary } = useDictionaryContext()

  return (
    <div className="HomePage">
      <div className="home-page-top-banner"></div>
      <div className="home-page-main-wrapper">
        <div className="home-page-main">
          <p className="home-page-main-title">{dictionary.homePageTitle}</p>
          <div className="home-page-main-search-wrapper">
            <input
              className="home-page-main-search"
              type="text"
              placeholder={dictionary.homePageSearchPlaceholder}
            />
            <button className="home-page-main-search-button">
              <SearchIcon />
            </button>
          </div>
          <div className="home-page-main-intro">
            <div className="home-page-main-intro-sub">
              <b>
                {dictionary.over} {verifiedContractorsCount}{' '}
                {dictionary.homePageIntro}
              </b>
              <p>{dictionary.homePageIntroCont}</p>
            </div>
            <ConstructionRoundedIcon className="home-page-main-intro-icon" />
          </div>
          <div className="home-page-main-intro">
            <div className="home-page-main-intro-sub">
              <b>{dictionary.homePageIntroBot}</b>
              <p>{dictionary.HomePageIntroBotCont}</p>
            </div>
            <GrassRoundedIcon className="home-page-main-intro-icon" />
          </div>
        </div>
        <div className="home-page-instruction">
          <p className="home-page-instruction-title">
            {dictionary.HomePageInstruction}:
          </p>
          <HomePageTimeline />
        </div>
      </div>
      <div className="home-page-carousel">
        <CategoriesCarousel />
      </div>
    </div>
  )
}

export default HomePage
