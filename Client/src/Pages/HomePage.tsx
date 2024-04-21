import '../Style/scss/HomePage.scss'
import CategoriesCarousel from '../Components/CategoriesCarousel'
import { useDictionaryContext } from '../Context/DictionaryContext'
import logo from '../Assets/icon-cut-green.png'
import houseIcon from '../Assets/house.png'
import houseSecondIcon from '../Assets/house-second.png'
import { Button } from '@mui/material'
import HomePageTimeline from '../Components/HomePageTimeline'

const HomePage = () => {
  const verifiedContractorsCount: number = 8836

  const { dictionary } = useDictionaryContext()

  return (
    <div className="HomePage">
      <div className="home-page-main-wrapper">
        <div className="home-page-main-left">
          <div className="home-page-main-left-title-wrapper">
            <img src={logo} className="home-page-main-left-title-icon"></img>
            <p className="home-page-main-left-title">
              {dictionary.homeServicesPlatform}
            </p>
          </div>
          <h1 className="home-page-main-left-heading">
            {dictionary.findTheConstuctorYouNeed}
          </h1>
          <div className="home-page-main-left-text">
            <div className="home-page-main-left-constructors-count-wrapper">
              <p className="home-page-main-left-constructors-count-standard">
                {dictionary.overWord}&nbsp;
              </p>
              <p className="home-page-main-left-constructors-count-green">
                {verifiedContractorsCount}&nbsp;
              </p>
              <p className="home-page-main-left-constructors-count-standard">
                {dictionary.homePageIntro}
              </p>
            </div>
            <p className="home-page-main-left-text-find">
              {dictionary.homePageIntroCont}
            </p>
          </div>
          <Button variant="contained" className="search-button">
            {dictionary.searchWord}
          </Button>
        </div>
        <div className="home-page-main-right">
          <img src={houseIcon} alt="homeo" className="home-page-house-img" />
        </div>
      </div>
      <div className="home-page-timeline-wrapper">
        <img
          src={houseSecondIcon}
          alt="homeo"
          className="home-page-house-img"
        />
        <div className="home-page-timeline">
          <h1 className="home-page-timeline-headline">
            {dictionary.HomePageInstruction}:
          </h1>
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
