import '../Style/scss/HomePage.scss'
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded'
import GrassRoundedIcon from '@mui/icons-material/GrassRounded'
import HomePageTimeline from '../Components/HomePageTimeline'

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
                    <div className="home-page-main-intro">
                        <div className="home-page-main-intro-sub">
                            <b>
                                Over {verifiedContractorsCount} verified Homeo
                                contractors
                            </b>
                            <p>Find the one that fits you and your ideas.</p>
                        </div>
                        <ConstructionRoundedIcon
                            style={{
                                width: '40px',
                                height: '40px',
                                border: '1px solid black',
                                padding: '10px',
                                borderRadius: '50%',
                            }}
                        />
                    </div>
                    <div className="home-page-main-intro">
                        <div className="home-page-main-intro-sub">
                            <b>No need for a professional?</b>
                            <p>Check out other people's adverts.</p>
                        </div>
                        <GrassRoundedIcon
                            style={{
                                width: '40px',
                                height: '40px',
                                border: '1px solid black',
                                padding: '10px',
                                borderRadius: '50%',
                            }}
                        />
                    </div>
                </div>
                <div className="home-page-instruction">
                    <HomePageTimeline />
                </div>
            </div>
        </div>
    )
}

export default HomePage
