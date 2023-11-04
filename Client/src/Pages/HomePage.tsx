import '../Style/scss/HomePage.scss'
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded'
import GrassRoundedIcon from '@mui/icons-material/GrassRounded'
import HomePageTimeline from '../Components/HomePageTimeline'
import SearchIcon from '@mui/icons-material/Search'
// import ContractorImg from '../Assets/contractor.jpg'
// import LawnMowerImg from '../Assets/lawnMower.jpg'

const HomePage = () => {
    const verifiedContractorsCount: number = 8836

    return (
        <div className="HomePage">
            <div className="home-page-top-banner"></div>
            <div className="home-page-main-wrapper">
                <div className="home-page-main">
                    <p className="home-page-main-title">
                        Contractors never had so many forms.
                    </p>
                    <div className="home-page-main-search-wrapper">
                        <input
                            className="home-page-main-search"
                            type="text"
                            placeholder="Search for a service you need..."
                        />
                        <button className="home-page-main-search-button">
                            <SearchIcon />
                        </button>
                    </div>
                    <div className="home-page-main-intro">
                        <div className="home-page-main-intro-sub">
                            <div className="home-page-main-intro-sub-special">
                                <b>Over {verifiedContractorsCount} verified</b>
                                <b className="title-green">&nbsp;Homeo&nbsp;</b>
                                <b>contractors</b>
                            </div>
                            <p>Find the one that fits you</p>
                        </div>
                        <ConstructionRoundedIcon className="home-page-main-intro-icon" />
                    </div>
                    <div className="home-page-main-intro">
                        <div className="home-page-main-intro-sub">
                            <b>No need for a professional?</b>
                            <p>Check out other people's adverts</p>
                        </div>
                        <GrassRoundedIcon className="home-page-main-intro-icon" />
                    </div>
                </div>
                <div className="home-page-instruction">
                    <HomePageTimeline />
                </div>
            </div>
            <div className="home-page-carousel"></div>
        </div>
    )
}

export default HomePage
